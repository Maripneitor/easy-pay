import {
    CheckCircle,
    RotateCw,
    Cake,
    Plane,
} from 'lucide-react';
import { PageHeader } from '@ui/components/PageHeader';
import { useNavigate, useOutletContext } from 'react-router-dom';

export const NotificationsPage = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-alice-blue dark:bg-slate-900 font-display text-slate-900 dark:text-slate-200 antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Header */}
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="MI HISTORIAL"
                    subtitle="Actividad reciente y pasada"
                    onBack={() => navigate(-1)}
                    showNotification={false}
                />

                <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-12">
                    {/* Filters */}
                    <section className="flex flex-wrap gap-4 items-center">
                        <button className="px-5 py-2 rounded-full text-xs font-semibold tracking-wide bg-blue-500/20 text-blue-600 dark:text-blue-500 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all">
                            Últimos 3 meses
                        </button>
                        {['Este Año', '2023', 'Personalizado'].map(filter => (
                            <button key={filter} className="px-5 py-2 rounded-full text-xs font-medium tracking-wide bg-white dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all">
                                {filter}
                            </button>
                        ))}
                    </section>

                    {/* Archived Groups */}
                    <section>
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grupos Archivados</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1 */}
                            <div className="group relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 backdrop-blur-xl transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl border border-purple-500/20 dark:border-purple-500/30 text-purple-600 dark:text-purple-300">
                                            <Cake size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-900 dark:text-white font-semibold text-lg">Cumpleaños Pedro</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Finalizado el 12 Ago</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle size={14} />
                                        Pagado
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-700/50 pt-4">
                                        <span className="text-slate-500 dark:text-slate-400">Total recolectado</span>
                                        <span className="text-slate-900 dark:text-white font-mono font-medium">$4,250.00</span>
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <button className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                                            Ver Detalle
                                        </button>
                                        <button className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1">
                                            <RotateCw size={14} />
                                            Reactivar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="group relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 backdrop-blur-xl transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-xl border border-cyan-500/20 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-300">
                                            <Plane size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-900 dark:text-white font-semibold text-lg">Viaje Acapulco</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Finalizado el 05 Jul</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle size={14} />
                                        Pagado
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-700/50 pt-4">
                                        <span className="text-slate-500 dark:text-slate-400">Total recolectado</span>
                                        <span className="text-slate-900 dark:text-white font-mono font-medium">$12,800.00</span>
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <button className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                                            Ver Detalle
                                        </button>
                                        <button className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1">
                                            <RotateCw size={14} />
                                            Reactivar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Expenses Chart */}
                    <section>
                        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Gráfica de Gastos</h2>
                        <div className="w-full bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden transition-colors duration-300">
                            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-12 px-12 opacity-10">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full h-px bg-slate-400 dark:bg-slate-200"></div>
                                ))}
                            </div>
                            <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-2 md:px-6 relative z-10">
                                <div className="absolute left-0 top-6 bottom-12 flex flex-col justify-between text-[10px] font-mono text-slate-500">
                                    {['$5k', '$4k', '$3k', '$2k', '$1k', '$0'].map(val => (
                                        <span key={val}>{val}</span>
                                    ))}
                                </div>
                                <div className="ml-8 flex-1 flex items-end justify-around h-full pb-6 pt-6 border-l border-slate-200 dark:border-slate-700/50 border-b border-slate-200 dark:border-slate-700/50">
                                    {[
                                        { month: 'ENE', height: '45%' },
                                        { month: 'FEB', height: '65%' },
                                        { month: 'MAR', height: '30%' },
                                        { month: 'ABR', height: '85%' },
                                        { month: 'MAY', height: '55%' },
                                        { month: 'JUN', height: '72%' }
                                    ].map((bar, i) => (
                                        <div key={i} className="group flex flex-col items-center gap-2 w-1/6 h-full justify-end cursor-pointer">
                                            <div
                                                className="w-full max-w-[24px] md:max-w-[40px] bg-gradient-to-t from-violet-600 to-cyan-400 rounded-t-sm relative transition-all duration-300 hover:brightness-110 shadow-[0_-4px_15px_rgba(34,211,238,0.3)]"
                                                style={{ height: bar.height }}
                                            ></div>
                                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
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
