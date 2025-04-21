import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./doctordashboard.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reports");

  // Navigation functions following the same pattern as Doctor.js
  const handleNavigation = (path, state = {}) => {
    navigate(path, { state });
  };

  // Doctor-specific navigation functions
  const handleDoctorRegister = () => 
    handleNavigation("/registerdoctorinapp", { from: "doctorDashboard" });

  const handlePatientReports = () => 
    handleNavigation("/doctor-reports", { from: "doctorDashboard" });

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    handleNavigation("/doctorlogin");
  };

  // Tab-related navigation functions
  const handleViewAllReports = () => 
    handleNavigation("/doctor-reports", { viewAll: true });

  const handleStartNewChat = () => 
    handleNavigation("/doctor/chat", { newChat: true });

  const handleManageProfile = () => 
    handleNavigation("/doctor/profile");

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <h2>Doctor Dashboard</h2>
      </header>

      <div className="dashboard-grid">
        {/* Left Panel - Existing Buttons */}
        <div className="action-panel">
          <button 
            onClick={handleDoctorRegister} 
            className="action-btn register"
          >
            <i className="icon-user-plus"></i>
            <span>Register Doctor</span>
          </button>
          <button 
            onClick={handlePatientReports} 
            className="action-btn reports"
          >
            <i className="icon-file-text"></i>
            <span>Patient Reports</span>
          </button>
        </div>

        {/* Right Panel - New Tab System */}
        <div className="content-panel">
          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === "reports" ? "active" : ""}`}
              onClick={() => setActiveTab("reports")}
            >
              <i className="icon-inbox"></i>
              Recent Reports
            </button>
            
          </div>

          <div className="tab-content">
            {activeTab === "reports" ? (
              <div className="reports-view">
                <h3>Latest Medical Reports</h3>
                <button 
                  onClick={handleViewAllReports} 
                  className="view-all-btn"
                >
                  View Complete Report History
                </button>
                {/* Reports preview would go here */}
              </div>
            ) : (
              <div className="chat-view">
                <h3>Active Conversations</h3>
                <button 
                  onClick={handleStartNewChat} 
                  className="new-chat-btn"
                >
                  Initiate New Chat
                </button>
                {/* Chats preview would go here */}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        
        <button 
          onClick={handleLogout} 
          className="footer-btn logout"
        >
          <i className="icon-log-out"></i>
          Sign Out
        </button>
      </footer>
    </div>
  );
};

export default DoctorDashboard;
