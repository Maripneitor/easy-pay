import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGroup } from '../../../src/infrastructure/hooks/useGroup';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { group, shares, isLoading, error } = useGroup(id as string);
    const [activeTab, setActiveTab] = useState<'activity' | 'balances'>('activity');
    
    // Safety check for unmount
    const isMounted = useRef(true);
    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    if (isLoading) {
        return (
            <View className="flex-1 bg-[#0f172a] items-center justify-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-slate-400 mt-4 font-bold tracking-widest text-[10px] uppercase">Cargando mesa...</Text>
            </View>
        );
    }

    if (error || !group) {
        return (
            <View className="flex-1 bg-[#0f172a] items-center justify-center p-8">
                <View className="w-20 h-20 bg-red-500/10 rounded-full items-center justify-center mb-6 border border-red-500/20">
                    <MaterialIcons name="error-outline" size={40} color="#ef4444" />
                </View>
                <Text className="text-white text-2xl font-black text-center">¡Ups! Algo falló</Text>
                <Text className="text-slate-400 mt-2 text-center text-sm leading-5">{error || 'No pudimos encontrar los detalles de esta mesa.'}</Text>
                <Pressable 
                    onPress={() => router.replace('/(tabs)/dashboard')}
                    className="mt-10 bg-white/5 px-10 py-4 rounded-2xl border border-white/10 active:bg-white/10"
                >
                    <Text className="text-white font-bold">Volver al inicio</Text>
                </Pressable>
            </View>
        );
    }

    const currentMemberId = group.members[0]?.id; 
    const myShare = shares?.shares.find(s => s.memberId === currentMemberId)?.total.amount || 0;
    const amountOwedToMe = shares?.shares
        .filter(s => s.memberId !== currentMemberId && !group.members.find(m => m.id === s.memberId)?.hasPaid)
        .reduce((acc, s) => acc + s.total.amount, 0) || 0;

    const renderItem = ({ item }: { item: any }) => (
        <View className="bg-white/5 border border-white/5 rounded-[24px] p-4 flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-slate-800 items-center justify-center border border-white/5">
                    <MaterialIcons name="restaurant" size={20} color="#94a3b8" />
                </View>
                <View className="max-w-[150px]">
                    <Text className="text-white font-black text-sm" numberOfLines={1}>{item.description}</Text>
                    <Text className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                        {item.addedBy === currentMemberId ? 'Tú lo agregaste' : 'Agregado'}
                    </Text>
                </View>
            </View>
            <View className="items-end">
                <Text className="text-white font-black text-base">${item.amount.toFixed(2)}</Text>
                <Pressable className="active:opacity-60">
                    <Text className="text-blue-500 text-[8px] font-black uppercase tracking-tighter">Detalle</Text>
                </Pressable>
            </View>
        </View>
    );

    const renderMember = ({ item }: { item: any }) => {
        const memberShare = shares?.shares.find(s => s.memberId === item.id)?.total.amount || 0;
        const isMe = item.id === currentMemberId;
        
        return (
            <View className="bg-white/5 border border-white/5 rounded-[24px] p-4 flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-slate-700 items-center justify-center border border-white/10">
                        <MaterialIcons name="person" size={22} color="white" />
                    </View>
                    <View>
                        <Text className="text-white font-black text-sm">
                            {item.name} {isMe && <Text className="text-blue-500">(Tú)</Text>}
                        </Text>
                        <View className="flex-row items-center gap-1.5">
                            <View className={`w-1.5 h-1.5 rounded-full ${item.hasPaid ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                            <Text className="text-slate-500 text-[9px] font-bold uppercase">
                                {item.hasPaid ? 'Liquidado' : 'Pendiente'}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="items-end">
                    <Text className={`${item.hasPaid ? 'text-emerald-400/80' : isMe ? 'text-orange-400' : 'text-blue-400'} font-black text-base`}>
                        ${memberShare.toFixed(2)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ 
                headerShown: true, 
                headerTitle: group.name?.toUpperCase() || 'DETALLE',
                headerTintColor: 'white',
                headerTitleStyle: { fontWeight: '900', fontSize: 14 },
                headerStyle: { backgroundColor: '#0f172a' },
                headerShadowVisible: false,
                headerLeft: () => (
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </Pressable>
                ),
            }} />

            <View className="flex-1">
                {/* Visual Header - Compact for smaller screens */}
                <View className="px-6 py-4">
                    <View className="bg-blue-600 rounded-[32px] p-6 shadow-2xl shadow-blue-500/30 overflow-hidden">
                        <View className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
                        <View className="relative z-10">
                            <Text className="text-blue-100 text-[10px] font-black uppercase tracking-[2px] mb-1">Total</Text>
                            <Text className="text-white text-3xl font-black tracking-tighter">${group.total?.toFixed(2)}</Text>
                            
                            <View className="flex-row mt-4 gap-4">
                                <View className="flex-1 bg-white/10 p-3 rounded-2xl">
                                    <Text className="text-blue-200 text-[8px] font-bold uppercase">Tu Parte</Text>
                                    <Text className="text-white text-sm font-black">${myShare.toFixed(2)}</Text>
                                </View>
                                <View className="flex-1 bg-black/10 p-3 rounded-2xl">
                                    <Text className="text-blue-200 text-[8px] font-bold uppercase">Te Deben</Text>
                                    <Text className="text-white text-sm font-black">${amountOwedToMe.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View className="px-6 mb-4">
                    <View className="bg-white/5 p-1 rounded-[18px] flex-row border border-white/5">
                        <Pressable 
                            onPress={() => setActiveTab('activity')}
                            className={`flex-1 py-3 items-center rounded-[14px] ${activeTab === 'activity' ? 'bg-[#1e293b]' : ''}`}
                        >
                            <Text className={`font-black text-[10px] uppercase ${activeTab === 'activity' ? 'text-white' : 'text-slate-500'}`}>Actividad</Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => setActiveTab('balances')}
                            className={`flex-1 py-3 items-center rounded-[14px] ${activeTab === 'balances' ? 'bg-[#1e293b]' : ''}`}
                        >
                            <Text className={`font-black text-[10px] uppercase ${activeTab === 'balances' ? 'text-white' : 'text-slate-500'}`}>Saldos</Text>
                        </Pressable>
                    </View>
                </View>

                {/* List - Using FlatList for performance */}
                {activeTab === 'activity' ? (
                    <FlatList
                        data={group.items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <View className="py-16 items-center justify-center border border-dashed border-white/10 rounded-[32px] bg-white/2">
                                <MaterialIcons name="post-add" size={32} color="#334155" />
                                <Text className="text-slate-500 font-bold text-center mt-3 text-xs">No hay gastos aún</Text>
                            </View>
                        )}
                    />
                ) : (
                    <FlatList
                        data={group.members}
                        renderItem={renderMember}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                    />
                )}
            </View>

            {/* Bottom Floating Action */}
            <View className="absolute bottom-8 left-6 right-6">
                <Pressable 
                    onPress={() => router.push('/expense-form')}
                    className="w-full bg-blue-600 py-4 rounded-[20px] items-center flex-row justify-center gap-2 active:scale-95 shadow-xl shadow-blue-500/40"
                >
                    <MaterialIcons name="add" size={20} color="white" />
                    <Text className="text-white font-black text-sm px-2">AGREGAR GASTO</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
