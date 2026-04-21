import React, { useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    LayoutAnimation,
    Platform,
    UIManager
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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Datos de Prueba (Mock Data)
const MOCK_MEMBERS = [
    { id: 'me', nombre: 'Tú', avatar: '', isMe: true, paid: 45.00, due: 12.50, progress: 78, progressColor: '#38bdf8', paidText: 'PAGADO $45.00', pendingText: 'Restan $12.50' },
    { id: 'm1', nombre: 'Carlos R.', avatar: 'https://i.pravatar.cc/150?u=carlos', isMe: false, paid: 0.00, due: 32.00, progress: 0, progressColor: '#F59E0B', paidText: 'PENDIENTE $32.00', paidTextClass: 'text-amber-600', paidBgClass: 'bg-amber-500/20', pendingText: 'Sin aportes aún' },
    { id: 'm2', nombre: 'Marta L.', avatar: 'https://i.pravatar.cc/150?u=marta', isMe: false, paid: 22.50, due: 0.00, progress: 100, progressColor: '#10B981', paidText: 'TOTALMENTE PAGADO', paidTextClass: 'text-emerald-600', paidBgClass: 'bg-emerald-500/20', pendingText: 'Cuota completada' },
];

const MOCK_ITEMS = [
    { id: 'i1', name: 'Pizza Margherita', detail: '1x Unidad', amount: 12.50, avatars: ['https://i.pravatar.cc/150?u=marta', 'https://i.pravatar.cc/150?u=carlos'] },
    { id: 'i2', name: 'Hamburguesa Especial', detail: '2x Unidades ($7.50 c/u)', amount: 15.00, avatars: ['https://i.pravatar.cc/150?u=carlos'] },
    { id: 'i3', name: 'Cervezas Artesanales', detail: '4x Unidades ($4.50 c/u)', amount: 18.00, avatars: ['https://i.pravatar.cc/150?u=marta', 'https://i.pravatar.cc/150?u=carlos', 'https://i.pravatar.cc/150?u=ana'] },
];

type TabType = 'actividad' | 'saldos' | 'miembros';

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme, fontScale } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('actividad');
    
    // UI State for Modals
    const [isAddExpenseVisible, setIsAddExpenseVisible] = useState(false);
    const [isPaymentVisible, setIsPaymentVisible] = useState(false);

    // Mock Business Logic (Aligning with Web)
    const userOwed = 12.50; // > 0 means user owes money
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
            <View className="px-6 py-4 flex-row items-center justify-between z-20">
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    className="p-2.5 rounded-2xl shadow-sm" 
                    style={{ backgroundColor: theme.cardSecondary }}
                >
                    <Ionicons name="chevron-back" size={22} color={theme.primary} />
                </TouchableOpacity>
                
                <View className="items-center">
                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight">Cena con Amigos</Text>
                    <View className="flex-row items-center mt-0.5">
                        <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-sm" />
                        <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="uppercase font-black tracking-[0.2em] opacity-60">Sincronizado</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    className="p-2.5 rounded-2xl shadow-sm" 
                    style={{ backgroundColor: theme.cardSecondary }}
                >
                    <MaterialIcons name="settings" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* NAVEGACIÓN POR TABS (MODERNO - ALINEADO CON WEB) */}
            <View className="px-6 mb-4 mt-2">
                <View 
                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border + '20' }} 
                    className="p-1.5 rounded-[1.25rem] flex-row w-full border"
                >
                    {(['actividad', 'saldos', 'miembros'] as const).map(tab => {
                        const isActive = activeTab === tab;
                        return (
                            <TouchableOpacity 
                                key={tab} 
                                onPress={() => handleTabChange(tab)}
                                style={{ 
                                    backgroundColor: isActive ? theme.card : 'transparent',
                                    shadowColor: isActive ? '#000' : 'transparent',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: isActive ? 0.1 : 0,
                                    shadowRadius: 4,
                                    elevation: isActive ? 2 : 0
                                }}
                                className={`flex-1 py-3 px-2 rounded-2xl items-center justify-center`}
                            >
                                <Text style={{ 
                                    color: isActive ? theme.primary : theme.textSecondary, 
                                    fontWeight: isActive ? '900' : '700',
                                    fontSize: 12 * fontScale
                                }} className="uppercase tracking-widest">
                                    {tab}
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
                {activeTab === 'actividad' && (
                    <VirtualTicketCard items={MOCK_ITEMS} serviceFee={8.50} />
                )}

                {activeTab === 'miembros' && (
                    <MemberList members={MOCK_MEMBERS} />
                )}

                {activeTab === 'saldos' && (
                    <TotalsSummary 
                        subtotal={95.00}
                        tax={11.40}
                        service={4.75}
                        tip={0.85}
                        total={112.00}
                        paidAmount={99.50}
                        pendingAmount={12.50}
                    />
                )}
            </ScrollView>

            {/* ACCIÓN FLOTANTE INFERIOR (STACK VERTICAL - ALINEADO CON WEB) */}
            <View 
                style={{ 
                    backgroundColor: theme.isDark ? 'rgba(12, 20, 37, 0.98)' : 'rgba(255, 255, 255, 0.98)', 
                    borderTopColor: theme.border + '20' 
                }} 
                className="absolute bottom-0 w-full border-t px-8 pt-6 pb-12 shadow-2xl"
            >
                <View className="gap-y-4">
                    <TouchableOpacity 
                        onPress={() => setIsAddExpenseVisible(true)}
                        style={{ backgroundColor: theme.primary }} 
                        className="w-full flex-row items-center justify-center h-16 rounded-[1.5rem] shadow-lg shadow-blue-500/30 active:scale-[0.98]"
                    >
                        <Ionicons name="add-circle" size={24} color="white" className="mr-2" />
                        <Text className="text-white font-black text-sm uppercase tracking-[0.2em] ml-2">Agregar Gasto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => setIsPaymentVisible(true)}
                        disabled={!canSettle}
                        style={{ 
                            backgroundColor: canSettle ? theme.cardSecondary : `${theme.cardSecondary}80`,
                            borderColor: canSettle ? theme.primary + '40' : theme.border
                        }} 
                        className="w-full flex-row items-center justify-center h-14 rounded-[1.5rem] border active:scale-[0.98]"
                    >
                        <MaterialIcons name="payments" size={20} color={canSettle ? theme.primary : theme.textSecondary} />
                        <Text style={{ color: canSettle ? theme.primary : theme.textSecondary }} className="font-black text-[10px] uppercase tracking-[0.2em] ml-3">
                            {canSettle ? 'Liquidar Deuda' : 'Sin deudas pendientes'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* MODALES PREMIUM */}
            <AddExpenseModal 
                isVisible={isAddExpenseVisible}
                onClose={() => setIsAddExpenseVisible(false)}
                groupId={id || ''}
                members={MOCK_MEMBERS}
                onSuccess={() => {
                    // Aquí iría la lógica de refresco
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
