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

            if (!response.ok) {
                throw new Error(data.detail || 'Error en el registro');
            }

            setMode('login');
            alert("¡Registro exitoso! Ya puedes entrar.");
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

            if (!response.ok) throw new Error(data.detail || 'Credenciales incorrectas');

            // ✅ GUARDAMOS TODO LO NECESARIO PARA EL PERFIL Y LA ACTUALIZACIÓN
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userId', data.user.id);       // Vital para el PUT de actualización
            localStorage.setItem('userName', data.user.nombre);
            localStorage.setItem('userEmail', data.user.email);

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // ✅ LIMPIEZA TOTAL
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        navigate('/auth');
    };

    return {
        mode,
        setMode,
        loginType,
        setLoginType,
        loading,
        error,
        register,
        login,
        logout,
        navigate
    };
};