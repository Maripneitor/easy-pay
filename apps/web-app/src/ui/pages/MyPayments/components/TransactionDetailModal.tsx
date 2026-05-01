import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    Copy, 
    Printer, 
    HelpCircle, 
    AlertCircle, 
    CheckCircle2, 
    ArrowRight,
    Edit3,
    Calendar,
    Hash,
    ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: any;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ isOpen, onClose, transaction }) => {
    if (!transaction) return null;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado`);
    };

    const handlePrint = () => {
        window.print();
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
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Mercado Pago Style Header */}
                        <div className="p-8 pb-4 flex flex-col items-center text-center">
                            <button 
                                onClick={onClose}
                                className="absolute right-6 top-6 p-2 hover:bg-black/5 rounded-full transition-all"
                            >
                                <X size={24} />
                            </button>
                            
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-inner">
                                <CheckCircle2 size={48} />
                            </div>
                            
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-1">Operación Exitosa</p>
                            <h2 className="text-5xl font-black text-[var(--text-primary)] tracking-tighter mb-1 font-mono">
                                ${Number(transaction.amount || transaction.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </h2>
                            <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                                {transaction.description || transaction.nombre}
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6 custom-scrollbar">
                            {/* Status and Time */}
                            <div className="flex justify-between items-center py-4 border-b border-[var(--border-color)]">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-[10px] font-black uppercase text-slate-400">Fecha y Hora</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-[var(--text-primary)]">
                                        {transaction.date || new Date().toLocaleDateString('es-MX')}
                                    </p>
                                    <p className="text-[9px] font-bold text-emerald-500 uppercase">Aprobado</p>
                                </div>
                            </div>

                            {/* Origin & Destination Block */}
                            <div className="bg-black/5 rounded-[2rem] p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Origen</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                                            <p className="text-xs font-bold">Tarjeta Visa **** 4582</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-300" />
                                    <div className="text-right space-y-1">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Destino</p>
                                        <p className="text-xs font-bold">Cuenta Easy-Pay</p>
                                    </div>
                                </div>
                            </div>

                            {/* Identifiers Block */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center group">
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">N.° de operación</p>
                                        <p className="text-sm font-mono font-bold text-[var(--text-primary)]">{transaction.id?.slice(0, 12).toUpperCase() || 'OP-74859623'}</p>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(transaction.id || 'OP-74859623', 'N.° de operación')}
                                        className="p-2 text-slate-400 hover:text-[var(--primary)] transition-all"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center group">
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Clave de rastreo</p>
                                        <p className="text-sm font-mono font-bold text-[var(--text-primary)]">EP-TRK-{Math.floor(Math.random() * 1000000)}</p>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard('EP-TRK-7485962', 'Clave de rastreo')}
                                        className="p-2 text-slate-400 hover:text-[var(--primary)] transition-all"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center group">
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Referencia</p>
                                        <p className="text-sm font-bold text-[var(--text-primary)]">{transaction.category || 'Otros'}</p>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(transaction.category || 'Otros', 'Referencia')}
                                        className="p-2 text-slate-400 hover:text-[var(--primary)] transition-all"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Category Section */}
                            <div className="py-6 border-t border-[var(--border-color)] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                                        <Hash size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Categoría</p>
                                        <p className="text-sm font-black uppercase tracking-tight">{transaction.category || 'Sin categoría'}</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-all text-[var(--text-secondary)]">
                                    <Edit3 size={12} /> Editar
                                </button>
                            </div>

                            {/* Safety Badge */}
                            <div className="flex items-center justify-center gap-2 py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Transacción protegida por Easy-Pay Shield</span>
                            </div>

                            {/* Actions Block */}
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <button 
                                    onClick={handlePrint}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-slate-500 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                                        <Printer size={20} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Imprimir</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-slate-500 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                                        <HelpCircle size={20} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Ayuda</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-slate-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                        <AlertCircle size={20} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Denunciar</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
