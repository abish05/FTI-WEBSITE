import { ArrowRight, Code, Briefcase, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="section" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px', animation: 'fadeIn 0.8s ease-out' }}>
                <h1 className="gradient-text" style={{ fontSize: '4.5rem', marginBottom: '24px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>
                    FutureTech <br />Training Institute
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.8' }}>
                    Shape your future with industry-relevant education. We bridge the gap between academic learning and real-world application to ensure you stay competitive in today's rapidly evolving job market.
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Link to="/courses" className="btn-primary">
                        Explore Programs <ArrowRight size={20} />
                    </Link>
                    <Link to="/admission" className="btn-primary" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                        Enroll Now
                    </Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {[
                    { icon: <Code size={32} color="var(--accent)" />, title: 'Practical Learning', desc: 'Hands-on exposure that brings theoretical knowledge into real-world reality.' },
                    { icon: <Briefcase size={32} color="#c084fc" />, title: 'Job-Ready Skills', desc: 'Curriculum designed by professionals to meet current industry demands.' },
                    { icon: <Zap size={32} color="#fbbf24" />, title: 'Flexible Modes', desc: 'Both in-person in Karunya, Coimbatore and online platforms.' }
                ].map((feature, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center', transition: 'transform 0.3s ease', cursor: 'default' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '50%' }}>
                                {feature.icon}
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{feature.title}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Home;
