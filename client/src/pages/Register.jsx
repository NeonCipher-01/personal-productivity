import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await register(form);
            loginUser(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div className="bg-blob" style={{ animationDelay: '-5s' }}></div>

            <div className="glass-panel animate-fade-in" style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Join <span className="gradient-text">Flow</span></h2>
                    <p style={styles.subtitle}>Supercharge your productivity today</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>

                    {error && (
                        <div style={styles.errorBox}>
                            {error}
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            className="input-field"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            className="input-field"
                            placeholder="you@example.com"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            className="input-field"
                            placeholder="Create a secure password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={styles.link}>
                    Already have an account? <Link to="/login" style={{ color: '#a39cff', fontWeight: '500' }}>Sign in</Link>
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
    title: { textAlign: 'center', fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.5px' },
    subtitle: { color: '#888', fontSize: '0.95rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.85rem', color: '#aaa', fontWeight: '500' },
    link: { textAlign: 'center', color: '#888', fontSize: '0.95rem', marginTop: '0.5rem' },
    errorBox: {
        backgroundColor: 'rgba(255, 80, 80, 0.1)',
        border: '1px solid rgba(255, 80, 80, 0.3)',
        color: '#ff6b6b',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        textAlign: 'center'
    }
};