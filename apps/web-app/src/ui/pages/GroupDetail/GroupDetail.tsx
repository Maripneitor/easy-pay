import {
    Share2,
    Settings,
    Plus,
    Wallet,
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
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Header Adaptable */}
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title={groupName || "Detalle del Grupo"}
                    onBack={() => navigate(-1)}
                    rightSlot={
                        <div className="flex gap-2">
                            <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--hover-bg)]">
                                <Share2 size={20} />
                            </button>
                            <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--hover-bg)]">
                                <Settings size={20} />
                            </button>
                        </div>
                    }
                />

                <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
                    
                    {/* Stats Cards con Borde Adaptable */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Total Grupo */}
                        <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-5 relative overflow-hidden shadow-sm border-t-4 border-t-[var(--primary)] shadow-[0_-5px_15px_-5px_var(--primary)]/20">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Wallet size={64} className="text-[var(--text-primary)]" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Total Grupo</p>
                            <p className="text-2xl font-black text-[var(--text-primary)]">${totalSpent.toFixed(2)}</p>
                            <div className="mt-2 text-[10px] font-bold uppercase text-[var(--text-secondary)] flex items-center gap-1">
                                <span className="text-emerald-500 flex items-center">
                                    <ArrowUpRight size={14} /> 12%
                                </span>
                                vs mes anterior
                            </div>
                        </div>

                        {/* Tu Parte */}
                        <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-5 relative overflow-hidden shadow-sm border-t-4 border-t-[var(--primary)] shadow-[0_-5px_15px_-5px_var(--primary)]/20">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <PieChart size={64} className="text-[var(--text-primary)]" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Tu Parte</p>
                            <p className="text-2xl font-black text-[var(--text-primary)]">${userShare.toFixed(2)}</p>
                        </div>

                        {/* Te Deben (Color Éxito fijo pero card adaptable) */}
                        <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-5 relative overflow-hidden shadow-sm border-t-4 border-t-emerald-500 shadow-[0_-5px_15px_-5px_rgba(16,185,129,0.3)]">
                            <div className="relative z-10">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1 flex items-center gap-1">
                                    <CheckCircle size={14} />
                                    Te deben
                                </p>
                                <p className="text-2xl font-black text-emerald-500">${userOwed.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Estilo "UNACH" */}
                    <div className="flex border-b border-[var(--border-color)]">
                        {['activity', 'balances', 'settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={cn(
                                    "px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                                    activeTab === tab
                                        ? "text-[var(--primary)]"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                {tab === 'activity' ? 'Actividad' : tab === 'balances' ? 'Saldos' : 'Configuración'}
                                {activeTab === tab && (
                                    <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[var(--primary)] shadow-[0_0_10px_var(--primary)] rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content: Actividad con estilo de Cards adaptable */}
                    {activeTab === 'activity' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-secondary)]">Actividad Reciente</h2>
                                <button 
                                    onClick={() => navigate('/register-expense')}
                                    className="p-2 bg-[var(--primary)] text-white rounded-full shadow-lg shadow-[var(--primary)]/30 hover:scale-110 active:scale-95 transition-all"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {activities.map(activity => (
                                    <div key={activity.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] border-l-4 border-l-[var(--primary)] rounded-xl p-4 flex items-center gap-4 hover:bg-[var(--hover-bg)] transition-all cursor-pointer group shadow-sm">
                                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-inner", activity.bg, activity.color)}>
                                            <activity.icon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-[var(--text-primary)] truncate">{activity.title}</h3>
                                            <p className="text-xs font-medium text-[var(--text-secondary)]">
                                                <span className="text-[var(--text-primary)]">{activity.paidBy}</span> pagó ${activity.amount.toFixed(2)} • {activity.date}
                                            </p>
                                        </div>
                                        <div className="text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">
                                            <ArrowUpRight size={18} />
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