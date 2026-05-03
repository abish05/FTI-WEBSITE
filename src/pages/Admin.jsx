import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, MessageSquare, Settings, 
    LogOut, Shield, ShieldCheck, Zap, Globe, 
    Search, Filter, Download, ArrowUpRight, 
    Calendar, CheckCircle, Clock, Trash2,
    Database, Activity, RefreshCw
} from 'lucide-react';
import { fetchDB, updateDB } from '../api/db';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [enrollments, setEnrollments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('fti_current_user');
        if (!user) {
            navigate('/admin');
            return;
        }
        setCurrentUser(JSON.parse(user));
        loadData();
    }, [navigate]);

    const loadData = async () => {
        setIsLoading(true);
        const data = await fetchDB();
        setEnrollments(data.enrollments || []);
        setMessages(data.messages || []);
        setIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('fti_current_user');
        window.dispatchEvent(new Event('storage'));
        navigate('/admin');
    };

    const handleDeleteEnrollment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) return;
        const updated = enrollments.filter(e => e.id !== id);
        const success = await updateDB({ enrollments: updated, messages });
        if (success) setEnrollments(updated);
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        const updated = messages.filter(m => m.id !== id);
        const success = await updateDB({ enrollments, messages: updated });
        if (success) setMessages(updated);
    };

    const filteredEnrollments = enrollments.filter(e => 
        e.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const Sidebar = () => (
        <div style={{ 
            width: '280px', 
            height: '100vh', 
            position: 'fixed', 
            left: 0, 
            top: 0, 
            background: 'rgba(15, 23, 42, 0.95)', 
            borderRight: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ marginBottom: '40px', padding: '0 10px' }}>
                <div style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '8px' }}>FTI_MAINFRAME</div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white', letterSpacing: '-1px' }}>
                    PENETRATE THE FTI <br /> 2K26 MAINFRAME.
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold', letterSpacing: '1px' }}>ACCESS_LEVEL: {currentUser?.role || 'ADMIN'}</span>
                </div>
            </div>

            <nav style={{ flex: 1 }}>
                <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
                <SidebarItem icon={<Users size={20} />} label="All Participants" active={activeTab === 'Participants'} onClick={() => setActiveTab('Participants')} />
                <SidebarItem icon={<MessageSquare size={20} />} label="Communications" active={activeTab === 'Messages'} onClick={() => setActiveTab('Messages')} />
                <SidebarItem icon={<Settings size={20} />} label="System Config" active={activeTab === 'Config'} onClick={() => setActiveTab('Config')} />
            </nav>

            <button 
                onClick={handleLogout}
                style={{ 
                    marginTop: 'auto', 
                    background: 'none', 
                    border: 'none', 
                    color: '#ef4444', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '12px 15px', 
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
            >
                <LogOut size={20} /> Sign Out
            </button>
        </div>
    );

    const SidebarItem = ({ icon, label, active, onClick }) => (
        <button 
            onClick={onClick}
            style={{ 
                width: '100%',
                background: active ? 'rgba(16, 185, 129, 0.1)' : 'none', 
                border: active ? '1px solid rgba(16, 185, 129, 0.2)' : 'none', 
                color: active ? '#10b981' : 'var(--text-secondary)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                padding: '12px 15px', 
                marginBottom: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: active ? 'bold' : 'normal',
                borderRadius: '12px',
                transition: 'all 0.3s'
            }}
        >
            {icon} {label}
        </button>
    );

    const StatCard = ({ label, value, subtext, icon, color }) => (
        <div className="glass-panel" style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05 }}>
                {icon}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px' }}>{label.toUpperCase()}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', marginBottom: '5px' }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: color }}>{subtext}</div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: 'white', paddingLeft: '280px' }}>
            <Sidebar />

            <main style={{ padding: '40px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '5px' }}>System Overview</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <strong style={{ color: '#10b981' }}>{currentUser?.username || 'ADMIN'}</strong></p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={loadData} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px' }}>
                            <RefreshCw size={18} style={{ marginRight: '8px' }} /> Sync Data
                        </button>
                    </div>
                </div>

                {activeTab === 'Overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Status Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <StatCard label="Total Students" value={enrollments.length} subtext={`Across ${new Set(enrollments.map(e => e.course)).size} courses`} icon={<Users size={120} />} color="#10b981" />
                            <StatCard label="Inquiries" value={messages.length} subtext="Global messages received" icon={<MessageSquare size={120} />} color="#3b82f6" />
                            <StatCard label="System Load" value="Optimal" subtext="All protocols online" icon={<Activity size={120} />} color="#a855f7" />
                            <StatCard label="Security" value="High" subtext="No breaches detected" icon={<Shield size={120} />} color="#f59e0b" />
                        </div>

                        {/* Middle Console */}
                        <div className="glass-panel" style={{ padding: '30px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                <Zap size={24} color="#10b981" />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Registration Gate Protocols</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>FTI_COIMBATORE_INTERNAL</div>
                                        <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>STATUS: STANDBY_CLOSED</div>
                                    </div>
                                    <button style={{ background: '#10b981', color: 'black', border: 'none', padding: '8px 15px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>OPEN_GATE</button>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>OUTER_NODES</div>
                                        <div style={{ fontSize: '0.75rem', color: '#10b981' }}>STATUS: ACTIVE_OPEN</div>
                                    </div>
                                    <button style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 15px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>SHUTDOWN</button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                            <div className="glass-panel" style={{ padding: '0' }}>
                                <div style={{ padding: '25px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Recent Enrollments</h3>
                                    <button onClick={() => setActiveTab('Participants')} style={{ color: '#10b981', background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>View All <ArrowUpRight size={14} /></button>
                                </div>
                                <div style={{ padding: '10px' }}>
                                    {enrollments.slice(0, 5).map((e, i) => (
                                        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: i === 4 ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' }}>{e.name?.[0]}</div>
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{e.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.course}</div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#10b981' }}>VERIFIED</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{e.phone}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {enrollments.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No enrollments yet.</div>}
                                </div>
                            </div>
                            
                            <div className="glass-panel" style={{ padding: '25px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>System Logs</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <LogEntry icon={<CheckCircle size={14} color="#10b981" />} text="Database synchronized" time="Just now" />
                                    <LogEntry icon={<Shield size={14} color="#3b82f6" />} text="Admin session established" time="15m ago" />
                                    <LogEntry icon={<Zap size={14} color="#f59e0b" />} text="Gate protocol 2 updated" time="2h ago" />
                                    <LogEntry icon={<Database size={14} color="#a855f7" />} text="New entry: Rahul Sharma" time="5h ago" />
                                    <LogEntry icon={<Clock size={14} color="var(--text-secondary)" />} text="Backup scheduled" time="Tomorrow" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(activeTab === 'Participants' || activeTab === 'Messages') && (
                    <div className="glass-panel" style={{ padding: '0' }}>
                        <div style={{ padding: '25px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{activeTab === 'Participants' ? 'Unified Student Ledger' : 'Communication Logs'}</h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Search records..." 
                                        style={{ padding: '10px 15px 10px 40px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '0.9rem' }}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 15px' }}><Filter size={18} /></button>
                                <button className="btn-primary" style={{ background: '#10b981', color: 'black', padding: '10px 15px' }}><Download size={18} /></button>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <th style={{ padding: '15px 25px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{activeTab === 'Participants' ? 'REFERENCE ID' : 'MESSAGE ID'}</th>
                                        <th style={{ padding: '15px 25px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>NAME / IDENTITY</th>
                                        <th style={{ padding: '15px 25px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{activeTab === 'Participants' ? 'COURSE' : 'SUBJECT'}</th>
                                        <th style={{ padding: '15px 25px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>STATUS</th>
                                        <th style={{ padding: '15px 25px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeTab === 'Participants' ? filteredEnrollments : messages).map((item, i) => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                                            <td style={{ padding: '20px 25px', fontSize: '0.85rem', color: '#3b82f6', fontWeight: 'bold' }}>{item.id.substring(0, 8).toUpperCase()}</td>
                                            <td style={{ padding: '20px 25px' }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.email || item.phone}</div>
                                            </td>
                                            <td style={{ padding: '20px 25px', fontSize: '0.9rem' }}>{item.course || item.subject || 'N/A'}</td>
                                            <td style={{ padding: '20px 25px' }}>
                                                <span style={{ 
                                                    padding: '5px 12px', 
                                                    borderRadius: '20px', 
                                                    fontSize: '0.7rem', 
                                                    fontWeight: 'bold', 
                                                    background: 'rgba(16, 185, 129, 0.1)', 
                                                    color: '#10b981',
                                                    border: '1px solid rgba(16, 185, 129, 0.2)'
                                                }}>VERIFIED & PROCESSED</span>
                                            </td>
                                            <td style={{ padding: '20px 25px' }}>
                                                <button 
                                                    onClick={() => activeTab === 'Participants' ? handleDeleteEnrollment(item.id) : handleDeleteMessage(item.id)}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {((activeTab === 'Participants' ? filteredEnrollments : messages).length === 0) && (
                                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No records found in the database.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'Config' && (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                        <Database size={64} color="#10b981" style={{ marginBottom: '20px', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px' }}>Mainframe Config</h3>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 30px' }}>
                            Update system-wide parameters, manage administrator access levels, and configure automated broadcast protocols.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <button className="btn-primary" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981' }}>Security Protocols</button>
                            <button className="btn-primary" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>API Integration</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const LogEntry = ({ icon, text, time }) => (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
        <div style={{ marginTop: '3px' }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{text}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{time}</div>
        </div>
    </div>
);

export default Admin;
