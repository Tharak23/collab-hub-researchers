import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load remembered credentials on mount
  useEffect(() => {
    const remembered = localStorage.getItem('rememberedCredentials');
    if (remembered) {
      try {
        const credentials = JSON.parse(remembered);
        if (credentials.rememberMe !== false) {
          setEmail(credentials.email || '');
          setPassword(credentials.password || '');
          setRememberMe(true);
        }
      } catch (err) {
        console.error('Error loading remembered credentials:', err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      // Check if user exists (case-insensitive email match)
      const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
      const user = allUsers.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setError('No account found with this email. Please sign up first.');
        setLoading(false);
        return;
      }

      // Check password (in production, this should be hashed)
      if (user.password && user.password !== password) {
        setError('Incorrect password. Please try again.');
        setLoading(false);
        return;
      }

      // Save credentials if remember me is checked
      if (rememberMe) {
        const credentials = {
          email: email,
          password: password,
          rememberMe: true
        };
        localStorage.setItem('rememberedCredentials', JSON.stringify(credentials));
      } else {
        localStorage.removeItem('rememberedCredentials');
      }

      // Login user
      try {
        await login(email, password);
        // Navigate to dashboard on success
        navigate('/dashboard');
      } catch (loginError) {
        // Handle login errors
        if (loginError.message) {
          setError(loginError.message);
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
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
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your research workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="login-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>

        <div className="login-footer">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

