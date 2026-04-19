import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileText, 
  Settings, 
  ChevronRight,
  CalendarDays,
  Briefcase // Added Briefcase icon for Jobs
} from 'lucide-react';

interface SidebarProps {
  // Added 'candidate' to the allowed roles
  userRole: 'admin' | 'hr' | 'employee' | 'candidate';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();

  const allMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'hr', 'employee', 'candidate'] },
    { name: 'Employees', path: '/employees', icon: Users, roles: ['admin', 'hr'] },
    
    // --- NEW JOBS MENU ---
    // Admin/HR manage jobs, Candidates view/apply. Employees are excluded.
    { name: 'Jobs', path: '/jobs', icon: Briefcase, roles: ['admin', 'hr', 'candidate'] }, 
    
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck, roles: ['admin', 'hr', 'employee'] },
    { name: 'Leave Requests', path: '/leaves', icon: FileText, roles: ['admin', 'hr', 'employee'] },
    { name: 'Holidays', path: '/holidays', icon: CalendarDays, roles: ['admin', 'hr', 'employee'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col sticky top-0 shadow-sm z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
        <h1 className="text-xl font-black text-blue-600 tracking-tighter uppercase">
          HR <span className="text-gray-800">MS</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500 transition-colors'} />
                <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                  {item.name}
                </span>
              </div>
              {isActive && <ChevronRight size={16} className="text-white opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/30">
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
            v1.0.0 Stable
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;