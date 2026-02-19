import React from 'react';
import {
    Plus,
    CheckCircle2,
    Check,
    Plane,
} from 'lucide-react';
import styles from './Dashboard.module.css';
import { cn } from '../../../infrastructure/utils';
import { PageHeader } from '@ui/components/PageHeader';
import { Sidebar } from '@ui/components/Sidebar/Sidebar';
import { useDashboard } from './useDashboard';
import { MobileNavigation } from '@ui/components/MobileNavigation';

export const Dashboard: React.FC = () => {
    const {
        navigate,
        allActiveGroups,
        settledGroups,
        getGroupIcon
    } = useDashboard();

    return (
        <div className={cn(styles.layout, "md:flex-row")}>
            {/* Sidebar - Persistent on desktop, Drawer on mobile */}
            <Sidebar isOpen={false} onClose={() => { }} />

            {/* Main Content Area (Column of Header + Page Content) */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Unified Header matching the premium look */}
                <PageHeader
                    title="HOLA, JUAN"
                    subtitle="Easy-Pay Dashboard"
                    showNotification
                    notificationCount={1}
                    onNotificationClick={() => navigate('/notifications')}
                />

                {/* Main Content */}
                <main className={styles.main}>
                    <div className={styles.glowTop} />
                    <div className={styles.glowBottom} />

                    <div className={styles.container}>
                        {/* Active Groups Section */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionHeading}>Mis Grupos Activos</h2>
                                <button className={styles.createBtn} onClick={() => navigate('/create-group')}>
                                    <Plus size={18} />
                                    <span className="ml-[0.25rem]">Crear</span>
                                </button>
                            </div>

                            <div className={styles.groupList}>
                                {allActiveGroups.map(group => {
                                    const styling = group.iconBg ? { icon: group.icon, bg: group.iconBg, color: group.iconColor } : getGroupIcon(group.name);

                                    return (
                                        <div
                                            key={group.id}
                                            className={styles.groupCard}
                                            onClick={() => navigate(`/group/${group.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {group.isAdmin && (
                                                <div className={styles.adminBadge}>Administrador</div>
                                            )}
                                            <div className={styles.cardContent}>
                                                <div className={styles.cardMain}>
                                                    <div className={cn(styles.cardIconBox, styling.bg, styling.color)}>
                                                        {styling.icon}
                                                    </div>
                                                    <div className={styles.cardInfo}>
                                                        <h3 className={styles.groupName}>{group.name}</h3>
                                                        <p className={styles.lastAct}>Última act. {group.lastAct || 'Recién'}</p>
                                                        <div className={styles.memberAvatars}>
                                                            {group.members && Array.isArray(group.members) ? (
                                                                group.members.slice(0, 3).map((m: any, i: number) => (
                                                                    <img
                                                                        key={i}
                                                                        src={typeof m === 'string' ? m : m.avatar}
                                                                        alt="User"
                                                                        className={styles.smallAvatar}
                                                                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=User&background=random`; }}
                                                                    />
                                                                ))
                                                            ) : null}
                                                            {(group.extraMembers > 0 || (group.members && group.members.length > 3)) && (
                                                                <div className={styles.moreMembers}>
                                                                    +{group.extraMembers || (group.members?.length || 0) - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.balanceInfo}>
                                                    <span className={styles.totalLabel}>Total del grupo</span>
                                                    <span className={styles.totalValue}>
                                                        ${(group.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                    </span>
                                                    <div className={cn(
                                                        styles.balanceBadge,
                                                        (group.userBalance || 0) < 0 ? styles.debtBadge : styles.creditBadge
                                                    )}>
                                                        <p className={styles.balanceLabel}>{(group.userBalance || 0) < 0 ? 'Tu deuda' : 'Te deben'}</p>
                                                        <p className={styles.balanceValue}>
                                                            {(group.userBalance || 0) < 0 ? '-' : '+'}
                                                            ${Math.abs(group.userBalance || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Empty State if no groups */}
                                {allActiveGroups.length === 0 && (
                                    <div className="text-center py-10 text-slate-400">
                                        <p>No tienes grupos activos.</p>
                                        <button onClick={() => navigate('/create-group')} className="text-blue-500 font-bold mt-2 hover:underline">¡Crea uno ahora!</button>
                                    </div>
                                )}

                                {settledGroups.map(group => (
                                    <div key={group.id} className={cn(styles.groupCard, styles.settledCard)}>
                                        <div className={styles.settledStatus}>
                                            <CheckCircle2 size={10} className={styles.mr1} />
                                            Liquidado
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.cardMain}>
                                                <div className={cn(styles.cardIconBox, styles.bgSlate, styles.textSlate)}>
                                                    {group.icon}
                                                </div>
                                                <div className={styles.cardInfo}>
                                                    <h3 className={styles.groupNameSettled}>{group.name}</h3>
                                                    <p className={styles.lastAct}>Finalizado el {group.date}</p>
                                                    <div className={styles.memberAvatarsSettled}>
                                                        {group.members.map((m: any, i: number) => (
                                                            <img key={i} src={m} alt="User" className={styles.smallAvatar} />
                                                        ))}
                                                        <div className={styles.moreMembers}>+{group.extraMembers}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.balanceInfo}>
                                                <span className={styles.totalLabel}>Total final</span>
                                                <span className={styles.totalValueSettled}>${group.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                                                <div className={styles.paidBadge}>
                                                    <Check size={14} />
                                                    <span>Pagado</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Pending Invitations Section */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionHeading}>Invitaciones Pendientes</h2>
                            <div className={styles.invitationCard}>
                                <div className={styles.invitationOverlay} />
                                <div className={styles.invitationContent}>
                                    <div className={styles.invitationMain}>
                                        <div className={styles.invitationIconBox}>
                                            <Plane size={24} className={styles.textBlue} />
                                        </div>
                                        <div>
                                            <h3 className={styles.invitationTitle}>Viaje a la playa</h3>
                                            <p className={styles.invitationSubtitle}>
                                                Invitado por <span className={cn(styles.textBlue, styles.textMedium)}>María González</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.invitationActions}>
                                        <button className={styles.rejectBtn}>Rechazar</button>
                                        <button className={styles.acceptBtn}>Aceptar</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {/* Floating Action Button */}
            <button className={styles.fab} onClick={() => navigate('/create-group')}>
                <Plus size={32} />
            </button>

            {/* Mobile Navigation - New Wave Component */}
            <MobileNavigation />
        </div>
    );
};
