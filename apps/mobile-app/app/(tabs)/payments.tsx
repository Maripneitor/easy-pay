import React from 'react';
import { ScrollView, View, Text, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/StitchTheme';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const TRANSACTIONS = [
    { id: '1', title: 'Pago a Ana', group: 'Comida Grupal', time: 'Hoy, 12:30 PM', amount: '-$320.00', status: 'Completado', type: 'user' },
    { id: '2', title: 'Amazon MX', group: 'Electrónicos', time: 'Ayer, 4:15 PM', amount: '-$1,250.00', status: 'Completado', type: 'shop' },
    { id: '3', title: 'Netflix', group: 'Suscripción Mensual', time: '14 Oct, 9:00 AM', amount: '-$199.00', status: 'Completado', type: 'service' },
];

export default function PaymentsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* Header */}
                <View className="px-6 py-6 flex-row justify-between items-center">
                    <Text className="text-white text-2xl font-black tracking-tight">MIS PAGOS</Text>
                    <View className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                        <MaterialIcons name="lock" size={12} color="#10b981" />
                        <Text className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Pagos Seguros</Text>
                    </View>
                </View>

                {/* Credit Cards Section */}
                <View className="px-6 flex-row justify-between items-end mb-6">
                    <Text className="text-slate-500 font-black text-[10px] uppercase tracking-[2px]">Métodos Guardados</Text>
                    <Text className="text-slate-600 text-[9px] font-bold">2 tarjetas activas</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 mb-10 overflow-visible">
                    {/* Main Card */}
                    <LinearGradient
                        colors={['#4f46e5', '#9333ea', '#db2777']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-[320px] h-52 rounded-[40px] p-8 mr-6 shadow-2xl shadow-purple-500/30 relative overflow-hidden"
                    >
                        <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                        <View className="flex-row justify-between items-start mb-8">
                            <View className="w-14 h-10 bg-yellow-400/20 border border-yellow-400/30 rounded-xl justify-center items-center">
                                <View className="w-10 h-7 bg-yellow-500/30 rounded-md" />
                            </View>
                            <View className="flex-row gap-2">
                                <Pressable className="w-9 h-9 bg-white/10 rounded-full items-center justify-center border border-white/20">
                                    <MaterialIcons name="edit" size={16} color="white" />
                                </Pressable>
                                <Pressable className="w-9 h-9 bg-white/10 rounded-full items-center justify-center border border-white/20">
                                    <MaterialIcons name="delete" size={16} color="white" />
                                </Pressable>
                            </View>
                        </View>
                        <Text className="text-white font-mono text-2xl tracking-[4px] mb-8">**** **** **** 4242</Text>
                        <View className="flex-row justify-between items-end">
                            <View>
                                <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Titular</Text>
                                <Text className="text-white font-black text-sm uppercase">Luis Gonzalez</Text>
                            </View>
                            <View className="items-end">
                                <View className="bg-white/20 px-3 py-1 rounded-full border border-white/20 mb-2">
                                    <Text className="text-white text-[8px] font-black uppercase">Predeterminada</Text>
                                </View>
                                <Text className="text-white font-black italic text-2xl">VISA</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Secondary Card (Visual overlap style) */}
                    <View className="bg-slate-800/40 border border-white/5 w-[320px] h-52 rounded-[40px] p-8 mr-6 opacity-80">
                        <View className="flex-row justify-between items-start mb-8">
                            <View className="w-14 h-10 bg-slate-700/50 rounded-xl" />
                            <View className="flex-row items-center gap-1">
                                <View className="w-8 h-8 rounded-full bg-red-500/80" />
                                <View className="w-8 h-8 rounded-full bg-orange-400/80 -ml-4" />
                            </View>
                        </View>
                        <Text className="text-slate-400 font-mono text-2xl tracking-[4px] mb-8">**** **** **** 8888</Text>
                        <View>
                            <Text className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Titular</Text>
                            <Text className="text-slate-500 font-bold text-sm uppercase">Luis Gonzalez</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Add Method Button */}
                <View className="px-6 mb-12">
                    <Pressable className="w-full border border-dashed border-blue-500/40 bg-blue-500/5 rounded-3xl py-6 items-center justify-center flex-row gap-3 active:bg-blue-500/10">
                        <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                            <MaterialIcons name="add" size={20} color="white" />
                        </View>
                        <Text className="text-blue-500 font-black text-xs uppercase tracking-[1px]">AGREGAR NUEVO MÉTODO</Text>
                    </Pressable>
                </View>

                {/* Quick Payments */}
                <View className="px-6 mb-12">
                    <Text className="text-slate-500 font-black text-[10px] uppercase tracking-[2px] mb-6">Pagos Rápidos</Text>
                    <View className="flex-row gap-4">
                        <Pressable className="flex-1 bg-black/60 border border-white/5 h-16 rounded-2xl items-center justify-center flex-row gap-2 active:bg-black">
                            <FontAwesome5 name="apple" size={20} color="white" />
                            <Text className="text-white font-black text-base">Pay</Text>
                        </Pressable>
                        <Pressable className="flex-1 bg-white/5 border border-white/10 h-16 rounded-2xl items-center justify-center active:bg-white/10">
                            <Text className="text-white font-black text-base">
                                <Text className="text-blue-400">G</Text> Pay
                            </Text>
                        </Pressable>
                        <Pressable className="flex-1 bg-[#003087] h-16 rounded-2xl items-center justify-center shadow-lg shadow-blue-950">
                            <Text className="text-white italic font-black text-xl">PayPal</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Transaction History */}
                <View className="px-6 mb-6 flex-row justify-between items-center">
                    <Text className="text-slate-500 font-black text-[10px] uppercase tracking-[2px]">Historial de Pagos</Text>
                    <Pressable><Text className="text-blue-500 text-[11px] font-bold">Ver todos</Text></Pressable>
                </View>

                <View className="mx-6 bg-slate-800/20 border border-white/5 rounded-[40px] overflow-hidden">
                    {TRANSACTIONS.map((tx, i) => (
                        <View key={tx.id} className={`p-6 flex-row items-center justify-between ${i !== 0 ? 'border-t border-slate-700/30' : ''}`}>
                            <View className="flex-row items-center gap-4">
                                <View className={`w-12 h-12 rounded-2xl items-center justify-center ${
                                    tx.type === 'user' ? 'bg-orange-500/10' : tx.type === 'shop' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                                }`}>
                                    <MaterialIcons 
                                        name={tx.type === 'user' ? 'person' : tx.type === 'shop' ? 'shopping-bag' : 'movie'} 
                                        size={22} 
                                        color={tx.type === 'user' ? '#f97316' : tx.type === 'shop' ? '#3b82f6' : '#a855f7'} 
                                    />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-sm">{tx.title}</Text>
                                    <Text className="text-slate-500 text-[10px] font-medium">{tx.group}</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-white font-black text-base mb-1">{tx.amount}</Text>
                                <View className="bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                    <Text className="text-emerald-500 text-[8px] font-black uppercase">{tx.status}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                    <Pressable className="py-5 items-center border-t border-slate-700/30 active:bg-white/5">
                        <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Cargar más transacciones</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={20} color="#475569" />
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

