import React from 'react';
import { ScrollView, View, Text, Pressable, SafeAreaView, Image, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/StitchTheme';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const TRANSACTIONS = [
    { id: '1', title: 'Pago a Ana', group: 'Comida Grupal', time: 'Hoy, 12:30 PM', amount: '-$320.00', status: 'Completado', type: 'user' },
    { id: '2', title: 'Amazon MX', group: 'Electrónicos', time: 'Ayer, 4:15 PM', amount: '-$1,250.00', status: 'Completado', type: 'shop' },
    { id: '3', title: 'Netflix', group: 'Suscripción Mensual', time: '14 Oct, 9:00 AM', amount: '-$199.00', status: 'Completado', type: 'service' },
];

export default function PaymentsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]">
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {/* Credit Cards Section */}
                <View className="flex-row justify-between items-end mb-6">
                    <Text className="text-slate-500 font-black text-xs uppercase tracking-widest">Métodos Guardados</Text>
                    <Text className="text-slate-600 text-[10px] font-bold">2 tarjetas activas</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-10 overflow-visible">
                    {/* Main Card */}
                    <View className="bg-gradient-to-br from-blue-600 to-purple-600 w-[300px] h-48 rounded-[35px] p-8 mr-4 shadow-2xl shadow-blue-500/30 relative overflow-hidden">
                        <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                        <View className="flex-row justify-between items-start mb-6">
                            <View className="w-12 h-9 bg-yellow-400/20 border border-yellow-400/40 rounded-lg" />
                            <Text className="text-white font-black italic text-xl">VISA</Text>
                        </View>
                        <Text className="text-white font-mono text-xl tracking-[4px] mb-8">**** **** **** 4242</Text>
                        <View className="flex-row justify-between items-end">
                            <View>
                                <Text className="text-blue-100/50 text-[10px] font-bold uppercase tracking-widest mb-1">Titular</Text>
                                <Text className="text-white font-bold text-sm uppercase">Luis Gonzalez</Text>
                            </View>
                            <View className="bg-blue-400/30 px-3 py-1 rounded-full border border-white/20">
                                <Text className="text-white text-[9px] font-bold">Predeterminada</Text>
                            </View>
                        </View>
                    </View>

                    {/* Secondary Card */}
                    <View className="bg-slate-800/40 border border-white/5 w-[300px] h-48 rounded-[35px] p-8 mr-4 blur-sm opacity-60">
                         <View className="flex-row justify-between items-start mb-6">
                            <View className="w-12 h-9 bg-slate-400/20 rounded-lg" />
                            <View className="flex-row">
                                <View className="w-8 h-8 rounded-full bg-red-500/60" />
                                <View className="w-8 h-8 rounded-full bg-orange-400/60 -ml-4" />
                            </View>
                        </View>
                        <Text className="text-slate-400 font-mono text-xl tracking-[4px] mb-8">**** **** **** 8888</Text>
                    </View>
                </ScrollView>

                {/* Add Method Button */}
                <Pressable className="w-full border-2 border-dashed border-blue-500/30 rounded-3xl py-6 items-center justify-center flex-row gap-3 mb-12 active:bg-blue-500/5">
                    <MaterialIcons name="add-circle-outline" size={24} color="#3b82f6" />
                    <Text className="text-blue-500 font-black text-xs uppercase tracking-widest">Agregar Nuevo Método</Text>
                </Pressable>

                {/* Quick Payments */}
                <Text className="text-slate-500 font-black text-xs uppercase tracking-widest mb-6">Pagos Rápidos</Text>
                <View className="flex-row gap-4 mb-12">
                    <Pressable className="flex-1 bg-black/40 border border-white/5 h-14 rounded-2xl items-center justify-center flex-row gap-2">
                        <FontAwesome5 name="apple" size={18} color="white" />
                        <Text className="text-white font-black text-sm">Pay</Text>
                    </Pressable>
                    <Pressable className="flex-1 bg-white/5 border border-white/5 h-14 rounded-2xl items-center justify-center">
                        <Text className="text-white font-black text-sm text-center">
                            <Text className="text-blue-400 text-lg">G</Text> Pay
                        </Text>
                    </Pressable>
                    <Pressable className="flex-1 bg-[#003087]/20 border border-[#003087]/40 h-14 rounded-2xl items-center justify-center">
                        <Text className="text-[#009cde] italic font-black text-lg">PayPal</Text>
                    </Pressable>
                </View>

                {/* Transaction History */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-slate-500 font-black text-xs uppercase tracking-widest">Historial de Pagos</Text>
                    <Pressable><Text className="text-[#2196F3] text-[10px] font-bold">Ver todos</Text></Pressable>
                </View>

                <View className="bg-slate-800/20 border border-white/5 rounded-[40px] overflow-hidden mb-20">
                    {TRANSACTIONS.map((tx, i) => (
                        <View key={tx.id} className={`p-6 flex-row items-center justify-between ${i !== 0 ? 'border-t border-slate-700/30' : ''}`}>
                            <View className="flex-row items-center gap-4">
                                <View className="w-12 h-12 rounded-full bg-slate-800 items-center justify-center shadow-inner">
                                    <MaterialIcons 
                                        name={tx.type === 'user' ? 'person' : tx.type === 'shop' ? 'shopping-bag' : 'movie'} 
                                        size={22} 
                                        color="#64748b" 
                                    />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-sm">{tx.title}</Text>
                                    <Text className="text-slate-500 text-[10px]">{tx.group}</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-white font-black text-base">{tx.amount}</Text>
                                <Text className="text-slate-500 text-[9px]">{tx.time}</Text>
                            </View>
                        </View>
                    ))}
                    <Pressable className="bg-slate-700/10 py-4 items-center">
                        <Text className="text-slate-600 text-[10px] font-bold uppercase tracking-tighter">Cargar más transacciones</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
