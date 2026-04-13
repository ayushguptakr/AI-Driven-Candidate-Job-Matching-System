import React, { useState } from 'react';
import { resumeAPI } from '../services/api';
import { FileUp, X, UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';
import Button from './ui/Button';

const ResumeUpload = ({ onResumeUploaded, onClose }) => {
  const [formData, setFormData] = useState({
    candidateName: '', email: '', phone: '', skills: '', experience: '', education: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ text: 'Please select a resume file.', type: 'error' });
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('resume', file);

    try {
      await resumeAPI.upload(data);
      setFormData({ candidateName: '', email: '', phone: '', skills: '', experience: '', education: '' });
      setFile(null);
      onResumeUploaded?.();
      onClose?.();
    } catch (error) {
      setMessage({ text: 'Error uploading resume. Please try again.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scroll bg-[#0a0520] border border-white/10 rounded-2xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#0a0520]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UploadCloud size={22} className="text-purple-400" />
            Upload Profile
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {message.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 mb-6 border ${
              message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              <p className="font-medium text-sm">{message.text}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 border-none">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-sans"
                  value={formData.candidateName}
                  onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-1.5 border-none">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-sans"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 border-none">
                <label className="text-sm font-medium text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-sans"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-1.5 border-none">
                <label className="text-sm font-medium text-slate-300">Education</label>
                <input
                  type="text"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-sans"
                  value={formData.education}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                  placeholder="B.S. Computer Science"
                />
              </div>
            </div>
            
            <div className="space-y-1.5 border-none">
              <label className="text-sm font-medium text-slate-300">Key Skills</label>
              <input
                type="text"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-sans"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                placeholder="React, Node.js, Python (comma-separated)"
              />
            </div>
            
            <div className="space-y-1.5 border-none">
              <label className="text-sm font-medium text-slate-300">Experience Summary</label>
              <textarea
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-sans resize-y"
                style={{ height: '80px' }}
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                placeholder="Brief summary of your work experience..."
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Resume Document</label>
              <div className="relative group border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-xl p-8 text-center bg-white/[0.02] transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-full bg-white/5 group-hover:bg-purple-500/10 text-slate-400 group-hover:text-purple-400 transition-colors">
                    <FileUp size={28} />
                  </div>
                  <h4 className="font-medium text-white text-sm">
                    {file ? file.name : "Click to attach or drag and drop"}
                  </h4>
                  <p className="text-xs text-slate-500">PDF or TXT up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-white/5 mt-6">
              <Button
                variant="secondary"
                type="button"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="flex-[2]"
              >
                {loading ? 'Uploading...' : 'Save & Upload'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;