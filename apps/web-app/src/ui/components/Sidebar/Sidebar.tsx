import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusSquare, CreditCard, Camera, FileText, Bell, ChevronRight, Settings, DollarSign } from 'lucide-react';
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

    return (
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] transition-colors duration-300 relative z-50">
            <div className="p-8">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform">
                        <DollarSign size={20} className="font-black" />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)]">Easy-Pay</h1>
                </div>
            </div>

            <div className="px-4 mb-8">
                <div onClick={() => navigate('/profile')} className="relative p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] group cursor-pointer overflow-hidden transition-all">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black mb-3">JP</div>
                        <span className="text-sm font-black text-[var(--text-primary)]">Juan Pérez</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter opacity-70">juan.perez@easypay.com</span>
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
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                                isActive ? 'text-[var(--primary)] bg-[var(--hover-bg)]' : 'text-slate-500 hover:bg-[var(--hover-bg)]'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={isActive ? 'text-[var(--primary)]' : 'text-slate-500'}>{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-all group">
                    <Settings size={22} className="group-hover:text-[var(--primary)] transition-all duration-500" />
                    Configuración
                </button>
                <div className="pt-6 pb-2 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-[var(--border-color)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_5px_var(--primary)]"></div>
                        <span className="text-[10px] font-black font-mono text-slate-400 tracking-tighter uppercase">v1.2.0-BUILD</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};