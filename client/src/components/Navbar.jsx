import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '✦' },
        { path: '/tasks', label: 'Tasks', icon: '📝' },
        { path: '/habits', label: 'Habits', icon: '🔥' },
        { path: '/goals', label: 'Goals', icon: '🎯' },
    ];

    if (!user) return null;

    // Extract first letter of name for avatar
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <nav style={styles.nav}>
            <div style={styles.brand} onClick={() => navigate('/dashboard')}>
                <div style={styles.logoIcon}></div>
                <span className="gradient-text">Flow</span>
            </div>
            
            <div style={styles.links}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            style={{
                                ...styles.navBtn,
                                background: isActive ? 'rgba(108, 99, 255, 0.15)' : 'transparent',
                                color: isActive ? '#fff' : '#888',
                                border: isActive ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid transparent',
                            }}
                            onClick={() => navigate(item.path)}
                            onMouseEnter={(e) => !isActive && (e.currentTarget.style.color = '#fff')}
                            onMouseLeave={(e) => !isActive && (e.currentTarget.style.color = '#888')}
                        >
                            <span style={{ marginRight: '6px', opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <div style={styles.right}>
                <div style={styles.userMenu}>
                    <div style={styles.avatar}>{initial}</div>
                    <span style={styles.username}>{user?.name}</span>
                </div>
                <button style={styles.logoutBtn} onClick={handleLogout}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 71, 87, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 3rem', background: 'rgba(10, 10, 15, 0.6)', 
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'sticky', top: 0, zIndex: 100
    },
    brand: {
        display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer',
        letterSpacing: '-0.5px'
    },
    logoIcon: {
        width: '24px', height: '24px', borderRadius: '6px',
        background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
        boxShadow: '0 2px 10px rgba(108, 99, 255, 0.4)'
    },
    links: { display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.4rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' },
    navBtn: {
        padding: '0.5rem 1.2rem', borderRadius: '8px', cursor: 'pointer', 
        fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center'
    },
    right: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    userMenu: { display: 'flex', alignItems: 'center', gap: '10px' },
    avatar: {
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #2c2c35, #1a1a24)', border: '1px solid #333',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.9rem', fontWeight: 'bold', color: '#a39cff'
    },
    username: { color: '#e0e0e0', fontSize: '0.95rem', fontWeight: '500' },
    logoutBtn: {
        padding: '0.4rem 1rem', background: 'transparent', border: '1px solid rgba(255, 71, 87, 0.3)',
        borderRadius: '8px', color: '#ff4757', cursor: 'pointer', fontSize: '0.85rem',
        fontWeight: '500', transition: 'all 0.2s'
    }
};