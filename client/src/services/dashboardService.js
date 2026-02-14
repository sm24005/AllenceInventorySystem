import api from '../api/axiosInstance';
export const getDashboardStats = () => api.get('/dashboard');