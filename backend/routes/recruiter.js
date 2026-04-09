const express = require('express');
const Match = require('../models/Match');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Job = require('../models/Job');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

router.post('/candidate-action', auth, checkRole('recruiter'), async (req, res) => {
  try {
    const { candidateId, jobId, action } = req.body;

    if (!['shortlisted', 'rejected'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "shortlisted" or "rejected"' });
    }

    // candidateId is the Match id from the frontend AI pipeline
    const match = await Match.findById(candidateId).populate({
      path: 'resumeId',
      select: 'userId'
    }).populate('jobId', 'title');

    if (!match) {
      return res.status(404).json({ error: 'Match record not found' });
    }

    // Update Match recruiterDecision
    match.recruiterDecision = action;
    await match.save();

    const userId = match.resumeId.userId;
    const jobTitle = match.jobId.title;

    // Update or Create Application
    let application = await Application.findOne({ jobId, userId });

    if (application) {
      application.status = action;
      await application.save();
    } else {
      application = new Application({
        jobId,
        userId,
        resumeId: match.resumeId._id,
        status: action,
        source: 'ai_match'
      });
      await application.save();
    }

    // Create Notification using exact requirements from user
    const title = action === 'shortlisted' ? 'Application Shortlisted' : 'Application Update';
    const message = action === 'shortlisted'
      ? `Your application for ${jobTitle} has been shortlisted 🎉`
      : `Your application for ${jobTitle} was not selected this time.`;

    const notification = new Notification({
      userId,
      title,
      message,
      read: false
    });
    await notification.save();

    res.json({ message: 'Candidate status updated successfully', application, match });
  } catch (error) {
    console.error('Candidate action error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
