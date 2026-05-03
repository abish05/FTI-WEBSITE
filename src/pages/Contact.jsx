import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import { fetchDB, updateDB } from '../api/db';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const db = await fetchDB();
            const existing = db.messages || [];
            const newMessage = { ...formData, id: Date.now().toString(), date: new Date().toLocaleDateString() };
            
            // 1. Submit to Formspree
            await fetch("https://formspree.io/f/meenezll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMessage)
            });

            // 2. Update DB
            db.messages = [newMessage, ...existing];
            await updateDB(db);
            
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            console.error("Error sending message:", err);
            alert("There was an error sending your message. Please try again.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <div className="section" style={{ maxWidth: '1000px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '20px' }}>Get In Touch</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>We'd love to hear from you. Drop by our institute or reach out via phone or email.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%' }}>
                            <MapPin color="var(--accent)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Our Location</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Opp to Canara Bank, Near JM Mobiles,<br />
                                Karunya Nagar,<br />
                                Coimbatore – 641114
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '50%' }}>
                            <Phone color="#8b5cf6" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Phone Number</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>+91 77085 88508</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                        <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '12px', borderRadius: '50%' }}>
                            <Mail color="#ec4899" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Email Address</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>varun10vikash@mail.com</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%' }}>
                            <Clock color="#10b981" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Working Hours</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Mon - Sat: 9:00 AM - 7:00 PM</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '40px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.8rem' }}>Send a Message</h2>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <span style={{ fontSize: '3rem' }}>🎉</span>
                            <h3 style={{ marginTop: '15px', color: '#10b981' }}>Message Sent!</h3>
                            <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>We'll get back to you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Your Name" required />
                            </div>
                            <div className="form-group">
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="Your Email" required />
                            </div>
                            <div className="form-group">
                                <textarea name="message" value={formData.message} onChange={handleChange} className="form-input" rows="5" placeholder="How can we help you?" required></textarea>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Message</button>
                        </form>
                    )}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '10px', marginTop: '30px', animation: 'fadeIn 0.8s ease-out', animationDelay: '0.2s', animationFillMode: 'both' }}>
                <iframe
                    title="Google Maps Location"
                    src="https://maps.google.com/maps?q=Karunya%20Nagar,%20Coimbatore&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: '12px', display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
};
export default Contact;
