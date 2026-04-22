import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    Grupo, 
    Item, 
    Participant, 
    SyncQueueItem, 
    AppSyncStatus, 
    GrupoStatus,
    SyncActionType
} from '../src/domain/types';
import { groupRepository } from '../src/infrastructure/api/repositories/GroupRepository';
import { useAuth } from './AuthContext';

// Storage Keys
const Grupo_STORAGE_KEY = '@easy_pay_active_Grupo';
const SYNC_QUEUE_KEY = '@easy_pay_sync_queue';

interface GrupoContextData {
    activeGrupo: Grupo | null;
    syncStatus: AppSyncStatus;
    pendingCount: number;
    
    // Actions
    createGrupo: (nombre: string, liderId: string) => Promise<void>;
    joinGrupo: (codigo: string) => Promise<boolean>;
    addItem: (item: Omit<Item, 'id'>) => Promise<void>;
    updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    assignItem: (itemId: string, participantIds: string[]) => Promise<void>;
    closeGrupo: () => Promise<void>;
    
    // UI Helpers
    clearGrupo: () => Promise<void>;
    refreshGrupo: () => Promise<void>;
}

const GrupoContext = createContext<GrupoContextData>({} as GrupoContextData);

export const GrupoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [activeGrupo, setActiveGrupo] = useState<Grupo | null>(null);
    const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
    const [syncStatus, setSyncStatus] = useState<AppSyncStatus>('SYNCED');

    // 1. Initial Load from Persistence
    useEffect(() => {
        loadPersistedData();
    }, []);

    const loadPersistedData = async () => {
        try {
            const [storedGrupo, storedQueue] = await Promise.all([
                AsyncStorage.getItem(Grupo_STORAGE_KEY),
                AsyncStorage.getItem(SYNC_QUEUE_KEY)
            ]);

            if (storedGrupo) setActiveGrupo(JSON.parse(storedGrupo));
            if (storedQueue) setSyncQueue(JSON.parse(storedQueue));
        } catch (error) {
            // Error loading persisted data
        }
    };


    // 2. Persist whenever state changes
    useEffect(() => {
        if (activeGrupo) {
            AsyncStorage.setItem(Grupo_STORAGE_KEY, JSON.stringify(activeGrupo));
        } else {
            AsyncStorage.removeItem(Grupo_STORAGE_KEY);
        }
    }, [activeGrupo]);

    useEffect(() => {
        AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue));
        setSyncStatus(syncQueue.length > 0 ? 'PENDING' : 'SYNCED');
    }, [syncQueue]);

    // 3. Logic & Calculations
    const recalculateTotals = (items: Item[]): { subtotal: number, propina: number, total: number } => {
        const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const tipPercent = subtotal < 3000 ? 0.10 : 0.05;
        const propina = subtotal * tipPercent;
        const total = subtotal + propina;
        
        return { subtotal, propina, total };
    };

    // 4. Persistence & Sync Queue Helpers
    const addToQueue = (tipo: SyncActionType, payload: any) => {
        const newItem: SyncQueueItem = {
            id: Math.random().toString(36).substring(7),
            tipo,
            payload,
            timestamp: new Date().toISOString(),
            reintentos: 0
        };
        setSyncQueue(prev => [...prev, newItem]);
    };

    // 5. Actions
    const createGrupo = async (nombre: string, liderId: string) => {
        try {
            // In the mobile app, we usually have the full user object in AuthContext. 
            // Here we just need the id and basic info to satisfy the repository interface.
            const leader = { id: liderId, name: 'Líder', role: 'leader' };
            const group = await groupRepository.createGroup(leader as any, nombre);
            
            const newGrupo: Grupo = {
                id: group.id,
                codigo: group.code,
                nombre: group.name,
                liderId: group.leaderId,
                participantes: [], 
                items: [],
                subtotal: group.subtotal,
                propina: group.tip,
                total: group.total,
                status: 'ACTIVA' as GrupoStatus,
                creadaEn: group.createdAt
            };
            
            setActiveGrupo(newGrupo);
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    };

    const joinGrupo = async (codigo: string): Promise<boolean> => {
        if (!user?.id) return false;
        try {
            const member = { id: user.id, name: user.nombre, role: 'member' };
            const group = await groupRepository.joinGroup(codigo, member as any);
            
            const newGrupo: Grupo = {
                id: group.id,
                codigo: group.code,
                nombre: group.name,
                liderId: group.leaderId,
                participantes: [], 
                items: [],
                subtotal: group.subtotal,
                propina: group.tip,
                total: group.total,
                status: 'ACTIVA' as GrupoStatus,
                creadaEn: group.createdAt
            };
            
            setActiveGrupo(newGrupo);
            return true;
        } catch (error) {
            console.error('Error joining group:', error);
            return false;
        }
    };


    const addItem = async (itemData: Omit<Item, 'id'>) => {
        if (!activeGrupo) return;

        const newItem: Item = {
            ...itemData,
            id: Math.random().toString(36).substring(7),
        };

        const updatedItems = [...activeGrupo.items, newItem];
        const totals = recalculateTotals(updatedItems);

        setActiveGrupo({
            ...activeGrupo,
            items: updatedItems,
            ...totals
        });

        addToQueue('ADD_ITEM', newItem);
    };

    const updateItem = async (id: string, updates: Partial<Item>) => {
        if (!activeGrupo) return;

        const updatedItems = activeGrupo.items.map(item => 
            item.id === id ? { ...item, ...updates } : item
        );
        const totals = recalculateTotals(updatedItems);

        setActiveGrupo({
            ...activeGrupo,
            items: updatedItems,
            ...totals
        });

        addToQueue('EDIT_ITEM', { id, ...updates });
    };

    const deleteItem = async (id: string) => {
        if (!activeGrupo) return;

        const updatedItems = activeGrupo.items.filter(item => item.id !== id);
        const totals = recalculateTotals(updatedItems);

        setActiveGrupo({
            ...activeGrupo,
            items: updatedItems,
            ...totals
        });

        addToQueue('DELETE_ITEM', { id });
    };

    const assignItem = async (itemId: string, participantIds: string[]) => {
        if (!activeGrupo) return;

        const updatedItems = activeGrupo.items.map(item => 
            item.id === itemId ? { ...item, asignadoA: participantIds } : item
        );

        setActiveGrupo({
            ...activeGrupo,
            items: updatedItems
        });

        addToQueue('ASSIGN_ITEM', { itemId, participantIds });
    };

    const closeGrupo = async () => {
        if (!activeGrupo) return;

        setActiveGrupo({
            ...activeGrupo,
            status: 'CERRADA' as GrupoStatus
        });

        addToQueue('CLOSE_Grupo', { GrupoId: activeGrupo.id });
    };

    const clearGrupo = async () => {
        setActiveGrupo(null);
        await AsyncStorage.removeItem(Grupo_STORAGE_KEY);
    };

    const refreshGrupo = async () => {
        // Fetch latest state from API
        // For now, just load persisted
        await loadPersistedData();
    };

    return (
        <GrupoContext.Provider value={{
            activeGrupo,
            syncStatus,
            pendingCount: syncQueue.length,
            createGrupo,
            joinGrupo,
            addItem,
            updateItem,
            deleteItem,
            assignItem,
            closeGrupo,
            clearGrupo,
            refreshGrupo
        }}>
            {children}
        </GrupoContext.Provider>
    );
};

export const useGrupo = () => {
    const context = useContext(GrupoContext);
    if (!context) {
        throw new Error('useGrupo must be used within a GrupoProvider');
    }
    return context;
};
