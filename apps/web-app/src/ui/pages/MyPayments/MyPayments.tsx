import {
    Lock,
    Edit2,
    Trash2,
    PlusCircle,
    ShoppingBag,
    Film,
    ChevronDown,
    CreditCard
} from 'lucide-react';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext } from 'react-router-dom';

export const MyPayments = () => {
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Header Adaptable */}
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

                <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-12">
                    {/* Metodos Guardados */}
                    <section>
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Métodos Guardados</h2>
                            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-70">2 tarjetas activas</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Card 1 (Principal - Dinámica con el tema) */}
                            <div className="group relative h-56 rounded-3xl p-6 flex flex-col justify-between overflow-hidden border transition-all duration-300 bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/60 border-[var(--primary)] shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                                
                                <div className="relative z-10 flex justify-between items-start">
                                    {/* Chip de la tarjeta */}
                                    <div className="w-12 h-9 rounded-lg bg-yellow-200/20 border border-yellow-200/40 relative overflow-hidden backdrop-blur-sm shadow-inner">
                                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-yellow-200/30"></div>
                                        <div className="absolute top-0 left-1/2 h-full w-[1px] bg-yellow-200/30"></div>
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
                                    <div className="flex items-center gap-4 text-white font-mono text-xl tracking-[0.3em] drop-shadow-lg">
                                        <span>****</span> <span>****</span> <span>****</span> <span>4242</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-white/70 uppercase font-black tracking-widest">Titular</p>
                                            <p className="text-sm text-white font-black tracking-widest uppercase">Luis Gonzalez</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-[10px] font-black uppercase bg-white/20 text-white px-2 py-1 rounded-md backdrop-blur-md border border-white/20">Predeterminada</span>
                                            <span className="font-black text-white text-2xl italic tracking-tighter">VISA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 (Secundaria) */}
                            <div className="group relative h-56 rounded-3xl p-6 flex flex-col justify-between overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md transition-all duration-300 hover:border-[var(--primary)] shadow-sm">
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="w-12 h-9 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)] relative overflow-hidden">
                                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-400/20"></div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-2 rounded-xl bg-[var(--bg-body)] hover:text-[var(--primary)] text-[var(--text-secondary)] transition-colors border border-[var(--border-color)]">
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-4 text-[var(--text-primary)] font-mono text-xl tracking-[0.3em]">
                                        <span>****</span> <span>****</span> <span>****</span> <span>8888</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest">Titular</p>
                                            <p className="text-sm text-[var(--text-primary)] font-black tracking-widest uppercase">Luis Gonzalez</p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-multiply dark:mix-blend-screen shadow-sm"></div>
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/80 -ml-4 mix-blend-multiply dark:mix-blend-screen shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Agregar Nuevo Metodo Adaptable */}
                    <section>
                        <button className="w-full py-5 border-2 border-dashed border-[var(--primary)]/30 rounded-2xl flex items-center justify-center gap-3 text-[var(--primary)] hover:bg-[var(--primary)]/5 hover:border-[var(--primary)] transition-all group">
                            <PlusCircle className="group-hover:rotate-90 transition-transform duration-500" size={24} />
                            <span className="font-black tracking-[0.2em] uppercase text-xs">AGREGAR NUEVO MÉTODO</span>
                        </button>
                    </section>

                    {/* Pagos Rapidos */}
                    <section>
                        <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6">Pagos Rápidos</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button className="h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center gap-2 hover:bg-[var(--hover-bg)] hover:border-[var(--primary)]/50 transition-all shadow-sm">
                                <span className="text-[var(--text-primary)] text-xl font-bold"> Pay</span>
                            </button>
                            <button className="h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center gap-2 hover:bg-[var(--hover-bg)] hover:border-[var(--primary)]/50 transition-all shadow-sm">
                                <span className="font-bold text-[var(--text-primary)]">G Pay</span>
                            </button>
                            <button className="h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center gap-2 hover:bg-[var(--hover-bg)] hover:border-[var(--primary)]/50 transition-all shadow-sm">
                                <span className="font-black italic text-xl text-[#009cde] dark:text-[#40a9ff] tracking-tighter">PayPal</span>
                            </button>
                        </div>
                    </section>

                    {/* Historial con Acentos del Tema */}
                    <section className="pb-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Historial de Pagos</h2>
                            <button className="text-[10px] font-black text-[var(--primary)] hover:underline tracking-widest uppercase transition-colors">Ver todos</button>
                        </div>
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[var(--border-color)] text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] bg-[var(--hover-bg)]/50">
                                            <th className="px-6 py-5">Transacción</th>
                                            <th className="px-6 py-5">Fecha</th>
                                            <th className="px-6 py-5">Estado</th>
                                            <th className="px-6 py-5 text-right">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)] text-sm">
                                        <tr className="group hover:bg-[var(--hover-bg)] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-body)] flex items-center justify-center border border-[var(--border-color)] group-hover:border-[var(--primary)] transition-colors">
                                                        <CreditCard className="text-[var(--primary)]" size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-[var(--text-primary)] uppercase tracking-tight">Pago a Ana</p>
                                                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Comida Grupal</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)]">Hoy, 12:30 PM</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Completado
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">-$320.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};