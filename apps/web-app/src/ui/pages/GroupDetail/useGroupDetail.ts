import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { groupRepository, userRepository } from '../../../infrastructure/api/repositories';
import { useAuthContext } from '../../context/AuthContext';
import { toast } from 'sonner';
import { httpClient } from '../../../infrastructure/api/http-client';

export const useGroupDetail = (group_id: string) => {
    const [activeTab, setActiveTab] = useState<'activity' | 'balances' | 'members' | 'payments' | 'asignación' | 'actividades' | 'saldos' | 'integrantes'>('actividades');
    const { user } = useAuthContext();
    const myId = user?.id;

    const normalizeId = (id: any) => {
        if (!id) return "";
        if (typeof id === 'string') return id;
        return id.$oid || id.id || id._id || id.toString();
    };

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

            const itemsList = (Array.isArray(itemsData) ? itemsData : (itemsData.items || []))
                .map((item: any) => ({
                    ...item,
                    id: normalizeId(item.id || item._id),
                    comprador_id: normalizeId(item.comprador_id)
                }));

            const rawIntegrantes = gData.integrantes || [];
            let integrantes_data: any[] = [];
            let members: any[] = [];

            if (rawIntegrantes.length > 0 && typeof rawIntegrantes[0] === 'object') {
                integrantes_data = rawIntegrantes.map((m: any) => ({
                    ...m,
                    id: normalizeId(m.id || m._id)
                }));
                members = integrantes_data;
            } else {
                members = rawIntegrantes.map((id: string) => ({ id: normalizeId(id), nombre: 'Usuario' }));
                integrantes_data = members;
            }

            const detailedBalances = Array.isArray(bData.balance_detallado) 
                ? bData.balance_detallado.map((b: any) => {
                    const uId = normalizeId(b.usuario_id);
                    const foundUser = integrantes_data.find(i => i.id === uId);
                    return {
                        ...b,
                        usuario_id: uId,
                        persona: foundUser ? foundUser.nombre : "Usuario"
                    };
                })
                : [];

            return {
                groupName: gData.nombre || "Grupo",
                groupDescription: gData.descripcion || "",
                groupCode: gData.codigo_invitacion || "---",
                adminId: normalizeId(gData.administrador_id),
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

    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

    const removeMember = async (userId: string) => {
        try {
            await groupRepository.removeMember(group_id, userId);
            toast.success("Miembro eliminado");
            refetch();
        } catch (error: any) {
            toast.error(error.message || "Error al eliminar miembro");
        }
    };

    const deleteGroup = async () => {
        if (!myId) return;
        const toastId = toast.loading("Preparando verificación de seguridad...");
        try {
            await userRepository.setupTwoFactor(myId);
            setIs2FAModalOpen(true);
            toast.success("Código de verificación enviado", { id: toastId });
        } catch (error: any) {
            toast.error(error.message || "Error al preparar la seguridad", { id: toastId });
        }
    };

    const confirmDeleteGroup = async () => {
        try {
            await groupRepository.deleteGroup(group_id);
            toast.success("Grupo eliminado correctamente");
            setIs2FAModalOpen(false);
            return true; // Navigation will be handled by the component
        } catch (error: any) {
            toast.error(error.message || "Error al eliminar grupo");
            return false;
        }
    };

    const deleteItem = async (itemId: string) => {
        try {
            await groupRepository.removeItem(group_id, itemId);
            toast.success("Gasto eliminado");
            refetch();
        } catch (error: any) {
            toast.error(error.message || "Error al eliminar gasto");
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
        groupDescription: data?.groupDescription || '',
        groupCode: data?.groupCode || '',
        members: data?.members || [],
        integrantes_data: data?.integrantes_data || [],
        totalSpent: data?.totalSpent || 0,
        userShare: stats.userShare,
        userOwed: stats.userOwed,
        activities: data?.activities || [],
        balances: data?.balances || [],
        adminId: data?.adminId,
        currentUserId: normalizeId(myId),
        isFetchingGroup: isLoading,
        isRefreshing: isFetching, 
        refresh: refetch,
        removeMember,
        deleteGroup,
        confirmDeleteGroup,
        deleteItem,
        is2FAModalOpen,
        setIs2FAModalOpen
    };
};