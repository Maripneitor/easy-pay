import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const TwoFactorVerify = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '', '', '']);

    const handleConfirm = () => {
        // En un caso real, validar el código 2FA
        navigate('/dashboard'); // O donde sea el flujo normal
    };

    const handleCancel = () => {
        navigate('/auth');
    };

    return (
        <div className="bg-[#0f172a] text-slate-200 min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white">
            {/* Navbar for 2FA */}
            <header className="flex items-center justify-between border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 lg:px-10">
                <div className="flex items-center gap-3">
                    <img src="/assets/images/logo-ep.png" alt="Logo Easy-Pay" className="h-8 w-8 object-contain" />
                    <h2 className="text-white text-xl font-bold tracking-tight">Easy-Pay</h2>
                </div>
                <div className="flex items-center gap-6">
                    <button className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">help</span>
                        <span className="text-sm font-medium">Ayuda</span>
                    </button>
                    <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col animate-fade-in-up">
                    <div className="p-6 sm:p-8 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <span className="material-symbols-outlined">security</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Seguridad: 2FA</h1>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Añade una capa extra de seguridad a tu cuenta. Ingresa el código de 6 dígitos generado por tu app de autenticación.
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-300 text-center">
                                Ingresa el código de 6 dígitos
                            </label>
                            <div className="flex justify-center gap-2 sm:gap-3">
                                {code.map((digit, i) => (
                                    <React.Fragment key={i}>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            placeholder="-"
                                            value={digit}
                                            onChange={(e) => {
                                                const newCode = [...code];
                                                newCode[i] = e.target.value;
                                                setCode(newCode);
                                                if (e.target.value && i < 5) {
                                                    const nextInput = document.getElementById(`digit-${i + 1}`);
                                                    nextInput?.focus();
                                                }
                                            }}
                                            id={`digit-${i}`}
                                            className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-900/50 border border-slate-700 rounded-lg text-center text-xl font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all placeholder-slate-600"
                                        />
                                        {i === 2 && <span className="flex items-center text-slate-600">-</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="flex justify-center mt-2">
                                <button onClick={() => console.log('Reenviando código...')} className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors flex items-center justify-center gap-1 group">
                                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">refresh</span>
                                    Reenviar código
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <button 
                                onClick={handleConfirm}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-lg shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span>Confirmar Activación</span>
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                            <button 
                                onClick={handleCancel}
                                className="w-full py-3 px-4 bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-medium rounded-lg transition-all active:scale-[0.98]"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};