import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Loader2, CheckCircle2, XCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import leaveService from '../features/leaves/leaveService';
import AddLeaveModal from '../components/AddLeaveModal';
import type { LeaveSubmission } from '../components/AddLeaveModal';
import axios from 'axios';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
}

interface Leave {
  _id: string;
  employee: {
    _id: string;
    name: string;
    role: string;
    department: string;
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminMessage?: string;
  createdAt: string;
}

const Leaves = () => {
  const { user } = useAppSelector((state) => state.auth);
  const authUser = user as AuthUser | null;
  const isAdminOrHR = authUser?.role === 'admin' || authUser?.role === 'hr';

  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(6);

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      // Pass pagination params to the service
      const response = await leaveService.getLeaves(currentPage, itemsPerPage);
      
      // The backend now returns { leaves: [...], pagination: {...} }
      if (response && response.leaves) {
        setLeaves(response.leaves);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        // Fallback for non-paginated responses (e.g., employee history)
        setLeaves(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleCreateLeave = async (leaveData: LeaveSubmission) => {
    try {
      await leaveService.createLeave(leaveData);
      setIsModalOpen(false);
      fetchLeaves();
    } catch (err) {
      let message = "Submission failed";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      alert(message);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      await leaveService.updateLeaveStatus(id, { 
        status, 
        adminMessage: `Processed as ${status}` 
      });
      fetchLeaves(); 
    } catch {
      alert("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this leave request?")) {
      try {
        await leaveService.deleteLeave(id);
        fetchLeaves(); // Refresh to update pagination counts
      } catch (err) {
        let errorMsg = "Delete failed";
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          errorMsg = err.response.data.message;
        }
        alert(errorMsg);
      }
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    const nameMatch = l.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = l.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || typeMatch;
  });

  return (
    <div className="p-6 space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Leave Management</h1>
          <p className="text-sm text-gray-500">
            {isAdminOrHR ? "Review and manage employee requests" : "View and manage your leave requests"}
          </p>
        </div>
        
        {!isAdminOrHR && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
          >
            <Plus size={20} />
            <span>Request Leave</span>
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by employee or leave type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-sm text-gray-400 font-medium">Loading Requests...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Employee</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLeaves.length > 0 ? (
                    filteredLeaves.map((leave) => (
                      <tr key={leave._id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{leave.employee?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-gray-400">{leave.employee?.department || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <p className="font-semibold text-gray-800">{leave.leaveType}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {isAdminOrHR && leave.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => handleStatusUpdate(leave._id, 'Approved')} 
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-[10px] font-bold uppercase transition-all"
                                >
                                  <CheckCircle2 size={16} />
                                  <span className="hidden lg:inline">Approve</span>
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(leave._id, 'Rejected')} 
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[10px] font-bold uppercase transition-all"
                                >
                                  <XCircle size={16} />
                                  <span className="hidden lg:inline">Reject</span>
                                </button>
                              </>
                            )}

                            {(isAdminOrHR || (!isAdminOrHR && leave.status === 'Pending')) && (
                              <button 
                                onClick={() => handleDelete(leave._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Request"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                            
                            {!isAdminOrHR && leave.status !== 'Pending' && (
                              <span className="text-[10px] font-medium text-gray-400 italic">
                                Finalized
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-medium">No leave requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">
                Page <span className="text-indigo-600 font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddLeaveModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateLeave} 
      />
    </div>
  );
};

export default Leaves;