import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jobService from '../features/jobs/jobService';
import type { Job } from '../features/jobs/jobService';

const LandingPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getAllJobs();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault(); 
    
    // Check for existing session
    const storedUser = localStorage.getItem('user'); 
    
    if (storedUser) {
      navigate('/jobs');
    } else {
      // If not logged in, go to login. 
      // If they need to register, they will use the "Register as Candidate" button.
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-2xl font-bold text-blue-600">HRMS Portal</div>
        <div className="space-x-4 flex items-center">
          <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
            Login
          </Link>
          
          {/* UPDATED: Passing the role as a query parameter */}
          <Link 
            to="/register?role=candidate" 
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Register as Candidate
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 py-20 px-6 text-center text-white">
        <h1 className="text-5xl font-extrabold tracking-tight">Your Next Career Move Starts Here</h1>
        <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
          Explore the latest job openings at our company and join a team of innovators and creators.
        </p>
      </header>

      {/* Jobs Section */}
      <main className="flex-grow max-w-6xl mx-auto w-full py-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Available Opportunities</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {jobs.length} Open Positions
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 uppercase">{job.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm space-x-3">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.type}</span>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold text-lg">5LPA</span>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Description:</h4>
                  <p className="text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <button 
                    type="button"
                    onClick={handleApply}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View Details
                  </button>
                  <button 
                    type="button"
                    onClick={handleApply}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100 text-sm font-bold"
                  >
                     Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 text-center border-t border-gray-700">
        <p>© 2026 HRMS Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;