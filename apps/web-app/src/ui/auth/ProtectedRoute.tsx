import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const tempUserId = localStorage.getItem('temp_userId');
    const location = useLocation();

    // 1. Definimos las rutas de "paso seguro" para el flujo de 2FA
    const securityRoutes = ['/2fa-setup', '/2fa-verify'];

    // 2. Si el usuario va a una de estas rutas y tenemos su ID temporal, lo dejamos pasar
    if (securityRoutes.includes(location.pathname) && tempUserId) {
        return <Outlet />;
    }

    // 3. Si no hay token real y no es una ruta de seguridad, lo mandamos al login (Auth)
    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    // 4. Si tiene token, puede ver el Dashboard y lo demás
    return <Outlet />;
};