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
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSyncing(true);
        setError('');

        try {
            // 1. Save to Firestore (real-time cloud DB — instantly visible in Admin)
            const result = await addEnrollment(formData);

            // 2. Also submit to Formspree as email backup
            fetch("https://formspree.io/f/meenezll", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(formData)
            }).catch(() => {}); // Fire and forget backup

            if (result.success) {
                setSubmitted(true);
                setFormData({ fullName: '', email: '', phone: '', course: 'Web Development', remarks: '' });
            } else {
                setError('Unable to submit. Please check your internet and try again.');
            }
        } catch (err) {
            console.error("Error submitting application:", err);
            setError('There was an error submitting your application. Please try again.');
        } finally {
            setIsSyncing(false);
            setTimeout(() => setSubmitted(false), 8000);
        }
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
                        {error && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#ef4444', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

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
                                <option value="Cyber Security">Cyber Security</option>
                                <option value="Cloud Computing">Cloud Computing</option>
                                <option value="Digital Marketing">Digital Marketing</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Additional Remarks (Optional)</label>
                            <textarea name="remarks" value={formData.remarks} onChange={handleChange} className="form-input" rows="4" placeholder="Any specific requirements or questions?"></textarea>
                        </div>

                        <button type="submit" disabled={isSyncing} className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            {isSyncing ? (
                                <>
                                    <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'black', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    SAVING YOUR APPLICATION...
                                </>
                            ) : 'Submit Application'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
export default Admission;
