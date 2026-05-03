import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown, 
    PieChart, 
    Calendar,
    ArrowLeft,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    ShoppingBag,
    Utensils,
    Car,
    Gamepad2,
    Briefcase,
    Ghost,
    Users,
    Activity,
    Cake,
    Plane,
    CheckCircle,
    RotateCw
} from 'lucide-react';
import { 
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useProfileStats } from '../Profile/useProfileStats';
import { Loader } from '../../components/Loader/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../infrastructure/utils';
import styles from './StatsPage.module.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const categoryIcons: Record<string, any> = {
    'Comida': <Utensils size={18} />,
    'Restaurantes': <Utensils size={18} />,
    'Transporte': <Car size={18} />,
    'Entretenimiento': <Gamepad2 size={18} />,
    'Diversión': <Gamepad2 size={18} />,
    'Compras': <ShoppingBag size={18} />,
    'Otros': <Briefcase size={18} />
};

// --- Sub-componentes Semánticos ---

const CategoryDonutChart = ({ data }: { data: any[] }) => (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="amount"
                    nameKey="category"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <ReTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                    formatter={(value: number) => `$${value.toLocaleString('es-MX')}`}
                />
            </RePieChart>
        </ResponsiveContainer>
    </div>
);

const ExpenseLineChart = ({ data }: { data: any[] }) => (
    <div className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                />
                <YAxis hide />
                <ReTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    cursor={{ stroke: 'var(--primary)', strokeWidth: 2 }}
                />
                <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="var(--primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

export const StatsPage = () => {
    const navigate = useNavigate();
    const { stats, loading, error, refresh } = useProfileStats();

    if (loading) return <Loader />;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const hasData = stats && stats.total_spent > 0;

    return (
        <div className={cn(styles.container, "bg-[var(--bg-body)] min-h-screen pb-20")}>
            <header className={styles.header}>
                <div className="max-w-6xl mx-auto w-full px-6 flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 text-[var(--text-primary)]">
                        <ArrowLeft size={24} />
                    </button>
                    <div className={styles.headerContent}>
                        <h1 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">Gráficas y Análisis</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Tu ecosistema financiero en un solo lugar</p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {!hasData ? (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center py-40 opacity-40 text-center"
                        >
                            <div className="p-8 bg-black/5 rounded-[3rem] mb-8">
                                <Ghost size={80} className="text-slate-400" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Sin actividad aún</h2>
                            <p className="text-sm font-bold mt-2 text-slate-500">Crea un grupo o registra gastos para activar tu historial.</p>
                            <button 
                                onClick={() => navigate('/create-group')}
                                className="mt-8 px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                            >
                                Iniciar Primer Grupo
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="dashboard"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-12"
                        >
                            {/* --- Summary Cards --- */}
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <motion.div variants={itemVariants} className="p-8 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-color)] shadow-sm group hover:border-[var(--primary)]/30 transition-all backdrop-blur-xl">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:rotate-6 transition-transform">
                                        <Wallet size={28} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Gasto Acumulado</span>
                                    <h2 className="text-4xl font-black mt-2 tracking-tighter text-[var(--text-primary)]">
                                        ${stats?.total_spent?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </h2>
                                </motion.div>

                                <motion.div variants={itemVariants} className="p-8 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-color)] shadow-sm group hover:border-emerald-500/30 transition-all backdrop-blur-xl">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:rotate-6 transition-transform">
                                        <TrendingUp size={28} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Por recibir</span>
                                    <h2 className="text-4xl font-black mt-2 tracking-tighter text-emerald-500">
                                        ${(stats?.owed_to_user || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </h2>
                                </motion.div>

                                <motion.div variants={itemVariants} className="p-8 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-color)] shadow-sm group hover:border-rose-500/30 transition-all backdrop-blur-xl">
                                    <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6 group-hover:rotate-6 transition-transform">
                                        <TrendingDown size={28} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Por pagar</span>
                                    <h2 className="text-4xl font-black mt-2 tracking-tighter text-rose-500">
                                        ${(stats?.user_owes || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </h2>
                                </motion.div>
                            </section>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* --- Category Breakdown --- */}
                                <motion.section variants={itemVariants} className="p-10 bg-[var(--bg-card)] rounded-[3rem] border border-[var(--border-color)] shadow-sm backdrop-blur-xl">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-500">
                                                <PieChart size={24} />
                                            </div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter">Categorías</h3>
                                        </div>
                                        <span className="text-[9px] font-black bg-violet-500/10 text-violet-500 px-3 py-1 rounded-full uppercase tracking-widest">Distribución</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center">
                                        <CategoryDonutChart data={stats?.categories || []} />
                                        
                                        <div className="grid grid-cols-2 w-full gap-4 mt-6">
                                            {stats?.categories?.slice(0, 4).map((cat: any, index: number) => (
                                                <div key={index} className="flex items-center gap-3 p-4 bg-black/5 rounded-2xl border border-white/5">
                                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-500 truncate">{cat.category || cat.name}</p>
                                                        <p className="text-xs font-bold text-[var(--text-primary)]">${cat.amount?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.section>

                                {/* --- Monthly Trend --- */}
                                <motion.section variants={itemVariants} className="p-10 bg-[var(--bg-card)] rounded-[3rem] border border-[var(--border-color)] shadow-sm backdrop-blur-xl flex flex-col">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                                                <BarChart3 size={24} />
                                            </div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter">Tendencia</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-[var(--primary)] text-white rounded-lg text-[9px] font-black uppercase tracking-widest px-3">6M</button>
                                            <button className="p-2 bg-black/5 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest px-3">1Y</button>
                                        </div>
                                    </div>
                                    
                                    <ExpenseLineChart data={stats?.monthly_trend || []} />
                                    
                                    <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Últimos 4 meses</span>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+12.5% vs periodo anterior</span>
                                    </div>
                                </motion.section>
                            </div>
                            
                            {/* --- Grupos Archivados --- */}
                            <motion.section variants={itemVariants} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Grupos Archivados</h3>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cerrados recientemente</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Mapped Archived Groups or Mock for now to preserve layout */}
                                    <div className="group relative rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl transition-all duration-300 hover:border-[var(--primary)] hover:shadow-xl">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-[var(--primary)]/10 rounded-2xl border border-[var(--primary)]/20 text-[var(--primary)]">
                                                    <Cake size={28} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[var(--text-primary)] font-black text-xl uppercase tracking-tight">Cumpleaños Pedro</h4>
                                                    <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase opacity-60 mt-1">Finalizado el 12 Ago</p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                <CheckCircle size={14} /> Pagado
                                            </span>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center text-sm border-t border-[var(--border-color)] pt-6">
                                                <span className="text-[var(--text-secondary)] font-medium">Total recolectado</span>
                                                <span className="text-[var(--text-primary)] font-mono font-black text-lg">$4,250.00</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <button className="flex-1 py-4 rounded-2xl border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all">
                                                    Ver Detalle
                                                </button>
                                                <button className="flex-1 py-4 rounded-2xl border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all flex items-center justify-center gap-2">
                                                    <RotateCw size={14} /> Reactivar
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl transition-all duration-300 hover:border-[var(--primary)] hover:shadow-xl">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-[var(--primary)]/10 rounded-2xl border border-[var(--primary)]/20 text-[var(--primary)]">
                                                    <Plane size={28} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[var(--text-primary)] font-black text-xl uppercase tracking-tight">Viaje Acapulco</h4>
                                                    <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase opacity-60 mt-1">Finalizado el 05 Jul</p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                <CheckCircle size={14} /> Pagado
                                            </span>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center text-sm border-t border-[var(--border-color)] pt-6">
                                                <span className="text-[var(--text-secondary)] font-medium">Total recolectado</span>
                                                <span className="text-[var(--text-primary)] font-mono font-black text-lg">$12,800.00</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <button className="flex-1 py-4 rounded-2xl border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all">
                                                    Ver Detalle
                                                </button>
                                                <button className="flex-1 py-4 rounded-2xl border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all flex items-center justify-center gap-2">
                                                    <RotateCw size={14} /> Reactivar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* --- Insights & Balance --- */}
                            <motion.section variants={itemVariants} className="p-10 bg-gradient-to-br from-[var(--primary)] to-blue-700 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-12 opacity-10">
                                    <Activity size={180} strokeWidth={1} />
                                </div>
                                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={20} className="text-blue-200" />
                                            <h3 className="text-xl font-black uppercase tracking-tighter">Insights Globales</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-center gap-4">
                                                <ArrowUpRight size={24} className="text-blue-200 shrink-0" />
                                                <p className="text-sm font-medium">Categoría dominante: <strong>{stats?.categories?.[0]?.category || 'N/A'}</strong></p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-center gap-4">
                                                <Activity size={24} className="text-blue-200 shrink-0" />
                                                <p className="text-sm font-medium">Balance neto actual: <strong>${((stats?.owed_to_user || 0) - (stats?.user_owes || 0)).toLocaleString('es-MX')}</strong></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-auto flex flex-col items-center gap-2 p-10 bg-black/10 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Total Transaccionado</span>
                                        <h4 className="text-5xl font-black tracking-tighter">
                                            ${stats?.total_spent?.toLocaleString('es-MX')}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-200">Cuenta verificada</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};
