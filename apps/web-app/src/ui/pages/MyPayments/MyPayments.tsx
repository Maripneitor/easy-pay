import { useState } from 'react';
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
import { useMyPayments } from './useMyPayments';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { AddCardModal } from './components/AddCardModal';

export const MyPayments = () => {
    const { toggleSidebar, isSidebarOpen } = useOutletContext<{ toggleSidebar: () => void, isSidebarOpen: boolean }>();
    const { cards, transactions } = useMyPayments();
    
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
                        
                        {cards.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cards.map((card) => (
                                    <div key={card.id} className={`group relative h-56 rounded-3xl p-6 flex flex-col justify-between overflow-hidden border transition-all duration-300 ${card.isDefault ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/60 border-[var(--primary)] shadow-xl shadow-[var(--primary)]/20' : 'border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md'} hover:scale-[1.02]`}>
                                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                                        
                                        <div className="relative z-10 flex justify-between items-start">
                                            <div className={`w-12 h-9 rounded-lg ${card.isDefault ? 'bg-yellow-200/20 border border-yellow-200/40' : 'bg-[var(--bg-body)] border border-[var(--border-color)]'} relative overflow-hidden backdrop-blur-sm`}>
                                                <div className={`absolute top-1/2 left-0 w-full h-[1px] ${card.isDefault ? 'bg-yellow-200/30' : 'bg-slate-400/20'}`}></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-2 rounded-xl bg-white/10 hover:bg-red-500/40 text-white transition-all backdrop-blur-sm border border-white/10">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative z-10 space-y-6">
                                            <div className={`flex items-center gap-4 ${card.isDefault ? 'text-white' : 'text-[var(--text-primary)]'} font-mono text-xl tracking-[0.3em] drop-shadow-lg`}>
                                                <span>****</span> <span>****</span> <span>****</span> <span>{card.lastFour}</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <p className={`text-[10px] ${card.isDefault ? 'text-white/70' : 'text-[var(--text-secondary)]'} uppercase font-black tracking-widest`}>Titular</p>
                                                    <p className={`text-sm ${card.isDefault ? 'text-white' : 'text-[var(--text-primary)]'} font-black tracking-widest uppercase`}>{card.holder}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {card.isDefault && <span className="text-[10px] font-black uppercase bg-white/20 text-white px-2 py-1 rounded-md backdrop-blur-md border border-white/20">Predeterminada</span>}
                                                    <span className={`font-black ${card.isDefault ? 'text-white' : 'text-[var(--text-primary)]'} text-2xl italic tracking-tighter`}>{card.brand}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                        <button onClick={() => setIsAddCardOpen(true)} className="w-full py-6 border-2 border-dashed border-[var(--primary)]/20 rounded-[2rem] flex items-center justify-center gap-3 text-[var(--primary)] hover:bg-[var(--primary)]/5 hover:border-[var(--primary)] transition-all group">
                            <PlusCircle className="group-hover:rotate-90 transition-transform duration-500" size={24} />
                            <span className="font-black tracking-[0.3em] uppercase text-[10px]">AGREGAR NUEVO MÉTODO DE PAGO</span>
                        </button>
                    </section>

                    {/* Historial */}
                    <section className="pb-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Historial de Pagos</h2>
                            <button className="text-[10px] font-black text-[var(--primary)] hover:underline tracking-widest uppercase transition-colors">Ver todos</button>
                        </div>
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] overflow-hidden shadow-sm">
                            {transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[var(--border-color)] text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] bg-[var(--hover-bg)]/50">
                                                <th className="px-8 py-5">Transacción</th>
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
            />
        </div>
    );
};