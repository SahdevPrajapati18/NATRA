import React, { useEffect, useRef } from 'react';
import './OffersPage.css';
// Data for the offer cards
const offers = [
    {
        title: 'Monsoon Retreat',
        description: 'Embrace the serenity of the Indian monsoon with a complimentary wellness ritual and daily gourmet breakfast.',
        image: 'https://images.unsplash.com/photo-1574308107819-81503d86593e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Seasonal'
    },
    {
        title: 'Wellness Journey',
        description: 'A 3-night immersive experience including personalized yoga sessions, spa therapies, and sattvic meals.',
        image: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Wellness'
    },
    {
        title: 'Extended Sanctuary',
        description: 'Stay for four nights and receive the fifth night with our compliments, allowing for deeper relaxation and discovery.',
        image: 'https://images.unsplash.com/photo-1718330008910-8e170dca17d9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Long Stay'
    },
    {
        title: 'Royal Celebration',
        description: 'Mark your special occasion with a stay in our finest suite, complete with a private dinner and celebratory amenities.',
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2940&auto=format&fit=crop',
        tag: 'Celebration'
    }
];

export default function OffersPage() {
    const pageRef = useRef(null);

    // Animate the offer cards on component mount
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
        <div className="offers-page">
            <div className="offers-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2940&auto=format&fit=crop')" }}>
                <div className="offers-hero-overlay">
                    <h1 className="offers-hero-title cinzel-font">Exclusive Offers</h1>
                </div>
            </div>

            <div className="offers-content container">
                <p className="offers-intro">
                    Discover our curated collection of special offers, designed to enhance your stay and create unforgettable memories at NATRA. Each package is a unique invitation to experience the best of our hospitality.
                </p>

                <div ref={pageRef} className="offers-grid">
                    {offers.map(offer => (
                        <div key={offer.title} className="offer-card">
                            <div className="offer-card-image-wrapper">
                                <img src={offer.image} alt={offer.title} className="offer-card-image" />
                                <span className="offer-card-tag">{offer.tag}</span>
                            </div>
                            <div className="offer-card-content">
                                <h3 className="offer-card-title cinzel-font">{offer.title}</h3>
                                <p className="offer-card-description">{offer.description}</p>
                                <button className="offer-card-button">View Offer</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
