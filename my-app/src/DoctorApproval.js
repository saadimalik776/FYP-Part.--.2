// DoctorApproval.js (Frontend) - Updated
import React, { useState, useEffect } from "react";
import "./doctorApproval.css";

const DoctorApproval = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Unauthorized: Admin login required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/doctor-registration/pending-doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setPendingDoctors(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error fetching pending doctors:", error);
    }
  };

  const handleApprove = async (doctorId) => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`http://localhost:5000/api/doctor-registration/approve/${doctorId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchPendingDoctors(); // Refresh list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };

  const handleReject = async (doctorId) => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`http://localhost:5000/api/doctor-registration/reject/${doctorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchPendingDoctors(); // Refresh list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error rejecting doctor:", error);
    }
  };

  return (
    <div className="doctor-approval-container">
      <h2>Pending Doctor Requests</h2>
      {pendingDoctors.length === 0 ? (
        <p>No pending doctor requests.</p>
      ) : (
        <ul>
          {pendingDoctors.map((doctor) => (
            <li key={doctor._id}>
              <strong>{doctor.name}</strong> ({doctor.email}) - {doctor.specialization}
              <br />
              <p>Education: {doctor.education}</p>
              <p>Experience: {doctor.experience} years</p>
              <p>License: {doctor.licenseNumber}</p>
              <button onClick={() => handleApprove(doctor.doctorId)}>Approve</button>
<button onClick={() => handleReject(doctor.doctorId)}>Reject</button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorApproval;
