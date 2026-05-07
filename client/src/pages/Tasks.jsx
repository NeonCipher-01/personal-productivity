import { useState, useEffect } from 'react';
import { getTasks, createTask, deleteTask, updateTask } from '../services/api';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        const { data } = await getTasks();
        setTasks(data);
    };

    const handleCreate = async () => {
        if (!title) return;
        await createTask({ title, priority });
        setTitle('');
        fetchTasks();
    };

    const handleDelete = async (id) => {
        await deleteTask(id);
        fetchTasks();
    };

    const handleToggle = async (task) => {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        await updateTask(task._id, { status: newStatus });
        fetchTasks();
    };

    const getPriorityColor = (p) => {
        if (p === 'high') return '#ff4757';
        if (p === 'medium') return '#ffa502';
        return '#48cfad';
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'todo') return t.status !== 'completed';
        if (filter === 'completed') return t.status === 'completed';
        if (filter === 'high') return t.priority === 'high';
        return true;
    });

    return (
        <div style={styles.container} className="animate-fade-in">
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Tasks</h1>
                    <p style={styles.subtitle}>Manage your workflow and priorities</p>
                </div>
            </div>

            <div className="glass-panel" style={styles.inputArea}>
                <input className="input-field" style={{ flex: 1 }} placeholder="What needs to be done?" value={title}
                    onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
                <select className="input-field" style={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>
                <button className="btn-primary" onClick={handleCreate}>Add Task</button>
            </div>

            <div style={styles.filterBar}>
                <div style={styles.filterTabs}>
                    {['all', 'todo', 'completed', 'high'].map(f => (
                        <button key={f} 
                            style={{...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {})}} 
                            onClick={() => setFilter(f)}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                <span style={styles.taskCount}>{filteredTasks.length} tasks</span>
            </div>

            <div style={styles.taskList}>
                {filteredTasks.length === 0 ? (
                    <div style={styles.empty}>No tasks found for this filter.</div>
                ) : (
                    filteredTasks.map((task) => (
                        <div key={task._id} className="glass-panel" style={{...styles.taskCard, borderLeftColor: getPriorityColor(task.priority)}}>
                            <div style={styles.taskInfo}>
                                <input type="checkbox" className="custom-checkbox" checked={task.status === 'completed'}
                                    onChange={() => handleToggle(task)} />
                                <span style={{ 
                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none', 
                                    color: task.status === 'completed' ? '#666' : '#fff',
                                    transition: 'all 0.3s',
                                    fontSize: '1.05rem',
                                    fontWeight: task.status === 'completed' ? '400' : '500'
                                }}>
                                    {task.title}
                                </span>
                            </div>
                            <div style={styles.taskActions}>
                                <span style={{ ...styles.badge, background: `${getPriorityColor(task.priority)}20`, color: getPriorityColor(task.priority) }}>
                                    {task.priority}
                                </span>
                                <button style={styles.deleteBtn} onClick={() => handleDelete(task._id)}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff4757'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2rem 3rem', maxWidth: '900px', margin: '0 auto' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2.2rem', fontWeight: '700', letterSpacing: '-0.5px' },
    subtitle: { color: '#888', fontSize: '1rem', marginTop: '0.2rem' },
    
    inputArea: { display: 'flex', gap: '1rem', padding: '1.5rem', marginBottom: '2rem' },
    select: { width: '150px', cursor: 'pointer' },
    
    filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    filterTabs: { display: 'flex', gap: '0.5rem' },
    filterBtn: { background: 'transparent', border: 'none', color: '#666', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' },
    filterBtnActive: { background: 'rgba(108, 99, 255, 0.15)', color: '#a39cff' },
    taskCount: { color: '#666', fontSize: '0.9rem', fontWeight: '500' },
    
    taskList: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
    taskCard: { 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '1.2rem 1.5rem', borderLeftWidth: '4px', borderLeftStyle: 'solid',
        background: 'rgba(20, 20, 25, 0.3)'
    },
    taskInfo: { display: 'flex', alignItems: 'center', gap: '1.2rem' },
    taskActions: { display: 'flex', alignItems: 'center', gap: '1rem' },
    badge: { padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize' },
    deleteBtn: { background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.2rem', transition: 'color 0.2s', padding: '0.2rem' },
    empty: { textAlign: 'center', padding: '3rem', color: '#666', fontStyle: 'italic' }
};