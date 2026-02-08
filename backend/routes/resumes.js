const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, DOC, DOCX allowed'));
    }
  }
});

// Get all resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload resume
router.post('/upload', upload.single('resume'), async (req, res) => {
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
        content = req.file.buffer.toString();
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      content = 'Unable to parse file content';
    }
    
    const resume = new Resume({
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