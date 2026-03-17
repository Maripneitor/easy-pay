import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    Edit2,
    CreditCard,
    Users,
    CheckCircle,
    Bell,
    EyeOff,
    ChevronRight,
    Lock,
    Smartphone,
    LogOut,
    Palette
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '@ui/components/PageHeader';

export const ProfilePage = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const { colorTheme, isDark, setTheme, toggleTheme } = useTheme();
    
    const userName = "Juan Pérez";
    const userEmail = "juan.perez@easypay.com";
    const avatarUrl = "https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&bold=true";

    // Lógica para el selector tipo Roblox
    const handleThemeChange = (value: string) => {
        if (value === 'light') {
            if (isDark) toggleTheme(); // Si estaba en oscuro, lo pasamos a claro
            setTheme('default');
        } else {
            if (!isDark) toggleTheme(); // Si elige cualquier tema de color, activamos el modo oscuro
            setTheme(value as any);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                
                {/* Header Section */}
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
                    {/* Profile Banner Card */}
                    <section className="w-full">
                        <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg dark:shadow-none transition-all">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-800 p-1 shadow-[0_0_20px_rgba(59,130,246,0.3)] border-2 border-sky-200 dark:border-sky-900 overflow-hidden">
                                        <img
                                            alt="Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                            src={avatarUrl}
                                        />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900"></div>
                                </div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{userName}</h2>
                                <p className="text-[var(--text-secondary)] text-sm">{userEmail}</p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 font-mono uppercase tracking-widest">Miembro desde: Enero 2024</p>

                                <button
                                    onClick={() => navigate('/profile/personal-data')}
                                    className="mt-6 px-6 py-2 rounded-full border border-blue-500 text-blue-600 dark:text-blue-500 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <Edit2 size={16} />
                                    Editar Perfil
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Stats */}
                        <section className="lg:col-span-2">
                            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Estadísticas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-5 shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[var(--text-secondary)] text-sm font-medium">Total Gastado</span>
                                        <CreditCard className="text-slate-400 dark:text-slate-500" size={20} />
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">$8,450.00</div>
                                </div>

                                <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-5 shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[var(--text-secondary)] text-sm font-medium">Grupos Activos</span>
                                        <Users className="text-slate-400 dark:text-slate-500" size={20} />
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">3</div>
                                </div>

                                <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-5 shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[var(--text-secondary)] text-sm font-medium">Deudas Pagadas</span>
                                        <CheckCircle className="text-green-500 dark:text-green-400" size={20} />
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">12</div>
                                </div>

                                <div className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-5 flex items-center justify-between shadow-sm dark:shadow-none">
                                    <div>
                                        <span className="text-[var(--text-secondary)] text-sm font-medium block mb-1">Confiabilidad</span>
                                        <div className="text-2xl font-mono font-bold text-cyan-600 dark:text-cyan-400">98%</div>
                                    </div>
                                    <div className="relative w-12 h-12">
                                        <svg className="transform -rotate-90 w-12 h-12">
                                            <circle className="text-slate-200 dark:text-slate-700" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
                                            <circle className="text-cyan-500 dark:text-cyan-400" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="126" strokeDashoffset="2.5" strokeWidth="4"></circle>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Right Column: Ajustes y Seguridad */}
                        <section className="lg:col-span-1">
                            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Ajustes</h3>
                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50 shadow-sm dark:shadow-none">
                                
                                {/* NUEVO SELECTOR DE TEMA ESTILO ROBLOX */}
                                <div className="p-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <Palette className="text-[var(--text-secondary)]" size={20} />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[var(--text-primary)]">Tema a nivel de dispositivo</span>
                                            <p className="text-[10px] text-[var(--text-secondary)]">Elige un tema para este dispositivo.</p>
                                        </div>
                                    </div>
                                    
                                    <select 
                                        value={!isDark ? 'light' : colorTheme}
                                        onChange={(e) => handleThemeChange(e.target.value)}
                                        className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all"
                                    >
                                        <option value="light">Claro</option>
                                        <option value="default">Oscuro (Original)</option>
                                        <option value="vibrant">Vibrante (Rojo Mate)</option>
                                        <option value="serene">Sereno (Verde Bosque)</option>
                                        <option value="earth">Tierra (Ámbar)</option>
                                    </select>
                                </div>

                                {/* Notificaciones */}
                                <button onClick={() => navigate('/notifications')} className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover-bg)] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Bell className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" size={20} />
                                        <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Notificaciones</span>
                                    </div>
                                    <ChevronRight className="text-slate-400 group-hover:text-[var(--text-primary)]" size={20} />
                                </button>

                                {/* Métodos de Pago */}
                                <button onClick={() => navigate('/my-payments')} className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover-bg)] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" size={20} />
                                        <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Métodos de Pago</span>
                                    </div>
                                    <ChevronRight className="text-slate-400 group-hover:text-[var(--text-primary)]" size={20} />
                                </button>

                                {/* Privacidad */}
                                <button className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover-bg)] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <EyeOff className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" size={20} />
                                        <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Privacidad</span>
                                    </div>
                                    <ChevronRight className="text-slate-400 group-hover:text-[var(--text-primary)]" size={20} />
                                </button>
                            </div>

                            {/* Seguridad Section */}
                            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 mt-8">Seguridad</h3>
                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50 shadow-sm dark:shadow-none">
                                <button onClick={() => navigate('/recover-password')} className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover-bg)] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Lock className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" size={20} />
                                        <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Cambiar contraseña</span>
                                    </div>
                                    <ChevronRight className="text-slate-400 group-hover:text-[var(--text-primary)]" size={20} />
                                </button>

                                <button onClick={() => navigate('/2fa-setup')} className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover-bg)] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" size={20} />
                                        <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">2FA</span>
                                    </div>
                                    <span className="text-xs text-green-600 font-medium bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded border border-green-200">Activado</span>
                                </button>
                            </div>

                            <div className="mt-8">
                                <button onClick={() => navigate('/auth')} className="w-full py-3 rounded-xl border border-red-200 dark:border-red-400/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                                    <LogOut size={20} />
                                    Cerrar sesión
                                </button>
                                <p className="text-center text-slate-400 dark:text-slate-600 text-[10px] mt-4 font-mono">Easy-Pay v2.4.0 (Build 942)</p>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};