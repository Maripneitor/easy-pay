import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusSquare, CreditCard, Camera, FileText, Bell, Settings, LogOut } from 'lucide-react';

// Definimos las interfaces para recibir los datos del DashboardLayout
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void; // Función para cerrar sesión
    userName: string;     // Nombre real del usuario
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, userName }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Función para obtener las iniciales (ej: Erick Fuentes -> EF)
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const menuItems = [
        { icon: <Home size={22} />, label: 'Inicio', path: '/dashboard' },
        { icon: <PlusSquare size={22} />, label: 'Crear Grupo', path: '/create-group' },
        { icon: <CreditCard size={22} />, label: 'Mis Pagos', path: '/my-payments' },
        { icon: <Camera size={22} />, label: 'Escáner OCR', path: '/ocr-scanner' },
        { icon: <FileText size={22} />, label: 'Registrar Gasto', path: '/register-expense' },
        { icon: <Bell size={22} />, label: 'Notificaciones', path: '/notifications' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 min-h-screen max-h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] transition-colors duration-300 relative z-50">

            {/* 1. SECCIÓN FIJA: LOGO */}
            <div className="p-8 flex-shrink-0">
                <div className="flex flex-col items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="transition-transform duration-300 group-hover:scale-110">
                        <img src="/assets/images/logo-ep.png" alt="Logo" className="w-20 h-auto drop-shadow-md" />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)]">Easy-Pay</h1>
                </div>
            </div>

            {/* 2. SECCIÓN FIJA: PERFIL REAL DEL USUARIO */}
            <div className="px-4 mb-6 flex-shrink-0">
                <div onClick={() => navigate('/profile')} className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col items-center text-center group cursor-pointer transition-all hover:border-[var(--primary)]/50">
                    <div className="w-11 h-11 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white text-lg font-black mb-1.5 shadow-md shadow-[var(--primary)]/20">
                        {getInitials(userName)}
                    </div>
                    <span className="text-xs font-black text-[var(--text-primary)]">{userName}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase opacity-70">Sesión Activa</span>
                </div>
            </div>

            {/* 3. ÚNICA SECCIÓN CON SCROLL: EL MENÚ DE OPCIONES */}
            <nav className="flex-1 px-4 space-y-0.5 custom-scrollbar overflow-y-auto min-h-0">
                <p className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menú Principal</p>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${isActive
                                    ? 'text-[var(--primary)] bg-[var(--hover-bg)]'
                                    : 'text-slate-500 hover:bg-[var(--hover-bg)]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        </button>
                    );
                })}
            </nav>

            {/* 4. SECCIÓN FIJA: CONFIGURACIÓN Y LOGOUT */}
            <div className="p-4 mt-auto border-t border-[var(--border-color)] flex-shrink-0">
                <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] group transition-all">
                    <Settings size={22} className="group-hover:text-[var(--primary)] transition-all" />
                    Configuración
                </button>

                {/* BOTÓN DE CERRAR SESIÓN CONECTADO */}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 group transition-all"
                >
                    <LogOut size={22} />
                    Cerrar Sesión
                </button>

                <div className="pt-4 pb-2 text-center text-[10px] font-black font-mono text-slate-400 opacity-50">
                    v1.2.0-BUILD
                </div>
            </div>
        </aside>
    );
};