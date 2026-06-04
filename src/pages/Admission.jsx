import { useState } from 'react';
import { addEnrollment } from '../api/db';

const Admission = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        course: 'Web Development',
        remarks: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSyncing(true);

        // ✅ OPTIMISTIC UI — show success INSTANTLY, don't wait for cloud
        setSubmitted(true);
        setIsSyncing(false);

        const snapshot = { ...formData };
        setFormData({ fullName: '', email: '', phone: '', course: 'Web Development', remarks: '' });

        // Save to Firestore in background (non-blocking)
        addEnrollment(snapshot).catch(err => console.error('Firestore save error:', err));

        // Send email notification via Cloudflare Worker in background (non-blocking)
        fetch("https://email-worker.ftitraining.workers.dev", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(snapshot)
        }).catch(() => {});

        setTimeout(() => setSubmitted(false), 8000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="section" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '20px' }}>Admission / Enrollment</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Take the first step towards a successful career. Fill out the form below to enroll.</p>
            </div>

            <div className="glass-panel" style={{ padding: '40px' }}>
                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(17, 138, 139, 0.2)', border: '2px solid #118a8b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <span style={{ fontSize: '2rem', color: '#118a8b' }}>✓</span>
                        </div>
                        <h2 style={{ marginBottom: '15px' }}>Enrollment Received!</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Thank you for your interest. Our admissions team will contact you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Interested Course / Domain</label>
                            <select name="course" value={formData.course} onChange={handleChange} className="form-input" style={{ appearance: 'none', cursor: 'pointer' }}>
                                <option value="Web Development">Web Development</option>
                                <option value="Mobile App Dev">Mobile App Dev</option>
                                <option value="Data Science & AI">Data Science & AI</option>
                                <option value="Cloud Computing through AWS">Cloud Computing through AWS</option>
                                <option value="Digital Marketing">Digital Marketing</option>
                                <option value="Embedded Systems">Embedded Systems</option>
                                <option value="PLC Automation">PLC Automation</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Additional Remarks (Optional)</label>
                            <textarea name="remarks" value={formData.remarks} onChange={handleChange} className="form-input" rows="4" placeholder="Any specific requirements or questions?"></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSyncing}
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '20px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            Submit Application
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
export default Admission;
