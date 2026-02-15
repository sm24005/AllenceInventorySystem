import api from '../api/axiosInstance';

export const getReturns = () => api.get('/returns');
export const createReturn = (data) => api.post('/returns', data);