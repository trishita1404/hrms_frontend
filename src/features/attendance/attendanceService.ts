import axiosInstance from '../../api/axiosInstance';

export interface AttendanceRecord {
  _id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'Present' | 'Late' | 'Absent';
  totalHours: number;
  employee?: {
    _id: string;
    name: string;
    email: string;
    department?: string;
  };
}

const API_URL = '/attendance';

// 1. Clock In
const checkIn = async () => {
  const response = await axiosInstance.post(`${API_URL}/check-in`);
  return response.data;
};

// 2. Clock Out
const checkOut = async () => {
  const response = await axiosInstance.put(`${API_URL}/check-out`);
  return response.data;
};

/**
 * 3. Get Logged-in User's History
 * UPDATED: Added pagination support to fix the "0 arguments" error
 */
const getMyHistory = async (page: number = 1, limit: number = 6) => {
  const response = await axiosInstance.get(`${API_URL}/my-history`, {
    params: { page, limit }
  });
  return response.data;
};

/**
 * 4. Get All Employee History (Admin/HR Only)
 */
const getAllHistory = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get(`${API_URL}/all`, {
    params: { page, limit }
  });
  return response.data;
};

/**
 * 5. Delete an attendance record
 */
const deleteAttendance = async (id: string) => {
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data;
};

const attendanceService = {
  checkIn,
  checkOut,
  getMyHistory,
  getAllHistory,
  deleteAttendance, 
};

export default attendanceService;