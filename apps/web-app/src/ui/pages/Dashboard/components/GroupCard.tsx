import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
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
    onDelete?: (e: React.MouseEvent) => void;
    appearance: { icon: React.ReactNode; bg: string; color: string; };
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onClick, onDelete, appearance }) => {
    const hasDebt = (group.userBalance || 0) < 0;
    const hasCredit = (group.userBalance || 0) > 0;

    const formatCurrency = (val: number) => {
        const absVal = Math.abs(val).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // Si hay deuda, quitamos el símbolo $ según el requerimiento para reducir ruido
        return hasDebt ? absVal : `$${absVal}`;
    };

    const getFontSizeClass = (val: string) => {
        if (val.length > 12) return "text-sm";
        if (val.length > 10) return "text-base";
        return "text-lg";
    };

    const totalStr = `$${(group.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const balanceStr = `${group.userBalance && group.userBalance > 0 ? "+" : ""}${formatCurrency(group.userBalance || 0)}`;

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative w-full overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/40 dark:bg-slate-900/40 p-6 sm:p-8 shadow-xl backdrop-blur-3xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/60 cursor-pointer"
        >
            {/* Background Accent Gradient - Subtle static glow */}
            <div className={cn(
                "absolute -right-12 -top-12 h-32 w-32 rounded-full blur-[70px] opacity-10 transition-opacity duration-500 group-hover:opacity-20",
                appearance.bg
            )} />

            <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                        {/* Dynamic Avatar - High Contrast & Static (No flicker) */}
                        <div className={cn(
                            "relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-[1.5rem] sm:rounded-[1.8rem] shadow-lg border-2 border-white/50 dark:border-slate-700/50 transition-transform duration-500 group-hover:rotate-3",
                            appearance.bg,
                            appearance.color
                        )}>
                            <div className="absolute inset-0 rounded-[1.5rem] sm:rounded-[1.8rem] bg-white/10" />
                            <span className="text-xl sm:text-2xl font-black">{group.name.charAt(0).toUpperCase()}</span>
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="truncate text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {group.name}
                                </h3>
                                {group.isAdmin && (
                                    <span className="shrink-0 px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-md text-[7px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                        ADMIN
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-slate-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    Activo ahora
                                </span>
                            </div>
                        </div>
                    </div>

                    {group.isAdmin && onDelete && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(e);
                            }}
                            className="shrink-0 p-3 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-colors duration-300"
                            title="Eliminar grupo"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>

                {/* Financial Summary Section - Responsive Layout */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                    <div className="flex-1 bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-[1.5rem] sm:rounded-[1.8rem] p-4 sm:p-5 flex flex-col justify-center transition-colors hover:bg-white/10">
                        <p className="text-[10px] font-medium text-slate-400/80 mb-1">Total grupo</p>
                        <p className={cn(
                            "font-bold text-slate-900 dark:text-white font-mono break-all leading-tight",
                            getFontSizeClass(totalStr)
                        )}>
                            {totalStr}
                        </p>
                    </div>

                    <div className={cn(
                        "flex-1 backdrop-blur-md rounded-[1.5rem] sm:rounded-[1.8rem] p-4 sm:p-5 flex flex-col justify-center transition-all",
                        hasDebt ? "bg-red-500/10" : 
                        hasCredit ? "bg-emerald-500/10" : 
                        "bg-white/5"
                    )}>
                        <p className={cn(
                            "text-[10px] font-medium mb-1",
                            hasDebt ? "text-rose-400" : hasCredit ? "text-emerald-400" : "text-slate-400/80"
                        )}>Tu balance</p>
                        <p className={cn(
                            "font-bold font-mono break-all leading-tight",
                            hasDebt ? "text-rose-600 dark:text-rose-400" : 
                            hasCredit ? "text-emerald-600 dark:text-emerald-400" : 
                            "text-slate-500",
                            getFontSizeClass(balanceStr)
                        )}>
                            {balanceStr}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <MemberAvatars members={group.members || []} extraMembers={group.extraMembers} />
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Ver detalles 
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};