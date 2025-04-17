const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  path: {
    type: String
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'processed', 'error'],
    default: 'uploaded'
  },
  fileData: {
    type: Buffer
  },
  metadata: {
    rows: Number,
    columns: Number,
    headers: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('File', FileSchema);
