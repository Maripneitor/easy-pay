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
    Sun,
    Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '@ui/components/PageHeader';

export const ProfilePage = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const userName = "Juan Pérez";
    const userEmail = "juan.perez@easypay.com";
    const avatarUrl = "https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&bold=true";

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-alice-blue dark:bg-slate-900 font-display text-slate-800 dark:text-slate-200 antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Header */}
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="MI PERFIL"
                    subtitle="Gestiona tu cuenta"
                    showNotification
                    notificationCount={0}
                    onNotificationClick={() => navigate('/notifications')}
                />

                <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-8">
                    {/* Profile Card */}
                    <section className="w-full">
                        <div className="bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg dark:shadow-none transition-all">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-800 p-1 shadow-[0_0_20px_rgba(186,230,253,0.4)] border-2 border-sky-200 dark:border-sky-900 overflow-hidden">
                                        <img
                                            alt="Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                            src={avatarUrl}
                                        />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900"></div>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{userName}</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">{userEmail}</p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 font-mono">Miembro desde: Enero 2024</p>

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
                        {/* Activity Stats */}
                        <section className="lg:col-span-2">
                            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Estadísticas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Stat 1 */}
                                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 hover:border-blue-300 dark:hover:border-slate-500 transition-colors shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Gastado</span>
                                        <CreditCard className="text-slate-400 dark:text-slate-500" size={20} />
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-slate-900 dark:text-sky-50">
                                        $8,450.00
                                    </div>
                                </div>

                                {/* Stat 2 */}
                                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 hover:border-blue-300 dark:hover:border-slate-500 transition-colors shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Grupos Activos</span>
                                        <Users className="text-slate-400 dark:text-slate-500" size={20} />
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                                        3
                                    </div>
                                </div>

                                {/* Stat 3 */}
                                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 hover:border-blue-300 dark:hover:border-slate-500 transition-colors shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Deudas Pagadas</span>
                                        <CheckCircle className="text-green-500 dark:text-green-400" size={20} />
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                                        12
                                    </div>
                                </div>

                                {/* Reliability Graph */}
                                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 hover:border-blue-300 dark:hover:border-slate-500 transition-colors flex items-center justify-between shadow-sm dark:shadow-none">
                                    <div>
                                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium block mb-1">Confiabilidad</span>
                                        <div className="text-2xl font-mono font-bold text-cyan-600 dark:text-cyan-400">98%</div>
                                    </div>
                                    <div className="relative w-12 h-12 flex items-center justify-center">
                                        <svg className="transform -rotate-90 w-12 h-12">
                                            <circle className="text-slate-200 dark:text-slate-700" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
                                            <circle className="text-cyan-500 dark:text-cyan-400" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="126" strokeDashoffset="2.5" strokeWidth="4"></circle>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Settings Menu */}
                        <section className="lg:col-span-1">
                            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Ajustes</h3>
                            <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50 shadow-sm dark:shadow-none">
                                {/* Dark Mode */}
                                <div
                                    className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                                    onClick={toggleTheme}
                                >
                                    <div className="flex items-center gap-3">
                                        {isDark ? (
                                            <Moon className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" size={20} />
                                        ) : (
                                            <Sun className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" size={20} />
                                        )}
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                                            {isDark ? 'Modo oscuro' : 'Modo claro'}
                                        </span>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full relative shadow-inner transition-colors ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isDark ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>

                                {/* Notifications */}
                                <button
                                    onClick={() => navigate('/notifications')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <Bell className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" size={20} />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Notificaciones</span>
                                    </div>
                                    <ChevronRight className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400" size={20} />
                                </button>

                                {/* Payment Methods */}
                                <button
                                    onClick={() => navigate('/my-payments')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" size={20} />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Métodos de Pago</span>
                                    </div>
                                    <ChevronRight className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400" size={20} />
                                </button>

                                {/* Privacy */}
                                <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group text-left">
                                    <div className="flex items-center gap-3">
                                        <EyeOff className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" size={20} />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Privacidad</span>
                                    </div>
                                    <ChevronRight className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400" size={20} />
                                </button>
                            </div>

                            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 mt-8">Seguridad</h3>
                            <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50 shadow-sm dark:shadow-none">
                                {/* Change Password */}
                                <button
                                    onClick={() => navigate('/recover-password')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <Lock className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" size={20} />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Cambiar contraseña</span>
                                    </div>
                                    <ChevronRight className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400" size={20} />
                                </button>

                                {/* 2FA */}
                                <button
                                    onClick={() => navigate('/2fa-setup')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" size={20} />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">2FA</span>
                                    </div>
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded border border-green-200 dark:border-green-500/20">Activado</span>
                                </button>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="w-full py-3 rounded-xl border border-red-200 dark:border-red-400/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium group"
                                >
                                    <LogOut className="group-hover:-translate-x-0.5 transition-transform" size={20} />
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
