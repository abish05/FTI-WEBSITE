import { ArrowRight, Code, Briefcase, Zap, MonitorPlay, ShieldCheck, Users, Trophy, ChevronRight, PenTool } from 'lucide-react';
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
            <div style={{ textAlign: 'center', marginTop: '40px', animation: 'fadeIn 0.8s ease-out' }}>
                <h1 className="gradient-text" style={{ fontSize: '4.5rem', marginBottom: '24px', letterSpacing: '-1px', lineHeight: '1.1' }}>
                    Bridge the Gap Between <br />Learning and Earning.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 40px', lineHeight: '1.8' }}>
                    <strong style={{ color: 'white' }}>Industry-aligned technical training.</strong> Master in-demand skills with 100% practical sessions and dedicated placement support.
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Link to="/courses" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        View Our Courses <ArrowRight size={20} />
                    </Link>
                    <Link to="/admission" className="btn-primary" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                        Book a Free Demo Class
                    </Link>
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
                        <MonitorPlay size={32} color="#3b82f6" style={{ marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Real-World Labs</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Forget theoretical slides. Practice on the exact same tools used by companies like Google, Meta, and Amazon.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '35px' }}>
                        <Users size={32} color="#8b5cf6" style={{ marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Expert Mentorship</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Learn directly from professionals with years of experience in Video Editing, Python Development, and Cyber Security.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '35px' }}>
                        <Code size={32} color="#10b981" style={{ marginBottom: '20px' }} />
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
            <div className="glass-panel" style={{ padding: '50px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Interactive Career Path Finder</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '30px' }}>Unsure where to start? Tell us your primary interest and we'll suggest the right course for you.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <button onClick={() => setQuizInterest('Design')} className="btn-primary" style={{ background: quizInterest === 'Design' ? '#ec4899' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>🎨 Visuals & Design</button>
                    <button onClick={() => setQuizInterest('Logic')} className="btn-primary" style={{ background: quizInterest === 'Logic' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>💻 Code & Logic</button>
                    <button onClick={() => setQuizInterest('Security')} className="btn-primary" style={{ background: quizInterest === 'Security' ? '#10b981' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>🛡️ Hack & Security</button>
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

        </div>
    );
};

export default Home;
