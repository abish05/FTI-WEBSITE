import { Target, Users, BookOpen } from 'lucide-react';

const About = () => {
    return (
        <div className="section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '20px' }}>About FutureTech</h1>
            </div>

            <div className="glass-panel" style={{ padding: '50px', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Target color="var(--accent)" /> Our Vision
                </h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    We are a dynamic startup training institute based in Karunya, Coimbatore, offering both in-person and online programs across diverse domains. Our courses are delivered by industry-experienced trainers, focusing on practical, job-ready skills. We aim to bridge the gap between learning and real-world application, helping individuals grow and stay competitive.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '50px', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%)' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Users color="#c084fc" /> The Full Story
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.9' }}>
                    <p>
                        We are a fast-growing startup training institute committed to delivering high-quality, industry-relevant education through both our physical training center and online platforms. Based in Karunya, Coimbatore, we specialize in offering a wide range of training programs across multiple domains, designed to equip learners with practical skills that meet current industry demands.
                    </p>
                    <p>
                        Our courses are led by experienced professionals who bring real-world expertise into every session, ensuring that students gain not just theoretical knowledge but also hands-on exposure. We focus on bridging the gap between academic learning and industry expectations, helping individuals enhance their employability and career growth.
                    </p>
                    <p>
                        With a learner-centric approach, flexible training modes, and a strong emphasis on skill development, we aim to empower students, professionals, and aspiring individuals to stay competitive in today's rapidly evolving job market.
                    </p>
                </div>
            </div>
        </div>
    );
};
export default About;
