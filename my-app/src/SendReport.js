import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import ChatModal from './ChatModal';
import './SendReport.css';

function SendReport() {
  const { doctorId } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedReports, setSubmittedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingReports(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/reports/patient', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmittedReports(response.data.reports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setErrors({
        title: !formData.title.trim() ? 'Title is required' : '',
        description: !formData.description.trim() ? 'Description is required' : ''
      });
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('doctorId', doctorId);
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.file) data.append('reportFile', formData.file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/reports', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const reportsResponse = await axios.get('http://localhost:5000/api/reports/patient', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmittedReports(reportsResponse.data.reports);

      setFormData({ title: '', description: '', file: null });
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="send-report-container">
      <h2 className="send-report-main-title">Send Report to Dr. {location.state?.doctorName || 'Selected Doctor'}</h2>
      
      <div className="send-report-form-container">
        <div className="send-report-form-header">
          <h3>🚀 Submit a Professional Report</h3>
          <p>Please provide all required information to submit your medical report</p>
        </div>

        <form onSubmit={handleSubmit} className="send-report-form">
          <div className="send-report-form-group">
            <label className="send-report-label">Report Title *</label>
            <p className="send-report-hint">(Be clear and concise—e.g., "Q3 2024 Financial Performance Analysis")</p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`send-report-input ${errors.title ? 'send-report-error send-report-shake' : ''}`}
              disabled={isSubmitting}
              placeholder="Enter report title"
            />
            {errors.title && <span className="send-report-error-message">{errors.title}</span>}
          </div>
          
          <div className="send-report-form-group">
            <label className="send-report-label">Description *</label>
            <p className="send-report-hint">
              (Provide key details: purpose, methodology, and major findings. Example: 
              "This report evaluates Q3 2024 revenue growth, cost trends, and ROI across key markets...")
            </p>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className={`send-report-textarea ${errors.description ? 'send-report-error send-report-shake' : ''}`}
              disabled={isSubmitting}
              placeholder="Enter detailed description"
            />
            {errors.description && <span className="send-report-error-message">{errors.description}</span>}
          </div>
          
          <div className="send-report-form-group">
            <label className="send-report-label">Upload File (Optional)</label>
            <div className="send-report-file-upload">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                disabled={isSubmitting}
                id="send-report-file-input"
              />
              <label htmlFor="send-report-file-input" className="send-report-file-label">
                📎 Choose File
              </label>
              <span className="send-report-file-name">
                {formData.file ? formData.file.name : 'No file chosen'}
              </span>
            </div>
            <p className="send-report-file-hint">
              <strong>📎 Supported formats:</strong> PDF, JPG, PNG, DOC (Max 5MB)<br />
              (For best results, use a well-structured PDF with headings, charts, and a professional layout.)
            </p>
          </div>

          <div className="send-report-checklist">
            <p><strong>✅ Ensure your report is:</strong></p>
            <ul>
              <li>✔ Formatted professionally (clear headings, branding, readable fonts)</li>
              <li>✔ Data-rich (charts, tables, or visuals where applicable)</li>
              <li>✔ Concise yet comprehensive (balance detail with readability)</li>
            </ul>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="send-report-submit-btn"
          >
            {isSubmitting ? 'Submitting...' : '📤 Submit Report'}
          </button>
        </form>
      </div>

      <div className="send-report-submitted-section">
        <h2 className="send-report-submitted-title">Your Submitted Reports</h2>
        
        {loadingReports ? (
          <p className="send-report-loading">Loading your reports...</p>
        ) : submittedReports.length > 0 ? (
          <div className="send-report-grid">
            {submittedReports.map(report => (
              <div key={report._id} className="send-report-card">
                <div className="send-report-card-header">
                  <h4 className="send-report-card-title">{report.title}</h4>
                  <span className="send-report-card-date">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="send-report-card-description">
                  {report.description.length > 100 
                    ? `${report.description.substring(0, 100)}...` 
                    : report.description}
                </p>
                <div className="send-report-card-footer">
                  {report.filePath && (
                    <a
                      href={`http://localhost:5000/uploads/${report.filePath}`}
                      download
                      className="send-report-download-btn"
                    >
                      Download Attachment
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setShowChatModal(true);
                    }}
                    className="send-report-chat-btn"
                  >
                    Chat with Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="send-report-empty">No reports submitted yet</p>
        )}
      </div>

      {showChatModal && (
        <ChatModal
          report={selectedReport}
          user={{
            id: localStorage.getItem('userId'),
            role: 'patient',
            name: localStorage.getItem('userName') || 'Patient'
          }}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
}

export default SendReport;
