import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export interface PaymentCard {
    id: string;
    lastFour: string;
    holder: string;
    brand: string;
    isDefault: boolean;
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
    const [cards] = useState<PaymentCard[]>([]);
    const [transactions] = useState<PaymentTransaction[]>([]);
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
