import { useState, useEffect, useCallback } from 'react';

export const useDashboard = () => {
    const [allActiveGroups, setAllActiveGroups] = useState<any[]>([]);
    const [settledGroups, setSettledGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    const fetchGroups = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8002/api/groups/user/${userId}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                // Obtenemos balances reales para cada grupo
                const groupsWithBalances = await Promise.all(data.map(async (group: any) => {
                    try {
                        const resBalance = await fetch(`http://localhost:8002/api/groups/${group.id}/balances`);
                        if (resBalance.ok) {
                            const bData = await resBalance.json();

                            // Buscamos el balance detallado del usuario actual
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
    }, [userId]);

    useEffect(() => {
        fetchGroups();

        // Actualizar cuando el usuario vuelve a la pestaña
        window.addEventListener('focus', fetchGroups);
        return () => window.removeEventListener('focus', fetchGroups);
    }, [fetchGroups]);

    // Funciones de utilidad necesarias para el Dashboard
    const toggleSidebar = () => console.log("Sidebar toggled");
    const navigate = (path: string) => { window.location.href = path; };

    return {
        allActiveGroups,
        settledGroups,
        isLoading,
        toggleSidebar,
        navigate,
        refresh: fetchGroups
    };
};