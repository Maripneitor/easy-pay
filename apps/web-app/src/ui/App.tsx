import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CreateGroup } from './pages/CreateGroup';
import { Dashboard } from './pages/Dashboard';
import { AuthPage } from './pages/Auth';
import { MyPayments } from './pages/MyPayments';
import { OCRScanner } from './pages/OCRScanner';
import { RegisterExpense } from './pages/RegisterExpense';
import { NotificationsPage } from './pages/Notifications';
import { TwoFactorSetup } from './pages/TwoFactorSetup';
import { RecoverPasswordPage } from './pages/RecoverPassword';
import { ProfilePage } from './pages/Profile';
import { PersonalData } from './pages/Profile/PersonalData';
import './global.css';

import { ThemeProvider } from './context/ThemeContext';

import { GroupDetail } from './pages/GroupDetail';

export const App = () => {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/recover-password" element={<RecoverPasswordPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create-group" element={<CreateGroup />} />
                    <Route path="/group/:id" element={<GroupDetail />} />
                    <Route path="/my-payments" element={<MyPayments />} />
                    <Route path="/ocr-scanner" element={<OCRScanner />} />
                    <Route path="/register-expense" element={<RegisterExpense />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/2fa-setup" element={<TwoFactorSetup />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/personal-data" element={<PersonalData />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}
