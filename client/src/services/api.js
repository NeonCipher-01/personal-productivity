import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/' });

// Attach token to every request automatically
API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

// Auth
export const register = (data) => API.post('auth/register', data);
export const login = (data) => API.post('auth/login', data);

// Tasks
export const getTasks = () => API.get('tasks');
export const createTask = (data) => API.post('tasks', data);
export const updateTask = (id, data) => API.put(`tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`tasks/${id}`);

// Habits
export const getHabits = () => API.get('habits');
export const createHabit = (data) => API.post('habits', data);
export const updateHabit = (id, data) => API.put(`habits/${id}`, data);
export const deleteHabit = (id) => API.delete(`habits/${id}`);

// Goals
export const getGoals = () => API.get('goals');
export const createGoal = (data) => API.post('goals', data);
export const updateGoal = (id, data) => API.put(`goals/${id}`, data);
export const deleteGoal = (id) => API.delete(`goals/${id}`);