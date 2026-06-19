import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Calendar } from 'lucide-react';
import { subscribeToPopupConfig } from '../api/db';

const SitePopup = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const unsub = subscribeToPopupConfig((data) => {
            setConfig(data);
            // Show only once per session, only if enabled
            if (data?.enabled) {
                const dismissed = sessionStorage.getItem('fti_popup_dismissed');
                if (!dismissed) {
                    setTimeout(() => setVisible(true), 1500);
                }
            } else {
                setVisible(false);
            }
        });
        return () => unsub && unsub();
    }, []);

    const handleClose = () => {
        setVisible(false);
        sessionStorage.setItem('fti_popup_dismissed', '1');
    };

    const handleCTA = () => {
        handleClose();
        const link = config?.buttonLink || '/book-demo';
        // Internal link (starts with /) — use React Router
        if (link.startsWith('/') || link.startsWith(window.location.origin)) {
            const path = link.startsWith(window.location.origin)
                ? link.replace(window.location.origin, '')
                : link;
            navigate(path);
        } else {
            window.open(link, '_blank');
        }
    };

    if (!visible || !config?.enabled) return null;

    return (
        <>
            <style>{`
                @keyframes popupIn {
                    from { opacity: 0; transform: scale(0.85) translateY(20px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes overlayIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .popup-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,0.55);
                    backdrop-filter: blur(6px);
                    z-index: 9998;
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                    animation: overlayIn 0.3s ease;
                }
                .popup-card {
                    background: #ffffff;
                    border-radius: 28px;
                    max-width: 480px; width: 100%;
                    padding: 50px 45px 40px;
                    position: relative;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(17,138,139,0.15);
                    animation: popupIn 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    overflow: hidden;
                }
                .popup-glow {
                    position: absolute;
                    top: -60px; left: -60px;
                    width: 200px; height: 200px;
                    background: radial-gradient(circle, rgba(17,138,139,0.18) 0%, transparent 70%);
                    pointer-events: none;
                }
                .popup-glow-2 {
                    position: absolute;
                    bottom: -60px; right: -60px;
                    width: 200px; height: 200px;
                    background: radial-gradient(circle, rgba(17,138,139,0.1) 0%, transparent 70%);
                    pointer-events: none;
                }
                .popup-close-btn {
                    position: absolute; top: 18px; right: 18px;
                    background: rgba(100,116,139,0.1);
                    border: none; border-radius: 50%;
                    width: 36px; height: 36px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #64748b;
                    transition: all 0.2s ease;
                }
                .popup-close-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
                .popup-badge {
                    display: inline-flex; align-items: center; gap: 6px;
                    background: linear-gradient(135deg, rgba(17,138,139,0.12), rgba(17,138,139,0.06));
                    border: 1px solid rgba(17,138,139,0.25);
                    border-radius: 50px; padding: 6px 14px;
                    font-size: 0.75rem; font-weight: 700;
                    color: #118a8b; text-transform: uppercase; letter-spacing: 0.08em;
                    margin-bottom: 18px;
                }
                .popup-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 1.85rem; font-weight: 800;
                    color: #0f172a; line-height: 1.2;
                    margin-bottom: 14px; letter-spacing: -0.02em;
                }
                .popup-message {
                    color: #475569; line-height: 1.7;
                    font-size: 0.97rem; margin-bottom: 30px;
                }
                .popup-cta {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #118a8b, #0d9488);
                    color: white; font-weight: 700; font-size: 1rem;
                    border: none; border-radius: 14px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(17,138,139,0.35);
                    letter-spacing: 0.01em;
                }
                .popup-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(17,138,139,0.45); }
                .popup-dismiss {
                    width: 100%; margin-top: 12px;
                    background: none; border: none;
                    color: #94a3b8; font-size: 0.85rem;
                    cursor: pointer; padding: 8px;
                    transition: color 0.2s ease;
                }
                .popup-dismiss:hover { color: #475569; }
            `}</style>

            <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
                <div className="popup-card">
                    <div className="popup-glow" />
                    <div className="popup-glow-2" />

                    <button className="popup-close-btn" onClick={handleClose} aria-label="Close popup">
                        <X size={18} />
                    </button>

                    <div className="popup-badge">
                        <Sparkles size={13} /> Special Announcement
                    </div>

                    <h2 className="popup-title">{config.title || 'Welcome to FutureTech!'}</h2>
                    <p className="popup-message">{config.message}</p>

                    <button className="popup-cta" onClick={handleCTA}>
                        <Calendar size={20} />
                        {config.buttonText || 'Book a Free Demo'}
                    </button>
                    <button className="popup-dismiss" onClick={handleClose}>
                        No thanks, maybe later
                    </button>
                </div>
            </div>
        </>
    );
};

export default SitePopup;
