const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., 'sharing', 'papers', 'hostel-issues'
  text: { type: String, default: '' },
  media_url: { type: String, default: null },
  media_type: { type: String, default: null }, // image/audio/video
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reply_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  consent_for_contact: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
