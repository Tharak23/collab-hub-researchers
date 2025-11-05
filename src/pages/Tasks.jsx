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
    }
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
