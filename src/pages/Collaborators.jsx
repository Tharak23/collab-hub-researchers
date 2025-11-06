import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import Navbar from '../components/Navbar';
import { Users, Search, UserPlus, UserCheck, UserX, Mail } from 'lucide-react';
import './Collaborators.css';

const Collaborators = () => {
  const { user } = useAuth();
  const { addNotification, addNotificationToUser } = useNotifications();
  const [researchers, setResearchers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResearchers();
    loadConnections();
    loadPendingRequests();
    loadSentRequests();
    
    // Refresh periodically
    const interval = setInterval(() => {
      loadResearchers();
      loadPendingRequests();
      loadSentRequests();
    }, 3000); // Refresh every 3 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  const loadResearchers = async () => {
    try {
      // Try to load from API first
      try {
        const { usersAPI } = await import('../utils/api');
        const users = await usersAPI.getAll();
        localStorage.setItem('globalAllUsers', JSON.stringify(users));
        setResearchers(users.filter(u => u.id !== user?.id));
      } catch (apiError) {
        console.warn('API not available, loading from localStorage:', apiError);
        // Fallback to localStorage
        const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
        setResearchers(allUsers.filter(u => u.id !== user?.id));
      }
    } catch (err) {
      console.error('Error loading researchers:', err);
      const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
      setResearchers(allUsers.filter(u => u.id !== user?.id));
    }
  };

  const loadConnections = () => {
    const stored = localStorage.getItem(`connections_${user?.id}`);
    setConnections(stored ? JSON.parse(stored) : []);
  };

  const loadPendingRequests = () => {
    if (!user || !user.id) return;
    try {
      const stored = localStorage.getItem(`pendingRequests_${user.id}`);
      const allRequests = stored ? JSON.parse(stored) : [];
      
      // Filter to only show requests RECEIVED by this user (sent by others)
      // A request is received if: r.from !== user.id (sent by someone else) OR r.to === user.id
      const receivedRequests = allRequests.filter(r => {
        // Must have a from field that is not the current user
        if (r.from && r.from !== user.id) {
          return true;
        }
        // Or must have a to field matching current user
        if (r.to === user.id) {
          return true;
        }
        // Or if id is the sender's id (not current user)
        if (r.id && r.id !== user.id) {
          // Check if this id belongs to another user (not current user)
          const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
          const requester = allUsers.find(u => u.id === r.id);
          if (requester && requester.id !== user.id) {
            return true;
          }
        }
        return false;
      });
      
      setPendingRequests(receivedRequests);
    } catch (err) {
      console.error('Error loading pending requests:', err);
      setPendingRequests([]);
    }
  };

  const loadSentRequests = () => {
    if (!user || !user.id) return;
    // Check all users' pending requests to find ones sent by current user
    const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
    const sent = [];
    allUsers.forEach(otherUser => {
      if (otherUser.id === user.id || !otherUser.id) return;
      try {
        const theirRequests = JSON.parse(localStorage.getItem(`pendingRequests_${otherUser.id}`) || '[]');
        const myRequest = theirRequests.find(r => 
          (r.from === user.id) || 
          (r.id === user.id) || 
          (r.sentBy === user.id) ||
          (r.id && r.id === user.id)
        );
        if (myRequest && otherUser.id) {
          sent.push({
            ...otherUser,
            status: 'pending',
            sentAt: myRequest.sentAt || new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Error loading sent requests for user:', otherUser.id, err);
      }
    });
    setSentRequests(sent);
  };

  const saveConnections = (newConnections) => {
    if (!user) return;
    localStorage.setItem(`connections_${user.id}`, JSON.stringify(newConnections));
    setConnections(newConnections);
  };

  const savePendingRequests = (newRequests) => {
    if (!user) return;
    localStorage.setItem(`pendingRequests_${user.id}`, JSON.stringify(newRequests));
    setPendingRequests(newRequests);
  };

  const sendConnectionRequest = (researcher) => {
    if (!user || !user.id) {
      alert('Please login to send connection requests');
      return;
    }
    
    if (!researcher || !researcher.id) {
      alert('Invalid user selected');
      return;
    }
    
    // Check if already connected
    if (connections.some(c => c.id === researcher.id)) {
      alert('Already connected with this user!');
      return;
    }
    
    // Check if request already sent
    if (sentRequests.some(r => r.id === researcher.id)) {
      alert('Request already sent!');
      return;
    }

    try {
      // Save request for the other user to receive
      const theirRequests = JSON.parse(
        localStorage.getItem(`pendingRequests_${researcher.id}`) || '[]'
      );
      
      // Check if request already exists
      const existingRequest = theirRequests.find(r => 
        r.from === user.id || 
        r.id === user.id || 
        r.sentBy === user.id
      );
      if (existingRequest) {
        alert('Request already sent!');
        return;
      }

      // Create request data with all user information
      const requestData = {
        id: user.id, // This is the sender's ID
        from: user.id, // Sender ID
        to: researcher.id, // Recipient ID
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role || 'Researcher',
        institution: user.institution || 'ResearchHub',
        department: user.department || '',
        status: 'pending',
        sentAt: new Date().toISOString(),
        sentBy: user.id
      };
      
      // Check if request already exists
      const existingIndex = theirRequests.findIndex(r => 
        r.from === user.id || 
        r.id === user.id || 
        r.sentBy === user.id
      );
      
      if (existingIndex === -1) {
        theirRequests.push(requestData);
        localStorage.setItem(`pendingRequests_${researcher.id}`, JSON.stringify(theirRequests));
      } else {
        // Update existing request
        theirRequests[existingIndex] = requestData;
        localStorage.setItem(`pendingRequests_${researcher.id}`, JSON.stringify(theirRequests));
      }

      // Add to sent requests for current user
      const newSentRequests = [...sentRequests, {
        ...researcher,
        status: 'pending',
        sentAt: new Date().toISOString()
      }];
      setSentRequests(newSentRequests);

      // Send notification to the recipient
      addNotificationToUser(researcher.id, {
        type: 'connection_request',
        title: 'New Connection Request',
        message: `${user.firstName} ${user.lastName} wants to connect with you`,
        from: user.id,
        fromName: `${user.firstName} ${user.lastName}`,
        to: researcher.id,
        actionRequired: true
      });

      // Show confirmation to sender
      addNotification({
        type: 'connection_request_sent',
        title: 'Connection Request Sent',
        message: `Connection request sent to ${researcher.firstName} ${researcher.lastName}`,
        read: false
      });

      alert('Connection request sent!');
    } catch (err) {
      console.error('Error sending connection request:', err);
      alert('Failed to send connection request. Please try again.');
    }
  };

  const acceptRequest = (request) => {
    if (!user || !user.id) return;
    
    try {
      // Get the requester ID (the person who sent the request)
      const requesterId = request.from || request.id || request.sentBy;
      if (!requesterId) {
        alert('Invalid request. Cannot find requester information.');
        return;
      }

      // Get requester from all users
      const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
      let requester = allUsers.find(u => u.id === requesterId);
      
      // If not found, use request data
      if (!requester) {
        requester = {
          id: requesterId,
          firstName: request.firstName || 'Unknown',
          lastName: request.lastName || 'User',
          email: request.email || '',
          role: request.role || 'Researcher',
          institution: request.institution || 'ResearchHub',
          department: request.department || ''
        };
      }
      
      // Add to connections
      const newConnections = [...connections, requester];
      saveConnections(newConnections);

      // Add to requester's connections too
      const theirConnections = JSON.parse(
        localStorage.getItem(`connections_${requesterId}`) || '[]'
      );
      if (!theirConnections.some(c => c.id === user.id)) {
        theirConnections.push({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          institution: user.institution,
          department: user.department
        });
        localStorage.setItem(`connections_${requesterId}`, JSON.stringify(theirConnections));
      }

      // Remove from pending requests
      const newRequests = pendingRequests.filter(r => {
        const rId = r.from || r.id || r.sentBy;
        return rId !== requesterId;
      });
      savePendingRequests(newRequests);

      // Also remove from localStorage
      const storedRequests = JSON.parse(
        localStorage.getItem(`pendingRequests_${user.id}`) || '[]'
      );
      const updatedStoredRequests = storedRequests.filter(r => {
        const rId = r.from || r.id || r.sentBy;
        return rId !== requesterId;
      });
      localStorage.setItem(`pendingRequests_${user.id}`, JSON.stringify(updatedStoredRequests));

      // Remove from requester's sent requests
      const requesterSentRequests = JSON.parse(
        localStorage.getItem(`pendingRequests_${requesterId}`) || '[]'
      );
      const updatedRequesterSent = requesterSentRequests.filter(r => r.to !== user.id && r.id !== user.id);
      localStorage.setItem(`pendingRequests_${requesterId}`, JSON.stringify(updatedRequesterSent));

      // Remove from current user's sent requests if it exists
      const updatedSentRequests = sentRequests.filter(r => r.id !== requesterId);
      setSentRequests(updatedSentRequests);

      // Send notification to current user
      addNotification({
        type: 'connection_accepted',
        title: 'Connection Accepted',
        message: `You are now connected with ${requester.firstName} ${requester.lastName}`,
        from: requesterId,
        read: false
      });

      // Send notification to requester
      addNotificationToUser(requesterId, {
        type: 'connection_accepted',
        title: 'Connection Request Accepted',
        message: `${user.firstName} ${user.lastName} accepted your connection request`,
        from: user.id,
        fromName: `${user.firstName} ${user.lastName}`,
        read: false
      });

      alert(`Connected with ${requester.firstName} ${requester.lastName}!`);
    } catch (err) {
      console.error('Error accepting request:', err);
      alert('Failed to accept connection request. Please try again.');
    }
  };

  const rejectRequest = (request) => {
    if (!user || !user.id) return;
    
    try {
      const requesterId = request.from || request.id || request.sentBy;
      if (!requesterId) {
        alert('Invalid request. Cannot find requester information.');
        return;
      }
      
      // Remove from pending requests
      const newRequests = pendingRequests.filter(r => {
        const rId = r.from || r.id || r.sentBy;
        return rId !== requesterId;
      });
      savePendingRequests(newRequests);

      // Also remove from localStorage
      const storedRequests = JSON.parse(
        localStorage.getItem(`pendingRequests_${user.id}`) || '[]'
      );
      const updatedStoredRequests = storedRequests.filter(r => {
        const rId = r.from || r.id || r.sentBy;
        return rId !== requesterId;
      });
      localStorage.setItem(`pendingRequests_${user.id}`, JSON.stringify(updatedStoredRequests));

      // Remove from requester's sent requests
      const requesterSentRequests = JSON.parse(
        localStorage.getItem(`pendingRequests_${requesterId}`) || '[]'
      );
      const updatedRequesterSent = requesterSentRequests.filter(r => 
        r.to !== user.id && r.id !== user.id
      );
      localStorage.setItem(`pendingRequests_${requesterId}`, JSON.stringify(updatedRequesterSent));
      
      alert('Connection request declined');
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert('Failed to decline connection request. Please try again.');
    }
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
  const isPending = (researcherId) => {
    // Check if we sent a request to them
    if (sentRequests.some(r => r.id === researcherId)) return true;
    // Check if they sent a request to us
    if (pendingRequests.some(r => (r.from || r.id) === researcherId)) return true;
    return false;
  };
  const isSent = (researcherId) => sentRequests.some(r => r.id === researcherId);

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

        {/* Connection Requests Received */}
        {pendingRequests.length > 0 && (
          <div className="section">
            <h2>Connection Requests ({pendingRequests.length})</h2>
            <p className="section-description" style={{ marginBottom: '16px', color: 'var(--gray-600)', fontSize: '0.9em' }}>
              You have received connection requests from other researchers
            </p>
            <div className="requests-grid">
              {pendingRequests.map((request) => {
                // Get the requester (the person who sent the request)
                const requesterId = request.from || request.id || request.sentBy;
                const allUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
                let requester = allUsers.find(u => u.id === requesterId);
                
                // If requester not found, try to get from request data itself
                if (!requester) {
                  requester = {
                    id: requesterId,
                    firstName: request.firstName || 'Unknown',
                    lastName: request.lastName || 'User',
                    email: request.email || '',
                    role: request.role || 'Researcher',
                    institution: request.institution || 'ResearchHub',
                    department: request.department || ''
                  };
                }
                
                return (
                  <div key={`req_${requesterId}_${request.sentAt || Date.now()}`} className="request-card">
                    <div className="researcher-info">
                      <div className="researcher-avatar">
                        {requester.firstName?.[0] || 'U'}{requester.lastName?.[0] || ''}
                      </div>
                      <div>
                        <h3>{requester.firstName} {requester.lastName}</h3>
                        <p className="researcher-role">{requester.role || 'Researcher'}</p>
                        <p className="researcher-institution">{requester.institution || 'ResearchHub'}</p>
                        {requester.email && (
                          <p className="researcher-email" style={{ fontSize: '0.85em', color: 'var(--gray-500)', marginTop: '4px' }}>
                            {requester.email}
                          </p>
                        )}
                        {request.sentAt && (
                          <p style={{ fontSize: '0.8em', color: 'var(--gray-400)', marginTop: '4px' }}>
                            {new Date(request.sentAt).toLocaleDateString()}
                          </p>
                        )}
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
                );
              })}
            </div>
          </div>
        )}

        {/* Sent Requests */}
        {sentRequests.length > 0 && (
          <div className="section">
            <h2>Sent Requests ({sentRequests.length})</h2>
            <div className="requests-grid">
              {sentRequests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="researcher-info">
                    <div className="researcher-avatar">
                      {request.firstName?.[0] || 'U'}{request.lastName?.[0] || ''}
                    </div>
                    <div>
                      <h3>{request.firstName} {request.lastName}</h3>
                      <p className="researcher-role">{request.role || 'Researcher'}</p>
                      <p className="researcher-institution">{request.institution || 'ResearchHub'}</p>
                      <p className="text-muted" style={{ fontSize: '0.85em', marginTop: '4px' }}>
                        Status: <span style={{ color: '#f59e0b' }}>Pending</span>
                      </p>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button className="btn btn-secondary btn-sm" disabled>
                      <UserPlus size={16} />
                      Pending
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
                  ) : isSent(researcher.id) ? (
                    <button className="btn btn-secondary btn-sm" disabled>
                      <UserPlus size={16} />
                      Request Sent
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
