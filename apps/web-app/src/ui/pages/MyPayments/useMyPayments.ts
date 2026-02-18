import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PaymentCard, PaymentTransaction } from '@easy-pay/shared';

const MOCK_CARDS: PaymentCard[] = [
    {
        id: '1',
        lastFour: '4242',
        holder: 'Luis Gonzalez',
        brand: 'VISA',
        isDefault: true,
    },
    {
        id: '2',
        lastFour: '8888',
        holder: 'Luis Gonzalez',
        brand: 'MasterCard',
        isDefault: false,
    },
];

const MOCK_TRANSACTIONS: PaymentTransaction[] = [
    {
        id: 't1',
        description: 'Pago a Ana',
        category: 'Comida Grupal',
        date: 'Hoy, 12:30 PM',
        status: 'completed',
        amount: -320,
        avatarUrl: 'https://ui-avatars.com/api/?name=Ana&background=random',
    },
    {
        id: 't2',
        description: 'Amazon MX',
        category: 'Electrónicos',
        date: 'Ayer, 4:15 PM',
        status: 'completed',
        amount: -1250,
        icon: 'shopping-bag',
    },
    {
        id: 't3',
        description: 'Netflix',
        category: 'Suscripción Mensual',
        date: '14 Oct, 9:00 AM',
        status: 'completed',
        amount: -199,
        icon: 'film',
    },
];

export const useMyPayments = () => {
    const navigate = useNavigate();
    const [cards] = useState<PaymentCard[]>(MOCK_CARDS);
    const [transactions] = useState<PaymentTransaction[]>(MOCK_TRANSACTIONS);
    const [isAddingCard, setIsAddingCard] = useState(false);

    const goBack = () => navigate(-1);

    const handleDeleteCard = (cardId: string) => {
        console.log('Delete card:', cardId);
    };

    const handleEditCard = (cardId: string) => {
        console.log('Edit card:', cardId);
    };

    const handleAddMethod = () => {
        setIsAddingCard(true);
        console.log('Add payment method');
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
        isAddingCard,
        goBack,
        handleDeleteCard,
        handleEditCard,
        handleAddMethod,
        formatCurrency,
    };
};
