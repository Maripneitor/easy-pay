import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, Home, User, Bell, Plus, CreditCard, LogOut, Camera, FileText } from 'lucide-react';
import { cn } from '@infrastructure/utils';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: Home, label: 'Inicio', path: '/dashboard' },
        { icon: Plus, label: 'Crear Grupo', path: '/create-group' },
        { icon: CreditCard, label: 'Mis Pagos', path: '/my-payments' },
        { icon: Camera, label: 'Escáner OCR', path: '/ocr-scanner' },
        { icon: FileText, label: 'Registrar Gasto', path: '/register-expense' },
        { icon: Bell, label: 'Notificaciones', path: '/notifications' },
        { icon: User, label: 'Mi Perfil', path: '/profile' },
    ];

    return (
        <>
            {/* Overlay - visible on mobile when open, hidden on desktop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer / Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 shadow-2xl z-[70] transition-transform duration-300 ease-in-out flex flex-col",
                "md:translate-x-0 md:static md:shadow-none md:z-auto md:w-64 md:h-screen md:sticky md:top-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">Easy-Pay</h2>
                    {/* Close button - visible only on mobile */}
                    <button onClick={onClose} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden">
                        <X size={20} />
                    </button>
                </div>

                {/* User Info */}
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                            <img
                                src="https://ui-avatars.com/api/?name=Juan+Perez&background=0f172a&color=fff"
                                alt="Juan"
                                className="w-full h-full rounded-full"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-slate-800 dark:text-white truncate">Juan Pérez</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">juan@easypay.com</p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active Indicator Bar */}
                                    {isActive && (
                                        <div className="absolute left-0 h-8 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
                                    )}

                                    <div className={cn(
                                        "p-2 rounded-lg transition-colors ml-1", // Added ml-1 for spacing
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-slate-500 dark:text-slate-400"
                                    )}>
                                        <item.icon size={20} />
                                    </div>
                                    <span className={cn(
                                        "font-medium transition-colors",
                                        isActive
                                            ? "text-white"
                                            : "group-hover:text-slate-900 dark:group-hover:text-white"
                                    )}>
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => {
                            navigate('/auth');
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                    <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-4 font-mono">v1.2.0 • Build 245</p>
                </div>
            </div>
        </>
    );
};
