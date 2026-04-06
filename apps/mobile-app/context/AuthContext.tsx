import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../src/domain/types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    saveSession: (token: string, user: User) => Promise<void>;
    saveGuestSession: (user: User) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSession();
    }, []);

    const loadSession = async () => {
        try {
            const savedUser = await AsyncStorage.getItem('user_data');
            
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser) as User;
                setUser(parsedUser);
                
                if (!parsedUser.isGuest) {
                    const savedToken = await SecureStore.getItemAsync('user_token');
                    if (savedToken) setToken(savedToken);
                }
            }
        } catch (e) {
            console.error('Failed to load session', e);
        } finally {
            setIsLoading(false);
        }
    };

    const saveSession = async (newToken: string, newUser: User) => {
        try {
            await SecureStore.setItemAsync('user_token', newToken);
            await AsyncStorage.setItem('user_data', JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
        } catch (e) {
            console.error('Failed to save session', e);
        }
    };

    const saveGuestSession = async (newUser: User) => {
        try {
            await AsyncStorage.setItem('user_data', JSON.stringify({ ...newUser, isGuest: true }));
            setUser({ ...newUser, isGuest: true });
            setToken(null);
        } catch (e) {
            console.error('Failed to save guest session', e);
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('user_token');
            await AsyncStorage.removeItem('user_data');
            setToken(null);
            setUser(null);
        } catch (e) {
            console.error('Failed to logout', e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, saveSession, saveGuestSession, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
