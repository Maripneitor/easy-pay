import { useState } from 'react';
import { Mail, Lock, Smartphone, ArrowRight, Github, Facebook, Ticket, Sun, Moon } from 'lucide-react';
import { GoogleIcon } from '@ui/components/icons/GoogleIcon';
import styles from './Auth.module.css';
import { useAuth } from './useAuth';
import { useTheme } from '../../context/ThemeContext';

export const Auth = () => {
    // Extraemos todo lo necesario del hook, incluyendo loading y error
    const { mode, setMode, loginType, setLoginType, login, register, loading, error, navigate } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Estados para los inputs
    const [identifier, setIdentifier] = useState(''); // Cambiamos 'email' por 'identifier'
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // El identifier puede ser el email o el nombre de usuario
        await login(identifier, password);
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register({
            nombre: fullName,
            apellido: "", // Lo dejamos vacío para que el backend lo maneje
            email: identifier, // En registro, el identifier actúa como email
            password: password
        });
    };

    return (
        <div className={styles.authPage}>
            <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className={styles.floatingCircle1} />
            <div className={styles.floatingCircle2} />

            <main className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.logoWrapper}>
                        {loginType === 'email' ? <Ticket className={styles.logoIcon} size={40} /> : <Smartphone className={styles.logoIcon} size={40} />}
                    </div>
                    <h1 className={styles.title}>Easy-Pay</h1>
                    <p className={styles.subtitle}>Sin matemáticas, sin dramas</p>
                </div>

                <div className={styles.glassCard}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
                            onClick={() => { setMode('login'); setError(null); }}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
                            onClick={() => { setMode('register'); setError(null); }}
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* MENSAJE DE ERROR DINÁMICO */}
                    {error && (
                        <div className={styles.errorMessage} style={{ color: '#ff4d4d', backgroundColor: 'rgba(255, 77, 77, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
                            {error}
                        </div>
                    )}

                    {mode === 'login' && loginType === 'email' && (
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
                                    />
                                </div>
                            </div>

                            <button type="submit" className={styles.primaryBtn} disabled={loading}>
                                {loading ? 'Validando...' : 'Entrar'}
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
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="reg-email">Email</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={20} />
                                    <input
                                        type="email"
                                        id="reg-email"
                                        placeholder="tu@ejemplo.com"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
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
                                    />
                                </div>
                            </div>
                            <button type="submit" className={styles.primaryBtn} disabled={loading}>
                                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </button>
                        </form>
                    )}
                </div>

                <div className={styles.guestAction}>
                    <button className={styles.guestBtn} onClick={() => navigate('/')}>
                        Continuar como Invitado
                        <ArrowRight size={18} />
                    </button>
                </div>
            </main>
        </div>
    );
};