import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Loader } from './components/Loader/Loader';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { AnimatePresence, motion } from 'framer-motion';
import './global.css';

// --- Lazy load de páginas ---
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const Auth = lazy(() => import('./pages/Auth').then(module => ({ default: module.Auth })));
const RecoverPasswordPage = lazy(() => import('./pages/RecoverPassword').then(module => ({ default: module.RecoverPasswordPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const CreateGroup = lazy(() => import('./pages/CreateGroup').then(module => ({ default: module.CreateGroup })));
const GroupDetail = lazy(() => import('./pages/GroupDetail').then(module => ({ default: module.GroupDetail })));
const MyPayments = lazy(() => import('./pages/MyPayments').then(module => ({ default: module.MyPayments })));
const NotificationsPage = lazy(() => import('./pages/Notifications').then(module => ({ default: module.NotificationsPage })));
const ProfilePage = lazy(() => import('./pages/Profile').then(module => ({ default: module.ProfilePage })));
const PersonalData = lazy(() => import('./pages/Profile/PersonalData').then(module => ({ default: module.PersonalData })));
const SettleUp = lazy(() => import('./pages/SettleUp').then(module => ({ default: module.SettleUp })));
const RegisterExpense = lazy(() => import('./pages/RegisterExpense').then(module => ({ default: module.RegisterExpense })));
const JoinGroup = lazy(() => import('./pages/JoinGroup').then(module => ({ default: module.JoinGroup })));

// 2FA
const TwoFactorSetup = lazy(() => import('./pages/TwoFactorSetup').then(module => ({ default: module.TwoFactorSetup })));
const TwoFactorVerify = lazy(() => import('./pages/TwoFactorSetup').then(module => ({ default: module.TwoFactorVerify })));

// --- HOC para Transiciones de Página ---
const PageTransition = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        className="page-enter min-h-screen flex flex-col w-full"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
    >
        {children}
    </motion.div>
);

// ✅ Configuración de React Query (Evita spam al backend de Python en UNACH)
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

// Componente de Rutas Animadas (necesario para useLocation)
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={<Loader />}>
                <Routes location={location} key={location.pathname}>
                    {/* --- RUTAS PÚBLICAS --- */}
                    <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
                    <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
                    <Route path="/recover-password" element={<PageTransition><RecoverPasswordPage /></PageTransition>} />
                    <Route path="/qr-scanner" element={<PageTransition><JoinGroup /></PageTransition>} />

                    {/* --- RUTAS PROTEGIDAS --- */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                            <Route path="/create-group" element={<PageTransition><CreateGroup /></PageTransition>} />

                            {/* Detalle del Grupo */}
                            <Route path="/group/:id" element={<PageTransition><GroupDetail /></PageTransition>} />

                            {/* Gestión de Gastos */}
                            <Route path="/group/:groupId/register-expense" element={<PageTransition><RegisterExpense /></PageTransition>} />

                            {/* ✅ NUEVA RUTA: Editar Gasto (usa el mismo componente de registro) */}
                            <Route path="/group/:groupId/edit-item/:itemId" element={<PageTransition><RegisterExpense /></PageTransition>} />

                            {/* Liquidación de Deudas */}
                            <Route path="/group/:id/settle-up" element={<PageTransition><SettleUp /></PageTransition>} />

                            <Route path="/my-payments" element={<PageTransition><MyPayments /></PageTransition>} />
                            <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />

                            {/* Configuración de Seguridad */}
                            <Route path="/2fa-setup" element={<PageTransition><TwoFactorSetup /></PageTransition>} />
                            <Route path="/2fa-verify" element={<PageTransition><TwoFactorVerify /></PageTransition>} />

                            {/* Perfil */}
                            <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                            <Route path="/profile/personal-data" element={<PageTransition><PersonalData /></PageTransition>} />
                        </Route>
                    </Route>

                    {/* Redirección por defecto */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
};

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