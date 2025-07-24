import React, { useEffect, useRef } from 'react';
import './MembershipsPage.css';
// Data for the membership tiers
const tiers = [
    {
        name: 'Ātman Tier',
        price: 'Complimentary',
        description: 'Begin your journey with essential benefits that enhance every stay.',
        features: [
            'Exclusive member rates',
            'Complimentary high-speed Wi-Fi',
            'Late check-out upon availability',
            'Access to member-only events'
        ],
        featured: false
    },
    {
        name: 'Dharma Tier',
        price: '25 Stays / Year',
        description: 'Embrace a deeper connection with elevated privileges and personalized services.',
        features: [
            'All Ātman Tier benefits',
            'Complimentary room upgrade',
            'Daily gourmet breakfast for two',
            'Priority booking for spa & dining',
            'Welcome amenity'
        ],
        featured: true
    },
    {
        name: 'Karma Tier',
        price: '60 Stays / Year',
        description: 'Experience the pinnacle of NATRA hospitality with our most exclusive rewards.',
        features: [
            'All Dharma Tier benefits',
            'Guaranteed suite upgrade',
            'Private airport transfers',
            '24/7 dedicated concierge',
            'An exclusive annual retreat'
        ],
        featured: false
    }
];

export default function MembershipsPage() {
    const pageRef = useRef(null);

    useEffect(() => {
        if (window.gsap && pageRef.current) {
            window.gsap.fromTo(pageRef.current.children, 
                { y: 50, opacity: 0 }, 
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.8, 
                    ease: 'power3.out', 
                    stagger: 0.1 
                }
            );
        }
    }, []);

    return (
        <div className="memberships-page">
            <div className="memberships-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2849&auto=format&fit=crop')" }}>
                <div className="memberships-hero-overlay">
                    <h1 className="memberships-hero-title cinzel-font">NATRA Circle</h1>
                </div>
            </div>

            <div className="memberships-content container">
                <p className="memberships-intro">
                    Welcome to the NATRA Circle, an exclusive community for our most valued guests. Membership offers a world of curated benefits, personalized services, and unique experiences designed to enrich your journey with us.
                </p>

                <div ref={pageRef} className="memberships-grid">
                    {tiers.map(tier => (
                        <div key={tier.name} className={`membership-card ${tier.featured ? 'featured' : ''}`}>
                            <div className="membership-card-header">
                                <h3 className="membership-card-title cinzel-font">{tier.name}</h3>
                                <p className="membership-card-price">{tier.price}</p>
                                <p className="membership-card-description">{tier.description}</p>
                            </div>
                            <ul className="membership-card-features">
                                {tier.features.map(feature => (
                                    <li key={feature}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="membership-card-button">
                                {tier.featured ? 'Elevate Your Status' : 'Join Now'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
