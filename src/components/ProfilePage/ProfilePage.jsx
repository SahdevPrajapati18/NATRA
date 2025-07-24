import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../LoginPage/authHandler.jsx'; // Corrected Path
import { db, appId } from '../LoginPage/firebase.jsx'; // Corrected Path

import './ProfilePage.css';

export default function EnhancedProfilePage({ onNavigate }) {
    const { user, signOutUser, loading } = useAuth();
    const profileCardRef = useRef(null);
    const [isSigningOut, setIsSigningOut] = useState(false);
    
    const [profileStats, setProfileStats] = useState({
        bookingsCount: 0,
        favoriteHotels: 0,
        rewardsPoints: 0,
        loading: true
    });

    // --- Fetch user stats from Firestore ---
    useEffect(() => {
        if (user && !user.isAnonymous && user.uid) {
            const fetchUserStats = async () => {
                const statsRef = doc(db, `artifacts/${appId}/users/${user.uid}/private/stats`);
                
                try {
                    const docSnap = await getDoc(statsRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProfileStats({
                            bookingsCount: data.bookingsCount || 0,
                            favoriteHotels: data.favoriteHotels || 0,
                            rewardsPoints: data.rewardsPoints || 0,
                            loading: false
                        });
                    } else {
                        console.log("No stats document found, using defaults.");
                        setProfileStats(prev => ({ ...prev, loading: false }));
                    }
                } catch (error) {
                    console.error("Error fetching user stats:", error);
                    setProfileStats(prev => ({ ...prev, loading: false }));
                }
            };
            
            fetchUserStats();
        } else {
            setProfileStats(prev => ({ ...prev, loading: false }));
        }
    }, [user]);

    // --- Animate the profile card on component mount with GSAP ---
    useEffect(() => {
        if (user && !loading && profileCardRef.current) {
            gsap.fromTo(
                profileCardRef.current, 
                { y: 50, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
            );
        }
    }, [user, loading]);

    // --- Enhanced sign-out handler with GSAP ---
    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            const result = await signOutUser();
            if (result.success) {
                if (profileCardRef.current) {
                    gsap.to(profileCardRef.current, {
                        y: -30,
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.in',
                        onComplete: () => onNavigate('home')
                    });
                } else {
                    onNavigate('home');
                }
            } else {
                console.error("Sign out failed:", result.error);
                setIsSigningOut(false);
            }
        } catch (error) {
            console.error("Error during sign out:", error);
            setIsSigningOut(false);
        }
    };

    // --- Helper functions ---
    const getUserInitials = () => {
        if (user?.displayName) {
            return user.displayName
                .split(' ')
                .map(name => name.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.charAt(0).toUpperCase() || 'U';
    };

    const formatMemberSince = () => {
        if (user?.joined) {
            return new Date(user.joined).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return 'Recently joined';
    };

    const getMembershipTier = () => {
        if (!user?.joined) return 'Ātman Tier';
        const joinDate = new Date(user.joined);
        const monthsAsMember = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
        
        if (monthsAsMember >= 12) return 'Brahman Tier';
        if (monthsAsMember >= 6) return 'Dharma Tier';
        return 'Ātman Tier';
    };

    // --- Handle loading states for the main user object ---
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user || user.isAnonymous) {
         return (
            <div className="loading-screen">
                <div className="loading-container">
                    <p>Please log in to view your profile.</p>
                    <button onClick={() => onNavigate('login')} className="profile-home-btn">Go to Login</button>
                </div>
            </div>
        );
    }
    
    // --- Main component render ---
    return (
        <div className="profile-page">
            <div className="profile-content">
                <div ref={profileCardRef} className="profile-card">
                    <div 
                        className="profile-header-bg" 
                        style={{ 
                            backgroundImage: "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2940&auto=format&fit=crop')" 
                        }}
                    >
                        <div className="profile-header-overlay"></div>
                    </div>
                    
                    <div className="profile-card-body">
                        <div className="profile-info">
                            <div className="profile-picture-container">
                                <img
                                    src={user.photoURL || `https://placehold.co/128x128/d4af37/FFF?text=${getUserInitials()}`}
                                    alt="Profile"
                                    className="profile-picture"
                                />
                                <div className="profile-status-indicator online"></div>
                            </div>
                            <div className="profile-text">
                                <h2 className="profile-name">{user.displayName || 'Guest User'}</h2>
                                <p className="profile-email">{user.email}</p>
                                <p className="profile-join-date">Member since {formatMemberSince()}</p>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3 className="profile-section-title">Your NATRA Membership</h3>
                            <div className="membership-card">
                                <div className="membership-tier-info">
                                    <div className="membership-tier-badge">
                                        <span className="tier-icon">🏆</span>
                                        <div>
                                            <p className="membership-label">Status</p>
                                            <p className="membership-value">{getMembershipTier()}</p>
                                        </div>
                                    </div>
                                    <div className="membership-benefits">
                                        <span className="benefit-tag">Priority Booking</span>
                                        <span className="benefit-tag">Exclusive Offers</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3 className="profile-section-title">Your Activity</h3>
                            <div className="profile-stats">
                                {profileStats.loading ? (
                                    <p>Loading stats...</p>
                                ) : (
                                    <>
                                        <div className="stat-item">
                                            <span className="stat-number">{profileStats.bookingsCount}</span>
                                            <span className="stat-label">Bookings</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{profileStats.favoriteHotels}</span>
                                            <span className="stat-label">Favorites</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{profileStats.rewardsPoints}</span>
                                            <span className="stat-label">Points</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3 className="profile-section-title">Quick Actions</h3>
                            <div className="quick-actions">
                                <button className="quick-action-btn" onClick={() => onNavigate('hotels')}>
                                    <span className="action-icon">🏨</span> Browse Hotels
                                </button>
                                <button className="quick-action-btn" onClick={() => onNavigate('offers')}>
                                    <span className="action-icon">🎯</span> View Offers
                                </button>
                                <button className="quick-action-btn" onClick={() => onNavigate('memberships')}>
                                    <span className="action-icon">⭐</span> Upgrade Membership
                                </button>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3 className="profile-section-title">Account Details</h3>
                            <div className="account-details">
                                <div className="account-detail-item">
                                    <span className="detail-label">User ID:</span>
                                    <span className="detail-value uid">{user.uid}</span>
                                </div>
                                <div className="account-detail-item">
                                    <span className="detail-label">Last Login:</span>
                                    <span className="detail-value">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button onClick={() => onNavigate('home')} className="profile-home-btn" disabled={isSigningOut}>
                                <span className="btn-icon">🏠</span> Back to Home
                            </button>
                            <button onClick={handleSignOut} className="profile-signout-btn" disabled={isSigningOut}>
                                {isSigningOut ? (
                                    <>
                                        <span className="btn-spinner"></span> Signing Out...
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon">👋</span> Sign Out
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
