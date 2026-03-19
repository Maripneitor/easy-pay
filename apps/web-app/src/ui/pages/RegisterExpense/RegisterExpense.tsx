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
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Header Adaptable */}
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="Registrar Gasto"
                    onBack={() => navigate(-1)}
                    rightSlot={
                        <button 
                            className="text-[var(--primary)] font-bold text-sm hover:underline uppercase tracking-widest"
                            onClick={() => navigate(-1)}
                        >
                            Guardar
                        </button>
                    }
                />

                <main className="flex-1 w-full max-w-xl mx-auto px-6 py-6 space-y-8">

                    {/* Amount Input: Brilla con el color primario */}
                    <div className="flex flex-col items-center justify-center py-6">
                        <p className="text-sm font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest opacity-70">Monto total</p>
                        <div className="relative flex items-center">
                            <DollarSign size={40} className="text-[var(--primary)] absolute -left-8 top-1/2 -translate-y-1/2 opacity-60" />
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-6xl font-black text-[var(--text-primary)] text-center w-full focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-colors"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Description & Details */}
                    <div className="bg-[var(--bg-card)] rounded-2xl p-4 shadow-xl border border-[var(--border-color)] space-y-4 transition-colors">
                        <div className="flex items-center gap-3 p-2">
                            <div className="w-10 h-10 rounded-full bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border-color)]">
                                <MoreHorizontal size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="¿Qué compraste?"
                                className="flex-1 bg-transparent text-lg font-bold text-[var(--text-primary)] placeholder:text-slate-400 focus:outline-none"
                            />
                            <button 
                                className="p-2 text-slate-400 hover:text-[var(--primary)] transition-colors"
                                onClick={() => navigate('/ocr-scanner')}
                            >
                                <Camera size={20} />
                            </button>
                        </div>

                        <div className="h-px bg-[var(--border-color)] mx-14"></div>

                        <div className="flex items-center gap-3 p-2">
                            <div className="w-10 h-10 rounded-full bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border-color)]">
                                <Calendar size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[var(--text-primary)]">Hoy</p>
                            </div>
                        </div>
                    </div>

                    {/* Categorías con Selección Adaptable */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1 opacity-70">Categoría</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all",
                                        selectedCategory === cat.id
                                            ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25 scale-105"
                                            : "bg-[var(--bg-card)] hover:bg-[var(--hover-bg)] border border-[var(--border-color)]"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                                        selectedCategory === cat.id
                                            ? "bg-white/20 text-white"
                                            : [cat.bg, cat.color]
                                    )}>
                                        <cat.icon size={20} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-tighter truncate w-full text-center",
                                        selectedCategory === cat.id ? "text-white" : "text-[var(--text-secondary)]"
                                    )}>
                                        {cat.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Opción de División Equitativa */}
                    <div className="bg-[var(--bg-card)] rounded-2xl p-4 shadow-lg border border-[var(--border-color)] flex items-center justify-between cursor-pointer hover:bg-[var(--hover-bg)] transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                <Check size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">Dividido equitativamente</p>
                                <p className="text-xs text-[var(--text-secondary)] font-medium">Entre todos los miembros</p>
                            </div>
                        </div>
                        <ArrowLeft size={16} className="rotate-180 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Botón Inferior Adaptable */}
                    <div className="pb-8 sticky bottom-0">
                        <button
                            className="w-full bg-[var(--primary)] hover:opacity-90 text-white font-black py-5 rounded-2xl shadow-xl shadow-[var(--primary)]/20 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] uppercase tracking-[0.1em]"
                            onClick={() => navigate(-1)}
                        >
                            <Check size={24} className="font-black" />
                            <span>Confirmar Gasto</span>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};