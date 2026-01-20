# TalentMatch AI
# AI-Driven Candidate-Job Matching System

An intelligent job matching platform that uses Claude AI to analyze resumes and match candidates with job postings based on skills, experience, and requirements.

## Features

- **Recruiter Portal**: Post jobs, view AI-powered candidate matches with scores
- **Candidate Portal**: Upload resumes, view available jobs
- **AI Matching**: Claude API analyzes resume-job compatibility
- **Match Scoring**: 0-100% compatibility scores with highlighted matching skills
- **Real-time Results**: Instant matching results with detailed breakdowns

## Tech Stack

- **Frontend**: React.js, Bootstrap, React Router
- **Backend**: Node.js, Express.js, Multer (file upload)
- **Database**: MongoDB with Mongoose
- **AI**: Claude API for intelligent matching
- **File Processing**: PDF parsing for resume content extraction

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- Claude API key from Anthropic

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-matching
CLAUDE_API_KEY=your_claude_api_key_here
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id/matches` - Get matches for job
- `POST /api/jobs/:id/match` - Run AI matching

### Resumes
- `GET /api/resumes` - Get all resumes
- `POST /api/resumes/upload` - Upload resume with candidate info

## Demo Usage

### Sample Job Posting
```json
{
  "title": "Full Stack Developer",
  "company": "Tech Corp",
  "description": "Build modern web applications using React and Node.js",
  "requirements": "3+ years React, Node.js, MongoDB experience",
  "location": "Remote",
  "salary": "$80,000 - $120,000",
  "postedBy": "HR Manager"
}
```

### Sample Resume Upload
- Upload PDF/TXT resume files
- Fill candidate information (name, email, skills)
- System extracts text content for AI analysis

### AI Matching Process
1. Recruiter posts job with requirements
2. Candidates upload resumes
3. Click "Run AI Matching" for any job
4. Claude AI analyzes each resume against job requirements
5. Returns compatibility scores (0-100%) and matching skills
6. Results displayed in ranked table format

## Match Score Interpretation
- **80-100%**: Excellent match (Green)
- **60-79%**: Good match (Yellow)  
- **0-59%**: Poor match (Red)

## File Structure
```
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Claude AI integration
│   ├── config/          # Database configuration
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Dashboard pages
│   │   └── services/    # API calls
│   └── public/          # Static files
└── README.md
```

## Key Components

### Backend
- **Job Model**: Stores job postings with requirements
- **Resume Model**: Stores candidate resumes and extracted content
- **Match Model**: Stores AI analysis results and scores
- **Claude Service**: Handles AI-powered resume-job matching

### Frontend
- **JobForm**: Recruiter job posting interface
- **ResumeUpload**: Candidate resume submission
- **MatchResults**: AI scoring display with highlighted skills
- **Dashboards**: Separate portals for recruiters and candidates

## AI Matching Logic
The Claude API analyzes:
1. Job requirements vs resume skills
2. Experience level compatibility
3. Education background relevance
4. Overall candidate-job fit

Returns structured JSON with:
- Compatibility score (0-100%)
- Array of matching skills
- Reasoning for the match assessment

This system provides recruiters with data-driven candidate rankings while giving candidates visibility into available opportunities.