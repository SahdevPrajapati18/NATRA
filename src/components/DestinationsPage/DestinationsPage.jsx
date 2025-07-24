import React, { useEffect, useRef } from 'react';
import './DestinationsPage.css';
// Data for the destination cards
const destinations = [
    {
        name: 'New Delhi',
        description: 'The heart of India, where ancient history and modernity blend seamlessly.',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2940&auto=format&fit=crop'
    },
    {
        name: 'Mumbai',
        description: 'A vibrant metropolis of dreams, finance, and cinematic glamour.',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        name: 'Jaipur',
        description: 'The Pink City, a land of majestic forts, palaces, and royal heritage.',
        image: 'https://images.unsplash.com/photo-1602643163983-ed0babc39797?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        name: 'Varanasi',
        description: 'The spiritual capital of India, on the sacred banks of the Ganges.',
        image: 'https://images.unsplash.com/photo-1706186799964-5c4549ca7c54?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    // Note: I added "Rishikesh" to the name to match hotel data for better filtering
    {
        name: 'Rishikesh', 
        description: 'The Yoga Capital of the World, nestled in the Himalayan foothills.',
        image: 'https://images.unsplash.com/photo-1720819029162-8500607ae232?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmlzaGlrZXNofGVufDB8fDB8fHww'
    },
    {
        name: 'Goa',
        description: 'Sun-kissed beaches, vibrant nightlife, and Portuguese colonial charm.',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2874&auto=format&fit=crop'
    },
    {
        name: 'Udaipur',
        description: 'The City of Lakes, renowned for its romantic landscapes and palaces.',
        image: 'https://images.unsplash.com/photo-1709338573004-bfed49c51d6d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dWRhaXB1cnxlbnwwfHwwfHx8MA%3D%3D'
    }
];

export default function DestinationsPage({ onNavigate }) {
    const pageRef = useRef(null);

    // Animate the destination cards on component mount
    useEffect(() => {
        if (window.gsap && pageRef.current) {
            window.gsap.fromTo(pageRef.current.children,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
            );
        }
    }, []);

    return (
        <div className="destinations-page">
            <div className="destinations-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2942&auto=format&fit=crop')" }}>
                <div className="destinations-hero-overlay">
                    <h1 className="destinations-hero-title cinzel-font">Our Destinations</h1>
                </div>
            </div>

            <div className="destinations-content container">
                <p className="destinations-intro">
                    India is a land of myriad landscapes, rich traditions, and profound history. Each NATRA destination has been chosen to offer a unique window into the soul of this incredible country. Explore our curated locations and find the perfect setting for your journey of discovery.
                </p>

                <div ref={pageRef} className="destinations-grid">
                    {destinations.map(dest => (
                        <div key={dest.name} className="destination-card">
                            <div className="destination-card-image" style={{ backgroundImage: `url(${dest.image})` }} />
                            <div className="destination-card-content">
                                <h3 className="destination-card-title cinzel-font">{dest.name}</h3>
                                <p className="destination-card-description">{dest.description}</p>
                                {/* ✨ Pass the destination name as context */}
                                <button
                                    className="destination-card-button"
                                    onClick={() => onNavigate('hotels', { destinationName: dest.name })}
                                >
                                    Explore Hotel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}