import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Loader2, FileText, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import AddEmployeeModal from '../components/AddEmployeeModal';
import employeeService from '../features/employees/employeeService';
import { useAppSelector } from '../store/hooks';

const API_BASE_URL = 'http://localhost:3001'; 

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  status?: string;
  joinedDate: string;
  cvUrl?: string;
}

const Employees = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(6);

  const fetchEmployees = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees(page, itemsPerPage);
      
      // Update with the new backend structure
      setEmployees(data.employees || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(data.pagination?.currentPage || 1);
    } catch (err: unknown) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    if (user || localStorage.getItem('user')) {
      fetchEmployees(currentPage);
    }
  }, [user, currentPage, fetchEmployees]);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee._id, formData);
      } else {
        await employeeService.addEmployee(formData);
      }
      
      setIsModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees(currentPage); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Action failed: ${err.message}`);
      }
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.deleteEmployee(id);
        fetchEmployees(currentPage);
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert("Delete failed: " + err.message);
        }
      }
    }
  };

  const handleEditClick = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const filteredEmployees = employees.filter((emp: Employee) => {
    const s = searchTerm.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(s) ||
      emp.email?.toLowerCase().includes(s) ||
      emp.role?.toLowerCase().includes(s) ||
      (emp.department?.toLowerCase() || '').includes(s)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">HR Directory</h1>
          <p className="text-sm text-gray-500">Manage team members, roles, and view CVs</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search on this page..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-sm text-gray-400 font-medium">Fetching Directory...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Employee</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Department / Role</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">CV</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[11px] uppercase font-bold text-gray-400 tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <tr key={emp._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-sm border border-blue-200">
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                              <p className="text-xs text-gray-500">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">{emp.department || 'N/A'}</p>
                          <p className="text-[11px] text-blue-600 font-bold uppercase tracking-tighter">{emp.role}</p>
                        </td>
                        <td className="px-6 py-4">
                          {emp.cvUrl ? (
                            <a 
                              href={emp.cvUrl.startsWith('http') ? emp.cvUrl : `${API_BASE_URL}/${emp.cvUrl}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-bold bg-blue-50 px-2 py-1 rounded-md transition-colors"
                            >
                              <FileText size={14} />
                              View CV
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">Not Uploaded</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                            emp.status === 'On Leave' ? 'bg-orange-100 text-orange-700' : 
                            emp.status === 'Terminated' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {emp.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleEditClick(emp)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" 
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteEmployee(emp._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <p className="text-gray-400 font-medium">No employees found on this page.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">
                Page <span className="text-blue-600 font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddEmployeeModal 
        key={editingEmployee?._id || 'new'} 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onAddEmployee={handleFormSubmit}
        initialData={editingEmployee || undefined}
      />
    </div>
  );
};

export default Employees;