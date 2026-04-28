import { MonitorPlay, Smartphone, Database, Shield, Layout, Settings } from 'lucide-react';

const Courses = () => {
    const domains = [
        { title: 'Web Development', icon: <Layout size={40} color="#3b82f6" />, desc: 'Master front-end and back-end technologies to build modern web applications.' },
        { title: 'Mobile App Dev', icon: <Smartphone size={40} color="#f59e0b" />, desc: 'Learn to build native and cross-platform applications for iOS and Android.' },
        { title: 'Data Science & AI', icon: <Database size={40} color="#10b981" />, desc: 'Dive into machine learning, data visualization, and artificial intelligence.' },
        { title: 'Cyber Security', icon: <Shield size={40} color="#ef4444" />, desc: 'Protect systems and networks from digital attacks with advanced security protocols.' },
        { title: 'Cloud Computing', icon: <Settings size={40} color="#8b5cf6" />, desc: 'Design, deploy, and manage scalable infrastructure on modern cloud platforms.' },
        { title: 'Digital Marketing', icon: <MonitorPlay size={40} color="#ec4899" />, desc: 'Leverage digital channels to grow businesses and improve online visibility.' }
    ];

    return (
        <div className="section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '20px' }}>Our Programs & Courses</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Explore our wide range of training programs across multiple domains, carefully designed to equip you with practical demands of the industry.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {domains.map((domain, index) => (
                    <div key={index} className="glass-panel" style={{ padding: '40px 30px', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                        <div style={{ marginBottom: '20px' }}>{domain.icon}</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{domain.title}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{domain.desc}</p>
                        <button style={{ marginTop: '20px', background: 'none', border: 'none', color: 'var(--accent)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            Learn More <span style={{ fontSize: '1.2rem' }}>→</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Courses;
