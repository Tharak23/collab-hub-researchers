import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Mail, Building, GraduationCap, Save } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    institution: user?.institution || '',
    department: user?.department || '',
    bio: user?.bio || ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      institution: user?.institution || '',
      department: user?.department || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={64} />
          </div>
          <div className="profile-info">
            <h1>{user?.firstName} {user?.lastName}</h1>
            <p>{user?.email}</p>
            <span className="badge badge-success">{user?.role}</span>
          </div>
          {!isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <div className="profile-content">
          <div className="card">
            <div className="card-header">
              <h2>Personal Information</h2>
            </div>
            <div className="card-body">
              {!isEditing ? (
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">
                      <User size={18} />
                      <span>First Name</span>
                    </div>
                    <div className="info-value">{user?.firstName}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      <User size={18} />
                      <span>Last Name</span>
                    </div>
                    <div className="info-value">{user?.lastName}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      <Mail size={18} />
                      <span>Email</span>
                    </div>
                    <div className="info-value">{user?.email}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      <Building size={18} />
                      <span>Institution</span>
                    </div>
                    <div className="info-value">{user?.institution || 'Not set'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      <GraduationCap size={18} />
                      <span>Department</span>
                    </div>
                    <div className="info-value">{user?.department || 'Not set'}</div>
                  </div>
                  <div className="info-item full-width">
                    <div className="info-label">
                      <span>Bio</span>
                    </div>
                    <div className="info-value">{user?.bio || 'No bio yet'}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="edit-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Institution</label>
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

