import React from 'react';
import { Plus, Users } from 'lucide-react';
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
        allActiveGroups = [],
        settledGroups = [],
        isLoading
    } = useDashboard();

    const userName = localStorage.getItem('userName') || 'Usuario';
    const welcomeTitle = `HOLA, ${userName.toUpperCase()}`;

    // Generador de apariencia dinámica para los iconos
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
        const initial = name.charAt(0).toUpperCase();

        return {
            icon: <span className="text-xl font-black">{initial}</span>,
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
                    {/* Decoración de fondo */}
                    <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />

                    <div className="relative z-10 mx-auto max-w-5xl space-y-10">
                        <section>
                            <div className="mb-6 flex items-end justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                    Mis Grupos Activos
                                </h2>
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
                                    {(allActiveGroups?.length ?? 0) > 0 ? (
                                        allActiveGroups.map((group: any) => {
                                            const groupName = group.nombre || group.name || "Sin nombre";
                                            const appearance = getAppearance(groupName);

                                            // Traducción de datos de Python a React
                                            const mappedGroup = {
                                                id: group.id,
                                                name: groupName,
                                                lastAct: group.descripcion || "Sin actividad reciente",
                                                members: group.integrantes || [],
                                                total: group.total || 0,
                                                userBalance: group.userBalance || 0,
                                                isAdmin: group.admin_id === localStorage.getItem('userId')
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
                                        <div className="col-span-full py-10 text-center border-2 border-dashed border-[var(--border-color)] rounded-2xl">
                                            <p className="text-[var(--text-secondary)]">Aún no tienes grupos. ¡Crea uno!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        <section>
                            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                Invitaciones Pendientes
                            </h2>
                            <InvitationCard />
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};