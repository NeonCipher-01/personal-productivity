import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await login(form);
            loginUser(data);
            navigate('/dashboard');
        } catch (err) {
            alert('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div className="bg-blob"></div>
            
            <div className="glass-panel animate-fade-in" style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoIcon}></div>
                    <h2 style={styles.title}>Welcome back to <span className="gradient-text">Flow</span></h2>
                    <p style={styles.subtitle}>Enter your details to continue</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input className="input-field" placeholder="you@example.com"
                            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input className="input-field" placeholder="••••••••" type="password"
                            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={styles.link}>
                    Don't have an account? <Link to="/register" style={{ color: '#a39cff', fontWeight: '500' }}>Create one</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: { 
        position: 'relative', display: 'flex', justifyContent: 'center', 
        alignItems: 'center', height: '100vh', overflow: 'hidden'
    },
    card: { 
        width: '100%', maxWidth: '420px', padding: '3rem 2.5rem', 
        display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 1 
    },
    header: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
    logoIcon: {
        width: '40px', height: '40px', borderRadius: '10px',
        background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
        boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
        marginBottom: '1rem'
    },
    title: { textAlign: 'center', fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.5px' },
    subtitle: { color: '#888', fontSize: '0.95rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.85rem', color: '#aaa', fontWeight: '500' },
    link: { textAlign: 'center', color: '#888', fontSize: '0.95rem', marginTop: '0.5rem' }
};