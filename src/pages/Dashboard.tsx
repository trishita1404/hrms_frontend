import { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { AdminView, HRView, EmployeeView, CandidateView } from '../components/DashboardViews';
import { Loader2 } from 'lucide-react';

import dashboardService from '../features/dashboard/dashboardService';
import type { DashboardStats } from '../features/dashboard/dashboardService';

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // DEBUG: Check what role is actually being pulled from Redux
  useEffect(() => {
    console.log("Current User Role:", user?.role);
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
        setStats({} as DashboardStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const safeStats = stats || ({} as DashboardStats);
  const userName = user?.name || 'User';
  
  // FORCE string comparison to bypass TypeScript warnings
  const role = String(user?.role).toLowerCase();

  // 1. Check for Admin
  if (role === 'admin') {
    return <AdminView stats={safeStats} />;
  }

  // 2. Check for HR
  if (role === 'hr') {
    return <HRView stats={safeStats} />;
  }

  // 3. Check for Candidate (Make sure backend sends 'candidate' lowercase)
  if (role === 'candidate') {
    return <CandidateView userName={userName} stats={safeStats} />;
  }

  // 4. Default: Employee View
  return (
    <EmployeeView 
      userName={userName} 
      stats={safeStats} 
    />
  );
};

export default Dashboard;