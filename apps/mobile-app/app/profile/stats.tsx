import React from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useProfileStats } from '../../src/infrastructure/hooks/useProfileStats';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function StatsScreen() {
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    const { stats, isLoading } = useProfileStats(user?.id);
    const router = useRouter();

    const chartConfig = {
        backgroundGradientFrom: theme.cardSecondary,
        backgroundGradientTo: theme.cardSecondary,
        color: (opacity = 1) => theme.primary,
        labelColor: (opacity = 1) => theme.textSecondary,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    const pieData = stats?.categories.map(cat => ({
        name: cat.name,
        amount: cat.amount,
        color: cat.color,
        legendFontColor: theme.textSecondary,
        legendFontSize: 12
    })) || [];

    const barData = {
        labels: stats?.monthly_activity.map(m => m.month) || [],
        datasets: [
            {
                data: stats?.monthly_activity.map(m => m.amount) || []
            }
        ]
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <Stack.Screen options={{ title: 'Estadísticas', headerShown: false }} />
            
            <View style={{ height: 80, borderBottomColor: theme.border }} className="px-6 flex-row items-center justify-between border-b">
                <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
                    <MaterialIcons name="arrow-back" size={20} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary }} className="font-bold">Volver</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16 * fontScale, color: theme.text }} className="font-black uppercase tracking-widest">Análisis</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
                <Text style={{ fontSize: 10 * fontScale, color: theme.textSecondary }} className="font-black uppercase tracking-[3px] mb-6">Gastos por Categoría</Text>
                
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="p-4 rounded-[32px] border items-center mb-10">
                    <PieChart
                        data={pieData}
                        width={SCREEN_WIDTH - 80}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"amount"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        center={[10, 0]}
                        absolute
                    />
                </View>

                <Text style={{ fontSize: 10 * fontScale, color: theme.textSecondary }} className="font-black uppercase tracking-[3px] mb-6">Actividad Mensual</Text>
                
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="p-4 rounded-[32px] border items-center mb-10">
                    <BarChart
                        data={barData}
                        width={SCREEN_WIDTH - 80}
                        height={220}
                        yAxisLabel="$"
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        fromZero
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                </View>

                <View style={{ backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }} className="p-8 rounded-[40px] border">
                    <View className="flex-row items-center gap-4 mb-4">
                        <View style={{ backgroundColor: theme.primary }} className="w-12 h-12 rounded-2xl items-center justify-center">
                            <MaterialIcons name="insights" size={24} color="white" />
                        </View>
                        <View>
                            <Text style={{ color: theme.text }} className="text-lg font-black">Resumen Total</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-xs font-bold">Gastos acumulados</Text>
                        </View>
                    </View>
                    <Text style={{ color: theme.text, fontSize: 32 * fontScale }} className="font-black">
                        ${stats?.total_spent.toFixed(2)}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
