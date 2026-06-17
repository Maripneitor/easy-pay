import { useEasyPay } from '../../context/EasyPayContext';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, RefreshControl, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';

import { groupRepository } from '../../src/infrastructure/api/repositories/GroupRepository';

import { MotiView } from 'moti';


const GroupItem = React.memo(({ group, theme, fontScale, onPress, isClosed }: any) => (
    <TouchableOpacity
        onPress={() => onPress(group.id)}
        activeOpacity={0.85}
        style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border, opacity: isClosed ? 0.8 : 1 }}
        className="border rounded-[36px] p-6 flex-row items-center mb-4"
    >
        <View style={{ backgroundColor: theme.glassBg }} className="w-16 h-16 rounded-[24px] items-center justify-center mr-5 border border-white/5">
            <MaterialIcons name={isClosed ? "history" : "restaurant"} size={32} color={isClosed ? theme.textSecondary : theme.primary} />
        </View>
        <View className="flex-1">
            <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight">{group.nombre || 'Grupo sin nombre'}</Text>
            <View className="flex-row items-center gap-2 mt-1">
                {!isClosed ? (
                    <>
                        <Text style={{ color: theme.primary, fontSize: 9 * fontScale }} className="font-black uppercase tracking-widest">{group.codigo_invitacion || '---'}</Text>
                        <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-medium">• {new Date(group.fecha_creacion).toLocaleDateString()}</Text>
                    </>
                ) : (
                    <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-medium">Finalizado: {new Date(group.fecha_cierre || group.updatedAt || group.fecha_creacion).toLocaleDateString()}</Text>
                )}
            </View>
        </View>
        <View className="items-end">
            <Text style={{
                color: isClosed ? theme.textSecondary : theme.text,
                fontSize: 16 * fontScale
            }} className="font-black">
                ${(group.total_gastado || 0).toFixed(2)}
            </Text>

            {!isClosed ? (
                <>
                    {group.status === 'active' && (
                        <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }} className="px-2 py-0.5 rounded-lg mt-1.5 border border-white/5">
                            <Text style={{ fontSize: 8 * fontScale, color: theme.primary }} className="font-black uppercase">Activo</Text>
                        </View>
                    )}
                    {group.status === 'settling' && (
                        <View style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }} className="px-2 py-0.5 rounded-lg mt-1.5 border border-white/5">
                            <Text style={{ fontSize: 8 * fontScale, color: '#f59e0b' }} className="font-black uppercase">Liquidando</Text>
                        </View>
                    )}
                </>
            ) : (
                <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }} className="px-2 py-0.5 rounded-lg mt-1.5 border border-white/5">
                    <Text style={{ fontSize: 8 * fontScale, color: '#10b981' }} className="font-black uppercase">Cerrado</Text>
                </View>
            )}
        </View>
    </TouchableOpacity>
));

const EmptyList = React.memo(({ isClosed, theme, fontScale }: any) => (
    <View className="items-center justify-center py-20">
        <View style={{ backgroundColor: theme.glassBg }} className="w-24 h-24 rounded-[40px] items-center justify-center mb-6 border border-white/5">
            <MaterialCommunityIcons name={isClosed ? "history" : "account-group-outline"} size={48} color={theme.textSecondary} />
        </View>
        <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black text-center mb-2">
            {isClosed ? 'Historial vacío' : '¡Aún no tienes grupos!'}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="text-center px-10 font-bold leading-5">
            {isClosed
                ? 'Aquí aparecerán los grupos que hayas finalizado y saldado completamente.'
                : 'Crea un grupo para empezar a dividir gastos con tus amigos de forma inteligente.'
            }
        </Text>
    </View>
));
export default function GroupListScreen() {
    const { theme, fontScale } = useTheme();
    const { user  } = useEasyPay();
    const insets = useSafeAreaInsets();

    const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Derived Friends logic removed to simplify UI

    const activeGroups = React.useMemo(() => 
        groups.filter(g => g.status === 'active' || g.status === 'settling'), 
    [groups]);
    
    const closedGroups = React.useMemo(() => 
        groups.filter(g => g.status === 'closed' || g.status === 'liquidated' || g.is_settled), 
    [groups]);

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


    const handleGroupPress = useCallback((id: string) => {
        router.push({ pathname: '/detalle-grupo', params: { id } });
    }, []);

    const renderItem = useCallback(({ item }: any) => (
        <GroupItem
            group={item}
            theme={theme}
            fontScale={fontScale}
            onPress={handleGroupPress}
            isClosed={activeTab === 'closed'}
        />
    ), [theme, fontScale, activeTab, handleGroupPress]);

    const renderHeader = useCallback(() => (
        <>
            <View className="flex-row justify-between items-center mb-10 pt-4">
                <View>
                    <Text style={{ color: theme.text, fontSize: 28 * fontScale }} className="font-black tracking-tighter">Mis Grupos</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="font-medium mt-1">Gana control, pierde estrés</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/create-group')}
                    style={{ backgroundColor: theme.primary, shadowColor: theme.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 }}
                    className="w-14 h-14 rounded-full items-center justify-center"
                >
                    <Ionicons name="add" size={28} color="white" />
                </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="flex-row p-1.5 rounded-full border mb-8">
                <TouchableOpacity
                    onPress={() => setActiveTab('active')}
                    style={{ backgroundColor: activeTab === 'active' ? theme.card : 'transparent', shadowColor: activeTab === 'active' ? '#000' : 'transparent', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: activeTab === 'active' ? 2 : 0 }}
                    className="flex-1 py-3.5 rounded-full items-center"
                >
                    <Text style={{ color: activeTab === 'active' ? theme.text : theme.textSecondary, fontSize: 13 * fontScale }} className="font-black tracking-widest uppercase">Activos ({activeGroups.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('closed')}
                    style={{ backgroundColor: activeTab === 'closed' ? theme.card : 'transparent', shadowColor: activeTab === 'closed' ? '#000' : 'transparent', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: activeTab === 'closed' ? 2 : 0 }}
                    className="flex-1 py-3.5 rounded-full items-center"
                >
                    <Text style={{ color: activeTab === 'closed' ? theme.text : theme.textSecondary, fontSize: 13 * fontScale }} className="font-black tracking-widest uppercase">Historial ({closedGroups.length})</Text>
                </TouchableOpacity>
            </View>
        </>
    ), [theme, fontScale, activeTab, activeGroups.length, closedGroups.length]);

    const listData = activeTab === 'active' ? activeGroups : closedGroups;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : (
                <FlatList
                    data={listData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 120, paddingHorizontal: 24, paddingTop: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                    }
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={<EmptyList isClosed={activeTab === 'closed'} theme={theme} fontScale={fontScale} />}
                    ListFooterComponent={
                        groups.length > 0 ? (
                            <View
                                style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                className="mt-8 mb-4 rounded-[40px] border p-8 items-center overflow-hidden"
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
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
}
