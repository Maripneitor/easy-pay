import { useState, useEffect, useCallback } from 'react';

export const useGroupDetail = (group_id: string) => {
    const [activeTab, setActiveTab] = useState<'activity' | 'balances' | 'members' | 'payments'>('activity');
    const [loading, setLoading] = useState(true);
    const [groupName, setGroupName] = useState('');
    const [groupCode, setGroupCode] = useState('');
    const [members, setMembers] = useState<any[]>([]);
    const [integrantes_data, setIntegrantesData] = useState<any[]>([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [userShare, setUserShare] = useState(0);
    const [userOwed, setUserOwed] = useState(0);
    const [activities, setActivities] = useState<any[]>([]);
    const [balances, setBalances] = useState<any>(null);

    const getGroupData = useCallback(async () => {
        if (!group_id || group_id === ':group_id' || group_id === 'undefined' || group_id === '') {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const myId = localStorage.getItem('userId');

            // 1. Obtener datos del Grupo
            const resGroup = await fetch(`${import.meta.env.VITE_GROUP_SERVICE_URL ?? 'http://localhost:8002'}/api/groups/${group_id}`);
            if (resGroup.ok) {
                const gData = await resGroup.json();
                setGroupName(gData.nombre || "Grupo");
                setGroupCode(gData.codigo_invitacion || "---");

                // Si integrantes viene como array de IDs, y hay otra propiedad con la data
                // O si integrantes ya trae la data completa
                const rawIntegrantes = gData.integrantes || [];
                if (rawIntegrantes.length > 0 && typeof rawIntegrantes[0] === 'object') {
                    setIntegrantesData(rawIntegrantes);
                    setMembers(rawIntegrantes.map((i: any) => i.id));
                } else {
                    setMembers(rawIntegrantes);
                    // Si solo son IDs, por ahora usamos un mock o esperamos a que se carguen de otra forma
                    // pero para evitar el error 'find' inicializamos como vacio
                    setIntegrantesData([]);
                }
            }

            // ... resto del código ...
            const resItems = await fetch(`${import.meta.env.VITE_GROUP_SERVICE_URL ?? 'http://localhost:8002'}/api/groups/${group_id}/items`);
            let itemsList: any[] = [];
            if (resItems.ok) {
                const itemsData = await resItems.json();
                itemsList = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);
                setActivities(itemsList);
            }

            const resBalances = await fetch(`${import.meta.env.VITE_GROUP_SERVICE_URL ?? 'http://localhost:8002'}/api/groups/${group_id}/balances`);
            if (resBalances.ok) {
                const bData = await resBalances.json();
                setBalances(bData);
                setTotalSpent(bData.total_gastado_en_grupo || 0);
            }

            if (itemsList.length > 0 && myId) {
                let miConsumoTotal = 0;
                let miGastoEfectuado = 0;

                itemsList.forEach(item => {
                    const monto = item.monto || item.precio || 0;
                    const participantes = item.participantes_ids || [];
                    if (participantes.includes(myId)) {
                        miConsumoTotal += monto / participantes.length;
                    }
                    if (item.comprador_id === myId) {
                        miGastoEfectuado += monto;
                    }
                });
                setUserShare(miConsumoTotal);
                setUserOwed(miGastoEfectuado - miConsumoTotal);
            } else {
                setUserShare(0);
                setUserOwed(0);
            }

        } catch (error) {
            // Error cargando el detalle
        } finally {
            setLoading(false);
        }

    }, [group_id]);

    useEffect(() => {
        getGroupData();
    }, [getGroupData]);

    return {
        activeTab, setActiveTab,
        groupName, groupCode, members, integrantes_data,
        totalSpent, userShare, userOwed,
        activities, balances,
        loading,
        refresh: getGroupData
    };
};