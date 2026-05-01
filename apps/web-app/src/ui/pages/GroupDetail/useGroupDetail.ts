import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../infrastructure/api/http-client';

export const useGroupDetail = (group_id: string) => {
    const [activeTab, setActiveTab] = useState<'activity' | 'balances' | 'members' | 'payments'>('activity');
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

            const itemsList = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);
            const rawIntegrantes = gData.integrantes || [];
            
            let integrantes_data: any[] = [];
            let members: string[] = [];

            if (rawIntegrantes.length > 0 && typeof rawIntegrantes[0] === 'object') {
                integrantes_data = rawIntegrantes;
                members = rawIntegrantes.map((i: any) => i.id);
            } else {
                members = rawIntegrantes;
                integrantes_data = [];
            }

            return {
                groupName: gData.nombre || "Grupo",
                groupCode: gData.codigo_invitacion || "---",
                adminId: gData.administrador_id,
                members,
                integrantes_data,
                activities: itemsList,
                balances: bData,
                totalSpent: bData.total_gastado_en_grupo || 0
            };
        },
        refetchInterval: 5000, // ⚡ Polling every 5 seconds
        enabled: !!group_id && group_id !== ':group_id'
    });

    const stats = useMemo(() => {
        if (!data || !myId) return { userShare: 0, userOwed: 0 };

        let miConsumoTotal = 0;
        let miGastoEfectuado = 0;

        data.activities.forEach((item: any) => {
            const monto = item.monto || item.precio || 0;
            const participantes = item.participantes_ids || [];
            if (participantes.includes(myId)) {
                miConsumoTotal += monto / participantes.length;
            }
            if (item.comprador_id === myId) {
                miGastoEfectuado += monto;
            }
        });

        return {
            userShare: miConsumoTotal,
            userOwed: miGastoEfectuado - miConsumoTotal
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
        balances: data?.balances || null,
        adminId: data?.adminId,
        currentUserId: myId,
        loading: isLoading,
        isRefreshing: isFetching, // To show subtle progress bar
        refresh: refetch
    };
};