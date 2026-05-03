import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock,
    Edit2,
    Trash2,
    PlusCircle,
    ShoppingBag,
    Film,
    CreditCard
} from 'lucide-react';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext } from 'react-router-dom';
import { cn } from '../../../infrastructure/utils';
import { useMyPayments } from './useMyPayments';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { AddCardModal } from './components/AddCardModal';

import { TwoFactorModal } from '../../components/Security/TwoFactorModal';

export const MyPayments = () => {
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const { 
        cards, 
        transactions, 
        loading, 
        refreshCards, 
        handleDeleteCard,
        confirmDeleteCard,
        is2FAModalOpen,
        setIs2FAModalOpen,
        userId
    } = useMyPayments();
    
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="MIS PAGOS"
                    rightSlot={
                        <div className="flex items-center gap-2 text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1.5 rounded-full border border-[var(--primary)]/20 shadow-sm">
                            <Lock size={14} />
                            <span className="text-xs font-bold tracking-wide hidden sm:inline uppercase">Pagos Seguros</span>
                        </div>
                    }
                />

                <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-12">
                    {/* Metodos Guardados */}
                    <section>
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Métodos Guardados</h2>
                            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-70">{cards.length} tarjetas activas</span>
                        </div>
                        
                        {loading ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1,2].map(i => (
                                    <div key={i} className="h-56 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] animate-pulse" />
                                ))}
                             </div>
                        ) : cards.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cards.map((card) => {
                                    // Mapeo manual de clases de tailwind a gradientes CSS reales para evitar el "quemado" por CSS global
                                    let cssGradient = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
                                    const styleClass = card.bankStyle || '';
                                    
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
                                        <motion.div 
                                            key={card.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ scale: 1.02, translateY: -5 }}
                                            className="group payment-card relative h-60 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer"
                                            style={{ 
                                                background: `${cssGradient} !important`,
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}
                                        >
                                            {/* Texture & Gloss (Reduced to avoid burning) */}
                                            <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')", zIndex: 1 }} />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30" style={{ zIndex: 1 }} />
                                            
                                            {/* Animated Shimmer */}
                                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg]" style={{ zIndex: 1 }} />

                                        {/* Card Content Container */}
                                        <div className="relative z-10 h-full flex flex-col justify-between text-white">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col gap-2">
                                                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 drop-shadow-sm">
                                                        {card.bankName || 'GLOBAL PLATINUM'}
                                                    </div>
                                                    {/* Chip */}
                                                    <div className="w-12 h-9 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 rounded-lg border border-white/30 flex items-center justify-center p-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
                                                        <div className="w-full h-full bg-black/10 rounded-sm grid grid-cols-4 gap-0.5 opacity-50">
                                                            {[...Array(8)].map((_, i) => <div key={i} className="border-r border-b border-white/10"></div>)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteCard(card.id);
                                                        }}
                                                        className="p-3 bg-white/10 hover:bg-rose-500 border border-white/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md"
                                                        title="Eliminar Tarjeta"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="text-2xl font-mono tracking-[0.25em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white/95 filter contrast-125">
                                                    •••• •••• •••• {card.lastFour}
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50">Card Holder</p>
                                                        <p className="text-sm font-black uppercase tracking-widest truncate max-w-[200px] text-white/90 drop-shadow-sm">{card.holder}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        {card.isDefault && (
                                                            <span className="mb-2 text-[8px] font-black uppercase bg-white/20 text-white px-2 py-0.5 rounded border border-white/30 backdrop-blur-sm">
                                                                Default
                                                            </span>
                                                        )}
                                                        <div className="h-10 flex items-center">
                                                            {card.brand?.toUpperCase() === 'VISA' && <span className="text-3xl font-black italic tracking-tighter text-white opacity-90 drop-shadow-lg">VISA</span>}
                                                            {card.brand?.toUpperCase() === 'MASTERCARD' && (
                                                                <div className="flex -space-x-3">
                                                                    <div className="w-8 h-8 rounded-full bg-rose-500/80 mix-blend-screen" />
                                                                    <div className="w-8 h-8 rounded-full bg-amber-500/80 mix-blend-screen" />
                                                                </div>
                                                            )}
                                                            {card.brand?.toUpperCase() === 'AMEX' && <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded text-xs font-black italic">AMEX</div>}
                                                            {!['VISA', 'MASTERCARD', 'AMEX'].includes(card.brand?.toUpperCase()) && <span className="text-lg font-black uppercase tracking-widest text-white/70">{card.brand}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 shadow-sm border-dashed">
                                <div className="w-20 h-20 rounded-full bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] mb-2">
                                    <CreditCard size={36} className="opacity-50" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-[var(--text-primary)]">No hay tarjetas</h3>
                                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-[0.2em]">Agrega un método de pago para comenzar</p>
                                </div>
                                <button 
                                    onClick={() => setIsAddCardOpen(true)}
                                    className="mt-4 px-8 py-3 bg-[var(--primary)] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-105 transition-all"
                                >
                                    Agregar ahora
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Agregar Nuevo Metodo Adaptable */}
                    <section>
                        <motion.button 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setIsAddCardOpen(true)} 
                            className="w-full py-8 border-2 border-dashed border-[var(--primary)]/30 rounded-[2.5rem] bg-[var(--primary)]/5 flex flex-col items-center justify-center gap-3 text-[var(--primary)] hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] transition-all group shadow-sm"
                        >
                            <div className="p-4 bg-white dark:bg-white/10 rounded-full shadow-lg group-hover:rotate-90 transition-transform duration-500">
                                <PlusCircle size={32} />
                            </div>
                            <span className="font-black tracking-[0.4em] uppercase text-[11px]">AGREGAR NUEVO MÉTODO DE PAGO</span>
                        </motion.button>
                    </section>

                    {/* Historial */}
                    <section className="pb-10">
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Historial de Pagos</h2>
                            <button className="text-[10px] font-black text-[var(--primary)] hover:underline tracking-widest uppercase transition-colors">Ver todos</button>
                        </div>
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] overflow-hidden shadow-xl">
                            {transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[var(--border-color)] text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] bg-black/5">
                                                <th className="px-10 py-6">Transacción</th>
                                                <th className="px-6 py-5">Fecha</th>
                                                <th className="px-6 py-5">Estado</th>
                                                <th className="px-8 py-5 text-right">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border-color)] text-sm">
                                            {transactions.map((tx) => (
                                                <tr 
                                                    key={tx.id} 
                                                    onClick={() => setSelectedTransaction(tx)}
                                                    className="group hover:bg-[var(--hover-bg)] transition-all cursor-pointer"
                                                >
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-body)] flex items-center justify-center border border-[var(--border-color)] group-hover:border-[var(--primary)]/30 transition-all shadow-sm">
                                                                {tx.avatarUrl ? (
                                                                    <img src={tx.avatarUrl} className="w-full h-full rounded-2xl" alt="" />
                                                                ) : tx.icon === 'shopping-bag' ? (
                                                                    <ShoppingBag className="text-[var(--primary)]" size={20} />
                                                                ) : tx.icon === 'film' ? (
                                                                    <Film className="text-[var(--primary)]" size={20} />
                                                                ) : (
                                                                    <CreditCard className="text-[var(--primary)]" size={20} />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-[var(--text-primary)] uppercase tracking-tight">{tx.description}</p>
                                                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60">{tx.category}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-xs font-bold text-[var(--text-secondary)] uppercase">{tx.date}</td>
                                                    <td className="px-6 py-5">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${tx.status === 'completed' || tx.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'completed' || tx.status === 'approved' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
                                                            {tx.status === 'completed' || tx.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right font-black text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors font-mono text-lg">
                                                        {tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-20 text-center flex flex-col items-center justify-center opacity-40">
                                    <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                                        <ShoppingBag size={32} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No hay transacciones recientes</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>

            <TransactionDetailModal 
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                transaction={selectedTransaction}
            />

            <AddCardModal 
                isOpen={isAddCardOpen}
                onClose={() => setIsAddCardOpen(false)}
                onSuccess={refreshCards}
                currentCardsCount={cards.length}
            />

            <TwoFactorModal
                isOpen={is2FAModalOpen}
                onClose={() => setIs2FAModalOpen(false)}
                onVerified={confirmDeleteCard}
                userId={userId || ''}
                actionTitle="Eliminar Tarjeta"
                actionDescription="Estás a punto de eliminar un método de pago. Por seguridad, verifica tu identidad."
            />
        </div>
    );
};