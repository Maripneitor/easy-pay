import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AnimatedRoutes } from './routes/AnimatedRoutes';
import './global.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <BrowserRouter>
                        <AnimatedRoutes />
                    </BrowserRouter>
                    <Toaster position="top-center" richColors closeButton />
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};