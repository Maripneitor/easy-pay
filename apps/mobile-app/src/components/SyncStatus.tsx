import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { useTheme } from '../infrastructure/context/ThemeContext';
import { useEasyPay } from '../../context/EasyPayContext';

export const SyncStatus = () => {
    const { theme, fontScale } = useTheme();
    const { isOnline } = useEasyPay();

    return (
        <AnimatePresence>
            {!isOnline && (
                <MotiView 
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -20 }}
                    style={{ 
                        backgroundColor: '#f43f5e',
                        zIndex: 100 
                    }}
                    className="absolute top-12 left-6 right-6 px-4 py-2 rounded-full flex-row items-center justify-center shadow-lg"
                >
                    <View className="flex-row items-center gap-2">
                        <MaterialIcons 
                            name="cloud-off" 
                            size={16} 
                            color="white" 
                        />
                        <Text 
                            style={{ 
                                color: "white",
                                fontSize: 11 * fontScale 
                            }} 
                            className="font-bold text-center"
                        >
                            🔴 Offline. Los cambios se guardarán localmente.
                        </Text>
                    </View>
                </MotiView>
            )}
            {isOnline && (
                <MotiView 
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ zIndex: 100 }}
                    className="absolute top-12 right-6"
                >
                    <View className="bg-emerald-500/20 px-3 py-1 rounded-full flex-row items-center gap-1.5 border border-emerald-500/30">
                        <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <Text 
                            style={{ color: '#10b981', fontSize: 10 * fontScale }} 
                            className="font-bold uppercase tracking-wider"
                        >
                            Online
                        </Text>
                    </View>
                </MotiView>
            )}
        </AnimatePresence>
    );
};
