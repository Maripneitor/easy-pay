import { useState, useEffect, useCallback } from 'react';

export const useGroupDetail = (group_id: string) => {
    // 🚩 CORREGIDO: Tenía doble guion bajo antes
    console.log("🛠️ Hook instanciado con group_id:", group_id);

    const [activeTab, setActiveTab] = useState<'activity' | 'balances' | 'members'>('activity');
    const [loading, setLoading] = useState(true);
    const [groupName, setGroupName] = useState('');
    const [groupCode, setGroupCode] = useState('');
    const [members, setMembers] = useState<string[]>([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [userShare, setUserShare] = useState(0);
    const [userOwed, setUserOwed] = useState(0);
    const [activities, setActivities] = useState([]);
    const [balances, setBalances] = useState<any>(null);

    const getGroupData = useCallback(async () => {
        if (!group_id || group_id === ':group_id' || group_id === 'undefined') {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // 1. Datos del Grupo
            const resGroup = await fetch(`http://localhost:8002/api/groups/${group_id}`);
            if (resGroup.ok) {
                const gData = await resGroup.json();
                setGroupName(gData.nombre || gData.name || "Grupo");
                setGroupCode(gData.codigo_invitacion || "---");
                setMembers(gData.integrantes || []);
            }

            // 2. Actividades
            const resItems = await fetch(`http://localhost:8002/api/groups/${group_id}/items`);
            if (resItems.ok) {
                const itemsData = await resItems.json();
                setActivities(Array.isArray(itemsData) ? itemsData : []);
            }

            // 3. Balances
            const resBalances = await fetch(`http://localhost:8002/api/groups/${group_id}/balances`);
            if (resBalances.ok) {
                const bData = await resBalances.json();
                if (bData.status === "success") {
                    setBalances(bData);
                    setTotalSpent(bData.total_gastado_en_grupo || 0);
                    const myId = localStorage.getItem('userId');
                    const bList = bData.balances || bData.balance_detallado || [];
                    const myBalance = bList.find((b: any) => b.usuario_id === myId);
                    if (myBalance) {
                        setUserOwed(myBalance.balance || 0);
                        setUserShare(myBalance.cuota_correspondiente || 0);
                    }
                }
            }
        } catch (error) {
            console.error("❌ ERROR EN FETCH:", error);
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