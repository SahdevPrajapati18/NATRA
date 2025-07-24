import React, { useEffect, useRef } from 'react';
import './MorePage.css';
// Data for the "More" experiences
const experiences = [
    {
        title: 'Cultural Workshops',
        description: 'Immerse yourself in the artistic traditions of India with private lessons in local crafts, from miniature painting to classical music.',
        icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"></path></svg>
    },
    {
        title: 'Private Journeys',
        description: 'Allow our expert guides to curate a bespoke tour of hidden temples, bustling local markets, and breathtaking natural landscapes.',
        icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    },
    {
        title: 'Bespoke Celebrations',
        description: 'From intimate anniversaries to grand milestones, our dedicated team will orchestrate a flawless and unforgettable event tailored to your vision.',
        icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg>
    }
];

export default function MorePage() {
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
        <div className="more-page">
            <div className="more-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=2940&auto=format&fit=crop')" }}>
                <div className="more-hero-overlay">
                    <h1 className="more-hero-title cinzel-font">Beyond the Stay</h1>
                </div>
            </div>

            <div className="more-content container">
                <p className="more-intro">
                    At NATRA, your experience extends far beyond the confines of your suite. We offer a curated selection of unique activities and services designed to connect you more deeply with the culture, spirit, and beauty of India.
                </p>

                <div ref={pageRef} className="more-grid">
                    {experiences.map(exp => (
                        <div key={exp.title} className="experience-card">
                            <div className="experience-card-icon">
                                <exp.icon />
                            </div>
                            <h3 className="experience-card-title cinzel-font">{exp.title}</h3>
                            <p className="experience-card-description">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
