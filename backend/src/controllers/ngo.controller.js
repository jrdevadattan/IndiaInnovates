const Ngo = require('../models/Ngo');
const Report = require('../models/Report');
const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/upload.middleware');

exports.registerNgo = async (req, res) => {
  try {
    const { name, email, phone, categories, description, headquarters } = req.body;
    const hq = typeof headquarters === 'string' ? JSON.parse(headquarters) : headquarters;

    const existing = await Ngo.findOne({ email: email?.toLowerCase() });
    if (existing) return res.status(409).json({ success: false, message: 'NGO email already registered.' });

    const documents = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'lifeline/ngo_docs');
        documents.push({ type: 'REGISTRATION', url: result.secure_url });
      }
    }

    const ngo = await Ngo.create({
      name,
      email: email?.toLowerCase(),
      phone,
      description,
      categories: typeof categories === 'string' ? JSON.parse(categories) : categories,
      headquarters: hq ? { ...hq, type: 'Point' } : undefined,
      documents,
      adminIds: [req.user._id]
    });

    req.user.ngoId = ngo._id;
    req.user.role = 'NGO_ADMIN';
    await req.user.save();

    res.status(201).json({ success: true, ngo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNgos = async (req, res) => {
  try {
    const { category, city, page = 1, limit = 20 } = req.query;
    const query = { isVerified: true, isActive: true };
    if (category) query.categories = category;
    if (city) query['headquarters.city'] = new RegExp(city, 'i');

    const [ngos, total] = await Promise.all([
      Ngo.find(query)
        .select('-bankDetails -adminIds')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Ngo.countDocuments(query)
    ]);

    res.json({ success: true, ngos, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNgo = async (req, res) => {
  try {
    const ngo = await Ngo.findById(req.params.id).select('-bankDetails');
    if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found.' });
    res.json({ success: true, ngo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNgoDashboard = async (req, res) => {
  try {
    const ngoId = req.params.id;

    // Verify requester is admin of this NGO
    const ngo = await Ngo.findById(ngoId);
    if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found.' });
    if (req.user.role !== 'SUPER_ADMIN' && !ngo.adminIds.some(id => id.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const [activeCases, resolvedToday, slaBreaches, allCases] = await Promise.all([
      Report.countDocuments({ assignedNgoId: ngoId, status: { $in: ['ASSIGNED', 'IN_PROGRESS'] } }),
      Report.countDocuments({
        assignedNgoId: ngoId, status: 'RESOLVED',
        resolvedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      Report.countDocuments({ assignedNgoId: ngoId, slaBreached: true }),
      Report.find({ assignedNgoId: ngoId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('reporterId', 'name')
        .populate('assignedVolunteerId', 'name')
        .lean()
    ]);

    res.json({
      success: true,
      stats: { activeCases, resolvedToday, slaBreaches, total: allCases.length },
      cases: allCases,
      ngo
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status, notes } = req.body;

    const report = await Report.findById(caseId);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    report.status = status;
    if (notes) report.resolutionNotes = notes;
    if (status === 'RESOLVED') report.resolvedAt = new Date();
    await report.save();

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.assignVolunteer = async (req, res) => {
  try {
    const { volunteerId, reportId } = req.body;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    report.assignedVolunteerId = volunteerId;
    report.status = 'IN_PROGRESS';
    await report.save();

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNearbyNgos = async (req, res) => {
  try {
    const { lng, lat, radius = 10000 } = req.query;
    if (!lng || !lat) return res.status(400).json({ success: false, message: 'lng and lat required.' });

    const ngos = await Ngo.find({
      headquarters: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: Number(radius)
        }
      },
      isVerified: true,
      isActive: true
    }).limit(20).select('-bankDetails -adminIds');

    res.json({ success: true, ngos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
