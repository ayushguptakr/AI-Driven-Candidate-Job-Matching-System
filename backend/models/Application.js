const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], 
    default: 'pending' 
  },
  appliedAt: { type: Date, default: Date.now }
});

// Prevent duplicate applications for the same job by the same user
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
