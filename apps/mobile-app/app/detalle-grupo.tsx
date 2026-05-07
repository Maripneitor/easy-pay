import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useEasyPay } from '../context/EasyPayContext';
import { SyncStatus } from '../src/components/SyncStatus';
import { SettlementWizard } from '../src/components/SettlementWizard';
import { StatusBar } from 'expo-status-bar';
import { Alert, Clipboard } from 'react-native';
import { groupRepository } from '../src/infrastructure/api/repositories/GroupRepository';
import { PaymentMethodModal } from '../components/group/PaymentMethodModal';
import { VirtualTicketCard } from '../components/group/VirtualTicketCard';
import { TotalsSummary } from '../components/group/TotalsSummary';
import { ClosedGroupSummary } from '../components/group/ClosedGroupSummary';

const { width } = Dimensions.get('window');

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { theme, fontScale } = useTheme();
    const { 
        user, 
        activeGrupo, 
        isLoading, 
        loadGroupDetails, 
        calculateUserDebt,
        assignItem,
        updateItem
    } = useEasyPay();

    useFocusEffect(
        useCallback(() => {
            if (id) {
                loadGroupDetails(id as string);
            }
        }, [id])
    );

    const [activeTab, setActiveTab] = useState<'members' | 'items' | 'totals'>('items');
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const isSettling = activeGrupo?.status === 'settling';

    // Polling cuando el grupo está en liquidación
    useEffect(() => {
        if (isSettling && id) {
            console.log('[Polling] Iniciando polling para grupo en liquidación');
            intervalRef.current = setInterval(() => {
                console.log('[Polling] Refrescando grupo...');
                loadGroupDetails(id as string);
            }, 20000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isSettling, id]);

    const onRefresh = useCallback(async () => {
        if (id) {
            setIsRefreshing(true);
            await loadGroupDetails(id as string);
            setIsRefreshing(false);
        }
    }, [id, loadGroupDetails]);

    // Ejecuta la navegación cuando la variable cambie (fuera del ciclo de render del Modal)
    useEffect(() => {
        if (pendingNavigation) {
            setIsPaymentModalVisible(false);
            const timer = setTimeout(() => {
                router.push(pendingNavigation as any);
                setPendingNavigation(null);
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [pendingNavigation]);

    const handleRemoveMember = async (memberId: string, memberName: string) => {
        Alert.alert(
            "Eliminar Miembro",
            `¿Estás seguro de que deseas eliminar a ${memberName} del grupo?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await groupRepository.removeMember(id as string, memberId);
                            Alert.alert("Éxito", "Miembro eliminado correctamente");
                            loadGroupDetails(id as string);
                        } catch (err: any) {
                            Alert.alert("Error", err.response?.data?.detail || "No se pudo eliminar al miembro. Verifica si tiene gastos asignados.");
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (!activeGrupo) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
                <View className="flex-1 items-center justify-center px-6">
                    <MaterialIcons name="error-outline" size={60} color={theme.textSecondary} />
                    <Text style={{ color: theme.text, fontSize: 18 }} className="font-black mt-4">Grupo no encontrado</Text>
                    <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} className="mt-6 bg-slate-800 px-6 py-3 rounded-xl">
                        <Text className="text-white font-bold">Volver</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const isLeader = activeGrupo.liderId === user?.id || activeGrupo.admin_id === user?.id;
    const isClosed = activeGrupo.status === 'closed' || activeGrupo.status === 'liquidated';

    if (isClosed) {
        return <ClosedGroupSummary group={activeGrupo} onBack={() => router.back()} />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            
            <SyncStatus />

            {/* Cabecera unificada */}
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity 
                    onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} 
                    className="w-10 h-10 rounded-xl items-center justify-center bg-slate-800/40"
                >
                    <MaterialIcons name="arrow-back-ios" size={20} color={theme.text} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">
                        {activeGrupo.nombre}
                    </Text>
                </View>
                <TouchableOpacity 
                    onPress={() => {
                        const code = activeGrupo.codigo || activeGrupo.codigo_invitacion;
                        Clipboard.setString(code);
                        Alert.alert("Copiado", "Código de invitación copiado al portapapeles");
                    }}
                    className="bg-blue-500/10 px-3 py-2 rounded-xl"
                >
                    <Text style={{ color: theme.primary }} className="text-[10px] font-black tracking-widest">
                        #{activeGrupo.codigo || activeGrupo.codigo_invitacion}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Tarjetas de Resumen */}
            <View className="px-6 mb-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    <View style={{ backgroundColor: theme.cardSecondary, width: 140 }} className="p-5 rounded-[28px] border border-white/5 mr-3">
                        <Text style={{ color: theme.textSecondary }} className="text-[8px] font-black uppercase tracking-widest mb-1">Total Gastado</Text>
                        <Text style={{ color: theme.text }} className="text-lg font-black font-mono">${activeGrupo.total?.toFixed(2) || '0.00'}</Text>
                    </View>
                    
                    <View style={{ backgroundColor: theme.cardSecondary, width: 140 }} className="p-5 rounded-[28px] border border-white/5 mr-3">
                        <Text style={{ color: theme.textSecondary }} className="text-[8px] font-black uppercase tracking-widest mb-1">Tu Parte</Text>
                        <Text style={{ color: theme.primary }} className="text-lg font-black font-mono">${(calculateUserDebt(user?.id || '') || 0).toFixed(2)}</Text>
                    </View>

                    <View style={{ backgroundColor: theme.cardSecondary, width: 140 }} className="p-5 rounded-[28px] border border-white/5 mr-3">
                        <Text style={{ color: theme.textSecondary }} className="text-[8px] font-black uppercase tracking-widest mb-1">
                            {calculateUserDebt(user?.id || '') > 0 ? 'Debes' : 'Te deben'}
                        </Text>
                        <Text style={{ color: calculateUserDebt(user?.id || '') > 0 ? '#ef4444' : '#10b981' }} className="text-lg font-black font-mono">
                            ${Math.abs(calculateUserDebt(user?.id || '') || 0).toFixed(2)}
                        </Text>
                    </View>
                </ScrollView>
            </View>

            {/* Selector de Pestañas */}
            <View className="px-6 py-4">
                <View className="flex-row bg-slate-900/50 p-1 rounded-2xl border border-white/5">
                    {(['members', 'items', 'totals'] as const).map(tab => (
                        <TouchableOpacity 
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-3 items-center rounded-xl ${activeTab === tab ? 'bg-slate-800 shadow-sm' : ''}`}
                        >
                            <Text style={{ 
                                color: activeTab === tab ? theme.text : theme.textSecondary, 
                                fontSize: 10 * fontScale 
                            }} className="font-black uppercase tracking-widest">
                                {tab === 'members' ? 'Miembros' : tab === 'items' ? 'Ítems' : 'Totales'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Cuerpo Principal */}
            <ScrollView 
                className="px-6" 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={isRefreshing} 
                        onRefresh={onRefresh} 
                        tintColor={theme.primary} 
                    />
                }
            >
                {activeTab === 'items' && (
                    <View className="pb-40">
                        {activeGrupo.items?.length > 0 ? (
                            <VirtualTicketCard 
                                items={activeGrupo.items}
                                serviceFee={activeGrupo.service || 0}
                                groupId={activeGrupo.id}
                                members={activeGrupo.participantes}
                                canEdit={isLeader && activeGrupo.status === 'active'}
                                onAssign={async (itemId, participantIds) => {
                                    await assignItem(itemId, participantIds);
                                }}
                                onEdit={async (itemId, data) => {
                                    await updateItem(itemId, data);
                                }}
                            />
                        ) : (
                            <View className="items-center py-20 opacity-40">
                                <FontAwesome5 name="receipt" size={60} color={theme.textSecondary} />
                                <Text style={{ color: theme.textSecondary }} className="mt-4 font-black uppercase tracking-widest">No hay ítems aún</Text>
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'members' && (
                    <View className="gap-4 pb-40">
                        {activeGrupo.participantes?.map((member: any) => (
                            <View 
                                key={member.id} 
                                style={{ backgroundColor: theme.cardSecondary }} 
                                className="p-5 rounded-[40px] border border-white/10 flex-row items-center gap-4"
                            >
                                <View 
                                    style={{ backgroundColor: member.color || theme.primary }} 
                                    className="w-12 h-12 rounded-2xl items-center justify-center"
                                >
                                    <Text className="text-white font-black text-lg">
                                        {member.nombre?.charAt(0)?.toUpperCase() || '?'}
                                    </Text>
                                </View>
                                <View className="flex-1">
                                    <Text style={{ color: theme.text }} className="text-base font-black">
                                        {member.nombre || 'Usuario'}
                                    </Text>
                                    <View className="flex-row items-center gap-2">
                                        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold opacity-60 uppercase">
                                            {member.role === 'leader' ? 'Líder' : 'Miembro'}
                                        </Text>
                                        <View className="w-1 h-1 rounded-full bg-slate-700" />
                                        <Text style={{ color: theme.primary }} className="text-[10px] font-black font-mono">
                                            Debe ${member.debt?.toFixed(2) || '0.00'}
                                        </Text>
                                    </View>
                                </View>
                                {member.status === 'online' && (
                                    <View className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                                )}
                                {isLeader && member.id !== user?.id && (
                                    <TouchableOpacity 
                                        onPress={() => handleRemoveMember(member.id, member.nombre)}
                                        className="p-3 bg-red-500/10 rounded-2xl"
                                    >
                                        <MaterialIcons name="person-remove" size={18} color="#ef4444" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === 'totals' && activeGrupo && (
                    <View className="pb-40">
                        <TotalsSummary 
                            subtotal={activeGrupo.subtotal || 0}
                            tax={activeGrupo.tax || 0}
                            service={activeGrupo.service || 0}
                            tip={activeGrupo.propina || 0}
                            total={activeGrupo.total || 0}
                            paidAmount={(activeGrupo.participantes || []).reduce((acc, p) => {
                                // En esta versión, consideramos "pagado" si el backend nos dice que pagó.
                                // Como no tenemos ese flag aún, mostramos 0 pagado vs total pendiente.
                                return acc + (p.paid ? p.debt : 0);
                            }, 0)}
                            pendingAmount={(activeGrupo.participantes || []).reduce((acc, p) => acc + (p.debt || 0), 0)}
                        />
                        
                        {isLeader && (
                            <View className="px-6">
                                <View className="bg-blue-500/10 p-6 rounded-[32px] border border-blue-500/20">
                                    <View className="flex-row items-center gap-3 mb-2">
                                        <MaterialIcons name="info" size={20} color={theme.primary} />
                                        <Text style={{ color: theme.primary }} className="font-black text-xs uppercase tracking-widest">Zona del Administrador</Text>
                                    </View>
                                    <Text style={{ color: theme.textSecondary }} className="text-xs font-medium leading-4">
                                        Como líder, puedes cerrar el grupo para que todos reciban su cuenta final y métodos de pago.
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Botón de acción final (Solo para líderes) */}
            {isLeader && activeGrupo.status === 'active' && (
                <View className="absolute bottom-10 left-6 right-6">
                    <TouchableOpacity 
                        onPress={() => setIsWizardOpen(true)} 
                        activeOpacity={0.8}
                        style={{ backgroundColor: theme.primary, shadowColor: theme.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }} 
                        className="w-full py-6 rounded-[32px] items-center justify-center flex-row gap-3"
                    >
                        <MaterialIcons name="lock" size={20} color="black" />
                        <Text className="text-black font-black uppercase tracking-widest text-base">Cerrar y Dividir</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Botón de Liquidación (Para Miembros) */}
            {!isLeader && activeGrupo.status === 'settling' && (
                <View className="absolute bottom-10 left-6 right-6">
                    <TouchableOpacity 
                        onPress={() => setIsPaymentModalVisible(true)} 
                        activeOpacity={0.8}
                        style={{ backgroundColor: theme.primary, shadowColor: theme.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }} 
                        className="w-full py-6 rounded-[32px] items-center justify-center flex-row gap-3"
                    >
                        <MaterialIcons name="payments" size={20} color="black" />
                        <Text className="text-black font-black uppercase tracking-widest text-base">Liquidar Deuda (${(calculateUserDebt(user?.id || '') || 0).toFixed(2)})</Text>
                    </TouchableOpacity>
                </View>
            )}

            <PaymentMethodModal 
                isVisible={isPaymentModalVisible}
                onClose={() => setIsPaymentModalVisible(false)}
                onSelect={(method) => {
                    setIsPaymentModalVisible(false);
                    const debt = calculateUserDebt(user?.id || '');
                    setPendingNavigation(`/settle-up?groupId=${activeGrupo.id}&amount=${debt}&creditorId=${activeGrupo.admin_id || activeGrupo.liderId}&method=${method}`);
                }}
            />

            <SettlementWizard 
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                groupId={activeGrupo.id}
                items={activeGrupo.items}
                members={activeGrupo.participantes}
                onComplete={() => {
                    loadGroupDetails(activeGrupo.id);
                }}
            />
        </SafeAreaView>
    );
}
