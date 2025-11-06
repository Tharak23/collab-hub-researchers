import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load user from API session first
    const loadUser = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        } else {
          // Fallback to localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (error) {
              console.error('Error parsing stored user:', error);
            }
          }
        }
      } catch (error) {
        console.warn('API not available, loading from localStorage:', error);
        // Fallback to localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
      } finally {
    setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      // First, check if user exists in local storage (case-insensitive)
      const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
      let existingUser = allUsers.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());

      // If user exists, verify password
      if (existingUser) {
        // Check password (in production, this should be hashed)
        if (existingUser.password && existingUser.password !== password) {
          throw new Error('Invalid password');
        }

        // Update user data
        const userData = {
          ...existingUser,
          email: email,
          // Keep password for future logins
          password: existingUser.password || password
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        addToAllUsers(userData);

        // Try API login for backend sync
        try {
          const response = await authAPI.login(email, password);
          if (response.success && response.user) {
            // Update with backend data
            const updatedUser = { ...userData, ...response.user };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            addToAllUsers(updatedUser);
            
            // Sync users list with backend
            try {
              const { usersAPI, syncWithBackend } = await import('../utils/api');
              await syncWithBackend();
            } catch (syncError) {
              console.warn('Could not sync users:', syncError);
            }
          }
        } catch (apiError) {
          console.warn('API login failed, using local storage:', apiError);
        }

        return userData;
      }

      // Try API login first for new users
      try {
        const response = await authAPI.login(email, password);
        if (response.success && response.user) {
          const userData = {
            ...response.user,
            password: password // Store password for future logins
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          addToAllUsers(userData);
          
          // Sync users list with backend
          try {
            const { usersAPI, syncWithBackend } = await import('../utils/api');
            await syncWithBackend();
          } catch (syncError) {
            console.warn('Could not sync users:', syncError);
          }
          
          return userData;
        }
      } catch (apiError) {
        console.warn('API login failed:', apiError);
      }

      // If user doesn't exist, throw error to prompt registration
      throw new Error('User not found. Please sign up first.');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const addToAllUsers = (userData) => {
    const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
    
    // Check if user already exists
    const existingIndex = allUsers.findIndex(u => u.email === userData.email);
    
    if (existingIndex >= 0) {
      // Update existing user
      allUsers[existingIndex] = userData;
    } else {
      // Add new user
      allUsers.push(userData);
    }
    
    localStorage.setItem('globalAllUsers', JSON.stringify(allUsers));
  };

  const logout = async () => {
    try {
      // Try API logout
      await authAPI.logout();
    } catch (error) {
      console.warn('API logout failed, clearing local storage:', error);
    }
    
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (profileData) => {
    try {
      // Try API update
      if (user?.id) {
        try {
          const updated = await authAPI.updateProfile(user.id, profileData);
          if (updated) {
            setUser(updated);
            localStorage.setItem('user', JSON.stringify(updated));
            addToAllUsers(updated);
            return updated;
          }
        } catch (apiError) {
          console.warn('API update failed, using local storage:', apiError);
        }
      }

      // Fallback to localStorage
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    addToAllUsers(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
