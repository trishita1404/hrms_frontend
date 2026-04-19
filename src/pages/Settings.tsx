import { useState, useEffect } from 'react';
import { User, Shield, Lock, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
// Use 'import type' for interfaces to satisfy verbatimModuleSyntax
import type { UserProfileUpdate, PasswordUpdateData } from '../features/users/userService';
import userService from '../features/users/userService';

// Helper to safely handle 'unknown' errors without using 'any'
const getErrorMessage = (err: unknown): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response: { data?: { message?: string } } }).response;
    return response.data?.message || 'An unexpected error occurred';
  }
  return err instanceof Error ? err.message : 'An unexpected error occurred';
};

const Settings = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'system'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profileData, setProfileData] = useState<UserProfileUpdate>({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: unknown) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.changePassword(passwordData);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err: unknown) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account preferences and security configurations</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <Shield size={18} />}
          <span className="text-sm font-semibold">{message.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <User size={18} /> Profile Details
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'security' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Lock size={18} /> Security
          </button>
          {isAdminOrHR && (
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'system' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Shield size={18} /> System Config
            </button>
          )}
        </div>

        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Personal Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Update Profile
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Change Password</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:border-indigo-500 outline-none transition-all" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:border-indigo-500 outline-none transition-all" 
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;