import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
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
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <input type="text" className="form-input" placeholder="Your Name" required />
                        </div>
                        <div className="form-group">
                            <input type="email" className="form-input" placeholder="Your Email" required />
                        </div>
                        <div className="form-group">
                            <textarea className="form-input" rows="5" placeholder="How can we help you?" required></textarea>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Message</button>
                    </form>
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
