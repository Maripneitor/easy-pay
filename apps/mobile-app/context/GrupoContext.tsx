/**
 * GrupoContext.tsx — Contexto unificado
 * Reemplaza tanto MesaContext como el GrupoContext anterior.
 * Exporta `useGrupo` (nuevo) y `useMesa` (alias para compatibilidad).
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wsClient } from '../src/infrastructure/api/mobile-websocket';
import { groupRepository } from '../src/infrastructure/api/repositories/GroupRepository';
import { useAuth } from './AuthContext';

const STORAGE_KEY = '@easy_pay_active_grupo';
const SYNC_QUEUE_KEY = '@easy_pay_sync_queue';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type GrupoStatus = 'ACTIVA' | 'CERRADA' | 'PENDIENTE';
export type SyncActionType = 'CREATE_GRUPO' | 'JOIN_GRUPO' | 'ADD_ITEM' | 'EDIT_ITEM' | 'DELETE_ITEM' | 'ASSIGN_ITEM' | 'CLOSE_GRUPO';
export type AppSyncStatus = 'SYNCED' | 'PENDING' | 'ERROR';

export interface Participant {
    id: string;
    nombre: string;
    role: 'leader' | 'member';
    avatar?: string;
    color?: string;
    status?: string;
    isLeader?: boolean;
}

export interface Item {
    id: string;
    nombre: string;
    description?: string;
    precio: number;
    amount?: number;
    cantidad: number;
    autorId: string;
    addedBy?: string;
    asignadoA: string[];
    assignedTo?: string[];
    avatars?: string[];
}

export interface Grupo {
    id: string;
    codigo: string;         // Código QR / numérico para unirse
    nombre: string;
    liderId: string;
    participantes: Participant[];
    items: Item[];
    subtotal: number;
    propina: number;
    total: number;
    status: GrupoStatus;
    creadaEn: string;
}

interface SyncQueueItem {
    id: string;
    tipo: SyncActionType;
    payload: any;
    timestamp: string;
    reintentos: number;
}

interface GrupoContextData {
    activeGrupo: Grupo | null;
    activeMesa: Grupo | null;       // Alias para compatibilidad
    syncStatus: AppSyncStatus;
    pendingCount: number;

    createGrupo: (nombre: string, liderId: string) => Promise<string>;
    createMesa: (nombre: string, liderId: string) => Promise<void>; // Alias
    joinGrupo: (codigo: string) => Promise<boolean>;
    joinMesa: (codigo: string) => Promise<boolean>;                 // Alias
    addItem: (item: Omit<Item, 'id'>) => Promise<void>;
    updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    assignItem: (itemId: string, participantIds: string[]) => Promise<void>;
    addParticipant: (participant: Omit<Participant, 'id'> & { id?: string }) => Promise<void>;
    closeGrupo: () => Promise<void>;
    closeMesa: () => Promise<void>;                                 // Alias
    clearGrupo: () => Promise<void>;
    clearMesa: () => Promise<void>;                                 // Alias
    refreshGrupo: () => Promise<void>;
    refreshMesa: () => Promise<void>;                               // Alias
    calculateUserDebt: (participantId: string) => number;
    loadGroupDetails: (id: string) => Promise<void>;
}

const GrupoContext = createContext<GrupoContextData>({} as GrupoContextData);

function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

function makeId(): string {
    return Math.random().toString(36).substring(2, 10);
}

export const GrupoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, token } = useAuth();
    const [activeGrupo, setActiveGrupo] = useState<Grupo | null>(null);
    const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
    const [syncStatus, setSyncStatus] = useState<AppSyncStatus>('SYNCED');
    const [isLoading, setIsLoading] = useState(false);

    // ── Persistencia ──────────────────────────────────────────────────────────
    useEffect(() => {
        loadPersistedData();
    }, []);

    useEffect(() => {
        if (activeGrupo) {
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activeGrupo)).catch(() => {});
        } else {
            AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
        }
    }, [activeGrupo]);

    useEffect(() => {
        AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue)).catch(() => {});
        setSyncStatus(syncQueue.length > 0 ? 'PENDING' : 'SYNCED');
    }, [syncQueue]);

    // WebSocket subscription
    useEffect(() => {
        if (activeGrupo?.id && token) {
            console.info(`[GrupoContext] Connecting WS for group ${activeGrupo.id}`);
            wsClient.connect(activeGrupo.id, token);
            
            wsClient.on('group_updated', (updatedData) => {
                console.info('[GrupoContext] Group updated via WS');
                setActiveGrupo(prev => ({ ...prev, ...updatedData }));
                setSyncStatus('SYNCED');
            });
        }
        return () => {
            if (activeGrupo?.id) {
                console.info(`[GrupoContext] Disconnecting WS for group ${activeGrupo.id}`);
                wsClient.disconnect();
            }
        };
    }, [activeGrupo?.id, token]);

    const loadPersistedData = async () => {
        try {
            const [storedGrupo, storedQueue] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEY),
                AsyncStorage.getItem(SYNC_QUEUE_KEY),
            ]);
            if (storedGrupo) setActiveGrupo(JSON.parse(storedGrupo));
            if (storedQueue) setSyncQueue(JSON.parse(storedQueue));
        } catch { /* silencioso */ }
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const recalculateTotals = (items: Item[]) => {
        const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const tipPercent = subtotal < 3000 ? 0.10 : 0.05;
        const propina = subtotal * tipPercent;
        return { subtotal, propina, total: subtotal + propina };
    };

    const addToQueue = (tipo: SyncActionType, payload: any) => {
        setSyncQueue(prev => [...prev, {
            id: makeId(),
            tipo,
            payload,
            timestamp: new Date().toISOString(),
            reintentos: 0,
        }]);
    };

    const calculateUserDebt = useCallback((participantId: string): number => {
        if (!activeGrupo) return 0;
        
        // 1. Gasto base en ítems (prorrateo)
        let base = activeGrupo.items.reduce((acc, item) => {
            const participantes = item.asignadoA || item.assignedTo || [];
            if (participantes.includes(participantId)) {
                const count = participantes.length || 1;
                return acc + (item.precio * item.cantidad / count);
            }
            return acc;
        }, 0);

        // 2. Propina grupal dinámica
        const tipPercent = activeGrupo.subtotal < 3000 ? 0.10 : 0.05;
        const totalPropina = activeGrupo.subtotal * tipPercent;
        const cuotaPropina = activeGrupo.participantes.length > 0 
            ? totalPropina / activeGrupo.participantes.length 
            : 0;

        // El usuario debe su base + su parte de la propina
        let debt = base + cuotaPropina;

        // 🚩 CRÍTICO: La propina la paga el líder/admin al restaurante, 
        // por lo tanto, se le resta de su "deuda" (se le abona).
        const isLeader = participantId === activeGrupo.liderId || participantId === (activeGrupo as any).admin_id;
        if (isLeader) {
            debt -= totalPropina;
        }

        return debt;
    }, [activeGrupo]);

    // ── Acciones ──────────────────────────────────────────────────────────────
    const createGrupo = async (nombre: string, liderId: string) => {
        const newGrupo: Grupo = {
            id: makeId(),
            codigo: generateCode(),
            nombre,
            liderId,
            participantes: [{
                id: liderId,
                nombre: 'Tú (Líder)',
                role: 'leader',
                isLeader: true,
                color: '#2196F3',
                status: 'online',
            }],
            items: [],
            subtotal: 0,
            propina: 0,
            total: 0,
            status: 'ACTIVA',
            creadaEn: new Date().toISOString(),
        };
        setActiveGrupo(newGrupo);
        addToQueue('CREATE_GRUPO', { grupoId: newGrupo.id, liderId });
        return newGrupo.id;
    };

    const joinGrupo = async (codigo: string): Promise<boolean> => {
        // TODO: conectar con el backend real
        // Por ahora simulamos una unión exitosa si el código tiene 4-6 dígitos
        if (codigo.length >= 4 && codigo.length <= 6) {
            // Si ya hay un grupo activo con ese código, agregamos al participante
            // Si no, creamos uno de prueba (cuando el backend esté listo esto se cambia)
            return true;
        }
        return false;
    };

    const addParticipant = async (participant: Omit<Participant, 'id'> & { id?: string }) => {
        if (!activeGrupo) return;
        const newParticipant: Participant = {
            ...participant,
            id: participant.id ?? makeId(),
        };
        setActiveGrupo(prev => prev ? {
            ...prev,
            participantes: [...prev.participantes, newParticipant],
        } : prev);
    };

    const addItem = async (itemData: Omit<Item, 'id'>) => {
        if (!activeGrupo) return;
        setSyncStatus('PENDING');
        const newItem: Item = {
            ...itemData,
            id: makeId(),
            asignadoA: itemData.asignadoA ?? [],
            avatars: [],
        };
        const updatedItems = [...activeGrupo.items, newItem];
        const totals = recalculateTotals(updatedItems);
        setActiveGrupo({ ...activeGrupo, items: updatedItems, ...totals });
        
        try {
            await groupRepository.addItem(activeGrupo.id, newItem);
            setSyncStatus('SYNCED');
        } catch (error) {
            addToQueue('ADD_ITEM', newItem);
        }
    };

    const updateItem = async (id: string, updates: Partial<Item>) => {
        if (!activeGrupo) return;
        const updatedItems = activeGrupo.items.map(item =>
            item.id === id ? { ...item, ...updates } : item
        );
        const totals = recalculateTotals(updatedItems);
        setActiveGrupo({ ...activeGrupo, items: updatedItems, ...totals });
        addToQueue('EDIT_ITEM', { id, ...updates });
    };

    const deleteItem = async (id: string) => {
        if (!activeGrupo) return;
        const updatedItems = activeGrupo.items.filter(item => item.id !== id);
        const totals = recalculateTotals(updatedItems);
        setActiveGrupo({ ...activeGrupo, items: updatedItems, ...totals });
        addToQueue('DELETE_ITEM', { id });
    };

    const assignItem = async (itemId: string, participantIds: string[]) => {
        if (!activeGrupo) return;
        const updatedItems = activeGrupo.items.map(item =>
            item.id === itemId ? { ...item, asignadoA: participantIds } : item
        );
        setActiveGrupo({ ...activeGrupo, items: updatedItems });
        addToQueue('ASSIGN_ITEM', { itemId, participantIds });
    };

    const closeGrupo = async () => {
        if (!activeGrupo) return;
        setSyncStatus('PENDING');
        try {
            await groupRepository.closeGroup(activeGrupo.id);
            setActiveGrupo({ ...activeGrupo, status: 'CERRADA' });
            setSyncStatus('SYNCED');
        } catch (error) {
            console.error(error);
            addToQueue('CLOSE_GRUPO', { grupoId: activeGrupo.id });
        }
    };

    const clearGrupo = async () => {
        setActiveGrupo(null);
        await AsyncStorage.removeItem(STORAGE_KEY);
    };

    const refreshGrupo = async () => {
        await loadPersistedData();
    };

    const loadGroupDetails = async (id: string) => {
        // Al ser una app móvil, intentamos cargar desde el repo real
        try {
            console.log(`📡 [GrupoContext] Cargando detalles reales para el grupo: ${id}`);
            const data = await groupRepository.getGroup(id);
            setActiveGrupo(data);
        } catch (error) {
            console.error("❌ [GrupoContext] Error cargando grupo:", error);
        }
    };

    const value: GrupoContextData = {
        activeGrupo,
        activeMesa: activeGrupo,        // Alias
        syncStatus,
        pendingCount: syncQueue.length,
        createGrupo,
        createMesa: createGrupo,        // Alias
        joinGrupo,
        joinMesa: joinGrupo,            // Alias
        addItem,
        updateItem,
        deleteItem,
        assignItem,
        addParticipant,
        closeGrupo,
        closeMesa: closeGrupo,          // Alias
        clearGrupo,
        clearMesa: clearGrupo,          // Alias
        refreshGrupo,
        refreshMesa: refreshGrupo,      // Alias
        calculateUserDebt,
        loadGroupDetails,
    };

    return (
        <GrupoContext.Provider value={value}>
            {children}
        </GrupoContext.Provider>
    );
};

// Hook principal
export const useGrupo = () => {
    const ctx = useContext(GrupoContext);
    if (!ctx) throw new Error('useGrupo must be used within GrupoProvider');
    return ctx;
};

// Alias para compatibilidad con archivos que usan useMesa
export const useMesa = useGrupo;
