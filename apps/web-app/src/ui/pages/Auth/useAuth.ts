import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
            if (!response.ok) throw new Error(data.detail || 'Error en el registro');

            // Después del registro, lo mandamos a login para que inicie su verificación
            setMode('login');
            alert("¡Registro exitoso! Por seguridad, verifica tu correo al entrar.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const login = async (identifier: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();

            // MANEJO DE ESTADOS DE SEGURIDAD
            if (response.ok && data.status === 'success') {
                // CASO 1: Login Directo
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userName', data.user.nombre);
                localStorage.setItem('userEmail', data.user.email);
                navigate('/dashboard');
                return;
            }

            if (data.status === '2fa_required') {
                // CASO 2: Requiere código de 6 dígitos
                localStorage.setItem('temp_userId', data.user_id);
                navigate('/2fa-verify');
                return;
            }

            if (data.status === 'not_verified') {
                // CASO 3: Correo no verificado aún
                localStorage.setItem('temp_userId', data.user_id);
                localStorage.setItem('userEmail', data.email); // Para mostrarlo en la pantalla de setup
                alert("Debes verificar tu correo institucional.");
                navigate('/2fa-setup');
                return;
            }

            // Si llegamos aquí y no es OK, es un error de credenciales
            if (!response.ok) throw new Error(data.detail || 'Credenciales incorrectas');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear(); // Limpia todo de una vez
        navigate('/auth');
    };

    return { mode, setMode, loginType, setLoginType, loading, error, setError, register, login, logout, navigate };
};