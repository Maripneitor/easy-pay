import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
<<<<<<< HEAD
import { useAuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader/Loader';

/**
 * ProtectedRoute
 *
 * Allows access if:
 *   - A registered user session is active, OR
 *   - A guest session is active
 *
 * While auth state is loading (restoring from localStorage), shows a Loader.
 * Redirects to /auth if neither condition is met.
 */
export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
        return <Loader />;
    }
=======

export const ProtectedRoute: React.FC = () => {
    // TODO: Connect with real auth state (e.g. from context or store)
    const isAuthenticated = true; // Mocked for now to allow development
>>>>>>> origin/main

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};
