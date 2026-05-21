import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { blogPosts } from './Blog';

const BlogPost = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="section" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>Post Not Found</h2>
                <Link to="/blog" className="btn-primary" style={{ marginTop: '20px' }}>Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="section" style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeInUp 0.8s ease-out' }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '30px', fontWeight: '500' }}>
                <ArrowLeft size={20} /> Back to Blog
            </Link>
            
            <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '20px', lineHeight: '1.2' }}>{post.title}</h1>
            
            <div style={{ display: 'flex', gap: '20px', color: 'var(--text-secondary)', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> {post.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> {post.author}</span>
            </div>

            <div style={{ width: '100%', height: '400px', borderRadius: '20px', overflow: 'hidden', marginBottom: '40px' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>

            <div style={{ fontSize: '1.15rem', color: 'var(--text-primary)', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '20px' }}>{post.excerpt}</p>
                <p style={{ marginBottom: '20px' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h3 style={{ fontSize: '1.8rem', marginTop: '40px', marginBottom: '20px' }}>Why this matters</h3>
                <p style={{ marginBottom: '20px' }}>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div style={{ padding: '30px', background: 'rgba(15, 118, 110, 0.05)', borderRadius: '15px', borderLeft: '4px solid var(--accent)', margin: '40px 0' }}>
                    <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                        "The best investment you can make is in yourself. The more you learn, the more you earn." - Warren Buffett
                    </p>
                </div>
                <p>
                    Ready to start your journey? Check out our <Link to="/courses" style={{ color: 'var(--accent)' }}>courses</Link> and take the first step towards your new career.
                </p>
            </div>
        </div>
    );
};

export default BlogPost;
