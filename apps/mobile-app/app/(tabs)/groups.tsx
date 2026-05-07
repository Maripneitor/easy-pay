import { useEasyPay } from '../../context/EasyPayContext';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';

import { groupRepository } from '../../src/infrastructure/api/repositories/GroupRepository';

import { MotiView } from 'moti';

export default function GroupListScreen() {
    const { theme, fontScale } = useTheme();
    const { user  } = useEasyPay();
    const insets = useSafeAreaInsets();

    const [activeTab, setActiveTab] = useState<'grupos' | 'amigos'>('grupos');
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Derived Friends from real groups
    const friends = React.useMemo(() => {
        const friendsMap = new Map();
        groups.forEach(group => {
            const members = group.participantes || group.members || [];
            if (Array.isArray(members)) {
                members.forEach((p: any) => {
                    const pId = p.id || p.user_id;
                    if (pId && pId !== user?.id && !friendsMap.has(pId)) {
                        friendsMap.set(pId, {
                            id: pId,
                            name: p.nombre || p.name,
                            username: p.username || `@${(p.nombre || p.name).toLowerCase().replace(/\s/g, '').substring(0, 10)}`,
                            avatar: p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nombre || p.name)}&background=random`,
                            balance: 0
                        });
                    }
                });
            }
        });
        return Array.from(friendsMap.values());
    }, [groups, user?.id]);

    const fetchGroups = useCallback(async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const data = await groupRepository.findByUser(user.id);
            setGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchGroups();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView 
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 120, paddingHorizontal: 24, paddingTop: 20 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                }
            >
                <View className="flex-col gap-6 mb-8 py-4">
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text style={{ color: theme.text, fontSize: 32 * fontScale }} className="font-black tracking-tighter leading-none uppercase">Grupos</Text>
                            <Text style={{ color: theme.primary, fontSize: 9 * fontScale }} className="font-black uppercase tracking-[3px] mt-2">Gestión de Grupos</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => router.push('/profile' as any)}
                            style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                            className="w-10 h-10 rounded-full items-center justify-center border"
                        >
                            <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Tab Switcher */}
                    <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="flex-row p-1.5 rounded-[24px] border mt-4">
                        <TouchableOpacity 
                            onPress={() => setActiveTab('grupos')}
                            style={{ backgroundColor: activeTab === 'grupos' ? theme.primary : 'transparent' }}
                            className="flex-1 py-3 rounded-[18px] items-center justify-center flex-row gap-2"
                        >
                            <MaterialIcons name="group-work" size={18} color={activeTab === 'grupos' ? 'black' : theme.textSecondary} />
                            <Text style={{ color: activeTab === 'grupos' ? 'black' : theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest">Grupos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setActiveTab('amigos')}
                            style={{ backgroundColor: activeTab === 'amigos' ? theme.primary : 'transparent' }}
                            className="flex-1 py-3 rounded-[18px] items-center justify-center flex-row gap-2"
                        >
                            <MaterialIcons name="people" size={18} color={activeTab === 'amigos' ? 'black' : theme.textSecondary} />
                            <Text style={{ color: activeTab === 'amigos' ? 'black' : theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest">Amigos</Text>
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'grupos' && (
                        <View className="flex-row gap-3">
                            <TouchableOpacity 
                                onPress={() => router.push('/create-group')}
                                style={{ backgroundColor: theme.primary }}
                                className="flex-1 h-14 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-blue-500/20"
                            >
                                <MaterialIcons name="add" size={20} color="black" />
                                <Text style={{ fontSize: 12 * fontScale }} className="font-black uppercase tracking-widest text-black">Nuevo Grupo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => router.push('/join-group')}
                                style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                className="flex-1 h-14 rounded-2xl items-center justify-center border flex-row gap-2"
                            >
                                <MaterialIcons name="group-add" size={20} color={theme.primary} />
                                <Text style={{ color: theme.primary, fontSize: 12 * fontScale }} className="font-black uppercase tracking-widest">Unirse</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* List Container */}
                <View className="gap-6">
                    {isLoading ? (
                        <View className="py-20 items-center">
                            <ActivityIndicator size="large" color={theme.primary} />
                        </View>
                    ) : activeTab === 'grupos' ? (
                        groups.length > 0 ? (
                            groups.map((group) => (
                                <TouchableOpacity 
                                    key={group.id}
                                    onPress={() => router.push({ pathname: '/(tabs)/group/[id]', params: { id: group.id } } as any)}
                                    activeOpacity={0.85}
                                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                    className="border rounded-[36px] p-6 flex-row items-center"
                                >
                                    <View style={{ backgroundColor: theme.glassBg }} className="w-16 h-16 rounded-[24px] items-center justify-center mr-5 border border-white/5">
                                        <MaterialIcons name="restaurant" size={32} color={theme.primary} />
                                    </View>
                                    <View className="flex-1">
                                        <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight">{group.nombre || 'Grupo sin nombre'}</Text>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Text style={{ color: theme.primary, fontSize: 9 * fontScale }} className="font-black uppercase tracking-widest">{group.codigo_invitacion || '---'}</Text>
                                            <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-medium">• {new Date(group.fecha_creacion).toLocaleDateString()}</Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text style={{ 
                                            color: theme.text,
                                            fontSize: 16 * fontScale
                                        }} className="font-black">
                                            ${(group.total_gastado || 0).toFixed(2)}
                                        </Text>
                                        <View style={{ backgroundColor: group.is_settled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)' }} className="px-2 py-0.5 rounded-lg mt-1.5 border border-white/5">
                                            <Text style={{ fontSize: 8 * fontScale, color: group.is_settled ? '#10b981' : '#f59e0b' }} className="font-black uppercase">{group.is_settled ? 'Saldado' : 'Activo'}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View className="items-center justify-center py-20">
                                <View style={{ backgroundColor: theme.glassBg }} className="w-24 h-24 rounded-[40px] items-center justify-center mb-6 border border-white/5">
                                    <MaterialCommunityIcons name="account-group-outline" size={48} color={theme.textSecondary} />
                                </View>
                                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black text-center mb-2">¡Aún no tienes grupos!</Text>
                                <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="text-center px-10 font-bold leading-5">
                                    Crea un grupo para empezar a dividir gastos con tus amigos de forma inteligente.
                                </Text>
                            </View>
                        )
                    ) : (
                        // Friends List
                        friends.length > 0 ? (
                            friends.map((friend) => (
                                <TouchableOpacity 
                                    key={friend.id}
                                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                    className="border rounded-[36px] p-6 flex-row items-center mb-2"
                                >
                                    <Image 
                                        source={{ uri: friend.avatar }} 
                                        className="w-14 h-14 rounded-[20px] mr-4 bg-slate-800"
                                    />
                                    <View className="flex-1">
                                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black tracking-tight">{friend.name}</Text>
                                        <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest mt-0.5">{friend.username}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text style={{ 
                                            color: friend.balance > 0 ? '#10b981' : friend.balance < 0 ? '#f43f5e' : theme.textSecondary,
                                            fontSize: 13 * fontScale
                                        }} className="font-black">
                                            {friend.balance === 0 ? 'AL DÍA' : `$${Math.abs(friend.balance).toFixed(2)}`}
                                        </Text>
                                        <Text style={{ color: theme.textSecondary, fontSize: 8 * fontScale }} className="font-black uppercase mt-1">
                                            {friend.balance > 0 ? 'A FAVOR' : friend.balance < 0 ? 'EN CONTRA' : 'SALDADO'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View className="items-center justify-center py-10 w-full">
                                <View style={{ backgroundColor: theme.glassBg }} className="w-24 h-24 rounded-[40px] items-center justify-center mb-6 border border-white/5">
                                    <MaterialIcons name="person-add-alt" size={48} color={theme.textSecondary} />
                                </View>
                                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black text-center mb-2">Sin amigos aún</Text>
                                <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="text-center px-10 font-bold leading-5 mb-8">
                                    Los amigos aparecerán aquí cuando compartas grupos con ellos.
                                </Text>
                                <View className="w-full px-6 gap-4">
                                    <TouchableOpacity 
                                        onPress={() => router.push('/create-group')}
                                        style={{ backgroundColor: theme.primary }}
                                        className="h-14 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-blue-500/20"
                                    >
                                        <MaterialIcons name="add" size={20} color="black" />
                                        <Text style={{ fontSize: 12 * fontScale }} className="font-black uppercase tracking-widest text-black">Crear grupo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => router.push('/join-group')}
                                        style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                        className="h-14 rounded-2xl items-center justify-center border flex-row gap-2"
                                    >
                                        <MaterialIcons name="group-add" size={20} color={theme.primary} />
                                        <Text style={{ color: theme.primary, fontSize: 12 * fontScale }} className="font-black uppercase tracking-widest">Unirse a grupo</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    )}
                </View>

                {/* Suggested Action Bar (Only if groups exist) */}
                {groups.length > 0 && (
                    <View 
                        style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                        className="mt-12 rounded-[40px] border p-8 items-center overflow-hidden"
                    >
                        <View style={{ backgroundColor: theme.primary + '10' }} className="absolute -top-10 -right-10 w-32 h-32 rounded-full" />
                        <Ionicons name="rocket-outline" size={32} color={theme.primary} />
                        <Text style={{ color: theme.text, fontSize: 15 * fontScale }} className="font-black text-center mt-4">¿Dividir un gasto rápido?</Text>
                        <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="text-center mt-2 px-4 leading-5 font-bold">Usa el botón QR o crea un grupo temporal para cobrar al instante.</Text>
                        <TouchableOpacity 
                            style={{ backgroundColor: theme.glassBg, borderColor: theme.border }}
                            className="mt-6 px-8 py-3 rounded-full border"
                        >
                            <Text style={{ color: theme.text, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest">Saber Más</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

        </SafeAreaView>
    );
}
