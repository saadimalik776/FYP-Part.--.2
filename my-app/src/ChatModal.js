import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatModal = ({ report, user, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!report?._id) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(user.role === 'doctor' ? 'doctorToken' : 'token');
        const res = await axios.get(
          `http://localhost:5000/api/reports/${report._id}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Filter out any messages with invalid senders (additional safety)
        const validMessages = res.data.messages.filter(msg => msg?.sender?._id);
        setMessages(validMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [report?._id, user.role]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const token = localStorage.getItem(user.role === 'doctor' ? 'doctorToken' : 'token');
      const res = await axios.post(
        `http://localhost:5000/api/reports/${report._id}/messages`,
        { content: newMessage },
        { headers: { 
          Authorization: `Bearer ${token}`,
          'X-Doctor-ID': user.role === 'doctor' ? user.id : undefined // Pass doctor ID explicitly
        } }
      );
      
      if (res.data.success && res.data.message) {
        setMessages(prev => [...prev, {
          ...res.data.message,
          sender: {
            _id: user.id, // Use the local user ID for consistency
            name: user.name,
            role: user.role
          }
        }]);
        setNewMessage('');
        scrollToBottom();
      } else {
        throw new Error(res.data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Send Error:', {
        error: err,
        response: err.response?.data
      });
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Verify doctor ID matches report's doctorProfile
  useEffect(() => {
    if (user.role === 'doctor' && report?.doctorProfile) {
      console.log('Doctor verification:', {
        doctorId: user.id,
        reportDoctorProfile: report.doctorProfile
      });
    }
  }, [user, report]);

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          <h3>Chat about: {report?.title || 'Report'}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="chat-messages">
          {isLoading ? (
            <div className="loading-messages">Loading messages...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : messages.length > 0 ? (
            messages.map((msg, index) => {
              // Safely extract sender info with fallbacks
              const senderId = msg.sender?._id || 'unknown';
              const senderName = msg.sender?.name || 'Unknown';
              const senderRole = msg.sender?.role || 'unknown';
              const isSent = senderId === user?.id;

              return (
                <div key={`${senderId}-${index}-${msg.timestamp}`} 
                     className={`message ${isSent ? 'sent' : 'received'}`}>
                  <div className="message-content">
                    <div className="message-sender">
                      {senderName} ({senderRole})
                    </div>
                    <div className="message-text">{msg.content}</div>
                    <div className="message-time">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-messages">No messages yet. Start the conversation!</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading || !!error}
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading || !!error}
          >
            Send
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .chat-modal {
          background: white;
          border-radius: 8px;
          width: 500px;
          max-width: 90%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
        }
        .chat-header {
          padding: 15px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .chat-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
        }
        .loading-messages,
        .no-messages,
        .error-message {
          text-align: center;
          padding: 20px;
        }
        .loading-messages {
          color: #666;
        }
        .no-messages {
          color: #999;
        }
        .error-message {
          color: #e74c3c;
        }
        .message {
          margin-bottom: 15px;
        }
        .message.sent {
          text-align: right;
        }
        .message-content {
          display: inline-block;
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 12px;
          background: #f0f0f0;
        }
        .message.sent .message-content {
          background: #3498db;
          color: white;
        }
        .message-sender {
          font-size: 0.8rem;
          margin-bottom: 4px;
          color: #666;
        }
        .message.sent .message-sender {
          color: rgba(255,255,255,0.8);
        }
        .message-time {
          font-size: 0.7rem;
          margin-top: 4px;
          color: #999;
        }
        .message.sent .message-time {
          color: rgba(255,255,255,0.7);
        }
        .chat-input {
          padding: 15px;
          border-top: 1px solid #eee;
          display: flex;
        }
        .chat-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-right: 10px;
        }
        .chat-input input:disabled {
          background: #f5f5f5;
        }
        .chat-input button {
          padding: 10px 20px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .chat-input button:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ChatModal;
