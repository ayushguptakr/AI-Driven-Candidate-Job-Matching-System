const express = require('express');
const Match = require('../models/Match');
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// Get matches for the logged-in candidate
router.get('/my', auth, checkRole('candidate'), async (req, res) => {
  try {
    // Find resumes belonging to the current user
    const userResumes = await Resume.find({ userId: req.user.userId }).select('_id');
    const resumeIds = userResumes.map(r => r._id);

    if (resumeIds.length === 0) {
      return res.json([]);
    }

    // Find all matches that reference the user's resumes
    const matches = await Match.find({ resumeId: { $in: resumeIds } })
      .populate({
        path: 'jobId',
        select: 'title company location salary description requirements',
        populate: {
          path: 'company',
          select: 'name'
        }
      })
      .populate('resumeId', 'candidateName email')
      .sort({ score: -1 });

    // Find all applications by this user to check hasApplied
    const applications = await Application.find({ userId: req.user.userId }).select('jobId status');
    const appMap = {};
    applications.forEach(app => {
      appMap[app.jobId.toString()] = app.status;
    });

    // Enrich match data with hasApplied and application status
    const enriched = matches
      .filter(m => m.jobId) // skip if job was deleted
      .map(m => ({
        _id: m._id,
        jobTitle: m.jobId.title,
        companyName: m.jobId.company?.name || 'Unknown Company',
        location: m.jobId.location,
        salary: m.jobId.salary,
        jobId: m.jobId._id,
        matchScore: m.score,
        recruiterDecision: m.recruiterDecision || 'none',
        skillsMatched: m.matchingSkills || [],
        missingSkills: m.missingSkills || [],
        hasApplied: !!appMap[m.jobId._id.toString()],
        applicationStatus: appMap[m.jobId._id.toString()] || null,
        createdAt: m.createdAt
      }));

    // Sort: shortlisted first, then by score desc
    enriched.sort((a, b) => {
      const order = { shortlisted: 0, none: 1, rejected: 2 };
      const oa = order[a.recruiterDecision] ?? 1;
      const ob = order[b.recruiterDecision] ?? 1;
      if (oa !== ob) return oa - ob;
      return b.matchScore - a.matchScore;
    });

    res.json(enriched);
  } catch (error) {
    console.error('Error fetching candidate matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
