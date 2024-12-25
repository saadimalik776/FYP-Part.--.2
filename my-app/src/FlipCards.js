import React from "react";
import "./flipcards.css";
import b1 from "./b1.jpg";
import b2 from "./b2.jpg";
import b3 from "./b3.jpg";

const FlipCards = () => {
  return (
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <h2>Diabeto-Vision</h2>
            <p>Diabeto Vision is a tool that detects diabetic retinopathy using AI and fundus images.</p>
          </div>
          <div className="flip-card-back">
            <img src={b1} alt="Backside 1" className="back-image" />
          </div>
        </div>
      </div>

      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <h2>What does Diabetic Vision do?</h2>
            <p>It analyzes retinal images to detect and grade diabetic retinopathy severity.</p>
          </div>
          <div className="flip-card-back">
            <img src={b2} alt="Backside 2" className="back-image" />
          </div>
        </div>
      </div>

      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <h2>How to Use This Website?</h2>
            <p>To use this website, simply upload a retinal image. The website will analyze the image and provide a diagnosis of diabetic retinopathy.</p>
          </div>
          <div className="flip-card-back">
            <img src={b3} alt="Backside 3" className="back-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCards;
