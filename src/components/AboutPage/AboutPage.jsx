import React, { useEffect, useRef } from 'react';
import './AboutPage.css';
export default function AboutPage() {
    const pageRef = useRef(null);

    // Animate the page content on component mount
    useEffect(() => {
        if (window.gsap && pageRef.current) {
            window.gsap.fromTo(pageRef.current.children, 
                { y: 30, opacity: 0 }, 
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
        <div className="about-page">
            <div className="about-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1663349405587-13512e1c4c2d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
                <div className="about-hero-overlay">
                    <h1 className="about-hero-title cinzel-font">A Divine Legacy</h1>
                </div>
            </div>

            <div ref={pageRef} className="about-content container">
                <div className="about-section">
                    <h2 className="about-section-title cinzel-font">Our Philosophy: The Cosmic Dance</h2>
                    <p>
                        NATRA is born from a reverence for the timeless energy of Shiva, the supreme consciousness. Our philosophy is inspired by his cosmic dance of creation and transformation. We believe true luxury is an experience of profound tranquility and powerful rejuvenation—a space where the material world dissolves to reveal the peace within. Each NATRA property is more than a hotel; it is a sanctuary designed to align your senses and elevate your spirit.
                    </p>
                </div>

                <div className="about-section-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1711560705440-bceddfe6dc98?q=80&w=885&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", }} />

                <div className="about-section">
                    <h2 className="about-section-title cinzel-font">The Third Eye: Trinetra (त्रिनेत्र)</h2>
                    <p>
                        Our name, NATRA, is a tribute to the divine 'Netra'—the third eye of Shiva. This is the eye of wisdom, capable of perceiving a reality beyond ordinary sight. It symbolizes the destruction of the ego, the vanquishing of ignorance, and the dawn of enlightenment. At NATRA, we create an environment that encourages introspection and clarity, allowing you to look inward and awaken your own dormant intuition and insight.
                    </p>
                </div>

                <div className="about-section-image" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1661962889712-aeb88929955b?q=80&w=1159&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}/>
                
                <div className="about-section">
                    <h2 className="about-section-title cinzel-font">Timeless Heritage</h2>
                    <p>
                        Inspired by the sacred serenity of places like Mount Kailash, the abode of Shiva, our heritage is one of spiritual depth and architectural grace. We integrate the five elements—Earth, Water, Fire, Air, and Ether—into our design, creating a harmonious balance that resonates with cosmic principles. From meditative spaces to wellness rituals inspired by ancient Shaivite traditions, your journey with NATRA is a pilgrimage to the self.
                    </p>
                </div>
            </div>
        </div>
    );
}
