import { MonitorPlay, Smartphone, Database, Layout, Settings, X, CheckCircle2, Cpu, Sliders } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import webDevImg from '../assets/web_dev.png';
import mobileDevImg from '../assets/mobile_dev.png';
import fullStackImg from '../assets/full_stack_dev.png';
import cloudComputingImg from '../assets/cloud_computing.png';
import digitalMarketingImg from '../assets/digital_marketing.png';
import embeddedSystemsImg from '../assets/embedded_systems.png';
import plcAutomationImg from '../assets/plc_automation.png';

const Courses = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);

    const domains = [
        {
            title: 'Web Development',
            icon: <Layout size={40} color="#118a8b" />,
            image: webDevImg,
            desc: 'Master front-end and back-end technologies to build modern web applications.',
            price: '₹25,000',
            duration: '3 Months',
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
            image: mobileDevImg,
            desc: 'Learn to build native and cross-platform applications for iOS and Android.',
            price: '₹30,000',
            duration: '4 Months',
            details: {
                subtitle: 'Build for the Pocket-Sized World',
                description: 'Learn to create seamless user experiences for both iOS and Android using industry-standard frameworks.',
                modules: ['UI/UX Design Principles', 'Flutter or React Native', 'Native APIs (Camera/GPS)', 'State Management', 'App Store Deployment'],
                projects: 'A social media feed app and a personal finance tracker.',
                careers: 'iOS Developer, Android Developer, Cross-Platform App Engineer.'
            }
        },
        {
            title: 'Full Stack Development',
            icon: <Database size={40} color="#118a8b" />,
            image: fullStackImg,
            desc: 'Master the complete ecosystem of modern software development, from UI to robust backends.',
            price: '₹45,000',
            duration: '6 Months',
            details: {
                subtitle: 'Build End-to-End Applications',
                description: 'Master the complete ecosystem of modern software development, from crafting intuitive user interfaces to architecting robust server-side infrastructures.',
                modules: ['MERN Stack (MongoDB, Express, React, Node.js)', 'System Architecture & API Design', 'State Management (Redux/Context API)', 'Authentication & Security (JWT/OAuth)', 'Deployment & CI/CD Pipelines'],
                projects: 'A real-time collaborative workspace and a high-scale social media engine.',
                careers: 'Full Stack Developer, Software Architect, Product Engineer.'
            }
        },
        {
            title: 'Cloud Computing',
            icon: <Settings size={40} color="#8b5cf6" />,
            image: cloudComputingImg,
            desc: 'Design, deploy, and manage scalable infrastructure on modern cloud platforms.',
            price: '₹35,000',
            duration: '4 Months',
            details: {
                subtitle: 'The Backbone of Modern Tech',
                description: 'Move beyond local servers. Learn to architect, deploy, and scale applications on the world’s most powerful cloud platforms.',
                modules: ['AWS/Azure Fundamentals', 'Docker & Kubernetes (Containerization)', 'Cloud Security', 'Serverless Architecture', 'DevOps Pipelines'],
                projectsLabel: "What you'll do:",
                projects: 'Migrate a legacy system to the cloud and manage automated scaling for high-traffic apps.',
                careers: 'Cloud Architect, DevOps Engineer, Systems Administrator.'
            }
        },
        {
            title: 'Digital Marketing',
            icon: <MonitorPlay size={40} color="#ec4899" />,
            image: digitalMarketingImg,
            desc: 'Leverage digital channels to grow businesses and improve online visibility.',
            price: '₹20,000',
            duration: '2 Months',
            details: {
                subtitle: 'Master the Art of Online Growth',
                description: 'In a crowded digital world, learn how to make brands stand out, convert clicks into customers, and track ROI.',
                modules: ['Search Engine Optimization (SEO)', 'Meta & Google Ads (PPC)', 'Content Strategy', 'Email Marketing Automation', 'Web Analytics'],
                projectsLabel: "What you'll do:",
                projects: 'Create a 360-degree marketing campaign and optimize a live brand’s conversion rate.',
                careers: 'Digital Marketing Manager, SEO Specialist, Performance Marketer.'
            }
        },
        {
            title: 'Embedded Systems',
            icon: <Cpu size={40} color="#118a8b" />,
            image: embeddedSystemsImg,
            desc: 'Learn microcontrollers programming, circuit design, and hardware-software integration.',
            price: '₹35,000',
            duration: '4 Months',
            details: {
                subtitle: 'Program the Physical World',
                description: 'Dive into the intersection of hardware and software. Master microcontrollers, sensors integration, and real-time operating systems.',
                modules: ['Microcontroller Architecture (8051/ARM)', 'Embedded C Programming', 'Sensors & Actuators Interfacing', 'IoT Protocols (MQTT/HTTP)', 'PCB Design Fundamentals'],
                projectsLabel: "What you'll build:",
                projects: 'A smart home automation system and a self-navigating robotic prototype.',
                careers: 'Embedded Software Engineer, Firmware Developer, IoT Architect.'
            }
        },
        {
            title: 'PLC Automation',
            icon: <Sliders size={40} color="#f59e0b" />,
            image: plcAutomationImg,
            desc: 'Master industrial automation, PLC programming (SCADA), and control system design.',
            price: '₹40,000',
            duration: '4 Months',
            details: {
                subtitle: 'Powering Industrial Intelligence',
                description: 'Learn to program and manage the brain of modern factory systems. Master industrial communication and control panels design.',
                modules: ['PLC Programming (Ladder Logic/FBD)', 'SCADA & HMI Design', 'Industrial Sensors & Calibrations', 'Control Panel Designing', 'Industrial Networking Protocols'],
                projectsLabel: "What you'll do:",
                projects: 'Design and program a fully simulated automated bottling line and industrial conveyor control.',
                careers: 'Automation Engineer, PLC Programmer, Control Systems Engineer.'
            }
        }
    ];

    return (
        <div className="section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '20px' }}>Our Programs & Courses</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Explore our wide range of training programs across multiple domains, carefully designed to equip you with practical demands of the industry.
                </p>
            </div>

            <div className="card-grid">
                {domains.map((domain, index) => (
                    <div key={index} className="glass-panel" style={{ padding: '0', overflow: 'hidden', transition: 'all 0.3s ease', animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both` }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = 'rgba(17, 138, 139, 0.5)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}>
                        <div className="image-container" style={{ height: '220px', borderRadius: '0' }}>
                            <img src={domain.image} alt={domain.title} className="premium-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                            <div className="image-overlay"></div>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <div style={{ marginBottom: '20px', marginTop: '-60px', position: 'relative', zIndex: 2, background: 'var(--bg-primary)', width: 'fit-content', padding: '12px', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                {domain.icon}
                            </div>
                            <h3 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>{domain.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px', minHeight: '50px' }}>{domain.desc}</p>
                            


                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <button onClick={() => setSelectedCourse(domain)} style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer', padding: '12px', borderRadius: '10px', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}>
                                    View Syllabus
                                </button>
                                <Link to="/admission" className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>
                                    Enroll Now
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Course Details Modal */}
            {selectedCourse && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }} onClick={() => setSelectedCourse(null)}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--modal-padding, 50px)', position: 'relative', border: '1px solid var(--glass-border)' }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedCourse(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 10 }}>
                            <X size={20} />
                        </button>

                        <div style={{ margin: '-50px -50px 30px -50px', height: '300px', overflow: 'hidden' }}>
                            <img src={selectedCourse.image} alt={selectedCourse.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '30px' }}>
                            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                {selectedCourse.icon}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--text-primary)' }}>{selectedCourse.title}</h2>
                                {selectedCourse.details?.subtitle && <h3 style={{ color: 'var(--accent)', marginTop: '8px', fontWeight: '500', fontSize: '1.3rem' }}>{selectedCourse.details.subtitle}</h3>}
                            </div>
                        </div>

                        {selectedCourse.details ? (
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                <p style={{ fontSize: '1.15rem', marginBottom: '35px', color: 'var(--text-secondary)' }}>{selectedCourse.details.description}</p>

                                <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '16px', marginBottom: '35px', border: '1px solid var(--glass-border)' }}>
                                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        Curriculum Highlights
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                                        {selectedCourse.details.modules.map((mod, i) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                                <CheckCircle2 size={20} color="#118a8b" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                <span style={{ color: 'var(--text-secondary)' }}>{mod}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h4 style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '10px' }}>The Problem:</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid #ef4444', paddingLeft: '15px' }}>"Generic tutorials don't get you jobs."</p>
                                </div>
                                <div style={{ marginBottom: '30px', padding: '20px', background: 'rgba(17, 138, 139, 0.1)', borderRadius: '12px', border: '1px solid rgba(17, 138, 139, 0.2)' }}>
                                    <h4 style={{ color: '#118a8b', fontSize: '1.1rem', marginBottom: '10px' }}>The Solution:</h4>
                                    <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>Our {selectedCourse.title} syllabus is built by industry veterans to focus on what actually matters in 2026.</p>
                                </div>

                                <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0 }}>Tools You'll Master:</h4>
                                    <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '10px', display: 'flex', border: '1px solid var(--glass-border)' }}>
                                        {selectedCourse.icon}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '10px' }}>Outcome:</h4>
                                    <p style={{ color: 'var(--text-secondary)' }}>By the end of this course, you will be able to: <strong style={{ color: 'var(--text-primary)' }}>{selectedCourse.details.projects.charAt(0).toLowerCase() + selectedCourse.details.projects.slice(1)}</strong></p>
                                </div>

                                <div style={{ marginBottom: '40px' }}>
                                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '10px' }}>Career Roles:</h4>
                                    <p style={{ color: '#c084fc', fontWeight: '500' }}>{selectedCourse.details.careers}</p>
                                </div>

                                <Link to="/admission" style={{ 
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'center',
                                    background: 'var(--accent)', 
                                    color: 'black', 
                                    textDecoration: 'none', 
                                    padding: '18px', 
                                    borderRadius: '12px', 
                                    fontSize: '1.1rem', 
                                    fontWeight: '800',
                                    boxShadow: '0 10px 20px rgba(17, 138, 139, 0.3)'
                                }}>
                                    Enroll in {selectedCourse.title} Now
                                </Link>
                            </div>
                        ) : (
                            <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Detailed course curriculum is currently being updated.</p>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>Please contact admissions for the full syllabus.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default Courses;
