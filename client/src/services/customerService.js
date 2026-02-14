import api from '../api/axiosInstance';

// Obtener lista (con filtros opcionales)
export const getCustomers = (filters = {}) => {
    const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    return api.get('/customers', { params });
};

// Obtener uno por ID
export const getCustomerById = (id) => api.get(`/customers/${id}`);

// Crear
export const createCustomer = (data) => api.post('/customers', data);

// Editar
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);

// Eliminar
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);