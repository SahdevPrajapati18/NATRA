import React, { useEffect, useRef } from 'react';
import './SingleRoomPage.css';
// --- Icon components for amenities ---
const AmenityIcon = ({ name }) => {
    const icons = {
        'King Bed': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 10v10"/><path d="M2 18h20"/></svg>,
        'Wi-Fi': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a8 8 0 0 1 14 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a4 4 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
        'Lake View': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 16 4-7 4 7"/><path d="M12 19v-5.5"/><path d="M8 19h8"/><path d="M15 16a5 5 0 0 0 5-5 5 5 0 0 0-10 0c0 .9.3 1.8.8 2.5"/><path d="m2 16 4-7 4 7"/></svg>,
        'Soaking Tub': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 11h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M2 12h20"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/><path d="M5 12l-.8-4.2c-.1-.7.4-1.3 1.1-1.3h13.4c.7 0 1.2.6 1.1 1.3L19 12"/></svg>,
        'Butler Service': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0-2.2-1.8-4-4-4v2c1.1 0 2 .9 2 2H8c0-1.1.9-2 2-2V6c-2.2 0-4 1.8-4 4H2v2h2v8h16v-8h2v-2h-2z"/><path d="M12 10V6"/><path d="m15 15-3-3-3 3"/></svg>,
        'Default': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
    };
    return icons[name] || icons['Default'];
};


export default function SingleRoomPage({ room, onNavigate }) {
    const pageRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (window.gsap && pageRef.current) {
            window.gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power3.out' });
        }
    }, [room]);

    // Fallback if no room data is provided
    if (!room) {
        return (
            <div className="loading-screen">
                <p>Loading room details...</p>
            </div>
        );
    }
    
    // **Important**: Assumes your 'room' object now has an 'images' array.
    // If not, we create a fallback.
    const roomImages = room.images && room.images.length > 0 ? room.images : [room.image];

    return (
        <div ref={pageRef} className="srp-redesigned">
            {/* --- Hero Section --- */}
            <div className="srp-hero" style={{ backgroundImage: `url(${roomImages[0]})` }}>
                <div className="srp-hero-overlay">
                    <div className="container">
                        
                        <h1 className="srp-hero-title cinzel-font">{room.name}</h1>
                        <p className="srp-hero-price">{room.price}</p>
                        <button onClick={() => onNavigate('rooms')} className="srp-back-btn">&larr; Back to All Rooms</button>
                    </div>
                </div>
            </div>

            {/* --- Main Content Body --- */}
            <div className="srp-body-content container">
                {/* --- Left Column: Details --- */}
                <div className="srp-details-main">
                    <div className="srp-description-section">
                        <h2 className="cinzel-font">Experience Unparalleled Comfort</h2>
                        <p>{room.description}</p>
                    </div>

                    <div className="srp-divider"></div>

                    {/* --- Amenities Section --- */}
                    <div className="srp-amenities-section">
                        <h2 className="cinzel-font">What This Room Offers</h2>
                        <div className="srp-amenities-grid">
                            {room.amenities.map(amenity => (
                                <div key={amenity} className="srp-amenity-item">
                                    <AmenityIcon name={amenity} />
                                    <span>{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="srp-divider"></div>

                    {/* --- Gallery Section --- */}
                    {roomImages.length > 1 && (
                        <div className="srp-gallery-section">
                            <h2 className="cinzel-font">Photo Gallery</h2>
                            <div className="srp-gallery-grid">
                                {roomImages.map((img, index) => (
                                    <div key={index} className="srp-gallery-item">
                                        <img src={img} alt={`${room.name} gallery image ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Right Column: Sticky Booking Widget --- */}
                <div className="srp-booking-wrapper">
                    <div className="booking-widget">
                        <h3 className="cinzel-font">Reserve Your Stay</h3>
                        <p>from <strong>{room.price}</strong></p>
                        <form>
                            <div className="date-picker">
                                <label>Check-in</label>
                                <input type="date" defaultValue="2025-08-10" />
                            </div>
                            <div className="date-picker">
                                <label>Check-out</label>
                                <input type="date" defaultValue="2025-08-15" />
                            </div>
                             <div className="guest-picker">
                                <label>Guests</label>
                                <select>
                                    <option>1 Adult</option>
                                    <option selected>2 Adults</option>
                                    <option>2 Adults, 1 Child</option>
                                </select>
                            </div>
                            <button type="submit" className="book-now-btn">Book Now</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}