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

// Modular Components
import { VirtualTicketCard } from '../../../components/group/VirtualTicketCard';
import { MemberList } from '../../../components/group/MemberList';
import { TotalsSummary } from '../../../components/group/TotalsSummary';
import { AddExpenseModal } from '../../../components/group/AddExpenseModal';
import { PaymentMethodModal } from '../../../components/group/PaymentMethodModal';

import { groupRepository } from '../../../src/infrastructure/api/repositories/GroupRepository';
import { useAuth } from '../../../context/AuthContext';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TabType = 'actividad' | 'saldos' | 'miembros';

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('miembros');
    
    // API Data State
    const [groupData, setGroupData] = useState<any>(null);
    const [groupItems, setGroupItems] = useState<any[]>([]);
    const [balances, setBalances] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // UI State for Modals
    const [isAddExpenseVisible, setIsAddExpenseVisible] = useState(false);
    const [isPaymentVisible, setIsPaymentVisible] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const [g, items, b] = await Promise.all([
                groupRepository.getGroup(id),
                fetch(`http://192.168.1.12:8000/api/groups/${id}/items`).then(r => r.json()),
                fetch(`http://192.168.1.12:8000/api/groups/${id}/balances`).then(r => r.json())
            ]);
            setGroupData(g);
            setGroupItems(Array.isArray(items) ? items : []);
            setBalances(b);
        } catch (err) {
            // Silently fail
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const userOwed = balances?.balance_detallado?.find((b: any) => b.usuario_id === user?.id)?.balance || 0;
    const canSettle = userOwed > 0;

    const handleTabChange = (tab: TabType) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveTab(tab);
    };

    const handlePaymentSelect = (method: 'cash' | 'card') => {
        setIsPaymentVisible(false);
        router.push({ pathname: '/settle-up', params: { method, amount: userOwed } } as any);
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER PROFESIONAL (OCR Removed) */}
            <View className="px-6 py-4 flex-row items-center justify-between z-20" style={{ backgroundColor: theme.bg }}>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    className="p-2 rounded-full" 
                    style={{ backgroundColor: theme.cardSecondary }}
                >
                    <Ionicons name="arrow-back" size={20} color={theme.text} />
                </TouchableOpacity>
                
                <View className="items-center">
                    <Text style={{ color: theme.text, fontSize: 20 * fontScale, fontFamily: 'Manrope' }} className="font-bold">{groupData?.nombre || 'Grupo'}</Text>
                    <View className="flex-row items-center mt-0.5">
                        <View className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />
                        <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale, fontFamily: 'Inter' }} className="font-medium opacity-80">
                            {isLoading ? 'Sincronizando...' : 'Conectado'}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center gap-1">
                    <TouchableOpacity 
                        onPress={() => setIsAddExpenseVisible(true)}
                        className="p-2 rounded-full" 
                        style={{ backgroundColor: theme.cardSecondary }}
                    >
                        <MaterialIcons name="add" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ backgroundColor: theme.cardSecondary, height: 1 }} className="w-full" />

            {/* NAVEGACIÓN POR TABS */}
            <View className="px-6 mb-8 mt-6">
                <View 
                    style={{ backgroundColor: theme.cardSecondary }} 
                    className="p-1 rounded-xl flex-row w-full"
                >
                    {(['miembros', 'actividad', 'totales'] as const).map(tab => {
                        const currentTab = tab === 'totales' ? 'saldos' : tab;
                        const isActive = activeTab === currentTab;
                        const label = tab === 'miembros' ? 'Miembros' : tab === 'actividad' ? 'Ítems' : 'Totales';
                        return (
                            <TouchableOpacity 
                                key={tab} 
                                onPress={() => handleTabChange(currentTab as TabType)}
                                style={{ 
                                    backgroundColor: isActive ? theme.card : 'transparent',
                                }}
                                className={`flex-1 py-2 px-4 rounded-lg items-center justify-center ${isActive ? 'shadow-xs' : ''}`}
                            >
                                <Text style={{ 
                                    color: isActive ? theme.primary : theme.textSecondary, 
                                    fontWeight: isActive ? 'bold' : '500',
                                    fontSize: 13 * fontScale,
                                    fontFamily: 'Inter'
                                }}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* CONTENIDO PRINCIPAL */}
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 220 }}
                className="flex-1"
            >
                {isLoading ? (
                    <ActivityIndicator size="large" color={theme.primary} className="mt-10" />
                ) : (
                    <>
                        {activeTab === 'actividad' && (
                            <VirtualTicketCard 
                                items={groupItems.map((i: any) => ({
                                    id: i.id,
                                    name: i.nombre,
                                    detail: i.comprador_id === user?.id ? 'Pagado por ti' : 'Gasto grupal',
                                    amount: i.monto || i.precio,
                                    avatars: []
                                }))} 
                                serviceFee={0} 
                            />
                        )}

                        {activeTab === 'miembros' && (
                            <MemberList members={(groupData?.integrantes || []).map((m: any) => ({
                                id: m.id || m,
                                nombre: m.nombre || 'Miembro',
                                avatar: '',
                                isMe: (m.id || m) === user?.id
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

            {/* FIXED FOOTER */}
            <View 
                style={{ 
                    backgroundColor: theme.glassBg,
                    borderTopColor: theme.border + '26'
                }} 
                className="absolute bottom-0 w-full border-t px-6 py-5 pb-8 shadow-2xl"
            >
                <View className="max-w-4xl mx-auto">
                    <View className="flex-row justify-between items-end mb-5">
                        <View>
                            <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale, fontFamily: 'Inter' }} className="mb-1">Total del Grupo</Text>
                            <Text style={{ color: theme.text, fontSize: 24 * fontScale, fontFamily: 'Manrope' }} className="font-bold">
                                ${ (balances?.total_gastado_en_grupo || 0).toFixed(2) }
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale, fontFamily: 'Inter' }} className="mb-1">Tu Balance</Text>
                            <Text style={{ color: userOwed < 0 ? '#f43f5e' : '#10B981', fontSize: 24 * fontScale, fontFamily: 'Manrope' }} className="font-bold">
                                ${ Math.abs(userOwed).toFixed(2) }
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity 
                        onPress={() => setIsPaymentVisible(true)}
                        style={{ backgroundColor: '#10B981' }} 
                        className="w-row items-center justify-center py-4 rounded-xl shadow-lg active:scale-[0.98]"
                    >
                        <Text style={{ fontFamily: 'Manrope' }} className="text-white font-bold text-lg mr-2">Dividir Gastos</Text>
                        <MaterialIcons name="check-circle" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* MODALES PREMIUM */}
            <AddExpenseModal 
                isVisible={isAddExpenseVisible}
                onClose={() => setIsAddExpenseVisible(false)}
                groupId={id || ''}
                members={(groupData?.integrantes || []).map((m: any) => ({
                    id: m.id || m,
                    nombre: m.nombre || 'Miembro'
                }))}
                onSuccess={() => {
                    fetchData();
                }}
            />


            <PaymentMethodModal 
                isVisible={isPaymentVisible}
                onClose={() => setIsPaymentVisible(false)}
                onSelect={handlePaymentSelect}
            />
        </SafeAreaView>
    );
}
