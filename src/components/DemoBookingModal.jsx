import { useState } from 'react';
import { X, Calendar, User, Mail, Phone, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { addDemoBooking } from '../api/db';

const DemoBookingModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        course: 'Web Development',
        preferredDate: '',
        preferredTime: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await addDemoBooking(form);
        setIsSubmitting(false);
        if (result.success) {
            setSubmitted(true);
        } else {
            alert('Failed to submit booking. Please try again or contact us directly.');
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setForm({ fullName: '', email: '', phone: '', course: 'Web Development', preferredDate: '', preferredTime: '', message: '' });
        onClose();
    };

    return (
        <>
            <style>{`
                @keyframes demoModalIn {
                    from { opacity: 0; transform: scale(0.92) translateY(20px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes successPop {
                    0%   { transform: scale(0); opacity: 0; }
                    60%  { transform: scale(1.15); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .demo-modal-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,0.65);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                }
                .demo-modal-card {
                    background: var(--bg-primary, #ffffff);
                    border-radius: 28px;
                    max-width: 560px; width: 100%;
                    max-height: 90vh; overflow-y: auto;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.25), 0 0 0 1px rgba(17,138,139,0.1);
                    animation: demoModalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    scrollbar-width: thin;
                }
                .demo-modal-header {
                    background: linear-gradient(135deg, #118a8b 0%, #0d9488 100%);
                    padding: 35px 40px 30px;
                    border-radius: 28px 28px 0 0;
                    position: relative; overflow: hidden;
                }
                .demo-modal-header::before {
                    content: '';
                    position: absolute; top: -50%; right: -20%;
                    width: 250px; height: 250px;
                    background: rgba(255,255,255,0.07);
                    border-radius: 50%;
                }
                .demo-modal-body {
                    padding: 35px 40px 40px;
                }
                .demo-field-group {
                    display: grid; grid-template-columns: 1fr 1fr;
                    gap: 16px; margin-bottom: 16px;
                }
                @media (max-width: 500px) {
                    .demo-field-group { grid-template-columns: 1fr; }
                    .demo-modal-header, .demo-modal-body { padding-left: 24px; padding-right: 24px; }
                }
                .demo-field {
                    display: flex; flex-direction: column; gap: 8px;
                }
                .demo-label {
                    font-size: 0.8rem; font-weight: 600;
                    color: #64748b; display: flex; align-items: center; gap: 6px;
                }
                .demo-input {
                    width: 100%; padding: 13px 16px;
                    background: #f8fafc;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 12px;
                    color: #0f172a; font-family: inherit;
                    font-size: 0.95rem;
                    transition: all 0.25s ease;
                    outline: none;
                }
                .demo-input:focus {
                    border-color: #118a8b;
                    background: #ffffff;
                    box-shadow: 0 0 0 3px rgba(17,138,139,0.1);
                }
                .demo-submit-btn {
                    width: 100%; padding: 16px;
                    background: linear-gradient(135deg, #118a8b, #0d9488);
                    color: white; font-weight: 700; font-size: 1rem;
                    border: none; border-radius: 14px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    transition: all 0.3s ease;
                    box-shadow: 0 6px 20px rgba(17,138,139,0.3);
                    margin-top: 20px;
                }
                .demo-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(17,138,139,0.4); }
                .demo-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .success-icon { animation: successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            `}</style>

            <div className="demo-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleReset()}>
                <div className="demo-modal-card">

                    {/* Header */}
                    <div className="demo-modal-header">
                        <button
                            onClick={handleReset}
                            style={{ position: 'absolute', top: '18px', right: '18px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                        >
                            <X size={18} />
                        </button>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '50px', padding: '6px 14px', marginBottom: '14px' }}>
                            <Calendar size={14} color="white" />
                            <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Free Session</span>
                        </div>
                        <h2 style={{ color: 'white', fontSize: '1.7rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                            Book a Demo with a Professional
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Meet our industry experts. Get a personalised walkthrough of the course that's right for you — completely free.
                        </p>
                    </div>

                    {/* Body */}
                    <div className="demo-modal-body">
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div className="success-icon" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #118a8b, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                    <CheckCircle size={40} color="white" />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>Booking Confirmed! 🎉</h3>
                                <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '30px' }}>
                                    Thank you <strong>{form.fullName}</strong>! Our team will reach out to you shortly to confirm your demo session time.
                                </p>
                                <button onClick={handleReset} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #118a8b, #0d9488)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}>
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="demo-field-group">
                                    <div className="demo-field">
                                        <label className="demo-label"><User size={13} /> Full Name</label>
                                        <input required className="demo-input" placeholder="Your full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                                    </div>
                                    <div className="demo-field">
                                        <label className="demo-label"><Phone size={13} /> Phone Number</label>
                                        <input required className="demo-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                </div>

                                <div className="demo-field" style={{ marginBottom: '16px' }}>
                                    <label className="demo-label"><Mail size={13} /> Email Address</label>
                                    <input required type="email" className="demo-input" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>

                                <div className="demo-field" style={{ marginBottom: '16px' }}>
                                    <label className="demo-label"><BookOpen size={13} /> Interested Course</label>
                                    <select required className="demo-input" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>
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

                                <div className="demo-field-group">
                                    <div className="demo-field">
                                        <label className="demo-label"><Calendar size={13} /> Preferred Date</label>
                                        <input type="date" className="demo-input" value={form.preferredDate} min={new Date().toISOString().split('T')[0]} onChange={e => setForm({ ...form, preferredDate: e.target.value })} />
                                    </div>
                                    <div className="demo-field">
                                        <label className="demo-label"><Clock size={13} /> Preferred Time</label>
                                        <select className="demo-input" value={form.preferredTime} onChange={e => setForm({ ...form, preferredTime: e.target.value })}>
                                            <option value="">Any time</option>
                                            <option>9:00 AM – 10:00 AM</option>
                                            <option>10:00 AM – 11:00 AM</option>
                                            <option>11:00 AM – 12:00 PM</option>
                                            <option>2:00 PM – 3:00 PM</option>
                                            <option>3:00 PM – 4:00 PM</option>
                                            <option>4:00 PM – 5:00 PM</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="demo-field" style={{ marginBottom: '0', marginTop: '16px' }}>
                                    <label className="demo-label">Any questions or notes? (optional)</label>
                                    <textarea className="demo-input" rows="3" style={{ resize: 'none' }} placeholder="e.g. I'm a beginner and want to know if this course is right for me..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                                </div>

                                <button type="submit" className="demo-submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                            Submitting...
                                        </>
                                    ) : (
                                        <><Calendar size={20} /> Confirm My Demo Session</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DemoBookingModal;
