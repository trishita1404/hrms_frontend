import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const ProtectedRoute = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();
  
  // 1. Get the raw string from localStorage for both 'user' and 'accessToken'
  const storedUserString = localStorage.getItem('user');
  const storedToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
  
  // 2. Hydration Logic: Check if a session exists in browser memory
  let hasValidBackup = false;
  
  try {
    if (storedUserString) {
      const parsed = JSON.parse(storedUserString);
      // Valid if user object has an ID or a token inside it
      if (parsed && (parsed.accessToken || parsed.token || parsed._id)) {
        hasValidBackup = true;
      }
    }
    
    // If we have a standalone token, that counts as a valid backup too
    if (storedToken) {
      hasValidBackup = true;
    }
  } catch {
    hasValidBackup = false;
  }

  // 3. Prevent "Flicker" Redirects
  // If Redux is still loading, show a centered spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 4. The Final Gate
  // Only redirect to login if BOTH Redux and LocalStorage are empty.
  // We check 'user' from Redux first, then our 'hasValidBackup'.
  if (!user && !hasValidBackup) {
    console.warn("No active session found. Redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 5. Success: Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;