import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Error parsing notifications:', error);
      }
    }
  }, []);

  const saveNotifications = (newNotifications) => {
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifications = [newNotification, ...notifications];
    saveNotifications(updatedNotifications);
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    saveNotifications(updatedNotifications);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

