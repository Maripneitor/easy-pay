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
                    /* CORRECCIÓN: Quitamos el avatar redundante de la derecha */
                    showAvatar={false} 
                />

                <main className="relative flex-grow px-4 py-8 md:px-8">
                    {/* Glow Effects */}
                    <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
                    <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

                    <div className="relative z-10 mx-auto max-w-5xl space-y-10">
                        {/* Active Groups Section */}
                        <section>
                            <div className="mb-6 flex items-end justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                    Mis Grupos Activos
                                </h2>
                                <button
                                    className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30"
                                    onClick={() => navigate('/create-group')}
                                >
                                    <Plus size={18} />
                                    <span>Crear</span>
                                </button>
                            </div>

                            {isLoading ? (
                                <DashboardSkeleton />
                            ) : (
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
                                                    color: 'text-[var(--text-primary)]'
                                                }}
                                            />
                                        );
                                    })}

                                    {allActiveGroups.length === 0 && (
                                        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] py-16">
                                            <div className="mb-4 rounded-full bg-[var(--bg-card)] p-4 shadow-sm">
                                                <Plus size={32} className="text-slate-400" />
                                            </div>
                                            <p className="text-[var(--text-secondary)]">No tienes grupos activos.</p>
                                            <button
                                                onClick={() => navigate('/create-group')}
                                                className="mt-2 font-bold text-blue-500 hover:underline hover:text-blue-600 dark:text-blue-400"
                                            >
                                                ¡Crea uno ahora!
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Settled Groups */}
                            {settledGroups.length > 0 && (
                                <div className="mt-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                                    {settledGroups.map(group => {
                                        const styling = getGroupIcon(group.name);
                                        return (
                                            <SettledGroupCard
                                                key={group.id}
                                                group={{
                                                    ...group,
                                                    icon: styling.icon,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Pending Invitations Section */}
                        <section>
                            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                Invitaciones Pendientes
                            </h2>
                            <div className="grid gap-4">
                                <InvitationCard />
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            <button
                className="fixed bottom-28 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 transition-transform hover:scale-105 active:scale-95 md:bottom-12 md:right-12"
                onClick={() => navigate('/create-group')}
                aria-label="Crear nuevo grupo"
            >
                <Plus size={32} />
            </button>
        </div>
    );
};