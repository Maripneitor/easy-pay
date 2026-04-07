import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, Image, Dimensions, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { MotiView, MotiText, AnimatePresence } from 'moti';

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
    const { theme, fontScale } = useTheme();
    const insets = useSafeAreaInsets();
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
            if (Math.abs(a.balance) > 0 && b.balance === 0) return -1;
            if (a.balance === 0 && Math.abs(b.balance) > 0) return 1;
            return 0;
        });
    }, [searchQuery, filter]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-6 py-6 flex-row justify-between items-center">
                <View>
                    <Text style={{ color: theme.text, fontSize: 32 * fontScale }} className="font-black tracking-tight leading-none">Amigos</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-[3px] mt-2">Gestión Social</Text>
                </View>
                <Pressable 
                    onPress={() => router.push('/friends/add')}
                    style={({ pressed }) => ({
                        backgroundColor: theme.primary, 
                        shadowColor: theme.primary,
                        opacity: pressed ? 0.8 : 1
                    })}
                    className="w-12 h-12 rounded-[18px] items-center justify-center shadow-lg shadow-pink-500/20"
                >
                    <MaterialIcons name="person-add-alt-1" size={24} color="white" />
                </Pressable>
            </View>

            {/* Summary Banner */}
            <View className="px-6 mt-4">
                <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: theme.border }} className="border rounded-[32px] p-6 flex-row justify-between">
                    <View className="items-center flex-1 border-r border-white/5">
                        <Text style={{ color: theme.textSecondary, fontSize: 9 * fontScale }} className="font-black uppercase tracking-[2px] mb-1">A TU FAVOR</Text>
                        <Text style={{ color: '#10b981', fontSize: 24 * fontScale }} className="font-black">${summary.theyOwe.toFixed(2)}</Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text style={{ color: theme.textSecondary, fontSize: 9 * fontScale }} className="font-black uppercase tracking-[2px] mb-1">TÚ DEBES</Text>
                        <Text style={{ color: '#f43f5e', fontSize: 24 * fontScale }} className="font-black">${summary.iOwe.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            {/* Sticky Search & Filters */}
            <View className="px-6 mt-10">
                <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: theme.border }} className="flex-row items-center border rounded-2xl px-5 py-3.5 mb-6">
                    <Feather name="search" size={18} color={theme.textSecondary} />
                    <TextInput 
                        placeholder="Buscar por nombre o @usuario"
                        placeholderTextColor="#475569"
                        className="flex-1 ml-3 text-white font-bold text-sm"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')} className="active:opacity-50">
                            <MaterialIcons name="cancel" size={18} color="#475569" />
                        </Pressable>
                    )}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {['Todos', 'Me deben', 'Les debo', 'Al día'].map(f => (
                        <Pressable 
                            key={f}
                            onPress={() => setFilter(f)}
                            style={({ pressed }) => ({ 
                                backgroundColor: filter === f ? theme.primary : 'rgba(255,255,255,0.05)',
                                borderColor: filter === f ? theme.primary : theme.border,
                                opacity: pressed ? 0.7 : 1
                            })}
                            className={`px-5 py-2.5 rounded-full border shadow-sm`}
                        >
                            <Text style={{ fontSize: 10 * fontScale }} className={`font-black uppercase tracking-wider ${filter === f ? 'text-white' : 'text-slate-500'}`}>{f}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Friends List */}
            <FlatList 
                className="flex-1 px-6 mt-8" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
                data={filteredFriends}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => (
                    <MotiView 
                        from={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="items-center justify-center py-20"
                    >
                        <View className="w-24 h-24 rounded-[32px] bg-slate-800/50 items-center justify-center mb-8 border border-white/5">
                            <MaterialCommunityIcons name="account-search-outline" size={48} color={theme.textSecondary} />
                        </View>
                        <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black uppercase tracking-widest">¿Buscando a alguien?</Text>
                        <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="text-center mt-3 px-10 font-bold leading-5">
                            No encontramos a nadie bajo esos criterios. Prueba buscando otro nombre o invita a un nuevo amigo.
                        </Text>
                        <Pressable 
                            style={({ pressed }) => ({ backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 })}
                            className="mt-10 px-10 py-4 rounded-full shadow-lg shadow-pink-500/20"
                        >
                            <Text className="text-white font-black uppercase tracking-widest">Invitar Amigos</Text>
                        </Pressable>
                    </MotiView>
                )}
                renderItem={({ item: friend, index }) => (
                    <MotiView 
                        key={friend.id}
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: index * 50 }}
                    >
                        <Pressable 
                            onPress={() => router.push({ pathname: `/friends/[id]`, params: { id: friend.id } } as any)}
                            style={({ pressed }) => ({ 
                                backgroundColor: 'rgba(30, 41, 59, 0.4)', 
                                borderColor: theme.border,
                                opacity: pressed ? 0.8 : 1 
                            })}
                            className="border rounded-[32px] p-5 flex-row items-center mb-4"
                        >
                            {/* Avatar with Status Ring */}
                            <View style={{ borderColor: friend.balance > 0 ? '#10b981' : friend.balance < 0 ? '#f43f5e' : 'transparent', borderWidth: 2 }} className="p-0.5 rounded-full mr-4">
                                <Image 
                                    source={{ uri: friend.avatar }} 
                                    className="w-14 h-14 rounded-full bg-slate-800"
                                />
                            </View>

                            <View className="flex-1">
                                <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black tracking-tight">{friend.name}</Text>
                                <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest mt-0.5">{friend.username}</Text>
                            </View>

                            <View className="items-end mr-2">
                                <Text style={{ 
                                    color: friend.balance > 0 ? '#10b981' : friend.balance < 0 ? '#f43f5e' : theme.textSecondary,
                                    fontSize: 14 * fontScale
                                }} className="font-black">
                                    {friend.balance === 0 ? 'AL DÍA' : `${friend.balance > 0 ? 'TE DEBE' : 'DEBES'} $${Math.abs(friend.balance).toFixed(2)}`}
                                </Text>
                                <Text style={{ color: '#334155', fontSize: 9 * fontScale }} className="font-black uppercase mt-1">{friend.lastActivity}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#334155" />
                        </Pressable>
                    </MotiView>
                )}
            />
        </View>
    );
}
