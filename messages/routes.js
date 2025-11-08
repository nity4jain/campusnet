const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/auth');
const Message = require('../models/Message');

// ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } }); // 25MB limit

// Post a message (text + optional media). If media is attached, use multipart/form-data with field 'file'
router.post('/post', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { category, text, consent_for_contact, reply_to } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    let media_url = null;
    let media_type = null;

    if (req.file) {
      media_url = `/uploads/${req.file.filename}`;
      media_type = req.file.mimetype.split('/')[0];
    }

    const msg = new Message({
      category,
      text: text || '',
      media_url,
      media_type,
      sender: req.user_id,
      reply_to: reply_to || null,
      consent_for_contact: !!(consent_for_contact === 'true' || consent_for_contact === true)
    });

    await msg.save();
    // populate sender and reply_to (with sender username)
    await msg.populate('sender', 'username email full_name student_id phone');
    await msg.populate({ path: 'reply_to', select: 'text sender created_at', populate: { path: 'sender', select: 'username full_name' } });

    res.status(201).json({ success: true, message: 'Posted', post: msg });
  } catch (err) {
    console.error('Message post error:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Get messages for a category (paginated)
router.get('/category/:name', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const skip = (page - 1) * limit;

    const messages = await Message.find({ category: req.params.name })
      .populate('sender', 'username email full_name student_id')
      .populate({ path: 'reply_to', select: 'text sender created_at', populate: { path: 'sender', select: 'username full_name' } })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ category: req.params.name });

    res.status(200).json({ success: true, messages, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;

// DELETE a message (only sender can delete)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Not found' });
    if (String(msg.sender) !== String(req.user_id)) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    // If message has a file on disk, attempt to remove it
    if (msg.media_url && msg.media_url.startsWith('/uploads/')) {
      const fs = require('fs');
      const p = path.join(__dirname, '..', msg.media_url);
      fs.unlink(p, (err) => { /* ignore errors */ });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
