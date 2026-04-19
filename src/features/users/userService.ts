import axiosInstance from '../../api/axiosInstance';

// 1. Define specific interfaces to replace 'any'
export interface UserProfileUpdate {
  name: string;
  email: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  employeeDetails?: string;
}

const API_URL = '/users';

// Fetch current user profile
const getProfile = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get(`${API_URL}/profile`);
  return response.data;
};

// Update name and email
const updateProfile = async (userData: UserProfileUpdate): Promise<UserResponse> => {
  const response = await axiosInstance.put(`${API_URL}/profile`, userData);
  return response.data;
};

// Change password
const changePassword = async (passwordData: PasswordUpdateData): Promise<{ message: string }> => {
  const response = await axiosInstance.post(`${API_URL}/change-password`, passwordData);
  return response.data;
};

const userService = {
  getProfile,
  updateProfile,
  changePassword,
};

export default userService;