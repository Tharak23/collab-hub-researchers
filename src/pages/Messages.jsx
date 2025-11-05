import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Send, MessageSquare, User, Search } from 'lucide-react';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMessages();
    loadUsers();
  }, [user]);

  const loadMessages = () => {
    if (!user) return;
    const storedMessages = localStorage.getItem(`messages_${user.id}`) || '[]';
    setMessages(JSON.parse(storedMessages));
  };

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
    setAllUsers(storedUsers.filter(u => u.id !== user?.id));
  };

  const saveMessages = (updatedMessages) => {
    if (!user) return;
    localStorage.setItem(`messages_${user.id}`, JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      id: `msg_${Date.now()}`,
      from: user.id,
      fromName: `${user.firstName} ${user.lastName}`,
      to: selectedUser.id,
      toName: `${selectedUser.firstName} ${selectedUser.lastName}`,
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Save to current user's messages
    const updatedMessages = [...messages, messageData];
    saveMessages(updatedMessages);

    // Also save to recipient's messages
    const recipientMessages = JSON.parse(localStorage.getItem(`messages_${selectedUser.id}`) || '[]');
    recipientMessages.push({
      ...messageData,
      from: user.id,
      fromName: `${user.firstName} ${user.lastName}`,
      to: selectedUser.id,
      toName: `${selectedUser.firstName} ${selectedUser.lastName}`
    });
    localStorage.setItem(`messages_${selectedUser.id}`, JSON.stringify(recipientMessages));

    setNewMessage('');
  };

  const getConversationWith = (otherUser) => {
    if (!otherUser || !user) return [];
    return messages.filter(msg => 
      (msg.from === user.id && msg.to === otherUser.id) ||
      (msg.from === otherUser.id && msg.to === user.id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const filteredUsers = allUsers.filter(u =>
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const conversationUsers = [...new Set([
    ...messages.map(m => m.from === user?.id ? m.to : m.from)
  ])].map(userId => allUsers.find(u => u.id === userId)).filter(Boolean);

  return (
    <div className="messages-page">
      <Navbar />
      <div className="messages-container">
        <div className="messages-header">
          <h1>Messages</h1>
          <p>Chat with your collaborators</p>
        </div>

        <div className="messages-layout">
          {/* Users/Conversations List */}
          <div className="messages-sidebar">
            <div className="sidebar-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="conversations-list">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((otherUser) => {
                  const conversation = getConversationWith(otherUser);
                  const lastMessage = conversation[conversation.length - 1];
                  
                  return (
                    <div
                      key={otherUser.id}
                      className={`conversation-item ${selectedUser?.id === otherUser.id ? 'active' : ''}`}
                      onClick={() => setSelectedUser(otherUser)}
                    >
                      <div className="conversation-avatar">
                        {otherUser.firstName?.[0] || 'U'}
                      </div>
                      <div className="conversation-info">
                        <div className="conversation-name">
                          {otherUser.firstName} {otherUser.lastName}
                        </div>
                        {lastMessage && (
                          <div className="conversation-preview">
                            {lastMessage.text.substring(0, 40)}...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <MessageSquare size={32} />
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="messages-main">
            {selectedUser ? (
              <>
                <div className="chat-header">
                  <div className="chat-user-info">
                    <div className="chat-avatar">
                      {selectedUser.firstName?.[0] || 'U'}
                    </div>
                    <div>
                      <h3>{selectedUser.firstName} {selectedUser.lastName}</h3>
                      <p>{selectedUser.email}</p>
                    </div>
                  </div>
                </div>

                <div className="chat-messages">
                  {getConversationWith(selectedUser).length > 0 ? (
                    getConversationWith(selectedUser).map((msg) => (
                      <div
                        key={msg.id}
                        className={`message ${msg.from === user?.id ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">
                          <div className="message-text">{msg.text}</div>
                          <div className="message-time">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-chat">
                      <MessageSquare size={48} />
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="chat-input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="message-input"
                  />
                  <button type="submit" className="send-btn">
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="no-selection">
                <MessageSquare size={64} />
                <h3>Select a user to start chatting</h3>
                <p>Choose someone from the list to begin a conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
