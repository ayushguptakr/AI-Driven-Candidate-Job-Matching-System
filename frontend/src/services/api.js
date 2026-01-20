import axios from 'axios';

const API_BASE = '/api';

export const jobAPI = {
  getAll: () => axios.get(`${API_BASE}/jobs`),
  create: (job) => axios.post(`${API_BASE}/jobs`, job),
  getMatches: (jobId) => axios.get(`${API_BASE}/jobs/${jobId}/matches`),
  matchResumes: (jobId) => axios.post(`${API_BASE}/jobs/${jobId}/match`)
};

export const resumeAPI = {
  getAll: () => axios.get(`${API_BASE}/resumes`),
  upload: (formData) => axios.post(`${API_BASE}/resumes/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};