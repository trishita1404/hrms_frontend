import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../utils/validationSchemas';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, reset } from '../features/auth/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user, isLoading, isError, message } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // REDIRECT LOGIC: 
    // 1. If user succeeds in logging in (isLoading becomes false)
    // 2. OR if user is already logged in (persisted from localStorage)
    if (user) {
      navigate('/dashboard');
    }

    // Clean up error messages/states when leaving the page
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]); // Removed isLoading here to allow instant redirect for persistent users

  const onSubmit = (data: LoginFormData) => {
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to your HR Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                {...register('email')}
                type="email"
                className={`block w-full pl-11 pr-4 py-2.5 bg-gray-50 border ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } rounded-xl focus:ring-2 focus:bg-white outline-none transition-all sm:text-sm`}
                placeholder="admin@gmail.com"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                {...register('password')}
                type="password"
                className={`block w-full pl-11 pr-4 py-2.5 bg-gray-50 border ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } rounded-xl focus:ring-2 focus:bg-white outline-none transition-all sm:text-sm`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.password.message}</p>}
          </div>

          {/* Error Message Alert */}
          {isError && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-blue-200 transition-all"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;