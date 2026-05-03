import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupRepository, statsRepository, paymentRepository } from '../../../infrastructure/api/repositories';
import { httpClient } from '../../../infrastructure/api/http-client';
import { useAuthContext } from '../../context/AuthContext';

export const useDashboard = () => {
    const [allActiveGroups, setAllActiveGroups] = useState<any[]>([]);
    const [settledGroups, setSettledGroups] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCards, setHasCards] = useState(true);
    const { user, isLoading: authLoading } = useAuthContext();
    const userId = user?.id;
    const navigate = useNavigate();

    const fetchDashboardData = useCallback(async () => {
        if (authLoading) return;
        if (!userId) {
            setIsLoading(false);
            navigate('/auth');
            return;
        }

        try {
            // 1. Obtener tarjetas del usuario (Mobile Parity Check)
            try {
                const cards = await paymentRepository.getCards(userId);
                setHasCards(cards && cards.length > 0);
            } catch (e) {
                console.error("Error fetching cards:", e);
            }

            // 2. Obtener grupos del usuario
            const data = await groupRepository.findByUser(userId);

            if (Array.isArray(data)) {
                const groupsWithBalances = await Promise.all(data.map(async (group: any) => {
                    try {
                        const bData = await groupRepository.getBalances(group.id);
                        const bList = bData.balance_detallado || bData.balances || [];
                        const myInfo = bList.find((b: any) => b.usuario_id === userId);

                        return {
                            ...group,
                            total_gastado: bData.total_gastado_en_grupo || 0,
                            mi_balance: myInfo?.balance || 0
                        };
                    } catch (e) {
                        return { ...group, total_gastado: 0, mi_balance: 0 };
                    }
                }));

                setAllActiveGroups(groupsWithBalances.filter((g: any) => !g.is_settled));
                setSettledGroups(groupsWithBalances.filter((g: any) => g.is_settled));
            }

            // 3. Obtener estadísticas detalladas (Novedad Desktop)
            try {
                const userStats = await statsRepository.getUserStats(userId);
                setStats(userStats);
            } catch (e) {
                console.error("Error fetching stats:", e);
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }

    }, [userId, navigate, authLoading]);

    useEffect(() => {
        fetchDashboardData();
        window.addEventListener('focus', fetchDashboardData);
        return () => window.removeEventListener('focus', fetchDashboardData);
    }, [fetchDashboardData]);

    const deleteGroup = async (groupId: string) => {
        try {
            await groupRepository.deleteGroup(groupId);
            fetchDashboardData();
        } catch (error: any) {
            throw error;
        }
    };

    return {
        allActiveGroups,
        settledGroups,
        stats,
        isLoading,
        hasCards,
        navigate,
        refresh: fetchDashboardData,
        deleteGroup
    };
};