import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getTasks, getHabits, getGoals } from '../services/api';
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, ArcElement, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const fetchAll = async () => {
            const [t, h, g] = await Promise.all([getTasks(), getHabits(), getGoals()]);
            setTasks(t.data);
            setHabits(h.data);
            setGoals(g.data);
        };
        fetchAll();
        
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;

    const avgProgress = goals.length ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0;

    const taskChartData = {
        labels: ['Todo', 'In Progress', 'Completed'],
        datasets: [{
            data: [todoCount, inProgressCount, completedCount],
            backgroundColor: ['#ff4757', '#ffa502', '#48cfad'],
            borderColor: 'transparent',
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    const goalChartData = {
        labels: goals.map(g => g.title.slice(0, 10) + '...'),
        datasets: [{
            label: 'Progress %',
            data: goals.map(g => g.progress),
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, '#6c63ff');
                gradient.addColorStop(1, '#48cfad');
                return gradient;
            },
            borderRadius: 6,
            barThickness: 24
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { labels: { color: '#e0e0e0', font: { family: 'Inter', size: 13 } } },
            tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 12, borderRadius: 8 }
        },
        scales: { 
            x: { grid: { display: false }, ticks: { color: '#888', font: { family: 'Inter' } } }, 
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false }, ticks: { color: '#888', max: 100 } } 
        }
    };

    const doughnutOptions = {
        plugins: { 
            legend: { position: 'right', labels: { color: '#e0e0e0', font: { family: 'Inter', size: 13 }, padding: 20 } },
            tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 12, borderRadius: 8 }
        },
        cutout: '70%'
    };

    const formattedDate = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div style={styles.container} className="animate-fade-in">
            <div style={styles.header}>
                <div>
                    <h1 style={styles.greeting}>Good {time.getHours() < 12 ? 'morning' : time.getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name}</h1>
                    <p style={styles.date}>{formattedDate} • <span style={{color: '#a39cff'}}>{formattedTime}</span></p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/tasks')}>+ New Task</button>
            </div>

            <div style={styles.statsGrid}>
                <div className="glass-panel hover-glow" style={styles.statCard} onClick={() => navigate('/tasks')}>
                    <div style={styles.statIconWrapper}><span style={styles.statIcon}>📝</span></div>
                    <p style={styles.statLabel}>Total Tasks</p>
                    <h2 style={styles.statNumber}>{tasks.length}</h2>
                    <p style={styles.statSub}>{completedCount} completed</p>
                </div>
                <div className="glass-panel hover-glow" style={styles.statCard} onClick={() => navigate('/habits')}>
                    <div style={{...styles.statIconWrapper, background: 'rgba(255, 165, 2, 0.1)'}}><span style={styles.statIcon}>🔥</span></div>
                    <p style={styles.statLabel}>Active Habits</p>
                    <h2 style={styles.statNumber}>{habits.length}</h2>
                    <p style={styles.statSub}>Keep the streak going!</p>
                </div>
                <div className="glass-panel hover-glow" style={styles.statCard} onClick={() => navigate('/goals')}>
                    <div style={{...styles.statIconWrapper, background: 'rgba(108, 99, 255, 0.1)'}}><span style={styles.statIcon}>🎯</span></div>
                    <p style={styles.statLabel}>Goal Progress</p>
                    <h2 style={styles.statNumber}>{avgProgress}%</h2>
                    <p style={styles.statSub}>Average completion</p>
                </div>
                <div className="glass-panel hover-glow" style={styles.statCard}>
                    <div style={{...styles.statIconWrapper, background: 'rgba(72, 207, 173, 0.1)'}}><span style={styles.statIcon}>✅</span></div>
                    <p style={styles.statLabel}>Tasks Done</p>
                    <h2 style={{ ...styles.statNumber, color: '#48cfad' }}>{completedCount}</h2>
                    <p style={styles.statSub}>Out of {tasks.length}</p>
                </div>
            </div>

            <div style={styles.chartsGrid}>
                <div className="glass-panel" style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Task Distribution</h3>
                    </div>
                    {tasks.length > 0 ? (
                        <div style={{ height: '240px', display: 'flex', justifyContent: 'center' }}>
                            <Doughnut data={taskChartData} options={doughnutOptions} />
                        </div>
                    ) : (
                        <p style={styles.empty}>Create tasks to see metrics</p>
                    )}
                </div>

                <div className="glass-panel" style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Goals Tracking</h3>
                    </div>
                    {goals.length > 0 ? (
                        <div style={{ height: '240px' }}>
                            <Bar data={goalChartData} options={chartOptions} />
                        </div>
                    ) : (
                        <p style={styles.empty}>Add goals to visualize progress</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' },
    greeting: { fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '0.4rem' },
    date: { color: '#888', fontSize: '1rem', fontWeight: '500' },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' },
    statCard: { padding: '1.5rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
    statIconWrapper: { 
        width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
    },
    statIcon: { fontSize: '1.2rem' },
    statLabel: { color: '#aaa', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.25rem' },
    statNumber: { fontSize: '2.2rem', fontWeight: '700', color: '#fff' },
    statSub: { color: '#6c63ff', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' },

    chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' },
    chartCard: { padding: '1.5rem' },
    chartHeader: { borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.5rem' },
    chartTitle: { fontSize: '1.1rem', fontWeight: '600' },
    empty: { color: '#555', textAlign: 'center', padding: '3rem 0', fontStyle: 'italic' }
};