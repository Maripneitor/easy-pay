import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@ui/components/PageHeader';
import {
    ShieldCheck,
    Mail,
    Loader2,
    AlertCircle,
    Send,
    ArrowRight
} from 'lucide-react';
import styles from './TwoFactorSetup.module.css';

export const TwoFactorSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    const goBack = () => window.history.back();

    // Obtenemos los datos del usuario logueado
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail') || "tu correo";

    const handleRequestCode = async () => {
        try {
            setLoading(true);
            setError('');
            // Llamamos al nuevo endpoint que genera el OTP y lo "envía" (por ahora imprime en consola del backend)
            await axios.post(`http://localhost:8000/api/auth/2fa/setup/${userId}`);

            setCodeSent(true);
            // Pequeña espera para que el usuario vea el éxito antes de pasar a verificar
            setTimeout(() => {
                navigate('/2fa-verify');
            }, 2000);

        } catch (err) {
            setError('No pudimos enviar el código. Revisa tu conexión.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.setupPage} !bg-[var(--bg-body)] min-h-screen transition-colors duration-300`}>
            <PageHeader
                title="SEGURIDAD: 2FA"
                subtitle="Easy-Pay"
                onBack={goBack}
                showAvatar={false}
                showNotification={true}
            />

            <main className={`${styles.mainContent} !bg-transparent`}>
                {/* Efecto de brillo de fondo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-[var(--primary)] opacity-5 blur-[100px] pointer-events-none" />

                <div className={`${styles.setupCard} !bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl relative z-10`}>
                    <div className={styles.headerContainer}>
                        <div className={`${styles.iconCircle} bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20`}>
                            {codeSent ? <Send size={32} className="animate-bounce" /> : <ShieldCheck size={32} />}
                        </div>
                        <h2 className={`${styles.title} !text-[var(--text-primary)]`}>
                            {codeSent ? "¡Código Enviado!" : "Verificación por Correo"}
                        </h2>
                        <p className={`${styles.description} !text-[var(--text-secondary)]`}>
                            {codeSent
                                ? `Revisa la bandeja de entrada de ${userEmail}.`
                                : `Para proteger tu cuenta de Easy-Pay, te enviaremos un código de seguridad de 6 dígitos a tu correo registrado.`
                            }
                        </p>
                    </div>

                    <div className="bg-[var(--bg-body)] border border-[var(--border-color)] rounded-2xl p-6 my-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                            <Mail size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Correo de recuperación</p>
                            <p className="text-[var(--text-primary)] font-medium">{userEmail}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl text-xs font-bold border border-red-500/20">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="mt-8">
                        <button
                            onClick={handleRequestCode}
                            disabled={loading || codeSent}
                            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${codeSent
                                    ? "bg-emerald-500 text-white"
                                    : "bg-[var(--primary)] text-white hover:brightness-110 shadow-[var(--primary)]/20"
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : codeSent ? (
                                <>Redirigiendo... <ArrowRight size={18} /></>
                            ) : (
                                <>Enviar código de seguridad</>
                            )}
                        </button>
                    </div>
                </div>

                <footer className="mt-12 py-6 text-center">
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">
                        © 2026 Easy-Pay Security. Software Engineering.
                    </p>
                </footer>
            </main>
        </div>
    );
};