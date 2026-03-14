import React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@ui/components/PageHeader';
import { useDashboard } from './useDashboard';
import { GroupCard } from './components/GroupCard';
import { SettledGroupCard } from './components/SettledGroupCard';
import { InvitationCard } from './components/InvitationCard';
import { DashboardSkeleton } from './components/DashboardSkeleton';

export const Dashboard: React.FC = () => {
    const {
        toggleSidebar,
        navigate,
        allActiveGroups,
        settledGroups,
        getGroupIcon,
        isLoading
    } = useDashboard();

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pb-20 transition-colors duration-300 font-display text-[var(--text-primary)] md:flex md:pb-0">
            <div className="relative flex min-w-0 flex-1 flex-col">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="HOLA, JUAN"
                    subtitle="Easy-Pay Dashboard"
                    showNotification
                    notificationCount={1}
                    onNotificationClick={() => navigate('/notifications')}
                    showAvatar={false} 
                />

                <main className="relative flex-grow px-4 py-8 md:px-8">
                    {/* Efectos de fondo */}
                    <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
                    <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

                    <div className="relative z-10 mx-auto max-w-5xl space-y-10">
                        
                        {/* SECCIÓN DE GRUPOS */}
                        <section>
                            <div className="mb-6 flex items-end justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                    Mis Grupos Activos
                                </h2>
                                <button
                                    className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-500/20"
                                    onClick={() => navigate('/create-group')}
                                >
                                    <Plus size={18} />
                                    <span>Crear</span>
                                </button>
                            </div>

                            {isLoading ? (
                                /* CARGA: Mostramos el esqueleto de 3 cuadros */
                                <DashboardSkeleton />
                            ) : (
                                /* REAL: Grupos Activos + Liquidados */
                                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                                    {allActiveGroups.map(group => {
                                        const styling = getGroupIcon(group.name);
                                        return (
                                            <GroupCard
                                                key={group.id}
                                                group={group}
                                                onClick={() => navigate(`/group/${group.id}`)}
                                                appearance={{
                                                    icon: styling.icon,
                                                    bg: 'bg-[var(--bg-card)]',
                                                    color: 'text-[var(--primary)]'
                                                }}
                                            />
                                        );
                                    })}

                                    {settledGroups.map(group => {
                                        const styling = getGroupIcon(group.name);
                                        return (
                                            <SettledGroupCard
                                                key={group.id}
                                                group={{ ...group, icon: styling.icon }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* SECCIÓN DE INVITACIONES (FUERA DEL ISLOADING PARA QUE SIEMPRE SE VEA) */}
                        <section>
                            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                Invitaciones Pendientes
                            </h2>
                            <div className="grid gap-4">
                                {isLoading ? (
                                    /* Esqueleto simple para la invitación mientras carga */
                                    <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
                                ) : (
                                    /* Invitación real */
                                    <InvitationCard />
                                )}
                            </div>
                        </section>

                    </div>
                </main>
            </div>

            {/* Botón flotante siempre visible */}
            <button
                className="fixed bottom-28 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 md:hidden"
                onClick={() => navigate('/create-group')}
            >
                <Plus size={32} />
            </button>
        </div>
    );
};