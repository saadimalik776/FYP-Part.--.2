import React, { useState } from "react";
import "./Detection.css";

function Detection() {
  const [showProcessing, setShowProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    setShowProcessing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      setResult({
        prediction: data.prediction,
      });

    } catch (e) {
      setError(e.message || "Failed to connect to the server. Please try again.");
      console.error("API Error:", e);
    } finally {
      setShowProcessing(false);
    }
  };

  return (
    <div className="detection-container">
      <h1 className="detection-title">🖼️ Diabetic Retinopathy Detection</h1>
      
      <div className="detection-file-input-wrapper">
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*" 
          className="detection-file-input"
        />
      </div>
      
      <button 
        onClick={handleUpload} 
        disabled={!file || showProcessing}
        className="detection-upload-button"
      >
        {showProcessing ? (
          <span className="detection-button-text">Processing...</span>
        ) : (
          <span className="detection-button-text">📤 Upload Image</span>
        )}
      </button>
      
      {showProcessing && (
        <div className="detection-processing-message">
          ⏳ Processing image... (This may take a moment)
          <div className="detection-processing-bar">
            <div className="detection-processing-bar-fill"></div>
          </div>
        </div>
      )}
      
      {result && (
        <div className="detection-result-container">
          <h2>✅ Prediction Result</h2>
          <p><strong>Classification:</strong> {result.prediction}</p>
        </div>
      )}
      
      {error && (
        <div className="detection-error-message">
          ❌ Error: {error}
          <br />
          <small>Make sure the backend server is running on port 5000</small>
        </div>
      )}
    </div>
  );
}

export default Detection;
