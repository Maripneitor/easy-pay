import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { useTheme } from '../infrastructure/context/ThemeContext';

interface SyncStatusProps {
    status: 'online' | 'offline' | 'syncing';
    pendingChanges?: number;
}

export const SyncStatus = ({ status, pendingChanges = 0 }: SyncStatusProps) => {
    const { theme, fontScale } = useTheme();

    return (
        <AnimatePresence>
            {status !== 'online' && (
                <MotiView 
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -20 }}
                    style={{ 
                        backgroundColor: status === 'offline' ? '#f43f5e' : theme.primary,
                        zIndex: 100 
                    }}
                    className="absolute top-12 left-6 right-6 px-4 py-2 rounded-full flex-row items-center justify-between shadow-lg"
                >
                    <View className="flex-row items-center gap-2">
                        <MaterialIcons 
                            name={status === 'offline' ? "cloud-off" : "sync"} 
                            size={16} 
                            color={status === 'offline' ? "white" : "black"} 
                        />
                        <Text 
                            style={{ 
                                color: status === 'offline' ? "white" : "black",
                                fontSize: 11 * fontScale 
                            }} 
                            className="font-black uppercase tracking-widest"
                        >
                            {status === 'offline' ? 'Modo Offline' : 'Sincronizando...'}
                        </Text>
                    </View>
                    
                    {pendingChanges > 0 && (
                        <View className="bg-black/20 px-2 py-0.5 rounded-full">
                            <Text style={{ color: status === 'offline' ? "white" : "black", fontSize: 9 * fontScale }} className="font-bold">
                                {pendingChanges} pendientes
                            </Text>
                        </View>
                    )}
                </MotiView>
            )}
        </AnimatePresence>
    );
};
