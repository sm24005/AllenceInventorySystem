import api from '../api/axiosInstance';

// --- AUTENTICACIÓN
export const loginUser = (credentials) => api.post('/users/login', credentials);

// --- GESTIÓN DE USUARIOS (CRUD) ---
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);