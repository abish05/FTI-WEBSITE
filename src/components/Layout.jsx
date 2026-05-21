import { Outlet, NavLink, Link } from 'react-router-dom';
import { Menu, X, MessageCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const checkUser = () => {
            const userStr = localStorage.getItem('fti_current_user');
            if (userStr) {
                setUser(JSON.parse(userStr));
            } else {
                setUser(null);
            }
        };
        
        checkUser();
        // Check for storage changes (e.g. login/logout)
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    return (
        <>
            <nav>
                <div className="nav-content">
                    <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logoImg} alt="Future Tech Institute" style={{ height: '70px', objectFit: 'contain' }} />
                    </Link>

                    <div className="nav-links">
                        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About Us</NavLink>
                        <NavLink to="/courses" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Courses</NavLink>
                        <NavLink to="/blog" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Blog</NavLink>
                        <NavLink to="/admission" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Admission</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>
                        {user && (
                            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} style={{ color: 'var(--accent)', fontWeight: '600' }}>Dashboard</NavLink>
                        )}
                    </div>

                    {/* Mobile Navigation Drawer */}
                    <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                        <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link mobile active" : "nav-link mobile"}>Home</NavLink>
                        <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link mobile active" : "nav-link mobile"}>About Us</NavLink>
                        <NavLink to="/courses" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link mobile active" : "nav-link mobile"}>Courses</NavLink>
                        <NavLink to="/blog" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link mobile active" : "nav-link mobile"}>Blog</NavLink>
                        <NavLink to="/admission" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link mobile active" : "nav-link mobile"}>Admission</NavLink>
                        <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link mobile active" : "nav-link mobile"}>Contact</NavLink>
                        {user && (
                            <NavLink to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link mobile active" : "nav-link mobile"} style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Dashboard</NavLink>
                        )}
                    </div>

                    <button className="mobile-menu-btn" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            <main className="page-container">
                <Outlet />
            </main>

            <footer style={{ marginTop: 'auto', padding: '60px 20px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', textAlign: 'left', alignItems: 'start' }}>

                    <div>
                        <div style={{ marginBottom: '30px' }}>
                            <img src={logoImg} alt="Future Tech Institute" style={{ height: '90px', objectFit: 'contain' }} />
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                            Bridge the gap between learning and earning at the best technical training institute in Coimbatore.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="https://www.instagram.com/futuretech_karunya?utm_source=qr&igsh=c2U4MTgwZDJ1dmlm" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>Instagram</a>
                            <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>LinkedIn</a>
                            <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>YouTube</a>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '20px' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
                            <li><Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About</Link></li>
                            <li><Link to="/courses" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>All Courses</Link></li>
                            <li><Link to="/blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Blog & News</Link></li>
                            <li><Link to="/admission" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Admission</Link></li>
                            <li><Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '20px' }}>Contact Info</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <li style={{ color: 'var(--text-secondary)' }}>Opp to Canara Bank, Near JM Mobiles, Karunya Nagar, Coimbatore – 641114</li>
                            <li style={{ color: 'var(--text-secondary)' }}>Phone: +91 77085 88508</li>
                            <li style={{ color: 'var(--text-secondary)' }}>Email: varun10vikash@mail.com</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '20px' }}>Location</h4>
                        <div style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                            <iframe 
                                title="Future Tech Institute Location"
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                style={{ border: 0 }} 
                                src="https://maps.google.com/maps?q=Canara+Bank,+Karunya+Nagar,+Coimbatore&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                </div>

                <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>© {new Date().getFullYear()} FutureTech Training Institute. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a href="https://futuretechinstitute-privacypolicy.edgeone.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Privacy Policy</a>
                    </div>
                </div>
            </footer>

            {/* FLOATING CHAT WIDGET */}
            <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
                {isChatOpen ? (
                    <div style={{ width: '320px', height: '400px', background: 'var(--bg-primary)', borderRadius: '20px', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeInUp 0.3s ease-out' }}>
                        <div style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '10px', height: '10px', background: '#4ade80', borderRadius: '50%' }}></div>
                                <span style={{ fontWeight: '600' }}>FTI Support</span>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', background: 'rgba(15, 118, 110, 0.02)' }}>
                            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '15px 15px 15px 0', border: '1px solid var(--glass-border)', fontSize: '0.9rem', color: 'var(--text-primary)', alignSelf: 'flex-start', maxWidth: '85%', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                                👋 Hi there! Welcome to Future Tech Institute. Are you looking to upskill or find a specific course?
                            </div>
                        </div>
                        <div style={{ padding: '15px', borderTop: '1px solid var(--glass-border)', background: 'white', display: 'flex', gap: '10px' }}>
                            <input type="text" placeholder="Type your message..." style={{ flex: 1, border: 'none', outline: 'none', background: 'rgba(0,0,0,0.05)', padding: '10px 15px', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--text-primary)' }} />
                            <button style={{ background: 'var(--accent)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}><Send size={18} /></button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setIsChatOpen(true)} className="btn-primary" style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, boxShadow: '0 10px 25px rgba(15, 118, 110, 0.4)' }}>
                        <MessageCircle size={28} />
                    </button>
                )}
            </div>
        </>
    );
};

export default Layout;
