import React, { useState } from 'react';
import { 
    Banknote, 
    CreditCard as CardIcon, 
    Send, 
    Edit3,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '../../../infrastructure/utils';
import { useGroupDetail } from '../GroupDetail/useGroupDetail';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useClipboard } from '../../hooks/useClipboard';

export const SettleUp = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userShare, balances, integrantes_data, isFetchingGroup: loading } = useGroupDetail(id || "");
    const { copyToClipboard, copiedId } = useClipboard();
    
    // Identificar al acreedor (quien tiene el mayor saldo a favor)
    const creditor = React.useMemo(() => {
        if (!balances || balances.length === 0) return null;
        const positiveBalances = balances.filter((b: any) => b.monto > 0);
        if (positiveBalances.length === 0) return null;
        
        const top = [...positiveBalances].sort((a, b) => b.monto - a.monto)[0];
        return integrantes_data.find(i => i.id === top.usuario_id) || null;
    }, [balances, integrantes_data]);
    
    const [amount, setAmount] = useState(userShare?.toString() || "0");
    const [method, setMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
    const [note, setNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Actualizar el monto cuando cargue el userShare
    React.useEffect(() => {
        if (!loading && userShare) {
            setAmount(userShare.toString());
        }
    }, [loading, userShare]);

    const handleSettle = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast.error('Por favor ingresa un monto válido');
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            toast.success('¡Deuda liquidada correctamente!');
            navigate(-1);
        }, 2000);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
             <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary)] border-t-transparent" />
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 px-4 md:px-0">
            <div className="flex items-center justify-between py-6 border-b border-[var(--border-color)]">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                >
                    <ArrowLeft size={18} /> Volver
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-secondary)]">Liquidar Deuda</h2>
            </div>
            
            {/* Amount Card */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] p-10 flex flex-col items-center text-center relative overflow-hidden group shadow-xl shadow-black/5">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Banknote size={120} />
                </div>
                
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mb-6 border border-[var(--primary)]/10">
                    <Banknote size={32} className="text-[var(--primary)]" />
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4">Monto a pagar</p>
                
                <div className="flex items-center justify-center gap-3 w-full max-w-xs">
                    <span className="text-3xl font-black text-[var(--text-secondary)]">$</span>
                    <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-6xl font-black bg-transparent border-none text-center focus:ring-0 w-full p-0 text-[var(--text-primary)]"
                        placeholder="0.00"
                    />
                </div>
                
                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/5 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                    <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">Deuda Pendiente: ${userShare.toFixed(2)}</p>
                </div>
            </div>

            {/* Note Field */}
            <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-4 opacity-50">Nota (Opcional)</p>
                <div className="flex items-center gap-4 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/50 focus-within:border-[var(--primary)]/50 transition-colors backdrop-blur-sm">
                    <Edit3 size={20} className="text-[var(--text-secondary)]" />
                    <input 
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Concepto del pago..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/30"
                    />
                </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-4 opacity-50">Método de Pago</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { id: 'cash', icon: Banknote, label: 'Efectivo', desc: 'Pago manual', color: 'emerald' },
                        { id: 'transfer', icon: Send, label: 'Transferencia', desc: 'SPEI / Directo', color: 'blue' },
                        { id: 'card', icon: CardIcon, label: 'Tarjeta', desc: 'Débito / Crédito', color: 'purple' }
                    ].map((m) => (
                        <button 
                            key={m.id}
                            onClick={() => setMethod(m.id as any)}
                            className={cn(
                                "flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left relative overflow-hidden group/btn",
                                method === m.id 
                                    ? "bg-[var(--primary)]/10 border-[var(--primary)] shadow-lg shadow-[var(--primary)]/5" 
                                    : "bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--primary)]/30 opacity-60 hover:opacity-100"
                            )}
                        >
                            {method === m.id && (
                                <motion.div 
                                    layoutId="selectedMethod"
                                    className="absolute top-2 right-2 text-[var(--primary)]"
                                >
                                    <CheckCircle size={16} />
                                </motion.div>
                            )}
                            
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm",
                                method === m.id ? "bg-[var(--primary)] text-white scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover/btn:bg-slate-200 dark:group-hover/btn:bg-slate-700"
                            )}>
                                <m.icon size={22} />
                            </div>
                            
                            <div>
                                <p className={cn(
                                    "font-black text-sm transition-colors",
                                    method === m.id ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                                )}>{m.label}</p>
                                <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider opacity-60">{m.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Transfer Info Section */}
                <AnimatePresence>
                    {method === 'transfer' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] p-8 space-y-6">
                                <div className="flex items-center gap-3 border-b border-blue-500/10 pb-4">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <Info size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Datos Bancarios</p>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Realiza tu SPEI con estos datos</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { 
                                            label: 'Beneficiario', 
                                            value: creditor?.financial_profile?.beneficiario || creditor?.nombre || 'Pendiente de configurar', 
                                            id: 'beneficiary',
                                            icon: User
                                        },
                                        { 
                                            label: 'Institución Financiera', 
                                            value: creditor?.financial_profile?.entidad_financiera || 'No especificada', 
                                            id: 'bank',
                                            icon: Send
                                        },
                                        { 
                                            label: 'Número de CLABE', 
                                            value: creditor?.financial_profile?.clabe || 'N/A', 
                                            id: 'clabe',
                                            icon: CardIcon
                                        }
                                    ].map((item) => (
                                        <div key={item.id} className="group/item relative">
                                            <div className="flex items-center justify-between p-6 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-blue-500/10 group-hover/item:border-blue-500/30 transition-all shadow-sm backdrop-blur-md">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                        <item.icon size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">{item.label}</p>
                                                        <p className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-tight">{item.value}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        if (item.value !== 'N/A' && item.value !== 'No especificada' && item.value !== 'Pendiente de configurar') {
                                                            copyToClipboard(item.value, item.id);
                                                        } else {
                                                            toast.error("Dato no disponible para copiar");
                                                        }
                                                    }}
                                                    className={cn(
                                                        "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95",
                                                        copiedId === item.id 
                                                            ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                                                            : "bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-500"
                                                    )}
                                                >
                                                    {copiedId === item.id ? '¡Copiado!' : 'Copiar'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Confirm Button */}
            <button 
                onClick={handleSettle}
                disabled={isProcessing || parseFloat(amount) <= 0}
                className="w-full bg-[var(--primary)] text-white font-black uppercase tracking-[0.25em] text-xs py-7 rounded-3xl shadow-2xl shadow-[var(--primary)]/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-30 disabled:grayscale overflow-hidden relative group"
            >
                 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {isProcessing ? (
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Procesando...</span>
                    </div>
                ) : (
                    <span>Confirmar Liquidación</span>
                )}
            </button>
        </div>
    );
};
