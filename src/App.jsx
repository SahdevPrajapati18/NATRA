import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header/Header.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import LoginPage from './components/LoginPage/LoginPage.jsx';
import ProfilePage from './components/ProfilePage/ProfilePage.jsx';
import AboutPage from './components/AboutPage/AboutPage.jsx';
import DestinationsPage from './components/DestinationsPage/DestinationsPage.jsx';
import HotelsPage from './components/HotelsPage/HotelsPage.jsx';
import OffersPage from './components/OffersPage/OffersPage.jsx';
import MembershipsPage from './components/MembershipsPage/MembershipsPage.jsx';
import MorePage from './components/MorePage/MorePage.jsx';
import Footer from './components/Footer/Footer.jsx';
import RoomsPage from './components/RoomsPage/RoomsPage.jsx';
import SingleRoomPage from './components/SingleRoomPage/SingleRoomPage.jsx';
import { AuthProvider, useAuth } from './components/LoginPage/authHandler.jsx';

// Main App Content Component (wrapped by AuthProvider)
function AppContent() {
    const [currentPage, setCurrentPage] = useState('home');
    const [theme, setTheme] = useState('light');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [navigationContext, setNavigationContext] = useState(null);
    const mainRef = useRef(null);
    
    // Get auth state from context
    const { user, loading, isAuthenticated, signOutUser } = useAuth();

    // Theme Management Effect
    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // Navigation Function with enhanced context handling
    const onNavigate = (page, context = null) => {
        setNavigationContext(context);

        if (context && context.room) {
            setSelectedRoom(context.room);
        }

        // Enhanced navigation with GSAP animation
        if (window.gsap && mainRef.current) {
            window.gsap.to(mainRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    setCurrentPage(page);
                    window.scrollTo(0, 0);
                    window.gsap.to(mainRef.current, {
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                    });
                }
            });
        } else {
            setCurrentPage(page);
            window.scrollTo(0, 0);
        }
    };

    // Enhanced Profile Navigation Handler
    const handleProfileNavigation = () => {
        if (isAuthenticated()) {
            onNavigate('profile');
        } else {
            onNavigate('login');
        }
    };

    // Enhanced Sign Out Handler
    const handleSignOut = async () => {
        const result = await signOutUser();
        if (result.success) {
            onNavigate('home');
        }
    };

    // Auto-redirect authenticated users away from login page
    useEffect(() => {
        if (isAuthenticated() && currentPage === 'login') {
            onNavigate('profile');
        }
    }, [user, currentPage, isAuthenticated]);

    // Page Rendering Logic with Enhanced Auth Handling
    const renderPage = () => {
        if (loading) {
            return (
                <div className="loading-screen">
                    <div className="loading-container">
                        <div className="loading-screen-text cinzel-font">NATRA</div>
                        <div className="loading-spinner"></div>
                        <p>Preparing your experience...</p>
                    </div>
                </div>
            );
        }

        switch (currentPage) {
            case 'more':
                return <MorePage />;
            
            case 'memberships':
                return <MembershipsPage />;
            
            case 'offers':
                return <OffersPage />;
            
            case 'hotels':
                return <HotelsPage onNavigate={onNavigate} context={navigationContext} />;
            
            case 'rooms':
                return <RoomsPage onNavigate={onNavigate} />;
            
            case 'singleRoom':
                return <SingleRoomPage room={selectedRoom} onNavigate={onNavigate} />;
            
            case 'login':
                // Redirect authenticated users
                if (isAuthenticated()) {
                    setTimeout(() => onNavigate('profile'), 50);
                    return (
                        <div className="loading-screen">
                            <p>Redirecting to profile...</p>
                        </div>
                    );
                }
                return <LoginPage onNavigate={onNavigate} />;
            
            case 'profile':
                // Enhanced profile page handling
                if (!isAuthenticated()) {
                    setTimeout(() => onNavigate('login'), 50);
                    return (
                        <div className="loading-screen">
                            <div className="loading-container">
                                <p>Authentication required</p>
                                <p>Redirecting to login...</p>
                            </div>
                        </div>
                    );
                }
                return (
                    <ProfilePage 
                        user={user} 
                        onNavigate={onNavigate}
                        onSignOut={handleSignOut}
                    />
                );
            
            case 'about':
                return <AboutPage />;
            
            case 'destinations':
                return <DestinationsPage onNavigate={onNavigate} />;
            
            case 'home':
            default:
                return <HomePage onNavigate={onNavigate} />;
        }
    };

    // Enhanced Header Props
    const headerProps = {
        onNavigate,
        user,
        theme,
        toggleTheme,
        onProfileClick: handleProfileNavigation,
        onSignOut: handleSignOut,
        isAuthenticated: isAuthenticated()
    };

    // Main Render
    return (
        <div className="antialiased">
            {!loading && currentPage !== 'login' && (
                <Header {...headerProps} />
            )}
            
            <main ref={mainRef}>
                {renderPage()}
            </main>
            
            {!loading && currentPage !== 'login' && <Footer />}
            
            {/* Optional: Authentication Status Indicator for Development */}
            {process.env.NODE_ENV === 'development' && (
                <div className="auth-debug-indicator">
                    <small>
                        Auth: {isAuthenticated() ? `✓ ${user?.displayName || user?.email}` : '○ Guest'}
                    </small>
                </div>
            )}
        </div>
    );
}

// Main App Component with Auth Provider
export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

// Enhanced Loading Screen Styles (add to your CSS)
/*
.loading-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.loading-container {
    text-align: center;
    padding: 2rem;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 1rem auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.auth-debug-indicator {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    z-index: 1000;
}

.dark-theme .auth-debug-indicator {
    background: rgba(255, 255, 255, 0.7);
    color: black;
}
*/