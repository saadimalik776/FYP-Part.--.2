import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ onLogout, isAuthenticated }) {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Handle logo click to navigate to home
  const handleLogoClick = () => {
    navigate('/'); // Navigate to the home page
  };

  // Handle logout to navigate to the login page
  const handleLogout = () => {
    onLogout(); // Call logout function to update authentication state
    navigate('/login'); // Navigate to login page
  };

  return (
    <header className="header">
      {/* Logo with click event */}
      <div className="logo" onClick={handleLogoClick}>
        Diabeto-Vision
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/detection">Detection</Link>
        <Link to="/doctor">Doctor</Link>
        <Link to="/contact">Contact</Link> {/* Link for Contact */}
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button> // Calls handleLogout for logout
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;



