import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const FRIENDS = [
    { id: '1', name: 'Carlos López', username: '@carlopez', balance: 150.00, status: 'Te debe', avatar: 'https://i.pravatar.cc/150?u=carlos', lastActivity: 'Hoy, 2:30 PM' },
    { id: '2', name: 'Ana Martínez', username: '@anamar', balance: -50.00, status: 'Le debes', avatar: 'https://i.pravatar.cc/150?u=ana', lastActivity: 'Ayer' },
    { id: '3', name: 'Roberto Gómez', username: '@robgom', balance: 0.00, status: 'Al día', avatar: 'https://i.pravatar.cc/150?u=roberto', lastActivity: '15 Oct' },
    { id: '4', name: 'Lucía Fernández', username: '@luciaf', balance: 320.50, status: 'Te debe', avatar: 'https://i.pravatar.cc/150?u=lucia', lastActivity: 'Lunes' },
    { id: '5', name: 'Marcos Ruiz', username: '@mruiz', balance: -12.00, status: 'Le debes', avatar: 'https://i.pravatar.cc/150?u=marcos', lastActivity: '12 Sep' },
];

export default function FriendsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('Todos'); // Todos, Me deben, Les debo, Al día

    const summary = useMemo(() => {
        const theyOwe = FRIENDS.filter(f => f.balance > 0).reduce((acc, curr) => acc + curr.balance, 0);
        const iOwe = FRIENDS.filter(f => f.balance < 0).reduce((acc, curr) => acc + Math.abs(curr.balance), 0);
        return { theyOwe, iOwe, count: FRIENDS.length };
    }, []);

    const filteredFriends = useMemo(() => {
        return FRIENDS.filter(friend => {
            const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               friend.username.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filter === 'Todos' || 
                               (filter === 'Me deben' && friend.balance > 0) ||
                               (filter === 'Les debo' && friend.balance < 0) ||
                               (filter === 'Al día' && friend.balance === 0);
            return matchesSearch && matchesFilter;
        }).sort((a, b) => {
            // Priority: Pending balances first
            if (Math.abs(a.balance) > 0 && b.balance === 0) return -1;
            if (a.balance === 0 && Math.abs(b.balance) > 0) return 1;
            return 0;
        });
    }, [searchQuery, filter]);

    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center">
                <View>
                    <Text className="text-white text-3xl font-black tracking-tight">Amigos</Text>
                    <Text className="text-slate-500 text-xs font-medium">Gestiona tus deudas y cobros</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => router.push('/friends/add')}
                    className="w-11 h-11 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/20"
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="person-add-alt-1" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Summary Banner */}
            <View className="px-6 mt-2">
                <View className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex-row justify-between">
                    <View className="items-center flex-1 border-r border-white/10">
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Te deben</Text>
                        <Text className="text-emerald-400 text-xl font-black">${summary.theyOwe.toFixed(2)}</Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Debes</Text>
                        <Text className="text-rose-400 text-xl font-black">${summary.iOwe.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            {/* Sticky Search & Filters */}
            <View className="px-6 mt-8">
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 mb-6 focus:border-blue-500/50">
                    <Feather name="search" size={18} color="#64748b" />
                    <TextInput 
                        placeholder="Buscar por nombre o @usuario"
                        placeholderTextColor="#475569"
                        className="flex-1 ml-3 text-white font-medium text-sm"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialIcons name="cancel" size={18} color="#475569" />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {['Todos', 'Me deben', 'Les debo', 'Al día'].map(f => (
                        <TouchableOpacity 
                            key={f}
                            onPress={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-full border ${filter === f ? 'bg-blue-600 border-blue-600' : 'bg-white/5 border-white/10'}`}
                        >
                            <Text className={`text-[11px] font-bold ${filter === f ? 'text-white' : 'text-slate-400'}`}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Friends List */}
            <ScrollView 
                className="flex-1 px-6 mt-6" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {filteredFriends.length > 0 ? (
                    filteredFriends.map(friend => (
                        <TouchableOpacity 
                            key={friend.id}
                            onPress={() => router.push({ pathname: `/friends/[id]`, params: { id: friend.id } } as any)}
                            activeOpacity={0.8}
                            className="bg-white/5 border border-white/10 rounded-[28px] p-4 flex-row items-center mb-3.5"
                        >
                            {/* Avatar with Status Ring */}
                            <View className={`p-0.5 rounded-full mr-4 ${friend.balance > 0 ? 'border-2 border-emerald-500/30' : friend.balance < 0 ? 'border-2 border-rose-500/30' : 'border-2 border-transparent'}`}>
                                <Image 
                                    source={{ uri: friend.avatar }} 
                                    className="w-12 h-12 rounded-full bg-slate-800"
                                />
                            </View>

                            <View className="flex-1">
                                <Text className="text-white font-bold text-base">{friend.name}</Text>
                                <Text className="text-slate-500 text-[11px] font-medium">{friend.username}</Text>
                            </View>

                            <View className="items-end mr-2">
                                <Text className={`font-black text-sm ${friend.balance > 0 ? 'text-emerald-400' : friend.balance < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                                    {friend.balance === 0 ? 'Al día' : `${friend.balance > 0 ? 'Te debe' : 'Debes'} $${Math.abs(friend.balance).toFixed(2)}`}
                                </Text>
                                <Text className="text-[9px] text-slate-600 font-bold uppercase mt-1">{friend.lastActivity}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={18} color="#334155" />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="items-center justify-center py-20 opacity-40">
                        <View className="w-20 h-20 rounded-full bg-slate-800 items-center justify-center mb-6">
                            <MaterialIcons name="people-outline" size={40} color="#64748b" />
                        </View>
                        <Text className="text-white text-lg font-bold">No se encontraron amigos</Text>
                        <Text className="text-slate-500 text-sm text-center mt-2 px-10">
                            Prueba ajustando los filtros o agrega un nuevo contacto para empezar.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
