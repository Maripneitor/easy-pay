import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, Pressable, Image, Dimensions, Animated, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons, FontAwesome5, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { MotiView, MotiText, AnimatePresence } from 'moti';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_SPACING = (width - CARD_WIDTH) / 2;



const QUICK_CONNECTS = [
    { id: 'apple', label: 'Apple Pay', icon: 'apple', color: '#000000', connected: true },
    { id: 'google', label: 'G Pay', icon: 'google', color: '#ffffff', connected: false },
    { id: 'paypal', label: 'PayPal', icon: 'paypal', color: '#003087', connected: true },
];

const HISTORY = [
    { id: 'h1', title: 'Cena Amigos', category: 'Comida Grupal', date: 'Hoy, 12:30 PM', amount: '-$320.00', status: 'Completado', method: 'Visa ****4242', type: 'restaurant' },
    { id: 'h2', title: 'Uber Taxi', category: 'Transporte', date: 'Ayer, 4:15 PM', amount: '-$15.50', status: 'Completado', method: 'Visa ****4242', type: 'local-taxi' },
    { id: 'h3', title: 'Netflix Sub', category: 'Suscripción', date: '14 Oct, 9:00 AM', amount: '-$12.99', status: 'Fallido', method: 'Master****8888', type: 'subscriptions' },
];

