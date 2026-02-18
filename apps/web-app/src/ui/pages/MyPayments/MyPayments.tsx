import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Lock,
    Edit2,
    Trash2,
    PlusCircle,
    ShoppingBag,
    Film,
    ChevronDown,
    CreditCard
} from 'lucide-react';

export const MyPayments = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-900 font-display text-slate-200 min-h-screen flex flex-col antialiased selection:bg-blue-500 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/30">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium z-10"
                    >
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                        <span>Volver</span>
                    </button>
                    <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 text-white text-lg font-bold tracking-widest uppercase">
                        MIS PAGOS
                    </h1>
                    <div className="flex items-center gap-2 text-emerald-400/90 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <Lock size={14} />
                        <span className="text-xs font-semibold tracking-wide">Pagos Seguros</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 space-y-12">
                {/* Saved Methods */}
                <section>
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Métodos Guardados</h2>
                        <span className="text-xs text-slate-500">2 tarjetas activas</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card 1 (Visa) */}
                        <div className="group relative h-56 rounded-2xl p-6 flex flex-col justify-between overflow-hidden border transition-all duration-300 bg-gradient-to-br from-blue-600/60 to-indigo-600/60 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] backdrop-blur-md">
                            <div className="absolute inset-0 bg-slate-900/10 mix-blend-overlay"></div>

                            <div className="relative z-10 flex justify-between items-start">
                                {/* Chip */}
                                <div className="w-12 h-9 rounded bg-yellow-200/20 border border-yellow-200/40 relative overflow-hidden backdrop-blur-sm shadow-[0_0_10px_rgba(253,224,71,0.3)]">
                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-yellow-200/30"></div>
                                    <div className="absolute top-0 left-1/2 h-full w-[1px] bg-yellow-200/30"></div>
                                    <div className="absolute top-2 left-2 right-2 bottom-2 border border-yellow-200/20 rounded-sm"></div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-200 text-white transition-colors backdrop-blur-sm">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4 text-white font-mono text-xl tracking-widest shadow-black drop-shadow-md">
                                    <span>****</span>
                                    <span>****</span>
                                    <span>****</span>
                                    <span>4242</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold opacity-80">Titular</p>
                                        <p className="text-sm text-white font-medium tracking-wide uppercase">Luis Gonzalez</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-xs bg-blue-500/30 text-blue-50 border border-blue-400/30 px-2 py-0.5 rounded backdrop-blur-md">Predeterminada</span>
                                        <span className="font-bold text-white text-2xl italic tracking-tighter">VISA</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 (Mastercard) */}
                        <div className="group relative h-56 rounded-2xl p-6 flex flex-col justify-between overflow-hidden border border-slate-700 bg-slate-800/60 backdrop-blur-md transition-all duration-300 hover:border-slate-500 hover:bg-slate-800/80">
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="w-12 h-9 rounded bg-slate-400/20 border border-slate-400/30 relative overflow-hidden backdrop-blur-sm">
                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-400/20"></div>
                                    <div className="absolute top-0 left-1/2 h-full w-[1px] bg-slate-400/20"></div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-2 rounded-full bg-slate-700 hover:bg-red-900/40 hover:text-red-400 text-slate-300 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4 text-slate-300 font-mono text-xl tracking-widest">
                                    <span>****</span>
                                    <span>****</span>
                                    <span>****</span>
                                    <span>8888</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Titular</p>
                                        <p className="text-sm text-slate-300 font-medium tracking-wide uppercase">Luis Gonzalez</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-screen"></div>
                                        <div className="w-8 h-8 rounded-full bg-yellow-500/80 -ml-4 mix-blend-screen"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Add New Method */}
                <section>
                    <button className="w-full py-4 border-2 border-dashed border-sky-500/30 rounded-xl flex items-center justify-center gap-3 text-sky-400 hover:bg-sky-500/5 hover:border-sky-500/50 hover:text-sky-300 transition-all duration-300 group">
                        <PlusCircle className="group-hover:scale-110 transition-transform" size={24} />
                        <span className="font-semibold tracking-wide">AGREGAR NUEVO MÉTODO</span>
                    </button>
                </section>

                {/* Quick Pay */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Pagos Rápidos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button className="h-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center gap-2 hover:bg-black/60 hover:border-white/20 transition-all backdrop-blur-md">
                            <span className="text-white text-xl font-bold font-display"> Pay</span>
                        </button>
                        <button className="h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md">
                            <div className="flex items-center gap-1 font-display font-medium text-lg text-white">
                                <span className="font-bold">G</span> Pay
                            </div>
                        </button>
                        <button className="h-14 rounded-xl bg-[#003087]/20 border border-[#003087]/40 flex items-center justify-center gap-2 hover:bg-[#003087]/30 hover:border-[#003087]/60 transition-all backdrop-blur-md">
                            <span className="font-bold italic text-xl text-[#009cde]">PayPal</span>
                        </button>
                    </div>
                </section>

                {/* Payment History */}
                <section className="pb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Historial de Pagos</h2>
                        <button className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors">Ver todos</button>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700/50 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-800/30">
                                        <th className="px-6 py-4">Transacción</th>
                                        <th className="px-6 py-4">Fecha</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4 text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30 text-sm">
                                    {/* Item 1 */}
                                    <tr className="group hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 group-hover:border-blue-500/50 transition-colors">
                                                    <CreditCard className="text-slate-400" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-200">Pago a Ana</p>
                                                    <p className="text-xs text-slate-500">Comida Grupal</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">Hoy, 12:30 PM</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_8px_rgba(74,222,128,0.1)]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                                Completado
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-white group-hover:text-blue-400 transition-colors">-$320.00</td>
                                    </tr>

                                    {/* Item 2 */}
                                    <tr className="group hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 text-slate-400 group-hover:border-blue-500/50 transition-colors">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-200">Amazon MX</p>
                                                    <p className="text-xs text-slate-500">Electrónicos</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">Ayer, 4:15 PM</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                Completado
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-white group-hover:text-blue-400 transition-colors">-$1,250.00</td>
                                    </tr>

                                    {/* Item 3 */}
                                    <tr className="group hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-900/40 flex items-center justify-center border border-indigo-500/30 text-indigo-400 group-hover:border-blue-500/50 transition-colors">
                                                    <Film size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-200">Netflix</p>
                                                    <p className="text-xs text-slate-500">Suscripción Mensual</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">14 Oct, 9:00 AM</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                Completado
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-white group-hover:text-blue-400 transition-colors">-$199.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-800/30 px-6 py-3 border-t border-slate-700/50 flex justify-center">
                            <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                                Cargar más transacciones <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
