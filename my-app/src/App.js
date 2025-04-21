import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Detection from "./Detection";
import Doctor from "./Doctor";
import Contact from "./Contact";
import Dashboard from "./Dashboard";
import VerifyEmail from "./VerifyEmail";
import PrivateRoute from "./PrivateRoute";
import AdminLogin from "./adminlogin";
import AdminDashboard from "./admindashboard";
import DoctorRegister from "./doctorRegister";
import DoctorLogin from "./doctorLogin";
import DoctorDashboard from "./doctorDashboard";
import UserActivity from "./UserActivity";
import DoctorActivity from "./DoctorActivity";
import RegisterDoctor from "./registerdoctorinapp";
import DoctorApproval from "./DoctorApproval";
import PatientReports from "./patientReports";
import SendReport from "./SendReport";
import ChatWithDoctor from "./ChatWithDoctor";
import DoctorReports from "./DoctorReports";
import DoctorChat from "./DoctorChat";
import ChatModal from "./ChatModal";
import './base.css';        
import './header.css';      
import './footer.css';      
import './buttons.css';     
import './form.css';        
import './container.css';   
import './progress.css';   
import './flipcards.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [chatData, setChatData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("doctorToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("doctorId");
  };

  const handleVerifyEmail = () => {
    setIsEmailVerified(true);
  };

  const openChat = (reportData) => {
    setChatData(reportData);
  };

  return (
    <Router>
      <div className="App">
        <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/useractivity" element={<UserActivity />} />
          
          {/* Doctor Routes */}
          <Route path="/doctorRegister" element={<DoctorRegister />} />
          <Route path="/doctorLogin" element={<DoctorLogin />} />
          <Route path="/doctorDashboard" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<DoctorDashboard />} />} />
          <Route path="/doctoractivity" element={<DoctorActivity />} />
          <Route path="/registerdoctorinapp" element={<RegisterDoctor />} /> 
          <Route path="/patientReports" element={<PatientReports />} /> 
          <Route path="/doctorapproval" element={<DoctorApproval />} />  
          
          {/* Corrected Chat Route */}
          <Route 
            path="/chat/:doctorId" 
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ChatWithDoctor />
              </PrivateRoute>
            } 
          />
          
          {/* Send Report Route */}
          <Route 
            path="/send-report/:doctorId" 
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <SendReport openChat={openChat} />
              </PrivateRoute>
            } 
          />
          
          {/* Modified Doctor Reports Route */}
          <Route 
            path="/doctor-reports" 
            element={
              <PrivateRoute 
                isAuthenticated={!!localStorage.getItem("doctorToken")} 
                redirectPath="/doctorLogin"
              >
                <DoctorReports openChat={openChat} />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/doctor/chat" 
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <DoctorChat />
              </PrivateRoute>
            } 
          />

          {/* Verification route */}
          <Route 
            path="/verify-email" 
            element={<VerifyEmail onVerify={handleVerifyEmail} />} 
          />

          {/* Protected routes */}
          <Route 
            path="/detection" 
            element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Detection />} />} 
          />
          <Route 
            path="/doctor" 
            element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Doctor />} />} 
          />
          
          {/* Dashboard route */}
          <Route 
            path="/dashboard" 
            element={<PrivateRoute isAuthenticated={isAuthenticated && isEmailVerified} element={<Dashboard />} />} 
          />
        </Routes>

        {/* Global Chat Modal - Rendered when chatData exists */}
        {chatData && (
          <ChatModal
            report={chatData}
            onClose={() => setChatData(null)}
            user={{
              id: localStorage.getItem(localStorage.getItem("doctorToken") ? "doctorId" : "userId"),
              role: localStorage.getItem("doctorToken") ? "doctor" : "patient",
              name: localStorage.getItem("userName") || "User"
            }}
          />
        )}

        <Footer />
      </div>
    </Router>
  );
}

export default App;
