import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, ShieldCheck, Lock, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthContext } from '../../../context/AuthContext';
import { userRepository } from '../../../../infrastructure/api/repositories';
import { cn } from '../../../../infrastructure/utils';

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    currentCardsCount?: number;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onSuccess, currentCardsCount = 0 }) => {
    const { user } = useAuthContext();
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [bankStyle, setBankStyle] = useState('bg-gradient-to-br from-slate-800 to-slate-900');
    const [bankName, setBankName] = useState('EASY-PAY DEBIT');
    const [cardBrand, setCardBrand] = useState('VISA');

    useEffect(() => {
        const num = cardNumber.replace(/\s/g, '');
        
        // --- Mejor detección de bancos y marcas con estilos premium ---
        if (num.startsWith('4152') || num.startsWith('4556') || num.includes('6042')) {
            setBankStyle('bg-gradient-to-r from-indigo-600 via-purple-700 to-fuchsia-800');
            setBankName('NU MÉXICO');
            setCardBrand('VISA');
        } else if (num.startsWith('4000') || num.startsWith('4213') || num.startsWith('4169')) {
            setBankStyle('bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800');
            setBankName('BBVA MÉXICO');
            setCardBrand('VISA');
        } else if (num.startsWith('5434') || num.startsWith('5204')) {
            setBankStyle('bg-gradient-to-r from-rose-700 via-red-600 to-orange-600');
            setBankName('SANTANDER');
            setCardBrand('MASTERCARD');
        } else if (num.startsWith('5256') || num.startsWith('5579')) {
            setBankStyle('bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900');
            setBankName('CITIBANAMEX');
            setCardBrand('MASTERCARD');
        } else if (num.startsWith('4915') || num.startsWith('4027')) {
            setBankStyle('bg-gradient-to-r from-red-800 via-red-700 to-slate-900');
            setBankName('BANORTE');
            setCardBrand('VISA');
        } else if (num.startsWith('4214')) {
            setBankStyle('bg-gradient-to-r from-red-600 via-red-500 to-gray-200');
            setBankName('HSBC MÉXICO');
            setCardBrand('VISA');
        } else if (num.startsWith('4189')) {
            setBankStyle('bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500');
            setBankName('RAPPICARD');
            setCardBrand('VISA');
        } else if (num.startsWith('37') || num.startsWith('34')) {
            setBankStyle('bg-gradient-to-r from-slate-400 via-slate-500 to-gray-600');
            setBankName('AMERICAN EXPRESS');
            setCardBrand('AMEX');
        } else if (num.startsWith('5')) {
            setBankStyle('bg-gradient-to-r from-orange-500 via-red-500 to-pink-600');
            setBankName('MASTERCARD GOLD');
            setCardBrand('MASTERCARD');
        } else if (num.startsWith('4')) {
            setBankStyle('bg-gradient-to-r from-blue-900 to-indigo-800');
            setBankName('VISA PLATINUM');
            setCardBrand('VISA');
        } else {
            setBankStyle('bg-gradient-to-br from-slate-800 to-slate-900');
            setBankName('EASY-PAY DEBIT');
            setCardBrand('VISA');
        }
    }, [cardNumber]);

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const parts = [];

        for (let i = 0, len = v.length; i < len; i += 4) {
            parts.push(v.substring(i, i + 4));
        }

        return parts.join(' ').substring(0, 19);
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(formatCardNumber(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return toast.error('Sesión no válida');

        // Límite estricto de 3 tarjetas
        if (currentCardsCount >= 3) {
            toast.error('Has alcanzado el límite máximo de 3 tarjetas por usuario');
            return;
        }

        setLoading(true);
        try {
            await userRepository.addCard(user.id, {
                id: crypto.randomUUID(), // Generar ID único persistente
                number: cardNumber.replace(/\s/g, ''),
                holder: cardHolder,
                expiry,
                cvv,
                brand: cardBrand,
                bank_name: bankName,
                bank_style: bankStyle,
                last_four: cardNumber.slice(-4)
            });

            toast.success('Tarjeta guardada exitosamente');
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'No se pudo guardar la tarjeta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] shadow-2xl overflow-y-auto no-scrollbar max-h-[95vh] flex flex-col md:flex-row"
                    >
                        {/* Interactive Card Section */}
                        <div className="w-full md:w-1/2 p-8 bg-black/5 flex flex-col items-center justify-center space-y-8">
                            <motion.div 
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                className="relative w-80 h-48 preserve-3d"
                            >
                                {(() => {
                                    // Mapeo manual de clases de tailwind a gradientes CSS reales para evitar el "quemado" por CSS global
                                    let cssGradient = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
                                    const styleClass = bankStyle || '';
                                    
                                    if (styleClass.includes('indigo-600')) cssGradient = 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 50%, #d946ef 100%)';
                                    else if (styleClass.includes('blue-900')) cssGradient = 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e40af 100%)';
                                    else if (styleClass.includes('rose-700')) cssGradient = 'linear-gradient(135deg, #be123c 0%, #dc2626 50%, #ea580c 100%)';
                                    else if (styleClass.includes('blue-600')) cssGradient = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #312e81 100%)';
                                    else if (styleClass.includes('red-800')) cssGradient = 'linear-gradient(135deg, #991b1b 0%, #b91c1c 50%, #0f172a 100%)';
                                    else if (styleClass.includes('red-600')) cssGradient = 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #e5e7eb 100%)';
                                    else if (styleClass.includes('fuchsia-600')) cssGradient = 'linear-gradient(135deg, #c026d3 0%, #db2777 50%, #f43f5e 100%)';
                                    else if (styleClass.includes('slate-400')) cssGradient = 'linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #4b5563 100%)';
                                    else if (styleClass.includes('orange-500')) cssGradient = 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #db2777 100%)';

                                    return (
                                        <>
                                            {/* Front Side */}
                                            <div 
                                                className="absolute inset-0 payment-card rounded-2xl p-6 text-white shadow-2xl backface-hidden border border-white/20 flex flex-col justify-between overflow-hidden"
                                                style={{ 
                                                    background: `${cssGradient} !important`
                                                }}
                                            >
                                                {/* Texture & Gloss (Reduced) */}
                                                <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')", zIndex: 1 }} />
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30" style={{ zIndex: 1 }} />

                                                <div className="relative z-10 flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-white/70 drop-shadow-sm">{bankName}</p>
                                                        <div className="w-12 h-9 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 rounded-lg border border-white/30 flex items-center justify-center p-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
                                                            <div className="w-full h-full bg-black/10 rounded-sm grid grid-cols-4 gap-0.5 opacity-50">
                                                                {[...Array(8)].map((_, i) => <div key={i} className="border-r border-b border-white/10"></div>)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="h-10 flex items-center">
                                                        {cardBrand?.toUpperCase() === 'VISA' && <span className="text-3xl font-black italic tracking-tighter text-white opacity-90 drop-shadow-lg">VISA</span>}
                                                        {cardBrand?.toUpperCase() === 'MASTERCARD' && (
                                                            <div className="flex -space-x-3">
                                                                <div className="w-8 h-8 rounded-full bg-rose-500/80 mix-blend-screen" />
                                                                <div className="w-8 h-8 rounded-full bg-amber-500/80 mix-blend-screen" />
                                                            </div>
                                                        )}
                                                        {cardBrand?.toUpperCase() === 'AMEX' && <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded text-xs font-black italic">AMEX</div>}
                                                        {!['VISA', 'MASTERCARD', 'AMEX'].includes(cardBrand?.toUpperCase()) && <span className="text-lg font-black uppercase tracking-widest text-white/70">{cardBrand}</span>}
                                                    </div>
                                                </div>
                                                
                                                <div className="relative z-10 space-y-4">
                                                    <p className="text-xl font-mono tracking-[0.25em] text-center drop-shadow-md">
                                                        {cardNumber || '**** **** **** ****'}
                                                    </p>
                                                    <div className="flex justify-between items-end">
                                                        <div className="space-y-0.5">
                                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Titular</p>
                                                            <p className="text-xs font-black uppercase tracking-widest truncate max-w-[150px]">
                                                                {cardHolder || 'Nombre Apellido'}
                                                            </p>
                                                        </div>
                                                        <div className="text-right space-y-0.5">
                                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Vence</p>
                                                            <p className="text-xs font-black uppercase tracking-widest">
                                                                {expiry || 'MM/AA'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Back Side */}
                                            <div 
                                                className="absolute inset-0 rounded-2xl text-white shadow-2xl backface-hidden border border-white/20 rotate-y-180 flex flex-col py-6"
                                                style={{ 
                                                    background: `${cssGradient} !important`
                                                }}
                                            >
                                                <div className="w-full h-10 bg-black/80 mb-6"></div>
                                                <div className="px-6 space-y-4">
                                                    <div className="w-full h-8 bg-slate-200/20 rounded flex items-center justify-end px-3">
                                                        <span className="text-black font-mono font-bold bg-white px-2 py-0.5 rounded shadow-inner">{cvv || '***'}</span>
                                                    </div>
                                                    <p className="text-[7px] leading-tight opacity-60">
                                                        Esta tarjeta es intransferible y su uso está sujeto a los términos y condiciones de Easy-Pay. En caso de extravío, repórtela de inmediato desde la aplicación.
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </motion.div>

                            <div className="flex items-center gap-3 text-slate-400">
                                <Lock size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Encriptación Bancaria AES-256</span>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="w-full md:w-1/2 p-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Nueva Tarjeta</h3>
                                    <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">Agrega tus fondos de forma segura</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-xl transition-all md:hidden">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Número de Tarjeta</label>
                                    <input 
                                        type="text" 
                                        maxLength={19}
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        onFocus={() => setIsFlipped(false)}
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full px-5 py-4 bg-black/5 border border-[var(--border-color)] rounded-2xl text-sm font-bold focus:border-[var(--primary)] transition-all outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Titular (Como aparece en la tarjeta)</label>
                                    <input 
                                        type="text" 
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value)}
                                        onFocus={() => setIsFlipped(false)}
                                        placeholder="JUAN PEREZ"
                                        className="w-full px-5 py-4 bg-black/5 border border-[var(--border-color)] rounded-2xl text-sm font-bold focus:border-[var(--primary)] transition-all outline-none"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Vencimiento</label>
                                        <input 
                                            type="text" 
                                            maxLength={5}
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            onFocus={() => setIsFlipped(false)}
                                            placeholder="MM/AA"
                                            className="w-full px-5 py-4 bg-black/5 border border-[var(--border-color)] rounded-2xl text-sm font-bold focus:border-[var(--primary)] transition-all outline-none text-center"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">CVV / CVC</label>
                                        <input 
                                            type="text" 
                                            maxLength={3}
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            onFocus={() => setIsFlipped(true)}
                                            placeholder="123"
                                            className="w-full px-5 py-4 bg-black/5 border border-[var(--border-color)] rounded-2xl text-sm font-bold focus:border-[var(--primary)] transition-all outline-none text-center"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 bg-[var(--primary)] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                                        {loading ? 'Guardando...' : 'Guardar Tarjeta'}
                                    </button>
                                </div>
                            </form>

                            <div className="flex items-center gap-2 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-blue-600">
                                <Info size={16} />
                                <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                                    Tus datos están protegidos. Easy-Pay no almacena tu CVV y utiliza tokens para procesar pagos.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            <style>{`
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </AnimatePresence>
    );
};
