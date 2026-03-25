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
        <div className="min-h-screen bg-[var(--bg-body)]">
            <PageHeader title="VERIFICAR CÓDIGO" subtitle="Seguridad Easy-Pay" onBack={() => navigate('/auth')} />
            <main className="max-w-md mx-auto px-6 py-12 relative">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 shadow-2xl relative z-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--primary)]/20">
                            <Smartphone size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Introduce el código</h2>
                        <p className="text-[var(--text-secondary)] text-sm mt-2">Escribe los 6 dígitos enviados a tu correo.</p>
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
                                className="w-12 h-14 text-center text-2xl font-bold bg-[var(--bg-body)] border-2 border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[var(--primary)] outline-none transition-all"
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 text-red-500 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-6">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        onClick={handleVerify}
                        disabled={loading || otp.join("").length !== 6}
                        className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold uppercase hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Verificar Cuenta"}
                    </button>
                </div>
            </main>
        </div>
    );
};