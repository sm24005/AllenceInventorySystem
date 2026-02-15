import axios from 'axios';
import { getToken } from '../utils/auth';

// Usar variable de entorno VITE_API_URL, si no existe, usar localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 1. Definimos la variable como "api"
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

// 2. Usamos "api"
api.interceptors.request.use((config) => {
    // Usamos la función getToken
    const token = getToken(); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 3. Exportamos "api"
export default api;