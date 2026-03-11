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
    iconBg?: string; // Optional direct overrides
    iconColor?: string;
}

interface GroupCardProps {
    group: GroupProps;
    onClick: () => void;
    // We pass the resolved styling since it implies logic
    appearance: {
        icon: React.ReactNode;
        bg: string;
        color: string;
    };
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onClick, appearance }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 p-5 shadow-sm backdrop-blur-xl transition-all hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800 cursor-pointer"
        >
            {group.isAdmin && (
                <div className="absolute top-0 right-0 rounded-bl-xl border-b border-l border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[0.625rem] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Administrador
                </div>
            )}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Main Info */}
                <div className="flex items-start gap-4">
                    <div className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ring-1 ring-inset ring-black/5 dark:ring-white/10",
                        appearance.bg,
                        appearance.color
                    )}>
                        {appearance.icon}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                            {group.name}
                        </h3>
                        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                            Última act. {group.lastAct || 'Recién'}
                        </p>

                        <MemberAvatars
                            members={group.members || []}
                            extraMembers={group.extraMembers}
                        />
                    </div>
                </div>

                {/* Balance Info */}
                <div className="flex min-w-[120px] flex-col items-end gap-1">
                    <span className="text-xs font-medium text-slate-400">Total del grupo</span>
                    <span className="mb-2 text-base font-semibold text-slate-900 dark:text-white">
                        ${(group.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>

                    <BalanceBadge balance={group.userBalance || 0} />
                </div>
            </div>
        </motion.div>
    );
};
