import React from 'react';
import { Link } from 'react-router-dom';  // Link to navigate to other parts of the app

function Dashboard() {
  return (
    <div className="container">
      <h2>Welcome to Your Dashboard</h2>
      <p>This is your dashboard. You can manage your account here.</p>

      {/* Links to other sections of the app */}
      <div>
        <Link to="/profile" className="link-button">Go to Profile</Link>
        <Link to="/settings" className="link-button">Go to Settings</Link>
      </div>

      {/* Logout Button (You can add actual logout functionality here) */}
      <button onClick={() => alert('Logging out...')} className="link-button">Logout</button>
    </div>
  );
}

export default Dashboard;
