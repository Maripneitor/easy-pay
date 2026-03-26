import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PageHeader } from '@ui/components/PageHeader';
import {
    Smartphone,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export const TwoFactorVerify = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Buscamos el ID temporal del registro o el de login
    const userId = localStorage.getItem('temp_userId') || localStorage.getItem('userId');

    useEffect(() => {
        if (!userId || userId === 'null') {
            navigate('/auth');
        }
    }, [userId, navigate]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = otp.join("");
        if (fullCode.length !== 6) return;

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`http://localhost:8000/api/auth/2fa/verify/${userId}`, {
                code: fullCode
            });

            if (response.data.status === 'success') {
                setSuccess(true);

                // ✅ PASO CRUCIAL: Guardar el token para que ProtectedRoute nos deje pasar
                if (response.data.access_token) {
                    localStorage.setItem('token', response.data.access_token);
                }

                // Guardamos datos opcionales del usuario si vienen en la respuesta
                if (response.data.user) {
                    localStorage.setItem('userName', response.data.user.nombre);
                }

                setTimeout(() => {
                    localStorage.removeItem('temp_userId'); // Limpiamos rastro temporal
                    navigate('/dashboard'); // 🚀 ¡Directo al Dashboard!
                }, 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Código incorrecto o expirado.");
            setOtp(new Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (otp.join("").length === 6) {
            handleVerify();
        }
    }, [otp]);

    if (success) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-6">
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <CheckCircle2 size={56} />
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">¡Verificación Exitosa!</h2>
                    <p className="text-[var(--text-secondary)]">Accediendo a Easy-Pay...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-body)] flex flex-col">
            <PageHeader title="VERIFICACIÓN DE SEGURIDAD" subtitle="Easy-Pay Security Protocol" onBack={() => navigate('/auth')} />
            
            <main className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full -z-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[100px]"></div>
                </div>

                <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative z-10 backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-[var(--primary)]/10 text-[var(--primary)] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[var(--primary)]/20 shadow-inner">
                            <Smartphone size={40} className="drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Verificación de Seguridad</h2>
                        <p className="text-[var(--text-secondary)] text-sm mt-3 leading-relaxed">
                            Se ha enviado un código de verificación a tu correo. <br/> Por favor, introdúcelo a continuación para continuar.
                        </p>
                        
                        <div className="mt-6 inline-flex px-4 py-1.5 bg-[var(--primary)]/10 rounded-full border border-[var(--primary)]/20">
                            <span className="text-[10px] text-[var(--primary)] font-bold uppercase tracking-[0.15em] whitespace-nowrap">
                                Easy-Pay Security Protocol v4.0
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between gap-3 mb-10">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-full aspect-[4/5] text-center text-3xl font-bold bg-[var(--bg-body)] border-2 border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all shadow-lg"
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 text-red-400 text-sm bg-red-500/10 p-5 rounded-2xl border border-red-500/20 mb-8 animate-in fade-in slide-in-from-top-4">
                            <AlertCircle size={20} className="shrink-0" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleVerify}
                            disabled={loading || otp.join("").length !== 6}
                            className="w-full py-5 bg-[var(--primary)] hover:bg-blue-500 text-white rounded-2xl font-bold text-lg uppercase shadow-[0_12px_24px_-8px_rgba(59,130,246,0.3)] hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.4)] transition-all active:scale-[0.98] disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                <>
                                    <span>Verificar Cuenta</span>
                                    <CheckCircle2 size={24} />
                                </>
                            )}
                        </button>
                        
                        <button
                            onClick={() => navigate('/auth')}
                            className="w-full py-3 text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)] transition-colors text-sm"
                        >
                            Volver al inicio
                        </button>
                    </div>

                    <div className="mt-10 pt-6 border-t border-[var(--border-color)] text-center">
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-semibold opacity-50">
                            © 2026 Easy-Pay Security Systems. UNACH.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};