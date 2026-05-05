import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paymentRepository } from '../api/repositories/PaymentRepository';
import { useAuth } from '../../../context/AuthContext';

const STORAGE_KEY = 'easypay_payments';

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

interface PaymentContextType {
    debts: Debt[];
    payments: Payment[];
    cards: SavedCard[];
    addDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
    removeDebt: (id: string) => void;
    addCard: (card: Omit<SavedCard, 'id' | 'createdAt' | 'isDefault'>) => Promise<void>;
    removeCard: (id: string) => Promise<void>;
    setDefaultCard: (id: string) => Promise<void>;
    initiatePayment: (data: Omit<Payment, 'id' | 'createdAt' | 'status'>) => Promise<Payment>;
    confirmPaymentAsReceiver: (paymentId: string) => void;
    confirmPaymentAsWitness: (paymentId: string) => void;
    rejectPayment: (paymentId: string) => void;
    getDebtsByUser: (userId: string) => Debt[];
    getPaymentsByGroup: (groupId: string) => Payment[];
    getTotalOwed: (userId: string) => number;
    getTotalToReceive: (userId: string) => number;
    pendingConfirmations: (userId: string) => Payment[];
    fetchFinancialData: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

function makeId() {
    return `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [debts, setDebts] = useState<Debt[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [cards, setCards] = useState<SavedCard[]>([]);
    const [realStats, setRealStats] = useState({ totalOwed: 0, totalToReceive: 0 });

    // ── Sync with API ────────────────────────────────────────────────────────────
    const fetchCards = useCallback(async () => {
        if (!user?.id) return;
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
            console.error('❌ Error fetching cards:', error);
        }
    }, [user?.id]);

    const fetchFinancialData = useCallback(async () => {
        if (!user?.id) return;
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
    }, [user?.id, user?.nombre]);

    useEffect(() => {
        fetchCards();
        fetchFinancialData();
    }, [fetchCards, fetchFinancialData]);

    // Persistencia local para Deudas y Pagos
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(stored => {
            if (stored) {
                const parsed = JSON.parse(stored);
                setDebts(parsed.debts ?? []);
                setPayments(parsed.payments ?? []);
            }
        }).catch(() => {});
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ debts, payments })).catch(() => {});
    }, [debts, payments]);

    // ── Deudas ───────────────────────────────────────────────────────────────────
    const addDebt = useCallback((debt: Omit<Debt, 'id' | 'createdAt'>) => {
        setDebts(prev => [...prev, { ...debt, id: makeId(), createdAt: Date.now() }]);
    }, []);

    const removeDebt = useCallback((id: string) => {
        setDebts(prev => prev.filter(d => d.id !== id));
    }, []);

    // ── Tarjetas (Connected to API) ───────────────────────────────────────────────
    const addCard = useCallback(async (card: Omit<SavedCard, 'id' | 'createdAt' | 'isDefault'>) => {
        if (!user?.id) return;
        try {
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
        } catch (error) {
            console.error('❌ Error adding card:', error);
            throw error;
        }
    }, [user?.id, cards.length, fetchCards]);

    const removeCard = useCallback(async (id: string) => {
        if (!user?.id) return;
        try {
            await paymentRepository.removeCard(user.id, id);
            await fetchCards();
        } catch (error) {
            console.error('❌ Error removing card:', error);
        }
    }, [user?.id, fetchCards]);

    const setDefaultCard = useCallback(async (id: string) => {
        if (!user?.id) return;
        try {
            await paymentRepository.setDefaultCard(user.id, id);
            await fetchCards();
        } catch (error) {
            console.error('❌ Error setting default card:', error);
        }
    }, [user?.id, fetchCards]);

    // ── Pagos ────────────────────────────────────────────────────────────────────
    const initiatePayment = useCallback(async (data: Omit<Payment, 'id' | 'createdAt' | 'status'>): Promise<Payment> => {
        const newPayment: Payment = {
            ...data,
            id: makeId(),
            createdAt: Date.now(),
            status: 'waiting_confirmation',
            witnessConfirmed: false,
            receiverConfirmed: false,
        };
        setPayments(prev => [newPayment, ...prev]);
        return newPayment;
    }, []);

    const confirmPaymentAsReceiver = useCallback((paymentId: string) => {
        setPayments(prev => prev.map(p => {
            if (p.id !== paymentId) return p;
            const updated = { ...p, receiverConfirmed: true };
            const fullyConfirmed = p.witnessId ? updated.receiverConfirmed && updated.witnessConfirmed : updated.receiverConfirmed;
            return { ...updated, status: fullyConfirmed ? 'confirmed' : 'waiting_confirmation', confirmedAt: fullyConfirmed ? Date.now() : undefined };
        }));
    }, []);

    const confirmPaymentAsWitness = useCallback((paymentId: string) => {
        setPayments(prev => prev.map(p => {
            if (p.id !== paymentId) return p;
            const updated = { ...p, witnessConfirmed: true };
            const fullyConfirmed = updated.receiverConfirmed && updated.witnessConfirmed;
            return { ...updated, status: fullyConfirmed ? 'confirmed' : 'waiting_confirmation', confirmedAt: fullyConfirmed ? Date.now() : undefined };
        }));
    }, []);

    const rejectPayment = useCallback((paymentId: string) => {
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p));
    }, []);

    // ── Queries ──────────────────────────────────────────────────────────────────
    const getDebtsByUser = useCallback((userId: string) =>
        debts.filter(d => d.fromUserId === userId), [debts]);

    const getPaymentsByGroup = useCallback((groupId: string) =>
        payments.filter(p => p.groupId === groupId), [payments]);

    const getTotalOwed = useCallback((userId: string) => realStats.totalOwed, [realStats]);

    const getTotalToReceive = useCallback((userId: string) => realStats.totalToReceive, [realStats]);

    const pendingConfirmations = useCallback((userId: string) =>
        payments.filter(p =>
            p.status === 'waiting_confirmation' &&
            (p.toUserId === userId || p.witnessId === userId)
        ), [payments]);

    return (
        <PaymentContext.Provider value={{
            debts, payments, cards,
            addDebt, removeDebt,
            addCard, removeCard, setDefaultCard,
            initiatePayment,
            confirmPaymentAsReceiver, confirmPaymentAsWitness, rejectPayment,
            getDebtsByUser, getPaymentsByGroup,
            getTotalOwed, getTotalToReceive, pendingConfirmations, fetchFinancialData
        }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayments = () => {
    const ctx = useContext(PaymentContext);
    if (!ctx) throw new Error('usePayments must be used within PaymentProvider');
    return ctx;
};

export function timeAgoPayment(ts: number): string {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    return `Hace ${Math.floor(diff / 86400)} días`;
}
