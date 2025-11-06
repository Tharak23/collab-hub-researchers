import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Check, Circle, CheckSquare } from 'lucide-react';
import './Tasks.css';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    loadTasks();
  }, [user]);

  const loadTasks = () => {
    const storedTasks = localStorage.getItem(`tasks_${user?.id}`);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      // Initialize with dummy data if no tasks exist
      initializeDummyData();
    }
  };

  // Initialize dummy data for demonstration
  const initializeDummyData = () => {
    const dummyTasks = [
      {
        id: '1',
        title: 'Review research paper on machine learning',
        completed: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        category: 'Research'
      },
      {
        id: '2',
        title: 'Prepare presentation slides for conference',
        completed: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        category: 'Presentation'
      },
      {
        id: '3',
        title: 'Write abstract for journal submission',
        completed: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        category: 'Writing'
      },
      {
        id: '4',
        title: 'Update project documentation',
        completed: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'low',
        category: 'Administrative'
      },
      {
        id: '5',
        title: 'Schedule meeting with research team',
        completed: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        category: 'Meeting'
      },
      {
        id: '6',
        title: 'Analyze experimental data results',
        completed: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        category: 'Analysis'
      },
      {
        id: '7',
        title: 'Submit grant proposal application',
        completed: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        category: 'Administrative'
      },
      {
        id: '8',
        title: 'Respond to peer review comments',
        completed: true,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        category: 'Review'
      }
    ];
    saveTasks(dummyTasks);
  };

  const saveTasks = (updatedTasks) => {
    localStorage.setItem(`tasks_${user?.id}`, JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    setNewTaskTitle('');
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  // Enhanced utility functions for better task management
  const markAllAsComplete = () => {
    const updatedTasks = tasks.map(task => ({
      ...task,
      completed: true,
      completedAt: task.completed ? task.completedAt : new Date().toISOString()
    }));
    saveTasks(updatedTasks);
  };

  const markAllAsActive = () => {
    const updatedTasks = tasks.map(task => ({
      ...task,
      completed: false,
      completedAt: undefined
    }));
    saveTasks(updatedTasks);
  };

  const clearCompleted = () => {
    const updatedTasks = tasks.filter(task => !task.completed);
    saveTasks(updatedTasks);
  };

  const duplicateTask = (taskId) => {
    const taskToDuplicate = tasks.find(task => task.id === taskId);
    if (taskToDuplicate) {
      const duplicatedTask = {
        ...taskToDuplicate,
        id: Date.now().toString(),
        title: `${taskToDuplicate.title} (Copy)`,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: undefined
      };
      const updatedTasks = [...tasks, duplicatedTask];
      saveTasks(updatedTasks);
    }
  };

  const editTask = (taskId, newTitle) => {
    if (!newTitle.trim()) return;
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle.trim(), updatedAt: new Date().toISOString() } : task
    );
    saveTasks(updatedTasks);
  };

  const updateTaskPriority = (taskId, priority) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, priority } : task
    );
    saveTasks(updatedTasks);
  };

  const updateTaskCategory = (taskId, category) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, category } : task
    );
    saveTasks(updatedTasks);
  };

  const searchTasks = (searchQuery) => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      (task.category && task.category.toLowerCase().includes(query))
    );
  };

  const sortTasksByPriority = (taskList) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return [...taskList].sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 0;
      const priorityB = priorityOrder[b.priority] || 0;
      return priorityB - priorityA;
    });
  };

  const sortTasksByDate = (taskList, order = 'newest') => {
    return [...taskList].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const getTasksByCategory = (category) => {
    return tasks.filter(task => task.category === category);
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const priorityCounts = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };

    const categoryCounts = tasks.reduce((acc, task) => {
      const category = task.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      completed,
      active,
      completionRate,
      priorityCounts,
      categoryCounts
    };
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_${user?.id}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importTasks = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (Array.isArray(importedTasks)) {
          // Merge with existing tasks, avoiding duplicates
          const existingIds = new Set(tasks.map(t => t.id));
          const newTasks = importedTasks.filter(t => !existingIds.has(t.id));
          const updatedTasks = [...tasks, ...newTasks];
          saveTasks(updatedTasks);
          return true;
        }
      } catch (error) {
        console.error('Error importing tasks:', error);
        return false;
      }
    };
    reader.readAsText(file);
  };

  const resetToDummyData = () => {
    if (window.confirm('This will replace all your current tasks with dummy data. Are you sure?')) {
      initializeDummyData();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="tasks-page">
      <Navbar />
      <div className="tasks-container">
        <div className="tasks-header">
          <div>
            <h1>Tasks</h1>
            <p>Manage your to-do list and track progress</p>
          </div>
        </div>

        <div className="tasks-stats">
          <div className="stat-item">
            <Circle size={20} />
            <span>{activeCount} Active</span>
          </div>
          <div className="stat-item">
            <Check size={20} />
            <span>{completedCount} Completed</span>
          </div>
          <div className="stat-item">
            <CheckSquare size={20} />
            <span>{tasks.length} Total</span>
          </div>
        </div>

        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="task-input"
          />
          <button type="submit" className="btn btn-primary">
            <Plus size={18} />
            Add Task
          </button>
        </form>

        <div className="task-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="tasks-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <button
                  className="task-checkbox"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? (
                    <Check size={18} />
                  ) : (
                    <Circle size={18} />
                  )}
                </button>
                <span className="task-title">{task.title}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <CheckSquare size={48} />
              <h3>No tasks found</h3>
              <p>
                {filter === 'all' 
                  ? 'Add your first task to get started' 
                  : `No ${filter} tasks`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
