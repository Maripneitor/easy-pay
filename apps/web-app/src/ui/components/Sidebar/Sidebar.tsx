import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Home, User, Bell, Plus, Settings, CreditCard, LogOut } from 'lucide-react';
import { cn } from '@infrastructure/utils';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: Home, label: 'Inicio', path: '/dashboard' },
        { icon: Bell, label: 'Notificaciones', path: '/notifications' },
        { icon: Plus, label: 'Crear Grupo', path: '/create-group' },
        { icon: CreditCard, label: 'Mis Pagos', path: '/my-payments' },
        { icon: User, label: 'Mi Perfil', path: '/profile' },
        { icon: Settings, label: 'Configuración', path: '/profile/personal-data' },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={cn(
                "fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-700/50 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Easy-Pay</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* User Info */}
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                            <img
                                src="https://ui-avatars.com/api/?name=Juan+Perez&background=0f172a&color=fff"
                                alt="Juan"
                                className="w-full h-full rounded-full"
                            />
                        </div>
                        <div>
                            <p className="font-bold text-white">Juan Pérez</p>
                            <p className="text-xs text-slate-400">juan@easypay.com</p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                navigate(item.path);
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/80 rounded-xl transition-all group"
                        >
                            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                <item.icon size={20} />
                            </div>
                            <span className="font-medium group-hover:text-white transition-colors">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => {
                            navigate('/auth');
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                    <p className="text-center text-[10px] text-slate-600 mt-4 font-mono">v1.2.0 • Build 245</p>
                </div>
            </div>
        </>
    );
};
