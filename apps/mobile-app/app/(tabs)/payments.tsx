import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, Pressable, Image, Dimensions, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_SPACING = (width - CARD_WIDTH) / 2;

const METHODS = [
    { id: '1', type: 'VISA', last4: '4242', holder: 'LUIS GONZALEZ', expiry: '08/28', default: true, colors: ['#4f46e5', '#9333ea', '#db2777'] },
    { id: '2', type: 'MASTERCARD', last4: '8888', holder: 'LUIS GONZALEZ', expiry: '12/26', default: false, colors: ['#1e293b', '#334155'] },
];

const QUICK_CONNECTS = [
    { id: 'apple', label: 'Apple Pay', icon: 'apple', color: '#000000', connected: true },
    { id: 'google', label: 'G Pay', icon: 'google', color: '#ffffff', connected: false },
    { id: 'paypal', label: 'PayPal', icon: 'paypal', color: '#003087', connected: true },
];

const HISTORY = [
    { id: 'h1', title: 'Pago a Ana', category: 'Comida Grupal', date: 'Hoy, 12:30 PM', amount: '-$320.00', status: 'Completado', method: 'Visa ****4242', type: 'user' },
    { id: 'h2', title: 'Amazon MX', category: 'Electrónicos', date: 'Ayer, 4:15 PM', amount: '-$1,250.00', status: 'Completado', method: 'Visa ****4242', type: 'shop' },
    { id: 'h3', title: 'Netflix', category: 'Suscripción', date: '14 Oct, 9:00 AM', amount: '-$199.00', status: 'Fallido', method: 'Mastercard ****8888', type: 'service' },
];

export default function PaymentsScreen() {
    const scrollX = useRef(new Animated.Value(0)).current;

    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* Header */}
                <View className="px-6 py-6 flex-row justify-between items-center">
                    <View>
                        <Text className="text-white text-3xl font-black tracking-tight">Cartera</Text>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Administra tus pagos</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => router.push('/wallet/security')}
                        className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl flex-row items-center gap-2"
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="security" size={14} color="#10b981" />
                        <Text className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Pagos Seguros</Text>
                    </TouchableOpacity>
                </View>

                {/* Credit Cards Carousel */}
                <View className="mb-10">
                    <View className="px-6 flex-row justify-between items-end mb-6">
                        <Text className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Mis Tarjetas</Text>
                        <TouchableOpacity onPress={() => router.push('/wallet/methods')}>
                            <Text className="text-slate-600 text-[10px] font-bold">Ver todos</Text>
                        </TouchableOpacity>
                    </View>

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
                        {METHODS.map((item, index) => {
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
                                outputRange: [0.7, 1, 0.7],
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
                                        onPress={() => router.push({ pathname: '/wallet/methods/[id]', params: { id: item.id } } as any)}
                                    >
                                        <LinearGradient
                                            colors={item.colors as any}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            className="h-52 rounded-[40px] p-8 shadow-2xl shadow-black/40 overflow-hidden relative"
                                        >
                                            <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                                            <View className="flex-row justify-between items-start mb-10">
                                                <Image 
                                                    source={{ uri: 'https://img.icons8.com/color/96/chip.png' }}
                                                    className="w-12 h-10 opacity-80"
                                                />
                                                <Text className="text-white font-black italic text-2xl tracking-tighter">{item.type}</Text>
                                            </View>
                                            <Text className="text-white font-mono text-2xl tracking-[4px] mb-8">**** **** **** {item.last4}</Text>
                                            <View className="flex-row justify-between items-end">
                                                <View>
                                                    <Text className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-1">Titular</Text>
                                                    <Text className="text-white font-black text-xs uppercase">{item.holder}</Text>
                                                </View>
                                                {item.default && (
                                                    <View className="bg-white/20 px-3 py-1 rounded-full border border-white/20">
                                                        <Text className="text-white text-[8px] font-black uppercase">Predeterminada</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        })}
                    </Animated.ScrollView>
                </View>

                {/* Add New Method */}
                <View className="px-6 mb-12">
                    <TouchableOpacity 
                        onPress={() => router.push('/wallet/methods/new')}
                        className="w-full border border-dashed border-blue-500/40 bg-blue-500/5 rounded-3xl py-6 items-center justify-center flex-row gap-3 active:bg-blue-500/10"
                    >
                        <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                            <MaterialIcons name="add" size={20} color="white" />
                        </View>
                        <Text className="text-blue-500 font-black text-xs uppercase tracking-widest">AGREGAR NUEVO MÉTODO</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Wallet Connections */}
                <View className="px-6 mb-12">
                    <Text className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-6">Conexiones Rápidas</Text>
                    <View className="flex-row gap-4">
                        {QUICK_CONNECTS.map(conn => (
                            <TouchableOpacity 
                                key={conn.id}
                                onPress={() => router.push(`/wallet/connect/${conn.id}` as any)}
                                activeOpacity={0.8}
                                className="flex-1 h-16 rounded-2xl items-center justify-center relative border border-white/5"
                                style={{ backgroundColor: conn.color === '#ffffff' ? 'rgba(255,255,255,0.05)' : conn.color }}
                            >
                                <FontAwesome5 name={conn.icon} size={20} color={conn.color === '#ffffff' ? 'white' : 'white'} />
                                <View className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-[#0d1425] items-center justify-center ${conn.connected ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                                    <MaterialIcons name={conn.connected ? 'check' : 'add'} size={10} color="white" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Transaction History */}
                <View className="px-6 mb-10">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Historial Operativo</Text>
                        <TouchableOpacity onPress={() => router.push('/wallet/history')}>
                            <Text className="text-blue-500 text-[11px] font-bold">Ver historial completo</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
                        {HISTORY.map((tx, i) => (
                            <TouchableOpacity 
                                key={tx.id} 
                                activeOpacity={0.8}
                                onPress={() => router.push({ pathname: '/wallet/history/[id]', params: { id: tx.id } } as any)}
                                className={`p-6 flex-row items-center justify-between ${i !== 0 ? 'border-t border-white/5' : ''}`}
                            >
                                <View className="flex-row items-center gap-4 flex-1">
                                    <View className={`w-12 h-12 rounded-2xl items-center justify-center ${
                                        tx.type === 'user' ? 'bg-orange-500/10' : tx.type === 'shop' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                                    }`}>
                                        <MaterialIcons 
                                            name={tx.type === 'user' ? 'person' : tx.type === 'shop' ? 'shopping-bag' : 'movie'} 
                                            size={22} 
                                            color={tx.type === 'user' ? '#f97316' : tx.type === 'shop' ? '#3b82f6' : '#a855f7'} 
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-sm" numberOfLines={1}>{tx.title}</Text>
                                        <Text className="text-slate-500 text-[9px] font-bold mt-0.5">{tx.method}</Text>
                                    </View>
                                </View>
                                <View className="items-end ml-4">
                                    <Text className={`font-black text-sm mb-1 ${tx.status === 'Fallido' ? 'text-slate-500' : 'text-slate-100'}`}>{tx.amount}</Text>
                                    <View className={`px-2 py-0.5 rounded-md ${tx.status === 'Fallido' ? 'bg-rose-500/15' : 'bg-emerald-500/15'}`}>
                                        <Text className={`text-[8px] font-black uppercase ${tx.status === 'Fallido' ? 'text-rose-500' : 'text-emerald-500'}`}>{tx.status}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
