import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAppSelector } from '../store/hooks';

const MainLayout = () => {
  const { user: reduxUser } = useAppSelector((state) => state.auth);
  
  // Hydrate from localStorage if Redux is empty
  const storedUser = localStorage.getItem('user');
  const user = reduxUser || (storedUser ? JSON.parse(storedUser) : null);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Ensure role is passed correctly for the sidebar filter */}
      <Sidebar userRole={user.role} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar user={user} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* The actual page (Dashboard or Employees) renders here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;