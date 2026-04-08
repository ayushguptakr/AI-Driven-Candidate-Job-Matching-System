import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://ai-driven-candidate-job-matching-system.onrender.com/api' : 'http://localhost:5000/api');

export const jobAPI = {
  getAll: (page = 1, limit = 20, search = '') => 
    axios.get(`${API_BASE}/jobs`, { params: { page, limit, search } }),
  create: (job) => axios.post(`${API_BASE}/jobs`, job),
  getMatches: (jobId) => axios.get(`${API_BASE}/jobs/${jobId}/matches`),
  matchResumes: (jobId) => axios.post(`${API_BASE}/jobs/${jobId}/match`)
};

export const resumeAPI = {
  getAll: (page = 1, limit = 20) => 
    axios.get(`${API_BASE}/resumes`, { params: { page, limit } }),
  upload: (formData) => axios.post(`${API_BASE}/resumes/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const applicationAPI = {
  apply: (jobId) => axios.post(`${API_BASE}/applications`, { jobId }),
  getMyApplications: () => axios.get(`${API_BASE}/applications/me`),
  getJobApplications: (jobId) => axios.get(`${API_BASE}/applications/job/${jobId}`),
  updateApplicationStatus: (id, status) => axios.put(`${API_BASE}/applications/${id}/status`, { status })
};