import React, { useState } from 'react';
import './App.css';

function Detection() {
  const [showProcessing, setShowProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setShowProcessing(true);  // Show processing state
    setError(null);  // Clear any previous errors

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      console.log('Response status:', response.status);  // Log the status

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);  // Log error details
        setError(errorData.error || "An error occurred while processing.");
        return;
      }

      const data = await response.json();
      console.log("Backend Response:", data);  // Log the response

      if (data.prediction && data.confidence !== undefined) {
        setResult({
          prediction: data.prediction,
          confidence: data.confidence.toFixed(2),  // Format confidence to 2 decimal places
        });
      } else {
        setError("Invalid prediction response.");
      }
    } catch (e) {
      console.error("Upload Error:", e);  // Log the error details
      setError("An error occurred while uploading the image. Please try again.");
    } finally {
      setShowProcessing(false);  // Hide processing state
    }
  };

  return (
    <div className="container">
      <h1>Image Detection</h1>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>

      {showProcessing && (
        <div>
          <div className="processing-bar">
            <div className="processing-bar-fill"></div>
          </div>
          <p>Processing...</p>
        </div>
      )}

      {result && (
        <div>
          <h2>Prediction Result</h2>
          <p>Prediction: {result.prediction}</p>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Detection;
