const express = require('express');
const Company = require('../models/Company');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// Update company details (accessible only to recruiters who own the company)
router.put('/update', auth, checkRole('recruiter'), async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(400).json({ error: 'User is not associated with any company' });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Optional: Add ownership validation (currently all recruiters can update the company name, or just the creator)
    // The user requirement specified "editable if owner", but let's implement the safest:
    // Only the creator or admin can change the name.
    if (company.createdBy && company.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the creator of the company workspace can update its details' });
    }

    company.name = name.trim();
    await company.save();

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
