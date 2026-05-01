import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, ShieldCheck, Lock, Info } from 'lucide-react';
import { toast } from 'sonner';

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [bankStyle, setBankStyle] = useState('bg-gradient-to-br from-slate-800 to-slate-900');
    const [bankName, setBankName] = useState('EASY-PAY DEBIT');

    useEffect(() => {
        // Simple logic for bank detection
        const num = cardNumber.replace(/\s/g, '');
        if (num.startsWith('4152')) {
            setBankStyle('bg-gradient-to-br from-purple-600 to-purple-800');
            setBankName('NU MÉXICO');
        } else if (num.startsWith('4000')) {
            setBankStyle('bg-gradient-to-br from-blue-800 to-blue-950');
            setBankName('BBVA MÉXICO');
        } else if (num.startsWith('5434')) {
            setBankStyle('bg-gradient-to-br from-red-600 to-red-800');
            setBankName('SANTANDER');
        } else {
            setBankStyle('bg-gradient-to-br from-slate-800 to-slate-900');
            setBankName('EASY-PAY DEBIT');
        }
    }, [cardNumber]);

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(formatCardNumber(e.target.value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Tarjeta agregada correctamente');
        onClose();
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
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Interactive Card Section */}
                        <div className="w-full md:w-1/2 p-8 bg-black/5 flex flex-col items-center justify-center space-y-8">
                            <motion.div 
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                className="relative w-80 h-48 preserve-3d"
                            >
                                {/* Front Side */}
                                <div className={`absolute inset-0 rounded-2xl p-6 text-white shadow-2xl backface-hidden flex flex-col justify-between ${bankStyle} border border-white/20`}>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black tracking-widest opacity-80">{bankName}</p>
                                            <div className="w-10 h-8 bg-yellow-400/30 rounded-md border border-yellow-400/50 relative overflow-hidden">
                                                <div className="absolute inset-0 grid grid-cols-3 gap-0.5 opacity-20">
                                                    {[...Array(9)].map((_, i) => <div key={i} className="border border-white/20"></div>)}
                                                </div>
                                            </div>
                                        </div>
                                        <CreditCard size={32} className="opacity-80" />
                                    </div>
                                    
                                    <div className="space-y-4">
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
                                <div className={`absolute inset-0 rounded-2xl text-white shadow-2xl backface-hidden ${bankStyle} border border-white/20 rotate-y-180 flex flex-col py-6`}>
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
                                        className="w-full py-5 bg-[var(--primary)] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        <ShieldCheck size={20} /> Guardar Tarjeta
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
