import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Detection from "./Detection";
import Doctor from "./Doctor";
import Contact from "./Contact";
import Dashboard from './Dashboard'; // Dashboard component
import PrivateRoute from './PrivateRoute';  // Import the PrivateRoute component
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

  // Handle login, sets the authentication state to true
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Handle logout, sets the authentication state to false
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        {/* Header component that receives authentication status and logout function */}
        <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />

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
            element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Dashboard />} />} 
          />
        </Routes>

        {/* Footer component */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
