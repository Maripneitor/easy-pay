import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { userRepository } from '../../../infrastructure/api/repositories';
import { toast } from 'sonner';

export interface PaymentCard {
    id: string;
    lastFour: string;
    holder: string;
    brand: string;
    isDefault: boolean;
    bankName?: string;
    bankStyle?: string;
}

export interface PaymentTransaction {
    id: string;
    description: string;
    category: string;
    date: string;
    status: string;
    amount: number;
    avatarUrl?: string;
    icon?: string;
}

export const useMyPayments = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [cards, setCards] = useState<PaymentCard[]>([]);
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingCard, setIsAddingCard] = useState(false);

    const fetchCards = useCallback(async () => {
        if (!user?.id) return;
        try {
            const data = await userRepository.getCards(user.id);
            // Map backend snake_case to frontend camelCase
            const mappedCards: PaymentCard[] = data.map((c: any) => ({
                id: c.id || Math.random().toString(36).substr(2, 9),
                lastFour: c.last_four || '****',
                holder: c.holder || 'TITULAR',
                brand: c.brand || 'VISA',
                isDefault: c.is_default || false,
                bankName: c.bank_name || 'EASY-PAY',
                bankStyle: c.bank_style || 'bg-gradient-to-br from-slate-800 to-slate-900'
            }));
            setCards(mappedCards);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }, [user?.id]);

    const fetchTransactions = useCallback(async () => {
        // Mocking transactions for now until we have an endpoint
        setTransactions([
            { id: '1', description: 'Netflix Subscription', category: 'Entretenimiento', date: '24 May 2026', status: 'completed', amount: -189.00, icon: 'film' },
            { id: '2', description: 'Starbucks Coffee', category: 'Comida', date: '23 May 2026', status: 'completed', amount: -95.00, icon: 'shopping-bag' },
            { id: '3', description: 'Easy-Pay Transfer', category: 'Transferencia', date: '22 May 2026', status: 'pending', amount: 500.00, icon: 'credit-card' },
        ]);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchCards(), fetchTransactions()]);
            setLoading(false);
        };
        loadData();
    }, [fetchCards, fetchTransactions]);

    const goBack = () => navigate(-1);

    const handleDeleteCard = async (cardId: string) => {
        if (!user?.id) return;
        try {
            await userRepository.deleteCard(user.id, cardId);
            toast.success('Tarjeta eliminada');
            fetchCards();
        } catch (error: any) {
            toast.error(error.message || 'No se pudo eliminar la tarjeta');
        }
    };

    const handleEditCard = (cardId: string) => {
        console.log('Edit card:', cardId);
    };

    const handleAddMethod = () => {
        setIsAddingCard(true);
    };

    const formatCurrency = (amount: number) => {
        const formatted = Math.abs(amount).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
        });
        return amount < 0 ? `-${formatted}` : formatted;
    };

    return {
        cards,
        transactions,
        loading,
        isAddingCard,
        goBack,
        handleDeleteCard,
        handleEditCard,
        handleAddMethod,
        formatCurrency,
        refreshCards: fetchCards
    };
};
