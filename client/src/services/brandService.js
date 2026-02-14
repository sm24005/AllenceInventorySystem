import api from '../api/axiosInstance';

export const getBrands = () => api.get('/brands');
export const createBrand = (data) => api.post('/brands', data);
export const deleteBrand = (id) => api.delete(`/brands/${id}`);