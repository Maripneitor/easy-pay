import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    Mesa, 
    Item, 
    Participant, 
    SyncQueueItem, 
    AppSyncStatus, 
    MesaStatus,
    SyncActionType
} from '../src/domain/types';

// Storage Keys
const MESA_STORAGE_KEY = '@easy_pay_active_mesa';
const SYNC_QUEUE_KEY = '@easy_pay_sync_queue';

interface MesaContextData {
    activeMesa: Mesa | null;
    syncStatus: AppSyncStatus;
    pendingCount: number;
    
    // Actions
    createMesa: (nombre: string, liderId: string) => Promise<void>;
    joinMesa: (codigo: string) => Promise<boolean>;
    addItem: (item: Omit<Item, 'id'>) => Promise<void>;
    updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    assignItem: (itemId: string, participantIds: string[]) => Promise<void>;
    closeMesa: () => Promise<void>;
    
    // UI Helpers
    clearMesa: () => Promise<void>;
    refreshMesa: () => Promise<void>;
}

const MesaContext = createContext<MesaContextData>({} as MesaContextData);

export const MesaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeMesa, setActiveMesa] = useState<Mesa | null>(null);
    const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
    const [syncStatus, setSyncStatus] = useState<AppSyncStatus>('SYNCED');

    // 1. Initial Load from Persistence
    useEffect(() => {
        loadPersistedData();
    }, []);

    const loadPersistedData = async () => {
        try {
            const [storedMesa, storedQueue] = await Promise.all([
                AsyncStorage.getItem(MESA_STORAGE_KEY),
                AsyncStorage.getItem(SYNC_QUEUE_KEY)
            ]);

            if (storedMesa) setActiveMesa(JSON.parse(storedMesa));
            if (storedQueue) setSyncQueue(JSON.parse(storedQueue));
        } catch (error) {
            console.error('Error loading persisted data:', error);
        }
    };

    // 2. Persist whenever state changes
    useEffect(() => {
        if (activeMesa) {
            AsyncStorage.setItem(MESA_STORAGE_KEY, JSON.stringify(activeMesa));
        } else {
            AsyncStorage.removeItem(MESA_STORAGE_KEY);
        }
    }, [activeMesa]);

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
    const createMesa = async (nombre: string, liderId: string) => {
        const newMesa: Mesa = {
            id: Math.random().toString(36).substring(7),
            codigo: Math.floor(1000 + Math.random() * 9000).toString(), // 4 digits for simplicity
            nombre,
            liderId,
            participantes: [],
            items: [],
            subtotal: 0,
            propina: 0,
            total: 0,
            status: 'ACTIVA' as MesaStatus,
            creadaEn: new Date().toISOString()
        };
        
        setActiveMesa(newMesa);
        addToQueue('JOIN_MESA', { mesaId: newMesa.id, userId: liderId });
    };

    const joinMesa = async (codigo: string): Promise<boolean> => {
        // Mock join for now
        console.log('Joining mesa with code:', codigo);
        return true;
    };

    const addItem = async (itemData: Omit<Item, 'id'>) => {
        if (!activeMesa) return;

        const newItem: Item = {
            ...itemData,
            id: Math.random().toString(36).substring(7),
        };

        const updatedItems = [...activeMesa.items, newItem];
        const totals = recalculateTotals(updatedItems);

        setActiveMesa({
            ...activeMesa,
            items: updatedItems,
            ...totals
        });

        addToQueue('ADD_ITEM', newItem);
    };

    const updateItem = async (id: string, updates: Partial<Item>) => {
        if (!activeMesa) return;

        const updatedItems = activeMesa.items.map(item => 
            item.id === id ? { ...item, ...updates } : item
        );
        const totals = recalculateTotals(updatedItems);

        setActiveMesa({
            ...activeMesa,
            items: updatedItems,
            ...totals
        });

        addToQueue('EDIT_ITEM', { id, ...updates });
    };

    const deleteItem = async (id: string) => {
        if (!activeMesa) return;

        const updatedItems = activeMesa.items.filter(item => item.id !== id);
        const totals = recalculateTotals(updatedItems);

        setActiveMesa({
            ...activeMesa,
            items: updatedItems,
            ...totals
        });

        addToQueue('DELETE_ITEM', { id });
    };

    const assignItem = async (itemId: string, participantIds: string[]) => {
        if (!activeMesa) return;

        const updatedItems = activeMesa.items.map(item => 
            item.id === itemId ? { ...item, asignadoA: participantIds } : item
        );

        setActiveMesa({
            ...activeMesa,
            items: updatedItems
        });

        addToQueue('ASSIGN_ITEM', { itemId, participantIds });
    };

    const closeMesa = async () => {
        if (!activeMesa) return;

        setActiveMesa({
            ...activeMesa,
            status: 'CERRADA' as MesaStatus
        });

        addToQueue('CLOSE_MESA', { mesaId: activeMesa.id });
    };

    const clearMesa = async () => {
        setActiveMesa(null);
        await AsyncStorage.removeItem(MESA_STORAGE_KEY);
    };

    const refreshMesa = async () => {
        // Fetch latest state from API
        // For now, just load persisted
        await loadPersistedData();
    };

    return (
        <MesaContext.Provider value={{
            activeMesa,
            syncStatus,
            pendingCount: syncQueue.length,
            createMesa,
            joinMesa,
            addItem,
            updateItem,
            deleteItem,
            assignItem,
            closeMesa,
            clearMesa,
            refreshMesa
        }}>
            {children}
        </MesaContext.Provider>
    );
};

export const useMesa = () => {
    const context = useContext(MesaContext);
    if (!context) {
        throw new Error('useMesa must be used within a MesaProvider');
    }
    return context;
};
