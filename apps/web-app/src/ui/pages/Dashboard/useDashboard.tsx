
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Plane, Utensils, Home, PartyPopper, Users } from 'lucide-react';

export const useDashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock data for groups
    const allActiveGroups = [
        {
            id: '1',
            name: 'Viaje a Cancún',
            icon: <Plane size={24} />,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            isAdmin: true,
            lastAct: 'Hace 2 horas',
            members: ['https://ui-avatars.com/api/?name=Juan', 'https://ui-avatars.com/api/?name=Maria'],
            extraMembers: 0,
            total: 15400.50,
            userBalance: 1200.00
        },
        {
            id: '2',
            name: 'Cena de Navidad',
            icon: <Utensils size={24} />,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            isAdmin: false,
            lastAct: 'Ayer',
            members: ['https://ui-avatars.com/api/?name=Ana', 'https://ui-avatars.com/api/?name=Luis', 'https://ui-avatars.com/api/?name=Carlos'],
            extraMembers: 2,
            total: 3400.00,
            userBalance: -500.00
        }
    ];

    const settledGroups = [
        {
            id: '3',
            name: 'Regalo Mamá',
            icon: <PartyPopper size={24} />,
            date: '15 Oct 2023',
            members: ['https://ui-avatars.com/api/?name=Yo', 'https://ui-avatars.com/api/?name=Hermanos'],
            extraMembers: 0,
            total: 2500.00
        }
    ];

    // Helper for group icons (can be exported or kept internal)
    const getGroupIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('viaje')) return { icon: <Plane size={24} />, bg: 'bg-blue-100', color: 'text-blue-600' };
        if (lowerName.includes('cena') || lowerName.includes('comida')) return { icon: <Utensils size={24} />, bg: 'bg-orange-100', color: 'text-orange-600' };
        if (lowerName.includes('casa')) return { icon: <Home size={24} />, bg: 'bg-green-100', color: 'text-green-600' };
        if (lowerName.includes('fiesta')) return { icon: <PartyPopper size={24} />, bg: 'bg-purple-100', color: 'text-purple-600' };
        return { icon: <Users size={24} />, bg: 'bg-slate-100', color: 'text-slate-600' };
    };

    return {
        isSidebarOpen,
        setIsSidebarOpen,
        navigate,
        allActiveGroups,
        settledGroups,
        getGroupIcon
    };
};
