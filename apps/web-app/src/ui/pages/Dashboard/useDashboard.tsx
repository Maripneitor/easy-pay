import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDashboard = () => {
    const [allActiveGroups, setAllActiveGroups] = useState<any[]>([]);
    const [settledGroups, setSettledGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const fetchGroups = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            navigate('/auth');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/groups/user/${userId}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                const groupsWithBalances = await Promise.all(data.map(async (group: any) => {
                    try {
                        const resBalance = await fetch(`http://localhost:8000/api/groups/${group.id}/balances`);
                        if (resBalance.ok) {
                            const bData = await resBalance.json();
                            const bList = bData.balance_detallado || bData.balances || [];
                            const myInfo = bList.find((b: any) => b.usuario_id === userId);

                            return {
                                ...group,
                                total_gastado: bData.total_gastado_en_grupo || 0,
                                mi_balance: myInfo?.balance || 0
                            };
                        }
                    } catch (e) {
                        console.error(`Error balance grupo ${group.id}:`, e);
                    }
                    return { ...group, total_gastado: 0, mi_balance: 0 };
                }));

                setAllActiveGroups(groupsWithBalances.filter((g: any) => !g.is_settled));
                setSettledGroups(groupsWithBalances.filter((g: any) => g.is_settled));
            }
        } catch (error) {
            console.error("Error al obtener grupos:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId, navigate]);

    useEffect(() => {
        fetchGroups();
        window.addEventListener('focus', fetchGroups);
        return () => window.removeEventListener('focus', fetchGroups);
    }, [fetchGroups]);

    return {
        allActiveGroups,
        settledGroups,
        isLoading,
        navigate,
        refresh: fetchGroups
    };
};