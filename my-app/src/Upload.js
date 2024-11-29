import React from "react";
import './App.css';

function Upload({ setCurrentPage }) {
  const handleUpload = () => {
    // Add upload logic here
    setCurrentPage("loading"); // Navigate to Loading after upload
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <input type="file" />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;
