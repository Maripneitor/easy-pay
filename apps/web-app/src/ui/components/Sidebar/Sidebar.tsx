import React from 'react'; // Re-saved to force HMR
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusSquare, CreditCard, BarChart3, Settings, LogOut, Users as LucideUsers, ChevronLeft, Menu, Clock } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout, userName }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const menuItems = [
        { icon: <Home size={22} />, label: 'Inicio', path: '/dashboard' },
        { icon: <PlusSquare size={22} />, label: 'Mis Grupos', path: '/create-group' },
        { icon: <CreditCard size={22} />, label: 'Mis Pagos', path: '/my-payments' },
        { icon: <BarChart3 size={22} />, label: 'Gráficas', path: '/stats' },
        { icon: <LucideUsers size={22} />, label: 'Invitaciones', path: '/invitations', badge: 0 },
    ];

    return (
        <aside className={`flex flex-col h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] transition-all duration-300 relative z-50 overflow-hidden ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className={`p-8 flex-shrink-0 relative flex flex-col items-center transition-all duration-300 ${!isOpen ? 'p-6 mt-4' : ''}`}>
                <button 
                    onClick={onClose}
                    aria-label={isOpen ? "Colapsar menú" : "Expandir menú"}
                    className={`absolute p-2.5 hover:bg-[var(--hover-bg)] rounded-xl transition-all text-slate-400 md:flex hidden ${isOpen ? 'right-4 top-1/2 -translate-y-1/2' : 'relative right-0 top-0 mb-8 border border-[var(--border-color)] bg-white shadow-sm'}`}
                >
                    {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                </button>
                <div className="flex flex-col items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="transition-transform duration-300 group-hover:scale-110">
                        <img src="/assets/images/logo-ep.png" alt="Logo" className={`h-auto drop-shadow-md transition-all ${isOpen ? 'w-20' : 'w-12'}`} />
                    </div>
                    {isOpen && <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)]">Easy-Pay</h1>}
                </div>
            </div>

            <div className={`px-4 mb-6 flex-shrink-0 transition-all duration-300 ${!isOpen ? 'px-2' : ''}`}>
                <div onClick={() => navigate('/profile')} className={`p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col items-center text-center group cursor-pointer transition-all hover:border-[var(--primary)]/50 ${!isOpen ? 'p-1 border-none bg-transparent' : ''}`}>
                    <div className={`rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-black shadow-md shadow-[var(--primary)]/20 transition-all ${isOpen ? 'w-11 h-11 text-lg mb-1.5' : 'w-10 h-10 text-sm'}`}>
                        {getInitials(userName)}
                    </div>
                    {isOpen && (
                        <>
                            <span className="text-xs font-black text-[var(--text-primary)]">{userName}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase opacity-70">Sesión Activa</span>
                        </>
                    )}
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 custom-scrollbar overflow-y-auto min-h-0">
                {isOpen && <p className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menú Principal</p>}
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            title={!isOpen ? item.label : ''}
                            className={`w-full flex items-center rounded-2xl text-sm font-bold transition-all relative group ${isActive
                                    ? 'text-[var(--primary)] bg-[var(--hover-bg)]'
                                    : 'text-slate-500 hover:bg-[var(--hover-bg)]'
                                } ${isOpen ? 'px-4 py-2.5 justify-between' : 'p-3 justify-center'}`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                {isOpen && <span>{item.label}</span>}
                            </div>
                            {item.badge && isOpen && (
                                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[20px]">
                                    {item.badge}
                                </span>
                            )}
                            {!isOpen && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] whitespace-nowrap shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className={`p-4 mt-auto border-t border-[var(--border-color)] flex-shrink-0 transition-all ${!isOpen ? 'p-2' : ''}`}>
                <button 
                    onClick={() => navigate('/profile')} 
                    title={!isOpen ? 'Configuración' : ''}
                    className={`w-full flex items-center gap-3 rounded-2xl text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] group transition-all relative ${isOpen ? 'px-4 py-3' : 'p-3 justify-center'}`}
                >
                    <Settings size={22} className="group-hover:text-[var(--primary)] transition-all" />
                    {isOpen && <span>Configuración</span>}
                    {!isOpen && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] whitespace-nowrap shadow-xl">
                            Configuración
                        </div>
                    )}
                </button>

                <button
                    onClick={onLogout}
                    title={!isOpen ? 'Cerrar Sesión' : ''}
                    className={`w-full flex items-center gap-3 mt-2 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 group transition-all relative ${isOpen ? 'px-4 py-3' : 'p-3 justify-center'}`}
                >
                    <LogOut size={22} />
                    {isOpen && <span>Cerrar Sesión</span>}
                    {!isOpen && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] whitespace-nowrap shadow-xl">
                            Cerrar Sesión
                        </div>
                    )}
                </button>

                {isOpen && (
                    <div className="pt-4 pb-2 text-center text-[10px] font-black font-mono text-slate-400 opacity-50">
                        v1.2.0-BUILD
                    </div>
                )}
            </div>
        </aside>
    );
};