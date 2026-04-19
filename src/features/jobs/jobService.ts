import axiosInstance from '../../api/axiosInstance';

export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  status: 'Open' | 'Closed';
  createdAt: string;
}

export interface Application {
  _id: string;
  jobId: string;
  userId: string; 
  jobTitle: string;
  candidateName: string;
  email: string;
  resumeLink: string;
  coverLetter: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const API_URL = '/jobs';

/**
 * Fetch all open jobs
 */
const getAllJobs = async (): Promise<Job[]> => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

/**
 * Create a new job (Admin/HR Only)
 */
const createJob = async (jobData: Partial<Job>): Promise<Job> => {
  const response = await axiosInstance.post(API_URL, jobData);
  return response.data;
};

/**
 * Submit a new application (Candidate)
 */
const applyToJob = async (appData: Partial<Application>): Promise<Application> => {
  const response = await axiosInstance.post(`${API_URL}/apply`, appData);
  return response.data;
};

/**
 * Fetch all applications (Admin Only)
 */
const getApplications = async (): Promise<Application[]> => {
  const response = await axiosInstance.get(`${API_URL}/applications`);
  return response.data;
};

/**
 * Fetch only the logged-in candidate's applications
 */
const getUserApplications = async (): Promise<Application[]> => {
  const response = await axiosInstance.get(`${API_URL}/my-applications`);
  return response.data;
};

/**
 * Update application status (Admin Only)
 */
const updateApplicationStatus = async (
  id: string, 
  status: 'approved' | 'rejected'
): Promise<Application> => {
  const response = await axiosInstance.put(`${API_URL}/applications/${id}`, { status });
  return response.data;
};

/**
 * DELETE a job (Admin/HR Only)
 * ADDED: This connects to  backend delete route
 */
const deleteJob = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data;
};

const jobService = {
  getAllJobs,
  createJob,
  applyToJob,
  getApplications,
  getUserApplications,
  updateApplicationStatus,
  deleteJob, 
};

export default jobService;