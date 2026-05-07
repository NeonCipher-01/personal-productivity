import { useState, useEffect } from 'react';
import { getGoals, createGoal, deleteGoal, updateGoal } from '../services/api';

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => { fetchGoals(); }, []);

    const fetchGoals = async () => {
        const { data } = await getGoals();
        setGoals(data);
    };

    const handleCreate = async () => {
        if (!title) return;
        await createGoal({ title });
        setTitle('');
        fetchGoals();
    };

    const handleDelete = async (id) => {
        await deleteGoal(id);
        fetchGoals();
    };

    const handleProgress = async (goal, value) => {
        await updateGoal(goal._id, { progress: Number(value) });
        fetchGoals();
    };

    return (
        <div style={styles.container} className="animate-fade-in">
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Goals</h1>
                    <p style={styles.subtitle}>Set targets and measure your success</p>
                </div>
            </div>

            <div className="glass-panel" style={styles.inputArea}>
                <input className="input-field" style={{ flex: 1 }} placeholder="What is your new goal?" value={title}
                    onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
                <button className="btn-primary" onClick={handleCreate}>Add Goal</button>
            </div>

            <div style={styles.grid}>
                {goals.length === 0 ? (
                    <div style={styles.empty}>Set your first goal to track progress here.</div>
                ) : (
                    goals.map((goal) => (
                        <div key={goal._id} className="glass-panel hover-glow" style={styles.card}>
                            <div style={styles.cardTop}>
                                <h3 style={styles.goalTitle}>{goal.title}</h3>
                                <button style={styles.deleteBtn} onClick={() => handleDelete(goal._id)}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff4757'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                                    ✕
                                </button>
                            </div>
                            
                            <div style={styles.progressSection}>
                                <div className="circular-progress" style={{ '--progress': `${goal.progress}%` }}>
                                    <span className="circular-progress-value">{goal.progress}%</span>
                                </div>
                                <div style={styles.sliderContainer}>
                                    <label style={styles.sliderLabel}>Update Progress</label>
                                    <input type="range" min="0" max="100" value={goal.progress}
                                        onChange={(e) => handleProgress(goal, e.target.value)}
                                        style={styles.slider} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2rem 3rem', maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2.2rem', fontWeight: '700', letterSpacing: '-0.5px' },
    subtitle: { color: '#888', fontSize: '1rem', marginTop: '0.2rem' },
    
    inputArea: { display: 'flex', gap: '1rem', padding: '1.5rem', marginBottom: '2.5rem' },
    
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
    card: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    goalTitle: { fontSize: '1.15rem', fontWeight: '600', lineHeight: '1.4', paddingRight: '1rem' },
    deleteBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.2rem', transition: 'color 0.2s', padding: '0' },
    
    progressSection: { display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '12px' },
    sliderContainer: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    sliderLabel: { fontSize: '0.75rem', color: '#888', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' },
    slider: { 
        width: '100%', cursor: 'pointer', accentColor: '#6c63ff', 
        height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', outline: 'none'
    },
    
    empty: { gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#666', fontStyle: 'italic' }
};