import { useState, useEffect, useCallback } from 'react';

export const useGroupDetail = (group_id: string) => {
    // 1. TODOS los hooks de estado deben ir al inicio y ejecutarse SIEMPRE
    const [activeTab, setActiveTab] = useState<'activity' | 'balances' | 'members' | 'payments'>('activity');
    const [loading, setLoading] = useState(true);

    const [groupInfo, setGroupInfo] = useState({
        name: '',
        code: '',
        adminId: '',
        members: [] as any[],
        // Inicializamos como array vacío para evitar el error .find() de undefined
        integrantes_data: [] as any[]
    });

    const [stats, setStats] = useState({
        totalSpent: 0,
        userShare: 0,
        userOwed: 0
    });

    const [activities, setActivities] = useState<any[]>([]);
    const [balances, setBalances] = useState<any>(null);
    const [currentUserId] = useState(() => localStorage.getItem('userId') || "");

    const getGroupData = useCallback(async () => {
        // Validación de ID dentro del callback, NO detiene la ejecución de los hooks
        if (!group_id || group_id.includes(':') || group_id === 'undefined' || group_id === '') {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [resGroup, resItems, resBalances] = await Promise.all([
                fetch(`http://localhost:8002/api/groups/${group_id}`),
                fetch(`http://localhost:8002/api/groups/${group_id}/items`),
                fetch(`http://localhost:8002/api/groups/${group_id}/balances`)
            ]);

            let itemsList: any[] = [];

            // 1. Procesar Datos del Grupo
            if (resGroup.ok) {
                const g = await resGroup.json();
                const rawIntegrantes = g.integrantes || [];

                setGroupInfo({
                    name: g.nombre || "Mesa de Gastos",
                    code: g.codigo_invitacion || "---",
                    adminId: g.admin_id || g.creador_id || "",
                    members: Array.isArray(rawIntegrantes) && typeof rawIntegrantes[0] === 'object'
                        ? rawIntegrantes.map((i: any) => i.id)
                        : rawIntegrantes,
                    integrantes_data: Array.isArray(rawIntegrantes) && typeof rawIntegrantes[0] === 'object'
                        ? rawIntegrantes
                        : []
                });
            }

            // 2. Procesar Gastos (Activities)
            if (resItems.ok) {
                const itemsData = await resItems.json();
                itemsList = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);
                setActivities(itemsList);
            }

            // 3. Procesar Balances
            if (resBalances.ok) {
                const bData = await resBalances.json();
                setBalances(bData);

                let miConsumoTotal = 0;
                let miGastoEfectuado = 0;

                if (itemsList.length > 0 && currentUserId) {
                    itemsList.forEach(item => {
                        const monto = item.monto || item.precio || 0;
                        const participantes = item.participantes_ids || [];

                        if (participantes.includes(currentUserId)) {
                            miConsumoTotal += monto / (participantes.length || 1);
                        }
                        if (item.comprador_id === currentUserId) {
                            miGastoEfectuado += monto;
                        }
                    });
                }

                setStats({
                    totalSpent: bData.total_gastado_en_grupo || 0,
                    userShare: miConsumoTotal,
                    userOwed: miGastoEfectuado - miConsumoTotal
                });
            }

        } catch (error) {
            console.error("❌ Error en useGroupDetail:", error);
        } finally {
            setLoading(false);
        }
    }, [group_id, currentUserId]);

    useEffect(() => {
        getGroupData();
    }, [getGroupData]);

    // Retorno limpio y seguro
    return {
        activeTab,
        setActiveTab,
        loading,
        groupName: groupInfo.name,
        groupCode: groupInfo.code,
        adminId: groupInfo.adminId,
        members: groupInfo.members,
        integrantes_data: groupInfo.integrantes_data,
        totalSpent: stats.totalSpent,
        userShare: stats.userShare,
        userOwed: stats.userOwed,
        activities,
        balances,
        currentUserId,
        refresh: getGroupData
    };
};