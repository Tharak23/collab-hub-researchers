import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FolderOpen, CheckSquare, BookOpen, TrendingUp, Users, Calendar } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { icon: <FolderOpen size={24} />, label: 'Active Projects', value: '0', color: '#646cff' },
    { icon: <CheckSquare size={24} />, label: 'Tasks Completed', value: '0', color: '#22c55e' },
    { icon: <BookOpen size={24} />, label: 'Research Papers', value: '0', color: '#f59e0b' },
    { icon: <Users size={24} />, label: 'Collaborators', value: '0', color: '#ef4444' }
  ]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    calculateStats();
    loadRecentActivity();
  }, [user]);

  const calculateStats = () => {
    if (!user) return;

    // Calculate active projects
    const projects = JSON.parse(localStorage.getItem('globalProjects') || '[]');
    const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'planning').length;

    // Calculate completed tasks
    const tasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
    const completedTasks = tasks.filter(t => t.completed).length;

    // Calculate research papers
    const papers = JSON.parse(localStorage.getItem('globalResearchPapers') || '[]');
    const papersCount = papers.length;

    // Calculate collaborators
    const connections = JSON.parse(localStorage.getItem(`connections_${user.id}`) || '[]');
    const collaboratorsCount = connections.length;

    setStats([
      { icon: <FolderOpen size={24} />, label: 'Active Projects', value: activeProjects.toString(), color: '#646cff' },
      { icon: <CheckSquare size={24} />, label: 'Tasks Completed', value: completedTasks.toString(), color: '#22c55e' },
      { icon: <BookOpen size={24} />, label: 'Research Papers', value: papersCount.toString(), color: '#f59e0b' },
      { icon: <Users size={24} />, label: 'Collaborators', value: collaboratorsCount.toString(), color: '#ef4444' }
    ]);
  };

  const loadRecentActivity = () => {
    if (!user) return;

    const activities = [];

    // Get recent projects
    const projects = JSON.parse(localStorage.getItem('globalProjects') || '[]');
    const recentProjects = projects
      .filter(p => p.createdBy === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2)
      .map(p => ({
        action: 'Created new project',
        title: p.title,
        time: formatTimeAgo(p.createdAt)
      }));

    // Get recent tasks
    const tasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
    const recentTasks = tasks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 1)
      .map(t => ({
        action: 'Added task',
        title: t.title,
        time: formatTimeAgo(t.createdAt)
      }));

    // Get recent papers
    const papers = JSON.parse(localStorage.getItem('globalResearchPapers') || '[]');
    const recentPapers = papers
      .filter(p => p.uploadedBy === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 1)
      .map(p => ({
        action: 'Uploaded paper',
        title: p.title,
        time: formatTimeAgo(p.createdAt)
      }));

    const allActivities = [...recentProjects, ...recentTasks, ...recentPapers]
      .sort((a, b) => {
        // Sort by time (most recent first)
        const timeOrder = { 'just now': 0, 'minutes ago': 1, 'hours ago': 2, 'days ago': 3 };
        return (timeOrder[a.time.split(' ')[1]] || 4) - (timeOrder[b.time.split(' ')[1]] || 4);
      })
      .slice(0, 4);

    setRecentActivity(allActivities.length > 0 ? allActivities : [
      { action: 'Welcome!', title: 'Get started by creating your first project', time: 'just now' }
    ]);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

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
              {(() => {
                const projects = JSON.parse(localStorage.getItem('globalProjects') || '[]');
                const upcomingProjects = projects
                  .filter(p => p.endDate && new Date(p.endDate) > new Date())
                  .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
                  .slice(0, 3);

                if (upcomingProjects.length === 0) {
                  return (
                    <div className="empty-state">
                      <Calendar size={32} />
                      <p>No upcoming deadlines</p>
                    </div>
                  );
                }

                return upcomingProjects.map((project) => {
                  const endDate = new Date(project.endDate);
                  const today = new Date();
                  const diffTime = endDate - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  return (
                    <div key={project.id} className="deadline-item">
                      <div className="deadline-date">
                        <span className="deadline-day">{endDate.getDate()}</span>
                        <span className="deadline-month">
                          {endDate.toLocaleString('en-US', { month: 'short' })}
                        </span>
                      </div>
                      <div className="deadline-content">
                        <div className="deadline-title">{project.title}</div>
                        <div className="deadline-project">{project.status}</div>
                      </div>
                      <span className={`badge ${diffDays <= 3 ? 'badge-warning' : 'badge-info'}`}>
                        {diffDays} {diffDays === 1 ? 'day' : 'days'} left
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

