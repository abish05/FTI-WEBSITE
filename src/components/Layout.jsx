import { Outlet, NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';
import SitePopup from './SitePopup';
import DemoBookingModal from './DemoBookingModal';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isDemoOpen, setIsDemoOpen] = useState(false);


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

            <SitePopup />
            <DemoBookingModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

            <main className="page-container">
                <Outlet />
            </main>

            <footer style={{ marginTop: 'auto', padding: '60px 20px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', textAlign: 'left', alignItems: 'start' }}>

                    <div>
                        <div style={{ marginBottom: '30px' }}>
                            <Link to="/">
                                <img src={logoImg} alt="Future Tech Institute" style={{ height: '90px', objectFit: 'contain', cursor: 'pointer' }} />
                            </Link>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                            Bridge the gap between learning and earning at the best technical training institute in Coimbatore.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a 
                                href="https://www.instagram.com/futuretech_karunya?utm_source=qr&igsh=c2U4MTgwZDJ1dmlm" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    background: 'var(--bg-secondary)', 
                                    border: '1px solid var(--glass-border)', 
                                    color: 'var(--text-secondary)', 
                                    transition: 'all 0.3s ease' 
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#e1306c'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                            </a>
                            <a 
                                href="#" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    background: 'var(--bg-secondary)', 
                                    border: '1px solid var(--glass-border)', 
                                    color: 'var(--text-secondary)', 
                                    transition: 'all 0.3s ease' 
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#0a66c2'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                            </a>
                            <a 
                                href="https://www.youtube.com/@FutureTechInstitute-z6q" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    background: 'var(--bg-secondary)', 
                                    border: '1px solid var(--glass-border)', 
                                    color: 'var(--text-secondary)', 
                                    transition: 'all 0.3s ease' 
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#ff0000'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                            </a>
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
                            <li style={{ color: 'var(--text-secondary)' }}>Email: contact@ftitraining.in</li>
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

            {/* FLOATING WHATSAPP BUTTON */}
            <a 
                href="https://wa.me/917708588508" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                    position: 'fixed', 
                    bottom: '30px', 
                    right: '30px', 
                    zIndex: 9999,
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    background: '#25D366', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    boxShadow: '0 10px 25px rgba(37, 211, 102, 0.4)',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.6)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 211, 102, 0.4)';
                }}
                title="Chat on WhatsApp"
            >
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style={{ color: 'white' }}>
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.488 2.012 14.032.99 11.457.99c-5.442 0-9.869 4.37-9.873 9.8-.002 1.905.513 3.766 1.49 5.397L1.96 20.572l4.687-1.418zM17.476 14.39c-.326-.163-1.93-.953-2.229-1.062-.299-.109-.517-.163-.734.163-.217.327-.84.953-1.03 1.17-.19.218-.38.245-.706.082-1.168-.584-1.957-1.01-2.748-1.698-.593-.515-.98-1.15-1.097-1.353-.117-.203-.012-.313.088-.413.09-.09.198-.232.298-.348.1-.116.133-.198.2-.33.067-.132.033-.248-.016-.348-.05-.1-.446-1.077-.611-1.474-.16-.388-.322-.335-.446-.341-.115-.006-.248-.007-.38-.007-.132 0-.348.049-.529.247-.182.198-.694.678-.694 1.654s.71 1.916.81 2.047c.099.13 1.398 2.135 3.387 2.99.473.204.842.326 1.129.418.475.152.907.13 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.508-.296z"/>
                </svg>
            </a>
        </>
    );
};

export default Layout;
