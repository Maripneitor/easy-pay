import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../../src/infrastructure/context/ThemeContext';
import { useEasyPay } from '../../../context/EasyPayContext';
import { SyncStatus } from '../../../src/components/SyncStatus';
import { SettlementWizard } from '../../../src/components/SettlementWizard';
import { StatusBar } from 'expo-status-bar';
import { PaymentMethodModal } from '../../../components/group/PaymentMethodModal';
import { VirtualTicketCard } from '../../../components/group/VirtualTicketCard';

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

    if (isLoading || !activeGrupo) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    const isLeader = activeGrupo.liderId === user?.id || activeGrupo.admin_id === user?.id;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />
            
            <SyncStatus />

            {/* Cabecera unificada */}
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    className="w-10 h-10 rounded-xl items-center justify-center bg-slate-800/40"
                >
                    <MaterialIcons name="arrow-back-ios" size={20} color={theme.text} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">
                        {activeGrupo.nombre}
                    </Text>
                </View>
                <View className="bg-blue-500/10 px-3 py-2 rounded-xl">
                    <Text style={{ color: theme.primary }} className="text-[10px] font-black tracking-widest">
                        #{activeGrupo.codigo || activeGrupo.codigo_invitacion}
                    </Text>
                </View>
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
            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                {activeTab === 'items' && (
                    <View className="pb-40">
                        {activeGrupo.items?.length > 0 ? (
                            <VirtualTicketCard 
                                items={activeGrupo.items}
                                serviceFee={activeGrupo.propina}
                                groupId={activeGrupo.id}
                                members={activeGrupo.participantes}
                                canEdit={isLeader}
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
                                        {member.nombre?.charAt(0).toUpperCase() || '?'}
                                    </Text>
                                </View>
                                <View className="flex-1">
                                    <Text style={{ color: theme.text }} className="text-base font-black">
                                        {member.nombre || 'Usuario'}
                                    </Text>
                                    <Text style={{ color: theme.textSecondary }} className="text-xs font-bold opacity-60 uppercase">
                                        {member.role === 'leader' ? 'Líder del grupo' : 'Participante'}
                                    </Text>
                                </View>
                                {member.status === 'online' && (
                                    <View className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === 'totals' && (
                    <View className="gap-6 pb-40">
                        <View style={{ backgroundColor: theme.cardSecondary }} className="p-8 rounded-[50px] border border-white/10">
                            <View className="flex-row justify-between mb-4">
                                <Text style={{ color: theme.textSecondary }} className="font-bold">Subtotal</Text>
                                <Text style={{ color: theme.text }} className="font-black">${Number(activeGrupo.subtotal || 0).toFixed(2)}</Text>
                            </View>
                            <View className="flex-row justify-between mb-6">
                                <Text style={{ color: theme.textSecondary }} className="font-bold">Propina sugerida</Text>
                                <Text style={{ color: theme.text }} className="font-black">${Number(activeGrupo.propina || 0).toFixed(2)}</Text>
                            </View>
                            <View className="h-[1px] bg-white/5 w-full mb-6" />
                            <View className="flex-row justify-between items-center">
                                <Text style={{ color: theme.text }} className="text-xl font-black">Total</Text>
                                <Text style={{ color: theme.primary }} className="text-3xl font-black">${Number(activeGrupo.total || 0).toFixed(2)}</Text>
                            </View>
                        </View>
                        
                        {isLeader && (
                            <View className="bg-blue-500/10 p-6 rounded-[32px] border border-blue-500/20">
                                <View className="flex-row items-center gap-3 mb-2">
                                    <MaterialIcons name="info" size={20} color={theme.primary} />
                                    <Text style={{ color: theme.primary }} className="font-black text-xs uppercase tracking-widest">Zona del Administrador</Text>
                                </View>
                                <Text style={{ color: theme.textSecondary }} className="text-xs font-medium leading-4">
                                    Como líder, puedes cerrar el grupo para que todos reciban su cuenta final y métodos de pago.
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Botón de acción final (Solo para líderes) */}
            {isLeader && (activeGrupo.status === 'ACTIVE' || activeGrupo.status === 'active') && (
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
            {!isLeader && (['SETTLING', 'settling'].includes(activeGrupo.status)) && (
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
                    router.push({
                        pathname: '/settle-up',
                        params: { 
                            groupId: activeGrupo.id, 
                            amount: debt.toString(),
                            creditorId: activeGrupo.admin_id || activeGrupo.liderId,
                            method
                        }
                    } as any);
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