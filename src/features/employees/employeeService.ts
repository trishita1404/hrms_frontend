import axiosInstance from '../../api/axiosInstance';

// Updated: Get all employees with pagination parameters
const getEmployees = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get(`/employees`, {
    params: { page, limit }
  });
  return response.data;
};

// Create Employee - Accepts FormData (text + file)
const addEmployee = async (formData: FormData) => {
  // Let Axios handle the headers and boundaries automatically
  const response = await axiosInstance.post('/employees', formData);
  return response.data;
};

// Update Employee - Accepts FormData
const updateEmployee = async (id: string, formData: FormData) => {
  // Let Axios handle the headers and boundaries automatically
  const response = await axiosInstance.put(`/employees/${id}`, formData);
  return response.data;
};

// Delete Employee
const deleteEmployee = async (id: string) => {
  const response = await axiosInstance.delete(`/employees/${id}`);
  return response.data;
};

const employeeService = {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
};

export default employeeService;