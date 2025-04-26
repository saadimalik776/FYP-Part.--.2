import React from 'react';
import FlipCards from "./FlipCards";
import './App.css';
import './flipcards.css';

function Home() {
  return (
    <>
      <div className="home-container">
        <h1>Welcome to Diabeto-Vision</h1>
        <div className="project-description">
          <p>A cutting-edge platform for diabetic retinopathy detection using AI</p>
          <p>Seamless integration between patients and ophthalmologists</p>
          <p>Early detection to prevent vision loss through advanced screening</p>
        </div>
      </div>
      <FlipCards />
    </>
  );
}

export default Home;

