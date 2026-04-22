import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { groupRepository } from '../../src/infrastructure/api/repositories/GroupRepository';

const MotiView = View as any;

export default function GroupListScreen() {
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
                <View className="flex-row justify-between items-center mb-10 py-4">
                    <View>
                        <Text style={{ color: theme.text, fontSize: 32 * fontScale }} className="font-black tracking-tighter leading-none uppercase">Mis Grupos</Text>
                        <Text style={{ color: theme.primary, fontSize: 9 * fontScale }} className="font-black uppercase tracking-[3px] mt-2">Gestos Compartidos</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => router.push('/create-group')}
                        style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                        className="w-12 h-12 rounded-2xl items-center justify-center border"
                    >
                        <MaterialIcons name="add" size={24} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                {/* Groups List */}
                <View className="gap-6">
                    {isLoading ? (
                        <View className="py-20 items-center">
                            <ActivityIndicator size="large" color={theme.primary} />
                        </View>
                    ) : groups.length > 0 ? (
                        groups.map((group, index) => (
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
                            
                            <TouchableOpacity 
                                onPress={() => router.push('/create-group')}
                                style={{ backgroundColor: theme.primary }}
                                className="mt-10 px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/20"
                            >
                                <Text className="text-black font-black uppercase tracking-widest text-xs">Crear Primer Grupo</Text>
                            </TouchableOpacity>
                        </View>
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
