// client/src/utils/auth.js

// Guardar el token al iniciar sesión
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Obtener el token para las peticiones
export const getToken = () => {
    return localStorage.getItem('token');
};

// Borrar el token (para logout interno)
export const removeToken = () => {
    localStorage.removeItem('token');
};

export const logout = () => {
    removeToken();
    // Opcional: Redirigir o limpiar otros datos si fuera necesario
    window.location.href = '/users/login';
};

// Verificar si está logueado
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

// Decodificar el usuario desde el token (sin librerías externas)
export const getAuthUser = () => {
    const token = getToken();
    if (!token) return null;

    try {
        // Decodificación manual del JWT (Payload está en la parte 2)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};