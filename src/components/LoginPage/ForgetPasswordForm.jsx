import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import './ForgotPasswordForm.css'; // Optional: add styling if needed

const ForgotPasswordForm = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ loading: false, message: '', error: '' });

    const handleReset = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', error: '' });

        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            setStatus({ loading: false, message: 'Password reset email sent! Check your inbox.', error: '' });
        } catch (error) {
            setStatus({ loading: false, message: '', error: error.message });
        }
    };

    return (
        <div className="forgot-password-form">
            <h2>Reset Your Password</h2>
            <p>Enter your registered email to receive a password reset link.</p>

            <form onSubmit={handleReset}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={status.loading}>
                    {status.loading ? 'Sending...' : 'Send Reset Email'}
                </button>
            </form>

            {status.message && <p className="success-message">{status.message}</p>}
            {status.error && <p className="error-message">{status.error}</p>}

            <button onClick={onBackToLogin} className="back-to-login-btn">
                &larr; Back to Login
            </button>
        </div>
    );
};

export default ForgotPasswordForm;
