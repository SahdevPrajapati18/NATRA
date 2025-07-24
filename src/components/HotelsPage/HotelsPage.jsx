import React, { useEffect, useRef } from 'react';
import './HotelsPage.css';
// Data for the hotels
const hotels = [
    {
        name: 'NATRA Palace, Udaipur',
        location: 'Udaipur, Rajasthan',
        description: 'Overlooking the serene waters of Lake Pichola, our Udaipur palace is a testament to royal Mewari heritage, offering an experience of timeless grandeur and tranquility.',
        image: 'https://plus.unsplash.com/premium_photo-1697729434815-40ab4970ebc1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        name: 'NATRA Himalayan Retreat, Rishikesh',
        location: 'Rishikesh, Uttarakhand',
        description: 'Nestled in the foothills of the Himalayas, this spiritual sanctuary offers a path to wellness and inner peace, with panoramic views of the sacred Ganges river.',
        image: 'https://images.unsplash.com/photo-1722105542613-282973ef54a6?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        name: 'NATRA Coastal Sanctuary, Goa',
        location: 'Goa',
        description: 'A secluded paradise where the lush greenery of the tropics meets the pristine sands of the Arabian Sea. Discover a blend of mindful luxury and coastal charm.',
        image: 'https://images.unsplash.com/photo-1743592323402-2a8392831f44?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    // ✨ New hotels added below ✨
    {
        name: 'NATRA Haveli, Jaipur',
        location: 'Jaipur, Rajasthan',
        description: 'Experience the grandeur of Rajputana in a restored heritage haveli, where royal history and luxurious comfort meet in the heart of the Pink City.',
        image: 'https://plus.unsplash.com/premium_photo-1691031429447-d8460e45f9ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        name: 'NATRA Urban Oasis, New Delhi',
        location: 'New Delhi, Delhi',
        description: 'A contemporary sanctuary amidst the historic splendor and vibrant pace of India\'s capital, offering serene gardens and state-of-the-art wellness facilities.',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1170&auto=format&fit=crop'
    },
    {
        name: 'NATRA on the Sea, Mumbai',
        location: 'Mumbai, Maharashtra',
        description: 'Offering breathtaking views of the Arabian Sea, this hotel captures the cosmopolitan spirit of Mumbai, providing a luxurious escape from the bustling city.',
        image: 'https://images.unsplash.com/photo-1721549900543-564fe2df079a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fG11bWJhaSUyMGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        name: 'NATRA Ghats Serenity, Varanasi',
        location: 'Varanasi, Uttar Pradesh',
        description: 'Embrace the spiritual essence of Varanasi from our serene retreat on the banks of the sacred Ganges, offering a front-row seat to ancient rituals and timeless devotion.',
        image: 'https://images.unsplash.com/photo-1691727032638-db9d089153ab?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
];

export default function HotelsPage({ onNavigate, context }) {
    const pageRef = useRef(null);

    const displayedHotels = context && context.destinationName
        ? hotels.filter(hotel => hotel.location.includes(context.destinationName))
        : hotels;

    useEffect(() => {
        if (window.gsap && window.ScrollTrigger) {
            const hotelCards = window.gsap.utils.toArray('.hotel-card');
            hotelCards.forEach(card => {
                window.gsap.fromTo(card,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
        }
    }, [displayedHotels]);

    return (
        <div className="hotels-page">
            <div className="hotels-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop')" }}>
                <div className="hotels-hero-overlay">
                    <h1 className="hotels-hero-title cinzel-font">Our Sanctuaries</h1>
                </div>
            </div>

            <div ref={pageRef} className="hotels-content container">
                <div className="back-button-container">
                    <button className="back-to-destinations-btn" onClick={() => onNavigate('destinations')}>
                        &lsaquo; Back to All Destinations
                    </button>
                </div>

                {displayedHotels.length > 0 ? (
                    displayedHotels.map((hotel) => (
                        <div key={hotel.name} className="hotel-card">
                            <div className="hotel-card-image">
                                <img src={hotel.image} alt={hotel.name} />
                            </div>
                            <div className="hotel-card-content">
                                <p className="hotel-card-location">{hotel.location}</p>
                                <h2 className="hotel-card-title cinzel-font">{hotel.name}</h2>
                                <p className="hotel-card-description">{hotel.description}</p>
                                <button className="hotel-card-button" onClick={() => onNavigate('rooms')}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-hotels-message">
                        We are working on establishing a sanctuary in this beautiful destination. Please check back soon.
                    </p>
                )}
            </div>
        </div>
    );
}