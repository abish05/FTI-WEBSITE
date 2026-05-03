import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Users, MessageSquare, Settings, 
    LogOut, Search, Download, Trash2, Menu, X, 
    ShieldCheck, Zap, RefreshCw, Plus, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchDB, updateDB } from '../api/db';

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

    const user = JSON.parse(localStorage.getItem('fti_current_user'));

    useEffect(() => {
        if (!user) {
            navigate('/admin');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await fetchDB();
        setEnrollments(data.enrollments || []);
        setMessages(data.messages || []);
        setAdmins(data.admins || []);
        setSyncTime(new Date().toLocaleTimeString());
        setIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('fti_current_user');
        navigate('/admin');
    };

    const handleDeleteEnrollment = async (id) => {
        if (window.confirm('Delete this record permanently?')) {
            const updated = enrollments.filter(item => item.id !== id);
            const success = await updateDB({ enrollments: updated, messages, admins });
            if (success) setEnrollments(updated);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        const student = {
            ...newStudent,
            id: Date.now().toString(),
            date: new Date().toLocaleString()
        };
        const updated = [student, ...enrollments];
        const success = await updateDB({ enrollments: updated, messages, admins });
        if (success) {
            setEnrollments(updated);
            setShowAddModal(false);
            setNewStudent({ fullName: '', email: '', phone: '', course: 'Web Development', remarks: '' });
        }
    };

    const exportCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Course', 'Date', 'Remarks'];
        const rows = enrollments.map(e => [e.fullName, e.email, e.phone, e.course, e.date, e.remarks]);
        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
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
                background: active ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                color: active ? '#10b981' : '#94a3b8',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                border: active ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid transparent'
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
                .glass-panel { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(30, 41, 59, 1); border-radius: 24px; }
                .admin-sidebar { width: 280px; height: 100vh; position: fixed; left: 0; top: 0; background: #0b0f1a; border-right: 1px solid rgba(30, 41, 59, 1); padding: 35px 22px; display: flex; flex-direction: column; z-index: 1000; transition: transform 0.3s; }
                .admin-main { flex: 1; margin-left: 280px; padding: 50px 60px; min-width: 0; }
                .sidebar-item:hover { background: rgba(255,255,255,0.03); color: white; }
                @media (max-width: 1024px) {
                    .admin-sidebar { transform: translateX(-100%); }
                    .admin-sidebar.open { transform: translateX(0); }
                    .admin-main { margin-left: 0; padding: 20px; }
                }
                .form-input { width: 100%; background: rgba(2, 6, 23, 0.8); border: 1px solid rgba(30, 41, 59, 1); border-radius: 12px; padding: 12px 15px; color: white; margin-bottom: 15px; outline: none; transition: border 0.3s; }
                .form-input:focus { border-color: #10b981; }
            `}</style>

            {/* Sidebar */}
            <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Mainframe</p>
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
                    <SidebarItem icon={<Settings size={20} />} label="System Config" active={activeTab === 'Config'} onClick={() => { setActiveTab('Config'); setIsSidebarOpen(false); }} />
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
                        <button className="mobile-only" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#10b981' }}>
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{activeTab}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>SYSTEM_LIVE • Last Synced: {syncTime}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={loadData} style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }} title="Refresh Data">
                        <RefreshCw size={20} className={isLoading ? 'spin' : ''} />
                    </button>
                </header>

                {activeTab === 'Overview' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', marginBottom: '45px' }}>
                            <StatCard label="Total Students" value={enrollments.length} subtext="Active Enrollments" icon={<Users size={85} />} color="#10b981" />
                            <StatCard label="Enquiries" value={messages.length} subtext="Pending Messages" icon={<MessageSquare size={85} />} color="#3b82f6" />
                            <StatCard label="Sync Status" value="Healthy" subtext="All systems optimal" icon={<Zap size={85} />} color="#a855f7" />
                            <StatCard label="Access Level" value="Root" subtext={user?.role || 'Admin'} icon={<ShieldCheck size={85} />} color="#f59e0b" />
                        </div>

                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '700' }}>Recent Activity</h3>
                            {enrollments.slice(0, 5).map(e => (
                                <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(30, 41, 59, 0.5)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                            <UserPlus size={20} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '600' }}>{e.fullName} enrolled</p>
                                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{e.course} • {e.date}</p>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700' }}>NEW</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Participants' && (
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
                            <button onClick={() => setShowAddModal(true)} style={{ background: '#10b981', color: '#020617', border: 'none', borderRadius: '12px', padding: '0 20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <Plus size={20} /> Add Student
                            </button>
                            <button onClick={exportCSV} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0 20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <Download size={18} /> Export CSV
                            </button>
                        </div>

                        <div className="glass-panel" style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(30, 41, 59, 1)' }}>
                                        <th style={{ padding: '20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: '30%' }}>Student</th>
                                        <th style={{ padding: '20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: '25%' }}>Contact</th>
                                        <th style={{ padding: '20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: '20%' }}>Course</th>
                                        <th style={{ padding: '20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: '15%' }}>Remarks</th>
                                        <th style={{ padding: '20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: '10%', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrollments.filter(e => e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || e.course.toLowerCase().includes(searchTerm.toLowerCase())).map(e => (
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
                                                <span style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '0.8rem', fontWeight: '600' }}>{e.course}</span>
                                            </td>
                                            <td style={{ padding: '20px', color: '#94a3b8', fontSize: '0.9rem', maxWidth: '200px' }}>{e.remarks || '---'}</td>
                                            <td style={{ padding: '20px', textAlign: 'center' }}>
                                                <button onClick={() => handleDeleteEnrollment(e.id)} style={{ padding: '10px', borderRadius: '10px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* MODALS */}
                {showAddModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
                        <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '40px', animation: 'fadeIn 0.3s ease-out' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Add New Student</h2>
                                <button onClick={() => setShowAddModal(false)} style={{ color: '#94a3b8', background: 'none', border: 'none' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddStudent}>
                                <input placeholder="Full Name" className="form-input" required value={newStudent.fullName} onChange={e => setNewStudent({...newStudent, fullName: e.target.value})} />
                                <input placeholder="Email Address" type="email" className="form-input" required value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
                                <input placeholder="Phone Number" className="form-input" required value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                                <select className="form-input" value={newStudent.course} onChange={e => setNewStudent({...newStudent, course: e.target.value})}>
                                    <option>Web Development</option>
                                    <option>Cyber Security</option>
                                    <option>Python Data Science</option>
                                    <option>Artificial Intelligence</option>
                                    <option>Cloud Computing</option>
                                </select>
                                <textarea placeholder="Remarks (Optional)" className="form-input" rows="3" style={{ resize: 'none' }} value={newStudent.remarks} onChange={e => setNewStudent({...newStudent, remarks: e.target.value})}></textarea>
                                <button type="submit" style={{ width: '100%', padding: '15px', background: '#10b981', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: '800', marginTop: '10px', cursor: 'pointer' }}>Register Student</button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
