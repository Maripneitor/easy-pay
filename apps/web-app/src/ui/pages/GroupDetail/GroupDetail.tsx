
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Share2,
    Settings,
    Plus,
    Receipt,
    PieChart,
    CheckCircle,
    Utensils,
    Car,
    ShoppingBag,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '@infrastructure/utils';

export const GroupDetail = () => {
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

    return (
        <div className="bg-alice-blue dark:bg-slate-900 font-display text-slate-800 dark:text-slate-200 min-h-screen flex flex-col antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700/30">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-bold text-slate-900 dark:text-white text-lg truncate px-4">{groupName}</h1>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50">
                            <Share2 size={20} />
                        </button>
                        <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50">
                            <Settings size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Spend */}
                    <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-none">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Receipt size={64} className="text-slate-900 dark:text-white" />
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Grupo</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalSpent.toFixed(2)}</p>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                                <ArrowUpRight size={14} /> 12%
                            </span>
                            vs mes anterior
                        </div>
                    </div>

                    {/* Your Share */}
                    <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-none">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <PieChart size={64} className="text-slate-900 dark:text-white" />
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Tu Parte</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">${userShare.toFixed(2)}</p>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            33.2% del total
                        </div>
                    </div>

                    {/* You are owed */}
                    <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-none">
                        <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-500/5"></div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                                <CheckCircle size={14} />
                                Te deben
                            </p>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">${userOwed.toFixed(2)}</p>
                            <div className="mt-2 text-xs text-emerald-600/70 dark:text-emerald-400/70">
                                2 personas te deben
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700/50">
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={cn(
                            "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === 'activity'
                                ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        )}
                    >
                        Actividad
                    </button>
                    <button
                        onClick={() => setActiveTab('balances')}
                        className={cn(
                            "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === 'balances'
                                ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        )}
                    >
                        Saldos
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={cn(
                            "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === 'settings'
                                ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        )}
                    >
                        Configuración
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'activity' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Actividad Reciente</h2>
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Ver todo</button>
                        </div>

                        <div className="space-y-3">
                            {activities.map(activity => (
                                <div key={activity.id} className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group shadow-sm dark:shadow-none">
                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", activity.bg, activity.color)}>
                                        <activity.icon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">{activity.title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{activity.paidBy} pagó ${activity.amount.toFixed(2)} • {activity.date}</p>
                                    </div>
                                    <div className="text-right">
                                        {activity.userOwes > 0 ? (
                                            <>
                                                <p className="font-bold text-red-500 dark:text-red-400">-${activity.userOwes.toFixed(2)}</p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Tu deuda</p>
                                            </>
                                        ) : activity.userLent ? (
                                            <>
                                                <p className="font-bold text-emerald-600 dark:text-emerald-400">+${activity.userLent.toFixed(2)}</p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Te prestó</p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No participaste</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'balances' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Balances del Grupo</h2>
                        <div className="grid gap-3">
                            {balances.map((person, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 flex items-center gap-4 shadow-sm dark:shadow-none">
                                    <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{person.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        {person.status === 'owes' && (
                                            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">Te debe ${person.amount.toFixed(2)}</p>
                                        )}
                                        {person.status === 'owe' && (
                                            <div className="flex flex-col items-end gap-1">
                                                <p className="text-red-500 dark:text-red-400 font-bold text-sm">Debes ${person.amount.toFixed(2)}</p>
                                                <button className="text-xs bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-colors">Pagar</button>
                                            </div>
                                        )}
                                        {person.status === 'settled' && (
                                            <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">Están a mano</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6">
                <button
                    onClick={() => navigate('/register-expense')}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 transition-transform active:scale-95 flex items-center gap-2"
                >
                    <Plus size={24} />
                    <span className="font-bold pr-2 hidden sm:inline">Nuevo Gasto</span>
                </button>
            </div>
        </div>
    );
};
