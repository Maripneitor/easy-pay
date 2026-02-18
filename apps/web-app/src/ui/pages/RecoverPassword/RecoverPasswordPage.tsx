import React, { useState } from 'react';
import { Mail, ArrowLeft, Ticket } from 'lucide-react';
import styles from './RecoverPassword.module.css';
import { useNavigate } from 'react-router-dom';

export const RecoverPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would integrate with your backend
        setSubmitted(true);
        // Simulate API call
        setTimeout(() => {
            // navigate('/auth'); 
            // Maybe show success message instead of redirecting immediately
        }, 2000);
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.floatingCircle1} />
            <div className={styles.floatingCircle2} />

            <main className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.logoWrapper}>
                        <Ticket className={styles.logoIcon} size={40} />
                    </div>
                    <h1 className={styles.title}>Easy-Pay</h1>
                </div>

                <div className={styles.glassCard}>
                    {!submitted ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className={styles.formTitle}>¿Olvidaste tu contraseña?</h2>
                                <p className={styles.subtitle} style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>
                                    No te preocupes. Introduce tu email y te enviaremos un código para restablecerla.
                                </p>
                            </div>

                            <form className={styles.form} onSubmit={handleSubmit}>
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
                                        />
                                    </div>
                                </div>

                                <button type="submit" className={styles.primaryBtn}>
                                    Enviar instrucciones
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Mail size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">¡Correo enviado!</h2>
                            <p className="text-slate-400 text-sm">
                                Revisa tu bandeja de entrada en <strong>{email}</strong> para continuar con el proceso.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                        <button
                            type="button"
                            className={styles.switchBtn}
                            onClick={() => navigate('/auth')}
                            style={{ margin: '0 auto' }}
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
