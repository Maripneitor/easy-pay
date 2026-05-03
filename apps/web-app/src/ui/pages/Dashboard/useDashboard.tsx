import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupRepository, statsRepository, paymentRepository, userRepository } from '../../../infrastructure/api/repositories';
import { httpClient } from '../../../infrastructure/api/http-client';
import { useAuthContext } from '../../context/AuthContext';
import { toast } from 'sonner';

const normalizeId = (id: any) => {
    if (!id) return "";
    if (typeof id === 'string') return id;
    return id.$oid || id.id || id._id || id.toString();
};

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
                        const myInfo = bList.find((b: any) => normalizeId(b.usuario_id) === normalizeId(userId));

                        return {
                            ...group,
                            id: normalizeId(group.id || group._id),
                            admin_id: normalizeId(group.admin_id || group.administrador_id),
                            total_gastado: bData.total_gastado_en_grupo || 0,
                            mi_balance: myInfo?.balance || 0,
                            integrantes: (group.integrantes || []).map((i: any) => ({
                                ...i,
                                id: normalizeId(i.id || i._id)
                            }))
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

    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

    const deleteGroup = async (groupId: string) => {
        if (!userId) return;
        const toastId = toast.loading("Preparando verificación de seguridad...");
        try {
            await userRepository.setupTwoFactor(userId);
            setGroupToDelete(groupId);
            setIs2FAModalOpen(true);
            toast.success("Código de verificación enviado", { id: toastId });
        } catch (error: any) {
            toast.error(error.message || "Error al preparar la seguridad", { id: toastId });
        }
    };

    const confirmDeleteGroup = async () => {
        if (!groupToDelete) return;
        try {
            const groupInfo = allActiveGroups.find(g => g.id === groupToDelete) || settledGroups.find(g => g.id === groupToDelete);
            await groupRepository.deleteGroup(groupToDelete);
            
            // Persistir en historial (Mobile Parity / History)
            if (groupInfo) {
                const stored = localStorage.getItem('recently_deleted_groups');
                const deletedHistory = stored ? JSON.parse(stored) : [];
                const newDeleted = [
                    { ...groupInfo, deletedAt: new Date().toISOString() },
                    ...deletedHistory
                ].slice(0, 15);
                localStorage.setItem('recently_deleted_groups', JSON.stringify(newDeleted));
            }

            setIs2FAModalOpen(false);
            setAllActiveGroups(prev => prev.filter(g => g.id !== groupToDelete));
            setSettledGroups(prev => prev.filter(g => g.id !== groupToDelete));
            if (stats) {
                setStats((prev: any) => ({ ...prev, groups_count: Math.max(0, (prev?.groups_count || 1) - 1) }));
            }
            
            setGroupToDelete(null);
            toast.success('Grupo eliminado correctamente');
        } catch (error: any) {
            toast.error(error.message || 'Error al eliminar el grupo');
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
        deleteGroup,
        confirmDeleteGroup,
        is2FAModalOpen,
        setIs2FAModalOpen,
        userId
    };
};