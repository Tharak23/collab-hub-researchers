import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext?.user || null;
  } catch (e) {
    // useAuth might not be available yet
  }

  const loadNotifications = () => {
    let currentUser = user;
    if (!currentUser) {
      try {
        currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      } catch (error) {
        // Ignore
      }
    }
    
    if (currentUser && currentUser.id) {
      const storedNotifications = localStorage.getItem(`notifications_${currentUser.id}`);
      if (storedNotifications) {
        try {
          setNotifications(JSON.parse(storedNotifications));
        } catch (error) {
          console.error('Error parsing notifications:', error);
        }
      } else {
        setNotifications([]);
      }
    }
  };

  useEffect(() => {
    loadNotifications();
    
    // Refresh notifications periodically
    const interval = setInterval(() => {
      loadNotifications();
    }, 2000); // Refresh every 2 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  const saveNotifications = (newNotifications) => {
    let currentUser = user;
    if (!currentUser) {
      try {
        currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      } catch (error) {
        // Ignore
      }
    }
    if (!currentUser || !currentUser.id) return;
    
    localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  };

  const addNotification = (notification) => {
    let currentUser = user;
    if (!currentUser) {
      try {
        currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      } catch (error) {
        // Ignore
      }
    }
    if (!currentUser || !currentUser.id) return;
    
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifications = [newNotification, ...notifications];
    saveNotifications(updatedNotifications);
  };

  // Add notification to a specific user (for cross-user notifications)
  const addNotificationToUser = (userId, notification) => {
    const storedNotifications = localStorage.getItem(`notifications_${userId}`) || '[]';
    const userNotifications = JSON.parse(storedNotifications);
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifications = [newNotification, ...userNotifications];
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
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
    addNotificationToUser,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

