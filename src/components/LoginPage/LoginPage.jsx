import React, { useState } from 'react';
import { EnhancedSignupForm, EnhancedLoginForm } from './authHandler.jsx';
import './LoginPage.css';

// Showcase Panel Component
const ShowcasePanel = ({ onNavigate }) => (
    <div className="auth-showcase">
        <div className="auth-showcase-content">
            <button 
                onClick={() => onNavigate('home')} 
                className="back-to-website-btn"
                aria-label="Back to Home"
            >
                &larr; Back to Home
            </button>
            <div className="auth-logo">
                <img src="/logo.png" alt="NATRA Logo" />
            </div>
            <h1>A Divine Legacy</h1>
            <p className="showcase-description">
                Enter a realm of timeless elegance, where every moment is crafted to perfection. 
                Join us and discover a heritage of unparalleled luxury.
            </p>
            <div className="showcase-features">
                <div className="feature-item">
                    <span className="feature-icon">🏨</span>
                    <span>Exclusive Accommodations</span>
                </div>
                <div className="feature-item">
                    <span className="feature-icon">🌟</span>
                    <span>Premium Experiences</span>
                </div>
                <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <span>Personalized Service</span>
                </div>
            </div>
        </div>
    </div>
);

// Main Enhanced LoginPage Component
export default function EnhancedLoginPage({ onNavigate }) {
    // --- UPDATED: Default view is now 'login' ---
    const [view, setView] = useState('login');

    const toggleView = () => {
        setView(currentView => currentView === 'signup' ? 'login' : 'signup');
    };

    return (
        <div className="auth-page-container">
            <ShowcasePanel onNavigate={onNavigate} />
            
            <div className="auth-form-area">
                <div className="auth-form-wrapper">
                    {view === 'signup' ? (
                        <EnhancedSignupForm 
                            toggleView={toggleView} 
                            onNavigate={onNavigate}
                        />
                    ) : (
                        <EnhancedLoginForm 
                            toggleView={toggleView} 
                            onNavigate={onNavigate}
                        />
                    )}
                </div>
                
                <div className="auth-footer-links">
                    <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                    <span>•</span>
                    <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                    <span>•</span>
                    <a href="#help" onClick={(e) => e.preventDefault()}>Help</a>
                </div>
            </div>
        </div>
    );
}
