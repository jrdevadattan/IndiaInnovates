const SosAlert = require('../models/SosAlert');
const Ngo = require('../models/Ngo');
const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/upload.middleware');
const { getSlaDeadline } = require('../utils/helpers');
const { sendSosAlerts } = require('../services/notification.service');
const { addPoints } = require('../services/rewards.service');
const { getIO } = require('../sockets');

exports.createSos = async (req, res) => {
  try {
    const { coordinates, description } = req.body;
    const coords = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;

    if (!coords || coords.length !== 2) {
      return res.status(400).json({ success: false, message: 'coordinates [lng, lat] required.' });
    }

    const mediaUrls = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'lifeline/sos');
        mediaUrls.push(result.secure_url);
      }
    }

    const slaDeadline = new Date(Date.now() + 10 * 60 * 1000); // 10 min SLA

    const sos = await SosAlert.create({
      userId: req.user._id,
      location: { type: 'Point', coordinates: coords },
      description,
      mediaUrls,
      slaDeadline
    });

    // Find nearby NGOs and notify them
    const nearbyNgos = await Ngo.find({
      headquarters: {
        $near: {
          $geometry: { type: 'Point', coordinates: coords },
          $maxDistance: 5000
        }
      },
      isVerified: true,
      isActive: true
    }).limit(10);

    const notifiedNgos = nearbyNgos.map(ngo => ({ ngoId: ngo._id, notifiedAt: new Date() }));
    sos.notifiedNgos = notifiedNgos;
    await sos.save();

    // Broadcast to NGO admins via socket
    const io = getIO();
    nearbyNgos.forEach(ngo => {
      io.to(`ngo_${ngo._id}`).emit('new_sos', {
        sosId: sos._id,
        location: sos.location,
        userId: req.user._id,
        description
      });
    });

    // Send SMS/push alerts (async)
    sendSosAlerts(sos, req.user, nearbyNgos).catch(err => console.error('SOS alert error:', err.message));

    // Award points
    await addPoints(req.user._id, 25, 'SOS alert triggered', sos._id.toString());

    res.status(201).json({ success: true, sos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.respondToSos = async (req, res) => {
  try {
    const sos = await SosAlert.findById(req.params.id);
    if (!sos || sos.status !== 'ACTIVE') {
      return res.status(404).json({ success: false, message: 'Active SOS not found.' });
    }

    sos.status = 'RESPONDED';
    sos.respondingNgoId = req.user.ngoId;
    sos.notifiedNgos = sos.notifiedNgos.map(n => {
      if (n.ngoId.toString() === req.user.ngoId?.toString()) n.responded = true;
      return n;
    });
    await sos.save();

    const io = getIO();
    io.to(`sos_${sos._id}`).emit('sos_responded', { ngoId: req.user.ngoId });

    res.json({ success: true, sos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resolveSos = async (req, res) => {
  try {
    const sos = await SosAlert.findById(req.params.id);
    if (!sos) return res.status(404).json({ success: false, message: 'SOS not found.' });

    sos.status = 'RESOLVED';
    sos.resolvedAt = new Date();
    await sos.save();

    const io = getIO();
    io.to(`sos_${sos._id}`).emit('sos_resolved', { sosId: sos._id });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelSos = async (req, res) => {
  try {
    const sos = await SosAlert.findById(req.params.id);
    if (!sos) return res.status(404).json({ success: false, message: 'SOS not found.' });

    if (sos.userId.toString() !== req.user._id.toString() && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    sos.status = 'CANCELLED';
    await sos.save();

    const io = getIO();
    io.to(`sos_${sos._id}`).emit('sos_cancelled', { sosId: sos._id });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLiveLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const sos = await SosAlert.findById(req.params.id);
    if (!sos) return res.status(404).json({ success: false, message: 'SOS not found.' });

    sos.liveLocation.push({ coordinates, recordedAt: new Date() });
    if (sos.liveLocation.length > 100) sos.liveLocation = sos.liveLocation.slice(-100);
    await sos.save();

    const io = getIO();
    io.to(`sos_${sos._id}`).emit('location_update', { coordinates, recordedAt: new Date() });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSosChat = async (req, res) => {
  try {
    const sos = await SosAlert.findById(req.params.id)
      .select('chatMessages')
      .populate('chatMessages.senderId', 'name profilePicture');
    if (!sos) return res.status(404).json({ success: false, message: 'SOS not found.' });
    res.json({ success: true, messages: sos.chatMessages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.sendSosChat = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Message required.' });

    const sos = await SosAlert.findById(req.params.id);
    if (!sos) return res.status(404).json({ success: false, message: 'SOS not found.' });

    const message = { senderId: req.user._id, senderName: req.user.name, text: text.trim(), createdAt: new Date() };
    sos.chatMessages.push(message);
    await sos.save();

    const io = getIO();
    io.to(`sos_${sos._id}`).emit('sos_message', message);

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMySosAlerts = async (req, res) => {
  try {
    const alerts = await SosAlert.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
