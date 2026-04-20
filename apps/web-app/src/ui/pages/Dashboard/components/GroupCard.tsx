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
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 p-5 shadow-sm backdrop-blur-xl transition-all hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800 cursor-pointer"
            )}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                    {/* Icono Dinámico con Inicial */}
                    <div className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                        appearance.bg,
                        appearance.color
                    )}>
                        {appearance.icon}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate text-lg font-bold text-slate-900 transition-colors group-hover:text-[var(--primary)] dark:text-white">
                                {group.name}
                            </h3>
                            {group.isAdmin && (
                                <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-800">
                                    Admin
                                </span>
                            )}
                        </div>
                        <p className="mb-3 truncate text-xs text-slate-500 dark:text-slate-400">
                            {group.lastAct}
                        </p>
                        <MemberAvatars members={group.members || []} extraMembers={group.extraMembers} />
                    </div>
                </div>

                {/* Sección Financiera */}
                <div className="flex min-w-[140px] flex-col items-end gap-1 border-t border-slate-100 pt-3 dark:border-slate-800 md:border-none md:pt-0">
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Total del grupo</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                            ${(group.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="mt-2">
                        <BalanceBadge balance={group.userBalance || 0} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};