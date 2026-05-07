import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { useTheme } from '../infrastructure/context/ThemeContext';
import { useEasyPay } from '../../context/EasyPayContext';

export const SyncStatus = () => {
    const { theme, fontScale } = useTheme();
    const { isOnline, activeGrupo } = useEasyPay();

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
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{ zIndex: 100 }}
                    className="absolute top-14 right-6"
                >
                    <View 
                        style={{ 
                            backgroundColor: theme.bg + 'CC',
                            borderColor: '#10b98140'
                        }}
                        className="px-3 py-1.5 rounded-full flex-row items-center gap-2 border shadow-sm"
                    >
                        <MotiView
                            from={{ opacity: 0.4 }}
                            animate={{ opacity: 1 }}
                            transition={{ loop: true, duration: 1000 }}
                            className="w-2 h-2 rounded-full bg-emerald-500"
                        />
                        <Text 
                            style={{ color: '#10b981', fontSize: 9 * fontScale }} 
                            className="font-black uppercase tracking-[0.1em]"
                        >
                            {activeGrupo ? 'Sincronizado' : 'Online'}
                        </Text>
                        <Ionicons name="flash" size={10} color="#10b981" />
                    </View>
                </MotiView>
            )}
        </AnimatePresence>
    );
};
