const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    credentials: 'include', // Include cookies for session
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return response;
  },

  logout: async () => {
    try {
      const response = await apiCall('/auth/logout', {
        method: 'POST'
      });
      return response;
    } catch (error) {
      // If API fails, still return success for local logout
      return { success: true };
    }
  },

  getCurrentUser: async () => {
    const response = await apiCall('/auth/me');
    return response;
  },

  checkSession: async () => {
    const response = await apiCall('/auth/session');
    return response;
  },

  updateProfile: async (userId, profileData) => {
    const response = await apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response.user;
  }
};

// Papers API
export const papersAPI = {
  getAll: async () => {
    const response = await apiCall('/papers');
    return response.papers || [];
  },

  getById: async (id) => {
    const response = await apiCall(`/papers/${id}`);
    return response.paper;
  },

  create: async (paperData, file) => {
    const formData = new FormData();
    formData.append('title', paperData.title);
    formData.append('abstract', paperData.abstract);
    formData.append('authors', paperData.authors || '');
    formData.append('keywords', paperData.keywords || '');
    formData.append('category', paperData.category || 'computer-science');
    
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(`${API_BASE_URL}/papers`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create paper');
    }
    return data.paper;
  },

  update: async (id, updates) => {
    const response = await apiCall(`/papers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.paper;
  },

  delete: async (id) => {
    const response = await apiCall(`/papers/${id}`, {
      method: 'DELETE'
    });
    return response;
  },

  incrementViews: async (id) => {
    const response = await apiCall(`/papers/${id}/view`, {
      method: 'POST'
    });
    return response.paper;
  },

  download: async (id, fileName) => {
    const response = await fetch(`${API_BASE_URL}/papers/${id}/download`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to download paper');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'research-paper.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  addReview: async (id, review) => {
    const response = await apiCall(`/papers/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review)
    });
    return response.paper;
  }
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await apiCall('/users');
    return response.users || [];
  },

  getById: async (id) => {
    const response = await apiCall(`/users/${id}`);
    return response.user;
  },

  update: async (id, updates) => {
    const response = await apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.user;
  }
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    try {
      const response = await apiCall('/projects');
      return response.projects || [];
    } catch (error) {
      // Fallback to localStorage
      const stored = localStorage.getItem('globalProjects');
      return stored ? JSON.parse(stored) : [];
    }
  },

  getById: async (id) => {
    const response = await apiCall(`/projects/${id}`);
    return response.project;
  },

  create: async (projectData) => {
    try {
      const response = await apiCall('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });
      return response.project;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, updates) => {
    const response = await apiCall(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.project;
  },

  delete: async (id) => {
    const response = await apiCall(`/projects/${id}`, {
      method: 'DELETE'
    });
    return response;
  }
};

// Messages API
export const messagesAPI = {
  getAll: async () => {
    try {
      const response = await apiCall('/messages');
      return response.messages || [];
    } catch (error) {
      // Fallback to localStorage
      return [];
    }
  },

  getConversation: async (userId) => {
    try {
      const response = await apiCall(`/messages/conversation/${userId}`);
      return response.messages || [];
    } catch (error) {
      return [];
    }
  },

  send: async (to, text) => {
    try {
      const response = await apiCall('/messages', {
        method: 'POST',
        body: JSON.stringify({ to, text })
      });
      return response.message;
    } catch (error) {
      throw error;
    }
  }
};

// Sync utility to sync localStorage with backend
export const syncWithBackend = async () => {
  try {
    // Sync papers
    try {
      const papers = await papersAPI.getAll();
      localStorage.setItem('globalResearchPapers', JSON.stringify(papers));
    } catch (error) {
      console.log('Could not sync papers:', error);
    }
    
    // Sync projects
    try {
      const projects = await projectsAPI.getAll();
      localStorage.setItem('globalProjects', JSON.stringify(projects));
    } catch (error) {
      console.log('Could not sync projects:', error);
    }
    
    // Sync users
    try {
      const users = await usersAPI.getAll();
      localStorage.setItem('globalAllUsers', JSON.stringify(users));
    } catch (error) {
      // Might fail if not authenticated, that's okay
      console.log('Could not sync users:', error);
    }
    
    return true;
  } catch (error) {
    console.error('Sync error:', error);
    return false;
  }
};

export default {
  authAPI,
  papersAPI,
  usersAPI,
  projectsAPI,
  messagesAPI,
  syncWithBackend
};

