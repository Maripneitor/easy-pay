import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    // Verificamos el token que guardamos en el Login
    const token = localStorage.getItem('token');

    if (!token) {
        // Si no hay token, lo mandamos al login (Auth)
        // Usamos 'replace' para que no pueda regresar con el botón de atrás
        return <Navigate to="/auth" replace />;
    }

    // 'Outlet' es lo que permite que se rendericen las rutas hijas 
    // (Dashboard, Profile, etc.) definidas en tu App.tsx
    return <Outlet />;
};