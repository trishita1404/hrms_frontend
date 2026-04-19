import { Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext'; // Import the provider
import Login from './pages/Login';
import Register from './pages/Register';
import Employees from './pages/Employees'; 
import Dashboard from './pages/Dashboard';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings'; 
import Holidays from './pages/Holidays';
import LandingPage from './pages/LandingPage';
import JobManagement from './pages/JobManagement'; 
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

function App() {
  return (
    /* Wrap the entire Routes tree with the NotificationProvider */
    <NotificationProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes: User must be logged in to see these */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Main Business Logic Pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/holidays" element={<Holidays />} />
            
            <Route path="/jobs" element={<JobManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;