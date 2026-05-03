import React, { useState, useEffect } from 'react';
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

import { useAuthContext } from '../../context/AuthContext';
import { userRepository } from '../../../infrastructure/api/repositories';
import { toast } from 'sonner';

export const TwoFactorSetup = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    const userId = user?.id;
    const userEmail = user?.email || "tu correo";

    useEffect(() => {
        if (!userId) {
            console.error("No se detectó ID de usuario. Regresando...");
            navigate('/auth');
        }
    }, [userId, navigate]);

    const goBack = () => navigate(-1);

    const handleRequestCode = async () => {
        if (!userId) {
            setError('Error de sesión: No se encontró el ID del usuario.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await userRepository.setupTwoFactor(userId);

            setCodeSent(true);
            toast.success("Código enviado exitosamente");

            setTimeout(() => {
                navigate('/2fa-verify');
            }, 2000);

        } catch (err: any) {
            console.error("Error en Setup 2FA:", err);
            const message = err.message || 'No pudimos enviar el código. Revisa tu conexión.';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0f172a] text-slate-200 min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white">
            {/* Minimal Navbar for 2FA */}
            <header className="flex items-center justify-between border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 lg:px-10">
                <div className="flex items-center gap-3">
                    <img src="/assets/images/logo-ep.png" alt="Logo Easy-Pay" className="h-8 w-8 object-contain" />
                    <h2 className="text-white text-xl font-bold tracking-tight">Easy-Pay</h2>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={goBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        <span className="text-sm font-medium">Volver</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col animate-fade-in-up">
                    <div className="p-6 sm:p-8 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <ShieldCheck size={24} />
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                {codeSent ? "¡Código Enviado!" : "Verificación por Correo"}
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {codeSent
                                ? `Revisa la bandeja de entrada de ${userEmail}.`
                                : `Para proteger tu cuenta de Easy-Pay, te enviaremos un código de seguridad de 6 dígitos a tu correo registrado.`
                            }
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Mail size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Correo de recuperación</p>
                                <p className="text-white font-medium">{userEmail}</p>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl text-xs font-bold border border-red-400/20">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                onClick={handleRequestCode}
                                disabled={loading || codeSent}
                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${codeSent
                                    ? "bg-emerald-500 text-white"
                                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
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

                    <div className="p-6 text-center border-t border-white/5">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                            © 2026 Easy-Pay Security. Software Engineering.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};