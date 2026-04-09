import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://ai-driven-candidate-job-matching-system.onrender.com/api' : 'http://localhost:5000/api');

export const jobAPI = {
  getAll: (page = 1, limit = 20, search = '') => 
    axios.get(`${API_BASE}/jobs`, { params: { page, limit, search } }),
  getMyJobs: (page = 1, limit = 20, search = '') =>
    axios.get(`${API_BASE}/jobs/my-jobs`, { params: { page, limit, search } }),
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

export const authAPI = {
  getProfile: () => axios.get(`${API_BASE}/auth/me`),
  updateProfile: (data) => axios.put(`${API_BASE}/auth/profile`, data),
  changePassword: (data) => axios.post(`${API_BASE}/auth/change-password`, data),
  signupWithInvite: (data) => axios.post(`${API_BASE}/auth/signup-with-invite`, data),
};

export const inviteAPI = {
  create: (data) => axios.post(`${API_BASE}/invite`, data),
  getDetails: (token) => axios.get(`${API_BASE}/invite/${token}`),
};

export const companyAPI = {
  update: (data) => axios.put(`${API_BASE}/company/update`, data),
};

export const matchAPI = {
  getMyMatches: () => axios.get(`${API_BASE}/matches/my`)
};

export const recruiterAPI = {
  candidateAction: (candidateId, jobId, action) => 
    axios.post(`${API_BASE}/recruiter/candidate-action`, { candidateId, jobId, action })
};

export const notificationAPI = {
  getMyNotifications: (limit = 10) => axios.get(`${API_BASE}/notifications`, { params: { limit } }),
  markAsRead: () => axios.patch(`${API_BASE}/notifications/mark-read`)
};