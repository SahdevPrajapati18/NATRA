import React, { useEffect, useRef } from 'react';
import './HomePage.css';
// Data for the intro cards, now with images
const introCards = [
    {
        title: 'Wellness',
        description: 'Holistic rituals inspired by ancient Vedic traditions to restore balance.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop'
    },
    {
        title: 'Cuisine',
        description: 'Sattvic culinary journeys that nourish the body and delight the palate.',
        image: 'https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        title: 'Serenity',
        description: 'Spaces designed for contemplation, surrounded by nature\'s harmony.',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'
    }
];

export default function HomePage({ onNavigate }) {
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonRef = useRef(null);
    const introSectionRef = useRef(null);
    const introTitleRef = useRef(null);
    const introTextRef = useRef(null);
    const introGridRef = useRef(null);

    useEffect(() => {
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);

            const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.5 })
              .fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
              .fromTo(buttonRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");

            window.gsap.to(heroRef.current, {
                scale: 1.1,
                duration: 20,
                ease: "linear",
                repeat: -1,
                yoyo: true
            });

            gsap.fromTo([introTitleRef.current, introTextRef.current], 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: introSectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );

            gsap.fromTo(introGridRef.current.children, 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: introGridRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }
    }, []);

    return (
        <>
            <div className="homepage">
                <div
                    ref={heroRef}
                    className="homepage-hero-bg"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587985064135-0366536eab42?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
                />
                <div className="homepage-overlay" />
                <div className="homepage-content">
                    <h1 ref={titleRef} className="homepage-title cinzel-font">
                        NATRA
                    </h1>
                    <p ref={subtitleRef} className="homepage-subtitle">
                        Where Ancient Indian Wisdom Meets Unparalleled Luxury.
                        <br />
                        Discover your inner sanctuary.
                    </p>
                    <div ref={buttonRef} className="homepage-button-container">
                        <button className="homepage-explore-btn" onClick={() => onNavigate('destinations')}>
                            Explore Our Destinations
                        </button>
                    </div>
                </div>
            </div>

            <div ref={introSectionRef} className="intro-section container">
                <h2 ref={introTitleRef} className="intro-title cinzel-font">An Invitation to Stillness</h2>
                <p ref={introTextRef} className="intro-text">
                    In a world that never ceases to move, NATRA offers a sanctuary for the soul. Here, time slows, the senses awaken, and a deeper connection to the self is discovered. Our philosophy is woven into the very fabric of our spaces, creating an atmosphere of profound peace and mindful luxury.
                </p>
                <div ref={introGridRef} className="intro-grid">
                    {introCards.map(card => (
                        <div key={card.title} className="intro-card">
                            <img src={card.image} alt={card.title} className="intro-card-image" />
                            <div className="intro-card-content">
                                <h3 className="cinzel-font">{card.title}</h3>
                                <p>{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
