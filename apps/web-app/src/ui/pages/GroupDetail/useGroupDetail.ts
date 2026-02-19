
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Car, ShoppingBag } from 'lucide-react';

export const useGroupDetail = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'activity' | 'balances' | 'settings'>('activity');

    // Mock data
    const groupName = "Cena de Cumpleaños";
    const totalSpent = 1250.00;
    const userShare = 415.00;
    const userOwed = 120.00;

    const activities = [
        {
            id: 1,
            title: "Cena en Chez Ami",
            amount: 200.00,
            paidBy: "Alice",
            userOwes: 50.00,
            date: "Hoy",
            icon: Utensils,
            color: "text-orange-500 dark:text-orange-400",
            bg: "bg-orange-100 dark:bg-orange-500/10"
        },
        {
            id: 2,
            title: "Taxi al Hotel",
            amount: 45.00,
            paidBy: "Bob",
            userOwes: 0,
            date: "Ayer",
            icon: Car,
            color: "text-blue-500 dark:text-blue-400",
            bg: "bg-blue-100 dark:bg-blue-500/10"
        },
        {
            id: 3,
            title: "Entradas Museo",
            amount: 150.00,
            paidBy: "Tú",
            userLent: 100.00,
            date: "Ayer",
            icon: ShoppingBag,
            color: "text-purple-500 dark:text-purple-400",
            bg: "bg-purple-100 dark:bg-purple-500/10"
        }
    ];

    const balances = [
        { name: "Alice", status: "owes", amount: 40.00, avatar: "https://ui-avatars.com/api/?name=Alice" },
        { name: "Bob", status: "owe", amount: 20.00, avatar: "https://ui-avatars.com/api/?name=Bob" },
        { name: "Charlie", status: "owes", amount: 80.00, avatar: "https://ui-avatars.com/api/?name=Charlie" },
        { name: "Dave", status: "settled", amount: 0, avatar: "https://ui-avatars.com/api/?name=Dave" }
    ];

    return {
        activeTab,
        setActiveTab,
        navigate,
        groupName,
        totalSpent,
        userShare,
        userOwed,
        activities,
        balances
    };
};
