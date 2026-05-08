import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Alert, Clipboard, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '../../../src/infrastructure/context/ThemeContext';
import { useEasyPay } from '../../../context/EasyPayContext';
import { SyncStatus } from '../../../src/components/SyncStatus';
import { SettlementWizard } from '../../../src/components/SettlementWizard';
import { groupRepository } from '../../../src/infrastructure/api/repositories/GroupRepository';
import { PaymentMethodModal } from '../../../components/group/PaymentMethodModal';
import { VirtualTicketCard } from '../../../components/group/VirtualTicketCard';
import { TotalsSummary } from '../../../components/group/TotalsSummary';
import { ClosedGroupSummary } from '../../../components/group/ClosedGroupSummary';

const { width } = Dimensions.get('window');

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { theme, fontScale } = useTheme();
    
    // Lógica unificada directamente desde EasyPayContext
    const { 
        user, 
        activeGrupo, 
        isLoading, 
        loadGroupDetails, 
        calculateUserDebt,
        assignItem,
        updateItem
    } = useEasyPay();

    const [activeTab, setActiveTab] = useState<'items' | 'members' | 'totals'>('items');
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const isSettling = activeGrupo?.status === 'settling';

    useFocusEffect(
        useCallback(() => {
            if (id) loadGroupDetails(id as string);
        }, [id])
    );

    // Polling cuando el grupo está en liquidación
    useEffect(() => {
        if (isSettling && id) {
            intervalRef.current = setInterval(() => {
                loadGroupDetails(id as string);
            }, 20000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isSettling, id]);

    const onRefresh = useCallback(async () => {
        if (id) {
            setIsRefreshing(true);
            await loadGroupDetails(id as string);
            setIsRefreshing(false);
        }
    }, [id, loadGroupDetails]);

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
                            loadGroupDetails(id as string);
                        } catch (err: any) {
                            Alert.alert("Error", err.response?.data?.detail || "No se pudo eliminar al miembro.");
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.bg }} className="justify-center items-center">
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (!activeGrupo) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
                <MotiView 
                    from={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex-1 items-center justify-center px-6"
                >
                    <MaterialIcons name="error-outline" size={60} color={theme.textSecondary} />
                    <Text style={{ color: theme.text }} className="text-lg font-black mt-4">Grupo no encontrado</Text>
                    <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} className="mt-6 bg-slate-800 px-6 py-3 rounded-xl">
                        <Text className="text-white font-bold">Volver</Text>
                    </TouchableOpacity>
                </MotiView>
            </SafeAreaView>
        );
    }

    const isLeader = activeGrupo.liderId === user?.id || activeGrupo.admin_id === user?.id;
    const isClosed = activeGrupo.status === 'closed' || activeGrupo.status === 'liquidated';

    if (isClosed) {
        return <ClosedGroupSummary group={activeGrupo} onBack={() => router.back()} />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            
            {/* Cabecera Flotante con Glassmorphism */}
            <View className="absolute top-0 w-full z-50">
                <BlurView intensity={theme.isDark ? 40 : 80} tint={theme.isDark ? "dark" : "light"} className="pt-14 pb-4 px-6 flex-row items-center justify-between border-b border-white/5">
                    <TouchableOpacity 
                        onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} 
                        className="w-10 h-10 rounded-xl items-center justify-center bg-slate-800/40"
                    >
                        <MaterialIcons name="arrow-back-ios" size={18} color={theme.text} style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                    <View className="items-center flex-1 mx-4">
                        <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black" numberOfLines={1}>
                            {activeGrupo.nombre}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => {
                            Clipboard.setString(activeGrupo.codigo || activeGrupo.codigo_invitacion);
                            Alert.alert("Copiado", "Código de invitación copiado al portapapeles");
                        }}
                        className="bg-blue-500/15 px-3 py-2 rounded-xl border border-blue-500/20"
                    >
                        <Text style={{ color: theme.primary }} className="text-xs font-black tracking-widest">
                            #{activeGrupo.codigo || activeGrupo.codigo_invitacion}
                        </Text>
                    </TouchableOpacity>
                </BlurView>
            </View>

            <ScrollView 
                contentContainerStyle={{ paddingTop: 120, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
            >
                <View className="mb-2">
                    <SyncStatus />
                </View>

                {/* Tarjetas de Resumen Financiero */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-6 flex-row" contentContainerStyle={{ paddingRight: 40 }}>
                    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
                        <View style={{ backgroundColor: theme.cardSecondary, width: 140 }} className="p-5 rounded-[28px] border border-white/5 mr-3 shadow-sm">
                            <Text style={{ color: theme.textSecondary }} className="text-[9px] font-black uppercase tracking-widest mb-1">Total Gastado</Text>
                            <Text style={{ color: theme.text }} className="text-xl font-black font-mono">${activeGrupo.total?.toFixed(2) || '0.00'}</Text>
                        </View>
                    </MotiView>
                    
                    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
                        <View style={{ backgroundColor: theme.cardSecondary, width: 140 }} className="p-5 rounded-[28px] border border-white/5 mr-3 shadow-sm">
                            <Text style={{ color: theme.textSecondary }} className="text-[9px] font-black uppercase tracking-widest mb-1">Tu Parte</Text>
                            <Text style={{ color: theme.primary }} className="text-xl font-black font-mono">${(calculateUserDebt(user?.id || '') || 0).toFixed(2)}</Text>
                        </View>
                    </MotiView>
 
                    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
                        <View style={{ backgroundColor: theme.cardSecondary, width: 140 }} className="p-5 rounded-[28px] border border-white/5 mr-3 shadow-sm">
                            <Text style={{ color: theme.textSecondary }} className="text-[9px] font-black uppercase tracking-widest mb-1">
                                {calculateUserDebt(user?.id || '') > 0 ? 'Debes' : 'Te deben'}
                            </Text>
                            <Text style={{ color: calculateUserDebt(user?.id || '') > 0 ? '#ef4444' : '#10b981' }} className="text-xl font-black font-mono">
                                ${Math.abs(calculateUserDebt(user?.id || '') || 0).toFixed(2)}
                            </Text>
                        </View>
                    </MotiView>
                </ScrollView>

                {/* Selector de Pestañas Animado */}
                <View className="px-6 mb-6">
                    <View className="flex-row bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                        {(['items', 'members', 'totals'] as const).map((tab) => (
                            <TouchableOpacity 
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className="flex-1 py-3 items-center rounded-xl relative"
                            >
                                {activeTab === tab && (
                                    <MotiView
                                        layout
                                        transition={{ type: 'spring', bounce: 0.2 }}
                                        className="absolute inset-0 bg-slate-800 rounded-xl shadow-sm border border-white/10"
                                    />
                                )}
                                <Text style={{ 
                                    color: activeTab === tab ? theme.text : theme.textSecondary, 
                                    fontSize: 11 * fontScale 
                                }} className="font-black uppercase tracking-widest z-10">
                                    {tab === 'items' ? 'Ítems' : tab === 'members' ? 'Miembros' : 'Totales'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Vistas de Pestañas */}
                <View className="px-6">
                    {activeTab === 'items' && (
                        <MotiView from={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                            {activeGrupo.items?.length > 0 ? (
                                <VirtualTicketCard 
                                    items={activeGrupo.items}
                                    serviceFee={activeGrupo.service || 0}
                                    groupId={activeGrupo.id}
                                    members={activeGrupo.participantes}
                                    canEdit={isLeader && activeGrupo.status === 'active'}
                                    onAssign={assignItem}
                                    onEdit={updateItem}
                                />
                            ) : (
                                <View className="items-center py-20 opacity-50">
                                    <FontAwesome5 name="receipt" size={50} color={theme.textSecondary} />
                                    <Text style={{ color: theme.textSecondary }} className="mt-4 font-black uppercase tracking-widest text-xs">No hay gastos registrados</Text>
                                </View>
                            )}
                        </MotiView>
                    )}

                    {activeTab === 'members' && (
                        <MotiView from={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="gap-4">
                            {activeGrupo.participantes?.map((member: any) => (
                                <View 
                                    key={member.id} 
                                    style={{ backgroundColor: theme.cardSecondary }} 
                                    className="p-4 rounded-[32px] border border-white/5 flex-row items-center gap-4"
                                >
                                    <View 
                                        style={{ backgroundColor: member.color || theme.primary }} 
                                        className="w-12 h-12 rounded-[20px] items-center justify-center shadow-sm"
                                    >
                                        <Text className="text-white font-black text-lg">
                                            {member.nombre?.charAt(0)?.toUpperCase() || '?'}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text style={{ color: theme.text }} className="text-base font-black">
                                            {member.nombre || 'Usuario'}
                                        </Text>
                                        <View className="flex-row items-center gap-2 mt-0.5">
                                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold opacity-70 uppercase tracking-wider">
                                                {member.role === 'leader' ? 'Líder' : 'Miembro'}
                                            </Text>
                                            <View className="w-1 h-1 rounded-full bg-slate-600" />
                                            <Text style={{ color: theme.primary }} className="text-[11px] font-black font-mono">
                                                Debe ${member.debt?.toFixed(2) || '0.00'}
                                            </Text>
                                        </View>
                                    </View>
                                    {isLeader && member.id !== user?.id && (
                                        <TouchableOpacity 
                                            onPress={() => handleRemoveMember(member.id, member.nombre)}
                                            className="p-3 bg-red-500/10 rounded-xl"
                                        >
                                            <MaterialIcons name="person-remove" size={18} color="#ef4444" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </MotiView>
                    )}

                    {activeTab === 'totals' && (
                        <MotiView from={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                            <TotalsSummary 
                                subtotal={activeGrupo.subtotal || 0}
                                tax={activeGrupo.tax || 0}
                                service={activeGrupo.service || 0}
                                tip={activeGrupo.propina || 0}
                                total={activeGrupo.total || 0}
                                paidAmount={0} // Actualizar cuando el backend retorne flags de pago
                                pendingAmount={(activeGrupo.participantes || []).reduce((acc, p) => acc + (p.debt || 0), 0)}
                            />
                            
                            {isLeader && (
                                <View className="mt-6 bg-blue-500/10 p-5 rounded-[28px] border border-blue-500/20">
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <MaterialIcons name="shield" size={18} color={theme.primary} />
                                        <Text style={{ color: theme.primary }} className="font-black text-[10px] uppercase tracking-widest">Controles de Administrador</Text>
                                    </View>
                                    <Text style={{ color: theme.textSecondary }} className="text-xs font-medium leading-5">
                                        Como creador del grupo, eres el único con permisos para cerrar la cuenta y solicitar los pagos a los miembros.
                                    </Text>
                                </View>
                            )}
                        </MotiView>
                    )}
                </View>
            </ScrollView>

            {/* Acciones Flotantes Inferiores */}
            <View className="absolute bottom-0 w-full pt-4 pb-8 px-6 bg-slate-950/80">
                <BlurView intensity={20} tint="dark" className="absolute inset-0" />
                
                {isLeader && activeGrupo.status === 'active' && (
                    <TouchableOpacity 
                        onPress={() => setIsWizardOpen(true)} 
                        activeOpacity={0.9}
                        style={{ backgroundColor: theme.primary, shadowColor: theme.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 }} 
                        className="w-full py-5 rounded-[28px] items-center justify-center flex-row gap-3"
                    >
                        <MaterialIcons name="lock" size={20} color="#0f172a" />
                        <Text className="text-slate-900 font-black uppercase tracking-widest text-sm">Cerrar Grupo y Dividir</Text>
                    </TouchableOpacity>
                )}

                {!isLeader && activeGrupo.status === 'settling' && (
                    <TouchableOpacity 
                        onPress={() => setIsPaymentModalVisible(true)} 
                        activeOpacity={0.9}
                        style={{ backgroundColor: theme.primary, shadowColor: theme.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 }} 
                        className="w-full py-5 rounded-[28px] items-center justify-center flex-row gap-3"
                    >
                        <MaterialIcons name="payments" size={20} color="#0f172a" />
                        <Text className="text-slate-900 font-black uppercase tracking-widest text-sm">
                            Liquidar Deuda (${(calculateUserDebt(user?.id || '') || 0).toFixed(2)})
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Modales */}
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
                onComplete={() => loadGroupDetails(activeGrupo.id)}
            />
        </View>
    );
}
