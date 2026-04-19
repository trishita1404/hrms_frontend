import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Plus, Calendar as CalendarIcon, X } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

interface Holiday {
  _id: string;
  title: string;
  date: string;
  type: string;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Holidays: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ title: '', type: 'Public' });

  // Get user role safely
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';

  // 1. Wrapped in useCallback. Added console.error(err) to use the variable.
  const fetchHolidays = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/holidays');
      if (response.data) {
        setHolidays(response.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err); // Now 'err' is used!
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const response = await axiosInstance.get('/holidays');
        if (isMounted && response.data) {
          setHolidays(response.data);
        }
      } catch (err) {
        console.error("Initial Load Error:", err); // Now 'err' is used!
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/holidays', {
        ...newHoliday,
        date: selectedDate.toISOString()
      });
      setShowModal(false);
      setNewHoliday({ title: '', type: 'Public' });
      fetchHolidays();
    } catch (err) {
      console.error("Post Error:", err); // Now 'err' is used!
      alert("Failed to add holiday");
    }
  };

  const onDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      const isHoliday = holidays.some(h => new Date(h.date).toDateString() === dateString);
      return isHoliday ? 'bg-blue-100 text-blue-600 font-bold rounded-full' : null;
    }
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Holiday Calendar</h1>
          <p className="text-gray-500 text-sm">View company-wide holidays and events</p>
        </div>
        
        {isAdminOrHR && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Plus size={18} />
            <span className="font-semibold">Add Holiday</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Calendar 
            onChange={onDateChange} 
            value={selectedDate} 
            tileClassName={tileClassName}
            className="w-full border-none font-sans"
          />
        </div>

        {/* List Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col max-h-[500px]">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
            <CalendarIcon size={18} className="text-blue-500" />
            Upcoming List
          </h3>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {holidays.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm italic">No holidays scheduled.</p>
              </div>
            ) : (
              holidays.map((h) => (
                <div key={h._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-blue-100 group">
                  <div>
                    <p className="font-bold text-gray-700 text-sm group-hover:text-blue-600 transition-colors">{h.title}</p>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {new Date(h.date).toLocaleDateString('en-GB', { 
                        day: '2-digit', month: 'short', year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className="text-[9px] px-2.5 py-1 bg-white text-blue-600 rounded-lg font-black uppercase tracking-wider border border-blue-50 shadow-sm">
                    {h.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-800">New Holiday Entry</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddHoliday} className="space-y-5">
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Selected Date</p>
                  <p className="text-blue-700 font-extrabold">{selectedDate.toDateString()}</p>
                </div>
                <CalendarIcon size={24} className="text-blue-200" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase ml-1">Event Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Annual Company Retreat"
                  value={newHoliday.title}
                  onChange={(e) => setNewHoliday({...newHoliday, title: e.target.value})}
                  className="w-full p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase ml-1">Category</label>
                <select 
                  className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white font-medium text-gray-700"
                  value={newHoliday.type}
                  onChange={(e) => setNewHoliday({...newHoliday, type: e.target.value})}
                >
                  <option value="Public">Public Holiday</option>
                  <option value="Company">Company Holiday</option>
                  <option value="Festive">Festive Celebration</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Holidays;