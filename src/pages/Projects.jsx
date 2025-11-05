import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Plus, Search, Filter, FolderOpen, Calendar, Users } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    budget: '',
    department: '',
    institution: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    // Load GLOBAL projects (not user-specific)
    const storedProjects = localStorage.getItem('globalProjects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  };

  const saveProjects = (projectsToSave) => {
    localStorage.setItem('globalProjects', JSON.stringify(projectsToSave));
    setProjects(projectsToSave);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    
    const projectData = {
      id: Date.now().toString(),
      ...newProject,
      progress: 0,
      createdBy: user?.id || '',
      createdByName: `${user?.firstName} ${user?.lastName}`,
      createdAt: new Date().toISOString()
    };

    const updatedProjects = [...projects, projectData];
    saveProjects(updatedProjects);

    setNewProject({
      title: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      startDate: '',
      endDate: '',
      budget: '',
      department: '',
      institution: ''
    });
    setShowCreateDialog(false);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="projects-page">
      <Navbar />
      <div className="projects-container">
        <div className="projects-header">
          <div>
            <h1>Projects</h1>
            <p>Manage and collaborate on research projects</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateDialog(true)}>
            <Plus size={18} />
            New Project
          </button>
        </div>

        <div className="projects-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <span className={`badge badge-${project.status}`}>{project.status}</span>
                {project.priority && (
                  <span className={`badge badge-priority-${project.priority}`}>
                    {project.priority}
                  </span>
                )}
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              
              {project.createdByName && (
                <div className="project-created-by">
                  Created by: {project.createdByName}
                </div>
              )}
              
              {project.progress !== undefined && (
                <div className="progress-bar">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="progress">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="project-meta">
                {project.department && (
                  <div className="meta-item">
                    <FolderOpen size={16} />
                    <span>{project.department}</span>
                  </div>
                )}
                {project.budget && (
                  <div className="meta-item">
                    <span>{project.budget}</span>
                  </div>
                )}
                {project.endDate && (
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="empty-state">
            <FolderOpen size={48} />
            <h3>No projects found</h3>
            <p>Create your first project to get started</p>
            <button className="btn btn-primary" onClick={() => setShowCreateDialog(true)}>
              <Plus size={18} />
              Create Project
            </button>
          </div>
        )}
      </div>

      {showCreateDialog && (
        <div className="modal-overlay" onClick={() => setShowCreateDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button onClick={() => setShowCreateDialog(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateProject} className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows="4"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Budget</label>
                <input
                  type="text"
                  placeholder="e.g., $50,000"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    value={newProject.department}
                    onChange={(e) => setNewProject({ ...newProject, department: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Institution</label>
                  <input
                    type="text"
                    value={newProject.institution}
                    onChange={(e) => setNewProject({ ...newProject, institution: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
