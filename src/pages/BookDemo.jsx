import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, BookOpen, MapPin, Hash, CheckCircle, ArrowRight } from 'lucide-react';
import { addDemoBooking } from '../api/db';
import logoImg from '../assets/logo.png';

const BookDemo = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        course: 'Web Development',
        location: '',
        pincode: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await addDemoBooking(form);
        setIsSubmitting(false);
        if (result.success) {
            setSubmitted(true);
        } else {
            alert('Something went wrong. Please try again or call us directly at +91 77085 88508.');
        }
    };

    const fields = [
        { key: 'fullName', label: 'Full Name', icon: <User size={16} />, placeholder: 'e.g. Arjun Kumar', type: 'text', required: true },
        { key: 'phone', label: 'Phone Number', icon: <Phone size={16} />, placeholder: '+91 XXXXX XXXXX', type: 'tel', required: true },
        { key: 'email', label: 'Email Address', icon: <Mail size={16} />, placeholder: 'you@email.com', type: 'email', required: true },
        { key: 'location', label: 'Location / City', icon: <MapPin size={16} />, placeholder: 'e.g. Coimbatore', type: 'text', required: true },
        { key: 'pincode', label: 'Pincode', icon: <Hash size={16} />, placeholder: 'e.g. 641114', type: 'text', required: true },
    ];

    return (
        <>
            <style>{`
                @keyframes bdFadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes bdPop {
                    0%   { transform: scale(0); opacity: 0; }
                    60%  { transform: scale(1.15); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes bdFloat {
                    0%   { transform: translateY(0); }
                    50%  { transform: translateY(-12px); }
                    100% { transform: translateY(0); }
                }
                .bd-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f0fdfd 0%, #e8f8f8 40%, #ffffff 100%);
                    display: flex; flex-direction: column; align-items: center;
                    padding: 40px 20px 80px;
                    font-family: 'Inter', sans-serif;
                }
                .bd-card {
                    background: #ffffff;
                    border-radius: 32px;
                    max-width: 580px; width: 100%;
                    box-shadow: 0 40px 100px rgba(17,138,139,0.1), 0 0 0 1px rgba(17,138,139,0.08);
                    overflow: hidden;
                    animation: bdFadeUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                .bd-header {
                    background: linear-gradient(135deg, #118a8b 0%, #0d9488 100%);
                    padding: 40px 44px 36px;
                    position: relative; overflow: hidden;
                }
                .bd-header::before {
                    content: ''; position: absolute;
                    top: -60px; right: -60px;
                    width: 220px; height: 220px;
                    background: rgba(255,255,255,0.07);
                    border-radius: 50%;
                }
                .bd-header::after {
                    content: ''; position: absolute;
                    bottom: -40px; left: -40px;
                    width: 160px; height: 160px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 50%;
                }
                .bd-body { padding: 38px 44px 44px; }
                @media (max-width: 540px) {
                    .bd-header { padding: 30px 24px 26px; }
                    .bd-body { padding: 28px 24px 36px; }
                }
                .bd-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
                .bd-label {
                    font-size: 0.8rem; font-weight: 700; color: #475569;
                    display: flex; align-items: center; gap: 7px; letter-spacing: 0.02em;
                }
                .bd-input {
                    width: 100%; padding: 14px 18px;
                    background: #f8fafc; border: 1.5px solid #e2e8f0;
                    border-radius: 14px; color: #0f172a;
                    font-family: inherit; font-size: 0.97rem;
                    transition: all 0.25s ease; outline: none; box-sizing: border-box;
                }
                .bd-input:focus {
                    border-color: #118a8b; background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(17,138,139,0.1);
                }
                .bd-input::placeholder { color: #94a3b8; }
                .bd-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                @media (max-width: 480px) { .bd-row { grid-template-columns: 1fr; } }
                .bd-submit {
                    width: 100%; padding: 17px;
                    background: linear-gradient(135deg, #118a8b, #0d9488);
                    color: white; font-weight: 800; font-size: 1.05rem;
                    border: none; border-radius: 16px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(17,138,139,0.35);
                    margin-top: 24px; letter-spacing: 0.01em;
                }
                .bd-submit:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 14px 35px rgba(17,138,139,0.45);
                }
                .bd-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
                .bd-spin {
                    width: 22px; height: 22px;
                    border: 2.5px solid rgba(255,255,255,0.3);
                    border-top-color: white; border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .bd-success-icon { animation: bdPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .bd-trust {
                    display: flex; align-items: center; justify-content: center;
                    gap: 20px; margin-top: 20px; flex-wrap: wrap;
                }
                .bd-trust-item {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 0.78rem; color: #64748b; font-weight: 500;
                }
            `}</style>

            <div className="bd-page">

                {/* Logo */}
                <a href="/" style={{ marginBottom: '28px', display: 'inline-block', animation: 'bdFadeUp 0.4s ease forwards' }}>
                    <img src={logoImg} alt="FutureTech Institute" style={{ height: '64px', objectFit: 'contain' }} />
                </a>

                <div className="bd-card">

                    {/* Header */}
                    <div className="bd-header">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.18)', borderRadius: '50px', padding: '6px 16px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                            <CheckCircle size={14} color="white" />
                            <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em' }}>100% Free · No Obligation</span>
                        </div>
                        <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', marginBottom: '10px', lineHeight: '1.2', letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>
                            Book a Free Demo<br />with Our Professionals
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.97rem', lineHeight: '1.65', position: 'relative', zIndex: 1 }}>
                            Get a personalised 1-on-1 walkthrough of the course that fits your goals — conducted by industry experts.
                        </p>
                    </div>

                    {/* Body */}
                    <div className="bd-body">
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
                                <div className="bd-success-icon" style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(135deg, #118a8b, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 12px 35px rgba(17,138,139,0.35)' }}>
                                    <CheckCircle size={44} color="white" />
                                </div>
                                <h2 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', letterSpacing: '-0.02em' }}>
                                    You're All Set! 🎉
                                </h2>
                                <p style={{ color: '#475569', lineHeight: '1.75', marginBottom: '32px', fontSize: '1rem' }}>
                                    Thanks, <strong>{form.fullName}</strong>! We've received your request and our team will call you within <strong>24 hours</strong> to confirm your demo session.
                                </p>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button onClick={() => navigate('/')} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #118a8b, #0d9488)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}>
                                        Go to Homepage
                                    </button>
                                    <button onClick={() => { setSubmitted(false); setForm({ fullName: '', phone: '', email: '', course: 'Web Development', location: '', pincode: '' }); }} style={{ padding: '14px 28px', background: 'rgba(17,138,139,0.07)', color: '#118a8b', border: '1px solid rgba(17,138,139,0.2)', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}>
                                        Book Another
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>

                                {/* Name */}
                                <div className="bd-field">
                                    <label className="bd-label"><User size={14} /> Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input required className="bd-input" type="text" placeholder="e.g. Arjun Kumar" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                                </div>

                                {/* Phone + Email */}
                                <div className="bd-row">
                                    <div className="bd-field" style={{ marginBottom: 0 }}>
                                        <label className="bd-label"><Phone size={14} /> Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input required className="bd-input" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                    <div className="bd-field" style={{ marginBottom: 0 }}>
                                        <label className="bd-label"><Mail size={14} /> Email ID <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input required className="bd-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                    </div>
                                </div>

                                {/* Area of Interest */}
                                <div className="bd-field" style={{ marginTop: '18px' }}>
                                    <label className="bd-label"><BookOpen size={14} /> Area of Interest <span style={{ color: '#ef4444' }}>*</span></label>
                                    <select required className="bd-input" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>
                                        <option value="">— Select your interest —</option>
                                        <option>Web Development</option>
                                        <option>Data Science &amp; AI</option>
                                        <option>Artificial Intelligence</option>
                                        <option>Cloud Computing through AWS</option>
                                        <option>Mobile App Development</option>
                                        <option>Embedded Systems</option>
                                        <option>PLC Automation</option>
                                        <option>Video Editing</option>
                                        <option>Not sure yet — need guidance</option>
                                    </select>
                                </div>

                                {/* Location + Pincode */}
                                <div className="bd-row" style={{ marginTop: '0' }}>
                                    <div className="bd-field" style={{ marginBottom: 0 }}>
                                        <label className="bd-label"><MapPin size={14} /> Location / City <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input required className="bd-input" type="text" placeholder="e.g. Coimbatore" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                                    </div>
                                    <div className="bd-field" style={{ marginBottom: 0 }}>
                                        <label className="bd-label"><Hash size={14} /> Pincode <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input required className="bd-input" type="text" placeholder="e.g. 641114" maxLength={6} value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })} />
                                    </div>
                                </div>

                                <button type="submit" className="bd-submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <><div className="bd-spin" /> Submitting...</>
                                    ) : (
                                        <>Book My Free Demo <ArrowRight size={20} /></>
                                    )}
                                </button>

                                {/* Trust badges */}
                                <div className="bd-trust">
                                    <span className="bd-trust-item">✅ 100% Free</span>
                                    <span className="bd-trust-item">📞 We call you back in 24h</span>
                                    <span className="bd-trust-item">🔒 No spam, ever</span>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <p style={{ marginTop: '28px', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', animation: 'bdFadeUp 0.8s ease forwards' }}>
                    © {new Date().getFullYear()} FutureTech Training Institute · <a href="/" style={{ color: '#118a8b', textDecoration: 'none' }}>Back to Home</a>
                </p>
            </div>
        </>
    );
};

export default BookDemo;
