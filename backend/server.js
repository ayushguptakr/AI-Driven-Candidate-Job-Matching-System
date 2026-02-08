require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: 'https://ai-driven-candidate-job-matching-system-1.onrender.com',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/resumes', require('./routes/resumes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});