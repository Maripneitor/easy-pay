import {
    Share2,
    Settings,
    Plus,
    Receipt,
    PieChart,
    CheckCircle,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '../../../infrastructure/utils';
import { useGroupDetail } from './useGroupDetail';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext } from 'react-router-dom';

export const GroupDetail = () => {
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const {
        activeTab,
        setActiveTab,
        navigate,
        groupName,
        totalSpent,
        userShare,
        userOwed,
        activities,
        balances
    } = useGroupDetail();

    return (
        /* CAMBIO AQUÍ: Quitamos bg-slate-900 y ponemos var(--bg-body) para que sea adaptable */
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Header */}
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title={groupName || "Detalle del Grupo"}
                    onBack={() => navigate(-1)}
                    rightSlot={
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50">
                                <Share2 size={20} />
                            </button>
                            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50">
                                <Settings size={20} />
                            </button>
                        </div>
                    }
                />

                <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
                    {/* Stats Cards con Borde LED Brillante */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 relative overflow-hidden shadow-sm border-t-4 border-t-[var(--primary)] shadow-[0_-5px_15px_-5px_var(--border-color)]">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Receipt size={64} className="text-slate-900 dark:text-white" />
                            </div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Grupo</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalSpent.toFixed(2)}</p>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                                    <ArrowUpRight size={14} /> 12%
                                </span>
                                vs mes anterior
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 relative overflow-hidden shadow-sm border-t-4 border-t-[var(--primary)] shadow-[0_-5px_15px_-5px_var(--border-color)]">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <PieChart size={64} className="text-slate-900 dark:text-white" />
                            </div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Tu Parte</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">${userShare.toFixed(2)}</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 relative overflow-hidden shadow-sm border-t-4 border-t-emerald-500 shadow-[0_-5px_15px_-5px_rgba(16,185,129,0.4)]">
                            <div className="relative z-10">
                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                                    <CheckCircle size={14} />
                                    Te deben
                                </p>
                                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">${userOwed.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-700/50">
                        {['activity', 'balances', 'settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={cn(
                                    "px-6 py-3 text-sm font-medium border-b-2 transition-colors relative",
                                    activeTab === tab
                                        ? "border-[var(--primary)] text-[var(--primary)]"
                                        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                )}
                            >
                                {tab === 'activity' ? 'Actividad' : tab === 'balances' ? 'Saldos' : 'Configuración'}
                                {activeTab === tab && (
                                    <div className="absolute bottom-[-2px] left-0 w-full h-[4px] bg-[var(--primary)] shadow-[0_0_15px_2px_var(--border-color)] rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Actividad Reciente</h2>
                            <div className="space-y-3">
                                {activities.map(activity => (
                                    <div key={activity.id} className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 border-l-[3px] border-l-[var(--primary)] rounded-xl p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group shadow-sm dark:shadow-none">
                                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", activity.bg, activity.color)}>
                                            <activity.icon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{activity.title}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{activity.paidBy} pagó ${activity.amount.toFixed(2)} • {activity.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};