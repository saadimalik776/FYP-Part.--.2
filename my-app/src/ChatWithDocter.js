import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './chat.css';

function ChatWithDoctor() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  // Stable auth check that prevents redirect loops
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (!token || !userData) {
          return false;
        }
        
        // Additional validation if needed
        const parsedData = JSON.parse(userData);
        if (!parsedData?.id) {
          return false;
        }
        
        return true;
      } catch (err) {
        return false;
      }
    };

    const authValid = checkAuth();
    setIsAuthenticated(authValid);
    
    if (!authValid) {
      console.log('Authentication failed - redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Load messages only after auth is confirmed
  useEffect(() => {
    if (!isAuthenticated || !doctorId) return;

    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData'));

    const loadMessages = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const res = await axios.get(
          `http://localhost:5000/api/chat/conversation/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal
          }
        );

        clearTimeout(timeout);
        setMessages(res.data.messages || []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
        } else {
          setError(err.message || 'Failed to load messages');
        }
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Socket connection
    socketRef.current = io('http://localhost:5000', {
      auth: { token },
      query: { userId: userData.id, doctorId }
    });

    socketRef.current.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [isAuthenticated, doctorId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData'));

    try {
      const tempId = Date.now();
      setMessages(prev => [...prev, {
        _id: tempId,
        content: newMessage,
        sender: { _id: userData.id, name: userData.username },
        createdAt: new Date()
      }]);
      setNewMessage('');

      await axios.post(
        'http://localhost:5000/api/chat/send',
        {
          participantId: doctorId,
          content: newMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (err) {
      setError('Failed to send message');
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg) => {
          const userData = JSON.parse(localStorage.getItem('userData'));
          const isSent = msg.sender._id === userData.id;
          
          return (
            <div 
              key={msg._id} 
              className={`message ${isSent ? 'sent' : 'received'}`}
            >
              {!isSent && <span className="sender-name">{msg.sender.name}</span>}
              <p>{msg.content}</p>
              <span className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-area">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          placeholder="Type your message..."
          rows="1"
        />
        <button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWithDoctor;
