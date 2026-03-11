import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Member } from '@easy-pay/domain';
import { STORAGE_KEYS } from '../../infrastructure/localStorage/storage-keys';
import { clearAuthToken } from '../../infrastructure/api/http-client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuestSession {
    id: string;           // Temporary session id
    name: string;
    joinedGroupCode?: string;
}

export interface AuthContextType {
    /** Authenticated registered user */
    user: Member | null;
    /** Guest session (no account, just a name) */
    guest: GuestSession | null;
    isLoading: boolean;
    /** True if user OR guest session is active */
    isAuthenticated: boolean;
    /** True only for guest sessions */
    isGuest: boolean;

    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    loginAsGuest: (name: string, groupCode?: string) => Promise<void>;
    logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user,      setUser]      = useState<Member | null>(null);
    const [guest,     setGuest]     = useState<GuestSession | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // ── Restore session on mount ───────────────────────────────────────────────
    useEffect(() => {
        const restoreSession = () => {
            try {
                // Try to restore a registered user session
                const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
                if (storedUser) {
                    setUser(JSON.parse(storedUser) as Member);
                    return;
                }

                // Try to restore a guest session
                const storedGuest = localStorage.getItem(STORAGE_KEYS.GUEST_SESSION);
                if (storedGuest) {
                    setGuest(JSON.parse(storedGuest) as GuestSession);
                }
            } catch {
                // Corrupt storage — start clean
                localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
                localStorage.removeItem(STORAGE_KEYS.GUEST_SESSION);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    // ── Auth methods ───────────────────────────────────────────────────────────

    const loginWithGoogle = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            /**
             * TODO (Fase Backend):
             *   const token = await googleOAuthFlow();
             *   setAuthToken(token);
             *   const res = await httpClient.get<Member>('/auth/me');
             *   persistUser(res.data);
             */

            // Mock: simula un usuario autenticado con Google
            await new Promise(r => setTimeout(r, 800));
            const mockUser: Member = {
                id:        'google-user-1',
                name:      'Juan Pérez',
                role:      'member',
                avatarUrl: 'https://ui-avatars.com/api/?name=Juan+Perez&background=4285F4&color=fff',
                hasPaid:   false,
            };
            persistUser(mockUser);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loginWithEmail = useCallback(async (email: string): Promise<void> => {
        setIsLoading(true);
        try {
            /**
             * TODO (Fase Backend):
             *   const res = await httpClient.post<{ token: string; user: Member }>('/auth/login', { email, password });
             *   setAuthToken(res.data.token);
             *   persistUser(res.data.user);
             */

            // Mock
            await new Promise(r => setTimeout(r, 800));
            const mockUser: Member = {
                id:        `email-user-${Date.now()}`,
                name:      email.split('@')[0],
                role:      'member',
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}`,
                hasPaid:   false,
            };
            persistUser(mockUser);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loginAsGuest = useCallback(async (name: string, groupCode?: string): Promise<void> => {
        setIsLoading(true);
        try {
            // Guests don't call the API — they just get a local session id
            await new Promise(r => setTimeout(r, 300));
            const guestSession: GuestSession = {
                id:             `guest-${Date.now()}`,
                name:           name.trim(),
                joinedGroupCode: groupCode,
            };
            localStorage.setItem(STORAGE_KEYS.GUEST_SESSION, JSON.stringify(guestSession));
            setGuest(guestSession);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        // Clear everything
        clearAuthToken();
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        localStorage.removeItem(STORAGE_KEYS.GUEST_SESSION);
        setUser(null);
        setGuest(null);
    }, []);

    // ── Private helpers ────────────────────────────────────────────────────────

    const persistUser = (member: Member) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(member));
        setUser(member);
    };

    // ── Context value ──────────────────────────────────────────────────────────

    const value: AuthContextType = {
        user,
        guest,
        isLoading,
        isAuthenticated: !!(user || guest),
        isGuest:         !user && !!guest,
        loginWithGoogle,
        loginWithEmail,
        loginAsGuest,
        logout,
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
