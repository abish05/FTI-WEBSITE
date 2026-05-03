import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const isMaster = credentials.email === 'abishstk@gmail.com' && credentials.password === '9zipj5h2mC*';

        try {
            const db = await fetchDB();
            const authorizedAdmins = db.admins || [];
            const isSubAdmin = authorizedAdmins.some(a => a.email === credentials.email) && credentials.password === '9zipj5h2mC*';

            if (isMaster || isSubAdmin) {
                const foundAdmin = authorizedAdmins.find(a => a.email === credentials.email) || { username: 'Master Admin', role: 'SuperAdmin' };
                const user = {
                    email: credentials.email,
                    role: foundAdmin.role || 'Admin',
                    username: foundAdmin.username || foundAdmin.email
                };
                localStorage.setItem('fti_current_user', JSON.stringify(user));
                window.dispatchEvent(new Event('storage'));
                navigate('/admin');
            } else {
                setIsLoading(false);
                setError('ACCESS DENIED: UNAUTHORIZED PROTOCOLS');
            }
        } catch (err) {
            console.error("DEEP_LOGIN_ERROR:", err);
            
            // DEEP FIX: Allow Master Admin even if DB is unreachable
            if (isMaster) {
                const user = {
                    email: credentials.email,
                    role: 'SuperAdmin',
                    username: 'Master Admin (Offline Mode)'
                };
                localStorage.setItem('fti_current_user', JSON.stringify(user));
                window.dispatchEvent(new Event('storage'));
                navigate('/admin/dashboard');
            } else {
                setIsLoading(false);
                setError('SYSTEM ERROR: UNABLE TO REACH MAINFRAME');
            }
        }
    };

    return (
        <div style={{ 
            minHeight: '80vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px',
            background: 'radial-gradient(circle at center, rgba(17, 138, 139, 0.05) 0%, transparent 70%)'
        }}>
            <div className="glass-panel" style={{ 
                width: '100%', 
                maxWidth: '450px', 
                padding: '40px',
                textAlign: 'center',
                border: '1px solid rgba(17, 138, 139, 0.2)',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(17, 138, 139, 0.05)'
            }}>
                <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    background: 'rgba(17, 138, 139, 0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    border: '1px solid rgba(17, 138, 139, 0.3)',
                    boxShadow: '0 0 15px rgba(17, 138, 139, 0.2)'
                }}>
                    <Lock size={32} color="#118a8b" />
                </div>

                <h2 style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: '800', 
                    marginBottom: '8px', 
                    letterSpacing: '2px',
                    color: 'white'
                }}>SYSTEM ENTRY</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
                    Select your access level to penetrate the FTI mainframe.
                </p>

                <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', letterSpacing: '1px' }}>ADMIN ID</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input 
                                type="email" 
                                placeholder="Enter admin email"
                                className="form-input"
                                style={{ paddingLeft: '45px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', letterSpacing: '1px' }}>PASSCODE</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input 
                                type="password" 
                                placeholder="Enter passcode"
                                className="form-input"
                                style={{ paddingLeft: '45px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ 
                            padding: '12px', 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            border: '1px solid rgba(239, 68, 68, 0.3)', 
                            borderRadius: '8px', 
                            color: '#ef4444', 
                            fontSize: '0.85rem', 
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <ShieldAlert size={16} />
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="btn-primary" 
                        style={{ 
                            width: '100%', 
                            justifyContent: 'center', 
                            background: '#118a8b', 
                            color: 'black', 
                            fontWeight: 'bold',
                            padding: '14px',
                            boxShadow: '0 0 20px rgba(17, 138, 139, 0.3)'
                        }}
                    >
                        {isLoading ? 'ESTABLISHING CONNECTION...' : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Access Dashboard <ChevronRight size={20} />
                            </span>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '30px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px' }}>
                    SECURE MAINFRAME v4.2.0 | ENCRYPTION ACTIVE
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
