import React, { useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { useTheme } from '../../../src/infrastructure/context/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Datos de Prueba
const MOCK_MEMBERS = [
    { id: 'me', name: 'Tú', avatar: '', isMe: true, paid: 45.00, due: 12.50, progress: 78, progressColor: '#10B981', paidText: 'Ha pagado $45.00', pendingText: 'Pendiente $12.50' },
    { id: 'm1', name: 'Carlos R.', avatar: 'https://i.pravatar.cc/150?u=carlos', isMe: false, paid: 0.00, due: 32.00, progress: 0, progressColor: '#F59E0B', paidText: 'Pendiente $32.00', paidTextClass: 'text-amber-600', paidBgClass: 'bg-amber-500/20', pendingText: 'Ha pagado $0.00' },
    { id: 'm2', name: 'Marta L.', avatar: 'https://i.pravatar.cc/150?u=marta', isMe: false, paid: 22.50, due: 0.00, progress: 100, progressColor: '#10B981', paidText: 'Ha pagado $22.50', paidTextClass: 'text-emerald-600', paidBgClass: 'bg-emerald-500/20', pendingText: 'Pagado en su totalidad' },
];

const MOCK_ITEMS = [
    { id: 'i1', name: 'Pizza Margherita', detail: '1x Unidad', amount: 12.50, avatars: ['https://i.pravatar.cc/150?u=marta', 'https://i.pravatar.cc/150?u=carlos'] },
    { id: 'i2', name: 'Hamburguesa Especial', detail: '2x Unidades ($7.50 c/u)', amount: 15.00, avatars: ['https://i.pravatar.cc/150?u=carlos'] },
    { id: 'i3', name: 'Cervezas Artesanales', detail: '4x Unidades ($4.50 c/u)', amount: 18.00, avatars: ['https://i.pravatar.cc/150?u=marta', 'https://i.pravatar.cc/150?u=carlos', 'https://i.pravatar.cc/150?u=ana'] },
];

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme, fontScale } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'miembros' | 'items' | 'totales'>('items');

    const handleTabChange = (tab: 'miembros' | 'items' | 'totales') => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveTab(tab);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER */}
            <View className="px-6 py-4 flex-row items-center justify-between z-20">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full" style={{ backgroundColor: theme.cardSecondary }}>
                    <Ionicons name="arrow-back" size={24} color={theme.primary} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-bold">Cena con Amigos</Text>
                    <View className="flex-row items-center mt-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                        <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="uppercase font-semibold tracking-widest">Sincronizado</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity className="p-2 rounded-full" style={{ backgroundColor: theme.cardSecondary }}>
                        <MaterialIcons name="document-scanner" size={22} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 rounded-full -mr-2" style={{ backgroundColor: theme.cardSecondary }}>
                        <MaterialIcons name="qr-code-scanner" size={22} color={theme.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* NAV PILL */}
            <View className="px-4 mb-4 mt-2">
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="p-1 rounded-xl flex-row w-full border">
                    {(['miembros', 'items', 'totales'] as const).map(tab => {
                        const isActive = activeTab === tab;
                        return (
                            <TouchableOpacity 
                                key={tab} 
                                onPress={() => handleTabChange(tab)}
                                style={{ backgroundColor: isActive ? theme.card : 'transparent' }}
                                className={`flex-1 py-2.5 px-2 rounded-lg items-center justify-center ${isActive ? 'shadow-sm' : ''}`}
                            >
                                <Text style={{ 
                                    color: isActive ? theme.primary : theme.textSecondary, 
                                    fontWeight: isActive ? '700' : '500',
                                    fontSize: 13 * fontScale
                                }}>
                                    {tab === 'miembros' ? 'Miembros' : tab === 'items' ? 'Ítems' : 'Totales'}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* CONTENT */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
                <View className="px-5">
                    
                    {/* TAB: ÍTEMS */}
                    {activeTab === 'items' && (
                        <MotiView from={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                            <View className="flex-row justify-between items-end mb-5 px-1 mt-2">
                                <View>
                                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-bold">Detalle de la cuenta</Text>
                                    <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="mt-1">Asigna quién consumió qué.</Text>
                                </View>
                                <TouchableOpacity className="flex-row items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-full">
                                    <Ionicons name="add" size={16} color={theme.primary} />
                                    <Text style={{ color: theme.primary, fontSize: 13 * fontScale }} className="font-bold">Añadir</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="gap-4">
                                {MOCK_ITEMS.map((item, idx) => (
                                    <View key={item.id} style={{ backgroundColor: theme.card, borderColor: theme.border }} className="rounded-2xl p-5 border shadow-sm">
                                        <View className="flex-row justify-between items-start mb-4">
                                            <View className="flex-1 pr-4">
                                                <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-bold mb-1">{item.name}</Text>
                                                <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }}>{item.detail}</Text>
                                            </View>
                                            <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-bold">${item.amount.toFixed(2)}</Text>
                                        </View>
                                        <View className="flex-row items-center justify-between mt-2 pt-4 border-t" style={{ borderColor: theme.border }}>
                                            <View className="flex-row -space-x-3">
                                                {item.avatars.map((av, idx) => (
                                                    <Image key={idx} source={{ uri: av }} className="w-8 h-8 rounded-full border-2" style={{ borderColor: theme.card }} />
                                                ))}
                                            </View>
                                            <TouchableOpacity style={{ backgroundColor: theme.cardSecondary }} className="w-8 h-8 rounded-full items-center justify-center">
                                                <MaterialIcons name="edit" size={16} color={theme.textSecondary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}

                                {/* Propina / Servicio */}
                                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-2xl p-4 flex-row justify-between items-center mt-2 border">
                                    <View className="flex-row items-center gap-3">
                                        <View style={{ backgroundColor: theme.card }} className="w-10 h-10 rounded-full items-center justify-center">
                                            <MaterialIcons name="receipt-long" size={20} color={theme.textSecondary} />
                                        </View>
                                        <View>
                                            <Text style={{ color: theme.text, fontSize: 14 * fontScale }} className="font-bold">Propina y Servicio</Text>
                                            <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="mt-0.5 font-medium">Dividido en partes iguales</Text>
                                        </View>
                                    </View>
                                    <Text style={{ color: theme.text, fontSize: 14 * fontScale }} className="font-bold">${8.50.toFixed(2)}</Text>
                                </View>
                            </View>
                        </MotiView>
                    )}

                    {/* TAB: MIEMBROS */}
                    {activeTab === 'miembros' && (
                        <MotiView from={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="gap-4 pt-2">
                            {MOCK_MEMBERS.map(m => (
                                <View key={m.id} style={{ backgroundColor: theme.card, borderColor: theme.border }} className="rounded-2xl p-5 border shadow-sm">
                                    <View className="flex-row items-center gap-4">
                                        {m.isMe ? (
                                            <View style={{ backgroundColor: theme.primary + '20' }} className="w-12 h-12 rounded-full items-center justify-center">
                                                <Text style={{ color: theme.primary, fontSize: 16 * fontScale }} className="font-bold">TÚ</Text>
                                            </View>
                                        ) : (
                                            <Image source={{ uri: m.avatar }} className="w-12 h-12 rounded-full" />
                                        )}
                                        <View className="flex-1">
                                            <View className="flex-row justify-between items-start mb-1">
                                                <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-bold">{m.name}</Text>
                                                <View className={`px-2 py-0.5 rounded-md ${m.isMe ? 'bg-emerald-500/20' : m.paidBgClass}`}>
                                                    <Text className={`text-xs font-bold ${m.isMe ? 'text-emerald-500' : m.paidTextClass}`}>{m.paidText}</Text>
                                                </View>
                                            </View>
                                            <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="font-medium">{m.pendingText}</Text>
                                        </View>
                                    </View>
                                    
                                    <View style={{ backgroundColor: theme.cardSecondary }} className="w-full rounded-full h-1.5 mt-4 overflow-hidden">
                                        <View style={{ backgroundColor: m.progressColor, width: `${m.progress}%` }} className="h-full rounded-full" />
                                    </View>
                                    <View className="flex-row justify-between mt-2">
                                        <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="uppercase tracking-widest font-bold">Progreso de cuota</Text>
                                        <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-bold">{m.progress}%</Text>
                                    </View>
                                </View>
                            ))}
                        </MotiView>
                    )}

                    {/* TAB: TOTALES */}
                    {activeTab === 'totales' && (
                        <MotiView from={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="gap-8 pt-2">
                            <View style={{ backgroundColor: theme.card, borderColor: theme.border }} className="rounded-[1.5rem] p-6 border shadow-sm">
                                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-bold mb-5 tracking-tight">Desglose de Cuenta</Text>
                                <View className="gap-4 mb-2">
                                    <View className="flex-row justify-between items-center">
                                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="font-medium">Subtotal</Text>
                                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-bold">$95.00</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="font-medium">IVA (12%)</Text>
                                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-bold">$11.40</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="font-medium">Servicio (5%)</Text>
                                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-bold">$4.75</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="font-medium">Propina (Opcional)</Text>
                                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-bold">$0.85</Text>
                                    </View>
                                </View>
                                <View style={{ backgroundColor: theme.cardSecondary, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }} className="-mx-6 -mb-6 p-6 mt-4 flex-row justify-between items-end">
                                    <Text style={{ color: theme.textSecondary, fontSize: 16 * fontScale }} className="font-bold">Total General</Text>
                                    <Text style={{ color: theme.primary, fontSize: 32 * fontScale }} className="font-bold tracking-tight">$112.00</Text>
                                </View>
                            </View>

                            <View>
                                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-bold mb-4 tracking-tight px-1">Aportes de Miembros</Text>
                                <View className="flex-row gap-4">
                                    <View style={{ backgroundColor: theme.card, borderColor: theme.border }} className="flex-1 rounded-[1.25rem] p-5 border shadow-sm">
                                        <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="uppercase tracking-widest font-bold mb-2">Pagado</Text>
                                        <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-bold">$99.50</Text>
                                        <View style={{ backgroundColor: theme.cardSecondary }} className="w-full h-1.5 rounded-full mt-4 overflow-hidden">
                                            <View style={{ width: '88%', backgroundColor: theme.primary }} className="h-full rounded-full" />
                                        </View>
                                    </View>
                                    <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="flex-1 rounded-[1.25rem] p-5 border">
                                        <Text style={{ color: '#F59E0B', fontSize: 12 * fontScale }} className="uppercase tracking-widest font-bold mb-2">Pendiente</Text>
                                        <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-bold">$12.50</Text>
                                        <View style={{ backgroundColor: theme.card }} className="w-full h-1.5 rounded-full mt-4 overflow-hidden">
                                            <View style={{ width: '12%', backgroundColor: '#F59E0B' }} className="h-full rounded-full" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </MotiView>
                    )}

                </View>
            </ScrollView>

            {/* FIXED BOTTOM ACTION */}
            <View 
                style={{ backgroundColor: theme.isDark ? 'rgba(12, 20, 37, 0.95)' : 'rgba(255, 255, 255, 0.95)', borderTopColor: theme.border }} 
                className="absolute bottom-0 w-full border-t px-6 py-5 shadow-2xl pt-6 pb-8"
            >
                <View className="flex-row justify-between items-end mb-5 px-1">
                    <View>
                        <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="uppercase tracking-widest font-bold mb-1">Total Acumulado</Text>
                        <Text style={{ color: theme.text, fontSize: 22 * fontScale }} className="font-bold">$112.00</Text>
                    </View>
                    <View className="items-end">
                        <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="uppercase tracking-widest font-bold mb-1">Tú debes pagar</Text>
                        <Text style={{ color: theme.primary, fontSize: 24 * fontScale }} className="font-bold">$12.50</Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={{ backgroundColor: '#10B981' }} 
                    className="w-full flex-row items-center justify-center h-14 rounded-2xl shadow-lg shadow-emerald-500/20 active:opacity-80"
                >
                    <Text className="text-white font-bold text-lg tracking-wide mr-2">Cerrar y Dividir Mesa</Text>
                    <MaterialIcons name="chevron-right" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
