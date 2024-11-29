import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Detection from "./Detection";
import Doctor from "./Docter"; 
import Contact from "./Contact" // Change to Doctor component instead of Contact for "Doctor" page
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/doctor" element={<Doctor />} />
          {/* Protected routes for Detection and Doctor */}
          <Route 
            path="/detection" 
            element={isAuthenticated ? <Detection /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/doctor" 
            element={isAuthenticated ? <Doctor /> : <Navigate to="/login" />} 
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App; 
