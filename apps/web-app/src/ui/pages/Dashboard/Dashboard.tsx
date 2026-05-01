import React from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, Users, ArrowUpRight, BarChart3, Clock, ReceiptText } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext } from 'react-router-dom';
import { useDashboard } from './useDashboard';
import { GroupCard } from './components/GroupCard';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { CardAlert } from '@ui/components/Dashboard/CardAlert';
import { cn } from '../../../infrastructure/utils';

export const Dashboard: React.FC = () => {
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const {
        navigate,
        allActiveGroups = [],
        stats,
        isLoading,
        hasCards,
        deleteGroup
    } = useDashboard();

    const userName = localStorage.getItem('userName') || 'Usuario';
    const welcomeTitle = `HOLA, ${userName.toUpperCase()}`;

    const getAppearance = (name: string) => {
        const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        const colors = [
            { bg: 'bg-blue-500/10', text: 'text-blue-600' },
            { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
            { bg: 'bg-violet-500/10', text: 'text-violet-600' },
            { bg: 'bg-amber-500/10', text: 'text-amber-600' },
            { bg: 'bg-rose-500/10', text: 'text-rose-600' },
            { bg: 'bg-cyan-500/10', text: 'text-cyan-600' },
        ];
        const style = colors[hash % colors.length];
        return {
            icon: <span className="text-xl font-black">{name.charAt(0).toUpperCase()}</span>,
            bg: style.bg,
            color: style.text
        };
    };

    const handleDelete = async (e: React.MouseEvent, groupId: string, groupName: string) => {
        e.stopPropagation();
        if (window.confirm(`¿Estás seguro de que quieres eliminar el grupo "${groupName}"? Esta acción no se puede deshacer.`)) {
            try {
                await deleteGroup(groupId);
                toast.success('Grupo eliminado correctamente');
            } catch (error: any) {
                toast.error(error.message || 'Error al eliminar el grupo');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pb-20 transition-colors duration-300 font-display text-[var(--text-primary)] md:flex md:pb-0">
            <div className="relative flex min-w-0 flex-1 flex-col">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title={welcomeTitle}
                    subtitle="Easy-Pay Pro Desktop"
                    showStats
                />

                <main className="relative flex-grow px-4 py-8 md:px-8 max-w-[1600px] mx-auto w-full">
                    {/* Background decorative elements */}
                    <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-[var(--primary)]/5 blur-[120px]" />
                    <div className="pointer-events-none absolute -right-[10%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />

                    <div className="relative z-10 space-y-8">
                        
                        {/* --- DASHBOARD STATS (Expanded Desktop View) --- */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                                        <Wallet size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                                        <TrendingUp size={12} /> +12%
                                    </span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Total Gastado</p>
                                <h3 className="text-3xl font-black">${stats?.total_spent?.toLocaleString('es-MX') || '0.00'}</h3>
                            </div>

                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                                        <TrendingUp size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50">Saldos</span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Te deben</p>
                                <h3 className="text-3xl font-black text-emerald-500">${stats?.owed_to_user?.toLocaleString('es-MX') || '0.00'}</h3>
                            </div>

                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500">
                                        <TrendingDown size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1 bg-rose-500/10 px-2 py-1 rounded-full">
                                        Pendiente
                                    </span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Debes</p>
                                <h3 className="text-3xl font-black text-rose-500">${stats?.user_owes?.toLocaleString('es-MX') || '0.00'}</h3>
                            </div>

                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-500">
                                        <Users size={24} />
                                    </div>
                                    <button onClick={() => navigate('/create-group')} className="p-2 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 transition-opacity">
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Mesas Activas</p>
                                <h3 className="text-3xl font-black">{allActiveGroups.length}</h3>
                            </div>
                        </section>
                        
                        {!isLoading && !hasCards && <CardAlert />}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* --- GRUPOS LIST (Main Area) --- */}
                            <section className="lg:col-span-2 space-y-6">
                                <div className="flex items-end justify-between">
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] flex items-center gap-2">
                                        <Clock size={16} /> Actividad Reciente
                                    </h2>
                                    <button 
                                        onClick={() => navigate('/create-group')}
                                        className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] hover:underline"
                                    >
                                        Ver todos
                                    </button>
                                </div>

                                {isLoading ? (
                                    <DashboardSkeleton />
                                ) : (
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        {allActiveGroups.length > 0 ? (
                                            allActiveGroups.map((group: any) => {
                                                const appearance = getAppearance(group.nombre || "G");
                                                const mappedGroup = {
                                                    id: group.id,
                                                    name: group.nombre || "Sin nombre",
                                                    lastAct: group.descripcion || "Activo ahora",
                                                    members: group.integrantes || [],
                                                    total: group.total_gastado || 0,
                                                    userBalance: group.mi_balance || 0,
                                                    isAdmin: group.admin_id === localStorage.getItem('userId')
                                                };

                                                return (
                                                    <GroupCard
                                                        key={group.id}
                                                        group={mappedGroup}
                                                        onClick={() => navigate(`/group/${group.id}`)}
                                                        onDelete={mappedGroup.isAdmin ? (e) => handleDelete(e, group.id, mappedGroup.name) : undefined}
                                                        appearance={appearance}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full py-20 text-center border-4 border-dashed border-[var(--border-color)] rounded-[3rem] opacity-30">
                                                <Users size={48} className="mx-auto mb-4" />
                                                <p className="text-sm font-black uppercase tracking-widest">No hay mesas activas</p>
                                                <button 
                                                    onClick={() => navigate('/create-group')}
                                                    className="mt-4 text-[var(--primary)] font-bold text-xs uppercase tracking-widest"
                                                >
                                                    Crear la primera
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>

                            {/* --- ACTIVITY & ANALYTICS (Side Area) --- */}
                            <section className="space-y-6">
                                <div className="flex items-end justify-between">
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] flex items-center gap-2">
                                        <BarChart3 size={16} /> Análisis de Gastos
                                    </h2>
                                </div>

                                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-8 shadow-sm">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                                <span>Restaurantes</span>
                                                <span className="text-[var(--primary)]">65%</span>
                                            </div>
                                            <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--primary)] w-[65%]" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                                <span>Diversión</span>
                                                <span className="text-emerald-500">25%</span>
                                            </div>
                                            <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[25%]" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                                <span>Otros</span>
                                                <span className="text-violet-500">10%</span>
                                            </div>
                                            <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-violet-500 w-[10%]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
                                        <button className="w-full py-4 bg-black/5 hover:bg-black/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                            Exportar Reporte (PDF) <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-[var(--primary)] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        <ReceiptText size={120} strokeWidth={1} />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2">¿Tienes un Ticket?</h3>
                                    <p className="text-white/70 text-sm font-medium mb-6">Súbelo ahora y deja que la IA desglosé los gastos por ti en segundos.</p>
                                    <button 
                                        onClick={() => navigate('/qr-scanner')}
                                        className="bg-white text-[var(--primary)] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl"
                                    >
                                        Subir Archivo
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};