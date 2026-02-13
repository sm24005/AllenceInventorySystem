import { jwtDecode } from "jwt-decode";

export const getAuthUser = () => {
    // 1. Intentamos leer el usuario completo guardado en el Login
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr); // ¡Aquí sí viene firstName y lastName!
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }
    }

    // 2. Si no hay usuario guardado, decodificamos el token (Respaldo)
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const decoded = jwtDecode(token);
        return decoded; 
    } catch (error) {
        return null;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};