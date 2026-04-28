import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    addCard: (card: Omit<SavedCard, 'id' | 'createdAt' | 'isDefault'>) => void;
    removeCard: (id: string) => void;
    setDefaultCard: (id: string) => void;
    initiatePayment: (data: Omit<Payment, 'id' | 'createdAt' | 'status'>) => Promise<Payment>;
    confirmPaymentAsReceiver: (paymentId: string) => void;
    confirmPaymentAsWitness: (paymentId: string) => void;
    rejectPayment: (paymentId: string) => void;
    getDebtsByUser: (userId: string) => Debt[];
    getPaymentsByGroup: (groupId: string) => Payment[];
    getTotalOwed: (userId: string) => number;
    getTotalToReceive: (userId: string) => number;
    pendingConfirmations: (userId: string) => Payment[];
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

function makeId() {
    return `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [cards, setCards] = useState<SavedCard[]>([]);

    // Persistencia
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(stored => {
            if (stored) {
                const parsed = JSON.parse(stored);
                setDebts(parsed.debts ?? []);
                setPayments(parsed.payments ?? []);
                setCards(parsed.cards ?? []);
            }
        }).catch(() => {});
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ debts, payments, cards })).catch(() => {});
    }, [debts, payments, cards]);

    // ── Deudas ───────────────────────────────────────────────────────────────────
    const addDebt = useCallback((debt: Omit<Debt, 'id' | 'createdAt'>) => {
        setDebts(prev => [...prev, { ...debt, id: makeId(), createdAt: Date.now() }]);
    }, []);

    const removeDebt = useCallback((id: string) => {
        setDebts(prev => prev.filter(d => d.id !== id));
    }, []);

    // ── Tarjetas ─────────────────────────────────────────────────────────────────
    const addCard = useCallback((card: Omit<SavedCard, 'id' | 'createdAt' | 'isDefault'>) => {
        setCards(prev => {
            const isFirst = prev.length === 0;
            return [...prev, {
                ...card,
                id: makeId(),
                createdAt: Date.now(),
                isDefault: isFirst,
            }];
        });
    }, []);

    const removeCard = useCallback((id: string) => {
        setCards(prev => prev.filter(c => c.id !== id));
    }, []);

    const setDefaultCard = useCallback((id: string) => {
        setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
    }, []);

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

    const getTotalOwed = useCallback((userId: string) =>
        debts.filter(d => d.fromUserId === userId).reduce((acc, d) => acc + d.amount, 0), [debts]);

    const getTotalToReceive = useCallback((userId: string) =>
        debts.filter(d => d.toUserId === userId).reduce((acc, d) => acc + d.amount, 0), [debts]);

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
            getTotalOwed, getTotalToReceive, pendingConfirmations,
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
