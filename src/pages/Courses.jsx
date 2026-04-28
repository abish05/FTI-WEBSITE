import { MonitorPlay, Smartphone, Database, Shield, Layout, Settings, X, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const Courses = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);

    const domains = [
        {
            title: 'Web Development',
            icon: <Layout size={40} color="#3b82f6" />,
            desc: 'Master front-end and back-end technologies to build modern web applications.',
            details: {
                subtitle: 'Master the Full Stack',
                description: 'Build responsive, high-performance websites from scratch. This course takes you from basic HTML to complex database management.',
                modules: ['HTML5 & CSS3 Mastery', 'JavaScript (ES6+)', 'React.js or Angular', 'Node.js Backend', 'MongoDB'],
                projects: 'A real-time chat application and a fully functional E-commerce platform.',
                careers: 'Frontend Developer, Backend Engineer, Full-Stack Developer.'
            }
        },
        {
            title: 'Mobile App Dev',
            icon: <Smartphone size={40} color="#f59e0b" />,
            desc: 'Learn to build native and cross-platform applications for iOS and Android.',
            details: {
                subtitle: 'Build for the Pocket-Sized World',
                description: 'Learn to create seamless user experiences for both iOS and Android using industry-standard frameworks.',
                modules: ['UI/UX Design Principles', 'Flutter or React Native', 'Native APIs (Camera/GPS)', 'State Management', 'App Store Deployment'],
                projects: 'A social media feed app and a personal finance tracker.',
                careers: 'iOS Developer, Android Developer, Cross-Platform App Engineer.'
            }
        },
        {
            title: 'Data Science & AI',
            icon: <Database size={40} color="#10b981" />,
            desc: 'Dive into machine learning, data visualization, and artificial intelligence.',
            details: {
                subtitle: 'Turn Raw Data into Intelligence',
                description: 'Master the tools used by data scientists to predict trends, automate tasks, and build "smart" systems.',
                modules: ['Python for Data Science', 'Statistics & Probability', 'Machine Learning Algorithms', 'Neural Networks (Deep Learning)', 'Data Visualization (Tableau/PowerBI)'],
                projects: 'A predictive stock market model and a sentiment analysis tool for social media.',
                careers: 'Data Scientist, ML Engineer, Data Analyst.'
            }
        },
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
                        <button onClick={() => setSelectedCourse(domain)} style={{ marginTop: '20px', background: 'none', border: 'none', color: 'var(--accent)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            Learn More <span style={{ fontSize: '1.2rem' }}>→</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Course Details Modal */}
            {selectedCourse && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }} onClick={() => setSelectedCourse(null)}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '50px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedCourse(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '30px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                {selectedCourse.icon}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'white' }}>{selectedCourse.title}</h2>
                                {selectedCourse.details?.subtitle && <h3 style={{ color: 'var(--accent)', marginTop: '8px', fontWeight: '500', fontSize: '1.3rem' }}>{selectedCourse.details.subtitle}</h3>}
                            </div>
                        </div>

                        {selectedCourse.details ? (
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                <p style={{ fontSize: '1.15rem', marginBottom: '35px', color: 'rgba(255,255,255,0.9)' }}>{selectedCourse.details.description}</p>

                                <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', padding: '30px', borderRadius: '16px', marginBottom: '35px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        Key Modules
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                                        {selectedCourse.details.modules.map((mod, i) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                                <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                <span style={{ color: 'rgba(255,255,255,0.85)' }}>{mod}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '10px' }}>What you'll build:</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>{selectedCourse.details.projects}</p>
                                </div>

                                <div style={{ marginBottom: '40px' }}>
                                    <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '10px' }}>Career Roles:</h4>
                                    <p style={{ color: '#c084fc', fontWeight: '500' }}>{selectedCourse.details.careers}</p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Detailed course curriculum is currently being updated.</p>
                                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '5px' }}>Please contact admissions for the full syllabus.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default Courses;
