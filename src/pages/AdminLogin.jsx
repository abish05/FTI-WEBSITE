import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if already logged in
        if (localStorage.getItem('fti_current_user')) {
            navigate('/admin/dashboard');
        }

        // Bootstrap master owner account if none exists
        const existingAdmins = localStorage.getItem('fti_admins');
        if (!existingAdmins) {
            localStorage.setItem('fti_admins', JSON.stringify([{
                id: '1',
                username: 'owner',
                password: 'password123',
                role: 'owner',
                createdAt: new Date().toLocaleDateString()
            }]));
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        const admins = JSON.parse(localStorage.getItem('fti_admins') || '[]');
        const user = admins.find(a => a.username === credentials.username && a.password === credentials.password);

        if (user) {
            localStorage.setItem('fti_current_user', JSON.stringify({
                id: user.id,
                username: user.username,
                role: user.role
            }));
            navigate('/admin/dashboard');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)' }}>
            <div className="glass-panel" style={{ padding: '50px 40px', width: '100%', maxWidth: '450px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '50%' }}>
                        <Lock size={40} color="var(--accent)" />
                    </div>
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Admin Portal</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Sign in to manage student enrollments and system settings.</p>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                        <ShieldAlert size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            required
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            required
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        Login Access
                    </button>
                </form>


            </div>
        </div>
    );
};

export default AdminLogin;
