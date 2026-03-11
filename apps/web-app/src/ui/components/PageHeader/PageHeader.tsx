import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import styles from './PageHeader.module.css';

const USER_AVATAR_URL = 'https://ui-avatars.com/api/?name=Juan&background=3b82f6&color=fff&bold=true';
const DEFAULT_USER_NAME = 'Juan';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    rightSlot?: React.ReactNode;
    /** Cambiado a false por defecto para limpiar la interfaz */
    showAvatar?: boolean;
    onAvatarClick?: () => void;
    showNotification?: boolean;
    onNotificationClick?: () => void;
    notificationCount?: number;
    userName?: string;
    onMenuClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    onBack,
    onMenuClick,
    rightSlot,
    showAvatar = false, // <-- CAMBIO AQUÍ: Ahora es false por defecto
    onAvatarClick,
    showNotification = false,
    onNotificationClick,
    notificationCount = 0,
    userName = DEFAULT_USER_NAME,
}: PageHeaderProps) => {
    const navigate = useNavigate();
    const handleAvatarClick = onAvatarClick || (() => navigate('/profile'));

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                {/* Left – Back button or Menu */}
                <div className={styles.leftSlot}>
                    {onMenuClick && (
                        <button 
                            onClick={onMenuClick} 
                            className="md:hidden p-2 text-[var(--text-primary)] mr-2"
                        >
                            <span className="sr-only">Menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                    )}

                    {onBack ? (
                        <button onClick={onBack} className={styles.backBtn}>
                            <ArrowLeft size={18} className={styles.backIcon} />
                            <span className={styles.backText}>Volver</span>
                        </button>
                    ) : null}
                </div>

                {/* Center – Title & subtitle */}
                <div className={styles.titleContainer}>
                    {subtitle && (
                        <span className={styles.subtitle}>
                            {subtitle}
                        </span>
                    )}
                    <h1 className={styles.title}>
                        {title}
                    </h1>
                </div>

                {/* Right – ThemeSwitch + notification */}
                <div className={styles.rightActions}>
                    <div className="mr-4 flex items-center">
                        <ThemeSwitch />
                    </div>
                    
                    {rightSlot}

                    {showNotification && (
                        <button
                            className={styles.notifBtn}
                            onClick={onNotificationClick}
                        >
                            <Bell size={20} />
                            {notificationCount > 0 && (
                                <span className={styles.notifBadge} />
                            )}
                        </button>
                    )}

                    {/* El bloque del Avatar se mantiene pero no se renderiza por el showAvatar=false */}
                    {showAvatar && (
                        <div className={styles.avatarGroup} onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                            <span className={styles.userNameLabel}>{userName}</span>
                            <div className={styles.avatarWrapper}>
                                <img
                                    src={USER_AVATAR_URL}
                                    alt={userName}
                                    className={styles.avatar}
                                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                        (e.target as HTMLImageElement).src =
                                            `https://ui-avatars.com/api/?name=${userName}&background=3b82f6&color=fff`;
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};