import { useState, useEffect } from 'react';
import { getHabits, createHabit, deleteHabit } from '../services/api';

export default function Habits() {
    const [habits, setHabits] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => { fetchHabits(); }, []);

    const fetchHabits = async () => {
        const { data } = await getHabits();
        setHabits(data);
    };

    const handleCreate = async () => {
        if (!title) return;
        await createHabit({ title, frequency: 'daily' });
        setTitle('');
        fetchHabits();
    };

    const handleDelete = async (id) => {
        await deleteHabit(id);
        fetchHabits();
    };

    // Helper to generate the dot grid based on streak length
    const renderDotGrid = (streak) => {
        const totalDots = 7; // show last 7 days visually
        const activeDots = Math.min(streak, totalDots);
        
        return (
            <div style={styles.dotGrid}>
                {[...Array(totalDots)].map((_, i) => {
                    const isActive = i < activeDots;
                    return (
                        <div key={i} style={{
                            ...styles.dot,
                            background: isActive ? '#48cfad' : 'rgba(255, 255, 255, 0.05)',
                            boxShadow: isActive ? '0 0 10px rgba(72, 207, 173, 0.4)' : 'none'
                        }} />
                    );
                })}
            </div>
        );
    };

    return (
        <div style={styles.container} className="animate-fade-in">
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Habits</h1>
                    <p style={styles.subtitle}>Build consistency, one day at a time</p>
                </div>
            </div>

            <div className="glass-panel" style={styles.inputArea}>
                <input className="input-field" style={{ flex: 1 }} placeholder="What habit do you want to start?" value={title}
                    onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
                <button className="btn-primary" onClick={handleCreate}>Build Habit</button>
            </div>

            <div style={styles.grid}>
                {habits.length === 0 ? (
                    <div style={styles.empty}>Start your first habit to see streaks here.</div>
                ) : (
                    habits.map((habit) => (
                        <div key={habit._id} className="glass-panel hover-glow" style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={styles.iconBox}>🔥</div>
                                <button style={styles.deleteBtn} onClick={() => handleDelete(habit._id)}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff4757'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                                    ✕
                                </button>
                            </div>
                            
                            <h3 style={styles.habitTitle}>{habit.title}</h3>
                            
                            <div style={styles.streakInfo}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                    <span style={styles.streakNumber}>{habit.streak}</span>
                                    <span style={{ color: '#888', fontSize: '0.85rem' }}>Day Streak</span>
                                </div>
                                <span style={styles.badge}>{habit.frequency}</span>
                            </div>

                            <div style={styles.trackerContainer}>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>Last 7 Days</p>
                                {renderDotGrid(habit.streak)}
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
    
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
    card: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
    
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    iconBox: { width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 165, 2, 0.1)', color: '#ffa502', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
    deleteBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.2rem', transition: 'color 0.2s', padding: '0.2rem' },
    
    habitTitle: { fontSize: '1.2rem', fontWeight: '600' },
    
    streakInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    streakNumber: { fontSize: '2rem', fontWeight: '700', color: '#fff', letterSpacing: '-1px' },
    badge: { background: 'rgba(108, 99, 255, 0.15)', color: '#a39cff', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize' },
    
    trackerContainer: { paddingTop: '0.5rem' },
    dotGrid: { display: 'flex', gap: '0.5rem' },
    dot: { width: '12px', height: '12px', borderRadius: '50%', transition: 'all 0.3s ease' },
    
    empty: { gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#666', fontStyle: 'italic' }
};