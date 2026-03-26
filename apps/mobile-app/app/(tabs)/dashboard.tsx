import React, { useState, useRef, useCallback } from 'react';
import { 
    ScrollView, 
    View, 
    Text, 
    Pressable, 
    Dimensions, 
    Image, 
    Animated, 
    TouchableOpacity, 
    StyleSheet,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { MotiView, MotiText } from 'moti';
import { useAuth } from '../../context/AuthContext';

import { SHARED_USER } from '../../src/infrastructure/constants/MockUser';
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82;
const CARD_SPACING = (width - CARD_WIDTH) / 2;

// --- Dashboard Component ---
export default function DashboardScreen() {
    const { theme, fontScale, cycleTheme } = useTheme();
    const { user } = useAuth();
    
    // Define STATS dynamically to reflect the theme
    const STATS = [
        { id: '1', label: 'Saldo Total', amount: 8450.00, color: [theme.primary, `${theme.primary}80`, `${theme.primary}40`], icon: 'account-balance-wallet', trend: '+12%' },
        { id: '2', label: 'Me Deben', amount: 480.00, color: ['#06b6d4', '#3b82f6'], icon: 'call-made', trend: '3 personas' },
        { id: '3', label: 'Debes', amount: 320.00, color: ['#f43f5e', '#fb7185'], icon: 'call-received', trend: '2 deudas' },
    ];
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const scrollX = useRef(new Animated.Value(0)).current;

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const QUICK_ACTIONS = [
        { id: 'group', label: 'Nuevo Grupo', icon: 'group-add', route: '/create-group', color: theme.primary },
        { id: 'settle', label: 'Liquidar', icon: 'handshake', route: '/settle-up', color: '#a855f7' },
        { id: 'join', label: 'Unirse', icon: 'qr-code-scanner', route: '/(tabs)/qr', color: '#10b981' },
    ];

    const renderHeader = () => (
        <View style={{ backgroundColor: theme.bg }} className="px-6 py-8 flex-row justify-between items-center">
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={cycleTheme}
                className="flex-row items-center gap-3"
            >
                <View style={{ backgroundColor: theme.primary }} className="w-10 h-10 rounded-xl items-center justify-center shadow-lg shadow-pink-500/20 overflow-hidden">
                    <Image source={require('../../assets/images/logo-ep.png')} className="w-full h-full" resizeMode="contain" />
                </View>
                <View>
                    <Text style={{ fontSize: 20 * fontScale, color: theme.text }} className="font-black tracking-tighter">
                        Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}
                    </Text>
                    <Text style={{ fontSize: 9 * fontScale, color: theme.primary }} className="font-black uppercase tracking-[3px]">Easy-Pay Dashboard</Text>
                </View>
            </TouchableOpacity>
            <View className="flex-row gap-3">
                <TouchableOpacity 
                    onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                    style={{ backgroundColor: theme.glassBg, borderColor: theme.border }}
                    className="w-12 h-12 rounded-[18px] items-center justify-center border"
                >
                    <MaterialIcons name={isBalanceVisible ? "visibility" : "visibility-off"} size={22} color={theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => router.push('/settings')}
                    style={{ backgroundColor: theme.glassBg, borderColor: theme.border }}
                    className="w-12 h-12 rounded-[18px] items-center justify-center border overflow-hidden"
                >
                    <Image source={{ uri: SHARED_USER.avatar }} className="w-full h-full" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            {renderHeader()}

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor={theme.primary}
                        colors={[theme.primary]}
                    />
                }
            >
                {/* 1. Resumen Financiero */}
                <View className="mt-4">
                    <Animated.ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH + 14}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: CARD_SPACING }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                    >
                        {STATS.map((item, index) => {
                            const inputRange = [
                                (index - 1) * (CARD_WIDTH + 14),
                                index * (CARD_WIDTH + 14),
                                (index + 1) * (CARD_WIDTH + 14)
                            ];
                            const scale = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.95, 1, 0.95],
                                extrapolate: 'clamp'
                            });

                            return (
                                <Animated.View key={item.id} style={{ width: CARD_WIDTH, transform: [{ scale }] }} className="mr-3.5">
                                    <LinearGradient
                                        colors={item.color as any}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        className="h-44 rounded-[50px] p-7 justify-between shadow-2xl shadow-black/40 relative overflow-hidden"
                                    >
                                        <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-row items-center gap-2.5">
                                                <View className="w-9 h-9 bg-white/20 rounded-xl items-center justify-center">
                                                    <MaterialIcons name={item.icon as any} size={20} color="white" />
                                                </View>
                                                <Text style={{ fontSize: 10 * fontScale }} className="text-white/80 font-black uppercase tracking-wider">{item.label}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <MotiText 
                                                animate={{ opacity: 1 }} 
                                                style={{ fontSize: 40 * fontScale }} 
                                                className="text-white font-black"
                                            >
                                                {isBalanceVisible ? `$${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `$ ***.**`}
                                            </MotiText>
                                            <View style={{ backgroundColor: theme.glassBg }} className="px-2 py-0.5 rounded-full self-start mt-2">
                                                <Text style={{ fontSize: 10 * fontScale }} className="text-white font-bold">{item.trend}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </Animated.View>
                            );
                        })}
                    </Animated.ScrollView>
                </View>

                {/* 2. Acciones Rápidas */}
                <View className="px-6 mt-10">
                    <Text style={{ fontSize: 10 * fontScale, color: theme.textSecondary }} className="font-black uppercase tracking-[3px] mb-6">Operaciones Rápidas</Text>
                    <View className="flex-row justify-between">
                        {QUICK_ACTIONS.map(action => (
                            <TouchableOpacity 
                                key={action.id}
                                onPress={() => router.push(action.route as any)}
                                style={{ alignItems: 'center' }}
                                activeOpacity={0.7}
                            >
                                <View 
                                    style={{ backgroundColor: theme.glassBg, borderColor: theme.border }}
                                    className="w-16 h-16 rounded-[24px] items-center justify-center mb-3 border border-white/5 shadow-sm"
                                >
                                    {action.id === 'settle' ? (
                                        <FontAwesome5 name="handshake" size={24} color={action.color} />
                                    ) : (
                                        <MaterialIcons name={action.icon as any} size={28} color={action.color} />
                                    )}
                                </View>
                                <Text style={{ fontSize: 10 * fontScale, color: theme.text }} className="font-bold tracking-tight">{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {/* 3. Actividad Reciente */}
                <View className="px-6 mt-12 pb-20">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text style={{ fontSize: 10 * fontScale, color: theme.textSecondary }} className="font-black uppercase tracking-[3px]">Actividad Reciente</Text>
                        <Pressable 
                            onPress={() => router.push('/(tabs)/payments')}
                        >
                            {({ pressed }) => (
                                <MotiView 
                                    animate={{ 
                                        scale: pressed ? 0.95 : 1,
                                        opacity: pressed ? 0.6 : 1
                                    }}
                                    transition={{ type: 'spring', damping: 10 }}
                                >
                                    <Text style={{ fontSize: 11 * fontScale, color: theme.primary }} className="font-black">VER TODO</Text>
                                </MotiView>
                            )}
                        </Pressable>
                    </View>

                    <View className="gap-4">
                        {[
                            { id: '1', title: 'Cena Amigos', group: 'Mesa #4', date: 'Hoy, 2:30 PM', amount: 320.0, type: 'owe', status: 'Pendiente', icon: 'restaurant' },
                            { id: '2', title: 'Uber Fiesta', group: 'Personal', date: 'Ayer', amount: 15.50, type: 'receive', status: 'Completado', icon: 'directions-car' },
                            { id: '3', title: 'Súper Semanal', group: 'Roomies', date: 'Hace 2 días', amount: 1200.0, type: 'total', status: 'Completado', icon: 'shopping-basket' },
                        ].length > 0 ? (
                            [
                                { id: '1', title: 'Cena Amigos', group: 'Mesa #4', date: 'Hoy, 2:30 PM', amount: 320.0, type: 'owe', status: 'Pendiente', icon: 'restaurant' },
                                { id: '2', title: 'Uber Fiesta', group: 'Personal', date: 'Ayer', amount: 15.50, type: 'receive', status: 'Completado', icon: 'directions-car' },
                                { id: '3', title: 'Súper Semanal', group: 'Roomies', date: 'Hace 2 días', amount: 1200.0, type: 'total', status: 'Completado', icon: 'shopping-basket' },
                            ].map(item => (
                                <Pressable 
                                    key={item.id}
                                    onPress={() => {
                                        if (item.status === 'Pendiente') {
                                            router.push('/new-mesa');
                                        } else {
                                            router.push({ pathname: '/expense/receipt/[id]', params: { id: item.id } } as any);
                                        }
                                    }}
                                >
                                    {({ pressed }: { pressed: boolean }) => (
                                        <MotiView 
                                            animate={{ 
                                                scale: pressed ? 0.98 : 1,
                                                backgroundColor: pressed ? `${theme.cardSecondary}ef` : theme.cardSecondary 
                                            }}
                                            transition={{ type: 'timing', duration: 100 }}
                                            style={{ borderColor: theme.border }}
                                            className="border rounded-[32px] p-5 flex-row items-center gap-4"
                                        >
                                            <View style={{ backgroundColor: theme.glassBg }} className="w-14 h-14 rounded-[20px] items-center justify-center">
                                                <MaterialIcons name={item.icon as any} size={26} color={theme.primary} />
                                            </View>
                                            <View className="flex-1">
                                                <Text style={{ fontSize: 15 * fontScale, color: theme.text }} className="font-black tracking-tight">{item.title}</Text>
                                                <View className="flex-row items-center gap-2 mt-1">
                                                    <Text style={{ fontSize: 9 * fontScale, color: theme.primary }} className="font-black uppercase tracking-widest">{item.group}</Text>
                                                    <Text style={{ fontSize: 10 * fontScale }} className="text-slate-500 font-medium">• {item.date}</Text>
                                                </View>
                                            </View>
                                            <View className="items-end">
                                                <Text style={{ 
                                                    fontSize: 15 * fontScale, 
                                                    color: item.type === 'owe' ? '#f43f5e' : item.type === 'receive' ? '#10b981' : theme.text 
                                                }} className="font-black">
                                                    {isBalanceVisible ? (
                                                        item.type === 'owe' ? `- $${item.amount.toFixed(2)}` :
                                                        item.type === 'receive' ? `+ $${item.amount.toFixed(2)}` :
                                                        `$${item.amount.toFixed(2)}`
                                                    ) : `$ ***.**`}
                                                </Text>
                                                <View style={{ backgroundColor: item.status === 'Pendiente' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)' }} className="px-2 py-0.5 rounded-lg mt-1.5 border border-white/5">
                                                    <Text style={{ fontSize: 8 * fontScale, color: item.status === 'Pendiente' ? '#f59e0b' : '#10b981' }} className="font-black uppercase">{item.status}</Text>
                                                </View>
                                            </View>
                                        </MotiView>
                                    )}
                                </Pressable>
                            ))
                        ) : (
                            <MotiView 
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="items-center justify-center py-10 opacity-60"
                            >
                                <View style={{ backgroundColor: theme.glassBg }} className="w-20 h-20 rounded-full items-center justify-center mb-4 border border-white/5">
                                    <MaterialCommunityIcons name="ghost" size={40} color={theme.textSecondary} />
                                </View>
                                <Text style={{ color: theme.text, fontSize: 14 * fontScale }} className="font-black text-center mb-1">¡Aún no hay actividad!</Text>
                                <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="text-center px-10 font-bold">Crea tu primera mesa para empezar a dividir gastos.</Text>
                            </MotiView>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
