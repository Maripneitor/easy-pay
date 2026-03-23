import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const HISTORY = [
    { id: '1', title: 'Cena Sushi', amount: -150.00, date: 'Hoy, 2:30 PM', group: 'Mesa #4', status: 'Pagado por ti' },
    { id: '2', title: 'Uber a casa', amount: +80.00, date: 'Ayer', group: 'Personal', status: 'Debes recibir' },
    { id: '3', title: 'Regalo María', amount: -60.00, date: '15 Oct', group: 'Cumpleaños', status: 'Dividido 50/50' },
];

const SHARED_GROUPS = [
    { id: 'g2', name: 'Mesa #4', members: 3, bg: '#a855f7' },
    { id: 'g3', name: 'Amigos Tech', members: 8, bg: '#10b981' },
];

export default function FriendDetailScreen() {
    const { id } = useLocalSearchParams();
    
    // In a real app, find friend from context/API
    const friend = {
        name: 'Carlos López',
        username: '@carlopez',
        balance: 150.00,
        status: 'Te debe',
        avatar: 'https://i.pravatar.cc/150?u=carlos',
        lastSeen: 'Activo hace poco'
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Overlay */}
            <View className="px-6 py-4 flex-row justify-between items-center z-50">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                    className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10"
                >
                    <MaterialIcons name="more-vert" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Profile Section */}
                <View className="items-center px-6 pt-4 pb-8">
                    <View className={`p-1 rounded-full border-4 ${friend.balance > 0 ? 'border-emerald-500/20' : friend.balance < 0 ? 'border-rose-500/20' : 'border-slate-800'}`}>
                        <Image 
                            source={{ uri: friend.avatar }} 
                            className="w-28 h-28 rounded-full"
                        />
                    </View>
                    <Text className="text-white text-3xl font-black mt-6 tracking-tight">{friend.name}</Text>
                    <Text className="text-slate-500 text-sm font-bold mt-1">{friend.username} • {friend.lastSeen}</Text>
                    
                    {/* Balance Card Detail */}
                    <View className="mt-8 bg-white/5 border border-white/10 rounded-[36px] p-6 w-full items-center">
                        <Text className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1.5">{friend.status}</Text>
                        <Text className={`text-4xl font-black ${friend.balance > 0 ? 'text-emerald-400' : friend.balance < 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                            ${Math.abs(friend.balance).toFixed(2)}
                        </Text>
                        <View className="flex-row gap-8 mt-8 w-full justify-center">
                            <TouchableOpacity 
                                onPress={() => router.push({ pathname: '/settle-up', params: { friendId: id } } as any)}
                                className="items-center"
                            >
                                <View className="w-14 h-14 bg-blue-600 rounded-2xl items-center justify-center mb-2 shadow-lg shadow-blue-500/20">
                                    <MaterialIcons name="handshake" size={26} color="white" />
                                </View>
                                <Text className="text-white text-[10px] font-black uppercase">Liquidar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => router.push({ pathname: '/add-expense', params: { friendId: id } } as any)}
                                className="items-center"
                            >
                                <View className="w-14 h-14 bg-white/10 rounded-2xl items-center justify-center mb-2 border border-white/5">
                                    <Ionicons name="add-circle" size={28} color="white" />
                                </View>
                                <Text className="text-white text-[10px] font-black uppercase">Gasto</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="items-center">
                                <View className="w-14 h-14 bg-white/10 rounded-2xl items-center justify-center mb-2 border border-white/5">
                                    <MaterialIcons name="notifications-active" size={26} color="white" />
                                </View>
                                <Text className="text-white text-[10px] font-black uppercase">Recordar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Sub-sections */}
                <View className="px-6 gap-10 mt-4">
                    {/* History */}
                    <View>
                        <View className="flex-row justify-between items-center mb-5">
                            <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Historial de movimientos</Text>
                            <TouchableOpacity>
                                <Text className="text-blue-500 text-[11px] font-bold">Ver todo</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="gap-3.5">
                            {HISTORY.map(item => (
                                <View key={item.id} className="bg-white/5 border border-white/10 rounded-3xl p-4 flex-row items-center">
                                    <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center mr-4 border border-white/5">
                                        <MaterialIcons name="receipt-long" size={20} color="#94a3b8" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-sm">{item.title}</Text>
                                        <Text className="text-slate-500 text-[10px] font-medium">{item.group} • {item.date}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className={`font-black text-sm ${item.amount > 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                                            {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
                                        </Text>
                                        <Text className="text-slate-500 text-[9px] uppercase mt-1 font-bold">{item.status}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Shared Groups */}
                    <View>
                        <View className="flex-row justify-between items-center mb-5">
                            <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Grupos compartidos</Text>
                            <TouchableOpacity onPress={() => router.push('/create-group')}>
                                <Text className="text-blue-500 text-[11px] font-bold">Unirse a otro</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                            {SHARED_GROUPS.map(group => (
                                <TouchableOpacity 
                                    key={group.id}
                                    onPress={() => router.push(`/(tabs)/group/${group.id}` as any)}
                                    className="bg-white/5 border border-white/10 rounded-3xl p-5 w-32 h-32 justify-between"
                                >
                                    <View style={{ backgroundColor: `${group.bg}20` }} className="w-8 h-8 rounded-lg items-center justify-center">
                                        <MaterialIcons name="groups" size={18} color={group.bg} />
                                    </View>
                                    <View>
                                        <Text className="text-white font-bold text-xs" numberOfLines={1}>{group.name}</Text>
                                        <Text className="text-slate-500 text-[9px] font-black uppercase">{group.members} Miembros</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
