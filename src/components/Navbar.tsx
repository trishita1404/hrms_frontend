import { Search, LogOut, User as UserIcon } from 'lucide-react'; 
import { useAppDispatch } from '../store/hooks';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell'; 

interface NavbarProps {
  user: {
    name: string;
    role: string;
    email?: string;
  } | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search for employees, tasks..." 
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300"
          />
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-4">
        
        {/* 2. Swapped the static button for your dynamic NotificationBell */}
        <NotificationBell />

        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-0.5">
              {user?.role || 'Member'}
            </p>
          </div>

          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
              {user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <UserIcon size={20} />
              )}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
            title="Logout"
          >
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;