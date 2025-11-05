const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: ''
  },

  subject: {
    type: String,
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  file_url: {
    type: String,
    required: true
  },

  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  downloads: {
    type: Number,
    default: 0
  },

  tags: {
    type: [String],
    default: []
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', resourceSchema);
