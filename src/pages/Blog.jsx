import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const blogPosts = [
    {
        id: 1,
        title: 'Top 5 Skills Every Full Stack Developer Needs in 2024',
        excerpt: 'The tech landscape is evolving rapidly. Here are the top 5 skills you need to stay relevant and highly paid as a Full Stack Developer.',
        date: 'Oct 15, 2023',
        author: 'John Doe',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        title: 'Why Cyber Security is the Most Secure Career Path',
        excerpt: 'With cyber threats on the rise, companies are paying top dollar for security experts. Discover why this is a recession-proof career.',
        date: 'Oct 22, 2023',
        author: 'Jane Smith',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 3,
        title: 'Mastering React: From Beginner to Pro',
        excerpt: 'React continues to dominate the frontend world. Follow our comprehensive guide to mastering React and building dynamic user interfaces.',
        date: 'Nov 5, 2023',
        author: 'Alex Johnson',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'
    }
];

const Blog = () => {
    return (
        <div className="section" style={{ minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px', animation: 'fadeInUp 0.8s ease-out' }}>
                <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Our Blog & Insights</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Stay updated with the latest tech trends, career advice, and success stories from Future Tech Institute.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
                {blogPosts.map((post, index) => (
                    <div key={post.id} className="glass-panel" style={{ overflow: 'hidden', padding: 0, animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '220px', overflow: 'hidden' }}>
                            <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} loading="lazy" />
                        </div>
                        <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} /> {post.date}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={16} /> {post.author}</span>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', lineHeight: '1.4' }}>{post.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', flex: 1, lineHeight: '1.6' }}>{post.excerpt}</p>
                            <Link to={`/blog/${post.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Read More <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
