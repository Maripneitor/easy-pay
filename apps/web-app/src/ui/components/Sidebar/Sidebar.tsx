import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Home, 
    PlusSquare, 
    CreditCard, 
    Camera, 
    FileText, 
    Bell, 
    User,
    ChevronRight,
    Settings,
    DollarSign
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();

    const menuItems = [
        { icon: <Home size={22} />, label: 'Inicio', path: '/dashboard' },
        { icon: <PlusSquare size={22} />, label: 'Crear Grupo', path: '/create-group' },
        { icon: <CreditCard size={22} />, label: 'Mis Pagos', path: '/my-payments' },
        { icon: <Camera size={22} />, label: 'Escáner OCR', path: '/ocr-scanner' },
        { icon: <FileText size={22} />, label: 'Registrar Gasto', path: '/register-expense' },
        { icon: <Bell size={22} />, label: 'Notificaciones', path: '/notifications' },
    ];

    const userName = "Juan Pérez";
    const userEmail = "juan.perez@easypay.com";

    return (
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] transition-colors duration-300 relative z-50">
            <div className="p-8">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform">
                        <DollarSign size={20} className="font-black" />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)]">
                        Easy-Pay
                    </h1>
                </div>
            </div>

            <div className="px-4 mb-8">
                <div 
                    onClick={() => navigate('/profile')}
                    className="relative p-4 rounded-3xl bg-[var(--bg-body)] border border-[var(--border-color)] hover:border-blue-500/50 transition-all group cursor-pointer overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="relative mb-3">
                            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                                JP
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[var(--bg-body)] rounded-full"></div>
                        </div>
                        <span className="text-sm font-black text-[var(--text-primary)] truncate w-full">{userName}</span>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter opacity-70">{userEmail}</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <p className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menú Principal</p>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
                                isActive 
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                                : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'} transition-colors`}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </div>
                            {!isActive && <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button 
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all group"
                >
                    <Settings size={22} className="text-slate-400 group-hover:text-blue-500 group-hover:rotate-45 transition-all duration-500" />
                    Configuración
                </button>
                
                <div className="pt-6 pb-2 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-[var(--border-color)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-[10px] font-black font-mono text-slate-400 tracking-tighter">v1.2.0-BUILD-245</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};