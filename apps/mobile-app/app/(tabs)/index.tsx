import React, { useState, useRef, useCallback, useEffect } from 'react';
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
    RefreshControl,
    ActivityIndicator,
    Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
// // import { MotiView, MotiText, AnimatePresence } from 'moti';
const AnimatePresence = ({ children }: any) => children;
const MotiView = ({ children, from, animate, transition, style, ...props }: any) => (
  <View style={style} {...props}>{children}</View>
);
const MotiText = ({ children, from, animate, transition, style, ...props }: any) => (
  <Text style={style} {...props}>{children}</Text>
);
import { useAuth } from '../../context/AuthContext';
import { groupRepository } from '../../src/infrastructure/api/repositories/GroupRepository';
import { SHARED_USER } from '../../src/infrastructure/constants/MockUser';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82;
const CARD_SPACING = (width - CARD_WIDTH) / 2;

// --- Dashboard Component ---
export default function DashboardScreen() {
    const { theme, fontScale, cycleTheme } = useTheme();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [refreshing, setRefreshing] = useState(false);
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Fetch real data from repository
    const [userGroups, setUserGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGroups = useCallback(async () => {
        if (!user?.id) {
            console.log('⚠️ Dashboard: No user ID yet, skipping fetch');
            return;
        }
        setIsLoading(true);
        console.log(`📡 Dashboard: Fetching groups for user ${user.id}...`);
        try {
            const groups = await groupRepository.findByUser(user.id);
            console.log(`✅ Dashboard: Found ${groups?.length || 0} groups`);
            setUserGroups(Array.isArray(groups) ? groups : []);
        } catch (err) {
            console.error('❌ Dashboard: Error fetching groups:', err);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    // Calculate dynamic stats based on real groups
    const totalSpent = userGroups.reduce((acc, g) => acc + (g.total_gastado || 0), 0);
    const STATS = [
        { id: '1', label: 'Consumo Total', amount: totalSpent, color: [theme.primary, `${theme.primary}80`, `${theme.primary}40`], icon: 'account-balance-wallet', trend: `${userGroups.length} grupos` },
        { id: '2', label: 'Actividad', amount: userGroups.filter(g => !g.is_settled).length, color: ['#06b6d4', '#3b82f6'], icon: 'call-made', trend: 'En curso' },
        { id: '3', label: 'Liquidado', amount: userGroups.filter(g => g.is_settled).length, color: ['#f43f5e', '#fb7185'], icon: 'call-received', trend: 'Finalizado' },
    ];

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchGroups();
    }, [fetchGroups]);

    const handleCreateGrupo = async () => {
        router.push('/create-group');
    };

    const QUICK_ACTIONS = [
        { id: 'group', label: 'Nuevo Grupo', icon: 'group-add', action: handleCreateGrupo, color: theme.primary },
        { id: 'join', label: 'Unirse a Grupo', icon: 'qr-code-scanner', route: '/(tabs)/qr', color: '#10b981' },
        { id: 'settle', label: 'Liquidar', icon: 'handshake', route: '/settle-up', color: '#a855f7' },
    ];


    const renderHeader = () => (
        <View style={{ backgroundColor: theme.bg }} className="px-6 py-8 flex-row justify-between items-center w-full">
            <View className="flex-1 flex-row items-center gap-3 pr-2">
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={cycleTheme}
                    style={{ backgroundColor: theme.primary }} 
                    className="w-10 h-10 rounded-xl items-center justify-center shadow-lg shadow-pink-500/20 overflow-hidden"
                >
                    <Image source={require('../../assets/images/logo-ep.png')} className="w-full h-full" resizeMode="contain" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text 
                        numberOfLines={1} 
                        style={{ fontSize: 20 * fontScale, color: theme.text }} 
                        className="font-black tracking-tighter"
                    >
                        Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}
                    </Text>
                    <Text style={{ fontSize: 9 * fontScale, color: theme.primary }} className="font-black uppercase tracking-[3px]">Easy-Pay Dashboard</Text>
                </View>
            </View>

            <View className="flex-row gap-3 items-center">
                <TouchableOpacity 
                    onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                    activeOpacity={0.7}
                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                    className="w-11 h-11 rounded-xl items-center justify-center border"
                >
                    <MaterialIcons name={isBalanceVisible ? "visibility" : "visibility-off"} size={20} color={theme.primary} />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => router.push('/settings')}
                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                    className="w-11 h-11 rounded-full items-center justify-center border overflow-hidden"
                >
                    {user?.nombre ? (
                        <View style={{ backgroundColor: theme.primary }} className="w-full h-full items-center justify-center">
                            <Text className="text-white font-black text-xs">{user.nombre.charAt(0).toUpperCase()}</Text>
                        </View>
                    ) : (
                        <MaterialIcons name="person" size={20} color={theme.textSecondary} />
                    )}
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
                contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
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
                                        style={styles.cardGradient}
                                        className="h-44 rounded-[50px] p-7 justify-between relative overflow-hidden"
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



                {/* 3. Acciones Rápidas */}
                <View className="px-6 mt-10">
                    <Text style={{ fontSize: 10 * fontScale, color: theme.textSecondary }} className="font-black uppercase tracking-[3px] mb-6">Operaciones Rápidas</Text>
                    <View className="flex-row justify-between">
                        {QUICK_ACTIONS.map(action => (
                            <TouchableOpacity 
                                key={action.id}
                                onPress={() => action.action ? action.action() : router.push(action.route as any)}
                                style={{ alignItems: 'center' }}
                                activeOpacity={0.7}
                            >
                                <View 
                                    style={{ backgroundColor: theme.glassBg, borderColor: theme.border, ...styles.actionShadow }}
                                    className="w-16 h-16 rounded-[24px] items-center justify-center mb-3 border border-white/5"
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
                        {isLoading ? (
                            <ActivityIndicator size="large" color={theme.primary} />
                        ) : userGroups.length > 0 ? (
                            userGroups.map(item => (
                                <Pressable 
                                    key={item.id}
                                    onPress={() => router.push({ pathname: '/(tabs)/group/[id]', params: { id: item.id } } as any)}
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
                                                <MaterialIcons name="restaurant" size={26} color={theme.primary} />
                                            </View>
                                            <View className="flex-1">
                                                <Text style={{ fontSize: 15 * fontScale, color: theme.text }} className="font-black tracking-tight">{item.nombre || 'Sin nombre'}</Text>
                                                <View className="flex-row items-center gap-2 mt-1">
                                                    <Text style={{ fontSize: 9 * fontScale, color: theme.primary }} className="font-black uppercase tracking-widest">{item.codigo_invitacion}</Text>
                                                    <Text style={{ fontSize: 10 * fontScale }} className="text-slate-500 font-medium">• {new Date(item.fecha_creacion).toLocaleDateString()}</Text>
                                                </View>
                                            </View>
                                            <View className="items-end">
                                                <Text style={{ 
                                                    fontSize: 15 * fontScale, 
                                                    color: theme.text 
                                                }} className="font-black">
                                                    {isBalanceVisible ? `$${(item.total_gastado || 0).toFixed(2)}` : `$ ***.**`}
                                                </Text>
                                                <View style={{ backgroundColor: item.is_settled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)' }} className="px-2 py-0.5 rounded-lg mt-1.5 border border-white/5">
                                                    <Text style={{ fontSize: 8 * fontScale, color: item.is_settled ? '#10b981' : '#f59e0b' }} className="font-black uppercase">{item.is_settled ? 'Saldado' : 'Activo'}</Text>
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
                                <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="text-center px-10 font-bold">Crea tu primer grupo para empezar a dividir gastos.</Text>
                            </MotiView>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cardGradient: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    actionShadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    }
});
