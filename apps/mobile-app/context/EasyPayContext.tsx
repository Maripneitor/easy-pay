import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { TokenStorage } from '../src/infrastructure/security/TokenStorage';
import { User, Grupo, Participant, Item, GrupoStatus } from '../src/domain/types';
import { groupRepository } from '../src/infrastructure/api/repositories/GroupRepository';
import { paymentRepository } from '../src/infrastructure/api/repositories/PaymentRepository';
import { wsClient } from '../src/infrastructure/api/mobile-websocket';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '../src/infrastructure/context/NotificationContext';
import { userRepository } from '../src/infrastructure/api/repositories/UserRepository';

// --- Types from PaymentContext ---
export type PaymentMethod = 'cash' | 'card' | 'transfer';
export type PaymentStatus = 'pending' | 'waiting_confirmation' | 'confirmed' | 'rejected';

export interface SavedCard {
    id: string;
    token: string;
    last4: string;
    brand: string;
    holder: string;
    expiry: string;
    colors: string[];
    isDefault: boolean;
    createdAt: number;
}

export interface Debt {
    id: string;
    groupId: string;
    groupName: string;
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    amount: number;
    concept: string;
    createdAt: number;
}

export interface Payment {
    id: string;
    debtId: string;
    groupId: string;
    groupName: string;
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    note?: string;
    witnessId?: string;
    witnessName?: string;
    witnessConfirmed?: boolean;
    receiverConfirmed?: boolean;
    createdAt: number;
    confirmedAt?: number;
    concept: string;
}

// --- Context Type ---
interface EasyPayContextType {
    // Auth
    user: User | null;
    token: string | null;
    isLoading: boolean;
    loginAsGuest: (name: string, groupCode?: string) => Promise<void>;
    logout: () => Promise<void>;
    saveSession: (token: string, userData: User) => Promise<void>;
    saveGuestSession: (user: User) => Promise<void>;
    
    // Auth Flow Methods
    setupTwoFactor: (userId: string) => Promise<any>;
    verifyTwoFactor: (userId: string, code: string) => Promise<any>;
    requestPasswordReset: (email: string) => Promise<any>;
    changePassword: (userId: string, data: any) => Promise<any>;

    // Groups
    activeGrupo: Grupo | null;
    refreshGrupo: () => Promise<void>;
    createGrupo: (nombre: string, liderId: string) => Promise<string>;
    joinGrupo: (codigo: string) => Promise<boolean>;
    addItem: (item: Omit<Item, 'id'>) => Promise<void>;
    updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    assignItem: (itemId: string, participantIds: string[]) => Promise<void>;
    startSettlement: (selectedAccounts: any[]) => Promise<void>;
    closeGrupo: (tip: number, total: number) => Promise<void>;
    clearGrupo: () => Promise<void>;
    calculateUserDebt: (participantId: string) => number;
    loadGroupDetails: (id: string) => Promise<void>;

    // Payments
    debts: Debt[];
    payments: Payment[];
    cards: SavedCard[];
    initiatePayment: (data: Omit<Payment, 'id' | 'createdAt' | 'status'>) => Promise<Payment>;
    fetchFinancialData: () => Promise<void>;
    addCard: (card: Omit<SavedCard, 'id' | 'createdAt' | 'isDefault'>) => Promise<void>;
    removeCard: (id: string) => Promise<void>;
    setDefaultCard: (id: string) => Promise<void>;

    // Sync / NetInfo
    isOnline: boolean;
}

const EasyPayContext = createContext<EasyPayContextType | undefined>(undefined);

const STORAGE_KEYS = {
    USER: 'user_data',
    ACTIVE_GRUPO: '@easy_pay_active_grupo',
    PAYMENTS: 'easypay_payments',
};

