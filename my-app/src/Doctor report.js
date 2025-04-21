import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatModal from './ChatModal';
import './DoctorReports.css';
const DoctorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('doctorToken');
      if (!token) {
        navigate('/doctorLogin');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/reports/doctor', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setReports(response.data.reports || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError(error.response?.data?.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error Loading Reports</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="doctor-reports-container">
      <h1>Patient Reports</h1>
      
      {reports.length > 0 ? (
        <div className="reports-list">
          {reports.map(report => (
            <div key={report._id} className="report-card">
              <div className="report-header">
                <h2>{report.title}</h2>
                <span className="date">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="report-content">
                <p className="description">{report.description}</p>
                
                <div className="patient-info">
                  <div className="info-row">
                    <span className="label">Patient ID:</span>
                    <span className="value id">{report.patient?._id || 'Not available'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{report.patient?.email || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              {report.filePath && (
                <div className="report-footer">
                  <a
                    href={`http://localhost:5000/uploads/${report.filePath}`}
                    download
                    className="download-btn"
                  >
                    Download Attachment
                  </a>
                </div>
              )}

              <button 
                onClick={() => {
                  setSelectedReport(report);
                  setShowChatModal(true);
                }}
                className="chat-btn"
              >
                Chat with Patient
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-reports">
          <p>No reports available</p>
        </div>
      )}

      {showChatModal && (
        <ChatModal
          report={selectedReport}
          user={{ 
            id: localStorage.getItem('doctorId'), 
            role: 'doctor',
            name: localStorage.getItem('doctorName')
          }}
          onClose={() => setShowChatModal(false)}
        />
      )}

      <style jsx>{`
        .doctor-reports-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        h1 {
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
        }
        
        .reports-list {
          display: grid;
          gap: 20px;
        }
        
        .report-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 20px;
          transition: transform 0.2s;
        }
        
        .report-card:hover {
          transform: translateY(-3px);
        }
        
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        
        .report-header h2 {
          margin: 0;
          color: #3498db;
          font-size: 1.3rem;
        }
        
        .date {
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .description {
          color: #34495e;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .patient-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          margin-top: 20px;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 8px;
        }
        
        .label {
          font-weight: 600;
          min-width: 100px;
          color: #2c3e50;
        }
        
        .value {
          color: #34495e;
          word-break: break-word;
        }
        
        .id {
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          color: #e74c3c;
        }
        
        .download-btn {
          display: inline-block;
          background: #3498db;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          margin-top: 15px;
          transition: background 0.2s;
        }
        
        .download-btn:hover {
          background: #2980b9;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
        }
        
        .error {
          text-align: center;
          padding: 20px;
          background: #ffecec;
          border-radius: 8px;
          color: #e74c3c;
        }
        
        .error button {
          background: #3498db;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .no-reports {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
        }

        .chat-btn {
          background: #9b59b6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          margin-top: 10px;
          cursor: pointer;
          display: block;
          width: 100%;
          
        }
      `}</style>
    </div>
  );
};

export default DoctorReports;
