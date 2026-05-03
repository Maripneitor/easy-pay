import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../infrastructure/api/http-client';

export const useGroupDetail = (group_id: string) => {
    const [activeTab, setActiveTab] = useState<'activity' | 'balances' | 'members' | 'payments' | 'asignación' | 'actividades' | 'saldos' | 'integrantes'>('actividades');
    const myId = localStorage.getItem('userId');

    const { data, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['group', group_id],
        queryFn: async () => {
            if (!group_id || group_id === ':group_id' || group_id === 'undefined' || group_id === '') {
                return null;
            }

            // Fetch everything in parallel
            const [resGroup, resItems, resBalances] = await Promise.all([
                httpClient.get(`/groups/${group_id}`),
                httpClient.get(`/groups/${group_id}/items`),
                httpClient.get(`/groups/${group_id}/balances`)
            ]);

            const gData = resGroup.data;
            const itemsData = resItems.data;
            const bData = resBalances.data;

            if (gData.status === 'error' || bData.status === 'error') {
                throw new Error(gData.message || bData.message || "Error al cargar datos");
            }

            const itemsList = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);
            const rawIntegrantes = gData.integrantes || [];
            
            let integrantes_data: any[] = [];
            let members: any[] = [];

            if (rawIntegrantes.length > 0 && typeof rawIntegrantes[0] === 'object') {
                integrantes_data = rawIntegrantes;
                members = rawIntegrantes; // Devolvemos objetos {id, nombre}
            } else {
                // Fallback si solo vienen IDs (no debería pasar con find_by_id_detailed)
                members = rawIntegrantes.map((id: string) => ({ id, nombre: 'Usuario' }));
                integrantes_data = members;
            }

            // Map balances with user names
            const detailedBalances = Array.isArray(bData.balance_detallado) 
                ? bData.balance_detallado.map((b: any) => {
                    const user = integrantes_data.find(i => i.id === b.usuario_id);
                    return {
                        ...b,
                        persona: user ? user.nombre : "Usuario"
                    };
                })
                : [];

            return {
                groupName: gData.nombre || "Grupo",
                groupCode: gData.codigo_invitacion || "---",
                adminId: gData.administrador_id,
                members,
                integrantes_data,
                activities: itemsList,
                balances: detailedBalances,
                totalSpent: bData.total_gastado_en_grupo || 0
            };
        },
        refetchInterval: 5000, 
        enabled: !!group_id && group_id !== ':group_id'
    });

    const removeMember = async (userId: string) => {
        try {
            const response = await httpClient.delete(`/groups/${group_id}/members/${userId}`);
            if (response.status === 200) {
                toast.success("Miembro eliminado");
                refetch();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Error al eliminar miembro");
        }
    };

    const stats = useMemo(() => {
        if (!data || !myId) return { userShare: 0, userOwed: 0 };

        let miConsumoTotal = 0;
        let miGastoEfectuado = 0;

        data.activities.forEach((item: any) => {
            const monto = parseFloat(item.monto || item.precio || 0);
            const participantes = item.participantes_ids || [];
            if (participantes.includes(myId)) {
                miConsumoTotal += monto / (participantes.length || 1);
            }
            if (item.comprador_id === myId) {
                miGastoEfectuado += monto;
            }
        });

        return {
            userShare: isNaN(miConsumoTotal) ? 0 : miConsumoTotal,
            userOwed: isNaN(miGastoEfectuado - miConsumoTotal) ? 0 : (miGastoEfectuado - miConsumoTotal)
        };
    }, [data, myId]);

    return {
        activeTab, setActiveTab,
        groupName: data?.groupName || '',
        groupCode: data?.groupCode || '',
        members: data?.members || [],
        integrantes_data: data?.integrantes_data || [],
        totalSpent: data?.totalSpent || 0,
        userShare: stats.userShare,
        userOwed: stats.userOwed,
        activities: data?.activities || [],
        balances: data?.balances || [],
        adminId: data?.adminId,
        currentUserId: myId,
        isFetchingGroup: isLoading,
        isRefreshing: isFetching, 
        refresh: refetch,
        removeMember
    };
};