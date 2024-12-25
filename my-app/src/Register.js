import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For redirecting after successful registration

  // Input validation
  const validateInputs = () => {
    if (!username.trim()) return "Username is required.";
    if (!email.trim()) return "Email is required.";

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!password.trim()) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters long.";

    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError(null);
        setUsername("");
        setPassword("");
        setEmail("");

        // Instead of redirecting to the verify email page, redirect to login
        navigate("/login"); // Redirect directly to login page after successful registration
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        {/* Username Input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          disabled={loading}
        />
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          disabled={loading}
        />
        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          disabled={loading}
        />
        {/* Submit Button */}
        <button type="submit" disabled={loading} className="button">
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Success Message */}
        {success && (
          <p className="success">
            Registration successful! 🎉 Please login now.
          </p>
        )}

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        <p>
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
