import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./doctor.css";

function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/doctor-profile/approved")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch doctors");
        return response.json();
      })
      .then((data) => {
        console.log("Fetched doctors:", data);
        setDoctors(data);
      })
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  const handleSendReport = () => {
    if (!selectedDoctor?._id) {
      console.error("No doctor selected");
      return;
    }
    
    navigate(`/send-report/${selectedDoctor._id}`, {
      state: { 
        doctorName: selectedDoctor.doctorId?.name || "Doctor" 
      }
    });
  };

  const handleStartChat = () => {
    if (!selectedDoctor?._id) {
      console.error("No doctor selected");
      return;
    }
    
    navigate(`/chat/${selectedDoctor._id}`, {
      state: { 
        doctorName: selectedDoctor.doctorId?.name || "Doctor" 
      }
    });
  };

  return (
    <div className="doctor-page">
      {/* Hero Section */}
      <div className="doctor-header">
        <div className="overlay">
          <h1>Experienced & Trusted Doctors</h1>
          <p>Meet our certified medical professionals, approved by the admin.</p>
        </div>
      </div>

      {/* Doctor Selection Area */}
      <div className="doctor-list">
        <h2>Our Doctors</h2>
        
        {/* Doctor Cards Grid */}
        <div className="doctor-cards">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div 
                key={doctor._id} 
                className={`doctor-card ${selectedDoctor?._id === doctor._id ? "selected" : ""}`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="doctor-avatar">
                  {doctor.profileImage ? (
                    <img src={`/uploads/${doctor.profileImage}`} alt={doctor.doctorId?.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {doctor.doctorId?.name?.charAt(0).toUpperCase() || "D"}
                    </div>
                  )}
                </div>
                
                <h3>{doctor.doctorId?.name || "Unknown Doctor"}</h3>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Clinic:</strong> {doctor.clinicAddress}</p>
                
                <div className="rating-badge">⭐ 4.8</div>
              </div>
            ))
          ) : (
            <p>No approved doctors available.</p>
          )}
        </div>

        {/* Action Buttons */}
        {selectedDoctor && (
          <div className="action-buttons">
            <button 
              className="btn send-report-btn"
              onClick={handleSendReport}
            >
              📄 Send Medical Report & Chat With Doctor
            </button>
           
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctor;
