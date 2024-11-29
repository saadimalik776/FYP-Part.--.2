import React, { useState } from 'react';
import './App.css';

function Detection() {
  const [showProcessing, setShowProcessing] = useState(false);

  const handleUpload = () => {
    setShowProcessing(true);
  };

  return (
    <div className="container">
      <h1>Image Detection</h1>
      <input type="file" />
      <button onClick={handleUpload}>Upload Image</button>
      
      {showProcessing && (
        <div>
          <div className="processing-bar">
            <div className="processing-bar-fill"></div>
          </div>
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
}

export default Detection;
