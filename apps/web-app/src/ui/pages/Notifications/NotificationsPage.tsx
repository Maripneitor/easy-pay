import {
    CheckCircle,
    RotateCw,
    Cake,
    Plane,
} from 'lucide-react';
import { PageHeader } from '@ui/components/PageHeader';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { cn } from '../../../infrastructure/utils';

export const NotificationsPage = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Header Adaptable */}
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="MI HISTORIAL"
                    subtitle="Actividad reciente y pasada"
                    onBack={() => navigate(-1)}
                    showNotification={false}
                />

                <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-12">
                    {/* Filtros con Color del Tema */}
                    <section className="flex flex-wrap gap-4 items-center">
                        <button className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] transition-all">
                            Últimos 3 meses
                        </button>
                        {['Este Año', '2023', 'Personalizado'].map(filter => (
                            <button key={filter} className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all">
                                {filter}
                            </button>
                        ))}
                    </section>

                    {/* Grupos Archivados */}
                    <section>
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Grupos Archivados</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1: Cumpleaños */}
                            <div className="group relative rounded-3xl p-6 flex flex-col justify-between overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl transition-all duration-300 hover:border-[var(--primary)] hover:shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-[var(--primary)]/10 rounded-2xl border border-[var(--primary)]/20 text-[var(--primary)]">
                                            <Cake size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-[var(--text-primary)] font-black text-lg uppercase tracking-tight">Cumpleaños Pedro</h3>
                                            <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase opacity-60 mt-0.5">Finalizado el 12 Ago</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        <CheckCircle size={14} />
                                        Pagado
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm border-t border-[var(--border-color)] pt-4">
                                        <span className="text-[var(--text-secondary)] font-medium">Total recolectado</span>
                                        <span className="text-[var(--text-primary)] font-mono font-black">$4,250.00</span>
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <button className="flex-1 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all">
                                            Ver Detalle
                                        </button>
                                        <button className="flex-1 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all flex items-center justify-center gap-2">
                                            <RotateCw size={14} />
                                            Reactivar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Viaje */}
                            <div className="group relative rounded-3xl p-6 flex flex-col justify-between overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl transition-all duration-300 hover:border-[var(--primary)] hover:shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-[var(--primary)]/10 rounded-2xl border border-[var(--primary)]/20 text-[var(--primary)]">
                                            <Plane size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-[var(--text-primary)] font-black text-lg uppercase tracking-tight">Viaje Acapulco</h3>
                                            <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase opacity-60 mt-0.5">Finalizado el 05 Jul</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        <CheckCircle size={14} />
                                        Pagado
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm border-t border-[var(--border-color)] pt-4">
                                        <span className="text-[var(--text-secondary)] font-medium">Total recolectado</span>
                                        <span className="text-[var(--text-primary)] font-mono font-black">$12,800.00</span>
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <button className="flex-1 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all">
                                            Ver Detalle
                                        </button>
                                        <button className="flex-1 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all flex items-center justify-center gap-2">
                                            <RotateCw size={14} />
                                            Reactivar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Gráfica de Gastos Adaptable */}
                    <section>
                        <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6">Gráfica de Gastos</h2>
                        <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-xl">
                            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-12 px-12 opacity-5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full h-px bg-[var(--text-primary)]"></div>
                                ))}
                            </div>
                            <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-2 md:px-6 relative z-10">
                                <div className="absolute left-0 top-6 bottom-12 flex flex-col justify-between text-[10px] font-mono font-bold text-[var(--text-secondary)]">
                                    {['$5k', '$4k', '$3k', '$2k', '$1k', '$0'].map(val => (
                                        <span key={val}>{val}</span>
                                    ))}
                                </div>
                                <div className="ml-8 flex-1 flex items-end justify-around h-full pb-6 pt-6 border-l border-[var(--border-color)] border-b border-[var(--border-color)]">
                                    {[
                                        { month: 'ENE', height: '45%' },
                                        { month: 'FEB', height: '65%' },
                                        { month: 'MAR', height: '30%' },
                                        { month: 'ABR', height: '85%' },
                                        { month: 'MAY', height: '55%' },
                                        { month: 'JUN', height: '72%' }
                                    ].map((bar, i) => (
                                        <div key={i} className="group flex flex-col items-center gap-2 w-1/6 h-full justify-end cursor-pointer">
                                            {/* Bar con Gradiente Adaptable: de Primary a Primary oscuro */}
                                            <div
                                                className="w-full max-w-[24px] md:max-w-[40px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/60 rounded-t-lg relative transition-all duration-500 hover:scale-x-110 shadow-[0_-4px_15px_rgba(var(--primary-rgb),0.3)]"
                                                style={{ height: bar.height }}
                                            ></div>
                                            <span className="text-[10px] font-black font-mono text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">
                                                {bar.month}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};