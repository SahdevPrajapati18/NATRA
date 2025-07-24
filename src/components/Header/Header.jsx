import React, { useState, useEffect, useRef } from 'react';

import './Header.css'; 

// --- SVG Icon Components ---
const UserIcon = () => ( <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const MenuIcon = () => ( <svg className="mobile-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg> );
const CloseIcon = () => ( <svg className="mobile-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> );
const SunIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> );
const MoonIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> );


export default function Header({ onNavigate, user, theme, toggleTheme }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const headerRef = useRef(null);

    // --- Refactored Navigation Links ---
    const navLinks = [
        { label: "About NATRA", page: "about" },
        { label: "Destinations", page: "destinations" },
        { label: "Hotels", page: "hotels" },
        { label: "Offers", page: "offers" },
        { label: "Memberships", page: "memberships" },
        { label: "More", page: "more" }
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // GSAP animations would go in other useEffect hooks here...

    const handleNavClick = (page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    };

    return (
        <header ref={headerRef} className={`header ${isScrolled || isMenuOpen ? 'scrolled' : ''}`}>
            <div className="header-container container">
                <div className="header-logo" onClick={() => onNavigate('home')} role="button" tabIndex="0">
                    {/* Remember to import your logo file for this to work */}
                    <img src="/src/assets/logo.png" alt="NATRA Logo" />
                </div>
                
                <nav className="header-nav">
                    {navLinks.map(link => (
                        <a href={`#${link.page}`} key={link.page} onClick={(e) => { e.preventDefault(); handleNavClick(link.page); }}>
                            {link.label}
                        </a>
                    ))}
                </nav>
                
                <div className="header-right-group">
                    <div className="header-actions">
                        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                        {user ? (
                            <button onClick={() => onNavigate('profile')} className="header-profile-btn">
                                <UserIcon />
                                <span>{user.displayName ? user.displayName.split(' ')[0] : 'Profile'}</span>
                            </button>
                        ) : (
                            <button onClick={() => onNavigate('login')} className="header-login-btn">
                                LOGIN / JOIN
                            </button>
                        )}
                      
                        <button className="book-now-btn" onClick={() => handleNavClick('hotels')}>BOOK NOW</button>
                    </div>

                    <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                        <MenuIcon />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <button className="mobile-menu-close-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                    <CloseIcon />
                </button>
                <nav className="mobile-nav">
                    {navLinks.map(link => (
                         <a href={`#${link.page}`} key={link.page} onClick={(e) => { e.preventDefault(); handleNavClick(link.page); }}>
                            {link.label}
                        </a>
                    ))}
                    <hr />
                    {user ? (
                        <button onClick={() => handleNavClick('profile')} className="mobile-profile-btn">
                            <UserIcon />
                            <span>{user.displayName ? `${user.displayName.split(' ')[0]}'s Profile` : 'Profile'}</span>
                        </button>
                    ) : (
                        <button onClick={() => handleNavClick('login')}>LOGIN / JOIN</button>
                    )}
                    
                    <button className="book-now-btn" onClick={() => handleNavClick('hotels')}>BOOK NOW</button>
                    <div className="mobile-theme-toggle">
                        <span>Switch Theme</span>
                        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
                            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}