import React, { useState } from 'react';
import { Mail, ArrowLeft, Sun, Moon, Lock, Loader2, KeyRound } from 'lucide-react';
import styles from './RecoverPassword.module.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_USER_SERVICE_URL ?? 'http://localhost:8001';

export const RecoverPasswordPage = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || data.message || 'Error al solicitar restablecimiento');
            }
            
            if (data.status === 'success') {
                toast.success('Código enviado a tu correo');
                if (data.user_id) {
                    setUserId(data.user_id);
                    setStep(2);
                } else {
                    // Si por seguridad el backend no devuelve id cuando el correo no existe, mostramos el mensaje pero no avanzamos
                    // O avanzamos para no dar pistas, pero aquí necesitamos el user_id para el paso 2.
                    // En nuestra implementación el backend devuelve user_id o null.
                    toast.info(data.message);
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/2fa/verify/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || data.message || 'Código inválido');
            }
            
            if (data.status === 'success') {
                toast.success('Código verificado correctamente');
                setStep(3);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/change-password/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    new_password: newPassword,
                    confirm_password: confirmPassword
                }),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || data.message || 'Error al cambiar contraseña');
            }
            
            if (data.status === 'success') {
                toast.success('Contraseña actualizada correctamente');
                navigate('/auth');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className={styles.floatingCircle1} />
            <div className={styles.floatingCircle2} />

            <main className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.logoWrapper}>
                        <img src="/assets/images/logo-ep.png" alt="Logo" className={styles.logoImage} />
                    </div>
                    <h1 className={styles.title}>Easy-Pay</h1>
                </div>

                <div className={styles.glassCard}>
                    {step === 1 && (
                        <>
                            <div className="text-center mb-8">
                                <h2 className={styles.formTitle}>¿Olvidaste tu contraseña?</h2>
                                <p className={styles.subtitle} style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>
                                    No te preocupes. Introduce tu email y te enviaremos un código para restablecerla.
                                </p>
                            </div>

                            <form className={styles.form} onSubmit={handleRequestReset}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email">Email</label>
                                    <div className={styles.inputWrapper}>
                                        <Mail className={styles.inputIcon} size={20} />
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="tu@ejemplo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enviar código'}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="text-center mb-8">
                                <h2 className={styles.formTitle}>Ingresa el código</h2>
                                <p className={styles.subtitle} style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>
                                    Hemos enviado un código de verificación a <strong>{email}</strong>
                                </p>
                            </div>

                            <form className={styles.form} onSubmit={handleVerifyCode}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="code">Código de verificación</label>
                                    <div className={styles.inputWrapper}>
                                        <KeyRound className={styles.inputIcon} size={20} />
                                        <input
                                            type="text"
                                            id="code"
                                            placeholder="Ej. 123456"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            required
                                            disabled={loading}
                                            style={{ letterSpacing: '0.2em', textAlign: 'center' }}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verificar código'}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="text-center mb-8">
                                <h2 className={styles.formTitle}>Nueva contraseña</h2>
                                <p className={styles.subtitle} style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>
                                    Ingresa tu nueva contraseña para acceder a tu cuenta.
                                </p>
                            </div>

                            <form className={styles.form} onSubmit={handleChangePassword}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="newPassword">Nueva contraseña</label>
                                    <div className={styles.inputWrapper}>
                                        <Lock className={styles.inputIcon} size={20} />
                                        <input
                                            type="password"
                                            id="newPassword"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={8}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                    <div className={styles.inputWrapper}>
                                        <Lock className={styles.inputIcon} size={20} />
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={8}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Cambiar contraseña'}
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                        <button
                            type="button"
                            className={styles.switchBtn}
                            onClick={() => navigate('/auth')}
                            style={{ margin: '0 auto' }}
                            disabled={loading}
                        >
                            <ArrowLeft size={18} />
                            <span>Volver al inicio de sesión</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
