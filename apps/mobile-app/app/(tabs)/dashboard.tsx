import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function DashboardScreen() {
    const [activeTab, setActiveTab] = useState<'activos' | 'inactivos'>('activos');

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]" edges={['top']}>
            <StatusBar style="light" />
            
            {/* Background Effects */}
            <View className="absolute top-0 w-full h-full pointer-events-none z-0">
                <View className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                <View className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
            </View>

            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5 bg-[#1e293b]/40 z-50">
                <View>
                    <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">Bienvenido</Text>
                    <Text className="text-white text-2xl font-bold tracking-tight">Hola, Juan</Text>
                </View>
                <View className="flex-row items-center gap-4">
                    <Pressable className="relative p-2 rounded-full active:bg-white/5">
                        <MaterialIcons name="notifications" size={24} color="#94a3b8" />
                        <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                    </Pressable>
                    <View className="w-10 h-10 rounded-full bg-slate-700 items-center justify-center border-2 border-[#0f172a] shadow-lg shadow-[#0f172a]">
                        <MaterialIcons name="person" size={20} color="white" />
                    </View>
                </View>
            </View>

            <ScrollView 
                className="flex-1 px-4 lg:px-6"
                contentContainerStyle={{ paddingVertical: 24, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Active Groups Section */}
                <View className="mb-10 w-full max-w-4xl mx-auto z-10">
                    <View className="flex-row justify-between items-end mb-6">
                        <Text className="text-sm font-bold text-slate-400 tracking-widest uppercase">Mis Grupos Activos</Text>
                        <Pressable 
                            onPress={() => router.push('/create-group')}
                            className="flex-row items-center gap-2 bg-blue-500/10 py-2 px-4 rounded-lg active:bg-blue-500/20"
                        >
                            <MaterialIcons name="add" size={18} color="#3b82f6" />
                            <Text className="text-[#3b82f6] text-sm font-semibold">Crear</Text>
                        </Pressable>
                    </View>

                    <View className="space-y-4">
                        {/* Group Card 1 */}
                        <Pressable className="bg-slate-800/40 border border-white/5 rounded-2xl p-5 mb-4 active:bg-white/5 overflow-hidden shadow-2xl">
                            <View className="absolute top-3 right-3 bg-blue-500/20 px-2 py-1 rounded-full border border-blue-500/20">
                                <Text className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-wide">Administrador</Text>
                            </View>

                            <View className="flex-row items-start justify-between">
                                <View className="flex-row gap-4 flex-1">
                                    <View className="w-14 h-14 rounded-xl bg-orange-500/10 justify-center items-center border border-orange-500/20 shadow-lg shadow-orange-900/20">
                                        <MaterialIcons name="restaurant" size={28} color="#f97316" />
                                    </View>
                                    <View className="flex-1 pr-2">
                                        <Text className="text-lg font-bold text-white mb-1">Cena viernes</Text>
                                        <Text className="text-slate-400 text-xs mb-3">Última act. hace 2 horas</Text>
                                        
                                        {/* Avatars */}
                                        <View className="flex-row -space-x-2">
                                            <View className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-slate-600 justify-center items-center"><MaterialIcons name="person" size={16} color="white" /></View>
                                            <View className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-slate-500 justify-center items-center"><MaterialIcons name="person" size={16} color="white" /></View>
                                            <View className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-slate-700 items-center justify-center">
                                                <Text className="text-[10px] text-white font-medium">+2</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View className="items-end min-w-[100px] mt-2 sm:mt-0">
                                    <Text className="text-slate-400 text-xs font-medium mb-1">Total del grupo</Text>
                                    <Text className="text-white font-semibold mb-2">$1,240.00</Text>
                                    <View className="bg-red-500/10 border border-red-500/20 px-2 py-1.5 rounded-lg w-full items-end">
                                        <Text className="text-[10px] text-red-300 uppercase font-bold tracking-wide">Tu deuda</Text>
                                        <Text className="text-red-500 font-bold text-base">-$320.00</Text>
                                    </View>
                                </View>
                            </View>
                        </Pressable>

                        {/* Group Card 2 */}
                        <Pressable className="bg-slate-800/40 border border-white/5 rounded-2xl p-5 mb-4 active:bg-white/5 overflow-hidden shadow-2xl">
                            <View className="flex-row items-start justify-between">
                                <View className="flex-row gap-4 flex-1">
                                    <View className="w-14 h-14 rounded-xl bg-purple-500/10 justify-center items-center border border-purple-500/20 shadow-lg shadow-purple-900/20">
                                        <MaterialIcons name="school" size={28} color="#c084fc" />
                                    </View>
                                    <View className="flex-1 pr-2">
                                        <Text className="text-lg font-bold text-white mb-1">Facultad - Comida rapida</Text>
                                        <Text className="text-slate-400 text-xs mb-3">Última act. ayer</Text>
                                        
                                        {/* Avatars */}
                                        <View className="flex-row -space-x-2">
                                            <View className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-indigo-500 items-center justify-center"><Text className="text-xs text-white">JD</Text></View>
                                            <View className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-slate-600 justify-center items-center"><MaterialIcons name="person" size={16} color="white" /></View>
                                        </View>
                                    </View>
                                </View>

                                <View className="items-end min-w-[100px] mt-2 sm:mt-0">
                                    <Text className="text-slate-400 text-xs font-medium mb-1">Total del grupo</Text>
                                    <Text className="text-white font-semibold mb-2">$850.00</Text>
                                    <View className="bg-green-500/10 border border-green-500/20 px-2 py-1.5 rounded-lg w-full items-end">
                                        <Text className="text-[10px] text-green-300 uppercase font-bold tracking-wide">Te deben</Text>
                                        <Text className="text-green-400 font-bold text-base">+$280.00</Text>
                                    </View>
                                </View>
                            </View>
                        </Pressable>

                        {/* Group Card 3 - Liquidado */}
                        <Pressable className="bg-slate-800/40 border border-white/5 rounded-2xl p-5 mb-4 active:bg-white/5 overflow-hidden shadow-2xl opacity-70">
                            <View className="absolute top-3 right-3 bg-slate-700/50 flex-row items-center gap-1 px-2 py-1 rounded-full border border-slate-600/30">
                                <MaterialIcons name="check-circle" size={10} color="#94a3b8" />
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Liquidado</Text>
                            </View>

                            <View className="flex-row items-start justify-between">
                                <View className="flex-row gap-4 flex-1">
                                    <View className="w-14 h-14 rounded-xl bg-slate-700/30 justify-center items-center border border-slate-600/20">
                                        <MaterialIcons name="celebration" size={28} color="#94a3b8" />
                                    </View>
                                    <View className="flex-1 pr-2">
                                        <Text className="text-lg font-bold text-slate-300 mb-1">Fiesta de Pedro</Text>
                                        <Text className="text-slate-400 text-xs mb-3">Finalizado el 12 Oct</Text>
                                        
                                        {/* Avatars */}
                                        <View className="flex-row -space-x-2 grayscale opacity-60">
                                            <View className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-slate-600 justify-center items-center"><MaterialIcons name="person" size={16} color="white" /></View>
                                            <View className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-pink-600 items-center justify-center"><Text className="text-xs text-white">S</Text></View>
                                            <View className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-blue-600 items-center justify-center"><Text className="text-xs text-white">M</Text></View>
                                            <View className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-slate-700 items-center justify-center">
                                                <Text className="text-[10px] text-white font-medium">+5</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View className="items-end min-w-[100px] mt-2 sm:mt-0 pt-6 sm:pt-0">
                                    <Text className="text-slate-400 text-xs font-medium mb-1">Total final</Text>
                                    <Text className="text-slate-400 font-semibold mb-2">$5,400.00</Text>
                                    <View className="flex-row items-center gap-1">
                                        <MaterialIcons name="check" size={14} color="#94a3b8" />
                                        <Text className="text-sm font-medium text-slate-400">Pagado</Text>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                </View>

                {/* Invitaciones Pendientes Section */}
                <View className="w-full max-w-4xl mx-auto z-10">
                    <Text className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4 mt-2">Invitaciones Pendientes</Text>
                    
                    <View className="bg-slate-800/40 border border-white/5 rounded-2xl p-5 border-l-4 border-l-blue-500 overflow-hidden relative shadow-2xl">
                        <View className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none" />
                        
                        <View className="flex-row flex-wrap sm:flex-nowrap items-center justify-between gap-6 z-10">
                            <View className="flex-row items-center gap-4 min-w-[200px]">
                                <View className="w-12 h-12 rounded-full bg-blue-500/20 items-center justify-center border border-blue-500/30 shrink-0">
                                    <MaterialIcons name="flight" size={24} color="#60a5fa" />
                                </View>
                                <View>
                                    <Text className="text-base font-bold text-white">Viaje a la playa</Text>
                                    <Text className="text-sm text-slate-400">Invitado por <Text className="text-blue-400 font-medium">María G.</Text></Text>
                                </View>
                            </View>

                            <View className="flex-row flex-1 sm:flex-none items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                <Pressable className="flex-1 sm:flex-none py-2 px-4 rounded-lg border border-white/10 active:bg-white/5 items-center">
                                    <Text className="text-sm font-medium text-slate-400">Rechazar</Text>
                                </Pressable>
                                <Pressable className="flex-1 sm:flex-none py-2 px-6 rounded-lg bg-[#2196F3] active:bg-[#1976D2] items-center shadow-lg shadow-blue-900/40">
                                    <Text className="text-sm font-bold text-white">Aceptar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Floating Action Button */}
            <Pressable 
                onPress={() => router.push('/create-group')}
                className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#2196F3] justify-center items-center shadow-lg shadow-blue-500/50 active:scale-95 z-50"
            >
                <MaterialIcons name="add" size={24} color="white" />
            </Pressable>
        </SafeAreaView>
    );
}
