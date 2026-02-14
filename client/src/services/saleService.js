import api from '../api/axiosInstance';

// Obtener historial de ventas
export const getSales = () => api.get('/sales');

// Registrar nueva venta
export const createSale = (saleData) => api.post('/sales', saleData);