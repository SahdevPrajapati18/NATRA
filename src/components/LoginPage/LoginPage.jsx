import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from './firebase.jsx'; // Ensure these are correctly exported
import './LoginForm.css';

export function EnhancedLoginForm({ toggleView, onNavigate, setView }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            onNavigate('home'); // Navigate to home or dashboard
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form-container">
            <h2>Login to Your Account</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="auth-form-links">
                <p>
                    Don’t have an account?{' '}
                    <button onClick={toggleView} className="link-button">Sign Up</button>
                </p>
                <p>
                    <button onClick={() => setView('forgot')} className="link-button">
                        Forgot Password?
                    </button>
                </p>
            </div>
        </div>
    );
}
