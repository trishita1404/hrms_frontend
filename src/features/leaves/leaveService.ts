import axiosInstance from '../../api/axiosInstance'; 

export interface LeaveRequestData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const API_URL = '/leaves';

const createLeave = async (leaveData: LeaveRequestData) => {
  const response = await axiosInstance.post(API_URL, leaveData);
  return response.data;
};

/**
 * UPDATED: Get Leaves with pagination support
 * @param page - Current page number
 * @param limit - Number of records per page
 */
const getLeaves = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get(API_URL, {
    params: { page, limit }
  });
  return response.data;
};

const updateLeaveStatus = async (
  leaveId: string,
  statusData: { status: string; adminMessage?: string }
) => {
  const response = await axiosInstance.put(`${API_URL}/${leaveId}`, statusData);
  return response.data;
};

/**
 * NEW: Delete a leave request
 * @param leaveId - The MongoDB _id of the leave record
 */
const deleteLeave = async (leaveId: string) => {
  const response = await axiosInstance.delete(`${API_URL}/${leaveId}`);
  return response.data;
};

const leaveService = {
  createLeave,
  getLeaves,
  updateLeaveStatus,
  deleteLeave,
};

export default leaveService;