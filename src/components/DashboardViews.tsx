import React from 'react';
import { 
  Users, 
  UserMinus, 
  Activity, 
  Briefcase, 
  Send, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

/**
 * Combined interface to handle all user roles.
 */
export interface DashboardStats {
  // Admin & HR Metrics
  totalEmployees?: number;
  onLeave?: number;
  activeSessions?: number;
  totalJobs?: number; // Synced with sidebar "Jobs"
  attendanceTrend?: Array<{ day: string; count: number }>; 
  totalUsers?: number;
  totalStaff?: number;
  presentToday?: number;
  lateToday?: number;
  
  // Employee Specific Metrics
  myTotalHours?: number;
  myAttendanceRate?: number;
  lastClockIn?: string;

  // Candidate Specific Metrics
  appliedJobsCount?: number;
  activeApplications?: number;
  interviewShortlists?: number;
}

interface ViewProps {
  stats: DashboardStats;
}

interface UserViewProps extends ViewProps {
  userName: string;
}

// 1. ADMIN VIEW: Synced with Sidebar Data
export const AdminView: React.FC<ViewProps> = ({ stats }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">System Administrator</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full border border-red-100">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Root Access</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Total Employees (Sidebar: Employees) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Users size={24} /></div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Total Employees</p>
            <p className="text-3xl font-bold text-gray-800 leading-none">{stats.totalEmployees || 0}</p>
          </div>
        </div>

        {/* Card 2: Total Jobs (Sidebar: Jobs) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><Briefcase size={24} /></div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Total Jobs</p>
            <p className="text-3xl font-bold text-gray-800 leading-none">{stats.totalJobs || 0}</p>
          </div>
        </div>

        {/* Card 3: On Leave (Sidebar: Leave Requests) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><UserMinus size={24} /></div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">On Leave</p>
            <p className="text-3xl font-bold text-gray-800 leading-none">{stats.onLeave || 0}</p>
          </div>
        </div>

        {/* Card 4: Active Sessions */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Activity size={24} /></div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Active Sessions</p>
            <p className="text-3xl font-bold text-blue-600 leading-none">{stats.activeSessions || 0}</p>
          </div>
        </div>
      </div>

      {/* Attendance Trend Chart */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-6 text-lg">Attendance Overview (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.attendanceTrend || []}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 2. HR VIEW: People Management Focus
export const HRView: React.FC<ViewProps> = ({ stats }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">HR Management</h1>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase">Management</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-indigo-600 p-5 rounded-2xl text-white shadow-lg shadow-indigo-100">
          <p className="text-xs opacity-80 uppercase font-bold">Total Staff</p>
          <p className="text-2xl font-bold">{stats.totalStaff || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold">Present Today</p>
          <p className="text-2xl font-bold text-green-600">{stats.presentToday || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold">On Leave</p>
          <p className="text-2xl font-bold text-orange-500">{stats.onLeave || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold">Late Today</p>
          <p className="text-2xl font-bold text-red-400">{stats.lateToday || 0}</p>
        </div>
      </div>
    </div>
  );
};

// 3. EMPLOYEE VIEW
export const EmployeeView: React.FC<UserViewProps> = ({ userName, stats }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Hello, {userName}</h1>
        <p className="text-sm text-gray-500">You have worked {stats.myTotalHours || 0} hours this week.</p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-lg max-w-2xl">
        <h2 className="text-xl font-medium opacity-90">Weekly Attendance Rate</h2>
        <p className="text-4xl font-bold mt-2">{stats.myAttendanceRate || 0}%</p>
        <p className="text-sm opacity-75 mt-1">Last activity: {stats.lastClockIn || 'No records'}</p>
      </div>
    </div>
  );
};

// 4. CANDIDATE VIEW
export const CandidateView: React.FC<UserViewProps> = ({ userName, stats }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {userName}</h1>
        <p className="text-sm text-gray-500">Track your current applications and hiring status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Send size={24} /></div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Applied Jobs</p>
            <p className="text-3xl font-bold text-gray-800 leading-none">{stats.appliedJobsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={24} /></div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Pending Feedback</p>
            <p className="text-3xl font-bold text-gray-800 leading-none">{stats.activeApplications || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><CheckCircle size={24} /></div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Shortlisted</p>
            <p className="text-3xl font-bold text-green-600 leading-none">{stats.interviewShortlists || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-white rounded-xl shadow-sm"><Briefcase className="text-gray-600" size={20} /></div>
           <p className="text-sm font-semibold text-gray-600">Explore new opportunities in the Job Portal</p>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:underline">View Jobs</button>
      </div>
    </div>
  );
};