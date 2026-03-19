import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../../infrastructure/utils';
import { MemberAvatars } from './MemberAvatars';
import { BalanceBadge } from './BalanceBadge';
import type { Member } from '../../../../types';

interface GroupProps {
    id: string;
    name: string;
    lastAct?: string;
    members?: (Member | string)[];
    extraMembers?: number;
    total?: number;
    userBalance?: number;
    isAdmin?: boolean;
    icon?: React.ReactNode;
}

interface GroupCardProps {
    group: GroupProps;
    onClick: () => void;
    appearance: { icon: React.ReactNode; bg: string; color: string; };
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onClick, appearance }) => {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            onClick={onClick}
            /* Mantenemos el borde sólido que cambia con el tema */
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 p-5 shadow-sm backdrop-blur-xl transition-all hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800 cursor-pointer"
            )}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                    {/* Icono del Grupo */}
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", appearance.bg, appearance.color)}>
                        {appearance.icon}
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[var(--primary)] transition-colors">
                                {group.name}
                            </h3>
                            {group.isAdmin && (
                                <span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                                    Administrador
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            Última act. {group.lastAct || 'Recién'}
                        </p>
                        <MemberAvatars members={group.members || []} extraMembers={group.extraMembers} />
                    </div>
                </div>

                {/* Sección de Dinero (Lo que se había perdido) */}
                <div className="flex min-w-[140px] flex-col items-end gap-1">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total del grupo</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                            ${(group.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    
                    {/* Badge de "Te deben" o "Debes" */}
                    <div className="mt-2">
                        <BalanceBadge balance={group.userBalance || 0} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};