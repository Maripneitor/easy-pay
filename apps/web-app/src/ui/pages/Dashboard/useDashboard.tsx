import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plane, Utensils, Home, PartyPopper, Users, ShoppingBag } from 'lucide-react';
import type { Group } from '@easy-pay/domain';
import { groupRepository } from '../../../infrastructure/api/repositories/GroupRepository';
import type { GroupViewModel } from '../../../types';
import { toGroupViewModel } from '../../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

type DashboardContextType = {
    toggleSidebar: () => void;
};

type GroupAppearance = {
    icon: React.ReactNode;
    bg: string;
    color: string;
};

// ─── Icon resolver ────────────────────────────────────────────────────────────

const resolveGroupAppearance = (name = ''): GroupAppearance => {
    const lower = name.toLowerCase();
    if (lower.includes('viaje') || lower.includes('vuelo') || lower.includes('hotel'))
        return { icon: <Plane size={24} />,       bg: 'bg-blue-100   dark:bg-blue-500/10',     color: 'text-blue-600   dark:text-blue-400' };
    if (lower.includes('cena') || lower.includes('comida') || lower.includes('restaur'))
        return { icon: <Utensils size={24} />,    bg: 'bg-orange-100 dark:bg-orange-500/10',   color: 'text-orange-600 dark:text-orange-400' };
    if (lower.includes('casa') || lower.includes('depa') || lower.includes('renta'))
        return { icon: <Home size={24} />,         bg: 'bg-green-100  dark:bg-green-500/10',    color: 'text-green-600  dark:text-green-400' };
    if (lower.includes('fiesta') || lower.includes('cumplea') || lower.includes('celebr'))
        return { icon: <PartyPopper size={24} />,  bg: 'bg-purple-100 dark:bg-purple-500/10',   color: 'text-purple-600 dark:text-purple-400' };
    if (lower.includes('compra') || lower.includes('super') || lower.includes('mercado'))
        return { icon: <ShoppingBag size={24} />,  bg: 'bg-pink-100   dark:bg-pink-500/10',     color: 'text-pink-600   dark:text-pink-400' };
    return     { icon: <Users size={24} />,        bg: 'bg-slate-100  dark:bg-slate-700/50',    color: 'text-slate-600  dark:text-slate-400' };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useDashboard = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useOutletContext<DashboardContextType>();

    const [allGroups,  setAllGroups]  = useState<GroupViewModel[]>([]);
    const [isLoading,  setIsLoading]  = useState<boolean>(true);
    const [error,      setError]      = useState<string | null>(null);

    // ── Load groups from repository ────────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        const loadGroups = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch all groups — the repository handles mock vs real API
                // For now we load the 2 pre-seeded mock groups
                const [group1, group2] = await Promise.all([
                    groupRepository.getGroup('1').catch(() => null),
                    groupRepository.getGroup('2').catch(() => null),
                ]);

                if (cancelled) return;

                const fetched = [group1, group2].filter(Boolean) as Group[];

                const viewModels: GroupViewModel[] = fetched.map(group => {
                    const appearance = resolveGroupAppearance(group.name);
                    return toGroupViewModel(group, {
                        icon:     appearance.icon,
                        iconBg:   appearance.bg,
                        iconColor: appearance.color,
                        lastAct:  'Recién',
                    });
                });

                setAllGroups(viewModels);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Error cargando grupos');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadGroups();
        return () => { cancelled = true; };
    }, []);

    // ── Derived data ───────────────────────────────────────────────────────────

    const activeGroups  = allGroups.filter(g => g.status === 'active' || g.status === 'paying');
    const settledGroups = allGroups.filter(g => g.status === 'closed');

    return {
        toggleSidebar,
        navigate,
        allActiveGroups: activeGroups,
        settledGroups,
        getGroupIcon: resolveGroupAppearance,
        isLoading,
        error,
    };
};
