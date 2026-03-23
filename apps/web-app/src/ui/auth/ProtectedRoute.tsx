import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
    // TODO: Connect with real auth state (e.g. from context or store)
    const isAuthenticated = true; // Mocked for now to allow development

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};
