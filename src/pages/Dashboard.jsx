import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FolderOpen, CheckSquare, BookOpen, TrendingUp, Users, Calendar } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { icon: <FolderOpen size={24} />, label: 'Active Projects', value: '12', color: '#646cff' },
    { icon: <CheckSquare size={24} />, label: 'Tasks Completed', value: '48', color: '#22c55e' },
    { icon: <BookOpen size={24} />, label: 'Research Papers', value: '24', color: '#f59e0b' },
    { icon: <Users size={24} />, label: 'Collaborators', value: '36', color: '#ef4444' }
  ];

  const recentActivity = [
    { action: 'Created new project', title: 'AI Research Study', time: '2 hours ago' },
    { action: 'Updated task', title: 'Data Analysis', time: '4 hours ago' },
    { action: 'Shared paper', title: 'Machine Learning Paper', time: 'Yesterday' },
    { action: 'Added collaborator', title: 'John Smith to Project X', time: '2 days ago' }
  ];

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div>
            <h1>Welcome back, {user?.firstName}!</h1>
            <p>Here's what's happening with your research projects today.</p>
          </div>
          <div className="welcome-actions">
            <Link to="/projects" className="btn btn-primary">
              <FolderOpen size={18} />
              New Project
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3><TrendingUp size={20} /> Recent Activity</h3>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.action}</div>
                      <div className="activity-subtitle">{activity.title}</div>
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <div className="card-header">
              <h3>Quick Links</h3>
            </div>
            <div className="card-body">
              <div className="quick-links">
                <Link to="/projects" className="quick-link">
                  <FolderOpen size={20} />
                  <span>Projects</span>
                </Link>
                <Link to="/tasks" className="quick-link">
                  <CheckSquare size={20} />
                  <span>Tasks</span>
                </Link>
                <Link to="/research-papers" className="quick-link">
                  <BookOpen size={20} />
                  <span>Research Papers</span>
                </Link>
                <Link to="/profile" className="quick-link">
                  <Users size={20} />
                  <span>Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="card">
          <div className="card-header">
            <h3><Calendar size={20} /> Upcoming Deadlines</h3>
          </div>
          <div className="card-body">
            <div className="deadline-list">
              <div className="deadline-item">
                <div className="deadline-date">
                  <span className="deadline-day">15</span>
                  <span className="deadline-month">Dec</span>
                </div>
                <div className="deadline-content">
                  <div className="deadline-title">Submit Research Proposal</div>
                  <div className="deadline-project">AI Research Study</div>
                </div>
                <span className="badge badge-warning">3 days left</span>
              </div>
              <div className="deadline-item">
                <div className="deadline-date">
                  <span className="deadline-day">20</span>
                  <span className="deadline-month">Dec</span>
                </div>
                <div className="deadline-content">
                  <div className="deadline-title">Complete Data Analysis</div>
                  <div className="deadline-project">Climate Study</div>
                </div>
                <span className="badge badge-info">8 days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

