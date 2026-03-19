import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    Edit2,
    CreditCard,
    Users,
    CheckCircle,
    Bell,
    ChevronRight,
    Lock,
    Smartphone,
    LogOut,
    Palette,
    Type
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '@ui/components/PageHeader';
import { useAuth } from '../Auth/useAuth'; // Hook para logout

export const ProfilePage = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const { logout } = useAuth(); // Extraemos la función de cerrar sesión

    const { colorTheme, isDark, setTheme, toggleTheme, fontSize, setFontSize } = useTheme();

    // --- LÓGICA DE DATOS REALES ---
    const userName = localStorage.getItem('userName') || "Usuario";
    const userEmail = localStorage.getItem('userEmail') || "usuario@easypay.com";

    // Avatar dinámico basado en el nombre real del usuario
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff&bold=true`;

    const handleThemeChange = (value: string) => {
        if (value === 'light') {
            if (isDark) toggleTheme();
            setTheme('default');
        } else {
            if (!isDark) toggleTheme();
            setTheme(value as any);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased selection:bg-[var(--primary)] selection:text-white transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">

                {/* Header de la página */}
                <div className="bg-[var(--bg-body)] [&_header]:bg-transparent [&_header]:backdrop-blur-none [&_header]:border-[var(--border-color)]">
                    <PageHeader
                        onMenuClick={toggleSidebar}
                        title="MI PERFIL"
                        subtitle="Gestiona tu cuenta"
                        showNotification
                        notificationCount={0}
                        onNotificationClick={() => navigate('/notifications')}
                    />
                </div>

                <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-8">

                    {/* Tarjeta de Identidad Principal */}
                    <section className="w-full">
                        <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg dark:shadow-none transition-all">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-colors duration-300"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-800 p-1 shadow-[0_0_20px_var(--primary)]/20 border-2 border-[var(--primary)]/30 overflow-hidden transition-all duration-300">
                                        <img
                                            alt="Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                            src={avatarUrl}
                                        />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900"></div>
                                </div>

                                {/* Datos dinámicos del usuario */}
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{userName}</h2>
                                <p className="text-[var(--text-secondary)] text-sm">{userEmail}</p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 font-mono uppercase tracking-widest">Miembro desde: Marzo 2026</p>

                                <button
                                    onClick={() => navigate('/profile/personal-data')}
                                    className="mt-6 px-6 py-2 rounded-full border border-[var(--primary)] bg-transparent text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/10 transition-all flex items-center gap-2 shadow-sm duration-300"
                                >
                                    <Edit2 size={16} />
                                    Editar Perfil
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Izquierda: Estadísticas */}
                        <section className="lg:col-span-2">
                            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Estadísticas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-5 shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[var(--text-secondary)] text-sm font-medium">Total Gastado</span>
                                        <CreditCard className="text-slate-400 dark:text-slate-500" size={20} />
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">$0.00</div>
                                </div>

                                <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-5 shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[var(--text-secondary)] text-sm font-medium">Grupos Activos</span>
                                        <Users className="text-slate-400 dark:text-slate-500" size={20} />
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">0</div>
                                </div>

                                <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-5 shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[var(--text-secondary)] text-sm font-medium">Deudas Pagadas</span>
                                        <CheckCircle className="text-green-500 dark:text-green-400" size={20} />
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">0</div>
                                </div>

                                <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-5 flex items-center justify-between shadow-sm dark:shadow-none">
                                    <div>
                                        <span className="text-[var(--text-secondary)] text-sm font-medium block mb-1">Confiabilidad</span>
                                        <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">100%</div>
                                    </div>
                                    <div className="relative w-12 h-12">
                                        <svg className="transform -rotate-90 w-12 h-12">
                                            <circle className="text-slate-200 dark:text-slate-700" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
                                            <circle
                                                className="text-[var(--primary)] transition-colors duration-500"
                                                cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"
                                                strokeDasharray="126" strokeDashoffset="0"
                                            ></circle>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Columna Derecha: Ajustes y Seguridad */}
                        <section className="lg:col-span-1">
                            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Configuración</h3>
                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50 shadow-sm dark:shadow-none">

                                {/* Selector de Temas */}
                                <div className="p-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <Palette className="text-[var(--text-secondary)]" size={20} />
                                        <span className="text-sm font-medium text-[var(--text-primary)]">Tema</span>
                                    </div>
                                    <select
                                        value={!isDark ? 'light' : colorTheme}
                                        onChange={(e) => handleThemeChange(e.target.value)}
                                        className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg p-2.5 outline-none cursor-pointer transition-all"
                                    >
                                        <option value="light">Claro</option>
                                        <option value="default">Oscuro (Original)</option>
                                        <option value="vibrant">Vibrante (Rojo Mate)</option>
                                        <option value="serene">Sereno (Verde Bosque)</option>
                                        <option value="earth">Tierra (Ámbar)</option>
                                        <option value="pink">Rosa (Lomecan)</option>
                                    </select>
                                </div>

                                {/* Tamaño de fuente */}
                                <div className="p-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <Type className="text-[var(--text-secondary)]" size={20} />
                                        <span className="text-sm font-medium text-[var(--text-primary)]">Tamaño de Texto</span>
                                    </div>
                                    <div className="flex p-1 bg-[var(--bg-body)] rounded-xl border border-[var(--border-color)]">
                                        {['small', 'medium', 'large'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setFontSize(size as any)}
                                                className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${fontSize === size ? 'bg-[var(--primary)] text-white' : 'text-slate-500'
                                                    }`}
                                            >
                                                {size === 'small' ? 'Chico' : size === 'medium' ? 'Normal' : 'Grande'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Seguridad y Logout */}
                                <button onClick={() => navigate('/notifications')} className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover-bg)] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Bell className="text-[var(--text-secondary)]" size={20} />
                                        <span className="text-sm font-medium text-[var(--text-secondary)]">Notificaciones</span>
                                    </div>
                                    <ChevronRight className="text-slate-400" size={18} />
                                </button>

                                <button onClick={() => navigate('/2fa-setup')} className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover-bg)] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="text-[var(--text-secondary)]" size={20} />
                                        <span className="text-sm font-medium text-[var(--text-secondary)]">Seguridad 2FA</span>
                                    </div>
                                    <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">ACTIVO</span>
                                </button>

                                {/* BOTÓN DE CERRAR SESIÓN FINAL */}
                                <button
                                    onClick={logout}
                                    className="w-full p-4 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                                >
                                    <LogOut className="text-red-500" size={20} />
                                    <span className="text-sm font-bold text-red-500">Cerrar Sesión</span>
                                </button>
                            </div>
                            <p className="text-center text-slate-400 dark:text-slate-600 text-[10px] mt-6 font-mono uppercase tracking-widest">Easy-Pay v2.4.0 (Build 942)</p>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};