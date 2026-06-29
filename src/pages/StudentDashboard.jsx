import React, { useState, useEffect } from 'react';
import { 
    Search, Bell, ShoppingCart, User, ChevronDown, RefreshCw, 
    BookOpen, Trophy, Briefcase, Award, BarChart3, MessageSquare, 
    Grid, Building, LogOut, ArrowRight, BookMarked, LayoutDashboard
} from 'lucide-react';
import { fetchStudentDashboard, syncStudentData } from '../api/db';

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('skill'); // 'skill' (Dashboard), 'courses', 'drives', 'contest', 'company-tests', 'leaderboard', 'engagement', 'nerd'
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);

    // Load data from Firestore (or fallback to screenshot defaults)
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await fetchStudentDashboard('default_student');
            setDashboardData(data);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        const result = await syncStudentData('default_student');
        if (result.success) {
            setDashboardData(result.data);
        } else {
            // Offline fallback simulation
            const data = await fetchStudentDashboard('default_student');
            const newSolved = data.leetcode.totalSolved + Math.floor(Math.random() * 3) + 1;
            const newCommits = data.github.totalCommits + Math.floor(Math.random() * 5) + 1;
            setDashboardData({
                ...data,
                leetcode: {
                    ...data.leetcode,
                    totalSolved: newSolved,
                    easy: data.leetcode.easy + 1,
                    medium: data.leetcode.medium + 1
                },
                github: {
                    ...data.github,
                    totalCommits: newCommits
                },
                profile: {
                    ...data.profile,
                    lastSynced: new Date().toLocaleString('en-IN')
                }
            });
        }
        setIsSyncing(false);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#090e1a', color: '#e2e8f0' }}>
                <RefreshCw className="animate-spin text-blue-500" size={32} style={{ animation: 'spin 1.5s linear infinite', marginBottom: '15px' }} />
                <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Loading VSB Dashboard...</p>
            </div>
        );
    }

    const { profile, leetcode, github, performance } = dashboardData;

    const solvedCount = leetcode?.totalSolved || 0;
    const totalTarget = 500;
    const percentage = Math.min((solvedCount / totalTarget) * 100, 100);

    // Mock Heatmap Grid data (53 weeks x 7 days)
    const generateHeatmapGrid = (levelsCount) => {
        const grid = [];
        for (let i = 0; i < 371; i++) {
            // Random density level: 0 (empty), 1-4 (shades of color)
            const level = Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0;
            grid.push(level);
        }
        return grid;
    };

    const leetcodeGrid = generateHeatmapGrid(5);
    const githubGrid = generateHeatmapGrid(5);

    const sidebarItems = [
        { id: 'skill', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'contest', label: 'Contest', icon: Trophy },
        { id: 'drives', label: 'Drives', icon: Briefcase },
        { id: 'company-tests', label: 'Company Specific Test', icon: Award },
        { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
        { id: 'engagement', label: 'Engagement', icon: MessageSquare },
        { id: 'nerd', label: 'Go to NERD', icon: Grid }
    ];

    const subTabs = [
        { id: 'skill', label: 'Skill' },
        { id: 'courses', label: 'Course' },
        { id: 'drives', label: 'Drives' }
    ];

    return (
        <div className="student-dashboard-body" style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .student-dashboard-body a { color: inherit; text-decoration: none; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .activity-cell { width: 10px; height: 10px; border-radius: 2px; }
                .level-0 { background: #1e293b; }
                .lc-level-1 { background: rgba(37, 99, 235, 0.25); }
                .lc-level-2 { background: rgba(37, 99, 235, 0.45); }
                .lc-level-3 { background: rgba(37, 99, 235, 0.7); }
                .lc-level-4 { background: rgba(37, 99, 235, 1); }
                .gh-level-1 { background: rgba(34, 197, 94, 0.25); }
                .gh-level-2 { background: rgba(34, 197, 94, 0.45); }
                .gh-level-3 { background: rgba(34, 197, 94, 0.7); }
                .gh-level-4 { background: rgba(34, 197, 94, 1); }
            `}</style>

            {/* ── Left Sidebar (Narrow layout) ── */}
            <aside style={{ width: '90px', background: '#0a1128', borderRight: '1px solid #1e2942', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0, selectNone: 'true' }}>
                {/* Logo top */}
                <div style={{ padding: '16px', borderBottom: '1px solid #1e2942', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                        <img src="/vsb-logo.png" alt="VSB Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    </div>
                </div>

                {/* Sidebar links navigation */}
                <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }} className="no-scrollbar">
                    {sidebarItems.map((item) => {
                        const isTabActive = activeTab === item.id || (item.id === 'skill' && !['courses', 'drives', 'contest', 'company-tests', 'leaderboard', 'engagement', 'nerd'].includes(activeTab));
                        return (
                          <div 
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`student-sidebar-item ${isTabActive ? 'active' : ''}`}
                            style={{ margin: '0 8px' }}
                          >
                            <item.icon size={20} style={{ marginBottom: '4px' }} />
                            <span style={{ fontSize: '9px', fontWeight: '500', width: '100%', lineHeight: '1.2' }}>{item.label}</span>
                          </div>
                        );
                    })}
                </nav>

                {/* Profile bubble and Signout footer */}
                <div style={{ padding: '16px 0', borderTop: '1px solid #1e2942', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: '700', fontSize: '0.85rem' }}>
                        {profile?.fullName?.[0] || 'A'}
                    </div>
                    <div style={{ cursor: 'pointer', color: '#f87171', padding: '6px' }} title="Sign Out" onClick={() => window.location.href = '/'}>
                        <LogOut size={20} />
                    </div>
                </div>
            </aside>

            {/* ── Main View Container ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* Header Top Bar */}
                <header style={{ height: '70px', borderBottom: '1px solid #1e2942', background: 'rgba(30,41,59,0.3)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px', zIndex: 10 }}>
                    {/* Search */}
                    <div style={{ position: 'relative', width: '280px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="student-input"
                            style={{ width: '100%', paddingLeft: '38px', height: '36px' }}
                        />
                    </div>

                    {/* Icons & profile */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', position: 'relative', display: 'flex', padding: '6px' }}>
                            <Bell size={18} />
                            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                        </button>

                        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: '6px' }}>
                            <ShoppingCart size={18} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '15px', borderLeft: '1px solid #1e2942' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                {profile?.fullName?.[0] || 'A'}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'white', letterSpacing: '0.5px' }}>{profile?.fullName || 'ABISH A'}</span>
                                <span style={{ fontSize: '9px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Student</span>
                            </div>
                            <ChevronDown size={14} color="#64748b" />
                        </div>
                    </div>
                </header>

                {/* Sub Navigation Row */}
                <div style={{ borderBottom: '1px solid #1e2942', padding: '12px 25px', display: 'flex', gap: '10px', background: '#090e1a' }}>
                    {subTabs.map((tab) => {
                        const isSubActive = activeTab === tab.id || (tab.id === 'skill' && !['courses', 'drives'].includes(activeTab));
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`student-tab-btn ${isSubActive ? 'active' : ''}`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main View Area */}
                <main style={{ flex: 1, padding: '25px', overflowY: 'auto' }} className="no-scrollbar">
                    
                    {/* ──── Skill View (Dashboard Default) ──── */}
                    {!['courses', 'drives', 'contest', 'company-tests', 'leaderboard', 'engagement', 'nerd'].includes(activeTab) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            
                            {/* Dashboard H1 and Sync Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', fontFamily: "'Outfit', sans-serif" }}>Dashboard</h1>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="student-glass-card" style={{ padding: '8px 16px', fontSize: '11px', color: '#94a3b8', fontWeight: '500', display: 'flex', gap: '5px' }}>
                                        <span>Last Updated on</span>
                                        <span style={{ color: 'white', fontWeight: '700' }}>{profile?.lastSynced || '29 Jun 2026, 04:45 PM'}</span>
                                    </div>
                                    <button 
                                        onClick={handleSync}
                                        disabled={isSyncing}
                                        style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', height: '36px', padding: '0 15px', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                    >
                                        <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                                        Sync
                                    </button>
                                </div>
                            </div>

                            {/* Sunset profile card */}
                            <div className="student-glass-card" style={{ overflow: 'hidden', position: 'relative' }}>
                                <div style={{ height: '180px', background: 'linear-gradient(105deg, #3B0066 0%, #8E2DE2 30%, #F000FF 70%, #ff7675 100%)', position: 'relative' }}>
                                    {/* Glowing Sun */}
                                    <div style={{ position: 'absolute', right: '20%', bottom: '-20px', width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(to top, #fde047, #f59e0b)', opacity: 0.6, filter: 'blur(4px)' }} />
                                    {/* Waves grid */}
                                    <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
                                </div>

                                <div style={{ padding: '25px', paddingTop: '65px', position: 'relative' }}>
                                    {/* Overlapping profile avatar */}
                                    <div style={{ position: 'absolute', left: '25px', top: '-48px', width: '96px', height: '96px', borderRadius: '50%', border: '4px solid #1e293b', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', shadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                        <User size={48} color="#94a3b8" />
                                    </div>

                                    {/* Details */}
                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', margin: 0 }}>{profile?.fullName || 'ABISH A'}</h2>
                                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', marginTop: '2px' }}>{profile?.email || 'abishstk@gmail.com'}</p>
                                        
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '16px', fontSize: '11px', fontWeight: '700', color: '#cbd5e1' }}>
                                            <div>
                                                <span style={{ color: '#64748b' }}>Register Number : </span>
                                                <span>{profile?.regNo || '723723104008'}</span>
                                            </div>
                                            <span style={{ color: '#334155' }}>|</span>
                                            <div>
                                                <span style={{ color: '#64748b' }}>Degree : </span>
                                                <span>{profile?.degree || 'BE - CSE'}</span>
                                            </div>
                                            <span style={{ color: '#334155' }}>|</span>
                                            <div>
                                                <span style={{ color: '#64748b' }}>Batch : </span>
                                                <span>{profile?.batch || '2027'}</span>
                                            </div>
                                            <span style={{ color: '#334155' }}>|</span>
                                            <div>
                                                <span style={{ color: '#64748b' }}>College : </span>
                                                <span>{profile?.college || 'VSB College of Engineering & Technical Campus'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Cards Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                                {/* Neo-PAT */}
                                <div className="student-glass-card" style={{ padding: '20px', height: '170px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Neo-PAT</div>
                                    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Score</span>
                                        <span style={{ fontSize: '2.2rem', fontWeight: '900', color: '#2563eb', marginTop: '2px', lineHeight: 1 }}>
                                            {performance?.placementScore ? Math.round(performance.placementScore * 4.5) : 371}
                                        </span>
                                    </div>
                                </div>

                                {/* Neo-Colab */}
                                <div className="student-glass-card" style={{ padding: '20px', height: '170px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Neo-Colab</div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.3)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px', marginTop: '10px' }}>
                                        <BookMarked size={22} color="#475569" style={{ marginBottom: '4px' }} />
                                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>No Colab Courses Taken</span>
                                    </div>
                                </div>

                                {/* Solved Questions */}
                                <div className="student-glass-card" style={{ padding: '20px', height: '170px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Solved Questions</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                                        <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                                <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="transparent" />
                                                <circle cx="40" cy="40" r="34" stroke="#2563eb" strokeWidth="6" fill="transparent" strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * (1 - percentage / 100)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                                            </svg>
                                            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white' }}>{solvedCount}</span>
                                                <span style={{ fontSize: '8px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Solved</span>
                                            </div>
                                        </div>

                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', justifyBetween: 'true', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700' }}>
                                                <span style={{ color: '#94a3b8' }}>Easy</span>
                                                <span style={{ color: '#4ade80' }}>{leetcode?.easy || 0}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyBetween: 'true', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700' }}>
                                                <span style={{ color: '#94a3b8' }}>Medium</span>
                                                <span style={{ color: '#fbbf24' }}>{leetcode?.medium || 0}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyBetween: 'true', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700' }}>
                                                <span style={{ color: '#94a3b8' }}>Hard</span>
                                                <span style={{ color: '#f87171' }}>{leetcode?.hard || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LeetCode Heatmap */}
                            <div className="student-glass-card" style={{ padding: '24px', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                                        <Code2 size={20} color="#2563eb" /> LeetCode Activity
                                    </h3>
                                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Last 365 days</span>
                                </div>
                                
                                {/* Grid container */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(53, 1fr)', gap: '3px', overflowX: 'auto', paddingBottom: '10px' }} className="no-scrollbar">
                                    {leetcodeGrid.map((level, idx) => (
                                        <div key={idx} className={`activity-cell level-${level} lc-level-${level}`} title={`Activity index ${idx}: level ${level}`} />
                                    ))}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '16px', textAlign: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>{leetcode?.easy || 0}</p>
                                        <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>Easy Solved</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>{leetcode?.medium || 0}</p>
                                        <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>Medium Solved</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>{leetcode?.hard || 0}</p>
                                        <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>Hard Solved</p>
                                    </div>
                                </div>
                            </div>

                            {/* GitHub Contributions */}
                            <div className="student-glass-card" style={{ padding: '24px', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                                        <GitBranch size={20} color="#22c55e" /> GitHub Contributions
                                    </h3>
                                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{github?.totalCommits || 0} contributions</span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(53, 1fr)', gap: '3px', overflowX: 'auto', paddingBottom: '10px' }} className="no-scrollbar">
                                    {githubGrid.map((level, idx) => (
                                        <div key={idx} className={`activity-cell level-${level} gh-level-${level}`} title={`Activity index ${idx}: level ${level}`} />
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '16px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', alignSelf: 'center', marginRight: '8px' }}>Top Languages:</span>
                                    {['JavaScript', 'HTML', 'CSS', 'Python', 'C++'].map(lang => (
                                        <span key={lang} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* AI analysis + Achievements */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                                {/* AI Recommendations */}
                                <div className="student-glass-card" style={{ padding: '24px', textAlign: 'left' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '16px' }}>
                                        <Zap size={18} color="#eab308" /> AI Analysis
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ background: 'rgba(234, 179, 8, 0.05)', borderLeft: '3px solid #eab308', padding: '12px', borderRadius: '0 8px 8px 0' }}>
                                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#fef08a' }}>Placement Readiness</p>
                                            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', lineHeight: '1.5' }}>Your LeetCode contest rating is highly competitive. Focus on building more complex projects on GitHub to boost your developer profile.</p>
                                        </div>
                                        <div style={{ background: 'rgba(37, 99, 235, 0.05)', borderLeft: '3px solid #2563eb', padding: '12px', borderRadius: '0 8px 8px 0' }}>
                                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#93c5fd' }}>LeetCode Recommendation</p>
                                            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', lineHeight: '1.5' }}>Solve 5 more medium-difficulty problems in Dynamic Programming to prepare for Zoho mock test series.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div className="student-glass-card" style={{ padding: '24px', textAlign: 'left' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '16px' }}>
                                        <Trophy size={18} color="#fbbf24" /> Achievements
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                        {[
                                            { title: 'Consistency King', desc: '5d LeetCode Streak', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                                            { title: 'PR Champion', desc: '14 Pull Requests merged', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
                                            { title: 'Contest Rider', desc: 'Contest Rating 1500+', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
                                            { title: 'Early Bird', desc: 'First Sync completed', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' }
                                        ].map((badge, idx) => (
                                            <div key={idx} style={{ background: badge.bg, border: `1px solid ${badge.color}30`, borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                                                <Trophy size={18} color={badge.color} style={{ margin: '0 auto 6px' }} />
                                                <p style={{ fontSize: '11px', fontWeight: '700', color: 'white' }}>{badge.title}</p>
                                                <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>{badge.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ──── Courses View ──── */}
                    {activeTab === 'courses' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                            <div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', fontFamily: "'Outfit', sans-serif" }}>My Courses</h1>
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>Active technical training courses at VSB Campus</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                                {[
                                    { title: "Data Structures & Algorithms", code: "CS301", progress: 85, status: "Active", instructor: "Dr. K. Srinivasan", sessions: "24/28" },
                                    { title: "Java Programming Essentials", code: "CS302", progress: 100, status: "Completed", instructor: "Mrs. M. Priya", sessions: "20/20" },
                                    { title: "Python for AI & Data Science", code: "CS305", progress: 42, status: "Active", instructor: "Dr. A. Rajesh", sessions: "10/24" },
                                    { title: "Advanced DBMS & SQL", code: "CS308", progress: 15, status: "Active", instructor: "Mrs. S. Latha", sessions: "3/20" }
                                ].map((course) => (
                                    <div key={course.code} className="student-glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '9px', fontWeight: '800', background: 'rgba(37,99,235,0.1)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.2)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                    {course.code}
                                                </span>
                                                <span className={`student-badge ${course.status === 'Completed' ? 'student-badge-success' : 'student-badge-warning'}`}>
                                                    {course.status}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', marginTop: '12px' }}>{course.title}</h3>
                                            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Instructor: {course.instructor}</p>
                                        </div>

                                        <div style={{ marginTop: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                                                <span>Progress</span>
                                                <span>{course.progress}% ({course.sessions} sessions)</span>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{ width: `${course.progress}%`, height: '100%', background: '#2563eb', borderRadius: '10px' }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ──── Placement Drives View ──── */}
                    {activeTab === 'drives' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                            <div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', fontFamily: "'Outfit', sans-serif" }}>Placement Drives</h1>
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>Active and upcoming campus placement drives</p>
                            </div>

                            <div className="student-glass-card" style={{ overflowHidden: 'true', overflow: 'hidden' }}>
                                <div style={{ padding: '16px 20px', background: 'rgba(30,41,59,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>VSB Placement Cell Ledger</span>
                                    <span style={{ fontSize: '10px', fontWeight: '700', background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', padding: '4px 10px', borderRadius: '20px' }}>
                                        Eligible for 4 drives
                                    </span>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(15,23,42,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#64748b' }}>
                                                <th style={{ padding: '14px 20px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>Company</th>
                                                <th style={{ padding: '14px 20px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>Role</th>
                                                <th style={{ padding: '14px 20px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>Drive Date</th>
                                                <th style={{ padding: '14px 20px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>Criteria</th>
                                                <th style={{ padding: '14px 20px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { company: "Zoho Corporation", role: "Software Developer", date: "15 Jul 2026", criteria: "CGPA >= 7.5", status: "Applied" },
                                                { company: "TCS Digital", role: "System Engineer", date: "22 Jul 2026", criteria: "CGPA >= 6.5", status: "Eligible" },
                                                { company: "Wipro Turbo", role: "Project Engineer", date: "05 Aug 2026", criteria: "CS/IT only", status: "Closed" },
                                                { company: "Cognizant GenC", role: "Programmer Analyst", date: "12 Aug 2026", criteria: "CGPA >= 6.0", status: "Upcoming" }
                                            ].map((drive, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#cbd5e1' }}>
                                                    <td style={{ padding: '16px 20px', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Building size={16} color="#94a3b8" />
                                                        {drive.company}
                                                    </td>
                                                    <td style={{ padding: '16px 20px' }}>{drive.role}</td>
                                                    <td style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: '500' }}>{drive.date}</td>
                                                    <td style={{ padding: '16px 20px', fontSize: '11px', color: '#64748b' }}>{drive.criteria}</td>
                                                    <td style={{ padding: '16px 20px' }}>
                                                        <span className={`student-badge ${
                                                            drive.status === 'Applied' ? 'student-badge-success' :
                                                            drive.status === 'Eligible' ? 'student-badge-primary' :
                                                            drive.status === 'Closed' ? 'student-badge-danger' :
                                                            'student-badge-warning'
                                                        }`}>
                                                            {drive.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder Views for other sidebar tabs */}
                    {['contest', 'company-tests', 'leaderboard', 'engagement', 'nerd'].includes(activeTab) && (
                        <div className="student-glass-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '40px auto' }}>
                            <Trophy size={48} color="#3b82f6" style={{ margin: '0 auto 15px' }} />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
                                {activeTab === 'contest' && 'Upcoming Coding Contests'}
                                {activeTab === 'company-tests' && 'Company Specific Prep Tests'}
                                {activeTab === 'leaderboard' && 'Department Leaderboard'}
                                {activeTab === 'engagement' && 'Mentor Meeting Schedule'}
                                {activeTab === 'nerd' && 'VSB NERD Portal Redirect'}
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '10px', lineHeight: '1.6' }}>
                                {activeTab === 'contest' && 'LeetCode Weekly Contest 410 is active on Sunday. Get ready to compete!'}
                                {activeTab === 'company-tests' && 'Zoho and Accenture mock interview preparations are active for 3rd year CSE.'}
                                {activeTab === 'leaderboard' && 'Abish A ranks #1 in CSE Department with 142 solved problems and 284 commits.'}
                                {activeTab === 'engagement' && 'HOD Saravanan has scheduled your review. Synced stats are required.'}
                                {activeTab === 'nerd' && 'Redirecting to National Education & Research Database. Login with VSB email.'}
                            </p>
                            <button 
                                onClick={() => {
                                    if (activeTab === 'nerd') window.open('https://nerd.vsb.edu.in', '_blank');
                                    else setActiveTab('skill');
                                }}
                                style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: '700', fontSize: '0.85rem', marginTop: '20px', cursor: 'pointer' }}
                            >
                                {activeTab === 'nerd' ? 'Open NERD Portal' : 'Return to Dashboard'}
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// Helper components inside the file for rendering LeetCode & GitHub icons without importing SVG files
const Code2 = ({ size, color, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
    </svg>
);

const GitBranch = ({ size, color, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <line x1="6" x2="6" y1="3" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
);

export default StudentDashboard;
