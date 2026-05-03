import React, { Suspense, lazy, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader/Loader';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { AnimatePresence, motion } from 'framer-motion';

// ─── ErrorBoundary: captura errores de carga dinámica (React.lazy) ───────────
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class RouteErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[RouteErrorBoundary] Error al cargar módulo:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '100vh', gap: '1rem',
                    fontFamily: 'Inter, system-ui, sans-serif', color: '#e2e8f0',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                }}>
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px', padding: '2rem', textAlign: 'center', maxWidth: '420px',
                    }}>
                        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>
                            Error de conexión
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 1.5rem' }}>
                            No se pudo cargar la página. Esto suele ocurrir si el servidor de desarrollo se reinició.
                        </p>
                        <button
                            onClick={this.handleRetry}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: '#fff', border: 'none', borderRadius: '8px',
                                padding: '0.625rem 1.5rem', cursor: 'pointer', fontSize: '0.875rem',
                                fontWeight: 600,
                            }}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// --- Lazy load de páginas ---
const LandingPage = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Auth = lazy(() => import('../pages/Auth').then(m => ({ default: m.Auth })));
const RecoverPasswordPage = lazy(() => import('../pages/RecoverPassword/RecoverPasswordPage').then(m => ({ default: m.RecoverPasswordPage })));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const CreateGroup = lazy(() => import('../pages/CreateGroup').then(m => ({ default: m.CreateGroup })));
const GroupDetail = lazy(() => import('../pages/GroupDetail').then(m => ({ default: m.GroupDetail })));
const MyPayments = lazy(() => import('../pages/MyPayments').then(m => ({ default: m.MyPayments })));
const StatsPage = lazy(() => import('../pages/Stats/StatsPage').then(m => ({ default: m.StatsPage })));
const ProfilePage = lazy(() => import('../pages/Profile').then(m => ({ default: m.ProfilePage })));
const PersonalData = lazy(() => import('../pages/Profile/PersonalData').then(m => ({ default: m.PersonalData })));
const SettleUp = lazy(() => import('../pages/SettleUp').then(m => ({ default: m.SettleUp })));
const RegisterExpense = lazy(() => import('../pages/RegisterExpense').then(m => ({ default: m.RegisterExpense })));
const JoinGroup = lazy(() => import('../pages/JoinGroup').then(m => ({ default: m.JoinGroup })));
const GroupsPage = lazy(() => import('../pages/Groups/GroupsPage').then(m => ({ default: m.GroupsPage })));
const OCRScanner = lazy(() => import('../pages/OCRScanner').then(m => ({ default: m.OCRScanner })));

// 2FA
const TwoFactorSetup = lazy(() => import('../pages/TwoFactorSetup').then(m => ({ default: m.TwoFactorSetup })));
const TwoFactorVerify = lazy(() => import('../pages/TwoFactorSetup').then(m => ({ default: m.TwoFactorVerify })));

const PageTransition = ({ children }: { children: ReactNode }) => (
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

// ─── Guard: si ya está autenticado, redirige al dashboard ────────────────────
const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuthContext();
    if (isLoading) return <Loader />;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
};

export const AnimatedRoutes = () => {
    const location = useLocation();
    const { isLoading } = useAuthContext();

    if (isLoading) {
        return <Loader />;
    }

    return (
        <RouteErrorBoundary>
            <AnimatePresence mode="wait">
                <Suspense fallback={<Loader />}>
                    <Routes location={location} key={location.pathname}>
                        {/* Rutas públicas con guard: si estás logueado, van al dashboard */}
                        <Route path="/" element={
                            <PublicOnlyRoute>
                                <PageTransition><LandingPage /></PageTransition>
                            </PublicOnlyRoute>
                        } />
                        <Route path="/auth" element={
                            <PublicOnlyRoute>
                                <PageTransition><Auth /></PageTransition>
                            </PublicOnlyRoute>
                        } />

                        {/* Rutas públicas sin guard */}
                        <Route path="/recover-password" element={<PageTransition><RecoverPasswordPage /></PageTransition>} />
                        <Route path="/reset-password" element={<PageTransition><RecoverPasswordPage /></PageTransition>} />
                        <Route path="/qr-scanner" element={<PageTransition><JoinGroup /></PageTransition>} />
                        <Route path="/2fa-setup" element={<PageTransition><TwoFactorSetup /></PageTransition>} />
                        <Route path="/2fa-verify" element={<PageTransition><TwoFactorVerify /></PageTransition>} />

                        {/* Rutas protegidas */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                                <Route path="/groups" element={<PageTransition><GroupsPage /></PageTransition>} />
                                <Route path="/create-group" element={<PageTransition><CreateGroup /></PageTransition>} />
                                <Route path="/group/:id" element={<PageTransition><GroupDetail /></PageTransition>} />
                                <Route path="/group/:groupId/register-expense" element={<PageTransition><RegisterExpense /></PageTransition>} />
                                <Route path="/group/:groupId/edit-item/:itemId" element={<PageTransition><RegisterExpense /></PageTransition>} />
                                <Route path="/group/:id/settle-up" element={<PageTransition><SettleUp /></PageTransition>} />
                                <Route path="/my-payments" element={<PageTransition><MyPayments /></PageTransition>} />
                                <Route path="/stats" element={<PageTransition><StatsPage /></PageTransition>} />
                                <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                                <Route path="/change-password" element={<PageTransition><RecoverPasswordPage /></PageTransition>} />
                                <Route path="/profile/personal-data" element={<PageTransition><PersonalData /></PageTransition>} />
                                <Route path="/ocr-scanner" element={<PageTransition><OCRScanner /></PageTransition>} />
                            </Route>
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Suspense>
            </AnimatePresence>
        </RouteErrorBoundary>
    );
};

