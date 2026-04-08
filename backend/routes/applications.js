const express = require('express');
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// Apply to a job (Candidate only)
router.post('/', auth, checkRole('candidate'), async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    // Find the candidate's latest resume
    const resume = await Resume.findOne({ email: req.user.email }).sort({ uploadedAt: -1 });

    const application = new Application({
      jobId,
      userId: req.user.userId,
      resumeId: resume ? resume._id : undefined
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    // Handle duplicate application (unique index violation)
    if (error.code === 11000) {
      return res.status(409).json({ error: 'You have already applied to this job' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Get my applications (Candidate only)
router.get('/me', auth, checkRole('candidate'), async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.userId })
      .populate('jobId')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get applications for a specific job (Recruiter only)
router.get('/job/:jobId', auth, checkRole('recruiter'), async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email')
      .populate('resumeId')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status (Recruiter only)
router.put('/:id/status', auth, checkRole('recruiter'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
