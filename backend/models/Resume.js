const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidateName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  content: { type: String, required: true },
  skills: [String],
  experience: { type: String },
  education: { type: String },
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);