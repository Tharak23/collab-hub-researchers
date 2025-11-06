import { useState, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import Navbar from '../components/Navbar';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="notifications-page">
      <Navbar />
      <div className="notifications-container">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="header-actions">
            {notifications.some(n => !n.read) && (
              <button className="btn btn-secondary" onClick={markAllAsRead}>
                <CheckCheck size={18} />
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="btn btn-secondary" onClick={clearAll}>
                <Trash2 size={18} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {notifications.length > 0 ? (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-icon">
                  <Bell size={20} />
                </div>
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span className="notification-time">{formatTime(notification.createdAt)}</span>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="action-btn" 
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Bell size={48} />
            <h3>No notifications</h3>
            <p>You're all caught up! Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

