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
import { PaymentMethodModal } from '../../../components/group/PaymentMethodModal';
import { SettlementWizard } from '../../../components/group/SettlementWizard';

import OcrTicketScanner from '../../../components/OcrTicketScanner';
import { TicketData } from '../../../src/infrastructure/services/OcrService';
import { groupRepository } from '../../../src/infrastructure/api/repositories/GroupRepository';
import { useAuth } from '../../../context/AuthContext';
import { useGrupo } from '../../../context/GrupoContext';
import { getApiBaseUrl } from '../../../src/infrastructure/api/network.config';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TabType = 'gastos' | 'saldos' | 'integrantes';

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    const { addItem, activeGrupo } = useGrupo();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('gastos');
    
    // API Data State
    const [groupData, setGroupData] = useState<any>(null);
    const [groupItems, setGroupItems] = useState<any[]>([]);
    const [balances, setBalances] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);

    // UI State for Modals
    const [isPaymentVisible, setIsPaymentVisible] = useState(false);
    const [isWizardVisible, setIsWizardVisible] = useState(false);
    const [showOcr, setShowOcr] = useState(false);

    const fetchData = useCallback(async (silent = false) => {
        if (!id) return;
        if (!silent) setIsLoading(true);
        else setIsPolling(true);

        const baseUrl = getApiBaseUrl();
        
        try {
            const [g, items, balancesData] = await Promise.all([
                groupRepository.getGroup(id),
                groupRepository.getItems(id),
                groupRepository.getBalances(id)
            ]);
            setGroupData(g);
            setGroupItems(Array.isArray(items) ? items : []);
            setBalances(balancesData);
        } catch (err) {
            console.error('❌ Error cargando datos del grupo:', err);
        } finally {
            setIsLoading(false);
            setIsPolling(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
        // ⚡ Polling cada 5 segundos para paridad con Web
        const interval = setInterval(() => fetchData(true), 5000);
        return () => clearInterval(interval);
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

            {/* Polling Indicator */}
            {isPolling && (
                <View className="absolute top-0 left-0 w-full h-0.5 bg-[var(--primary)] z-50 opacity-50" style={{ backgroundColor: theme.primary }} />
            )}

            {/* HEADER PROFESIONAL */}
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
                        <View style={{ backgroundColor: groupData?.status === 'ACTIVA' ? '#10B981' : groupData?.status === 'CERRANDO' ? '#F59E0B' : '#64748B' }} className="w-1.5 h-1.5 rounded-full mr-1.5" />
                        <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale, fontFamily: 'Inter' }} className="font-medium opacity-80 uppercase tracking-widest">
                            {groupData?.status === 'ACTIVA' ? 'Grupo Abierto' : groupData?.status || 'Sincronizando...'}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center gap-1">
                    {(groupData?.admin_id === user?.id || groupData?.lider_id === user?.id || groupData?.liderId === user?.id) && (
                        <TouchableOpacity 
                            onPress={async () => {
                                import('react-native').then(({ Alert }) => {
                                    Alert.alert(
                                        'Eliminar Grupo',
                                        '¿Estás seguro de que deseas eliminar esta grupo? Esta acción no se puede deshacer.',
                                        [
                                            { text: 'Cancelar', style: 'cancel' },
                                            { 
                                                text: 'Eliminar', 
                                                style: 'destructive',
                                                onPress: async () => {
                                                    try {
                                                        await groupRepository.deleteGroup(id as string);
                                                        router.back();
                                                    } catch (err) {
                                                        console.error('Error al eliminar grupo:', err);
                                                        Alert.alert('Error', 'No se pudo eliminar el grupo');
                                                    }
                                                }
                                            }
                                        ]
                                    );
                                });
                            }}
                            className="p-2 rounded-full mr-1" 
                            style={{ backgroundColor: theme.cardSecondary }}
                        >
                            <MaterialIcons name="delete-outline" size={24} color="#f43f5e" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                        onPress={() => setShowOcr(true)}
                        className="p-2 rounded-full" 
                        style={{ backgroundColor: theme.cardSecondary, opacity: groupData?.status === 'CERRADA' ? 0.5 : 1 }}
                    >
                        <MaterialIcons name="document-scanner" size={24} color={theme.primary} />
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
                    {(['integrantes', 'gastos', 'saldos'] as const).map(tab => {
                        const isActive = activeTab === tab;
                        const label = tab === 'integrantes' ? 'Integrantes' : tab === 'gastos' ? 'Ítems' : 'Balances';
                        return (
                            <TouchableOpacity 
                                key={tab} 
                                onPress={() => handleTabChange(tab)}
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
                        {activeTab === 'gastos' && (
                            <VirtualTicketCard 
                                groupId={id}
                                items={(groupItems).map((i: any) => ({
                                  id: i.id,
                                  description: i.description,
                                  name: i.description ?? i.name ?? '',
                                  amount: i.amount,
                                  assignedTo: i.assignedTo ?? [],
                                  avatars: i.avatars ?? [],
                                  addedBy: i.addedBy ?? '',
                                }))}
                                serviceFee={0} 
                            />
                        )}

                        {activeTab === 'integrantes' && (
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

                    {(groupData?.admin_id === user?.id || groupData?.lider_id === user?.id || groupData?.liderId === user?.id) ? (
                        <TouchableOpacity 
                            onPress={() => setIsWizardVisible(true)}
                            style={{ backgroundColor: theme.primary }} 
                            className="w-row items-center justify-center py-4 rounded-xl shadow-lg active:scale-[0.98] flex-row"
                        >
                            <Text style={{ fontFamily: 'Manrope', color: 'white' }} className="font-bold text-lg mr-2">Liquidar Grupo</Text>
                            <MaterialIcons name="lock-outline" size={20} color="white" />
                        </TouchableOpacity>
                    ) : (
                        <View 
                            style={{ backgroundColor: theme.cardSecondary }} 
                            className="w-row items-center justify-center py-4 rounded-xl opacity-60"
                        >
                            <Text style={{ fontFamily: 'Manrope', color: theme.textSecondary }} className="font-bold text-lg mr-2">Esperando al Líder...</Text>
                            <ActivityIndicator size="small" color={theme.textSecondary} />
                        </View>
                    )}
                </View>
            </View>

            {/* MODALES PREMIUM */}


            <OcrTicketScanner
                visible={showOcr}
                onClose={() => setShowOcr(false)}
                onConfirm={async (data: TicketData) => {
                    setShowOcr(false);
                    for (const item of data.items) {
                        for (let i = 0; i < item.quantity; i++) {
                            console.log('Agregando item:', item.name, item.price);
                            setGroupItems(prev => [...prev, { name: item.name, id: Date.now().toString() + Math.random().toString(36).slice(2), description: item.name, amount: item.price, assignedTo: [], avatars: [], addedBy: user?.id ?? '' }]);
                            await addItem({
                                description: item.name,
                                amount: item.price,
                                assignedTo: [],
                                addedBy: user?.id ?? 'unknown',
                            });
                        }
                    }
                }}
                theme={theme}
            />
            <SettlementWizard 
                isVisible={isWizardVisible}
                onClose={() => setIsWizardVisible(false)}
                groupData={groupData}
                balances={balances}
                items={groupItems}
                onComplete={(data) => {
                    console.log('Grupo liquidado:', data);
                    // Actualizar estado local si es necesario
                    fetchData(true);
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
