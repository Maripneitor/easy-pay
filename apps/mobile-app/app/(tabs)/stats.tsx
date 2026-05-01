import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getApiBaseUrl } from '../../src/infrastructure/api/network.config';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            if (!user?.id) return;
            try {
                const response = await fetch(`${getApiBaseUrl()}/stats/user/${user.id}`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error loading stats:", error);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [user?.id]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.bg }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    const CategoryIcon = ({ name }: { name: string }) => {
        const icons: any = {
            'Comida': 'restaurant',
            'Transporte': 'directions-car',
            'Entretenimiento': 'sports-esports',
            'Otros': 'more-horiz'
        };
        return <MaterialIcons name={icons[name] || 'receipt'} size={20} color={theme.textSecondary} />;
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.bg }}>
            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="mb-8">
                    <Text style={{ color: theme.text, fontSize: 32 * fontScale }} className="font-black tracking-tight">Mi Análisis</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="font-medium opacity-60">Visualiza tu comportamiento financiero</Text>
                </View>

                {/* Summary Cards */}
                <View className="flex-row gap-4 mb-8">
                    <View style={{ backgroundColor: theme.card }} className="flex-1 p-6 rounded-[2.5rem] border border-white/5">
                        <View style={{ backgroundColor: '#10b98115' }} className="w-10 h-10 rounded-xl items-center justify-center mb-4">
                            <MaterialIcons name="trending-up" size={20} color="#10b981" />
                        </View>
                        <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest opacity-60 mb-1">Te deben</Text>
                        <Text style={{ color: '#10b981', fontSize: 18 * fontScale }} className="font-black">${stats?.owed_to_user?.toFixed(2)}</Text>
                    </View>
                    <View style={{ backgroundColor: theme.card }} className="flex-1 p-6 rounded-[2.5rem] border border-white/5">
                        <View style={{ backgroundColor: '#f43f5e15' }} className="w-10 h-10 rounded-xl items-center justify-center mb-4">
                            <MaterialIcons name="trending-down" size={20} color="#f43f5e" />
                        </View>
                        <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest opacity-60 mb-1">Debes</Text>
                        <Text style={{ color: '#f43f5e', fontSize: 18 * fontScale }} className="font-black">${stats?.user_owes?.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Main Spent Card */}
                <View style={{ backgroundColor: theme.primary }} className="p-8 rounded-[3rem] mb-8 shadow-xl shadow-blue-500/20">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px]">Gasto Total Histórico</Text>
                        <FontAwesome5 name="wallet" size={20} color="white" />
                    </View>
                    <Text className="text-white font-black text-4xl tracking-tighter">${stats?.total_spent?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</Text>
                    <View className="flex-row items-center mt-4">
                        <Ionicons name="arrow-up" size={14} color="#34d399" />
                        <Text className="text-[#34d399] font-black text-[10px] uppercase ml-1">12% este mes</Text>
                    </View>
                </View>

                {/* Categories */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight">Por Categoría</Text>
                        <TouchableOpacity>
                            <Text style={{ color: theme.primary, fontSize: 12 * fontScale }} className="font-black uppercase tracking-widest">Ver todo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ backgroundColor: theme.card }} className="p-6 rounded-[2.5rem] border border-white/5">
                        {stats?.categories?.map((cat: any, index: number) => (
                            <View key={index} className="mb-6 last:mb-0">
                                <View className="flex-row justify-between items-center mb-2">
                                    <View className="flex-row items-center">
                                        <CategoryIcon name={cat.name} />
                                        <Text style={{ color: theme.text }} className="font-bold ml-3 text-sm">{cat.name}</Text>
                                    </View>
                                    <Text style={{ color: theme.textSecondary }} className="font-black text-xs">${cat.amount}</Text>
                                </View>
                                <View className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <View 
                                        className="h-full rounded-full" 
                                        style={{ 
                                            width: `${cat.percentage}%`, 
                                            backgroundColor: index === 0 ? theme.primary : index === 1 ? '#10b981' : index === 2 ? '#f59e0b' : '#6366f1' 
                                        }} 
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Insight */}
                <View style={{ backgroundColor: `${theme.primary}10`, borderColor: `${theme.primary}20` }} className="p-6 rounded-3xl border border-dashed mb-12">
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons name="lightbulb" size={18} color={theme.primary} />
                        <Text style={{ color: theme.primary }} className="font-black text-[10px] uppercase tracking-widest ml-2">Tip de Ahorro</Text>
                    </View>
                    <Text style={{ color: theme.textSecondary }} className="text-xs font-medium leading-relaxed">
                        Has gastado un <Text style={{ color: theme.text }} className="font-bold">15% menos</Text> en la categoría de Comida comparado con el mes pasado. ¡Sigue así!
                    </Text>
                </View>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
