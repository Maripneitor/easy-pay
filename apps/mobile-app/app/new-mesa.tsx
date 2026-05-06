import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    Dimensions, Image, StyleSheet, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useGrupo } from '../context/GrupoContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function NewMesaScreen() {
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    const {
        activeGrupo,
        assignItem,
        syncStatus,
        pendingCount,
        closeGrupo,
        calculateUserDebt
    } = useGrupo();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'members' | 'items' | 'totals'>('items');
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [viewState, setViewState] = useState<'edit' | 'summary'>('edit');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    // FIX: Redirigir a /(tabs) en lugar de /(tabs)/dashboard que no existe
    useEffect(() => {
        if (!activeGrupo && !isLoading) {
            router.replace('/(tabs)');
        }
    }, [activeGrupo]);

    if (!activeGrupo) return null;

    const isLeader = activeGrupo?.liderId === user?.id;

    // FIX: Total real del ticket en lugar de 850 hardcodeado
    const GRAN_TOTAL_TICKET = activeGrupo.total > 0 ? activeGrupo.total : activeGrupo.subtotal;
    const pendingAmount = Math.max(0, GRAN_TOTAL_TICKET - activeGrupo.subtotal);
    const isReadyToClose = activeGrupo.items.length > 0;

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(false);
        setTimeout(() => setShowToast(true), 10);
        setTimeout(() => setShowToast(false), 2000);
    };

    const toggleAssignment = async (itemId: string, participantId: string) => {
        if (!isLeader) {
            triggerToast('Solo el líder puede asignar ítems');
            return;
        }
        const item = activeGrupo.items.find(i => i.id === itemId);
        if (!item) return;

        const isAssigned = item.asignadoA.includes(participantId);
        const newAssignment = isAssigned
            ? item.asignadoA.filter(id => id !== participantId)
            : [...item.asignadoA, participantId];

        await assignItem(itemId, newAssignment);
        triggerToast(isAssigned ? 'Participante eliminado' : 'Platillo asignado ✓');
    };

    const handleFinalize = async () => {
        if (!isLeader) return;
        setIsLoading(true);
        try {
            await closeGrupo();
            setIsClosing(false);
            setViewState('summary');
        } catch (e) {
            triggerToast('Error al cerrar el grupo');
        } finally {
            setIsLoading(false);
        }
    };

    const TabSelector = () => (
        <View className="px-6 py-4">
            <View className="flex-row bg-slate-900/50 p-1 rounded-2xl border border-white/5">
                {(['members', 'items', 'totals'] as const).map(id => (
                    <TouchableOpacity
                        key={id}
                        onPress={() => setActiveTab(id)}
                        className={`flex-1 py-3 items-center rounded-xl ${activeTab === id ? 'bg-slate-800 border border-white/5 shadow-sm' : ''}`}
                    >
                        <Text style={{ color: activeTab === id ? theme.text : theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest">
                            {id === 'members' ? 'Miembros' : id === 'items' ? 'Ítems' : 'Totales'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    // Vista resumen final
    if (viewState === 'summary') {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
                <StatusBar style={theme.isDark ? 'light' : 'dark'} />
                <Stack.Screen options={{ headerShown: false }} />
                <View className="px-6 py-6 flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => setViewState('edit')}>
                        <MaterialIcons name="arrow-back-ios" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">Ticket Digital</Text>
                        <Text style={{ color: theme.primary }} className="text-[10px] font-black uppercase tracking-widest">Resumen Final</Text>
                    </View>
                    {/* FIX: router.replace a /(tabs) en lugar de /(tabs)/dashboard */}
                    <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
                        <MaterialIcons name="home" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                    <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: theme.primary }} className="p-8 rounded-[40px] items-center mb-8">
                        <Text className="text-slate-900/60 font-black uppercase tracking-[4px] mb-2">Tú debes pagar</Text>
                        <Text style={{ fontSize: 56 * fontScale }} className="text-slate-900 font-black tracking-tighter">
                            ${calculateUserDebt(user?.id || '').toFixed(2)}
                        </Text>
                    </MotiView>

                    <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-widest mb-4">Desglose por persona</Text>
                    {activeGrupo.participantes.map(p => (
                        <View key={p.id} style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="flex-row justify-between p-5 rounded-2xl border mb-3">
                            <Text style={{ color: theme.textSecondary }}>{p.nombre}</Text>
                            <Text style={{ color: theme.text }} className="font-bold">${calculateUserDebt(p.id).toFixed(2)}</Text>
                        </View>
                    ))}

                    <TouchableOpacity
                        onPress={() => router.replace('/(tabs)')}
                        style={{ backgroundColor: theme.primary }}
                        className="py-5 rounded-2xl items-center mt-6 mb-10"
                    >
                        <Text className="text-black font-black uppercase tracking-widest">Ir al Inicio</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <AnimatePresence>
                {showToast && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: 20 }}
                        className="absolute bottom-32 self-center z-50 bg-slate-900 px-6 py-3 rounded-full border border-white/10 shadow-2xl"
                    >
                        <Text style={{ color: 'white' }} className="font-bold">{toastMsg}</Text>
                    </MotiView>
                )}
            </AnimatePresence>

            <StatusBar style={theme.isDark ? 'light' : 'dark'} />
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={theme.isDark ? ['#0f172a', '#1e293b'] : ['#f8fafc', '#f1f5f9']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-xl items-center justify-center bg-slate-800/40">
                    <MaterialIcons name="arrow-back-ios" size={20} color={theme.text} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">{activeGrupo.nombre}</Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                        <View style={{ backgroundColor: syncStatus === 'SYNCED' ? '#10b981' : '#f59e0b' }} className="w-1.5 h-1.5 rounded-full" />
                        <Text style={{ color: syncStatus === 'SYNCED' ? '#10b981' : '#f59e0b' }} className="text-[10px] font-black uppercase tracking-widest">
                            {syncStatus === 'SYNCED' ? 'Conectado' : 'Cambios Pendientes'}
                        </Text>
                    </View>
                </View>
                {/* Código del grupo */}
                <View className="bg-blue-500/10 px-3 py-2 rounded-xl">
                    <Text style={{ color: theme.primary }} className="text-[10px] font-black tracking-widest">#{activeGrupo.codigo}</Text>
                </View>
            </View>

            <TabSelector />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }} className="px-6">

                {/* Miembros */}
                {activeTab === 'members' && (
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4">
                        {activeGrupo.participantes.length === 0 ? (
                            <View style={{ backgroundColor: theme.cardSecondary }} className="p-8 rounded-3xl items-center">
                                <MaterialIcons name="group-add" size={40} color={theme.textSecondary} />
                                <Text style={{ color: theme.textSecondary }} className="font-bold mt-3 text-center">
                                    Comparte el código #{activeGrupo.codigo} para que otros se unan
                                </Text>
                            </View>
                        ) : activeGrupo.participantes.map(p => (
                            <View key={p.id} style={{ backgroundColor: theme.cardSecondary }} className="flex-row items-center justify-between p-4 rounded-3xl border border-white/5">
                                <View className="flex-row items-center gap-4">
                                    <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: (p.color ?? '#2196F3') + '30' }}>
                                        <Text style={{ color: p.color ?? '#2196F3' }} className="font-black text-lg">
                                            {p.nombre.substring(0, 2).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={{ color: theme.text }} className="font-bold">
                                            {p.nombre} {p.role === 'leader' ? '👑' : ''}
                                        </Text>
                                        <Text className="text-emerald-400 text-[10px] font-bold">
                                            ${calculateUserDebt(p.id).toFixed(2)} por pagar
                                        </Text>
                                    </View>
                                </View>
                                <MaterialIcons name="more-horiz" size={24} color={theme.textSecondary} />
                            </View>
                        ))}
                    </MotiView>
                )}

                {/* Items */}
                {activeTab === 'items' && (
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4">
                        <View className="flex-row justify-between items-center px-2 mb-2">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px]">Consumos</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold">{activeGrupo.items.length} items</Text>
                        </View>

                        {activeGrupo.items.length === 0 ? (
                            <View style={{ backgroundColor: theme.cardSecondary }} className="p-8 rounded-3xl items-center">
                                <MaterialIcons name="receipt-long" size={40} color={theme.textSecondary} />
                                <Text style={{ color: theme.textSecondary }} className="font-bold mt-3 text-center">
                                    Escanea un ticket o agrega items manualmente
                                </Text>
                            </View>
                        ) : activeGrupo.items.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.7}
                                onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id, name: item.nombre, price: item.precio, quantity: item.cantidad } } as any)}
                                style={{ backgroundColor: theme.cardSecondary }}
                                className="p-5 rounded-[40px] border border-white/10"
                            >
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text style={{ color: theme.text }} className="text-lg font-black flex-1 mr-4">{item.nombre}</Text>
                                    <Text style={{ color: theme.text }} className="text-lg font-black">${(item.precio * item.cantidad).toFixed(2)}</Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2 pt-4 border-t border-white/5">
                                    {activeGrupo.participantes.map(p => (
                                        <TouchableOpacity
                                            key={p.id}
                                            onPress={() => toggleAssignment(item.id, p.id)}
                                            style={{ backgroundColor: item.asignadoA.includes(p.id) ? (p.color ?? '#2196F3') : 'rgba(255,255,255,0.05)' }}
                                            className="px-4 py-2 rounded-2xl"
                                        >
                                            <Text style={{ color: item.asignadoA.includes(p.id) ? 'white' : theme.textSecondary, fontSize: 10 * fontScale }} className="font-bold">
                                                {p.nombre}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                    {activeGrupo.participantes.length === 0 && (
                                        <Text style={{ color: theme.textSecondary }} className="text-xs">Sin miembros — agrega participantes primero</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </MotiView>
                )}

                {/* Totales */}
                {activeTab === 'totals' && (
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-6 pt-4">
                        <View className="bg-slate-900/60 p-8 rounded-[50px] items-center border border-white/5">
                            <Text className="text-slate-500 font-bold uppercase tracking-[4px] mb-2 text-[10px]">Total Acumulado</Text>
                            <Text style={{ color: 'white', fontSize: 64 * fontScale }} className="font-black tracking-tighter">
                                ${activeGrupo.subtotal.toFixed(2)}
                            </Text>
                        </View>
                        {activeGrupo.propina > 0 && (
                            <View style={{ backgroundColor: theme.cardSecondary }} className="p-5 rounded-2xl flex-row justify-between">
                                <Text style={{ color: theme.textSecondary }}>Propina sugerida (10%)</Text>
                                <Text style={{ color: theme.text }} className="font-bold">${activeGrupo.propina.toFixed(2)}</Text>
                            </View>
                        )}
                        <View style={{ backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }} className="p-5 rounded-2xl flex-row justify-between border">
                            <Text style={{ color: theme.primary }} className="font-black">Total con propina</Text>
                            <Text style={{ color: theme.primary }} className="font-black text-lg">${activeGrupo.total.toFixed(2)}</Text>
                        </View>
                    </MotiView>
                )}
            </ScrollView>

            {/* Botón cerrar */}
            <View className="absolute bottom-8 left-6 right-6">
                {isLeader ? (
                    <TouchableOpacity
                        disabled={!isReadyToClose || isLoading}
                        onPress={() => setIsClosing(true)}
                        style={{ backgroundColor: isReadyToClose ? theme.primary : '#1e293b' }}
                        className="w-full py-5 rounded-[28px] items-center justify-center shadow-2xl"
                    >
                        <Text className="text-black font-black uppercase tracking-widest">
                            {isReadyToClose ? 'Cerrar y Dividir Mesa' : 'Agrega items primero'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View className="bg-slate-900/80 py-5 rounded-[28px] items-center justify-center border border-white/5">
                        <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                            Esperando que el líder cierre la cuenta
                        </Text>
                    </View>
                )}
            </View>

            {/* Modal confirmación cierre */}
            {isClosing && (
                <View className="absolute inset-0 bg-black/80 z-50 justify-center px-6">
                    <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 rounded-[40px] p-8 border border-white/5">
                        <View className="items-center mb-6">
                            <Text style={{ color: 'white' }} className="text-xl font-black">Cerrar y Dividir</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-center mt-2 font-medium">
                                Total: ${activeGrupo.subtotal.toFixed(2)} + Propina: ${activeGrupo.propina.toFixed(2)}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleFinalize}
                            style={{ backgroundColor: theme.primary }}
                            className="w-full py-5 rounded-3xl items-center shadow-xl shadow-blue-500/20"
                        >
                            {isLoading ? <ActivityIndicator color="black" /> : <Text className="text-black font-black uppercase tracking-widest">Confirmar Cierre</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsClosing(false)} className="items-center mt-6">
                            <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Cancelar</Text>
                        </TouchableOpacity>
                    </MotiView>
                </View>
            )}
        </SafeAreaView>
    );
}
