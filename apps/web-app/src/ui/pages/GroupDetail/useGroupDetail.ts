import { useState, useEffect, useCallback } from 'react';

export const useGroupDetail = (group_id: string) => {
    const [activeTab, setActiveTab] = useState<'activity' | 'balances' | 'members'>('activity');
    const [loading, setLoading] = useState(true);
    const [groupName, setGroupName] = useState('');
    const [groupCode, setGroupCode] = useState('');
    const [members, setMembers] = useState<any[]>([]);
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
            const resGroup = await fetch(`http://localhost:8002/api/groups/${group_id}`);
            if (resGroup.ok) {
                const gData = await resGroup.json();
                setGroupName(gData.nombre || "Grupo");
                setGroupCode(gData.codigo_invitacion || "---");
                setMembers(gData.integrantes || []);
            }

            // 2. Obtener ACTIVIDADES (Gastos)
            const resItems = await fetch(`http://localhost:8002/api/groups/${group_id}/items`);
            let itemsList: any[] = [];
            if (resItems.ok) {
                const itemsData = await resItems.json();
                itemsList = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);
                setActivities(itemsList);
            }

            // 3. Obtener BALANCES del Backend (Para la pestaña de Saldos)
            const resBalances = await fetch(`http://localhost:8002/api/groups/${group_id}/balances`);
            if (resBalances.ok) {
                const bData = await resBalances.json();
                setBalances(bData);
                setTotalSpent(bData.total_gastado_en_grupo || 0);
            }

            // 🚩 LÓGICA DE CÁLCULO MANUAL (Para tarjetas de Resumen)
            if (itemsList.length > 0 && myId) {
                let miConsumoTotal = 0;
                let miGastoEfectuado = 0;

                itemsList.forEach(item => {
                    const monto = item.monto || item.precio || 0;
                    const participantes = item.participantes_ids || [];

                    // A) ¿Cuánto consumí de este ticket?
                    if (participantes.includes(myId)) {
                        miConsumoTotal += monto / participantes.length;
                    }

                    // B) ¿Cuánto pagué de mi bolsa en este ticket?
                    if (item.comprador_id === myId) {
                        miGastoEfectuado += monto;
                    }
                });

                // Tu Gasto Individual (Lo que te comiste/usaste)
                setUserShare(miConsumoTotal);

                // Balance Final (Lo que pagaste - Lo que consumiste)
                // Si da positivo: Te deben | Si da negativo: Debes
                setUserOwed(miGastoEfectuado - miConsumoTotal);
            } else {
                setUserShare(0);
                setUserOwed(0);
            }

        } catch (error) {
            console.error("❌ Error cargando el detalle del grupo:", error);
        } finally {
            setLoading(false);
        }
    }, [group_id]);

    useEffect(() => {
        getGroupData();
    }, [getGroupData]);

    return {
        activeTab, setActiveTab,
        groupName, groupCode, members,
        totalSpent, userShare, userOwed,
        activities, balances,
        loading,
        refresh: getGroupData
    };
};