import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupRepository, userRepository } from '../../../infrastructure/api/repositories';
import { useAuthContext } from '../../context/AuthContext';
import { toast } from 'sonner';

const normalizeId = (id: any) => {
    if (!id) return "";
    if (typeof id === 'string') return id;
    return id.$oid || id.id || id._id || id.toString();
};

export const useGroups = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthContext();
    const userId = user?.id;
    const navigate = useNavigate();
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

    const fetchGroups = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
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
                setGroups(groupsWithBalances);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            toast.error("Error al cargar los grupos");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const [groupsToDelete, setGroupsToDelete] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedIds([]);
    };

    const toggleIdSelection = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const deleteGroup = async (groupId: string) => {
        if (!userId) return;
        const toastId = toast.loading("Preparando verificación de seguridad...");
        try {
            await userRepository.setupTwoFactor(userId);
            setGroupsToDelete([groupId]);
            setIs2FAModalOpen(true);
            toast.success("Código de verificación enviado", { id: toastId });
        } catch (error: any) {
            toast.error(error.message || "Error al preparar la seguridad", { id: toastId });
        }
    };

    const deleteSelectedGroups = async () => {
        if (!userId || selectedIds.length === 0) return;
        const toastId = toast.loading("Preparando verificación de seguridad...");
        try {
            await userRepository.setupTwoFactor(userId);
            setGroupsToDelete(selectedIds);
            setIs2FAModalOpen(true);
            toast.success("Código de verificación enviado", { id: toastId });
        } catch (error: any) {
            toast.error(error.message || "Error al preparar la seguridad", { id: toastId });
        }
    };

    const [deletedGroups, setDeletedGroups] = useState<any[]>(() => {
        const stored = localStorage.getItem('recently_deleted_groups');
        return stored ? JSON.parse(stored) : [];
    });

    const confirmDeleteGroup = async () => {
        if (groupsToDelete.length === 0) return;
        try {
            const newDeletedHistory = [...deletedGroups];
            
            for (const id of groupsToDelete) {
                const groupInfo = groups.find(g => g.id === id);
                await groupRepository.deleteGroup(id);
                
                if (groupInfo) {
                    newDeletedHistory.unshift({ ...groupInfo, deletedAt: new Date().toISOString() });
                }
            }

            const trimmedHistory = newDeletedHistory.slice(0, 15);
            setDeletedGroups(trimmedHistory);
            localStorage.setItem('recently_deleted_groups', JSON.stringify(trimmedHistory));

            setGroups(prev => prev.filter(g => !groupsToDelete.includes(g.id)));
            toast.success(groupsToDelete.length === 1 ? "Grupo eliminado" : `${groupsToDelete.length} grupos eliminados`);
            
            setIs2FAModalOpen(false);
            setGroupsToDelete([]);
            setSelectedIds([]);
            setIsSelectionMode(false);
        } catch (error: any) {
            toast.error("Error al eliminar los grupos");
            throw error;
        }
    };

    const createGroup = async (name: string, description: string) => {
        if (!user) return;
        try {
            const newGroup = await groupRepository.createGroup(user as any, name);
            if (description) {
                await groupRepository.updateGroup(newGroup.id, name, description);
            }
            fetchGroups();
            toast.success("Grupo creado correctamente");
            return newGroup;
        } catch (error) {
            toast.error("Error al crear el grupo");
            throw error;
        }
    };

    const updateGroup = async (groupId: string, name: string, description: string) => {
        try {
            await groupRepository.updateGroup(groupId, name, description);
            setGroups(prev => prev.map(g => g.id === groupId ? { ...g, nombre: name, descripcion: description } : g));
            toast.success("Grupo actualizado correctamente");
        } catch (error) {
            toast.error("Error al actualizar el grupo");
            throw error;
        }
    };

    const joinGroup = async (code: string) => {
        if (!user) return;
        try {
            await groupRepository.joinGroup(code, user as any);
            fetchGroups();
            toast.success("Te has unido al grupo");
        } catch (error: any) {
            toast.error(error.message || "Código inválido o ya estás en el grupo");
            throw error;
        }
    };

    return {
        groups,
        isLoading,
        deleteGroup,
        confirmDeleteGroup,
        is2FAModalOpen,
        setIs2FAModalOpen,
        userId,
        createGroup,
        updateGroup,
        joinGroup,
        deletedGroups,
        isSelectionMode,
        toggleSelectionMode,
        selectedIds,
        toggleIdSelection,
        deleteSelectedGroups,
        refresh: fetchGroups,
        navigate
    };
};
