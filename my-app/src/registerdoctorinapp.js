import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./doctorRegistration.css"; // Make sure the CSS file exists

function RegisterDoctorInApp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    specialization: "",
    licenseNumber: "",
    clinicAddress: "",
    availabilityDays: [],
    availabilityTime: "",
    consultationFee: "",
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      availabilityDays: checked
        ? [...prevState.availabilityDays, name]
        : prevState.availabilityDays.filter((day) => day !== name),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("doctorToken");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/doctor-registration/register-details",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      navigate("/doctorDashboard"); // Redirect to DoctorDashboard after successful submission
    } catch (error) {
      console.error("Error submitting doctor details:", error);
      alert("Failed to submit details. Please try again.");
    }
  };

  return (
    <div className="doctor-registration-container">
      <h2>Doctor Registration</h2>
      <form onSubmit={handleSubmit}>
        <h3>Basic Details</h3>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />

        <h3>Education & Experience</h3>
        <input type="text" name="education" placeholder="Highest Education" onChange={handleChange} required />
        <input type="text" name="experience" placeholder="Years of Experience" onChange={handleChange} required />
        <input type="text" name="specialization" placeholder="Specialization" onChange={handleChange} required />
        <input type="text" name="licenseNumber" placeholder="Medical License Number" onChange={handleChange} required />
        <input type="text" name="clinicAddress" placeholder="Clinic Address" onChange={handleChange} required />

        <h3>Availability</h3>
        <div className="availability-options">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <label key={day}>
              <input type="checkbox" name={day} onChange={handleCheckboxChange} /> {day}
            </label>
          ))}
        </div>

        <h3>Additional Information</h3>
        <input type="text" name="availabilityTime" placeholder="Available Time (e.g., 9 AM - 5 PM)" onChange={handleChange} required />
        <input type="number" name="consultationFee" placeholder="Consultation Fee" onChange={handleChange} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default RegisterDoctorInApp;
