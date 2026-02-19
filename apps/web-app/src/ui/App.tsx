import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Loader } from './components/Loader/Loader';
import './global.css';

// Lazy load pages for performance optimization
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const Auth = lazy(() => import('./pages/Auth').then(module => ({ default: module.Auth })));
const RecoverPasswordPage = lazy(() => import('./pages/RecoverPassword').then(module => ({ default: module.RecoverPasswordPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const CreateGroup = lazy(() => import('./pages/CreateGroup').then(module => ({ default: module.CreateGroup })));
const GroupDetail = lazy(() => import('./pages/GroupDetail').then(module => ({ default: module.GroupDetail })));
const MyPayments = lazy(() => import('./pages/MyPayments').then(module => ({ default: module.MyPayments })));
const OCRScanner = lazy(() => import('./pages/OCRScanner').then(module => ({ default: module.OCRScanner })));
const RegisterExpense = lazy(() => import('./pages/RegisterExpense').then(module => ({ default: module.RegisterExpense })));
const NotificationsPage = lazy(() => import('./pages/Notifications').then(module => ({ default: module.NotificationsPage })));
const TwoFactorSetup = lazy(() => import('./pages/TwoFactorSetup').then(module => ({ default: module.TwoFactorSetup })));
const ProfilePage = lazy(() => import('./pages/Profile').then(module => ({ default: module.ProfilePage })));
const PersonalData = lazy(() => import('./pages/Profile/PersonalData').then(module => ({ default: module.PersonalData })));

// HOC for Page Transitions
const PageTransition = ({ children }: { children: React.ReactNode }) => (
    <div className="page-enter min-h-screen flex flex-col w-full">
        {children}
    </div>
);

export const App = () => {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Suspense fallback={<Loader />}>
                    <Routes>
                        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
                        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
                        <Route path="/recover-password" element={<PageTransition><RecoverPasswordPage /></PageTransition>} />
                        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                        <Route path="/create-group" element={<PageTransition><CreateGroup /></PageTransition>} />
                        <Route path="/group/:id" element={<PageTransition><GroupDetail /></PageTransition>} />
                        <Route path="/my-payments" element={<PageTransition><MyPayments /></PageTransition>} />
                        <Route path="/ocr-scanner" element={<PageTransition><OCRScanner /></PageTransition>} />
                        <Route path="/register-expense" element={<PageTransition><RegisterExpense /></PageTransition>} />
                        <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />
                        <Route path="/2fa-setup" element={<PageTransition><TwoFactorSetup /></PageTransition>} />
                        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                        <Route path="/profile/personal-data" element={<PageTransition><PersonalData /></PageTransition>} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </ThemeProvider>
    );
};