export const EasyPayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Group State
    const [activeGrupo, setActiveGrupo] = useState<Grupo | null>(null);
    const [balances, setBalances] = useState<any[]>([]);

    // Payment State
    const [debts, setDebts] = useState<Debt[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [cards, setCards] = useState<SavedCard[]>([]);
    const { notifyUserJoined, notifyGroupClosed, notifyItemAssigned } = useNotifications();
    const [realStats, setRealStats] = useState({ totalOwed: 0, totalToReceive: 0 });

    // Connectivity State
    const [isOnline, setIsOnline] = useState(true);

    // --- Helpers ---
    const makeId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // --- Connectivity Effect ---
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(!!state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    // --- Initial Load ---
    useEffect(() => {
        const init = async () => {
            try {
                // Load Auth
                const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
                if (savedUser) {
                    const parsedUser = JSON.parse(savedUser) as User;
                    setUser(parsedUser);
                    if (!parsedUser.isGuest) {
                        const savedToken = await TokenStorage.getToken();
                        if (savedToken) setToken(savedToken);
                    }
                }

                // Load Group
                const savedGrupo = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_GRUPO);
                if (savedGrupo) {
                    setActiveGrupo(JSON.parse(savedGrupo));
                }

                // Load Payments
                const savedPayments = await AsyncStorage.getItem(STORAGE_KEYS.PAYMENTS);
                if (savedPayments) {
                    const parsed = JSON.parse(savedPayments);
                    setDebts(parsed.debts ?? []);
                    setPayments(parsed.payments ?? []);
                }
            } catch (e) {
                console.error('Error initializing EasyPay state:', e);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // --- Persistence Effects ---
    useEffect(() => {
        if (activeGrupo) {
            AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_GRUPO, JSON.stringify(activeGrupo)).catch(() => {});
        } else {
            AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_GRUPO).catch(() => {});
        }
    }, [activeGrupo]);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify({ debts, payments })).catch(() => {});
    }, [debts, payments]);

    // --- WebSocket Logic ---
    useEffect(() => {
        if (activeGrupo?.id && token && isOnline) {
            wsClient.connect(activeGrupo.id, token);
            
            wsClient.on('group_updated', (updatedData) => {
                setActiveGrupo(prev => prev ? ({ ...prev, ...updatedData }) : updatedData);
            });

            wsClient.on('user_joined', (data) => {
                notifyUserJoined(data.nombre, activeGrupo.nombre || 'Grupo', activeGrupo.id);
            });

            wsClient.on('item_assigned', (data) => {
                notifyItemAssigned(data.item_nombre, data.monto, data.asignado_por, activeGrupo.id);
            });
        }
        return () => {
            if (activeGrupo?.id) wsClient.disconnect();
        };
    }, [activeGrupo?.id, token, isOnline]);

    // --- Auth Actions ---
    const saveSession = async (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        await TokenStorage.setToken(newToken);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    };

    // --- Auth Flow Implementation ---
    const setupTwoFactor = async (userId: string) => {
        return await userRepository.setupTwoFactor(userId);
    };

    const verifyTwoFactor = async (userId: string, code: string) => {
        return await userRepository.verifyTwoFactor(userId, code);
    };

    const requestPasswordReset = async (email: string) => {
        return await userRepository.requestPasswordReset(email);
    };

    const changePassword = async (userId: string, data: any) => {
        return await userRepository.changePassword(userId, data);
    };

    const saveGuestSession = async (newUser: User) => {
        const guest = { ...newUser, isGuest: true };
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(guest));
        setUser(guest);
        setToken(null);
    };

    const logout = async () => {
        await TokenStorage.clear();
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
        await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_GRUPO);
        setToken(null);
        setUser(null);
        setActiveGrupo(null);
    };

    // --- Group Actions ---
    const recalculateTotals = (items: Item[]) => {
        const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const tipPercent = subtotal < 3000 ? 0.10 : 0.05;
        const propina = subtotal * tipPercent;
        return { subtotal, propina, total: subtotal + propina };
    };

    const createGrupo = async (nombre: string, liderId: string) => {
        const newId = makeId('grp');
        const newGrupo: Grupo = {
            id: newId,
            codigo: Math.floor(100000 + Math.random() * 900000).toString(),
            nombre,
            liderId,
            participantes: [{
                id: liderId,
                nombre: user?.nombre || 'Tú',
                role: 'leader',
                isLeader: true,
                color: '#2196F3',
                status: 'online',
                avatar: user?.avatar || '',
                debt: 0
            } as any], // Cast because of slight type mismatches in project
            items: [],
            subtotal: 0,
            propina: 0,
            total: 0,
            status: 'active' as any,
            creadaEn: new Date().toISOString(),
        };
        setActiveGrupo(newGrupo);
        // In a real app, we'd call groupRepository here if online
        return newId;
    };

    const joinGrupo = async (codigo: string): Promise<boolean> => {
        // Mock join for now as in GrupoContext
        return codigo.length >= 4 && codigo.length <= 6;
    };

    const addItem = async (itemData: Omit<Item, 'id'>) => {
        if (!activeGrupo) return;
        const newItem: Item = { ...itemData, id: makeId('itm') };
        const updatedItems = [...activeGrupo.items, newItem];
        const totals = recalculateTotals(updatedItems);
        setActiveGrupo({ ...activeGrupo, items: updatedItems, ...totals });
        
        if (isOnline) {
            try {
                await groupRepository.addItem(activeGrupo.id, newItem);
            } catch (error) {
                console.warn('Failed to sync item, will be cached locally');
            }
        }
    };

    const updateItem = async (id: string, updates: Partial<Item>) => {
        if (!activeGrupo) return;
        const updatedItems = activeGrupo.items.map(item =>
            item.id === id ? { ...item, ...updates } : item
        );
        const totals = recalculateTotals(updatedItems);
        setActiveGrupo({ ...activeGrupo, items: updatedItems, ...totals });
    };

    const deleteItem = async (id: string) => {
        if (!activeGrupo) return;
        const updatedItems = activeGrupo.items.filter(item => item.id !== id);
        const totals = recalculateTotals(updatedItems);
        setActiveGrupo({ ...activeGrupo, items: updatedItems, ...totals });
    };

    const assignItem = async (itemId: string, participantIds: string[]) => {
        if (!activeGrupo) return;
        const updatedItems = activeGrupo.items.map(item =>
            item.id === itemId ? { ...item, asignadoA: participantIds } : item
        );
        setActiveGrupo({ ...activeGrupo, items: updatedItems });
    };

    const startSettlement = async (selectedAccounts: any[]) => {
        if (!activeGrupo || !isOnline) return;
        try {
            await groupRepository.startSettlement(activeGrupo.id, selectedAccounts);
        } catch (error) {
            console.error('Failed to start settlement:', error);
        }
    };

    const closeGrupo = async (tip: number, total: number) => {
        if (!activeGrupo) return;
        setActiveGrupo({ ...activeGrupo, status: 'closed' as any, propina: tip, total: total });
        if (isOnline) {
            try {
                await groupRepository.closeGroup(activeGrupo.id, { tip_amount: tip, final_total: total });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const clearGrupo = async () => {
        setActiveGrupo(null);
        await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_GRUPO);
    };

    const refreshGrupo = async () => {
        if (activeGrupo?.id && isOnline) {
            await loadGroupDetails(activeGrupo.id);
        }
    };

    const normalizeGrupo = (raw: any): Grupo => {
        if (!raw) return null as any;
        return {
            id: raw.id || raw._id,
            nombre: raw.nombre || raw.name || 'Sin nombre',
            liderId: raw.liderId || raw.admin_id,
            codigo: raw.codigo || raw.codigo_invitacion || '000000',
            participantes: (raw.participantes || raw.members || raw.integrantes || []).map((p: any) => ({
                id: p.id || p._id,
                nombre: p.nombre || p.name || 'Usuario',
                avatar: p.avatar || '',
                color: p.color || '#3b82f6',
                isLeader: p.isLeader || p.role === 'leader' || (raw.liderId || raw.admin_id) === (p.id || p._id),
                debt: p.debt || 0,
                status: p.status || 'online'
            })),
            items: (raw.items || []).map((i: any) => ({
                id: i.id || i._id,
                nombre: i.nombre || i.description || 'Ítem',
                precio: i.precio || i.amount || 0,
                cantidad: i.cantidad || i.quantity || 1,
                autorId: i.autorId || i.addedBy || i.comprador_id || '',
                asignadoA: i.asignadoA || i.assignedTo || i.participantes_ids || []
            })),
            subtotal: raw.subtotal || raw.monto_final || 0,
            propina: raw.propina || raw.propina_total || raw.tip || 0,
            total: raw.total || raw.final_total || 0,
            status: (raw.status || raw.estado || 'active').toUpperCase() as any,
            creadaEn: raw.creadaEn || raw.fecha_creacion || new Date().toISOString()
        };
    };



    const loadGroupDetails = async (id: string) => {
        if (!isOnline) return;
        try {
            const [groupData, itemsData, balancesData] = await Promise.all([
                groupRepository.getGroup(id),
                groupRepository.getItems(id),
                groupRepository.getBalances(id)
            ]);
            
            const fullGroup = {
                ...groupData,
                items: itemsData
            };
            
            setActiveGrupo(normalizeGrupo(fullGroup));
            setBalances(balancesData.balance_detallado || []);
        } catch (error) {
            console.error("Error loading group details:", error);
        }
    };

    const calculateUserDebt = useCallback((participantId: string): number => {
        // Prefer real balances from backend if available
        const userBalance = balances.find(b => (b.usuario_id || b.id) === participantId);
        if (userBalance) {
            // Note: in backend balance < 0 means user owes money
            return userBalance.balance < 0 ? Math.abs(userBalance.balance) : 0;
        }

        if (!activeGrupo) return 0;
        let base = (activeGrupo.items || []).reduce((acc: number, item: any) => {
            const assigned = item.asignadoA || [];
            if (assigned.includes(participantId)) {
                return acc + (Number(item.precio || 0) * Number(item.cantidad || 1) / assigned.length);
            }
            return acc;
        }, 0);
        const tipFactor = activeGrupo.subtotal < 3000 ? 0.10 : 0.05;
        return base + (base * tipFactor);
    }, [activeGrupo, balances]);

    // --- Payment Actions ---
    const fetchFinancialData = useCallback(async () => {
        if (!user?.id || !isOnline) return;
        try {
            const stats = await paymentRepository.getStats(user.id);
            setRealStats({ totalOwed: stats.user_owes || 0, totalToReceive: stats.owed_to_user || 0 });
            
            const trans = await paymentRepository.getTransactions(user.id);
            const mappedPayments: Payment[] = trans.map((t: any) => ({
                id: t.id,
                debtId: t.id,
                groupId: '',
                groupName: t.group_name || 'Individual',
                fromUserId: t.is_incoming ? 'other' : user.id,
                fromUserName: t.is_incoming ? 'Compañero' : user.nombre,
                toUserId: t.is_incoming ? user.id : 'other',
                toUserName: t.is_incoming ? user.nombre : 'Compañero',
                amount: t.amount,
                method: 'transfer',
                status: t.status === 'completed' || t.status === 'approved' ? 'confirmed' : (t.status === 'pending' ? 'waiting_confirmation' : 'rejected'),
                createdAt: new Date(t.date).getTime(),
                concept: 'Pago'
            }));
            setPayments(mappedPayments);
        } catch (error) {
            console.error('Error fetching financial data:', error);
        }
    }, [user?.id, user?.nombre, isOnline]);

    const fetchCards = useCallback(async () => {
        if (!user?.id || !isOnline) return;
        try {
            const data = await paymentRepository.getCards(user.id);
            const mappedCards: SavedCard[] = data.map((c: any) => ({
                id: c.id || c._id,
                token: c.token || '',
                last4: c.last_four || '****',
                brand: c.brand || 'VISA',
                holder: c.holder || 'TITULAR',
                expiry: c.expiry || '00/00',
                colors: c.colors || ['#1e293b', '#0f172a'],
                isDefault: c.is_default || false,
                createdAt: c.created_at || Date.now()
            }));
            setCards(mappedCards);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }, [user?.id, isOnline]);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (isOnline) {
            queryClient.invalidateQueries();
            fetchCards();
            fetchFinancialData();
            if (activeGrupo?.id) loadGroupDetails(activeGrupo.id);
        }
    }, [isOnline, fetchCards, fetchFinancialData, queryClient]);

    const initiatePayment = useCallback(async (data: Omit<Payment, 'id' | 'createdAt' | 'status'>): Promise<Payment> => {
        const newPayment: Payment = {
            ...data,
            id: makeId('pay'),
            createdAt: Date.now(),
            status: 'waiting_confirmation',
            witnessConfirmed: false,
            receiverConfirmed: false,
        };
        setPayments(prev => [newPayment, ...prev]);
        return newPayment;
    }, []);

    const addCard = useCallback(async (card: Omit<SavedCard, 'id' | 'createdAt' | 'isDefault'>) => {
        if (!user?.id || !isOnline) return;
        const backendCard = {
            token: card.token,
            last_four: card.last4,
            brand: card.brand,
            holder: card.holder,
            expiry: card.expiry,
            colors: card.colors,
            is_default: cards.length === 0
        };
        await paymentRepository.addCard(user.id, backendCard);
        await fetchCards();
    }, [user?.id, cards.length, fetchCards, isOnline]);

    const removeCard = useCallback(async (id: string) => {
        if (!user?.id || !isOnline) return;
        await paymentRepository.removeCard(user.id, id);
        await fetchCards();
    }, [user?.id, fetchCards, isOnline]);

    const setDefaultCard = useCallback(async (id: string) => {
        if (!user?.id || !isOnline) return;
        await paymentRepository.setDefaultCard(user.id, id);
        await fetchCards();
    }, [user?.id, fetchCards, isOnline]);

    const value: EasyPayContextType = {
        user, token, isLoading, saveSession, saveGuestSession, logout,
        activeGrupo, refreshGrupo, createGrupo, joinGrupo, addItem, updateItem, deleteItem, assignItem, startSettlement, closeGrupo, clearGrupo, calculateUserDebt, loadGroupDetails,
        debts, payments, cards, initiatePayment, fetchFinancialData, addCard, removeCard, setDefaultCard,
        isOnline
    };

    return (
        <EasyPayContext.Provider value={value}>
            {children}
        </EasyPayContext.Provider>
    );
};

export const useEasyPay = () => {
    const context = useContext(EasyPayContext);
    if (context === undefined) {
        throw new Error('useEasyPay must be used within an EasyPayProvider');
    }
    return context;
};

export function timeAgoPayment(ts: number): string {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    return `Hace ${Math.floor(diff / 86400)} días`;
}
