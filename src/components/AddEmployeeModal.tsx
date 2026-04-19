import React, { useState } from 'react';
import { X, User, Mail, Briefcase, Calendar, Building2, Phone, FileText, Activity } from 'lucide-react';
import { useAppSelector } from '../store/hooks';

interface PartialEmployee {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  contactInfo?: string;
  joinedDate?: string;
  status?: string;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (data: FormData) => void; 
  initialData?: PartialEmployee;
}

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee, initialData }: AddEmployeeModalProps) => {
  const { user } = useAppSelector((state) => state.auth);
  
  // Authorization Check
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';

  // Form State - Using strings for manual typing
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [department, setDepartment] = useState(initialData?.department || '');
  const [contactInfo, setContactInfo] = useState(initialData?.contactInfo || '');
  const [status, setStatus] = useState(initialData?.status || 'Active');
  const [joined, setJoined] = useState(
    initialData?.joinedDate ? initialData.joinedDate.split('T')[0] : ''
  );
  const [cvFile, setCvFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name); // Sends the manually typed name
    formData.append('email', email);
    formData.append('role', role);
    formData.append('department', department);
    formData.append('contactInfo', contactInfo);
    formData.append('joinedDate', joined);
    formData.append('status', status);
    
    if (cvFile) {
      formData.append('cv', cvFile);
    }

    onAddEmployee(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">
            {initialData ? 'Edit Employee Profile' : 'Add New Employee'}
          </h3>
          <button onClick={onClose} className="text-indigo-100 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          <div className="space-y-4">
            {/* FULL NAME - Manual Input Field */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required 
                  type="text"
                  placeholder="Enter full name"
                  readOnly={!isAdminOrHR && !!initialData}
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    !isAdminOrHR && !!initialData 
                      ? 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed' 
                      : 'bg-white border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                  }`}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required 
                  type="email"
                  placeholder="email@company.com"
                  readOnly={!isAdminOrHR && !!initialData}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    !isAdminOrHR && !!initialData 
                      ? 'bg-gray-50 border-transparent text-gray-500' 
                      : 'bg-white border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                  }`}
                />
              </div>
            </div>

            {/* ROLE & DEPARTMENT */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required 
                    placeholder="e.g. Developer"
                    readOnly={!isAdminOrHR}
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      !isAdminOrHR ? 'bg-gray-50 border-transparent' : 'bg-white border-gray-200 focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    placeholder="e.g. IT"
                    readOnly={!isAdminOrHR}
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)} 
                    className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      !isAdminOrHR ? 'bg-gray-50 border-transparent' : 'bg-white border-gray-200 focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* STATUS & JOIN DATE */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Status</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    disabled={!isAdminOrHR}
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none appearance-none disabled:bg-gray-50"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Join Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required 
                    type="date"
                    readOnly={!isAdminOrHR}
                    value={joined} 
                    onChange={(e) => setJoined(e.target.value)} 
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CONTACT PHONE */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="+91 ..."
                  value={contactInfo} 
                  onChange={(e) => setContactInfo(e.target.value)} 
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* CV UPLOAD */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Resume / CV</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer" 
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all">
              {initialData ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;