export default function PaymentsScreen() {
    const { theme, fontScale } = useTheme();
    const scrollX = useRef(new Animated.Value(0)).current;

    const METHODS = [
        { id: '1', type: 'VISA', last4: '4242', holder: 'LUIS GONZALEZ', expiry: '08/28', default: true, colors: [theme.primary, '#4f46e5'], icon: 'credit-card' },
        { id: '2', type: 'MASTERCARD', last4: '8888', holder: 'LUIS GONZALEZ', expiry: '12/26', default: false, colors: [theme.primary === '#38bdf8' ? '#0b979e' : theme.primary, '#00ff9f'], icon: 'payments' },
    ];

    const SectionHeader = ({ title, action, route }: { title: string, action?: string, route?: any }) => (
        <View className="flex-row justify-between items-end mb-6">
            <Text 
                style={{ fontSize: 10 * fontScale, color: theme.textSecondary }} 
                className="font-black uppercase tracking-[3px]"
            >
                {title}
            </Text>
            {action && (
                <TouchableOpacity onPress={() => route && router.push(route)}>
                    <Text style={{ fontSize: 11 * fontScale, color: theme.primary }} className="font-black">TODO</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* Header */}
                <View className="px-6 py-8 flex-row justify-between items-center">
                    <View>
                        <Text style={{ fontSize: 32 * fontScale, color: theme.text }} className="font-black tracking-tighter leading-none">CARTERA</Text>
                        <Text style={{ fontSize: 9 * fontScale, color: theme.primary }} className="font-black uppercase tracking-[3px] mt-2">Personal & Grupos</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => router.push('/wallet/security')}
                        style={{ backgroundColor: theme.glassBg, borderColor: theme.border }}
                        className="w-12 h-12 rounded-[18px] items-center justify-center border"
                    >
                        <MaterialIcons name="security" size={24} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Credit Cards Carousel */}
                <View className="mb-10">
                    <View className="px-6">
                        <SectionHeader title="Mis Tarjetas" />
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
                            const rotate = scrollX.interpolate({
                                inputRange,
                                outputRange: ['-2deg', '0deg', '2deg'],
                                extrapolate: 'clamp'
                            });

                            return (
                                <Animated.View 
                                    key={item.id} 
                                    style={{ width: CARD_WIDTH, transform: [{ scale }, { rotate }] }} 
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
                                            className="h-52 rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
                                        >
                                            <View className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full -mr-20 -mt-20 border border-white/5" />
                                            <View className="flex-row justify-between items-start mb-8">
                                                <View className="w-14 h-10 bg-white/20 rounded-lg items-center justify-center border border-white/10">
                                                    <MaterialIcons name="contactless" size={28} color="white" />
                                                </View>
                                                <Text className="text-white font-black italic text-xl tracking-tighter">{item.type}</Text>
                                            </View>
                                            <Text className="text-white font-mono text-2xl tracking-[5px] mb-8">**** **** **** {item.last4}</Text>
                                            <View className="flex-row justify-between items-end">
                                                <View>
                                                    <Text style={{ fontSize: 8 * fontScale }} className="text-white/40 font-black uppercase tracking-widest mb-1">TITULAR</Text>
                                                    <Text style={{ fontSize: 11 * fontScale }} className="text-white font-black uppercase">{item.holder}</Text>
                                                </View>
                                                <View className="items-end">
                                                    <Text style={{ fontSize: 8 * fontScale }} className="text-white/40 font-black uppercase tracking-widest mb-1">EXPIRA</Text>
                                                    <Text style={{ fontSize: 11 * fontScale }} className="text-white font-black uppercase">{item.expiry}</Text>
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        })}
                        
                        {/* New Card placeholder */}
                        <TouchableOpacity 
                            onPress={() => router.push('/wallet/methods/new')}
                            activeOpacity={0.8}
                            style={{ width: CARD_WIDTH, borderColor: theme.border, backgroundColor: theme.glassBg }} 
                            className="h-52 rounded-[40px] border-2 border-dashed items-center justify-center gap-3"
                        >
                            <View style={{ backgroundColor: theme.primary }} className="w-12 h-12 rounded-2xl items-center justify-center">
                                <MaterialIcons name="add" size={32} color="white" />
                            </View>
                            <Text style={{ color: theme.text, fontSize: 12 * fontScale }} className="font-black uppercase tracking-widest">NUEVA TARJETA</Text>
                        </TouchableOpacity>
                    </Animated.ScrollView>
                </View>

                {/* Quick Wallet Connections */}
                <View className="px-6 mb-12">
                    <SectionHeader title="Pagos Rápidos" />
                    <View className="flex-row gap-4">
                        {QUICK_CONNECTS.map(conn => (
                            <TouchableOpacity 
                                key={conn.id}
                                activeOpacity={0.8}
                                style={{ backgroundColor: conn.color === '#ffffff' ? theme.glassBg : conn.color }}
                                className="flex-1 h-20 rounded-[28px] items-center justify-center relative border border-white/5"
                            >
                                <FontAwesome5 name={conn.icon} size={24} color={conn.color === '#ffffff' ? '#ffffff' : 'white'} />
                                {conn.connected && (
                                    <View className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#050a15] items-center justify-center">
                                        <MaterialIcons name="check" size={10} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Transaction History */}
                <View className="px-6 mb-10">
                    <SectionHeader title="Historial de Pagos" action="TODO" route="/history/all" />

                    <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="border rounded-[40px] overflow-hidden p-2">
                        {HISTORY.map((tx, i) => (
                            <MotiView 
                                from={{ opacity: 0, translateX: -10 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ delay: i * 100 }}
                                key={tx.id} 
                            >
                                <TouchableOpacity 
                                    activeOpacity={0.8}
                                    className={`p-5 flex-row items-center justify-between mb-2 rounded-[32px] ${i % 2 === 0 ? 'bg-white/5' : ''}`}
                                >
                                    <View className="flex-row items-center gap-4 flex-1">
                                        <View style={{ backgroundColor: theme.glassBg }} className="w-14 h-14 rounded-[20px] items-center justify-center">
                                            <MaterialIcons 
                                                name={tx.type as any} 
                                                size={24} 
                                                color={theme.primary} 
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text style={{ fontSize: 15 * fontScale, color: theme.text }} className="font-black tracking-tight" numberOfLines={1}>{tx.title}</Text>
                                            <View className="flex-row items-center gap-2 mt-1">
                                                <Text style={{ fontSize: 8 * fontScale, color: theme.primary }} className="font-black uppercase tracking-widest">{tx.status}</Text>
                                                <Text style={{ fontSize: 9 * fontScale }} className="text-slate-500 font-bold uppercase">• {tx.date}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="items-end ml-4">
                                        <Text style={{ fontSize: 16 * fontScale, color: theme.text }} className="font-black mb-1">{tx.amount}</Text>
                                        <Text style={{ fontSize: 8 * fontScale }} className="text-slate-500 font-black uppercase">{tx.method}</Text>
                                    </View>
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
