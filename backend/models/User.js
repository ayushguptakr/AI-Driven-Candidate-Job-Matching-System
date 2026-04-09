const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['recruiter', 'candidate'], required: true },
  phone: { type: String },
  bio: { type: String },
  location: { type: String },
  company: { type: String }, // For candidates (text field)
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // For recruiters (reference)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

