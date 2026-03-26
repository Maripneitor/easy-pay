import React, { useState } from 'react';
// Agregamos Loader2 aquí abajo en la lista de imports
import { Mail, Lock, Smartphone, ArrowRight, Ticket, Sun, Moon, AlertCircle, Loader2 } from 'lucide-react';
import styles from './Auth.module.css';
import { useAuth } from './useAuth';
import { useTheme } from '../../context/ThemeContext';

export const Auth = () => {
    const {
        mode,
        setMode,
        loginType,
        loading,
        error,
        setError,
        register,
        login,
        navigate
    } = useAuth();

    const { isDark, toggleTheme } = useTheme();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🚀 Iniciando proceso de login...");
        try {
            await login(identifier, password);
            console.log("✅ Proceso de login finalizado.");
        } catch (err: any) {
            setError("Error inesperado al intentar iniciar sesión.");
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({
                nombre: fullName,
                email: identifier,
                password: password
            });
        } catch (err: any) {
            setError(err.message || "No se pudo completar el registro.");
        }
    };

    return (
        <div className={styles.authPage}>
            <button className={styles.themeToggle} onClick={toggleTheme}>
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
                    <p className={styles.subtitle}>Dividir gastos nunca fue tan fácil</p>
                </div>

                <div className={styles.glassCard}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
                            onClick={() => { setMode('login'); setError(null); }}
                            disabled={loading}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
                            onClick={() => { setMode('register'); setError(null); }}
                            disabled={loading}
                        >
                            Registrarse
                        </button>
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {mode === 'login' && (
                        <form className={styles.form} onSubmit={handleLoginSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="identifier">Email o Usuario</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={20} />
                                    <input
                                        type="text"
                                        id="identifier"
                                        placeholder="ejemplo@mail.com"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Contraseña</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={20} />
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button type="submit" className={styles.primaryBtn} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
                            </button>
                        </form>
                    )}

                    {mode === 'register' && (
                        <form className={styles.form} onSubmit={handleRegisterSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name">Nombre Completo</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Juan Pérez"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="reg-email">Email institucional</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={20} />
                                    <input
                                        type="email"
                                        id="reg-email"
                                        placeholder="tu@ejemplo.com"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="reg-password">Contraseña</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={20} />
                                    <input
                                        type="password"
                                        id="reg-password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button type="submit" className={styles.primaryBtn} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Crear Cuenta'}
                            </button>
                        </form>
                    )}
                </div>

                <div className={styles.guestAction}>
                    <button className={styles.guestBtn} onClick={() => navigate('/')} disabled={loading}>
                        Continuar como Invitado
                        <ArrowRight size={18} />
                    </button>
                </div>
            </main>
        </div>
    );
};