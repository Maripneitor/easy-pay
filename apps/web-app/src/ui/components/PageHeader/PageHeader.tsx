import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import styles from './PageHeader.module.css';

const USER_AVATAR_URL = 'https://ui-avatars.com/api/?name=Juan&background=3b82f6&color=fff&bold=true';
const DEFAULT_USER_NAME = 'Juan';

interface PageHeaderProps {
    /** Centered title text (uppercased) */
    title: string;
    /** Subtitle displayed below the title in smaller text */
    subtitle?: string;
    /** Called when back arrow is clicked */
    onBack?: () => void;
    /** Optional node rendered on the right before the avatar */
    rightSlot?: React.ReactNode;
    /** Show user avatar (default: true) */
    showAvatar?: boolean;
    /** Called when avatar is clicked */
    onAvatarClick?: () => void;
    /** Show notification bell (default: false) */
    showNotification?: boolean;
    /** Called when notification bell is clicked */
    onNotificationClick?: () => void;
    /** Number of unread notifications – shows red badge */
    notificationCount?: number;
    /** Optional user name to display next to avatar */
    userName?: string;
}

/**
 * Unified sticky top header used across all inner pages.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    onBack,
    rightSlot,
    showAvatar = true,
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

                {/* Right – rightSlot + notification + avatar */}
                <div className={styles.rightActions}>
                    <div style={{ marginRight: '1rem' }}>
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

