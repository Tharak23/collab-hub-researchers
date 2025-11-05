import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import Navbar from '../components/Navbar';
import { Users, Search, UserPlus, UserCheck, UserX, Mail } from 'lucide-react';
import './Collaborators.css';

const Collaborators = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [researchers, setResearchers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResearchers();
    loadConnections();
    loadPendingRequests();
  }, [user]);

  const loadResearchers = () => {
    // Get ALL real users who have logged in
    const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
    // Exclude current user
    setResearchers(allUsers.filter(u => u.id !== user?.id));
  };

  const loadConnections = () => {
    const stored = localStorage.getItem(`connections_${user?.id}`);
    setConnections(stored ? JSON.parse(stored) : []);
  };

  const loadPendingRequests = () => {
    const stored = localStorage.getItem(`pendingRequests_${user?.id}`);
    setPendingRequests(stored ? JSON.parse(stored) : []);
  };

  const saveConnections = (newConnections) => {
    localStorage.setItem(`connections_${user?.id}`, JSON.stringify(newConnections));
    setConnections(newConnections);
  };

  const savePendingRequests = (newRequests) => {
    localStorage.setItem(`pendingRequests_${user?.id}`, JSON.stringify(newRequests));
    setPendingRequests(newRequests);
  };

  const sendConnectionRequest = (researcher) => {
    // Check if already connected or request pending
    if (connections.some(c => c.id === researcher.id)) return;
    if (pendingRequests.some(r => r.id === researcher.id)) return;

    // Add to pending requests
    const newRequests = [...pendingRequests, { 
      ...researcher, 
      status: 'pending', 
      sentAt: new Date().toISOString() 
    }];
    savePendingRequests(newRequests);

    // Save request for the other user to receive
    const theirRequests = JSON.parse(
      localStorage.getItem(`pendingRequests_${researcher.id}`) || '[]'
    );
    theirRequests.push({
      ...user,
      status: 'pending',
      sentAt: new Date().toISOString(),
      from: user.id
    });
    localStorage.setItem(`pendingRequests_${researcher.id}`, JSON.stringify(theirRequests));

    // Send notification
    addNotification({
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${user?.firstName} ${user?.lastName} sent you a connection request`,
      from: user?.id,
      fromName: `${user?.firstName} ${user?.lastName}`,
      actionRequired: true
    });

    alert('Connection request sent!');
  };

  const acceptRequest = (request) => {
    // Add to connections
    const newConnections = [...connections, request];
    saveConnections(newConnections);

    // Add to their connections too
    const theirConnections = JSON.parse(
      localStorage.getItem(`connections_${request.id}`) || '[]'
    );
    theirConnections.push(user);
    localStorage.setItem(`connections_${request.id}`, JSON.stringify(theirConnections));

    // Remove from pending
    const newRequests = pendingRequests.filter(r => r.id !== request.id);
    savePendingRequests(newRequests);

    addNotification({
      type: 'connection_accepted',
      title: 'Connection Accepted',
      message: `You are now connected with ${request.firstName} ${request.lastName}`,
      from: request.id
    });
  };

  const rejectRequest = (request) => {
    const newRequests = pendingRequests.filter(r => r.id !== request.id);
    savePendingRequests(newRequests);
  };

  const removeConnection = (connection) => {
    const newConnections = connections.filter(c => c.id !== connection.id);
    saveConnections(newConnections);

    // Remove from their connections too
    const theirConnections = JSON.parse(
      localStorage.getItem(`connections_${connection.id}`) || '[]'
    );
    const updatedTheirConnections = theirConnections.filter(c => c.id !== user.id);
    localStorage.setItem(`connections_${connection.id}`, JSON.stringify(updatedTheirConnections));
  };

  const isConnected = (researcherId) => connections.some(c => c.id === researcherId);
  const isPending = (researcherId) => pendingRequests.some(r => r.id === researcherId);

  const filteredResearchers = researchers.filter(r => {
    if (r.id === user?.id) return false; // Don't show current user
    const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || 
           (r.institution && r.institution.toLowerCase().includes(search)) ||
           (r.department && r.department.toLowerCase().includes(search));
  });

  return (
    <div className="collaborators-page">
      <Navbar />
      <div className="collaborators-container">
        <div className="collaborators-header">
          <div>
            <h1>Collaborators</h1>
            <p>Connect with researchers and build your network</p>
          </div>
        </div>

        {/* Connection Requests */}
        {pendingRequests.length > 0 && (
          <div className="section">
            <h2>Pending Requests ({pendingRequests.length})</h2>
            <div className="requests-grid">
              {pendingRequests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="researcher-info">
                    <div className="researcher-avatar">
                      {request.firstName[0]}{request.lastName[0]}
                    </div>
                    <div>
                      <h3>{request.firstName} {request.lastName}</h3>
                      <p className="researcher-role">{request.role}</p>
                      <p className="researcher-institution">{request.institution || 'ResearchHub'}</p>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => acceptRequest(request)}>
                      <UserCheck size={16} />
                      Accept
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => rejectRequest(request)}>
                      <UserX size={16} />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Connections */}
        {connections.length > 0 && (
          <div className="section">
            <h2>My Connections ({connections.length})</h2>
            <div className="researchers-grid">
              {connections.map((connection) => (
                <div key={connection.id} className="researcher-card">
                  <div className="researcher-avatar">
                    {connection.firstName[0]}{connection.lastName[0]}
                  </div>
                  <h3>{connection.firstName} {connection.lastName}</h3>
                  <p className="researcher-role">{connection.role}</p>
                  <p className="researcher-institution">{connection.institution || 'ResearchHub'}</p>
                  <p className="researcher-department">{connection.department || 'Research'}</p>
                  <div className="researcher-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => removeConnection(connection)}>
                      <UserX size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Researchers */}
        <div className="section">
          <h2>Discover Researchers ({filteredResearchers.length})</h2>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, institution, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="researchers-grid">
            {filteredResearchers.map((researcher) => (
              <div key={researcher.id} className="researcher-card">
                <div className="researcher-avatar">
                  {researcher.firstName[0]}{researcher.lastName[0]}
                </div>
                <h3>{researcher.firstName} {researcher.lastName}</h3>
                <p className="researcher-role">{researcher.role}</p>
                <p className="researcher-institution">{researcher.institution || 'ResearchHub'}</p>
                <p className="researcher-department">{researcher.department || 'Research'}</p>
                <div className="researcher-actions">
                  {isConnected(researcher.id) ? (
                    <button className="btn btn-secondary btn-sm" disabled>
                      <UserCheck size={16} />
                      Connected
                    </button>
                  ) : isPending(researcher.id) ? (
                    <button className="btn btn-secondary btn-sm" disabled>
                      <UserPlus size={16} />
                      Pending
                    </button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => sendConnectionRequest(researcher)}>
                      <UserPlus size={16} />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredResearchers.length === 0 && (
            <div className="empty-state">
              <Users size={48} />
              <h3>No researchers found</h3>
              <p>
                {researchers.length === 0 || researchers.length === 1
                  ? 'No other users have registered yet. Try logging in with different accounts!'
                  : 'Try adjusting your search criteria'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collaborators;
