import axiosInstance from '../../api/axiosInstance';

export interface DashboardStats {
  // Admin & HR
  totalEmployees?: number;
  onLeave?: number;
  activeSessions?: number;
  presentToday?: number;
  lateToday?: number;
  totalUsers?: number;
  totalStaff?: number;
  totalJobs?: number; 
  attendanceTrend?: Array<{ day: string; count: number }>;

  // Employee
  myTotalHours?: number;
  myAttendanceRate?: number;
  lastClockIn?: string;

  // Candidate
  appliedJobsCount?: number;
  activeApplications?: number;
  interviewShortlists?: number;

  role?: 'admin' | 'hr' | 'employee' | 'candidate'; 
}

const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get('/dashboard/stats');
  return response.data;
};

const dashboardService = {
  getDashboardStats,
};

export default dashboardService;