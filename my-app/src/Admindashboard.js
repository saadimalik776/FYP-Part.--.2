import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admindashboard.css";

const AdminDashboard = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Unauthorized: Admin login required.");
      navigate("/adminlogin");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/doctor/pending-doctors", {
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
      const response = await fetch(`http://localhost:5000/api/doctor/approve-doctor/${doctorId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Doctor approved successfully");
        fetchPendingDoctors();
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
      const response = await fetch(`http://localhost:5000/api/doctor/reject-doctor/${doctorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Doctor rejected successfully");
        fetchPendingDoctors();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error rejecting doctor:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <button className="logout-btn" onClick={() => {
          localStorage.removeItem("adminToken");
          navigate("/adminlogin");
        }}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-buttons">
          <button className="dashboard-btn user-btn" onClick={() => navigate("/useractivity")}>
            <i className="fas fa-users"></i>
            <span>User Activity</span>
          </button>
          <button className="dashboard-btn doctor-btn" onClick={() => navigate("/doctoractivity")}>
            <i className="fas fa-user-md"></i>
            <span>Doctor Activity</span>
          </button>
          <button className="dashboard-btn approval-btn" onClick={() => navigate("/doctorapproval")}>
            <i className="fas fa-clipboard-check"></i>
            <span>Doctor Approval</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
