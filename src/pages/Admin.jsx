import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Users, MessageSquare,
    LogOut, Search, Download, Trash2, Menu, X, 
    ShieldCheck, Zap, RefreshCw, Plus, UserPlus, Mail, Edit,
    Bell, BellOff, Calendar, CheckCircle, Clock, AlertCircle, ToggleLeft, ToggleRight, Eye, ClipboardList
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
    deleteAdmin,
    updateAdminStatus,
    getPopupConfig,
    savePopupConfig,
    subscribeToDemoBookings,
    updateDemoBookingStatus,
    deleteDemoBooking
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

    // Popup Config State
    const [popupConfig, setPopupConfig] = useState({ enabled: false, title: '', message: '', buttonText: 'Book a Free Demo', buttonLink: '' });
    const [isSavingPopup, setIsSavingPopup] = useState(false);
    const [popupSaved, setPopupSaved] = useState(false);

    // Demo Bookings State
    const [demoBookings, setDemoBookings] = useState([]);
    const [bookingSearch, setBookingSearch] = useState('');

    const user = JSON.parse(sessionStorage.getItem('fti_current_user') || 'null');

    useEffect(() => {
        if (!user) {
            navigate('/admin');
            return;
        }

        // Subscribe to real-time admins updates from Firestore
        const unsubAdmins = subscribeToAdmins((data) => {
            setAdmins(data);
        });

        // Subscribe to real-time enrollment updates from Firestore
        const unsubEnrollments = subscribeToEnrollments((data) => {
            setEnrollments(data);
            setSyncTime(new Date().toLocaleTimeString());
            setIsConnected(true);
            setIsLoading(false);
        });

        // Subscribe to real-time message updates from Firestore
        const unsubMessages = subscribeToMessages((data) => {
            setMessages(data);
        });

        // Subscribe to demo bookings
        const unsubDemoBookings = subscribeToDemoBookings((data) => {
            setDemoBookings(data);
        });

        // Load popup config
        getPopupConfig().then(cfg => setPopupConfig(cfg));

        // Handle browser/tab close
        const handleBeforeUnload = () => {
            if (user && user.id && user.id !== 'master') {
                updateAdminStatus(user.id, false);
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup subscriptions on unmount
        return () => {
            if (unsubEnrollments) unsubEnrollments();
            if (unsubMessages) unsubMessages();
            if (unsubAdmins) unsubAdmins();
            if (unsubDemoBookings) unsubDemoBookings();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleLogout = async () => {
        if (user && user.id && user.id !== 'master') {
            await updateAdminStatus(user.id, false);
        }
        sessionStorage.removeItem('fti_current_user');
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

    const handleSavePopup = async () => {
        setIsSavingPopup(true);
        const success = await savePopupConfig(popupConfig);
        setIsSavingPopup(false);
        if (success) {
            setPopupSaved(true);
            setTimeout(() => setPopupSaved(false), 3000);
        } else {
            alert('Failed to save popup config. Please try again.');
        }
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
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
                .glass-panel { background: var(--bg-secondary); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 24px; }
                .admin-sidebar { width: 280px; height: 100vh; position: fixed; left: 0; top: 0; background: var(--bg-secondary); border-right: 1px solid var(--glass-border); padding: 35px 22px; display: flex; flex-direction: column; z-index: 1000; transition: transform 0.3s; }
                .admin-main { flex: 1; margin-left: 280px; padding: 50px 60px; min-width: 0; }
                .sidebar-item:hover { background: rgba(0,0,0,0.05); color: var(--text-primary); }
                @media (max-width: 1024px) {
                    .admin-sidebar { transform: translateX(-100%); }
                    .admin-sidebar.open { transform: translateX(0); }
                    .admin-main { margin-left: 0; padding: 20px; }
                }
                .form-input { width: 100%; background: var(--bg-secondary); border: 1px solid var(--glass-border); border-radius: 12px; padding: 12px 15px; color: var(--text-primary); margin-bottom: 15px; outline: none; transition: border 0.3s; box-sizing: border-box; }
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
                    <SidebarItem icon={<ClipboardList size={20} />} label="Prospect Registry" active={activeTab === 'ProspectRegistry'} onClick={() => { setActiveTab('ProspectRegistry'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={<MessageSquare size={20} />} label="Inquiries" active={activeTab === 'Messages'} onClick={() => { setActiveTab('Messages'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={<Calendar size={20} />} label="Demo Bookings" active={activeTab === 'DemoBookings'} onClick={() => { setActiveTab('DemoBookings'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={<Bell size={20} />} label="Popup Manager" active={activeTab === 'Popup'} onClick={() => { setActiveTab('Popup'); setIsSidebarOpen(false); }} />
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
                            <StatCard label="Demo Bookings" value={demoBookings.length} subtext={`${demoBookings.filter(b => b.status === 'pending').length} pending`} icon={<Calendar size={85} />} color="#f59e0b" />
                            <StatCard label="Access Level" value="Root" subtext={user?.role || 'Admin'} icon={<ShieldCheck size={85} />} color="#f59e0b" />
                        </div>

                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '700' }}>Recent Activity</h3>
                            {enrollments.length === 0 ? (
                                <p style={{ color: '#64748b', textAlign: 'center', padding: '30px' }}>No enrollments yet. Data will appear here instantly when students apply.</p>
                            ) : (
                                enrollments.slice(0, 5).map(e => (
                                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid var(--glass-border)' }}>
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
                            <button onClick={() => setShowAddModal(true)} style={{ background: '#118a8b', color: 'white', border: 'none', borderRadius: '12px', padding: '0 20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <Plus size={20} /> Add Student
                            </button>
                            <button onClick={exportCSV} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0 20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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
                                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
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
                                                <tr key={e.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
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

                {/* DEMO BOOKINGS */}
                {!isLoading && activeTab === 'DemoBookings' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    className="form-input"
                                    style={{ paddingLeft: '45px', marginBottom: 0 }}
                                    value={bookingSearch}
                                    onChange={(e) => setBookingSearch(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                                {['All', 'pending', 'confirmed', 'completed'].map(s => (
                                    <span key={s} style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', cursor: 'default',
                                        background: s === 'pending' ? 'rgba(245,158,11,0.1)' : s === 'confirmed' ? 'rgba(17,138,139,0.1)' : s === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)',
                                        color: s === 'pending' ? '#f59e0b' : s === 'confirmed' ? '#118a8b' : s === 'completed' ? '#22c55e' : '#64748b',
                                        border: `1px solid ${s === 'pending' ? 'rgba(245,158,11,0.2)' : s === 'confirmed' ? 'rgba(17,138,139,0.2)' : s === 'completed' ? 'rgba(34,197,94,0.2)' : 'rgba(100,116,139,0.2)'}`
                                    }}>
                                        {s === 'All' ? `All (${demoBookings.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${demoBookings.filter(b => b.status === s).length})`}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {demoBookings.length === 0 ? (
                            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <Calendar size={48} color="#1e293b" style={{ margin: '0 auto 15px' }} />
                                <p style={{ color: '#64748b' }}>No demo bookings yet.<br />They will appear here instantly when clients book through the site.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {demoBookings
                                    .filter(b =>
                                        (b.fullName || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
                                        (b.email || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
                                        (b.course || '').toLowerCase().includes(bookingSearch.toLowerCase())
                                    )
                                    .map(b => {
                                        const statusColor = b.status === 'pending' ? '#f59e0b' : b.status === 'confirmed' ? '#118a8b' : '#22c55e';
                                        const statusBg = b.status === 'pending' ? 'rgba(245,158,11,0.1)' : b.status === 'confirmed' ? 'rgba(17,138,139,0.1)' : 'rgba(34,197,94,0.1)';
                                        const StatusIcon = b.status === 'pending' ? Clock : b.status === 'confirmed' ? CheckCircle : CheckCircle;
                                        return (
                                            <div key={b.id} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                                                <div style={{ flex: 1, minWidth: '200px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(17,138,139,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            <Calendar size={20} color="#118a8b" />
                                                        </div>
                                                        <div>
                                                            <p style={{ fontWeight: '700', margin: 0, fontSize: '1rem' }}>{b.fullName}</p>
                                                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{b.email} · {b.phone}</p>
                                                        </div>
                                                        <span style={{ padding: '4px 12px', borderRadius: '20px', background: statusBg, color: statusColor, fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px', border: `1px solid ${statusColor}30` }}>
                                                            <StatusIcon size={12} /> {b.status?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', marginLeft: '54px' }}>
                                                        <div style={{ fontSize: '0.82rem' }}>
                                                            <span style={{ color: '#64748b', fontWeight: '600' }}>Course: </span>
                                                            <span style={{ color: '#118a8b', fontWeight: '600' }}>{b.course}</span>
                                                        </div>
                                                        {b.preferredDate && (
                                                            <div style={{ fontSize: '0.82rem' }}>
                                                                <span style={{ color: '#64748b', fontWeight: '600' }}>Date: </span>
                                                                <span>{b.preferredDate}</span>
                                                            </div>
                                                        )}
                                                        {b.preferredTime && (
                                                            <div style={{ fontSize: '0.82rem' }}>
                                                                <span style={{ color: '#64748b', fontWeight: '600' }}>Time: </span>
                                                                <span>{b.preferredTime}</span>
                                                            </div>
                                                        )}
                                                        <div style={{ fontSize: '0.82rem' }}>
                                                            <span style={{ color: '#64748b', fontWeight: '600' }}>Booked: </span>
                                                            <span>{b.date}</span>
                                                        </div>
                                                    </div>
                                                    {b.message && (
                                                        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '10px', marginLeft: '54px', fontStyle: 'italic' }}>"{b.message}"</p>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
                                                    {b.status === 'pending' && (
                                                        <button onClick={() => updateDemoBookingStatus(b.id, 'confirmed')} style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(17,138,139,0.1)', color: '#118a8b', border: '1px solid rgba(17,138,139,0.2)', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <CheckCircle size={14} /> Confirm
                                                        </button>
                                                    )}
                                                    {b.status === 'confirmed' && (
                                                        <button onClick={() => updateDemoBookingStatus(b.id, 'completed')} style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <CheckCircle size={14} /> Mark Done
                                                        </button>
                                                    )}
                                                    <button onClick={async () => { if (window.confirm('Delete this booking?')) await deleteDemoBooking(b.id); }} style={{ padding: '8px', borderRadius: '10px', color: '#ef4444', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                )}

                {/* PROSPECT REGISTRY — Demo Class Bookings Ledger */}
                {!isLoading && activeTab === 'ProspectRegistry' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>

                        {/* Header bar */}
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="text"
                                    placeholder="Search prospect registry..."
                                    className="form-input"
                                    style={{ paddingLeft: '45px', marginBottom: 0 }}
                                    value={bookingSearch}
                                    onChange={(e) => setBookingSearch(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    const headers = ['Name', 'Email', 'Phone', 'Course', 'Preferred Date', 'Preferred Time', 'Status', 'Booked On', 'Notes'];
                                    const rows = demoBookings.map(b => [
                                        b.fullName, b.email, b.phone, b.course,
                                        b.preferredDate || '—', b.preferredTime || '—',
                                        b.status, b.date, b.message || ''
                                    ]);
                                    const csv = [headers, ...rows].map(r => r.map(v => `"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
                                    const blob = new Blob([csv], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url; a.download = `FTI_Prospects_${new Date().toLocaleDateString()}.csv`; a.click();
                                }}
                                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0 20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minHeight: '48px' }}
                            >
                                <Download size={18} /> Export CSV
                            </button>
                        </div>

                        {/* Summary chips */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Total', count: demoBookings.length, color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.18)' },
                                { label: 'Pending', count: demoBookings.filter(b => b.status === 'pending').length, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
                                { label: 'Confirmed', count: demoBookings.filter(b => b.status === 'confirmed').length, color: '#118a8b', bg: 'rgba(17,138,139,0.08)', border: 'rgba(17,138,139,0.2)' },
                                { label: 'Completed', count: demoBookings.filter(b => b.status === 'completed').length, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
                            ].map(chip => (
                                <span key={chip.label} style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', color: chip.color, background: chip.bg, border: `1px solid ${chip.border}` }}>
                                    {chip.label}: {chip.count}
                                </span>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="glass-panel" style={{ overflowX: 'auto' }}>
                            {demoBookings.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <ClipboardList size={48} color="#1e293b" style={{ margin: '0 auto 15px', display: 'block' }} />
                                    <p style={{ color: '#64748b' }}>
                                        No prospects yet.<br />
                                        Students who book a demo session will appear here automatically.
                                    </p>
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            {['Prospect', 'Contact', 'Area of Interest', 'Location', 'Pincode', 'Status', 'Booked On', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '18px 20px', color: '#64748b', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {demoBookings
                                            .filter(b =>
                                                (b.fullName || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
                                                (b.email || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
                                                (b.course || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
                                                (b.phone || '').includes(bookingSearch)
                                            )
                                            .map(b => {
                                                const sc = b.status === 'pending' ? '#f59e0b' : b.status === 'confirmed' ? '#118a8b' : '#22c55e';
                                                const sb = b.status === 'pending' ? 'rgba(245,158,11,0.1)' : b.status === 'confirmed' ? 'rgba(17,138,139,0.1)' : 'rgba(34,197,94,0.1)';
                                                return (
                                                    <tr key={b.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(17,138,139,0.03)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        {/* Prospect */}
                                                        <td style={{ padding: '18px 20px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(17,138,139,0.15), rgba(17,138,139,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '800', color: '#118a8b', fontSize: '0.9rem' }}>
                                                                    {(b.fullName || '?')[0].toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{b.fullName}</div>
                                                                    {b.message && <div style={{ fontSize: '0.72rem', color: '#94a3b8', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.message}>"{b.message}"</div>}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* Contact */}
                                                        <td style={{ padding: '18px 20px' }}>
                                                            <div style={{ fontSize: '0.88rem' }}>{b.phone}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.email}</div>
                                                        </td>
                                                        {/* Area of Interest */}
                                                        <td style={{ padding: '18px 20px' }}>
                                                            <span style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(17,138,139,0.08)', color: '#118a8b', fontSize: '0.78rem', fontWeight: '600', display: 'inline-block' }}>{b.course}</span>
                                                        </td>
                                                        {/* Location */}
                                                        <td style={{ padding: '18px 20px' }}>
                                                            <div style={{ fontSize: '0.88rem', fontWeight: '600' }}>{b.location || <span style={{ color: '#94a3b8' }}>—</span>}</div>
                                                        </td>
                                                        {/* Pincode */}
                                                        <td style={{ padding: '18px 20px' }}>
                                                            <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: '600', color: '#475569' }}>{b.pincode || '—'}</span>
                                                        </td>
                                                        {/* Status */}
                                                        <td style={{ padding: '18px 20px' }}>
                                                            <select
                                                                value={b.status}
                                                                onChange={async (e) => await updateDemoBookingStatus(b.id, e.target.value)}
                                                                style={{ padding: '5px 10px', borderRadius: '20px', background: sb, color: sc, border: `1px solid ${sc}40`, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', outline: 'none', appearance: 'none', paddingRight: '24px', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                                                            >
                                                                <option value="pending">PENDING</option>
                                                                <option value="confirmed">CONFIRMED</option>
                                                                <option value="completed">COMPLETED</option>
                                                            </select>
                                                        </td>
                                                        {/* Booked On */}
                                                        <td style={{ padding: '18px 20px', color: '#94a3b8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{b.date}</td>
                                                        {/* Actions */}
                                                        <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                                                            <button
                                                                onClick={async () => { if (window.confirm(`Remove ${b.fullName} from Prospect Registry?`)) await deleteDemoBooking(b.id); }}
                                                                style={{ padding: '9px', borderRadius: '10px', color: '#ef4444', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* POPUP MANAGER */}
                {!isLoading && activeTab === 'Popup' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>

                            {/* Editor Panel */}
                            <div className="glass-panel" style={{ padding: '35px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', flexWrap: 'wrap', gap: '12px' }}>
                                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                                        <Bell color="#118a8b" size={26} /> Popup Manager
                                    </h2>
                                    {/* Enable/Disable Toggle */}
                                    <button
                                        onClick={() => setPopupConfig(p => ({ ...p, enabled: !p.enabled }))}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '10px 20px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
                                            background: popupConfig.enabled ? 'rgba(17,138,139,0.12)' : 'rgba(100,116,139,0.1)',
                                            color: popupConfig.enabled ? '#118a8b' : '#64748b',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {popupConfig.enabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                        {popupConfig.enabled ? 'Popup LIVE' : 'Popup OFF'}
                                    </button>
                                </div>

                                <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    When <strong>Popup LIVE</strong> is active, a promotional popup will appear to all new visitors once per session.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', color: '#64748b', fontWeight: '600' }}>Popup Headline / Title</label>
                                        <input
                                            className="form-input"
                                            style={{ marginBottom: 0 }}
                                            placeholder="e.g. 🎉 Free Demo Sessions Now Open!"
                                            value={popupConfig.title}
                                            onChange={e => setPopupConfig(p => ({ ...p, title: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', color: '#64748b', fontWeight: '600' }}>Message Body</label>
                                        <textarea
                                            className="form-input"
                                            rows="4"
                                            style={{ resize: 'vertical', marginBottom: 0 }}
                                            placeholder="e.g. Meet our expert instructors in a personalized 1-on-1 demo session. Limited slots available this week!"
                                            value={popupConfig.message}
                                            onChange={e => setPopupConfig(p => ({ ...p, message: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', color: '#64748b', fontWeight: '600' }}>CTA Button Text</label>
                                        <input
                                            className="form-input"
                                            style={{ marginBottom: 0 }}
                                            placeholder="e.g. Book a Free Demo"
                                            value={popupConfig.buttonText}
                                            onChange={e => setPopupConfig(p => ({ ...p, buttonText: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', color: '#64748b', fontWeight: '600' }}>CTA Button Link <span style={{ fontWeight: '400', opacity: 0.7 }}>(leave blank to use the auto-generated booking form)</span></label>
                                        {/* Auto-generated link hint */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(17,138,139,0.06)', border: '1px solid rgba(17,138,139,0.15)' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>✨ Auto-generated:</span>
                                            <code style={{ fontSize: '0.8rem', color: '#118a8b', fontWeight: '700', flex: 1 }}>{window.location.origin}/book-demo</code>
                                            <button type="button" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/book-demo`); }} style={{ padding: '4px 10px', borderRadius: '6px', background: '#118a8b', color: 'white', border: 'none', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>Copy</button>
                                        </div>
                                        <input
                                            className="form-input"
                                            style={{ marginBottom: 0 }}
                                            placeholder={`${window.location.origin}/book-demo  or leave blank`}
                                            value={popupConfig.buttonLink}
                                            onChange={e => setPopupConfig(p => ({ ...p, buttonLink: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSavePopup}
                                    disabled={isSavingPopup}
                                    style={{
                                        marginTop: '25px', width: '100%', padding: '15px',
                                        background: popupSaved ? '#22c55e' : '#118a8b',
                                        color: 'white', border: 'none', borderRadius: '12px',
                                        fontWeight: '700', cursor: isSavingPopup ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        transition: 'background 0.3s ease', fontSize: '0.95rem'
                                    }}
                                >
                                    {isSavingPopup ? (
                                        <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Saving...</>
                                    ) : popupSaved ? (
                                        <><CheckCircle size={18} /> Changes Saved!</>
                                    ) : (
                                        <><Bell size={18} /> Save & Publish</>
                                    )}
                                </button>
                            </div>

                            {/* Live Preview Panel */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <Eye size={16} color="#64748b" />
                                    <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</span>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.55)', borderRadius: '20px', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")', borderRadius: '20px' }} />
                                    <div style={{ background: 'white', borderRadius: '24px', padding: '35px 32px 28px', maxWidth: '340px', width: '100%', boxShadow: '0 30px 80px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '130px', height: '130px', background: 'radial-gradient(circle, rgba(17,138,139,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(100,116,139,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginBottom: '16px' }}>
                                            <X size={14} color="#64748b" />
                                        </div>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(17,138,139,0.1)', border: '1px solid rgba(17,138,139,0.2)', borderRadius: '50px', padding: '4px 12px', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#118a8b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✨ Special Announcement</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px', lineHeight: '1.3', letterSpacing: '-0.02em' }}>
                                            {popupConfig.title || 'Your Popup Title Here'}
                                        </h3>
                                        <p style={{ color: '#475569', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '20px' }}>
                                            {popupConfig.message || 'Your message will appear here. Keep it concise and engaging!'}
                                        </p>
                                        <div style={{ background: 'linear-gradient(135deg, #118a8b, #0d9488)', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: '700', fontSize: '0.82rem', textAlign: 'center', boxShadow: '0 6px 18px rgba(17,138,139,0.3)' }}>
                                            📅 {popupConfig.buttonText || 'Book a Free Demo'}
                                        </div>
                                        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.72rem', marginTop: '10px' }}>No thanks, maybe later</p>
                                    </div>
                                </div>
                                <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '12px', background: popupConfig.enabled ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)', border: `1px solid ${popupConfig.enabled ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.15)'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: popupConfig.enabled ? '#22c55e' : '#ef4444', boxShadow: popupConfig.enabled ? '0 0 8px rgba(34,197,94,0.5)' : 'none' }} />
                                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: popupConfig.enabled ? '#22c55e' : '#ef4444' }}>
                                        {popupConfig.enabled ? 'Popup is LIVE — visitors will see this popup' : 'Popup is OFF — not visible to visitors'}
                                    </span>
                                </div>
                            </div>
                        </div>
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
                            }} style={{ marginBottom: '40px', padding: '25px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
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
                                        }} style={{ flex: 1, padding: '14px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 'bold', border: '1px solid var(--glass-border)', borderRadius: '12px', cursor: 'pointer' }}>
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div>
                                <h3 style={{ fontSize: '1rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Current Authorized Personnel</h3>
                                {admins.map(a => (
                                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px', marginBottom: '10px' }}>
                                        <div>
                                            <p style={{ fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {a.username}
                                                <span style={{ 
                                                    width: '8px', 
                                                    height: '8px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: a.isOnline ? '#22c55e' : '#64748b',
                                                    boxShadow: a.isOnline ? '0 0 8px rgba(34, 197, 94, 0.5)' : 'none'
                                                }} title={a.isOnline ? 'Online' : 'Offline'}></span>
                                            </p>
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
                                    <option>Data Science & AI</option>
                                    <option>Artificial Intelligence</option>
                                    <option>Cloud Computing through AWS</option>
                                    <option>Mobile App Dev</option>
                                    <option>Embedded Systems</option>
                                    <option>PLC Automation</option>
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
