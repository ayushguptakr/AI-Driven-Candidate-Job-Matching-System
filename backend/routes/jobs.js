const express = require('express');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Match = require('../models/Match');
const { analyzeMatch } = require('../services/claudeService');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get matches for a job
router.get('/:jobId/matches', async (req, res) => {
  try {
    const matches = await Match.find({ jobId: req.params.jobId })
      .populate('resumeId')
      .sort({ score: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Match job with all resumes
router.post('/:jobId/match', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    const resumes = await Resume.find();
    
    const matches = [];
    for (const resume of resumes) {
      const analysis = await analyzeMatch(
        `${job.title} ${job.description} ${job.requirements}`,
        resume.content
      );
      
      const match = new Match({
        jobId: job._id,
        resumeId: resume._id,
        score: analysis.score,
        matchingSkills: analysis.matchingSkills
      });
      
      await match.save();
      matches.push(match);
    }
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;