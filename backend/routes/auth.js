const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, getJwtSecret } = require('../middleware/auth');

const router = express.Router();

const crypto = require('crypto');
const Company = require('../models/Company');
const Invite = require('../models/Invite');

// Signup with Invite
router.post('/signup-with-invite', async (req, res) => {
  try {
    const { token, name, password } = req.body;

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const invite = await Invite.findOne({ token: hashedToken });

    if (!invite || invite.status !== 'pending' || invite.expiresAt < Date.now()) {
      if (invite && invite.expiresAt < Date.now() && invite.status !== 'expired') {
        invite.status = 'expired';
        await invite.save();
      }
      return res.status(400).json({ error: 'Invalid or expired invite' });
    }

    const existingUser = await User.findOne({ email: invite.email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists. Please login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email: invite.email,
      password: hashedPassword,
      name,
      role: invite.role,
      companyId: invite.companyId
    });

    await user.save();

    invite.status = 'accepted';
    await invite.save();

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, companyId: user.companyId },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(201).json({ token: jwtToken, user: { id: user._id, email: user.email, name, role: user.role, companyId: user.companyId } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, companyName } = req.body;
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (role === 'recruiter' && !companyName) {
      return res.status(400).json({ error: 'Company name is required for recruiters' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    let userCompanyId = null;
    if (role === 'recruiter') {
      let company = await Company.findOne({ name: { $regex: new RegExp(`^${companyName}$`, 'i') } });
      if (!company) {
        company = new Company({ name: companyName });
        await company.save();
      }
      userCompanyId = company._id;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name, role, companyId: userCompanyId });
    await user.save();
    
    // Update company createdBy if it's new
    if (role === 'recruiter' && userCompanyId) {
      await Company.updateOne({ _id: userCompanyId, createdBy: { $exists: false } }, { $set: { createdBy: user._id } });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, companyId: userCompanyId },
      getJwtSecret(),
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ token, user: { id: user._id, email, name, role, companyId: userCompanyId } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, companyId: user.companyId },
      getJwtSecret(),
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role, companyId: user.companyId } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password').populate('companyId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, bio, location, company } = req.body;
    
    // Check if email is being changed and already taken
    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Note: role is intentionally excluded — users cannot change their own role.
    // Role is assigned at registration and is immutable through this endpoint.
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (company !== undefined) updateData.company = company;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
