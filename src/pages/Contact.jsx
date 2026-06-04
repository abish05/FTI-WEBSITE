import { MapPin, Phone, Mail, Clock, Send, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { addMessage } from '../api/db';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Optimistic UI — show success instantly
        const snapshot = { ...formData };
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 6000);

        // Save to Firestore in background
        addMessage(snapshot).catch(err => console.error('Firestore save error:', err));

        // Send email notification via Cloudflare Worker in background (non-blocking)
        fetch("https://email-worker.ftitraining.workers.dev", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(snapshot)
        }).catch(() => {});
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const contactItems = [
        {
            icon: <MapPin size={22} />,
            color: '#118a8b',
            bg: 'rgba(17, 138, 139, 0.12)',
            label: 'Our Location',
            value: 'Opp to Canara Bank, Near JM Mobiles, Karunya Nagar, Coimbatore – 641114',
            link: 'https://maps.google.com/maps?q=Karunya+Nagar,+Coimbatore'
        },
        {
            icon: <Phone size={22} />,
            color: '#8b5cf6',
            bg: 'rgba(139, 92, 246, 0.12)',
            label: 'Phone Number',
            value: '+91 77085 88508',
            link: 'tel:+917708588508'
        },
        {
            icon: <Mail size={22} />,
            color: '#ec4899',
            bg: 'rgba(236, 72, 153, 0.12)',
            label: 'Email Address',
            value: 'contact@ftitraining.in',
            link: 'mailto:contact@ftitraining.in'
        },
        {
            icon: <Clock size={22} />,
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.12)',
            label: 'Working Hours',
            value: 'Mon – Sat: 9:00 AM – 7:00 PM',
            link: null
        },
    ];

    return (
        <div className="section" style={{ maxWidth: '1100px' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '70px' }}>
                <p style={{ color: '#118a8b', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>GET IN TOUCH</p>
                <h1 className="gradient-text" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', marginBottom: '20px', lineHeight: 1.1 }}>We'd Love to Hear<br />From You</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '550px', margin: '0 auto', lineHeight: 1.7 }}>
                    Have a question about our courses? Ready to enroll? Reach out and our team will get back to you quickly.
                </p>
            </div>

            {/* Contact Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {contactItems.map((item, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'transform 0.2s, border-color 0.2s', cursor: item.link ? 'pointer' : 'default' }}
                        onClick={() => item.link && window.open(item.link, '_blank')}
                    >
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                            {item.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{item.label}</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: '500' }}>{item.value}</p>
                        </div>
                        {item.link && (
                            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: item.color, fontSize: '0.82rem', fontWeight: '600' }}>
                                <ExternalLink size={14} /> Open
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Message Form + Map Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '30px' }}>

                {/* Form */}
                <div className="glass-panel" style={{ padding: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Send a Message</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '32px' }}>Fill in the form and we'll respond within 24 hours.</p>

                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '50px 20px', background: 'rgba(17, 138, 139, 0.08)', borderRadius: '20px', border: '1px solid rgba(17, 138, 139, 0.2)' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>✅</div>
                            <h3 style={{ color: '#118a8b', marginBottom: '10px', fontSize: '1.4rem' }}>Message Received!</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Thank you for reaching out.<br />We'll get back to you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Your Name *</label>
                                    <input
                                        type="text" name="name" required
                                        value={formData.name} onChange={handleChange}
                                        className="form-input" placeholder="Full Name"
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel" name="phone"
                                        value={formData.phone} onChange={handleChange}
                                        className="form-input" placeholder="+91 XXXXX XXXXX"
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">Email Address *</label>
                                <input
                                    type="email" name="email" required
                                    value={formData.email} onChange={handleChange}
                                    className="form-input" placeholder="you@example.com"
                                    style={{ marginBottom: 0 }}
                                />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">Your Message *</label>
                                <textarea
                                    name="message" required rows="5"
                                    value={formData.message} onChange={handleChange}
                                    className="form-input" placeholder="How can we help you?"
                                    style={{ marginBottom: 0, resize: 'none' }}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-primary"
                                style={{ width: '100%', marginTop: '4px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: '700', fontSize: '1rem' }}>
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    )}
                </div>

                {/* Map */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-panel" style={{ padding: '10px', flex: 1, minHeight: '300px' }}>
                        <iframe
                            title="FutureTech Institute Location"
                            src="https://maps.google.com/maps?q=Karunya%20Nagar,%20Coimbatore&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: '16px', display: 'block', minHeight: '300px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                        href="https://wa.me/917708588508?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20courses"
                        target="_blank" rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="glass-panel" style={{ padding: '22px 28px', display: 'flex', alignItems: 'center', gap: '18px', cursor: 'pointer', border: '1px solid rgba(37, 211, 102, 0.2)', transition: 'border-color 0.2s' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="#25D366">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3px' }}>Chat on WhatsApp</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Quick replies • Usually within minutes</p>
                            </div>
                            <ExternalLink size={18} color="#25D366" />
                        </div>
                    </a>

                    {/* Instagram CTA */}
                    <a
                        href="https://www.instagram.com/futuretech_karunya"
                        target="_blank" rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="glass-panel" style={{ padding: '22px 28px', display: 'flex', alignItems: 'center', gap: '18px', cursor: 'pointer', border: '1px solid rgba(236, 72, 153, 0.2)', transition: 'border-color 0.2s' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3px' }}>Follow on Instagram</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>@futuretech_karunya • Updates & news</p>
                            </div>
                            <ExternalLink size={18} color="#ec4899" />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};
export default Contact;
