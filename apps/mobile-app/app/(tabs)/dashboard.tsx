import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
    const [activeTab, setActiveTab] = useState<'activos' | 'inactivos'>('activos');

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]" edges={['top']}>
            <StatusBar style="light" />
            
            {/* Optimized Background Gradient (No Blurs for performance) */}
            <View className="absolute inset-0 bg-[#0f172a]" />
            <View className="absolute top-0 left-0 right-0 h-64 bg-blue-900/10" />

            {/* Header */}
            <View className="px-6 py-5 flex-row justify-between items-center border-b border-white/5 bg-[#1e293b]/20">
                <View>
                    <Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px]">Bienvenido</Text>
                    <Text className="text-white text-2xl font-black tracking-tight">Hola, Juan</Text>
                </View>
                <View className="flex-row items-center gap-3">
                    <Pressable onPress={() => router.push('/(tabs)/notifications')} className="p-2 rounded-xl bg-slate-800/50 border border-white/5">
                        <MaterialIcons name="notifications-none" size={24} color="#94a3b8" />
                        <View className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-[#0f172a]" />
                    </Pressable>
                    <View className="w-10 h-10 rounded-full bg-slate-700 items-center justify-center border border-white/10">
                        <MaterialIcons name="person" size={22} color="white" />
                    </View>
                </View>
            </View>

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 20, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Stats Summary */}
                <View className="flex-row gap-4 mb-10">
                    <View className="flex-1 bg-blue-600/10 border border-blue-500/20 p-5 rounded-3xl">
                        <Text className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Debes</Text>
                        <Text className="text-white text-xl font-black">$320.00</Text>
                    </View>
                    <View className="flex-1 bg-emerald-600/10 border border-emerald-500/20 p-5 rounded-3xl">
                        <Text className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Te deben</Text>
                        <Text className="text-white text-xl font-black">$280.00</Text>
                    </View>
                </View>

                {/* Active Groups Section */}
                <View className="mb-10">
                    <View className="flex-row justify-between items-center mb-6 px-1">
                        <Text className="text-xs font-black text-slate-500 tracking-[1px] uppercase">Mis Grupos Activos</Text>
                        <Pressable 
                            onPress={() => router.push('/create-group')}
                            className="flex-row items-center gap-1.5 bg-blue-600 px-4 py-2 rounded-xl active:scale-95"
                        >
                            <MaterialIcons name="add" size={16} color="white" />
                            <Text className="text-white text-xs font-black uppercase">Nuevo</Text>
                        </Pressable>
                    </View>

                    <View className="gap-4">
                        {/* Group Card 1 */}
                        <Pressable 
                            onPress={() => router.push('/add-expense')}
                            className="bg-slate-800/40 border border-white/5 rounded-3xl p-5 active:bg-slate-800/60"
                        >
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-12 h-12 rounded-2xl bg-orange-500/10 justify-center items-center border border-orange-500/20">
                                        <MaterialIcons name="restaurant" size={24} color="#f97316" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-black text-base">Cena viernes</Text>
                                        <Text className="text-slate-500 text-[10px] font-bold">Mesa #4 • 4 personas</Text>
                                    </View>
                                </View>
                                <View className="bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                                    <Text className="text-blue-500 text-[8px] font-black uppercase">Admin</Text>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-end border-t border-white/5 pt-4">
                                <View className="flex-row -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <View key={i} className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-slate-700 items-center justify-center">
                                            <MaterialIcons name="person" size={14} color="#94a3b8" />
                                        </View>
                                    ))}
                                    <View className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-blue-600 items-center justify-center">
                                        <Text className="text-[9px] text-white font-black">+1</Text>
                                    </View>
                                </View>
                                <View className="items-end">
                                    <Text className="text-[#ef4444] font-black text-lg">-$320.00</Text>
                                    <Text className="text-slate-500 text-[9px] font-bold uppercase">Deuda estimada</Text>
                                </View>
                            </View>
                        </Pressable>

                        {/* Group Card 2 */}
                        <Pressable 
                            className="bg-slate-800/40 border border-white/5 rounded-3xl p-5 active:bg-slate-800/60"
                        >
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-12 h-12 rounded-2xl bg-purple-500/10 justify-center items-center border border-purple-500/20">
                                        <MaterialIcons name="school" size={24} color="#c084fc" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-black text-base">Comida Facultad</Text>
                                        <Text className="text-slate-500 text-[10px] font-bold">Hamburguesas • 3 personas</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-end border-t border-white/5 pt-4">
                                <View className="flex-row -space-x-2">
                                    {[1, 2].map(i => (
                                        <View key={i} className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-slate-700 items-center justify-center">
                                            <MaterialIcons name="person" size={14} color="#94a3b8" />
                                        </View>
                                    ))}
                                </View>
                                <View className="items-end">
                                    <Text className="text-[#22c55e] font-black text-lg">+$280.00</Text>
                                    <Text className="text-slate-500 text-[9px] font-bold uppercase">Te deben</Text>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                </View>

                {/* Pending Invites */}
                <View>
                    <Text className="text-xs font-black text-slate-500 tracking-[1px] uppercase mb-4 px-1">Invitaciones Pendientes</Text>
                    
                    <View className="bg-slate-800/40 border border-white/5 rounded-3xl p-5">
                        <View className="flex-row items-center gap-4 mb-5">
                            <View className="w-12 h-12 rounded-2xl bg-blue-500/10 items-center justify-center border border-blue-500/20">
                                <MaterialIcons name="flight" size={24} color="#3b82f6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black text-base">Viaje a la playa</Text>
                                <Text className="text-slate-500 text-xs">De <Text className="text-blue-400 font-bold">María G.</Text></Text>
                            </View>
                        </View>
                        
                        <View className="flex-row gap-3">
                            <Pressable className="flex-1 py-3 rounded-xl border border-white/10 items-center active:bg-white/5">
                                <Text className="text-slate-400 font-black text-xs uppercase">Rechazar</Text>
                            </Pressable>
                            <Pressable className="flex-1 py-3 rounded-xl bg-[#2196F3] items-center active:scale-95 shadow-lg shadow-blue-500/20">
                                <Text className="text-white font-black text-xs uppercase">Aceptar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Float Action Button */}
            <Pressable 
                onPress={() => router.push('/create-group')}
                className="absolute bottom-28 right-6 w-14 h-14 rounded-2xl bg-[#2196F3] justify-center items-center shadow-2xl shadow-blue-500/40 active:scale-95 z-50"
            >
                <MaterialIcons name="add" size={28} color="white" />
            </Pressable>
        </SafeAreaView>
    );
}
