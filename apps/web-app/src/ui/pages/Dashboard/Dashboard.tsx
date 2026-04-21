import React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext } from 'react-router-dom';
import { useDashboard } from './useDashboard';
import { GroupCard } from './components/GroupCard';
import { DashboardSkeleton } from './components/DashboardSkeleton';

export const Dashboard: React.FC = () => {
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const {
        navigate,
        allActiveGroups = [],
        isLoading
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

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pb-20 transition-colors duration-300 font-display text-[var(--text-primary)] md:flex md:pb-0">
            <div className="relative flex min-w-0 flex-1 flex-col">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title={welcomeTitle}
                    subtitle="Easy-Pay Dashboard"
                    showNotification
                />

                <main className="relative flex-grow px-4 py-8 md:px-8">
                    <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />

                    <div className="relative z-10 mx-auto max-w-5xl space-y-10">
                        <section>
                            <div className="mb-6 flex items-end justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                    Mis Grupos Activos
                                </h2>
                                {/* CORRECCIÓN: Botón Crear adaptable */}
                                <button
                                    className="flex items-center gap-2 rounded-lg bg-[var(--primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--primary)] transition-all hover:bg-[var(--primary)]/20"
                                    onClick={() => navigate('/create-group')}
                                >
                                    <Plus size={18} />
                                    <span>Crear Grupo</span>
                                </button>
                            </div>

                            {isLoading ? (
                                <DashboardSkeleton />
                            ) : (
                                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                                    {allActiveGroups.length > 0 ? (
                                        allActiveGroups.map((group: any) => {
                                            const gName = group.nombre || "Sin nombre";
                                            const appearance = getAppearance(gName);

                                            // 🚩 MAPEO CORRECTO HACIA LOS COMPONENTES:
                                            const mappedGroup = {
                                                id: group.id,
                                                name: gName,
                                                lastAct: group.descripcion || "Activo ahora",
                                                members: group.integrantes || [],
                                                // Usamos los nombres que vienen del Hook con balances
                                                total: group.total_gastado || 0,
                                                userBalance: group.mi_balance || 0,
                                                isAdmin: group.creador_id === localStorage.getItem('userId')
                                            };

                                            return (
                                                <GroupCard
                                                    key={group.id}
                                                    group={mappedGroup}
                                                    onClick={() => navigate(`/group/${group.id}`)}
                                                    appearance={appearance}
                                                />
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full py-16 text-center border-2 border-dashed border-[var(--border-color)] rounded-[2rem] opacity-50">
                                            <p className="text-sm font-bold uppercase tracking-widest">No hay grupos activos</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};