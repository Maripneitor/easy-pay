import React, { createContext, useContext, useState } from 'react';

interface NotificationContextType {
    unreadCount: number;
    setUnreadCount: (count: number) => void;
    hasAlerts: boolean;
    setHasAlerts: (has: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(4);
    const [hasAlerts, setHasAlerts] = useState(true);

    return (
        <NotificationContext.Provider value={{ unreadCount, setUnreadCount, hasAlerts, setHasAlerts }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
