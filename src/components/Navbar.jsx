import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Home, FolderOpen, CheckSquare, MessageSquare, BookOpen, User, LogOut, Bell, Users } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">R</div>
          <span>ResearchHub</span>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            <Home size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
            <FolderOpen size={18} />
            <span>Projects</span>
          </Link>
          <Link to="/research-papers" className={`nav-link ${isActive('/research-papers') ? 'active' : ''}`}>
            <BookOpen size={18} />
            <span>Research Papers</span>
          </Link>
          <Link to="/collaborators" className={`nav-link ${isActive('/collaborators') ? 'active' : ''}`}>
            <Users size={18} />
            <span>Collaborators</span>
          </Link>
          <Link to="/tasks" className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}>
            <CheckSquare size={18} />
            <span>Tasks</span>
          </Link>
          <Link to="/messages" className={`nav-link ${isActive('/messages') ? 'active' : ''}`}>
            <MessageSquare size={18} />
            <span>Messages</span>
          </Link>
        </div>

        <div className="navbar-user">
          <Link to="/notifications" className="notification-btn">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </Link>
          <Link to="/profile" className="user-link">
            <User size={18} />
            <span>{user?.firstName} {user?.lastName}</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
