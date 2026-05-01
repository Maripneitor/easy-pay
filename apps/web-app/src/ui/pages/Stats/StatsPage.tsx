import React, { useEffect, useState } from 'react';
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
    Ghost
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { statsRepository } from '../../../infrastructure/api/repositories';
import { Loader } from '../../components/Loader/Loader';
import styles from './StatsPage.module.css';

export const StatsPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const loadStats = async () => {
            if (!userId) return;
            try {
                const data = await statsRepository.getUserStats(userId);
                setStats(data);
            } catch (error) {
                console.error("Error loading stats:", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [userId]);

    if (loading) return <Loader />;

    const categoryIcons: Record<string, any> = {
        'Comida': <Utensils size={18} />,
        'Restaurantes': <Utensils size={18} />,
        'Transporte': <Car size={18} />,
        'Entretenimiento': <Gamepad2 size={18} />,
        'Diversión': <Gamepad2 size={18} />,
        'Compras': <ShoppingBag size={18} />,
        'Otros': <Briefcase size={18} />
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    <ArrowLeft size={24} />
                </button>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Mis Estadísticas</h1>
                    <p className={styles.subtitle}>Análisis detallado de tus finanzas compartidas</p>
                </div>
            </header>

            <main className={styles.main}>
                {!stats || stats.total_spent === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 opacity-40">
                        <Ghost size={80} className="mb-6 text-[var(--text-secondary)]" />
                        <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-center">Sin datos</h2>
                        <p className="text-sm font-bold text-[var(--text-secondary)] mt-2 text-center">Agrega gastos para ver tus estadísticas</p>
                    </div>
                ) : (
                    <>
                        {/* --- Summary Cards --- */}
                        <section className={styles.summaryGrid}>
                            <div className={styles.summaryCard}>
                                <div className={`${styles.iconWrapper} ${styles.spent}`}>
                                    <Wallet size={24} />
                                </div>
                                <div className={styles.cardContent}>
                                    <span className={styles.cardLabel}>Total Gastado</span>
                                    <h2 className={styles.cardValue}>${stats?.total_spent?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h2>
                                </div>
                            </div>

                            <div className={styles.summaryCard}>
                                <div className={`${styles.iconWrapper} ${styles.owed}`}>
                                    <TrendingUp size={24} />
                                </div>
                                <div className={styles.cardContent}>
                                    <span className={styles.cardLabel}>Te deben</span>
                                    <h2 className={`${styles.cardValue} ${styles.textEmerald}`}>${stats?.owed_to_user?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h2>
                                </div>
                            </div>

                            <div className={styles.summaryCard}>
                                <div className={`${styles.iconWrapper} ${styles.owes}`}>
                                    <TrendingDown size={24} />
                                </div>
                                <div className={styles.cardContent}>
                                    <span className={styles.cardLabel}>Debes</span>
                                    <h2 className={`${styles.cardValue} ${styles.textRose}`}>${stats?.user_owes?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h2>
                                </div>
                            </div>
                        </section>

                        <div className={styles.contentGrid}>
                            {/* --- Category Breakdown --- */}
                            <section className={styles.chartSection}>
                                <div className={styles.sectionHeader}>
                                    <PieChart size={20} className={styles.sectionIcon} />
                                    <h3>Gastos por Categoría</h3>
                                </div>
                                <div className={styles.categoriesList}>
                                    {stats?.categories?.map((cat: any, index: number) => (
                                        <div key={index} className={styles.categoryRow}>
                                            <div className={styles.categoryInfo}>
                                                <div className={styles.categoryIcon}>
                                                    {categoryIcons[cat.name] || <Briefcase size={18} />}
                                                </div>
                                                <div className={styles.categoryDetails}>
                                                    <span className={styles.categoryName}>{cat.name}</span>
                                                    <span className={styles.categoryAmount}>${cat.amount?.toLocaleString('es-MX')}</span>
                                                </div>
                                            </div>
                                            <div className={styles.progressWrapper}>
                                                <div className={styles.progressBar}>
                                                    <div 
                                                        className={styles.progressFill} 
                                                        style={{ width: `${cat.percentage}%`, backgroundColor: `var(--cat-color-${(index % 5) + 1})` }}
                                                    />
                                                </div>
                                                <span className={styles.categoryPercent}>{cat.percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* --- Monthly Trend --- */}
                            <section className={styles.chartSection}>
                                <div className={styles.sectionHeader}>
                                    <BarChart3 size={20} className={styles.sectionIcon} />
                                    <h3>Tendencia Mensual</h3>
                                </div>
                                <div className={styles.trendChart}>
                                    {stats?.monthly_trend?.map((item: any, index: number) => (
                                        <div key={index} className={styles.trendBarWrapper}>
                                            <div className={styles.trendBarContainer}>
                                                <div 
                                                    className={styles.trendBar} 
                                                    style={{ height: `${(item.amount / stats.total_spent) * 100}%` }}
                                                >
                                                    <span className={styles.barTooltip}>${item.amount}</span>
                                                </div>
                                            </div>
                                            <span className={styles.trendMonth}>{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* --- Recent Activity / Insights --- */}
                        <section className={styles.insightsCard}>
                            <div className={styles.insightHeader}>
                                <Calendar size={20} />
                                <h3>Insights Financieros</h3>
                            </div>
                            <div className={styles.insightsGrid}>
                                <div className={styles.insightItem}>
                                    <ArrowUpRight size={20} className={styles.textEmerald} />
                                    <p>Tu gasto más alto este mes fue en <strong>{stats?.categories?.[0]?.name || 'N/A'}</strong>.</p>
                                </div>
                                <div className={styles.insightItem}>
                                    <ArrowDownLeft size={20} className={styles.textRose} />
                                    <p>Tienes <strong>{stats?.user_owes > 0 ? 'pagos pendientes' : 'tus cuentas claras'}</strong> en 3 grupos diferentes.</p>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};
