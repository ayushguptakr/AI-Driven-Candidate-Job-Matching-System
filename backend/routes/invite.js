const express = require('express');
const crypto = require('crypto');
const Invite = require('../models/Invite');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// Generate an invite link (Recruiter/Admin only)
router.post('/', auth, checkRole('recruiter', 'admin'), async (req, res) => {
  try {
    const { email, role = 'recruiter' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Role verification: only allow recruiters/admins to invite
    // (auth middleware + checkRole already covered this, but verify company context)
    if (!req.user.companyId) {
      return res.status(403).json({ error: 'You are not associated with a company workspace' });
    }

    // Prevent duplicate pending invites
    const existingInvite = await Invite.findOne({
      email,
      companyId: req.user.companyId,
      status: 'pending'
    });

    if (existingInvite) {
      // Return expired status if applicable, otherwise block
      if (existingInvite.expiresAt < Date.now()) {
        existingInvite.status = 'expired';
        await existingInvite.save();
      } else {
        return res.status(400).json({ error: 'An active invite has already been sent to this email' });
      }
    }

    // Generate secure token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

    const invite = new Invite({
      email,
      companyId: req.user.companyId,
      role,
      token: hashedToken,
      expiresAt,
      invitedBy: req.user.userId
    });

    await invite.save();

    // In a real application, send an email here using nodemailer
    // For now, return the token for dev mode
    res.status(201).json({
      message: 'Invite generated successfully',
      inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite/${rawToken}`,
      rawToken // For frontend payload
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate an invite token
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the raw token from the URL to look it up in the DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const invite = await Invite.findOne({ token: hashedToken }).populate('companyId', 'name');

    if (!invite) {
      return res.status(404).json({ error: 'Invalid invite link' });
    }

    if (invite.expiresAt < Date.now()) {
      if (invite.status !== 'expired') {
        invite.status = 'expired';
        await invite.save();
      }
      return res.status(400).json({ error: 'This invite link has expired' });
    }

    if (invite.status !== 'pending') {
      return res.status(400).json({ error: `This invite has already been ${invite.status}` });
    }

    res.json({
      email: invite.email,
      company: invite.companyId,
      role: invite.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
