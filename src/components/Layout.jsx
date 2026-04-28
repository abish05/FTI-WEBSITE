import { Outlet, NavLink, Link } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav>
                <div className="nav-content">
                    <Link to="/" className="nav-logo">
                        <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '8px', borderRadius: '12px' }}>
                            <GraduationCap size={24} color="white" />
                        </div>
                        FTI
                    </Link>

                    <div className="nav-links">
                        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About Us</NavLink>
                        <NavLink to="/courses" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Courses</NavLink>
                        <NavLink to="/admission" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Admission</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>
                    </div>

                    {/* Simple Mobile menu toggle (optional feature to expand later) */}
                    <button className="mobile-menu-btn" style={{ background: 'none', border: 'none', color: 'white', display: 'none' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            <main className="page-container">
                <Outlet />
            </main>

            <footer style={{ marginTop: 'auto', padding: '40px 20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>© {new Date().getFullYear()} FutureTech Training Institute. All rights reserved.</p>
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <a href="https://futuretechinstitute-privacypolicy.edgeone.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy Policy</a>
                    <Link to="/admin" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none' }}>Admin Portal</Link>
                </div>
            </footer>
        </>
    );
};

export default Layout;
