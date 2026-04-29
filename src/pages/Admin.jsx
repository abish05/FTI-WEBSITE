import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Trash2, LogOut, Users, UserPlus, Shield, UserX, MessageSquare, Download } from 'lucide-react';

const Admin = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('enrollments');
    const [enrollments, setEnrollments] = useState([]);
    const [messages, setMessages] = useState([]);

    // Admin Management State
    const [adminsList, setAdminsList] = useState([]);
    const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });

    useEffect(() => {
        const userStr = localStorage.getItem('fti_current_user');
        if (!userStr) {
            navigate('/admin');
            return;
        }
        const user = JSON.parse(userStr);
        setCurrentUser(user);

        // Load data
        setEnrollments(JSON.parse(localStorage.getItem('fti_enrollments') || '[]'));
        setAdminsList(JSON.parse(localStorage.getItem('fti_admins') || '[]'));
        setMessages(JSON.parse(localStorage.getItem('fti_messages') || '[]'));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('fti_current_user');
        navigate('/admin');
    };

    const clearEnrollmentsData = () => {
        if (window.confirm('Are you sure you want to clear all enrollment data?')) {
            localStorage.removeItem('fti_enrollments');
            setEnrollments([]);
        }
    };

    const clearMessagesData = () => {
        if (window.confirm('Are you sure you want to delete all messages?')) {
            localStorage.removeItem('fti_messages');
            setMessages([]);
        }
    };

    const handleAddAdmin = (e) => {
        e.preventDefault();
        if (!newAdmin.username || !newAdmin.password) return;

        // Check if exists
        if (adminsList.some(a => a.username === newAdmin.username)) {
            alert("Username already exists!");
            return;
        }

        const newAdminObj = {
            id: Date.now().toString(),
            username: newAdmin.username,
            password: newAdmin.password,
            role: 'admin',
            createdAt: new Date().toLocaleDateString()
        };

        const updated = [...adminsList, newAdminObj];
        setAdminsList(updated);
        localStorage.setItem('fti_admins', JSON.stringify(updated));
        setNewAdmin({ username: '', password: '' });
    };

    const handleDeleteAdmin = (id) => {
        if (window.confirm('Are you sure you want to remove this admin?')) {
            const updated = adminsList.filter(a => a.id !== id);
            setAdminsList(updated);
            localStorage.setItem('fti_admins', JSON.stringify(updated));
        }
    };

    const downloadReport = (type) => {
        const now = Date.now();
        let filtered = enrollments;

        if (type !== 'all') {
            const oneDay = 24 * 60 * 60 * 1000;
            let timeLimit = now;
            if (type === 'daily') timeLimit = now - oneDay;
            else if (type === 'weekly') timeLimit = now - (7 * oneDay);
            else if (type === 'monthly') timeLimit = now - (30 * oneDay);

            filtered = enrollments.filter(e => {
                const timestamp = parseInt(e.id);
                if (isNaN(timestamp)) return true; // Include items without a valid timestamp ID
                return timestamp >= timeLimit;
            });
        }

        if (filtered.length === 0) {
            alert(`No enrollments found for the selected period (${type}).`);
            return;
        }

        const headers = ['Date', 'Student Name', 'Email', 'Phone', 'Course', 'Remarks'];
        const csvContent = [
            headers.join(','),
            ...filtered.map(e => `"${e.date || ''}","${e.fullName || ''}","${e.email || ''}","${e.phone || ''}","${e.course || ''}","${(e.remarks || '').replace(/"/g, '""')}"`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `fti_enrollment_report_${type}_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!currentUser) return null;

    return (
        <div className="section" style={{ maxWidth: '1200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <strong style={{ color: 'white' }}>{currentUser.username}</strong> ({currentUser.role}).</p>
                </div>
                <button onClick={handleLogout} className="btn-primary" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)' }}>
                    <LogOut size={18} style={{ marginRight: '8px' }} /> Log Out
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <button
                    onClick={() => setActiveTab('enrollments')}
                    className={`btn-primary ${activeTab !== 'enrollments' ? 'inactive-tab' : ''}`}
                    style={activeTab !== 'enrollments' ? { background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' } : {}}
                >
                    <Database size={18} style={{ marginRight: '8px' }} /> Enrollments
                </button>
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`btn-primary ${activeTab !== 'messages' ? 'inactive-tab' : ''}`}
                    style={activeTab !== 'messages' ? { background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' } : {}}
                >
                    <MessageSquare size={18} style={{ marginRight: '8px' }} /> Messages
                </button>
                {currentUser.role === 'owner' && (
                    <button
                        onClick={() => setActiveTab('admins')}
                        className={`btn-primary ${activeTab !== 'admins' ? 'inactive-tab' : ''}`}
                        style={activeTab !== 'admins' ? { background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' } : {}}
                    >
                        <Shield size={18} style={{ marginRight: '8px' }} /> Manage Admins
                    </button>
                )}
            </div>

            {activeTab === 'enrollments' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}><Download size={18} /></span>
                            <select 
                                onChange={(e) => {
                                    if(e.target.value) {
                                        downloadReport(e.target.value);
                                        e.target.value = "";
                                    }
                                }}
                                className="form-input" 
                                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                            >
                                <option value="" style={{ color: 'black' }}>Download Report...</option>
                                <option value="daily" style={{ color: 'black' }}>Daily Report (Last 24h)</option>
                                <option value="weekly" style={{ color: 'black' }}>Weekly Report (Last 7d)</option>
                                <option value="monthly" style={{ color: 'black' }}>Monthly Report (Last 30d)</option>
                                <option value="all" style={{ color: 'black' }}>All-Time Report</option>
                            </select>
                        </div>
                        <button onClick={clearEnrollmentsData} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                            <Trash2 size={16} style={{ marginRight: '8px' }} /> Clear All Data
                        </button>
                    </div>
                    {enrollments.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                            <Database size={48} color="var(--text-secondary)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>No enrollments found</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '10px' }}>New submissions will appear here automatically.</p>
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                                        <tr>
                                            <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Date</th>
                                            <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Student Name</th>
                                            <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Contact</th>
                                            <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Selected Course</th>
                                            <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrollments.map((entry) => (
                                            <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '20px', color: 'var(--text-secondary)' }}>{entry.date}</td>
                                                <td style={{ padding: '20px', fontWeight: '500' }}>{entry.fullName}</td>
                                                <td style={{ padding: '20px' }}>
                                                    <div style={{ color: 'var(--text-secondary)' }}>{entry.email}</div>
                                                    <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>{entry.phone}</div>
                                                </td>
                                                <td style={{ padding: '20px' }}>
                                                    <span style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '12px', fontSize: '0.9rem' }}>
                                                        {entry.course}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '20px', color: 'var(--text-secondary)', maxWidth: '250px' }}>
                                                    {entry.remarks || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'messages' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button onClick={clearMessagesData} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                            <Trash2 size={16} style={{ marginRight: '8px' }} /> Clear All Messages
                        </button>
                    </div>
                    {messages.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                            <MessageSquare size={48} color="var(--text-secondary)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>No messages yet</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '10px' }}>Messages from the Contact form will appear here.</p>
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                                        <tr>
                                            <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Date</th>
                                            <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Sender Name</th>
                                            <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Email Address</th>
                                            <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Message content</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messages.map((entry) => (
                                            <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '20px', color: 'var(--text-secondary)' }}>{entry.date}</td>
                                                <td style={{ padding: '20px', fontWeight: '500' }}>{entry.name}</td>
                                                <td style={{ padding: '20px', color: '#60a5fa' }}>{entry.email}</td>
                                                <td style={{ padding: '20px', maxWidth: '400px', lineHeight: '1.6' }}>
                                                    {entry.message}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'admins' && currentUser.role === 'owner' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
                    <div className="glass-panel" style={{ padding: '30px', alignSelf: 'start' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <UserPlus size={20} color="var(--accent)" /> Add New Admin
                        </h3>
                        <form onSubmit={handleAddAdmin}>
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input type="text" className="form-input" required value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-input" required value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Admin</button>
                        </form>
                    </div>

                    <div className="glass-panel" style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Users size={20} color="#c084fc" /> Authorized Administrators
                            </h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <tr>
                                        <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Username</th>
                                        <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Role</th>
                                        <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Added On</th>
                                        <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminsList.map((admin) => (
                                        <tr key={admin.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px 20px', fontWeight: '500' }}>
                                                {admin.username} {admin.role === 'owner' && <Shield size={14} color="#f59e0b" style={{ marginLeft: '5px' }} />}
                                            </td>
                                            <td style={{ padding: '15px 20px' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    background: admin.role === 'owner' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                                    color: admin.role === 'owner' ? '#f59e0b' : '#c084fc',
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{admin.createdAt}</td>
                                            <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                                {admin.role !== 'owner' && (
                                                    <button onClick={() => handleDeleteAdmin(admin.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }} title="Remove Admin">
                                                        <UserX size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Admin;
