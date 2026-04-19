import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Briefcase, MapPin, Clock, Trash2, X, 
  AlertCircle, Send, User, Mail, Paperclip, Loader2, CheckCircle, XCircle, ExternalLink 
} from 'lucide-react';
import jobService from '../features/jobs/jobService';
import type { Job, Application } from '../features/jobs/jobService';
import { AxiosError } from 'axios';

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
}

const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [candidateApplications, setCandidateApplications] = useState<Application[]>([]);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};
  const isCandidate = user.role === 'candidate' || user.role === 'employee';

  const [formData, setFormData] = useState<JobFormData>({
    title: '', description: '', requirements: '', location: '', salary: '', type: 'Full-time'
  });

  const [appFormData, setAppFormData] = useState({
    fullName: user.name || '', email: user.email || '', resumeLink: '', coverLetter: ''
  });

  const formatExternalLink = (url: string) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchApplicationsData = useCallback(async () => {
    try {
      if (isCandidate) {
        const myApps = await jobService.getUserApplications();
        setCandidateApplications(myApps);
      } else if (user.role === 'admin' || user.role === 'hr') {
        const data = await jobService.getApplications();
        setApplications(data);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  }, [isCandidate, user.role]);

  useEffect(() => {
    fetchJobs();
    fetchApplicationsData();
  }, [fetchJobs, fetchApplicationsData]);

  // Handle Post New Job (Admin)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const requirementsArray = formData.requirements
        ? formData.requirements.split(/[\n,]+/).map(item => item.trim()).filter(i => i !== "")
        : [formData.description];

      await jobService.createJob({ 
        ...formData, 
        requirements: requirementsArray 
      });

      setIsFormOpen(false);
      setFormData({ title: '', description: '', requirements: '', location: '', salary: '', type: 'Full-time' });
      fetchJobs();
    } catch (err) {
      if (err instanceof AxiosError) {
        setErrorMsg(err.response?.data?.message || "Failed to create job.");
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    }
  };

  // Handle Job Application (Candidate)
  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await jobService.applyToJob({
        jobId: applyingJob?._id,
        jobTitle: applyingJob?.title,
        candidateName: appFormData.fullName,
        email: appFormData.email,
        resumeLink: appFormData.resumeLink,
        coverLetter: appFormData.coverLetter
      });
      
      setApplyingJob(null);
      setAppFormData({ ...appFormData, resumeLink: '', coverLetter: '' });
      fetchApplicationsData(); 
      alert(`Applied successfully!`);
    } catch (error) {
      console.error("Application error:", error);
      alert("Failed to submit application.");
    }
  };

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await jobService.updateApplicationStatus(id, newStatus);
      fetchApplicationsData();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await jobService.deleteJob(id);
      setJobs(prevJobs => prevJobs.filter(job => job._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Could not delete job.");
    }
  };

  const getJobApplicationStatus = (jobId: string) => {
    const app = candidateApplications.find(a => a.jobId === jobId);
    return app ? app.status : null;
  };

  return (
    <div className="p-6 relative min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Briefcase className="text-blue-600" />
            {isCandidate ? 'Job Opportunities' : 'Job Portal Management'}
          </h1>
          {!isCandidate && (
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'jobs' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border text-gray-500 hover:bg-gray-50'}`}
              >
                Jobs List
              </button>
              <button 
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'applications' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border text-gray-500 hover:bg-gray-50'}`}
              >
                Applications ({applications.length})
              </button>
            </div>
          )}
        </div>
        
        {!isCandidate && activeTab === 'jobs' && (
          <button 
            onClick={() => { setIsFormOpen(!isFormOpen); setErrorMsg(null); }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition font-semibold ${isFormOpen ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white shadow-md hover:bg-blue-700'}`}
          >
            {isFormOpen ? <X size={20} /> : <Plus size={20} />} {isFormOpen ? 'Cancel' : 'Post New Job'}
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-lg">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {activeTab === 'jobs' ? (
        <>
          {/* Post New Job Form - RESTORED ONSUBMIT LINK */}
          {!isCandidate && isFormOpen && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Job Title</label>
                  <input required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Location</label>
                  <input required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-green-600">Salary</label>
                  <input className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. $80k - $100k" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Job Type</label>
                  <select 
                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value as JobFormData['type']})}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea required rows={3} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Publish Job</button>
            </form>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Position</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr><td colSpan={2} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr>
                ) : jobs.length > 0 ? jobs.map((job) => {
                  const currentStatus = getJobApplicationStatus(job._id);
                  return (
                    <tr key={job._id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="font-semibold text-gray-700">{job.title}</div>
                        <div className="text-xs text-gray-400 flex gap-2 mt-1">
                          <span className="flex items-center gap-1"><Clock size={12} /> {job.type}</span>
                          <span className="flex items-center gap-1 text-red-400"><MapPin size={12} /> {job.location}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {isCandidate ? (
                          <div className="flex justify-end">
                            {currentStatus ? (
                              <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold uppercase ${
                                currentStatus === 'approved' ? 'bg-green-100 text-green-700' : 
                                currentStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {currentStatus === 'approved' ? <CheckCircle size={14} /> : 
                                 currentStatus === 'rejected' ? <XCircle size={14} /> : <CheckCircle size={14} />} {currentStatus}
                              </span>
                            ) : (
                              <button 
                                onClick={() => setApplyingJob(job)} 
                                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm flex items-center gap-2"
                              >
                                <Send size={14} /> Apply Now
                              </button>
                            )}
                          </div>
                        ) : (
                          <button onClick={() => handleDelete(job._id)} className="text-gray-300 hover:text-red-500 p-2">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={2} className="p-8 text-center text-gray-400 italic">No jobs available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-4 items-center">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600"><User size={24} /></div>
                <div>
                  <h3 className="font-bold text-gray-800">{app.candidateName}</h3>
                  <p className="text-xs text-blue-600 font-bold uppercase">{app.jobTitle}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Mail size={12} /> {app.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a href={formatExternalLink(app.resumeLink)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-blue-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
                  <Paperclip size={14} /> View CV <ExternalLink size={12} />
                </a>
                {app.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(app._id, 'approved')} className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-600 hover:text-white transition"><CheckCircle size={18} /></button>
                    <button onClick={() => updateStatus(app._id, 'rejected')} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition"><XCircle size={18} /></button>
                  </div>
                ) : (
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{app.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CENTERED PROFESSIONAL APPLICATION MODAL */}
      {applyingJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            
            <div className="bg-blue-600 p-6 text-white relative">
              <button onClick={() => setApplyingJob(null)} className="absolute right-4 top-4 p-1 hover:bg-blue-500 rounded-full transition-colors"><X size={20} /></button>
              <h2 className="text-xl font-bold">Apply for Role</h2>
              <p className="text-blue-100 text-sm mt-1">{applyingJob.title}</p>
            </div>

            <form onSubmit={handleApplicationSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input 
                      required 
                      className="w-full border border-gray-200 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" 
                      placeholder="John Doe" 
                      value={appFormData.fullName} 
                      onChange={e => setAppFormData({...appFormData, fullName: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input 
                      required 
                      type="email"
                      className="w-full border border-gray-200 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" 
                      placeholder="john@example.com" 
                      value={appFormData.email} 
                      onChange={e => setAppFormData({...appFormData, email: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Resume Link (Drive/Dropbox)</label>
                <div className="relative">
                  <Paperclip className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input 
                    required 
                    className="w-full border border-gray-200 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" 
                    placeholder="https://drive.google.com/..." 
                    value={appFormData.resumeLink} 
                    onChange={e => setAppFormData({...appFormData, resumeLink: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Cover Letter</label>
                <textarea 
                  rows={4} 
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 resize-none" 
                  placeholder="Tell us why you are a great fit..." 
                  value={appFormData.coverLetter} 
                  onChange={e => setAppFormData({...appFormData, coverLetter: e.target.value})} 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setApplyingJob(null)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                  Submit Application <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;