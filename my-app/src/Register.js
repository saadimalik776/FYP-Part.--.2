// Register.js
import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onRegister) {
      onRegister(); // Call the function passed as a prop
    } else {
      console.error("onRegister function is not defined");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login" className="link">Login here</Link></p>
      </form>
    </div>
  );
}

export default Register;
