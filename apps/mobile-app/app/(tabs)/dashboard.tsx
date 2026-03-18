import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, Pressable, Dimensions, Image, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_SPACING = (width - CARD_WIDTH) / 2;

export default function DashboardScreen() {
    const scrollX = useRef(new Animated.Value(0)).current;

    const STATS = [
        { id: '1', label: 'Saldo Total', amount: '$600.00', color: ['#4f46e5', '#3b82f6'], icon: 'account-balance-wallet' },
        { id: '2', label: 'Te Deben', amount: '$280.00', color: ['#10b981', '#059669'], icon: 'trending-up' },
        { id: '3', label: 'Debes', amount: '$320.00', color: ['#ef4444', '#dc2626'], icon: 'trending-down' },
    ];

    const ACTIONS = [
        { id: 'new', label: 'Nuevo Gasto', icon: 'add-circle', route: '/add-expense', color: '#2196F3' },
        { id: 'settle', label: 'Liquidar', icon: 'payment', route: '/settle-up', color: '#a855f7' },
        { id: 'group', label: 'Crear Grupo', icon: 'group-add', route: '/create-group', color: '#10b981' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header con Perfil y Notificaciones */}
            <View className="px-6 py-4 flex-row justify-between items-center bg-[#0d1425]">
                <TouchableOpacity 
                    onPress={() => router.push('/settings')}
                    className="flex-row items-center gap-3"
                    activeOpacity={0.7}
                >
                    <View className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 items-center justify-center overflow-hidden">
                        <Image 
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4a7XazcCNYEZasnwMgx1vtfQCNnmg3LypHLUmqNM-nXbybnSyeiaxmz-wydbcA9S2m106sT8Cp37P2YK6qqvrXQ_xQksA2amMk3qyQUKENks8ighHbZMZBkz-NpOLw6ZhyfSPwYrmJr8v2MzCtFQfrTgMiNHspPviuWLUE-dPFjMZly5kiesg8bIkq-qmpf96tyJEt5KxaNHMoH980U06acRhAI4hSeGhvFYQvlpn5x4O7NWg1gFKpBiiOtuxccfHNWlePQLBrKVb' }} 
                            className="w-full h-full"
                        />
                    </View>
                    <View>
                        <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Buenos días</Text>
                        <Text className="text-white text-lg font-black tracking-tight">Luis Gonzalez</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => router.push('/(tabs)/notifications')}
                    className="w-11 h-11 bg-white/5 rounded-2xl items-center justify-center border border-white/10"
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="notifications" size={22} color="#94a3b8" />
                    <View className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0d1425]" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* Balance Cards con Snap Magnético */}
                <View className="mt-6">
                    <Animated.ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH + 16}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: CARD_SPACING }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: true }
                        )}
                    >
                        {STATS.map((item, index) => (
                            <View key={item.id} style={{ width: CARD_WIDTH }} className="mr-4">
                                <LinearGradient
                                    colors={item.color as any}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="h-44 rounded-[40px] p-8 justify-between relative overflow-hidden shadow-2xl shadow-blue-900/40"
                                >
                                    <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
                                            <MaterialIcons name={item.icon as any} size={20} color="white" />
                                        </View>
                                        <Text className="text-white/80 font-black text-xs uppercase tracking-widest">{item.label}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-white text-5xl font-black">{item.amount}</Text>
                                        {item.id === '1' && (
                                            <View className="flex-row items-center gap-1 mt-2">
                                                <MaterialIcons name="trending-up" size={12} color="#a7f3d0" />
                                                <Text className="text-emerald-200 text-[10px] font-bold">+12% vs último mes</Text>
                                            </View>
                                        )}
                                    </View>
                                </LinearGradient>
                            </View>
                        ))}
                    </Animated.ScrollView>
                </View>

                {/* Quick Actions */}
                <View className="px-6 mt-12 mb-10">
                    <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-[2px] mb-6">Acciones Rápidas</Text>
                    <View className="flex-row justify-between">
                        {ACTIONS.map(action => (
                            <TouchableOpacity 
                                key={action.id}
                                onPress={() => router.push(action.route as any)}
                                activeOpacity={0.7}
                                className="items-center"
                            >
                                <View 
                                    className="w-16 h-16 rounded-3xl items-center justify-center mb-2 shadow-lg"
                                    style={{ backgroundColor: `${action.color}15`, borderBottomWidth: 3, borderBottomColor: action.color }}
                                >
                                    <MaterialIcons name={action.icon as any} size={28} color={action.color} />
                                </View>
                                <Text className="text-white/70 text-[10px] font-black uppercase tracking-tight">{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Actividad Reciente */}
                <View className="px-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-[2px]">Actividad Reciente</Text>
                        <TouchableOpacity><Text className="text-blue-500 text-[11px] font-bold">Ver Todo</Text></TouchableOpacity>
                    </View>

                    <View className="gap-4">
                        {[
                            { id: '1', title: 'Cena viernes', group: 'Mesa #4', date: 'Hace 2 horas', amount: '-$320.00', color: '#f97316', icon: 'restaurant' },
                            { id: '2', title: 'Comida Facultad', group: 'Hamburguesas', date: 'Ayer', amount: '+$280.00', color: '#10b981', icon: 'school' },
                            { id: '3', title: 'Viaje Playa', group: 'Admin: María', date: '3 Oct', amount: 'Pendiente', color: '#3b82f6', icon: 'flight' },
                        ].map((item, index) => (
                            <TouchableOpacity 
                                key={item.id}
                                onPress={() => router.push(`/(tabs)/group/${item.id}`)}
                                activeOpacity={0.8}
                                className="bg-white/5 border border-white/10 rounded-[35px] p-5 flex-row items-center gap-4"
                            >
                                <View style={{ backgroundColor: `${item.color}15` }} className="w-12 h-12 rounded-2xl items-center justify-center border border-white/5">
                                    <MaterialIcons name={item.icon as any} size={24} color={item.color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base">{item.title}</Text>
                                    <Text className="text-slate-500 text-[10px] font-medium">{item.group} • {item.date}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className={`font-black text-sm ${item.amount.startsWith('+') ? 'text-emerald-500' : item.amount === 'Pendiente' ? 'text-blue-400' : 'text-rose-400'}`}>
                                        {item.amount}
                                    </Text>
                                    <MaterialIcons name="chevron-right" size={16} color="#475569" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Floating Quick Scan Button */}
            <TouchableOpacity 
                onPress={() => router.push('/ocr-scanner')}
                activeOpacity={0.9}
                className="absolute bottom-32 right-6 w-16 h-16 rounded-full bg-blue-600 items-center justify-center shadow-2xl shadow-blue-500/40 border-4 border-[#0d1425]"
            >
                <MaterialIcons name="qr-code-scanner" size={28} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

