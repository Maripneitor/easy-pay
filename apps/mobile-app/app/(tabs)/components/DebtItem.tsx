import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../src/infrastructure/context/ThemeContext';
import { useRouter } from 'expo-router';

export const DebtItem = React.memo(({ debt, onClose }: any) => {
    const { theme } = useTheme();
    const router = useRouter();

    const handlePress = React.useCallback(() => {
        onClose();
        router.push({
            pathname: '/settle-up',
            params: {
                groupId: debt.groupId,
                creditorId: debt.creditorId,
                amount: debt.amount.toString(),
                groupName: debt.groupName,
                creditorName: debt.creditorName
            }
        });
    }, [debt, onClose, router]);

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
            className="p-6 rounded-[32px] border flex-row items-center gap-4"
        >
            <View style={{ backgroundColor: theme.primary + '20' }} className="w-12 h-12 rounded-2xl items-center justify-center">
                <MaterialIcons name="account-balance-wallet" size={24} color={theme.primary} />
            </View>
            <View className="flex-1">
                <Text style={{ color: theme.text }} className="font-black text-base">{debt.groupName}</Text>
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold uppercase tracking-widest opacity-60">Pagas a {debt.creditorName}</Text>
            </View>
            <Text style={{ color: theme.primary }} className="font-black text-lg">${debt.amount.toFixed(2)}</Text>
        </TouchableOpacity>
    );
});
