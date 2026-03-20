import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PageHeader } from '@ui/components/PageHeader';
import {
    ShieldCheck,
    Smartphone,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import styles from './TwoFactorSetup.module.css'; // Asegúrate de crear este CSS o usar Tailwind

export const TwoFactorVerify = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Referencias para saltar automáticamente entre cuadritos de texto
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const userId = localStorage.getItem('userId');

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Foco al siguiente cuadro
        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const fullCode = otp.join("");

        if (fullCode.length !== 6) return;

        setLoading(true);
        setError("");

        try {
            // Llamada a tu endpoint de FastAPI
            await axios.post(`http://localhost:8000/api/auth/2fa/verify/${userId}`, {
                code: fullCode
            });

            setSuccess(true);
            localStorage.setItem('2fa_enabled', 'true');

            // Redirigir al perfil tras 2 segundos de éxito
            setTimeout(() => navigate('/profile'), 2500);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Código incorrecto. Intenta de nuevo.");
            setOtp(new Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // Auto-envío cuando se llenan los 6 dígitos
    useEffect(() => {
        if (otp.join("").length === 6) {
            handleVerify();
        }
    }, [otp]);

    if (success) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-6">
                <div className="text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <CheckCircle2 size={56} />
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">¡Seguridad Activada!</h2>
                    <p className="text-[var(--text-secondary)]">Redirigiendo a tu perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-body)] transition-colors duration-300">
            <PageHeader title="VERIFICAR 2FA" subtitle="Easy-Pay Security" onBack={() => navigate(-1)} />

            <main className="max-w-md mx-auto px-6 py-12 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-[var(--primary)] opacity-5 blur-[100px] pointer-events-none" />

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 shadow-2xl relative z-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--primary)]/20">
                            <Smartphone size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Introduce el código</h2>
                        <p className="text-[var(--text-secondary)] text-sm mt-2">Escribe los 6 dígitos que aparecen en tu aplicación de autenticación.</p>
                    </div>

                    <div className="flex justify-between gap-2 mb-8">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-14 text-center text-2xl font-bold bg-[var(--bg-body)] border-2 border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 text-red-500 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-6 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <button
                        onClick={() => handleVerify()}
                        disabled={loading || otp.join("").length !== 6}
                        className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-[var(--primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Verificar y Activar"}
                    </button>

                    <p className="text-center mt-8 text-[var(--text-secondary)] text-xs">
                        ¿No puedes acceder a tu app? <br />
                        <span className="text-[var(--primary)] font-bold cursor-pointer hover:underline mt-1 inline-block">Usa un código de respaldo</span>
                    </p>
                </div>
            </main>
        </div>
    );
};