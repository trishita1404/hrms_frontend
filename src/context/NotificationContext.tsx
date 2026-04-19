import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '../api/axiosInstance'; 
import { AxiosError } from 'axios';
import { useAppSelector } from '../store/hooks';


interface Notification {
  _id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}


const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider (Exported)
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const socketRef = useRef<Socket | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!localStorage.getItem('accessToken')) return;
    try {
      const { data } = await axiosInstance.get('/notifications');
      setNotifications(data);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status !== 401) {
        console.error("Fetch error:", err.message);
      }
    }
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      await fetchNotifications();
    })();

    const socket = io('http://localhost:3001', {
      query: { userId: user._id },
    });
    socketRef.current = socket;

    socket.on('new_notification', (newNotif: Notification) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      socket.off('new_notification');
      socket.disconnect();
    };
  }, [user?._id, fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) { console.error(e); }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) { console.error(e); }
  };

  const value = useMemo(() => ({
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
    markAsRead,
    markAllAsRead
  }), [notifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}