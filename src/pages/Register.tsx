import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, useSearchParams } from 'react-router-dom'; // Added useSearchParams
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '../utils/validationSchemas';
import axiosInstance from '../api/axiosInstance';
import axios, { type AxiosError } from 'axios';
import { useState } from 'react';

interface ErrorResponse {
  message: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to read URL query strings
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract the role from the URL (e.g., ?role=candidate)
  const roleFromUrl = searchParams.get('role');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');
    
    // Merge the form data with the role detected from the URL
    const finalData = {
      ...data,
      role: roleFromUrl || 'employee' // Defaults to employee if nothing is in URL
    };

    try {
      await axiosInstance.post('/auth/register', finalData);
      navigate('/login');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Dynamic Heading based on role */}
        <h2 className="text-3xl font-bold text-center text-gray-900">
          {roleFromUrl === 'candidate' ? 'Candidate Registration' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-8">
          {roleFromUrl === 'candidate' 
            ? 'Sign up to start your career journey' 
            : 'Join the HR Management System'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input 
                {...register('name')} 
                className="pl-10 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="John Doe" 
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input 
                {...register('email')} 
                type="email" 
                className="pl-10 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="email@example.com" 
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input 
                {...register('password')} 
                type="password" 
                className="pl-10 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="••••••••" 
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="text-red-700 bg-red-50 p-2 rounded text-sm border border-red-200">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center font-bold"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;