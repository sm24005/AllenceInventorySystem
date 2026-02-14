import api from '../api/axiosInstance';

// Obtener lista de productos (con filtros opcionales)
export const getProducts = (filters = {}) => {
    // Limpiamos filtros vacíos para no enviar ?name=&sku=
    const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    return api.get('/products', { params });
};

// Obtener un solo producto por ID
export const getProductById = (id) => api.get(`/products/${id}`);

// Crear producto
export const createProduct = (data) => api.post('/products', data);

// Actualizar producto
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

// Eliminar producto
export const deleteProduct = (id) => api.delete(`/products/${id}`);