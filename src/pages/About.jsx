import { Target, Users, BookOpen, Rocket, Award, ShieldCheck, MapPin, Zap, Code, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import classroomLife from '../assets/classroom_life.png';

const About = () => {
    return (
        <div className="section" style={{ maxWidth: '1200px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Our Mission</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto 40px', lineHeight: '1.8' }}>
                    To <strong style={{ color: 'white' }}>democratize high-end technical education.</strong> We provide local talent with the same level of expertise, tools, and opportunities found in global tech hubs, ensuring our students are "Industry-Ready" from day one.
                </p>
                <div className="image-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <img src={classroomLife} alt="FTI Classroom" className="premium-image" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
                    <div className="image-overlay"></div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '50px', marginBottom: '40px', background: 'linear-gradient(135deg, rgba(17, 138, 139, 0.05) 0%, rgba(17, 138, 139, 0.05) 100%)' }}>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Rocket color="var(--accent)" size={32} /> Why We Are Different
                </h2>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' }}>
                    Unlike traditional academic settings, FTI Training operates on a <strong style={{ color: 'white' }}>"Project-First" philosophy.</strong> Whether you are diving into Python Development, mastering Cyber Security, or exploring the creative world of Video Production, your journey here is defined by:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px' }}>
                        <BookOpen color="#118a8b" size={28} style={{ marginBottom: '15px' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Engineering Excellence</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>Our curriculum is influenced by the rigorous standards of top engineering pedagogy, translated into practical, hands-on modules.</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px' }}>
                        <ShieldCheck color="#118a8b" size={28} style={{ marginBottom: '15px' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>The Pro-Tech Advantage</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>We utilize professional-grade environments—from advanced firewalls for security training to high-end editing suites—giving you a competitive edge.</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px' }}>
                        <Users color="#f59e0b" size={28} style={{ marginBottom: '15px' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Mentorship, Not Lectures</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>Learn from industry veterans. We don't just teach code; we teach the logic and soft skills required to survive and thrive in tech.</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', marginBottom: '60px' }}>
                <div className="glass-panel" style={{ padding: '45px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <MapPin color="#ef4444" size={28} /> Our Roots
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                        Deeply connected to the local engineering community, FTI Training was founded to bridge the gap between theoretical degree programs and the fast-paced requirements of the modern software industry. <br /><br />
                        We understand the local landscape and are committed to elevating Nagercoil as a center for technical innovation.
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '45px', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Award color="#c084fc" size={28} /> Pillars of Success
                    </h2>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ background: 'rgba(17, 138, 139, 0.1)', padding: '10px', borderRadius: '10px' }}><Zap color="#118a8b" size={20} /></div>
                            <div>
                                <strong style={{ color: 'white', fontSize: '1.1rem' }}>Practical Mastery:</strong>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>20% Theory, 80% Live Lab Work.</p>
                            </div>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ background: 'rgba(17, 138, 139, 0.1)', padding: '10px', borderRadius: '10px' }}><Target color="#118a8b" size={20} /></div>
                            <div>
                                <strong style={{ color: 'white', fontSize: '1.1rem' }}>Portfolio Driven:</strong>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>You graduate with a body of work, not just a piece of paper.</p>
                            </div>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '10px', borderRadius: '10px' }}><Code color="#f59e0b" size={20} /></div>
                            <div>
                                <strong style={{ color: 'white', fontSize: '1.1rem' }}>Future-Proof Skills:</strong>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>We constantly update our syllabus to include AI, Big Data, and Cloud technologies.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', background: 'radial-gradient(circle at center, rgba(17, 138, 139, 0.1) 0%, transparent 70%)' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to start your journey?</h2>
                <Link to="/admission" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', padding: '18px 40px' }}>
                    Join the FTI Community Today <ChevronRight size={20} />
                </Link>
            </div>
        </div>
    );
};
export default About;
