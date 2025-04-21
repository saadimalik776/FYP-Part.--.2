import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./doctorRegister.css";

function DoctorRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/doctor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Doctor registered successfully!");
        navigate("/doctorLogin");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="doctor-register-container">
      <div className="register-card">
        <h2 className="register-title">Doctor Registration</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-btn">Register</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="login-redirect">
          <p>Do you have already an account?</p>
          <button 
            className="login-btn" 
            onClick={() => navigate("/doctorLogin")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorRegister;
