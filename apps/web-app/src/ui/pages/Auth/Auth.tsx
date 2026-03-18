import { Mail, Lock, Smartphone, ArrowRight, Github, Facebook, Ticket, Sun, Moon } from 'lucide-react';
import { GoogleIcon } from '@ui/components/icons/GoogleIcon';
import styles from './Auth.module.css';
import { useAuth } from './useAuth';
import { useTheme } from '../../context/ThemeContext';

export const Auth = () => {
    const { mode, setMode, loginType, setLoginType, navigate } = useAuth();
    const { theme, toggleTheme } = useTheme();

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
                            onClick={() => setMode('login')}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
                            onClick={() => setMode('register')}
                        >
                            Registrarse
                        </button>
                    </div>

                    {mode === 'login' && loginType === 'email' && (
                        <form className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={20} />
                                    <input type="email" id="email" placeholder="tu@ejemplo.com" />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Contraseña</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={20} />
                                    <input type="password" id="password" placeholder="••••••••" />
                                </div>
                            </div>

                            <div className={styles.options}>
                                <label className={styles.rememberMe}>
                                    <input type="checkbox" />
                                    <span>Recordarme</span>
                                </label>
                                <button type="button" className={styles.forgotPass} onClick={() => navigate('/recover-password')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>

                            <button type="button" className={styles.primaryBtn} onClick={() => navigate('/dashboard')}>
                                Entrar
                            </button>

                            <button type="button" className={styles.switchBtn} onClick={() => setLoginType('phone')}>
                                <Smartphone size={18} />
                                <span style={{ marginLeft: '0.5rem' }}>Usar número de teléfono</span>
                            </button>
                        </form>
                    )}

                    {mode === 'login' && loginType === 'phone' && (
                        <form className={styles.form}>
                            <h2 className={styles.formTitle}>Ingresa con tu móvil</h2>
                            <div className={styles.inputGroup}>
                                <label htmlFor="phone">Número de teléfono</label>
                                <div className={styles.phoneInputRow}>
                                    <select className={styles.countrySelect}>
                                        <option>+34 🇪🇸</option>
                                        <option>+1 🇺🇸</option>
                                        <option>+52 🇲🇽</option>
                                    </select>
                                    <input type="tel" id="phone" placeholder="600 000 000" className={styles.phoneInput} />
                                </div>
                                <p className={styles.hint}>Te enviaremos un código de verificación.</p>
                            </div>

                            <button type="button" className={styles.primaryBtn} onClick={() => navigate('/dashboard')}>
                                Enviar Código
                            </button>

                            <button type="button" className={styles.switchBtn} onClick={() => setLoginType('email')}>
                                <Mail size={18} />
                                <span>Volver al login con email</span>
                            </button>
                        </form>
                    )}

                    {mode === 'register' && (
                        <form className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name">Nombre Completo</label>
                                <div className={styles.inputWrapper}>
                                    <input type="text" id="name" placeholder="Juan Pérez" />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="reg-email">Email</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={20} />
                                    <input type="email" id="reg-email" placeholder="tu@ejemplo.com" />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="reg-password">Contraseña</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={20} />
                                    <input type="password" id="reg-password" placeholder="••••••••" />
                                </div>
                            </div>
                            <button type="button" className={styles.primaryBtn} onClick={() => navigate('/dashboard')}>
                                Crear Cuenta
                            </button>
                        </form>
                    )}

                    <div className={styles.divider}>
                        <div className={styles.line} />
                        <span>O continúa con</span>
                        <div className={styles.line} />
                    </div>

                    <div className={styles.socialGrid}>
                        <button className={styles.socialBtn}><GoogleIcon size={20} /></button>
                        <button className={styles.socialBtn}><Github size={20} /></button>
                        <button className={styles.socialBtn}><Facebook size={20} /></button>
                    </div>
                </div>

                <div className={styles.guestAction}>
                    <button className={styles.guestBtn} onClick={() => navigate('/')}>
                        Continuar como Invitado
                        <ArrowRight size={18} />
                    </button>
                </div>
            </main>

            <div className={styles.particles}>
                <div className={styles.particle1} />
                <div className={styles.particle2} />
                <div className={styles.particle3} />
            </div>
        </div>
    );
};
