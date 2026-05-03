import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS } from '../../infrastructure/localStorage/storage-keys';
import { clearAuthToken } from '../../infrastructure/api/http-client';
import { authService, type User } from '../../services/authService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuestSession {
    id: string;           // Temporary session id
    name: string;
    joinedGroupCode?: string;
}

export interface AuthContextType {
    /** Authenticated registered user */
    user: User | null;
    /** Guest session (no account, just a name) */
    guest: GuestSession | null;
    /** Initial loading state (restoring session) */
    isLoading: boolean;
    /** State during login/logout operations */
    isAuthenticating: boolean;
    /** True if user OR guest session is active */
    isAuthenticated: boolean;
    /** True only for guest sessions */
    isGuest: boolean;

    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<any>;
    loginAsGuest: (name: string, groupCode?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUserSession: (updatedUser: User, newToken?: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [guest, setGuest] = useState<GuestSession | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

    // ── Restore session and Sync across tabs ─────────────────────────────────
    useEffect(() => {
        const syncSession = () => {
            const storedUser = authService.getStoredUser();
            setUser(storedUser);
            
            const storedGuest = localStorage.getItem(STORAGE_KEYS.GUEST_SESSION);
            setGuest(storedGuest ? JSON.parse(storedGuest) : null);
            
            setIsLoading(false);
        };

        // Listen for storage changes from other tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEYS.AUTH_USER || e.key === STORAGE_KEYS.AUTH_TOKEN || e.key === STORAGE_KEYS.GUEST_SESSION) {
                syncSession();
            }
        };

        syncSession();
        window.addEventListener('storage', handleStorageChange);
        
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // ── Auth methods ───────────────────────────────────────────────────────────

    const loginWithGoogle = useCallback(async (): Promise<void> => {
        setIsAuthenticating(true);
        try {
            // Mock for now as backend doesn't support Google OAuth yet
            await new Promise(r => setTimeout(r, 800));
            const mockUser: User = {
                id: 'google-user-1',
                nombre: 'Juan Pérez',
                email: 'juan@example.com',
                avatarUrl: 'https://ui-avatars.com/api/?name=Juan+Perez&background=4285F4&color=fff',
            };
            authService.persistSession('mock-google-token', mockUser);
            setUser(authService.getStoredUser());
        } finally {
            setIsAuthenticating(false);
        }
    }, []);

    const loginWithEmail = useCallback(async (email: string, password: string): Promise<any> => {
        setIsAuthenticating(true);
        try {
            const result = await authService.login(email, password);
            
            if (result.status === 'success') {
                setUser(authService.getStoredUser());
            }
            
            return result;
        } finally {
            setIsAuthenticating(false);
        }
    }, []);

    const loginAsGuest = useCallback(async (name: string, groupCode?: string): Promise<void> => {
        setIsAuthenticating(true);
        try {
            await new Promise(r => setTimeout(r, 300));
            const guestSession: GuestSession = {
                id: `guest-${Date.now()}`,
                name: name.trim(),
                joinedGroupCode: groupCode,
            };
            localStorage.setItem(STORAGE_KEYS.GUEST_SESSION, JSON.stringify(guestSession));
            setGuest(guestSession);
        } finally {
            setIsAuthenticating(false);
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        setIsAuthenticating(true);
        try {
            authService.clearSession();
            setUser(null);
            setGuest(null);
            window.location.href = '/auth';
        } finally {
            setIsAuthenticating(false);
        }
    }, []);

    const updateUserSession = useCallback((updatedUser: User, newToken?: string) => {
        if (newToken) {
            authService.persistSession(newToken, updatedUser);
        } else {
            authService.updateUserSession(updatedUser);
        }
        setUser(authService.getStoredUser());
    }, []);

    // ── Context value ──────────────────────────────────────────────────────────

    const value: AuthContextType = {
        user,
        guest,
        isLoading,
        isAuthenticating,
        isAuthenticated: !!(user || guest),
        isGuest: !user && !!guest,
        loginWithGoogle,
        loginWithEmail,
        loginAsGuest,
        logout,
        updateUserSession,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuthContext = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuthContext must be used inside <AuthProvider>');
    }
    return ctx;
};

