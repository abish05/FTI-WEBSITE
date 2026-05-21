import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Users, MessageSquare,
    LogOut, Search, Download, Trash2, Menu, X, 
    ShieldCheck, Zap, RefreshCw, Plus, UserPlus, Mail, Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    subscribeToEnrollments,
    subscribeToMessages,
    subscribeToAdmins,
    fetchDB,
    deleteEnrollment,
    deleteMessage,
    addEnrollment,
    addAdmin,
    updateAdmin,
    deleteAdmin
} from '../api/db';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [enrollments, setEnrollments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ fullName: '', email: '', phone: '', course: 'Web Development', remarks: '' });
    const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString());
    const [isConnected, setIsConnected] = useState(false);
    
    // Admin Management Form State
    const [adminForm, setAdminForm] = useState({ username: '', email: '', role: 'Admin', password: '' });
    const [editingAdminId, setEditingAdminId] = useState(null);

    const user = JSON.parse(localStorage.getItem('fti_current_user'));

    useEffect(() => {
        if (!user) {
            navigate('/admin');
            return;
        }

        // Subscribe to real-time admins updates from Firestore
        const unsubAdmins = subscribeToAdmins((data) => {
            setAdmins(data);
        });

        // Cleanup subscriptions on unmount
        return () => {
            unsubEnrollments();
            unsubMessages();
            unsubAdmins();
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('fti_current_user');
        navigate('/admin');
    };

    const handleDeleteEnrollment = async (id) => {
        if (window.confirm('Delete this record permanently?')) {
            const success = await deleteEnrollment(id);
            if (!success) alert('Failed to delete. Please try again.');
        }
    };

    const handleDeleteMessage = async (id) => {
        if (window.confirm('Delete this message permanently?')) {
            await deleteMessage(id);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await addEnrollment(newStudent);
        if (result.success) {
            setShowAddModal(false);
            setNewStudent({ fullName: '', email: '', phone: '', course: 'Web Development', remarks: '' });
        } else {
            alert('Failed to add student. Please check your connection.');
        }
        setIsLoading(false);
    };

    const exportCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Course', 'Date', 'Remarks'];
        const rows = enrollments.map(e => [e.fullName, e.email, e.phone, e.course, e.date, e.remarks || '']);
        const csvContent = [headers, ...rows].map(r => r.map(v => `"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `FTI_Students_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    const SidebarItem = ({ icon, label, active, onClick }) => (
        <div 
            onClick={onClick}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '14px', 
                padding: '14px 18px', 
                marginBottom: '10px',
                cursor: 'pointer',
                borderRadius: '16px',
                background: active ? 'rgba(17, 138, 139, 0.12)' : 'transparent',
                color: active ? '#118a8b' : '#94a3b8',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                border: active ? '1px solid rgba(17, 138, 139, 0.25)' : '1px solid transparent'
            }}
            className="sidebar-item"
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px' }}>
                {icon}
            </div>
            <span style={{ fontWeight: active ? '700' : '500', fontSize: '0.95rem', letterSpacing: '0.01em' }}>{label}</span>
        </div>
    );

    const StatCard = ({ label, value, subtext, icon, color }) => (
        <div className="glass-panel" style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <h3 style={{ fontSize: '2rem', margin: '10px 0 5px 0', fontWeight: '800' }}>{value}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{subtext}</p>
            </div>
            <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', color: `${color}15`, transform: 'rotate(-15deg)' }}>
                {icon}
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: 'white', display: 'flex' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
                .glass-panel { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(30, 41, 59, 1); border-radius: 24px; }
                .admin-sidebar { width: 280px; height: 100vh; position: fixed; left: 0; top: 0; background: #0b0f1a; border-right: 1px solid rgba(30, 41, 59, 1); padding: 35px 22px; display: flex; flex-direction: column; z-index: 1000; transition: transform 0.3s; }
                .admin-main { flex: 1; margin-left: 280px; padding: 50px 60px; min-width: 0; }
                .sidebar-item:hover { background: rgba(255,255,255,0.03); color: white; }
                @media (max-width: 1024px) {
                    .admin-sidebar { transform: translateX(-100%); }
                    .admin-sidebar.open { transform: translateX(0); }
                    .admin-main { margin-left: 0; padding: 20px; }
                }
                .form-input { width: 100%; background: rgba(2, 6, 23, 0.8); border: 1px solid rgba(30, 41, 59, 1); border-radius: 12px; padding: 12px 15px; color: white; margin-bottom: 15px; outline: none; transition: border 0.3s; box-sizing: border-box; }
                .form-input:focus { border-color: #118a8b; }
                .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #118a8b; box-shadow: 0 0 10px #118a8b; animation: pulse 2s infinite; }
            `}</style>

            {/* Sidebar */}
            <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: '#118a8b', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Mainframe</p>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>FTI CONTROL</h2>
                    </div>
                    <button className="mobile-only" onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ flex: 1 }}>
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'Overview'} onClick={() => { setActiveTab('Overview'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={<Users size={20} />} label="Student Ledger" active={activeTab === 'Participants'} onClick={() => { setActiveTab('Participants'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={<MessageSquare size={20} />} label="Inquiries" active={activeTab === 'Messages'} onClick={() => { setActiveTab('Messages'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={<ShieldCheck size={20} />} label="System Config" active={activeTab === 'Config'} onClick={() => { setActiveTab('Config'); setIsSidebarOpen(false); }} />
                </div>

                <button 
                    onClick={handleLogout}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600' }}
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </div>

            {/* Main Content */}
            <main className="admin-main">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button className="mobile-only" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#118a8b' }}>
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{activeTab}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                                <div className="live-dot"></div>
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                    {isConnected ? `LIVE • Last updated: ${syncTime}` : 'Connecting to Firestore...'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', align: 'center', gap: '8px', background: 'rgba(17,138,139,0.1)', border: '1px solid rgba(17,138,139,0.2)', borderRadius: '12px', padding: '8px 14px' }}>
                        <Zap size={16} color="#118a8b" />
                        <span style={{ fontSize: '0.8rem', color: '#118a8b', fontWeight: '700' }}>FIREBASE LIVE</span>
                    </div>
                </header>

                {/* Loading State */}
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(17,138,139,0.2)', borderTopColor: '#118a8b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }}></div>
                        <p style={{ color: '#64748b' }}>Connecting to Firestore...</p>
                    </div>
                )}

                {/* OVERVIEW */}
                {!isLoading && activeTab === 'Overview' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', marginBottom: '45px' }}>
                            <StatCard label="Total Students" value={enrollments.length} subtext="Active Enrollments" icon={<Users size={85} />} color="#118a8b" />
                            <StatCard label="Enquiries" value={messages.length} subtext="Total Messages" icon={<MessageSquare size={85} />} color="#118a8b" />
                            <StatCard label="Database" value="Firestore" subtext="Real-time Cloud Sync" icon={<Zap size={85} />} color="#118a8b" />
                            <StatCard label="Access Level" value="Root" subtext={user?.role || 'Admin'} icon={<ShieldCheck size={85} />} color="#f59e0b" />
                        </div>

                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '700' }}>Recent Activity</h3>
                            {enrollments.length === 0 ? (
                                <p style={{ color: '#64748b', textAlign: 'center', padding: '30px' }}>No enrollments yet. Data will appear here instantly when students apply.</p>
                            ) : (
                                enrollments.slice(0, 5).map(e => (
                                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(30, 41, 59, 0.5)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(17, 138, 139, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#118a8b' }}>
                                                <UserPlus size={20} />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: '600' }}>{e.fullName} enrolled</p>
                                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{e.course} • {e.date}</p>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#118a8b', fontWeight: '700' }}>NEW</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* STUDENT LEDGER */}
                {!isLoading && activeTab === 'Participants' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input 
                                    type="text" 
                                    placeholder="Search student ledger..." 
                                    className="form-input" 
                                    style={{ paddingLeft: '45px', marginBottom: 0 }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button onClick={() => setShowAddModal(true)} style={{ background: '#118a8b', color: '#020617', border: 'none', borderRadius: '12px', padding: '0 20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <Plus size={20} /> Add Student
                            </button>
                            <button onClick={exportCSV} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0 20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <Download size={18} /> Export CSV
                            </button>
                        </div>

                        <div className="glass-panel" style={{ overflowX: 'auto' }}>
                            {enrollments.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <Users size={48} color="#1e293b" style={{ margin: '0 auto 15px' }} />
                                    <p style={{ color: '#64748b' }}>No students enrolled yet.<br />Data appears here instantly when someone submits the Admission form.</p>
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(30, 41, 59, 1)' }}>
                                            <th style={{ padding: '20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Student</th>
                                            <th style={{ padding: '20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Contact</th>
                                            <th style={{ padding: '20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Course</th>
                                            <th style={{ padding: '20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Remarks</th>
                                            <th style={{ padding: '20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrollments
                                            .filter(e => 
                                                (e.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                (e.course || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                (e.email || '').toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map(e => (
                                                <tr key={e.id} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.5)' }}>
                                                    <td style={{ padding: '20px' }}>
                                                        <div style={{ fontWeight: '600' }}>{e.fullName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Joined {e.date}</div>
                                                    </td>
                                                    <td style={{ padding: '20px' }}>
                                                        <div>{e.phone}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{e.email}</div>
                                                    </td>
                                                    <td style={{ padding: '20px' }}>
                                                        <span style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(17, 138, 139, 0.1)', color: '#118a8b', fontSize: '0.8rem', fontWeight: '600' }}>{e.course}</span>
                                                    </td>
                                                    <td style={{ padding: '20px', color: '#94a3b8', fontSize: '0.9rem' }}>{e.remarks || '---'}</td>
                                                    <td style={{ padding: '20px', textAlign: 'center' }}>
                                                        <button onClick={() => handleDeleteEnrollment(e.id)} style={{ padding: '10px', borderRadius: '10px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* INQUIRIES / MESSAGES */}
                {!isLoading && activeTab === 'Messages' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        {messages.length === 0 ? (
                            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <MessageSquare size={48} color="#1e293b" style={{ margin: '0 auto 15px' }} />
                                <p style={{ color: '#64748b' }}>No messages yet.<br />Messages from the Contact page appear here instantly.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {messages.map(m => (
                                    <div key={m.id} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(17,138,139,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Mail size={16} color="#118a8b" />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '700', margin: 0 }}>{m.name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{m.email} • {m.date}</p>
                                                </div>
                                            </div>
                                            <p style={{ color: '#94a3b8', marginLeft: '46px', lineHeight: '1.6' }}>{m.message}</p>
                                        </div>
                                        <button onClick={() => handleDeleteMessage(m.id)} style={{ padding: '8px', borderRadius: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer', flexShrink: 0 }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* SYSTEM CONFIG */}
                {!isLoading && activeTab === 'Config' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div className="glass-panel" style={{ padding: '40px', maxWidth: '800px' }}>
                            <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <ShieldCheck color="#118a8b" size={32} /> Admin Management
                            </h2>
                            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Authorize new administrators or manage existing staff access.</p>
                            
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if (editingAdminId) {
                                    const result = await updateAdmin(editingAdminId, adminForm);
                                    if (result) {
                                        setEditingAdminId(null);
                                        setAdminForm({ username: '', email: '', role: 'Admin', password: '' });
                                        alert("Admin Updated Successfully.");
                                    } else {
                                        alert("Failed to update admin.");
                                    }
                                } else {
                                    const result = await addAdmin(adminForm);
                                    if (result.success) {
                                        setAdminForm({ username: '', email: '', role: 'Admin', password: '' });
                                        alert("Admin Authorized Successfully.");
                                    } else {
                                        alert("Failed to add admin.");
                                    }
                                }
                            }} style={{ marginBottom: '40px', padding: '25px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', color: '#64748b' }}>Full Name / Display Name</label>
                                        <input required name="username" value={adminForm.username} onChange={(e) => setAdminForm({...adminForm, username: e.target.value})} className="form-input" placeholder="e.g. CIO Name" style={{ marginBottom: 0 }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', color: '#64748b' }}>Admin Email Address</label>
                                        <input required name="email" type="email" value={adminForm.email} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} className="form-input" placeholder="cio@example.com" style={{ marginBottom: 0 }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', color: '#64748b' }}>Access Level</label>
                                        <select name="role" value={adminForm.role} onChange={(e) => setAdminForm({...adminForm, role: e.target.value})} className="form-input" style={{ appearance: 'none', marginBottom: 0 }}>
                                            <option value="Admin">Standard Admin (View & Edit)</option>
                                            <option value="Manager">Manager (Reports Only)</option>
                                            <option value="Staff">Staff (View Only)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', color: '#64748b' }}>Passcode / Password</label>
                                        <input required name="password" type="text" value={adminForm.password} onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} className="form-input" placeholder="Set a secure password" style={{ marginBottom: 0 }} />
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button type="submit" style={{ flex: 1, padding: '14px', background: '#118a8b', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
                                        {editingAdminId ? 'Save Changes' : 'Authorize Access'}
                                    </button>
                                    {editingAdminId && (
                                        <button type="button" onClick={() => {
                                            setEditingAdminId(null);
                                            setAdminForm({ username: '', email: '', role: 'Admin', password: '' });
                                        }} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div>
                                <h3 style={{ fontSize: '1rem', marginBottom: '20px', color: 'white' }}>Current Authorized Personnel</h3>
                                {admins.map(a => (
                                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '10px' }}>
                                        <div>
                                            <p style={{ fontWeight: 'bold', margin: 0 }}>{a.username}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{a.email}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: 'rgba(17, 138, 139, 0.1)', color: '#118a8b' }}>{a.role}</span>
                                            
                                            <button 
                                                onClick={() => {
                                                    setEditingAdminId(a.id);
                                                    setAdminForm({ username: a.username, email: a.email, role: a.role, password: a.password || '' });
                                                }}
                                                style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }}
                                                title="Edit Admin"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            <button 
                                                onClick={async () => {
                                                    if(confirm('Revoke access for this admin?')){
                                                        const success = await deleteAdmin(a.id);
                                                        if (success) {
                                                            if (editingAdminId === a.id) {
                                                                setEditingAdminId(null);
                                                                setAdminForm({ username: '', email: '', role: 'Admin', password: '' });
                                                            }
                                                        }
                                                    }
                                                }}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                title="Revoke Access"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {admins.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No additional admins configured.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* ADD STUDENT MODAL */}
                {showAddModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
                        <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '40px', animation: 'fadeIn 0.3s ease-out' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Add New Student</h2>
                                <button onClick={() => setShowAddModal(false)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddStudent}>
                                <input placeholder="Full Name" className="form-input" required value={newStudent.fullName} onChange={e => setNewStudent({...newStudent, fullName: e.target.value})} />
                                <input placeholder="Email Address" type="email" className="form-input" required value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
                                <input placeholder="Phone Number" className="form-input" required value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                                <select className="form-input" value={newStudent.course} onChange={e => setNewStudent({...newStudent, course: e.target.value})}>
                                    <option>Web Development</option>
                                    <option>Cyber Security</option>
                                    <option>Data Science & AI</option>
                                    <option>Artificial Intelligence</option>
                                    <option>Cloud Computing</option>
                                    <option>Mobile App Dev</option>
                                </select>
                                <textarea placeholder="Remarks (Optional)" className="form-input" rows="3" style={{ resize: 'none' }} value={newStudent.remarks} onChange={e => setNewStudent({...newStudent, remarks: e.target.value})}></textarea>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    style={{ width: '100%', padding: '15px', background: isLoading ? '#1e293b' : '#118a8b', color: isLoading ? '#94a3b8' : '#020617', border: 'none', borderRadius: '12px', fontWeight: '800', marginTop: '10px', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                >
                                    {isLoading ? (
                                        <>
                                            <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                            SAVING...
                                        </>
                                    ) : 'PERMANENTLY REGISTER STUDENT'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
