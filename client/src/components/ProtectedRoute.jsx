import { Navigate, Outlet } from 'react-router-dom';
import { getAuthUser, isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ allowedRoles }) => {
    const user = getAuthUser();
    const isAuth = isAuthenticated();

    // 1. Si no tiene token válido -> Al Login
    if (!isAuth) {
        return <Navigate to="/users/login" replace />;
    }
    
    // 2. Si tiene token pero su rol no está permitido -> Al Login (o a una página 403)
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/users/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;