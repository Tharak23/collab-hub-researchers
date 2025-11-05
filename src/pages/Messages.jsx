import Navbar from '../components/Navbar';
import { MessageSquare } from 'lucide-react';
import './EmptyPage.css';

const Messages = () => {
  return (
    <div className="empty-page">
      <Navbar />
      <div className="empty-container">
        <div className="empty-content">
          <MessageSquare size={64} />
          <h1>Messages</h1>
          <p>Messaging feature coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Messages;

