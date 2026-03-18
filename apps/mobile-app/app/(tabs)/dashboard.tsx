import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, Dimensions, Image, Animated, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82;
const CARD_SPACING = (width - CARD_WIDTH) / 2;

// --- Mock Data ---
const STATS = [
    { id: '1', label: 'Saldo Total', amount: 600.00, color: ['#0D47A1', '#1976D2'], icon: 'account-balance-wallet', trend: '+12%' },
    { id: '2', label: 'Me Deben', amount: 480.00, color: ['#00796B', '#009688'], icon: 'call-made', trend: '3 personas' },
    { id: '3', label: 'Debes', amount: 320.00, color: ['#C62828', '#E53935'], icon: 'call-received', trend: '2 deudas' },
    { id: '4', label: 'Gastos del mes', amount: 1240.00, color: ['#4527A0', '#5E35B1'], icon: 'shopping-cart', trend: '-5% vs anterior' },
    { id: '5', label: 'Cobros del mes', amount: 890.00, color: ['#2E7D32', '#43A047'], icon: 'payments', trend: 'Meta: $1000' },
];

const QUICK_ACTIONS = [
    { id: 'new', label: 'Nuevo Gasto', icon: 'add-circle-outline', route: '/add-expense', color: '#2196F3' },
    { id: 'settle', label: 'Liquidar', icon: 'handshake', route: '/settle-up', color: '#a855f7' },
    { id: 'group', label: 'Crear Grupo', icon: 'group-add', route: '/create-group', color: '#10b981' },
];

const PENDINGS = [
    { id: 'p1', title: 'Pago Cena', amount: '$120.00', date: 'Vence hoy', type: 'debes' },
    { id: 'p2', title: 'Cobro Viaje', amount: '$360.00', date: 'Pendiente confirmar', type: 'cobrar' },
];

const RECENT_ACTIVITY = [
    { id: '1', title: 'Hamburgesas El Jefe', category: 'Comida', group: 'Amigos Tech', date: 'Hoy, 2:30 PM', amount: -320.0, status: 'Pendiente', icon: 'restaurant' },
    { id: '2', title: 'Pago Netflix', category: 'Suscripción', group: 'Roomies', date: 'Ayer', amount: +150.0, status: 'Completado', icon: 'subscriptions' },
    { id: '3', title: 'Uber - Fiesta', category: 'Transporte', group: 'Personal', date: '15 Oct', amount: -85.50, status: 'Completado', icon: 'directions-car' },
];

