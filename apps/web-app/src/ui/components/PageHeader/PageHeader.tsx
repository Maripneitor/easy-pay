import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Bell, Check } from 'lucide-react';
import { ROUTES } from '../../../infrastructure/routes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../infrastructure/utils';
import styles from './PageHeader.module.css';

const USER_AVATAR_URL = 'https://ui-avatars.com/api/?name=Juan&background=3b82f6&color=fff&bold=true';
const DEFAULT_USER_NAME = 'Juan';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    rightSlot?: React.ReactNode;
    showAvatar?: boolean;
    onAvatarClick?: () => void;
    showStats?: boolean;
    onStatsClick?: () => void;
    userName?: string;
    onMenuClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    onBack,
    onMenuClick,
    rightSlot,
    showAvatar = false,
    onAvatarClick,
    showStats = false,
    onStatsClick,
    userName = DEFAULT_USER_NAME,
}) => {
    const navigate = useNavigate();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    
    const handleAvatarClick = onAvatarClick || (() => navigate(ROUTES.PROFILE));
    const handleStatsClick = onStatsClick || (() => navigate(ROUTES.STATS));

    const notifications = [
        { id: 1, text: 'Tu pago de "Cena" fue confirmado', time: 'hace 5 min', unread: true },
        { id: 2, text: 'Mario te agregó al grupo "Viaje"', time: 'hace 2 horas', unread: false },
    ];

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.leftSlot}>
                    <div className="flex items-center">
                        {onMenuClick && (
                            <button onClick={onMenuClick} className="md:hidden p-2 text-[var(--text-primary)] mr-2" aria-label="Abrir menú de navegación">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </button>
                        )}
                        
                        {/* Notification Bell (Top Left as requested) */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="p-2.5 bg-black/5 hover:bg-[var(--primary)]/10 text-slate-500 hover:text-[var(--primary)] rounded-xl transition-all relative group"
                                aria-label="Notificaciones"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[var(--bg-body)] animate-pulse" />
                            </button>

                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute left-0 mt-4 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-2xl z-[1000] overflow-hidden backdrop-blur-xl"
                                    >
                                        <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-black/5">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Notificaciones</h4>
                                            <span className="text-[9px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">2 Nuevas</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map(n => (
                                                <div key={n.id} className={cn("p-4 border-b border-[var(--border-color)] hover:bg-black/5 transition-colors cursor-pointer group", n.unread && "bg-[var(--primary)]/5")}>
                                                    <div className="flex gap-3">
                                                        <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", n.unread ? "bg-[var(--primary)]" : "bg-transparent")} />
                                                        <div className="flex-1">
                                                            <p className="text-xs font-bold text-[var(--text-primary)] leading-relaxed">{n.text}</p>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{n.time}</p>
                                                        </div>
                                                        {n.unread && <Check size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-black/5 transition-all">Ver todas las notificaciones</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {onBack && (
                        <button onClick={onBack} className={styles.backBtn} aria-label="Volver a la página anterior">
                            <ArrowLeft size={18} className={styles.backIcon} aria-hidden="true" />
                            <span className={styles.backText}>Volver</span>
                        </button>
                    )}
                </div>

                <div className={styles.titleContainer}>
                    {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                    <h1 className={styles.title}>{title}</h1>
                </div>

                <div className={styles.rightActions}>
                    {/* Se eliminó el ThemeSwitch de aquí para centralizarlo en Ajustes */}
                    {rightSlot}
                    {showStats && (
                        <button className={styles.notifBtn} onClick={handleStatsClick} aria-label="Ver historial">
                            <BarChart3 size={20} aria-hidden="true" />
                        </button>
                    )}
                    {showAvatar && (
                        <div className={styles.avatarGroup} onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                            <span className={styles.userNameLabel}>{userName}</span>
                            <div className={styles.avatarWrapper}>
                                <img src={USER_AVATAR_URL} alt={userName} className={styles.avatar} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};