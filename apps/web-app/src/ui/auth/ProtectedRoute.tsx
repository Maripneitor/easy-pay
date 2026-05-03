import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { STORAGE_KEYS } from '../../infrastructure/localStorage/storage-keys';

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuthContext();
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN); // Fallback
    const tempUserId = localStorage.getItem('temp_userId');
    const location = useLocation();

    if (isLoading) {
        return null; // El AnimatedRoutes ya maneja el loader global
    }

    // 1. Definimos las rutas de "paso seguro" para el flujo de 2FA
    const securityRoutes = ['/2fa-setup', '/2fa-verify'];

    // 2. Si el usuario va a una de estas rutas y tenemos su ID temporal, lo dejamos pasar
    if (securityRoutes.includes(location.pathname) && tempUserId) {
        return <Outlet />;
    }

    // 3. Si no está autenticado (y tampoco hay token físico), lo mandamos al login (Auth)
    if (!isAuthenticated && !token) {
        return <Navigate to="/auth" replace />;
    }

    // 4. Si está autenticado, puede ver el Dashboard y lo demás
    return <Outlet />;
};