import { createContext, useContext, useState, useEffect } from 'react';

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
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Demo login - accepts any email/password
    const userId = `user_${Date.now()}`;
    const userData = {
      id: userId,
      email: email,
      firstName: email.split('@')[0],
      lastName: 'User',
      role: 'researcher',
      institution: 'ResearchHub University',
      department: 'Computer Science'
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Add user to global users list
    addToAllUsers(userData);
    
    return userData;
  };

  const addToAllUsers = (userData) => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Check if user already exists
    const existingIndex = allUsers.findIndex(u => u.email === userData.email);
    
    if (existingIndex >= 0) {
      // Update existing user
      allUsers[existingIndex] = userData;
    } else {
      // Add new user
      allUsers.push(userData);
    }
    
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in global users list too
    addToAllUsers(updatedUser);
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
