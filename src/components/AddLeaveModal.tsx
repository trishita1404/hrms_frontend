import React, { useState } from 'react';
import { X, Calendar, User, FileText, ClipboardList } from 'lucide-react';
import { useAppSelector } from '../store/hooks';

// Updated interface (removed employeeId)
export interface LeaveSubmission {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface AddLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveSubmission) => void;
}

const AddLeaveModal = ({ isOpen, onClose, onSubmit }: AddLeaveModalProps) => {
  const { user } = useAppSelector((state) => state.auth);

  // Form State
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      leaveType,
      startDate,
      endDate,
      reason
    });

    // Reset form fields
    setReason('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">Request Leave</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Employee (Auto-filled) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Employee
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-700">
              <User size={16} className="text-gray-500" />
              {user?.name || "Logged in user"}
            </div>
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Leave Type</label>
            <div className="relative">
              <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Paid Leave">Paid Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
                <option value="Maternity/Paternity">Maternity/Paternity</option>
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reason</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                required
                rows={3}
                placeholder="Briefly describe the reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md transition-all active:scale-95"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeaveModal;