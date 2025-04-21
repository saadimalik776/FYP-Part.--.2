import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './DoctorChat.css';  
function DoctorChat() {
  const { patientId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');
    
    // Listen for new messages
    socketRef.current.on('message', (message) => {
      if (message.patientId === activePatient) {
        setMessages(prev => [...prev, message]);
      }
    });
    
    // Load doctor's patient list
    const loadPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chat/patients', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('doctorToken')}`
          }
        });
        setPatients(response.data);
        if (response.data.length > 0 && !activePatient) {
          setActivePatient(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error loading patients:', error);
      }
    };
    
    loadPatients();
    
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // Load chat history when active patient changes
    const loadChatHistory = async () => {
      if (!activePatient) return;
      
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/history/doctor/${activePatient}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('doctorToken')}`
          }
        });
        setMessages(response.data);
        
        // Join room with patientId
        socketRef.current.emit('joinRoom', { patientId: activePatient });
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    
    loadChatHistory();
  }, [activePatient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePatient) return;
    
    const message = {
      patientId: activePatient,
      content: newMessage,
      sender: 'doctor',
      timestamp: new Date().toISOString()
    };
    
    socketRef.current.emit('sendMessage', message);
    setNewMessage('');
  };

  return (
    <div className="doctor-chat-container">
      <h2>Patient Chats</h2>
      
      <div className="chat-layout">
        {/* Patient list sidebar */}
        <div className="patient-list">
          <h3>Active Patients</h3>
          {patients.length === 0 ? (
            <p>No active patients</p>
          ) : (
            <ul>
              {patients.map(patient => (
                <li 
                  key={patient._id} 
                  className={activePatient === patient._id ? 'active' : ''}
                  onClick={() => setActivePatient(patient._id)}
                >
                  <span className="patient-name">{patient.name}</span>
                  <span className="last-message">
                    {patient.lastMessage?.substring(0, 30)}...
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Chat area */}
        <div className="chat-area">
          {activePatient ? (
            <>
              <div className="chat-header">
                <h3>Chat with {patients.find(p => p._id === activePatient)?.name || 'Patient'}</h3>
              </div>
              
              <div className="messages-container">
                {messages.length === 0 ? (
                  <p className="no-messages">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === 'doctor' ? 'sent' : 'received'}`}>
                      <p>{msg.content}</p>
                      <span className="timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={!activePatient}
                />
                <button type="submit" disabled={!activePatient}>Send</button>
              </form>
            </>
          ) : (
            <div className="no-patient-selected">
              <p>Select a patient to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorChat;
