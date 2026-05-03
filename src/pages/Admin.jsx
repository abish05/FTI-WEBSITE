import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, MessageSquare, Settings, 
    LogOut, Shield, ShieldCheck, Zap, Globe, 
    Search, Filter, Download, ArrowUpRight, 
    Calendar, CheckCircle, Clock, Trash2,
    Database, Activity, RefreshCw, UserPlus, X, Menu
} from 'lucide-react';
import { fetchDB, updateDB } from '../api/db';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [enrollments, setEnrollments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // New Admin Form
    const [newAdmin, setNewAdmin] = useState({ email: '', username: '', role: 'Admin' });

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
        setAdmins(data.admins || []);
        setIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('fti_current_user');
        window.dispatchEvent(new Event('storage'));
        navigate('/admin');
    };

    const handleUpdateDB = async (newData) => {
        const success = await updateDB({ 
            enrollments: newData.enrollments || enrollments, 
            messages: newData.messages || messages,
            admins: newData.admins || admins
        });
        if (success) {
            if (newData.enrollments) setEnrollments(newData.enrollments);
            if (newData.messages) setMessages(newData.messages);
            if (newData.admins) setAdmins(newData.admins);
        }
        return success;
    };

    const handleDeleteEnrollment = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        handleUpdateDB({ enrollments: enrollments.filter(e => e.id !== id) });
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        handleUpdateDB({ messages: messages.filter(m => m.id !== id) });
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        if (admins.find(a => a.email === newAdmin.email)) {
            alert('Admin already exists');
            return;
        }
        const updatedAdmins = [...admins, { ...newAdmin, id: Date.now().toString() }];
        const success = await handleUpdateDB({ admins: updatedAdmins });
        if (success) setNewAdmin({ email: '', username: '', role: 'Admin' });
    };

    const handleDeleteAdmin = async (id) => {
        const adminToDelete = admins.find(a => a.id === id);
        if (adminToDelete?.email === 'abishstk@gmail.com') {
            alert('Cannot remove Master Admin');
            return;
        }
        if (!window.confirm('Remove admin access?')) return;
        handleUpdateDB({ admins: admins.filter(a => a.id !== id) });
    };

    const filteredEnrollments = enrollments.filter(e => 
        e.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const Sidebar = () => (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(4px)' }}
                ></div>
            )}
            
            <div style={{ 
                width: '280px', 
                height: '100vh', 
                position: 'fixed', 
                left: isSidebarOpen ? '0' : '-280px', 
                top: 0, 
                background: 'rgba(15, 23, 42, 0.98)', 
                borderRight: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                backdropFilter: 'blur(10px)',
                transition: 'left 0.3s ease-in-out'
            }} className="admin-sidebar">
                <div style={{ marginBottom: '40px', padding: '0 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '8px' }}>FTI_MAINFRAME</div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white', letterSpacing: '-1px' }}>
                            FTI CONTROL <br /> CENTER
                        </h2>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} className="mobile-only">
                        <X size={24} />
                    </button>
                </div>

                <nav style={{ flex: 1 }}>
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'Overview'} onClick={() => { setActiveTab('Overview'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={<Users size={20} />} label="Student Database" active={activeTab === 'Participants'} onClick={() => { setActiveTab('Participants'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={<MessageSquare size={20} />} label="Inquiries" active={activeTab === 'Messages'} onClick={() => { setActiveTab('Messages'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={<Settings size={20} />} label="Master Control" active={activeTab === 'Config'} onClick={() => { setActiveTab('Config'); setIsSidebarOpen(false); }} />
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
                >
                    <LogOut size={20} /> Sign Out
                </button>
            </div>
        </>
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
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px' }}>{label.toUpperCase()}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', marginBottom: '5px' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: color }}>{subtext}</div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: 'white' }}>
            <style>{`
                .admin-main { padding-left: 280px; transition: padding 0.3s; }
                @media (max-width: 1024px) {
                    .admin-main { padding-left: 0; }
                    .admin-sidebar { left: -280px; }
                    .mobile-only { display: block !important; }
                    .desktop-only { display: none !important; }
                }
                .mobile-only { display: none; }
                .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
                .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
                .admin-table { min-width: 800px; }
            `}</style>

            <Sidebar />

            <main className="admin-main" style={{ padding: '30px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button onClick={() => setIsSidebarOpen(true)} className="mobile-only" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '8px' }}>
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>{activeTab}</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Welcome, <strong style={{ color: '#10b981' }}>{currentUser?.username}</strong></p>
                        </div>
                    </div>
                    <button onClick={loadData} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 15px', borderRadius: '10px' }}>
                        <RefreshCw size={18} className={isLoading ? 'spin' : ''} />
                    </button>
                </div>

                {activeTab === 'Overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div className="stat-grid">
                            <StatCard label="Total Students" value={enrollments.length} subtext="Active Enrollments" icon={<Users size={80} />} color="#10b981" />
                            <StatCard label="Messages" value={messages.length} subtext="Pending Inquiries" icon={<MessageSquare size={80} />} color="#3b82f6" />
                            <StatCard label="Admins" value={admins.length + 1} subtext="Authorized Users" icon={<ShieldCheck size={80} />} color="#f59e0b" />
                            <StatCard label="Status" value="Live" subtext="All Systems Optimal" icon={<Zap size={80} />} color="#a855f7" />
                        </div>

                        <div className="glass-panel" style={{ padding: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock size={20} color="#10b981" /> Recent Activity
                            </h3>
                            <div className="table-container">
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <th style={{ padding: '15px' }}>NAME</th>
                                            <th style={{ padding: '15px' }}>COURSE</th>
                                            <th style={{ padding: '15px' }}>DATE</th>
                                            <th style={{ padding: '15px' }}>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrollments.slice(0, 5).map(e => (
                                            <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                <td style={{ padding: '15px', fontWeight: '600' }}>{e.fullName}</td>
                                                <td style={{ padding: '15px', fontSize: '0.9rem' }}>{e.course}</td>
                                                <td style={{ padding: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.date}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>NEW</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Participants' && (
                    <div className="glass-panel" style={{ padding: '0' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Search students..." 
                                    style={{ width: '100%', padding: '10px 15px 10px 40px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="btn-primary" style={{ background: '#10b981', color: 'black', padding: '10px 20px', borderRadius: '10px' }}>
                                <Download size={18} style={{ marginRight: '8px' }} /> Export CSV
                            </button>
                        </div>

                        <div className="table-container">
                            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                                        <th style={{ padding: '15px 20px' }}>NAME</th>
                                        <th style={{ padding: '15px 20px' }}>CONTACT</th>
                                        <th style={{ padding: '15px 20px' }}>COURSE</th>
                                        <th style={{ padding: '15px 20px' }}>REMARKS</th>
                                        <th style={{ padding: '15px 20px' }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEnrollments.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <td style={{ padding: '15px 20px' }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.fullName}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ID: {item.id.substring(0,8)}</div>
                                            </td>
                                            <td style={{ padding: '15px 20px' }}>
                                                <div style={{ fontSize: '0.9rem' }}>{item.phone}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.email}</div>
                                            </td>
                                            <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>{item.course}</td>
                                            <td style={{ padding: '15px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.remarks || 'No remarks'}
                                            </td>
                                            <td style={{ padding: '15px 20px' }}>
                                                <button onClick={() => handleDeleteEnrollment(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Messages' && (
                    <div className="glass-panel" style={{ padding: '25px' }}>
                        <div className="table-container">
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <th style={{ padding: '15px' }}>SENDER</th>
                                        <th style={{ padding: '15px' }}>MESSAGE</th>
                                        <th style={{ padding: '15px' }}>DATE</th>
                                        <th style={{ padding: '15px' }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map(m => (
                                        <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ fontWeight: 'bold' }}>{m.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.email}</div>
                                            </td>
                                            <td style={{ padding: '15px', fontSize: '0.9rem', maxWidth: '400px' }}>{m.message}</td>
                                            <td style={{ padding: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.date}</td>
                                            <td style={{ padding: '15px' }}>
                                                <button onClick={() => handleDeleteMessage(m.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Config' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Admin Management Section */}
                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                <Shield size={24} color="#10b981" />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Master Access Control</h3>
                            </div>

                            <form onSubmit={handleAddAdmin} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '40px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px' }}>
                                <input 
                                    required 
                                    placeholder="Admin Email" 
                                    className="form-input" 
                                    value={newAdmin.email} 
                                    onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} 
                                />
                                <input 
                                    required 
                                    placeholder="Username" 
                                    className="form-input" 
                                    value={newAdmin.username} 
                                    onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} 
                                />
                                <select className="form-input" value={newAdmin.role} onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                </select>
                                <button type="submit" className="btn-primary" style={{ background: '#10b981', color: 'black', height: '100%', borderRadius: '10px' }}>
                                    <UserPlus size={18} style={{ marginRight: '8px' }} /> Add Admin
                                </button>
                            </form>

                            <div className="table-container">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textAlign: 'left' }}>
                                            <th style={{ padding: '15px' }}>USERNAME</th>
                                            <th style={{ padding: '15px' }}>EMAIL</th>
                                            <th style={{ padding: '15px' }}>ROLE</th>
                                            <th style={{ padding: '15px' }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Master Admin Row */}
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <td style={{ padding: '15px' }}><div style={{ fontWeight: 'bold' }}>Master (You)</div></td>
                                            <td style={{ padding: '15px' }}>abishstk@gmail.com</td>
                                            <td style={{ padding: '15px' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>OWNER</span></td>
                                            <td style={{ padding: '15px' }}><ShieldCheck size={18} color="#10b981" /></td>
                                        </tr>
                                        {/* Sub-Admins */}
                                        {admins.map(a => (
                                            <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                <td style={{ padding: '15px' }}>{a.username}</td>
                                                <td style={{ padding: '15px' }}>{a.email}</td>
                                                <td style={{ padding: '15px' }}>{a.role}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <button onClick={() => handleDeleteAdmin(a.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
