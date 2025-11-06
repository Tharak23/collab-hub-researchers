import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, FileText, MessageSquare, BookOpen, CheckCircle, Zap } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Users size={32} />,
      title: 'Collaborative Research',
      description: 'Work together seamlessly with researchers from around the world'
    },
    {
      icon: <FileText size={32} />,
      title: 'Document Management',
      description: 'Version control and secure sharing of research documents'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Task Tracking',
      description: 'Organize milestones and track project progress efficiently'
    },
    {
      icon: <MessageSquare size={32} />,
      title: 'In-Context Communication',
      description: 'Discuss projects and documents with contextual messaging'
    },
    {
      icon: <BookOpen size={32} />,
      title: 'Research Papers',
      description: 'Share and review academic research papers'
    },
    {
      icon: <Zap size={32} />,
      title: 'Fast & Efficient',
      description: 'Streamlined workflow for maximum productivity'
    }
  ];

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">R</div>
            <span>ResearchHub</span>
          </div>
          <nav className="header-nav">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Collaborate on Research Projects</h1>
          <p>
            A comprehensive platform for researchers, students, and academics to collaborate,
            share knowledge, and track project progress.
          </p>
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                Start Researching
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2>Why ResearchHub?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta">
          <h2>Ready to get started?</h2>
          <p>Join thousands of researchers collaborating on ResearchHub</p>
          <Link to="/login" className="btn btn-primary btn-lg">
            Join Now
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2024 ResearchHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;

