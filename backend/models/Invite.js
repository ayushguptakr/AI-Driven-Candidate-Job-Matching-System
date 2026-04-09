const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  role: { type: String, enum: ['recruiter', 'admin'], default: 'recruiter' },
  token: { type: String, required: true, unique: true }, // Store hashed token
  status: { type: String, enum: ['pending', 'accepted', 'expired'], default: 'pending' },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Invite', inviteSchema);
