import { useState, useEffect, useCallback } from 'react';
import { Clock, LogIn, LogOut, Loader2, Calendar, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import attendanceService from '../features/attendance/attendanceService';
import type { AttendanceRecord } from '../features/attendance/attendanceService';
import axios from 'axios';

const Attendance = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';

  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(6);

  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      
      if (isAdminOrHR) {
        // Admin: Uses pagination for all history
        response = await attendanceService.getAllHistory(currentPage, itemsPerPage);
      } else {
        // Employee: Now passes currentPage and itemsPerPage to getMyHistory
        response = await attendanceService.getMyHistory(currentPage, itemsPerPage);
      }

      // Standardize data extraction: Both paths now return { history: [], pagination: {} }
      const historyData = Array.isArray(response.history) ? response.history : [];
      setHistory(historyData);
      setTotalPages(response.pagination?.totalPages || 1);

      // Check for today's record to manage the Check-In/Out card
      const todayStr = new Date().toISOString().split('T')[0];
      const today = historyData.find((rec: AttendanceRecord) => rec.date === todayStr);
      setTodayRecord(today || null);

    } catch (err) {
      console.error("Failed to fetch history", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [isAdminOrHR, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleAction = async (action: 'in' | 'out') => {
    try {
      setIsProcessing(true);
      if (action === 'in') {
        await attendanceService.checkIn();
      } else {
        await attendanceService.checkOut();
      }
      // Reset to page 1 to see the newest entry
      setCurrentPage(1); 
      await fetchAttendanceData();
    } catch (err) {
      let msg = "Action failed";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message;
      }
      alert(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this attendance log?")) {
      try {
        await attendanceService.deleteAttendance(id);
        fetchAttendanceData();
      } catch (err) {
        let msg = "Delete failed";
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          msg = err.response.data.message;
        }
        alert(msg);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isAdminOrHR ? "Attendance Monitoring" : "My Attendance"}
          </h1>
          <p className="text-sm text-gray-500">
            {isAdminOrHR ? "Monitor daily clock-ins and employee status" : "Log your daily work hours and view history"}
          </p>
        </div>
      </div>

      {/* Clock-in Action Card */}
      {!isAdminOrHR && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-6">
          <div className="p-4 bg-indigo-50 rounded-full">
            <Clock className="text-indigo-600" size={48} />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">
              {todayRecord?.checkOut ? "Shift Completed" : todayRecord ? "Currently Clocked In" : "Ready to Start?"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {todayRecord?.checkIn && `Checked in at: ${new Date(todayRecord.checkIn).toLocaleTimeString()}`}
            </p>
          </div>
          {!todayRecord?.checkOut ? (
            <button
              onClick={() => handleAction(todayRecord ? 'out' : 'in')}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                todayRecord ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
              } disabled:opacity-50`}
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : todayRecord ? <><LogOut size={20} /> Check Out</> : <><LogIn size={20} /> Check In</>}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg font-bold uppercase text-xs">
              Daily Session Ended
            </div>
          )}
        </div>
      )}

      {/* History Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-800">{isAdminOrHR ? "All Employee Logs" : "Recent Logs"}</h3>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <p className="text-sm text-gray-400 font-medium">Fetching Logs...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    {isAdminOrHR && <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Employee</th>}
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">In</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Out</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest text-right">Hours</th>
                    {isAdminOrHR && <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.length > 0 ? (
                    history.map((row) => (
                      <tr key={row._id} className="hover:bg-indigo-50/30 transition-colors group">
                        {isAdminOrHR && (
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-800">{row.employee?.name || 'Unknown'}</span>
                              <span className="text-[10px] text-gray-400">{row.employee?.department || 'N/A'}</span>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">{row.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            row.status === 'Late' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm font-bold text-indigo-600">
                          {row.totalHours > 0 ? `${row.totalHours}h` : '-'}
                        </td>
                        {isAdminOrHR && (
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDelete(row._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdminOrHR ? 7 : 5} className="px-6 py-20 text-center text-gray-400 font-medium">No records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls - Now visible for everyone */}
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
    </div>
  );
};

export default Attendance;