export default function DashboardScreen() {
    const [qrSheetVisible, setQrSheetVisible] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;

    const renderHeader = () => (
        <View className="px-6 py-4 flex-row justify-between items-center bg-[#0d1425]">
            <TouchableOpacity 
                onPress={() => router.push('/settings')}
                className="flex-row items-center gap-3"
                activeOpacity={0.7}
            >
                <View className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 items-center justify-center overflow-hidden">
                    <Image 
                        source={{ uri: 'https://lh3.googleusercontent.com/a/ACg8ocL_FmR_pB6M86B8xH9H_R_W_K_K_K_K_K_K_K_K_K_K=s288-c-no' }} 
                        className="w-full h-full"
                    />
                </View>
                <View>
                    <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">¡Hola de nuevo!</Text>
                    <Text className="text-white text-lg font-black tracking-tight">Luis Gonzalez</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => router.push('/(tabs)/notifications')}
                className="w-11 h-11 bg-white/5 rounded-2xl items-center justify-center border border-white/10"
                activeOpacity={0.7}
            >
                <MaterialIcons name="notifications-none" size={24} color="#CBD5E1" />
                <View className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0d1425]" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {renderHeader()}

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* 1. Resumen Financiero (Swiper Cards) */}
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
                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.6, 1, 0.6],
                                extrapolate: 'clamp'
                            });

                            return (
                                <Animated.View 
                                    key={item.id} 
                                    style={{ width: CARD_WIDTH, transform: [{ scale }], opacity }} 
                                    className="mr-3.5"
                                >
                                    <TouchableOpacity 
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            if (item.id === '2' || item.id === '3') {
                                                router.push('/(tabs)/friends');
                                            }
                                        }}
                                    >
                                        <LinearGradient
                                            colors={item.color as any}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            className="h-44 rounded-[40px] p-7 justify-between shadow-xl shadow-black/30 overflow-hidden"
                                        >
                                            <View className="flex-row items-center justify-between">
                                                <View className="flex-row items-center gap-2.5">
                                                    <View className="w-9 h-9 bg-white/20 rounded-xl items-center justify-center">
                                                        <MaterialIcons name={item.icon as any} size={20} color="white" />
                                                    </View>
                                                    <Text className="text-white/80 font-bold text-[10px] uppercase tracking-wider">{item.label}</Text>
                                                </View>
                                                <TouchableOpacity className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                                                    <Ionicons name="eye-outline" size={16} color="white" />
                                                </TouchableOpacity>
                                            </View>

                                            <View>
                                                <Text className="text-white text-4xl font-black">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                                                <View className="flex-row items-center gap-2 mt-2">
                                                    <View className="px-2 py-0.5 bg-white/20 rounded-full">
                                                        <Text className="text-white text-[10px] font-bold">{item.trend}</Text>
                                                    </View>
                                                    <Text className="text-white/50 text-[10px]">desde fecha corte</Text>
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        })}
                    </Animated.ScrollView>
                </View>

                {/* 2. Acciones Rápidas */}
                <View className="px-6 mt-10">
                    <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-5">Operaciones Rápidas</Text>
                    <View className="flex-row justify-between">
                        {QUICK_ACTIONS.map(action => (
                            <TouchableOpacity 
                                key={action.id}
                                onPress={() => router.push(action.route as any)}
                                activeOpacity={0.7}
                                className="items-center"
                            >
                                <View 
                                    className="w-16 h-16 rounded-3xl items-center justify-center mb-2.5 shadow-lg shadow-blue-500/10 border border-white/5"
                                    style={{ backgroundColor: `${action.color}15` }}
                                >
                                    <View className="items-center justify-center">
                                        {action.id === 'settle' ? (
                                             <FontAwesome5 name="handshake" size={24} color={action.color} />
                                        ) : (
                                             <MaterialIcons name={action.icon as any} size={28} color={action.color} />
                                        )}
                                    </View>
                                </View>
                                <Text className="text-slate-300 text-[10px] font-bold tracking-tight">{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 3. Pendientes Urgentes */}
                <View className="px-6 mt-10">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Pendientes Urgentes</Text>
                        <View className="bg-rose-500/20 px-2.5 py-1 rounded-full border border-rose-500/30">
                            <Text className="text-rose-400 text-[9px] font-black uppercase">Faltan 2 pagos</Text>
                        </View>
                    </View>
                    <View className="gap-3">
                        {PENDINGS.map(item => (
                            <TouchableOpacity 
                                key={item.id}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center"
                                activeOpacity={0.8}
                                onPress={() => router.push('/settle-up' as any)}
                            >
                                <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${item.type === 'debes' ? 'bg-rose-500/15' : 'bg-emerald-500/15'}`}>
                                    <MaterialIcons 
                                        name={item.type === 'debes' ? 'priority-high' : 'check-circle-outline'} 
                                        size={20} 
                                        color={item.type === 'debes' ? '#f43f5e' : '#10b981'} 
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-sm">{item.title}</Text>
                                    <Text className="text-slate-500 text-[10px]">{item.date}</Text>
                                </View>
                                <Text className={`font-black text-sm ${item.type === 'debes' ? 'text-rose-400' : 'text-emerald-400'}`}>{item.amount}</Text>
                                <MaterialIcons name="chevron-right" size={20} color="#334155" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 4. Tus Grupos */}
                <View className="px-6 mt-10">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Tus Grupos</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/dashboard')}>
                            <Text className="text-blue-500 text-[11px] font-bold">Ver todos</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12 }}
                    >
                        {[
                            { id: 'g1', name: 'Viaje Playa', count: 5, bg: '#3b82f6' },
                            { id: 'g2', name: 'Mesa #4', count: 3, bg: '#a855f7' },
                            { id: 'g3', name: 'Amigos Tech', count: 8, bg: '#10b981' },
                        ].map(group => (
                            <TouchableOpacity 
                                key={group.id}
                                activeOpacity={0.8}
                                onPress={() => router.push({ pathname: '/(tabs)/group/[id]', params: { id: group.id } } as any)}
                                className="w-32 h-32 bg-white/5 border border-white/10 rounded-3xl p-4 justify-between"
                            >
                                <View style={{ backgroundColor: `${group.bg}20` }} className="w-8 h-8 rounded-lg items-center justify-center">
                                    <MaterialIcons name="groups" size={18} color={group.bg} />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-xs" numberOfLines={1}>{group.name}</Text>
                                    <Text className="text-slate-500 text-[9px] font-bold">{group.count} miembros</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity 
                            onPress={() => router.push('/create-group')}
                            className="w-32 h-32 bg-white/5 border border-dashed border-white/20 rounded-3xl p-4 items-center justify-center"
                        >
                            <Ionicons name="add" size={32} color="#475569" />
                            <Text className="text-slate-500 text-[9px] font-bold mt-2">Crear Nuevo</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* 5. Actividad Reciente */}
                <View className="px-6 mt-10">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Actividad Reciente</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/payments')}>
                            <Text className="text-blue-500 text-[11px] font-bold">Ver historial</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="gap-3">
                        {RECENT_ACTIVITY.map(item => (
                            <TouchableOpacity 
                                key={item.id}
                                activeOpacity={0.8}
                                onPress={() => router.push({ pathname: '/(tabs)/group/[id]', params: { id: 'g2' } } as any)}
                                className="bg-white/5 border border-white/10 rounded-[28px] p-5 flex-row items-center gap-4"
                            >
                                <View className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/5">
                                    <MaterialIcons name={item.icon as any} size={24} color="#94a3b8" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base tracking-tight">{item.title}</Text>
                                    <Text className="text-slate-500 text-[10px] font-medium">{item.group} • {item.date}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className={`font-black text-sm ${item.amount > 0 ? 'text-emerald-500' : 'text-slate-100'}`}>
                                        {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
                                    </Text>
                                    <View className={`px-1.5 py-0.5 rounded mt-1 ${item.status === 'Pendiente' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                                        <Text className={`text-[8px] font-black uppercase ${item.status === 'Pendiente' ? 'text-amber-500' : 'text-blue-400'}`}>{item.status}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* 6. QR FAB Button */}
            <TouchableOpacity 
                onPress={() => setQrSheetVisible(true)}
                activeOpacity={0.9}
                className="absolute bottom-28 right-6 w-16 h-16 rounded-full bg-blue-600 items-center justify-center shadow-2xl shadow-blue-500/50 border-4 border-[#0d1425] z-50"
            >
                <MaterialIcons name="qr-code-scanner" size={30} color="white" />
            </TouchableOpacity>

            {/* QR Modal Option Selector */}
            {qrSheetVisible && (
                <View style={StyleSheet.absoluteFill} className="bg-black/60 justify-end z-[100]">
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => setQrSheetVisible(false)} />
                    <View className="bg-[#1e293b] rounded-t-[40px] p-8 pb-12 border-t border-white/10">
                        <View className="w-12 h-1.5 bg-slate-700 rounded-full self-center mb-8" />
                        <Text className="text-white text-2xl font-black mb-1">Pagos con QR</Text>
                        <Text className="text-slate-400 text-sm mb-8">Elige cómo quieres usar el código</Text>
                        
                        <View className="gap-4">
                            <TouchableOpacity 
                                onPress={() => { setQrSheetVisible(false); router.push('/ocr-scanner'); }}
                                className="flex-row items-center bg-blue-600 p-5 rounded-2xl gap-4"
                            >
                                <MaterialIcons name="center-focus-weak" size={24} color="white" />
                                <View>
                                    <Text className="text-white font-bold text-lg">Escanear código</Text>
                                    <Text className="text-blue-100 text-xs">Unirme a grupo o pagar cuenta</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={() => { setQrSheetVisible(false); router.push('/(tabs)/payments'); }}
                                className="flex-row items-center bg-white/5 border border-white/10 p-5 rounded-2xl gap-4"
                            >
                                <MaterialIcons name="qr-code" size={24} color="white" />
                                <View>
                                    <Text className="text-white font-bold text-lg">Mi código QR</Text>
                                    <Text className="text-slate-400 text-xs">Para recibir pagos o invitar amigos</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    }
});
