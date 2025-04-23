import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState(""); // User must enter email
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerification = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      setErrorMessage("Please enter a valid 6-digit verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), verificationCode: verificationCode.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message);
        alert("✅ Email successfully verified! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // ✅ Redirect to login page
        }, 2000);
      } else {
        setErrorMessage(result.message || "❌ Invalid verification code.");
      }
    } catch (error) {
      setErrorMessage("❌ An error occurred during verification. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Email Verification</h2>
      <p>A 6-digit verification code has been sent to your email. Please check your inbox.</p>

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength="6"
        />
      </div>

      <button onClick={handleVerification} disabled={loading}>
        {loading ? "Verifying..." : "Submit"}
      </button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
}

export default VerifyEmail;
