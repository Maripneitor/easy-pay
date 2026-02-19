import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    ArrowLeft,
    DollarSign,
    Utensils,
    Car,
    ShoppingBag,
    Film,
    Home,
    Gift,
    Coffee,
    MoreHorizontal,
    Check,
    Calendar,
    Camera
} from 'lucide-react';
import { cn } from '@infrastructure/utils';
import { PageHeader } from '@ui/components/PageHeader';

export const RegisterExpense = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [
        { id: 'food', name: 'Comida', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-500/20' },
        { id: 'transport', name: 'Transporte', icon: Car, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20' },
        { id: 'shopping', name: 'Compras', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/20' },
        { id: 'entertainment', name: 'Ocio', icon: Film, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-500/20' },
        { id: 'home', name: 'Hogar', icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
        { id: 'gift', name: 'Regalos', icon: Gift, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-500/20' },
        { id: 'coffee', name: 'Café', icon: Coffee, color: 'text-amber-700', bg: 'bg-amber-100 dark:bg-amber-700/20' },
        { id: 'other', name: 'Otros', icon: MoreHorizontal, color: 'text-slate-500', bg: 'bg-slate-200 dark:bg-slate-700/50' },
    ];

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-alice-blue dark:bg-slate-900 font-display text-slate-800 dark:text-slate-200 antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Header */}
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="Registrar Gasto"
                    onBack={() => navigate(-1)}
                    rightSlot={
                        <button className="text-cobalt-blue dark:text-blue-400 font-medium text-sm hover:underline">
                            Guardar
                        </button>
                    }
                />

                <main className="flex-1 w-full max-w-xl mx-auto px-6 py-6 space-y-8">

                    {/* Amount Input */}
                    <div className="flex flex-col items-center justify-center py-6">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Monto total</p>
                        <div className="relative flex items-center">
                            <DollarSign size={40} className="text-slate-400 dark:text-slate-600 absolute -left-8 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-6xl font-black text-slate-900 dark:text-white text-center w-full focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Description & Details */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-sky-100 dark:border-slate-700 space-y-4">
                        <div className="flex items-center gap-3 p-2">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-slate-700 flex items-center justify-center text-cobalt-blue dark:text-slate-300">
                                <MoreHorizontal size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="¿Qué compraste?"
                                className="flex-1 bg-transparent text-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                            />
                            <button className="p-2 text-slate-400 hover:text-cobalt-blue transition-colors">
                                <Camera size={20} />
                            </button>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-700 mx-14"></div>

                        <div className="flex items-center gap-3 p-2">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-slate-700 flex items-center justify-center text-cobalt-blue dark:text-slate-300">
                                <Calendar size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Hoy</p>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Categoría</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                                        selectedCategory === cat.id
                                            ? "bg-cobalt-blue text-white shadow-lg shadow-blue-500/25 scale-105"
                                            : "bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-sky-100 dark:border-slate-700"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                        selectedCategory === cat.id
                                            ? "bg-white/20 text-white"
                                            : [cat.bg, cat.color]
                                    )}>
                                        <cat.icon size={20} />
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium truncate w-full text-center",
                                        selectedCategory === cat.id ? "text-white" : "text-slate-600 dark:text-slate-300"
                                    )}>
                                        {cat.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Split Option */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-sky-100 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Check size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Dividido equitativamente</p>
                                <p className="text-xs text-slate-500">Entre todos los miembros</p>
                            </div>
                        </div>
                        <ArrowLeft size={16} className="rotate-180 text-slate-400" />
                    </div>

                    {/* Bottom Action */}
                    <div className="pb-8 sticky bottom-0">
                        <button
                            className="w-full bg-cobalt-blue hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                            onClick={() => navigate(-1)}
                        >
                            <Check size={20} />
                            <span>Confirmar Gasto</span>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};
