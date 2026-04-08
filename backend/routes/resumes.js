const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Only accept PDF and TXT — DOC/DOCX cannot be reliably parsed without
    // additional libraries (they are ZIP-based binary formats).
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and TXT files are allowed.'));
    }
  }
});

// Get resumes for the current candidate (user-isolated)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Candidates see only their own resumes; recruiters can see all (for matching)
    const filter = req.user.role === 'candidate'
      ? { userId: req.user.userId }
      : {};

    const [resumes, total] = await Promise.all([
      Resume.find(filter).sort({ uploadedAt: -1 }).skip(skip).limit(limit),
      Resume.countDocuments(filter)
    ]);

    res.json({
      resumes,
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

// Upload resume (Candidate only)
router.post('/upload', auth, checkRole('candidate'), upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    let content = '';
    
    try {
      if (req.file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        content = pdfData.text;
      } else {
        // text/plain — safe to convert buffer to string
        content = req.file.buffer.toString('utf8');
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      content = 'Unable to parse file content';
    }
    
    const resume = new Resume({
      userId: req.user.userId,
      candidateName: req.body.candidateName,
      email: req.body.email,
      phone: req.body.phone,
      content,
      fileName: req.file.originalname,
      skills: req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : [],
      experience: req.body.experience || '',
      education: req.body.education || ''
    });
    
    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;