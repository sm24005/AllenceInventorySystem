import api from '../api/axiosInstance';

export const getPurchases = () => api.get('/purchases');
export const createPurchase = (data) => api.post('/purchases', data);