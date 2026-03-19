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

    // --- LÓGICA DE PERSONALIZACIÓN ---
    // Recuperamos el nombre que guardamos en useAuth al hacer login
    const userName = localStorage.getItem('userName') || 'Usuario';
    const welcomeTitle = `HOLA, ${userName.toUpperCase()}`;

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pb-20 transition-colors duration-300 font-display text-[var(--text-primary)] md:flex md:pb-0">
            <div className="relative flex min-w-0 flex-1 flex-col">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title={welcomeTitle} // <-- Ahora es dinámico
                    subtitle="Easy-Pay Dashboard"
                    showNotification
                    notificationCount={1}
                    onNotificationClick={() => navigate('/notifications')}
                    showAvatar={false}
                />

                <main className="relative flex-grow px-4 py-8 md:px-8">
                    {/* Efectos de fondo adaptables */}
                    <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[120px] transition-colors duration-500" />
                    <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

                    <div className="relative z-10 mx-auto max-w-5xl space-y-10">

                        {/* SECCIÓN DE GRUPOS */}
                        <section>
                            <div className="mb-6 flex items-end justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                    Mis Grupos Activos
                                </h2>
                                <button
                                    className="flex items-center gap-2 rounded-lg bg-[var(--primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--primary)] transition-all hover:bg-[var(--primary)]/20 active:scale-95"
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

                        {/* SECCIÓN DE INVITACIONES */}
                        <section>
                            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                Invitaciones Pendientes
                            </h2>
                            <div className="grid gap-4">
                                {isLoading ? (
                                    <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
                                ) : (
                                    <InvitationCard />
                                )}
                            </div>
                        </section>

                    </div>
                </main>
            </div>

            <button
                className="fixed bottom-28 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/40 transition-all hover:scale-110 active:scale-90 md:hidden"
                onClick={() => navigate('/create-group')}
            >
                <Plus size={32} />
            </button>
        </div>
    );
};