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
                // Capturamos el ID que manda el backend (pueden ser ambos nombres)
                const actualId = data.user_id || data.id || data._id;

                if (!actualId) {
                    throw new Error("El servidor no devolvió un ID de usuario válido.");
                }

                // Guardamos datos temporales para la verificación
                localStorage.setItem('temp_userId', actualId);
                localStorage.setItem('userEmail', userData.email);

                console.log("✅ Registro exitoso. ID temporal:", actualId);

                // Mandamos al usuario a configurar su código
                navigate('/2fa-setup');
            }
        } catch (err: any) {
            setError(err.message);
            console.error("❌ Error en register:", err);
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
            const response = await fetch('http://localhost:8001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();

            // 1. CASO ÉXITO: El usuario ya está verificado y el 2FA está libre
            if (response.ok && data.status === 'success') {
                // Guardamos la sesión real
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('userId', data.user?.id || data.user?._id);
                localStorage.setItem('userName', data.user?.nombre);
                localStorage.setItem('userEmail', data.user?.email);

                // Limpieza de datos temporales
                localStorage.removeItem('temp_userId');

                console.log("🚀 Login exitoso. Navegando al Dashboard...");
                navigate('/dashboard');
                return;
            }

            // 2. CASO PENDIENTE: Requiere verificación o 2FA
            if (data.status === '2fa_required' || data.status === 'not_verified') {
                localStorage.setItem('temp_userId', data.user_id);
                localStorage.setItem('userEmail', data.email || "");

                if (data.status === 'not_verified') {
                    console.log("⚠️ Usuario no verificado. Reintentando Setup...");
                    navigate('/2fa-setup');
                } else {
                    console.log("🔒 2FA requerido. Navegando a verificación...");
                    navigate('/2fa-verify');
                }
                return;
            }

            // 3. CASO ERROR (Credenciales, etc)
            if (!response.ok) {
                throw new Error(data.message || data.detail || 'Credenciales incorrectas');
            }

        } catch (err: any) {
            setError(err.message);
            console.error("❌ Error en login:", err);
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