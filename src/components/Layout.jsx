import { Outlet, NavLink, Link } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

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
                    <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            mixBlendMode: 'lighten'
                        }}>
                            <img 
                                src="/logo.png" 
                                alt="FutureTech Institute Logo" 
                                style={{ 
                                    height: '85px', 
                                    width: 'auto', 
                                    objectFit: 'contain',
                                    filter: 'invert(1) hue-rotate(180deg) brightness(1.5) contrast(1.2)',
                                }} 
                            />
                        </div>
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

                    <button className="mobile-menu-btn" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            <main className="page-container">
                <Outlet />
            </main>

            <footer style={{ marginTop: 'auto', padding: '60px 20px', borderTop: '1px solid var(--glass-border)', background: 'linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(0,0,0,0.8) 100%)', backdropFilter: 'blur(10px)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'left' }}>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                            <div style={{ 
                                display: 'inline-flex',
                                mixBlendMode: 'lighten'
                            }}>
                                <img 
                                    src="/logo.png" 
                                    alt="FutureTech Institute Logo" 
                                    style={{ 
                                        height: '110px', 
                                        width: 'auto', 
                                        objectFit: 'contain',
                                        filter: 'invert(1) hue-rotate(180deg) brightness(1.5) contrast(1.2)',
                                    }} 
                                />
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                            Bridge the gap between learning and earning at the best technical training institute in Nagercoil.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="https://www.instagram.com/futuretech_karunya?utm_source=qr&igsh=c2U4MTgwZDJ1dmlm" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>Instagram</a>
                            <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>LinkedIn</a>
                            <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>YouTube</a>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
                            <li><Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About</Link></li>
                            <li><Link to="/courses" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>All Courses</Link></li>
                            <li><Link to="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Admin Login</Link></li>
                            <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Career Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px' }}>Contact Info</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <li style={{ color: 'var(--text-secondary)' }}>Opp to Canara Bank, Near JM Mobiles, Karunya Nagar, Coimbatore – 641114</li>
                            <li style={{ color: 'var(--text-secondary)' }}>Phone: +91 77085 88508</li>
                            <li style={{ color: 'var(--text-secondary)' }}>Email: varun10vikash@mail.com</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px' }}>SEO Keywords</h4>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                            Find the highest rated software development courses near me here. We are proud to offer premium Cyber Security and AI certification in Tamil Nadu, specialized to meet modern corporate standards.
                        </p>
                    </div>

                </div>

                <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>© {new Date().getFullYear()} FutureTech Training Institute. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a href="https://futuretechinstitute-privacypolicy.edgeone.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textDecoration: 'none' }}>Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Layout;
