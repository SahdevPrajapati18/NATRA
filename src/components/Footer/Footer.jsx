import React from 'react';
import './Footer.css';
// --- SVG Icon Components for Footer ---
const SocialIcon = ({ type }) => {
    const icons = {
        facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>,
        instagram: <>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </>,
        twitter: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icons[type]}
        </svg>
    );
};

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content container">
                <div className="footer-section about">
                    <img src="/logo.png" alt="NATRA Logo" className="footer-logo" />
                    <p>A sanctuary where ancient Indian traditions of wellness and hospitality meet contemporary elegance.</p>
                </div>

                <div className="footer-section links">
                    <h4 className="cinzel-font">Quick Links</h4>
                    <ul>
                        <li><a href="#">About NATRA</a></li>
                        <li><a href="#">Destinations</a></li>
                        <li><a href="#">Offers</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-section newsletter">
                    <h4 className="cinzel-font">Newsletter</h4>
                    <p>Subscribe to receive our latest offers and news.</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Your email address" />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} NATRA Hotels. All Rights Reserved.</p>
                <div className="footer-socials">
                    <a href="#" aria-label="Facebook"><SocialIcon type="facebook" /></a>
                    <a href="#" aria-label="Instagram"><SocialIcon type="instagram" /></a>
                    <a href="#" aria-label="Twitter"><SocialIcon type="twitter" /></a>
                </div>
            </div>
        </footer>
    );
}
