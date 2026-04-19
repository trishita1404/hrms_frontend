import React, { useState } from 'react';
import { Bell, CheckCheck, MessageSquare } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="relative">
      {/* Bell Icon & Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        // Updated styling to match Navbar's rounded-xl and transition style
        className="relative p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          // Adjusted badge to match the Navbar's small red dot positioning
          <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          {/* Added better shadow and rounded-2xl to match your profile avatar style */}
          <div className="absolute right-0 mt-3 w-80 max-h-[480px] overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-blue-200/50 z-20 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-bold text-sm text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead()}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>

            <div className="divide-y divide-gray-50 overflow-y-auto max-h-[380px]">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="text-gray-300" size={20} />
                  </div>
                  <p className="text-gray-500 text-xs">No new notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    onClick={() => {
                        markAsRead(notif._id);
                        // Optional: close on click
                        // setIsOpen(false);
                    }}
                    className={`p-4 hover:bg-blue-50/30 cursor-pointer transition-all ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-xl h-fit ${!notif.isRead ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        <MessageSquare size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed ${!notif.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shadow-sm shadow-blue-200"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 text-center border-t border-gray-50 bg-white">
                <button className="text-[11px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                  View All Activity
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;