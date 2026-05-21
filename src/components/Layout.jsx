import { Outlet, NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

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

                </div>

                <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>© {new Date().getFullYear()} FutureTech Training Institute. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a href="https://futuretechinstitute-privacypolicy.edgeone.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Layout;
