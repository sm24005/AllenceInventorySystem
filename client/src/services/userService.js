import api from '../api/axiosInstance';

export const loginUser = (userData) => api.post('/users/login', userData);
// ... aquí irán las demás funciones (getUsers, createUser, etc.) más adelante