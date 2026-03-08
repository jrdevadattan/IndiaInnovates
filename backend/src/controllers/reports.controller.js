const Report = require('../models/Report');
const Ngo = require('../models/Ngo');
const Reward = require('../models/Reward');
const { uploadToCloudinary } = require('../middleware/upload.middleware');
const { analyzeReport } = require('../services/ai.service');
const { assignNgo } = require('../services/geo.service');
const { getSlaDeadline } = require('../utils/helpers');
const { sendNotificationToUser, sendNgoNotification } = require('../services/notification.service');
const { addPoints } = require('../services/rewards.service');

exports.createReport = async (req, res) => {
  try {
    const { title, description, category, location, isAnonymous } = req.body;
    const locationData = typeof location === 'string' ? JSON.parse(location) : location;

    if (!title || !description || !category || !locationData?.coordinates) {
      return res.status(400).json({ success: false, message: 'title, description, category, and location.coordinates are required.' });
    }

    // Upload media
    const media = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'lifeline/reports', file.mimetype.startsWith('video') ? 'video' : 'image');
        media.push({ url: result.secure_url, type: file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE', cloudinaryId: result.public_id });
      }
    }

    const report = await Report.create({
      reporterId: req.user?._id || null,
      isAnonymous: isAnonymous || !req.user,
      category,
      title,
      description,
      media,
      location: {
        type: 'Point',
        coordinates: locationData.coordinates,
        address: locationData.address,
        city: locationData.city,
        state: locationData.state
      }
    });

    // AI Analysis (async, non-blocking)
    analyzeReport(report).then(async (analysis) => {
      report.aiAnalysis = analysis;
      report.status = 'AI_VERIFIED';

      // Set SLA deadline
      const deadline = getSlaDeadline(analysis.severity);
      report.slaDeadline = deadline;

      // Assign best NGO
      const assignedNgo = await assignNgo(report);
      if (assignedNgo) {
        report.assignedNgoId = assignedNgo._id;
        report.status = 'ASSIGNED';
        await sendNgoNotification(assignedNgo._id, report);
      }

      await report.save();

      // Award points to reporter
      if (req.user) {
        await addPoints(req.user._id, 10, 'Report submitted and verified', report._id.toString());
      }
    }).catch(err => console.error('AI analysis error:', err.message));

    res.status(201).json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { category, status, severity, city, page = 1, limit = 20, sort = 'newest' } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (severity) query['aiAnalysis.severity'] = severity;
    if (city) query['location.city'] = new RegExp(city, 'i');

    const sortObj = sort === 'popular' ? { upvotes: -1 } : { createdAt: -1 };

    const [reports, total] = await Promise.all([
      Report.find(query)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('reporterId', 'name profilePicture')
        .populate('assignedNgoId', 'name')
        .lean(),
      Report.countDocuments(query)
    ]);

    res.json({ success: true, reports, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporterId', 'name profilePicture')
      .populate('assignedNgoId', 'name logo')
      .populate('assignedVolunteerId', 'name profilePicture')
      .populate('comments.userId', 'name profilePicture');

    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    report.status = status;
    if (notes) report.resolutionNotes = notes;
    if (status === 'RESOLVED') report.resolvedAt = new Date();
    await report.save();

    // Notify reporter
    if (report.reporterId) {
      await sendNotificationToUser(report.reporterId, 'REPORT_STATUS', 'Report Update', `Your report "${report.title}" is now ${status}.`, { reportId: report._id });
    }

    // Award points on resolution
    if (status === 'RESOLVED' && report.reporterId) {
      await addPoints(report.reporterId, 15, 'Report resolved', report._id.toString());
    }

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.upvote = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    const userId = req.user._id;
    const alreadyUpvoted = report.upvotedBy.some(id => id.toString() === userId.toString());

    if (alreadyUpvoted) {
      report.upvotes = Math.max(0, report.upvotes - 1);
      report.upvotedBy = report.upvotedBy.filter(id => id.toString() !== userId.toString());
    } else {
      report.upvotes += 1;
      report.upvotedBy.push(userId);
      // Award points when report hits 10 upvotes
      if (report.upvotes === 10 && report.reporterId) {
        await addPoints(report.reporterId, 30, 'Report reached 10 upvotes', report._id.toString());
      }
    }

    await report.save();
    res.json({ success: true, upvotes: report.upvotes, upvoted: !alreadyUpvoted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Comment text required.' });

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    report.comments.push({ userId: req.user._id, text: text.trim() });
    await report.save();
    await report.populate('comments.userId', 'name profilePicture');

    res.json({ success: true, comments: report.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resolveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    const proofs = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'lifeline/resolution', file.mimetype.startsWith('video') ? 'video' : 'image');
        proofs.push({ url: result.secure_url, type: file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE' });
      }
    }

    report.status = 'RESOLVED';
    report.resolutionNotes = req.body.notes;
    report.resolutionProof = proofs;
    report.resolvedAt = new Date();
    await report.save();

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNearbyReports = async (req, res) => {
  try {
    const { lng, lat, radius = 5000 } = req.query;
    if (!lng || !lat) return res.status(400).json({ success: false, message: 'lng and lat required.' });

    const reports = await Report.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: Number(radius)
        }
      },
      status: { $nin: ['RESOLVED', 'CLOSED', 'REJECTED'] }
    }).limit(50).populate('assignedNgoId', 'name');

    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporterId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('assignedNgoId', 'name');
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
