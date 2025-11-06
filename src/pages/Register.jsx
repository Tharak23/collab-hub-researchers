import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User } from 'lucide-react';
import './Login.css'; // Reuse Login styles

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Check if user already exists (case-insensitive)
      const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
      const existingUser = allUsers.find(u => u.email && u.email.toLowerCase() === formData.email.toLowerCase().trim());
      
      if (existingUser) {
        setError('An account with this email already exists. Please login instead.');
        setLoading(false);
        return;
      }

      // Create new user with unique ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userData = {
        id: userId,
        email: formData.email.toLowerCase().trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        password: formData.password, // In production, this should be hashed
        role: 'researcher',
        institution: 'ResearchHub University',
        department: 'Computer Science',
        createdAt: new Date().toISOString()
      };

      // Save user to all users list
      allUsers.push(userData);
      localStorage.setItem('globalAllUsers', JSON.stringify(allUsers));

      // Save credentials for remember me
      const credentials = {
        email: formData.email,
        password: formData.password,
        rememberMe: true
      };
      localStorage.setItem('rememberedCredentials', JSON.stringify(credentials));

      // Auto-login the new user
      await login(formData.email, formData.password);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">R</div>
            <span>ResearchHub</span>
          </div>
          <h1>Create Account</h1>
          <p>Sign up to join the research community</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                <User size={18} />
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                <User size={18} />
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password (min 6 characters)"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <Lock size={18} />
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>

        <div className="login-footer">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

