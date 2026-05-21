import { ArrowRight, Code, Briefcase, Zap, MonitorPlay, ShieldCheck, Users, Trophy, ChevronRight, PenTool, Image as ImageIcon } from 'lucide-react';
import heroV2 from '../assets/hero_v2.png';
import classroomLife from '../assets/classroom_life.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const [quizInterest, setQuizInterest] = useState('');

    const handleQuizSubmit = () => {
        if (quizInterest === 'Design') navigate('/courses');
        else if (quizInterest === 'Logic') navigate('/courses');
        else if (quizInterest === 'Security') navigate('/courses');
        else navigate('/courses');
    };

    return (
        <div className="section" style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {/* HERO SECTION */}
            <div className="hero-split" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center', marginTop: '40px', animation: 'fadeIn 0.8s ease-out' }}>
                <div style={{ textAlign: 'left' }}>
                    <h1 className="gradient-text" style={{ fontSize: '4rem', marginBottom: '24px', letterSpacing: '-1px', lineHeight: '1.1' }}>
                        Bridge the Gap Between <br />Learning and Earning.
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.8' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Industry-aligned technical training.</strong> Master in-demand skills with 100% practical sessions and dedicated placement support.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <Link to="/courses" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            View Our Courses <ArrowRight size={20} />
                        </Link>
                        <Link to="/admission" className="btn-primary" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                            Book a Free Demo Class
                        </Link>
                    </div>
                </div>
                <div style={{ position: 'relative' }} className="image-container">
                    <div style={{ position: 'absolute', top: '-20px', left: '-20px', right: '20px', bottom: '20px', background: 'var(--accent)', filter: 'blur(100px)', opacity: '0.1', zIndex: -1 }}></div>
                    <img src={heroV2} alt="FutureTech Classroom" className="premium-image" style={{ width: '100%', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} loading="lazy" />
                    <div className="image-overlay"></div>
                </div>
            </div>

            {/* WHY FTI SECTION */}
            <div>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Why FTI?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>We don't just list features; we deliver career-changing benefits.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                    <div className="glass-panel" style={{ padding: '35px' }}>
                        <MonitorPlay size={32} color="#118a8b" style={{ marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Real-World Labs</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Forget theoretical slides. Practice on the exact same tools used by companies like Google, Meta, and Amazon.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '35px' }}>
                        <Users size={32} color="#8b5cf6" style={{ marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Expert Mentorship</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Learn directly from professionals with years of experience in Video Editing, Python Development, and Cyber Security.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '35px' }}>
                        <Code size={32} color="#118a8b" style={{ marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Portfolio Building</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Every student graduates with a tangible "Work Portfolio" to showcase to recruiters, not just a paper certificate.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '35px' }}>
                        <Briefcase size={32} color="#f59e0b" style={{ marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Placement Assistance</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Benefit from dedicated resume-building workshops and intense mock interviews to get you fully job-ready.</p>
                    </div>
                </div>
            </div>

            {/* CAREER PATH FINDER */}
            <div className="glass-panel" style={{ padding: '50px', background: 'linear-gradient(135deg, rgba(17, 138, 139, 0.1) 0%, rgba(17, 138, 139, 0.1) 100%)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Interactive Career Path Finder</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '30px' }}>Unsure where to start? Tell us your primary interest and we'll suggest the right course for you.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <button onClick={() => setQuizInterest('Design')} className="btn-primary" style={{ background: quizInterest === 'Design' ? '#ec4899' : 'rgba(0,0,0,0.05)', border: '1px solid var(--glass-border)', color: quizInterest === 'Design' ? 'white' : 'var(--text-primary)' }}>🎨 Visuals & Design</button>
                    <button onClick={() => setQuizInterest('Logic')} className="btn-primary" style={{ background: quizInterest === 'Logic' ? '#118a8b' : 'rgba(0,0,0,0.05)', border: '1px solid var(--glass-border)', color: quizInterest === 'Logic' ? 'white' : 'var(--text-primary)' }}>💻 Code & Logic</button>
                    <button onClick={() => setQuizInterest('Security')} className="btn-primary" style={{ background: quizInterest === 'Security' ? '#118a8b' : 'rgba(0,0,0,0.05)', border: '1px solid var(--glass-border)', color: quizInterest === 'Security' ? 'white' : 'var(--text-primary)' }}>🛡️ Hack & Security</button>
                </div>
                {quizInterest && (
                    <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s ease' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
                            {quizInterest === 'Design' && "Recommendation: Web Development / UI/UX Design"}
                            {quizInterest === 'Logic' && "Recommendation: Full Stack / Data Science & AI"}
                            {quizInterest === 'Security' && "Recommendation: Cyber Security & Cloud Computing"}
                        </p>
                        <button onClick={handleQuizSubmit} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Explore Match <ChevronRight size={18} /></button>
                    </div>
                )}
            </div>

            {/* LAB PREVIEW SECTION */}
            <div className="glass-panel hero-split" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center', padding: '60px' }}>
                <div style={{ order: window.innerWidth > 768 ? 2 : 1 }} className="image-container">
                    <img src={classroomLife} alt="Students in Lab" className="premium-image" style={{ width: '100%', borderRadius: '20px', border: '1px solid var(--glass-border)' }} loading="lazy" />
                    <div className="image-overlay"></div>
                </div>
                <div style={{ textAlign: 'left', order: window.innerWidth > 768 ? 1 : 2 }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Experience Modern Learning</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '30px' }}>
                        Our labs are equipped with high-performance workstations and professional tools. We believe that a great environment fosters great innovation.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'rgba(17, 138, 139, 0.1)', padding: '10px', borderRadius: '10px' }}><ImageIcon size={20} color="#118a8b" /></div>
                            <span>High-Performance Hardware</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'rgba(17, 138, 139, 0.1)', padding: '10px', borderRadius: '10px' }}><Zap size={20} color="#118a8b" /></div>
                            <span>Gigabit Connectivity</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '10px', borderRadius: '10px' }}><Users size={20} color="#f59e0b" /></div>
                            <span>Collaborative Spaces</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
