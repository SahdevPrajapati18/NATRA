// ForgotPasswordForm.jsx
import React, { useState } from "react";
import { useAuth } from "./authHandler.jsx"; // adjust path as needed

const ForgotPasswordForm = ({ onNavigate }) => {
  const { resetPassword, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await resetPassword(email);
    if (result.success) {
      setStatus(result.message);
    } else {
      setStatus(result.error);
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      {status && <p>{status}</p>}
      <p style={{ marginTop: "1rem" }}>
        Remembered?{" "}
        <button type="button" onClick={() => onNavigate("login")}>
          Back to Login
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
