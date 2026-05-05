import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../../src/infrastructure/context/ThemeContext';
import { VirtualTicketCard } from '../../../components/group/VirtualTicketCard';
import { MemberList } from '../../../components/group/MemberList';
import { TotalsSummary } from '../../../components/group/TotalsSummary';
import { PaymentMethodModal } from '../../../components/group/PaymentMethodModal';
import OcrTicketScanner from '../../../components/OcrTicketScanner';
import { TicketData } from '../../../src/infrastructure/services/OcrService';
import { groupRepository } from '../../../src/infrastructure/api/repositories/GroupRepository';
import { useAuth } from '../../../context/AuthContext';
import { useGrupo } from '../../../context/GrupoContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TabType = 'actividad' | 'saldos' | 'miembros';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    const { addItem, assignItem } = useGrupo();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabType>('miembros');
    const [groupData, setGroupData] = useState<any>(null);
    const [groupItems, setGroupItems] = useState<any[]>([]);
    const [balances, setBalances] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentVisible, setIsPaymentVisible] = useState(false);
    const [showOcr, setShowOcr] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const [g, items, b] = await Promise.all([
                groupRepository.getGroup(id),
                fetch(`${API_URL}/api/groups/${id}/items`).then(r => r.json()),
                fetch(`${API_URL}/api/groups/${id}/balances`).then(r => r.json()),
            ]);
            setGroupData(g);
            setGroupItems(Array.isArray(items) ? items : []);
            setBalances(b);
        } catch (err) {
            console.warn('[GroupDetail] fetchData error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const userOwed = balances?.balance_detallado?.find((b: any) => b.usuario_id === user?.id)?.balance || 0;

    const groupMembers = (groupData?.integrantes || []).map((m: any, idx: number) => ({
        id: m.id || m,
        nombre: m.nombre || `Miembro ${idx + 1}`,
        color: ['#2196F3', '#f97316', '#a855f7', '#4ade80', '#f43f5e', '#f59e0b'][idx % 6],
    }));

    const handleTabChange = (tab: TabType) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveTab(tab);
    };

    const handlePaymentSelect = (method: 'cash' | 'card') => {
        setIsPaymentVisible(false);
        router.push({ pathname: '/settle-up', params: { method, amount: userOwed } } as any);
    };

    const handleSaveItemToBackend = async (itemName: string, itemPrice: number) => {
        try {
            const res = await fetch(`${API_URL}/api/groups/add-item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    group_id: id,
                    description: itemName,
                    amount: itemPrice,
                    added_by: user?.id ?? 'unknown',
                }),
            });
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn('[GroupDetail] Error guardando item en backend:', e);
        }
        return null;
    };

    const handleOcrConfirm = async (data: TicketData) => {
        setShowOcr(false);
        const newItems: any[] = [];
        for (const item of data.items) {
            for (let i = 0; i < item.quantity; i++) {
                const localItem = {
                    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
                    name: item.name,
                    description: item.name,
                    amount: item.price,
                    assignedTo: [],
                    avatars: [],
                    addedBy: user?.id ?? '',
                };
                newItems.push(localItem);
                await addItem({
                    nombre: item.name,
                    description: item.name,
                    precio: item.price,
                    amount: item.price,
                    cantidad: 1,
                    autorId: user?.id ?? 'unknown',
                    addedBy: user?.id ?? 'unknown',
                    asignadoA: [],
                    assignedTo: [],
                });
                await handleSaveItemToBackend(item.name, item.price);
            }
        }
        setGroupItems(prev => [...prev, ...newItems]);
    };

    const handleAssignItem = async (itemId: string, assignedTo: string[]) => {
        setGroupItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, assignedTo } : item
        ));
        await assignItem(itemId, assignedTo);
        try {
            await fetch(`${API_URL}/api/groups/${id}/items/${itemId}/assign`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assigned_to: assignedTo }),
            });
        } catch { /* silencioso */ }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? 'light' : 'dark'} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between z-20" style={{ backgroundColor: theme.bg }}>
                <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full" style={{ backgroundColor: theme.cardSecondary }}>
                    <Ionicons name="arrow-back" size={20} color={theme.text} />
                </TouchableOpacity>

                <View className="items-center">
                    <Text style={{ color: theme.text, fontSize: 20 * fontScale }} className="font-bold">
                        {groupData?.nombre || 'Grupo'}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                        <View className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />
                        <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="font-medium opacity-80">
                            {isLoading ? 'Sincronizando...' : 'Conectado'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={() => setShowOcr(true)} className="p-2 rounded-full" style={{ backgroundColor: theme.cardSecondary }}>
                    <MaterialIcons name="document-scanner" size={24} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: theme.cardSecondary, height: 1 }} className="w-full" />

            {/* Tabs */}
            <View className="px-6 mb-8 mt-6">
                <View style={{ backgroundColor: theme.cardSecondary }} className="p-1 rounded-xl flex-row w-full">
                    {(['miembros', 'actividad', 'totales'] as const).map(tab => {
                        const currentTab = tab === 'totales' ? 'saldos' : tab;
                        const isActive = activeTab === currentTab;
                        const label = tab === 'miembros' ? 'Miembros' : tab === 'actividad' ? 'Ítems' : 'Totales';
                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => handleTabChange(currentTab as TabType)}
                                style={{ backgroundColor: isActive ? theme.card : 'transparent' }}
                                className={`flex-1 py-2 px-4 rounded-lg items-center justify-center ${isActive ? 'shadow-xs' : ''}`}
                            >
                                <Text style={{ color: isActive ? theme.primary : theme.textSecondary, fontWeight: isActive ? 'bold' : '500', fontSize: 13 * fontScale }}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Contenido */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 220 }} className="flex-1">
                {isLoading ? (
                    <ActivityIndicator size="large" color={theme.primary} className="mt-10" />
                ) : (
                    <>
                        {activeTab === 'actividad' && (
                            <VirtualTicketCard
                                groupId={id}
                                items={groupItems.map((i: any) => ({
                                    id: i.id,
                                    name: i.description ?? i.name ?? '',
                                    description: i.description ?? i.name ?? '',
                                    amount: i.amount ?? i.precio ?? 0,
                                    assignedTo: i.assignedTo ?? i.asignadoA ?? [],
                                    avatars: i.avatars ?? [],
                                    addedBy: i.addedBy ?? i.autorId ?? '',
                                }))}
                                serviceFee={0}
                                members={groupMembers}
                                onAssign={handleAssignItem}
                            />
                        )}

                        {activeTab === 'miembros' && (
                            <MemberList members={(groupData?.integrantes || []).map((m: any) => ({
                                id: m.id || m,
                                nombre: m.nombre || 'Miembro',
                                avatar: '',
                                isMe: (m.id || m) === user?.id,
                            }))} />
                        )}

                        {activeTab === 'saldos' && (
                            <TotalsSummary
                                subtotal={balances?.total_gastado_en_grupo || 0}
                                tax={0}
                                service={0}
                                tip={0}
                                total={balances?.total_gastado_en_grupo || 0}
                                paidAmount={0}
                                pendingAmount={balances?.total_gastado_en_grupo || 0}
                            />
                        )}
                    </>
                )}
            </ScrollView>

            {/* Footer */}
            <View style={{ backgroundColor: theme.glassBg, borderTopColor: theme.border + '26' }} className="absolute bottom-0 w-full border-t px-6 py-5 pb-8 shadow-2xl">
                <View className="flex-row justify-between items-end mb-5">
                    <View>
                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="mb-1">Total del Grupo</Text>
                        <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-bold">
                            ${(balances?.total_gastado_en_grupo || 0).toFixed(2)}
                        </Text>
                    </View>
                    <View className="items-end">
                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="mb-1">Tu Balance</Text>
                        <Text style={{ color: userOwed < 0 ? '#f43f5e' : '#10B981', fontSize: 24 * fontScale }} className="font-bold">
                            ${Math.abs(userOwed).toFixed(2)}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setIsPaymentVisible(true)} style={{ backgroundColor: '#10B981' }} className="w-full flex-row items-center justify-center py-4 rounded-xl shadow-lg">
                    <Text className="text-white font-bold text-lg mr-2">Dividir Gastos</Text>
                    <MaterialIcons name="check-circle" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Modales */}
            <OcrTicketScanner visible={showOcr} onClose={() => setShowOcr(false)} onConfirm={handleOcrConfirm} theme={theme} />
            <PaymentMethodModal isVisible={isPaymentVisible} onClose={() => setIsPaymentVisible(false)} onSelect={handlePaymentSelect} />
        </SafeAreaView>
    );
}