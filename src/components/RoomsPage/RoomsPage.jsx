import React, { useEffect, useRef } from 'react';
import './RoomsPage.css';
// Data for the room types
const rooms = [
    {
        name: 'Deluxe Serenity Room',
        price: '₹18,000 / night',
        size: '450 sq ft',
        amenities: ['King Bed', 'Rain Shower', 'Garden View', 'Wi-Fi'],
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2940&auto=format&fit=crop',
        description: 'A beautifully appointed space designed for ultimate relaxation, featuring a private balcony overlooking our tranquil gardens.'
    },
    {
        name: 'Luxury Lake Suite',
        price: '₹32,000 / night',
        size: '800 sq ft',
        amenities: ['King Bed', 'Soaking Tub', 'Lake View', 'Lounge Area', 'Wi-Fi'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2940&auto=format&fit=crop',
        description: 'An expansive suite offering panoramic views of the serene lake, complete with a separate living area and a luxurious marble bathroom.'
    },
    {
        name: 'Royal Heritage Villa',
        price: '₹75,000 / night',
        size: '1,500 sq ft',
        amenities: ['Private Plunge Pool', 'Butler Service', 'Courtyard', 'Dining Area'],
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2940&auto=format&fit=crop',
        description: 'The pinnacle of luxury, our private villas offer unparalleled privacy, bespoke service, and an atmosphere of royal grandeur.'
    }
];

// Amenity Icon Component
const AmenityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

export default function RoomsPage({ onNavigate }) {
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
                    stagger: 0.2
                }
            );
        }
    }, []);

    return (
        <div className="rooms-page">
            <div className="rooms-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2940&auto=format&fit=crop')" }}>
                <div className="rooms-hero-overlay">
                    <h1 className="rooms-hero-title cinzel-font">Accommodations</h1>
                </div>
            </div>

            <div ref={pageRef} className="rooms-content container">
                {/* ✨ Back button added here ✨ */}
                <div className="back-button-container">
                    <button className="back-to-destinations-btn" onClick={() => onNavigate('hotels')}>
                        &lsaquo; Back to Hotels
                    </button>
                </div>
                
                {rooms.map(room => (
                    <div key={room.name} className="room-card">
                        <div className="room-card-image">
                            <img src={room.image} alt={room.name} />
                        </div>
                        <div className="room-card-details">
                            <h2 className="room-card-title cinzel-font">{room.name}</h2>
                            <p className="room-card-description">{room.description}</p>
                            <div className="room-card-info">
                                <div>
                                    <span>Price</span>
                                    <p>{room.price}</p>
                                </div>
                                <div>
                                    <span>Size</span>
                                    <p>{room.size}</p>
                                </div>
                            </div>
                            <div className="room-card-amenities">
                                <h4>Key Amenities</h4>
                                <ul>
                                    {room.amenities.map(amenity => (
                                        <li key={amenity}>
                                            <AmenityIcon />
                                            {amenity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className="room-card-button" onClick={() => onNavigate('singleRoom', { room: room })}>
                                View Details & Book
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}