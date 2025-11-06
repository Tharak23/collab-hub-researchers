import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Send, MessageSquare, User, Search } from 'lucide-react';
import { messagesAPI, usersAPI, syncWithBackend } from '../utils/api';
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
    
    // Refresh messages periodically when a user is selected
    if (selectedUser) {
      const interval = setInterval(() => {
        loadMessages();
      }, 2000); // Refresh every 2 seconds
      return () => clearInterval(interval);
    }
  }, [user, selectedUser]);

  const loadMessages = async () => {
    if (!user) return;
    
    try {
      // Try to load from API first
      try {
        const apiMessages = await messagesAPI.getAll();
        setMessages(apiMessages);
        // Also save to localStorage as backup
        localStorage.setItem(`messages_${user.id}`, JSON.stringify(apiMessages));
      } catch (apiError) {
        console.warn('API not available, loading from localStorage:', apiError);
        // Fallback to localStorage
        const storedMessages = localStorage.getItem(`messages_${user.id}`) || '[]';
        setMessages(JSON.parse(storedMessages));
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      const storedMessages = localStorage.getItem(`messages_${user.id}`) || '[]';
      setMessages(JSON.parse(storedMessages));
    }
  };

  const loadUsers = async () => {
    try {
      // Try to load from API first
      try {
        const users = await usersAPI.getAll();
        localStorage.setItem('globalAllUsers', JSON.stringify(users));
        setAllUsers(users.filter(u => u.id !== user?.id));
      } catch (apiError) {
        console.warn('API not available, loading from localStorage:', apiError);
        // Fallback to localStorage
        const storedUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
        setAllUsers(storedUsers.filter(u => u.id !== user?.id));
      }
    } catch (err) {
      console.error('Error loading users:', err);
      const storedUsers = JSON.parse(localStorage.getItem('globalAllUsers') || '[]');
      setAllUsers(storedUsers.filter(u => u.id !== user?.id));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      // Try to send via API first
      try {
        await messagesAPI.send(selectedUser.id, newMessage);
        // Reload messages to get updated list
        await loadMessages();
      } catch (apiError) {
        console.warn('API not available, saving to localStorage:', apiError);
        // Fallback to localStorage
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
        localStorage.setItem(`messages_${user.id}`, JSON.stringify(updatedMessages));
        setMessages(updatedMessages);

        // Also save to recipient's messages
        const recipientMessages = JSON.parse(localStorage.getItem(`messages_${selectedUser.id}`) || '[]');
        recipientMessages.push(messageData);
        localStorage.setItem(`messages_${selectedUser.id}`, JSON.stringify(recipientMessages));
      }

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  const getConversationWith = async (otherUser) => {
    if (!otherUser || !user) return [];
    
    try {
      // Try to load conversation from API
      try {
        const conversation = await messagesAPI.getConversation(otherUser.id);
        return conversation;
      } catch (apiError) {
        // Fallback to localStorage
        return messages.filter(msg => 
          (msg.from === user.id && msg.to === otherUser.id) ||
          (msg.from === otherUser.id && msg.to === user.id)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      }
    } catch (err) {
      // Fallback to localStorage
      return messages.filter(msg => 
        (msg.from === user.id && msg.to === otherUser.id) ||
        (msg.from === otherUser.id && msg.to === user.id)
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
  };

  // State for conversation messages
  const [conversationMessages, setConversationMessages] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      getConversationWith(selectedUser).then(msgs => {
        setConversationMessages(msgs);
      });
    }
  }, [selectedUser, messages]);

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
                  // Get last message from current messages
                  const userMessages = messages.filter(msg => 
                    (msg.from === user?.id && msg.to === otherUser.id) ||
                    (msg.from === otherUser.id && msg.to === user?.id)
                  );
                  const lastMessage = userMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                  
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
                  {conversationMessages.length > 0 ? (
                    conversationMessages.map((msg) => (
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
