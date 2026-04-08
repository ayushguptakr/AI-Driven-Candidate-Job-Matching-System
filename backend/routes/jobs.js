const express = require('express');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Match = require('../models/Match');
const { analyzeMatch } = require('../services/groqService');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (with pagination and search)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [jobs, total] = await Promise.all([
      Job.find(filter).populate('postedBy', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(filter)
    ]);

    res.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new job (Recruiter only) — automatically tied to authenticated user
router.post('/', auth, checkRole('recruiter'), async (req, res) => {
  try {
    const { title, company, description, requirements, eligibility, location, salary } = req.body;
    const job = new Job({
      title,
      company,
      description,
      requirements,
      eligibility,
      location,
      salary,
      postedBy: req.user.userId  // Auto-set from authenticated user
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get matches for a job (Recruiter only)
router.get('/:jobId/matches', auth, checkRole('recruiter'), async (req, res) => {
  try {
    const matches = await Match.find({ jobId: req.params.jobId })
      .populate('resumeId')
      .sort({ score: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Match job with all resumes (Recruiter only) — sequential with rate-limit pacing
router.post('/:jobId/match', auth, checkRole('recruiter'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const resumes = await Resume.find();
    if (resumes.length === 0) {
      return res.status(400).json({ error: 'No resumes available for matching' });
    }

    // Delete previous matches for this job to avoid duplicates
    await Match.deleteMany({ jobId: job._id });
    
    // Process resumes sequentially with delay to respect Gemini rate limits
    const matches = [];
    for (let i = 0; i < resumes.length; i++) {
      try {
        const analysis = await analyzeMatch(
          `${job.title} ${job.description} ${job.requirements}`,
          resumes[i].content
        );
        
        const match = new Match({
          jobId: job._id,
          resumeId: resumes[i]._id,
          score: analysis.score,
          matchingSkills: analysis.matchingSkills,
          missingSkills: analysis.missingSkills
        });
        
        await match.save();
        matches.push(match);
        
        // Pace requests: wait 2s between calls to stay under free-tier rate limit
        if (i < resumes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err) {
        console.error(`Match failed for resume ${resumes[i]._id}:`, err.message);
        // Continue with next resume instead of failing the whole batch
      }
    }
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;