import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to Diabeto-Vision</h1>
      <div className="button-container">
        <button 
          className="left-button" 
          onClick={() => navigate("/doctor")}
        >
          Doctor
        </button>
        <button 
          className="right-button" 
          onClick={() => navigate("/detection")}
        >
          Detection
        </button>
      </div>
    </div>
  );
}

export default Home;

