import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // --- REGISTRO ---
    const register = async (userData: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.detail || 'Error en el registro');
            }

            if (data.status === 'success') {
                const actualId = data.user_id || data.id || data._id;
                localStorage.setItem('temp_userId', actualId);
                localStorage.setItem('userEmail', userData.email);
                navigate('/2fa-setup');
            }
        } catch (err: any) {
            console.warn("⚠️ Bypass: Procediendo con modo demo debido a fallo en API:", err.message);
            // MOCK BYPASS: Si falla el backend, igual dejamos pasar al setup
            localStorage.setItem('temp_userId', 'demo-user-id');
            localStorage.setItem('userEmail', userData.email || "demo@easypay.com");
            navigate('/2fa-setup');
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIN ---
    const login = async (identifier: string, password: string) => {
        setLoading(true);
        setError(null);
        console.log("🛰️ Enviando petición de login al servidor...");

        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('userId', data.user?.id || data.user?._id);
                localStorage.setItem('userName', data.user?.nombre || identifier);
                localStorage.setItem('userEmail', data.user?.email || identifier);
                localStorage.removeItem('temp_userId');
                navigate('/dashboard');
                return;
            }

            if (data.status === '2fa_required' || data.status === 'not_verified') {
                localStorage.setItem('temp_userId', data.user_id);
                localStorage.setItem('userEmail', data.email || "");
                navigate(data.status === 'not_verified' ? '/2fa-setup' : '/2fa-verify');
                return;
            }

            if (!response.ok) throw new Error(data.detail || 'Credenciales incorrectas');

        } catch (err: any) {
            console.warn("⚠️ Bypass: Procediendo con modo demo debido a fallo en API:", err.message);
            // MOCK BYPASS: Si falla el backend, mandamos a verificar (como pidió el usuario)
            localStorage.setItem('temp_userId', 'demo-user-id');
            localStorage.setItem('userEmail', identifier || "demo@easypay.com");
            localStorage.setItem('userName', identifier.split('@')[0] || "Usuario");
            navigate('/2fa-verify');
        } finally {
            setLoading(false);
        }
    };

    // --- LOGOUT ---
    const logout = () => {
        localStorage.clear();
        console.log("👋 Sesión cerrada.");
        navigate('/auth');
    };

    return {
        mode,
        setMode,
        loginType,
        setLoginType,
        loading,
        error,
        setError,
        register,
        login,
        logout,
        navigate
    };
};