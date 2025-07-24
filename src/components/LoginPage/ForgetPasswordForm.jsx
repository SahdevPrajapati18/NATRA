import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase'; 
import './ForgetPasswordForm.css';// adjust path based on your structure

const ForgotPasswordForm = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-form">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <button type="submit">Send Reset Email</button>
            </form>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <button onClick={onBackToLogin} className="back-link">
                ← Back to Login
            </button>
        </div>
    );
};

export default ForgotPasswordForm;
