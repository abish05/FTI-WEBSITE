import { useState } from 'react';

const Admission = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        course: 'Web Development',
        remarks: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call and save to localStorage
        const existing = JSON.parse(localStorage.getItem('fti_enrollments') || '[]');
        const newEnrollment = {
            ...formData,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString()
        };
        localStorage.setItem('fti_enrollments', JSON.stringify([newEnrollment, ...existing]));
        setSubmitted(true);
        setFormData({ fullName: '', email: '', phone: '', course: 'Web Development', remarks: '' });

        // Auto reset success message
        setTimeout(() => setSubmitted(false), 5000);
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
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <span style={{ fontSize: '2rem', color: '#10b981' }}>✓</span>
                        </div>
                        <h2 style={{ marginBottom: '15px' }}>Enrollment Received!</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Thank you for your interest. Our admissions team will contact you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-input" placeholder="John Doe" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="john@example.com" />
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

                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '16px' }}>
                            Submit Application
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
export default Admission;
