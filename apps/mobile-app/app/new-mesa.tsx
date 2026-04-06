import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions, 
    Image, 
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useMesa } from '../context/MesaContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SyncStatus } from '../src/components/SyncStatus';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function NewMesaScreen() {
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    const { activeMesa, assignItem, syncStatus, pendingCount, closeMesa } = useMesa();
    const router = useRouter();
    
    // UI State
    const [activeTab, setActiveTab] = useState<'members' | 'items' | 'totals'>('items');
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [viewState, setViewState] = useState<'edit' | 'summary'>('edit');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    // Protective redirect
    useEffect(() => {
        if (!activeMesa && !isLoading) {
            router.replace('/(tabs)/dashboard');
        }
    }, [activeMesa]);

    if (!activeMesa) return null;

    const isLeader = activeMesa?.liderId === user?.id;

    // Derived values
    const GRAN_TOTAL_TICKET = 850; 
    const pendingAmount = Math.max(0, GRAN_TOTAL_TICKET - activeMesa.subtotal);
    const isReadyToClose = pendingAmount <= 0;

    // Handlers
    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(false);
        setTimeout(() => setShowToast(true), 10);
        setTimeout(() => setShowToast(false), 2000);
    };

    const calculateUserDebt = (participantId: string) => {
        let base = activeMesa.items.reduce((acc, item) => {
            if (item.asignadoA.includes(participantId)) {
                return acc + (item.precio * item.cantidad / item.asignadoA.length);
            }
            return acc;
        }, 0);
        const tipFactor = activeMesa.subtotal < 3000 ? 0.10 : 0.05;
        return base + (base * tipFactor);
    };

    const handleCloseMesa = () => {
        if (!isLeader) return;
        setIsClosing(true);
    };

    const handleFinalize = async () => {
        if (!isLeader) return;
        setIsLoading(true);
        try {
            await closeMesa();
            setViewState('summary');
            setIsClosing(false);
            triggerToast('¡Cuenta Cerrada!');
        } catch (e) {
            triggerToast('Error al cerrar cuenta');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAssignment = async (itemId: string, participantId: string) => {
        if (!isLeader) {
            triggerToast('Solo el líder puede asignar ítems');
            return;
        }
        const item = activeMesa.items.find(i => i.id === itemId);
        if (!item) return;

        const isAssigned = item.asignadoA.includes(participantId);
        const newAssignment = isAssigned 
            ? item.asignadoA.filter(id => id !== participantId)
            : [...item.asignadoA, participantId];
        
        await assignItem(itemId, newAssignment);
        triggerToast(isAssigned ? 'Participante eliminado' : 'Platillo asignado');
    };

    // Sub-components
    const TabSelector = () => (
        <View className="px-6 py-4">
            <View className="flex-row bg-slate-900/50 p-1 rounded-2xl border border-white/5">
                {['members', 'items', 'totals'].map(id => (
                    <TouchableOpacity 
                        key={id}
                        onPress={() => setActiveTab(id as any)}
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

    if (viewState === 'summary') {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
                <StatusBar style={theme.isDark ? "light" : "dark"} />
                <Stack.Screen options={{ headerShown: false }} />
                <View className="px-6 py-6 flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => setViewState('edit')}>
                        <MaterialIcons name="arrow-back-ios" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">Ticket Digital</Text>
                        <Text style={{ color: theme.primary }} className="text-[10px] font-black uppercase tracking-widest">Resumen Final</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/dashboard')}>
                        <MaterialIcons name="home" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                    <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: theme.primary }} className="p-8 rounded-[40px] items-center mb-8">
                        <Text className="text-slate-900/60 font-black uppercase tracking-[4px] mb-2">Tú debes pagar</Text>
                        <Text style={{ fontSize: 56 * fontScale }} className="text-slate-900 font-black tracking-tighter">${calculateUserDebt(user?.id || '1').toFixed(2)}</Text>
                    </MotiView>
                    
                    {activeMesa.participantes.map(p => (
                        <View key={p.id} className="flex-row justify-between mb-4 px-2">
                            <Text style={{ color: theme.textSecondary }}>{p.nombre}</Text>
                            <Text style={{ color: theme.text }} className="font-bold">${calculateUserDebt(p.id).toFixed(2)}</Text>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <SyncStatus status={syncStatus === 'SYNCED' ? 'online' : 'offline'} pendingChanges={pendingCount} />
            <AnimatePresence>
                {showToast && (
                    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} exit={{ opacity: 0, translateY: 20 }}
                        className="absolute bottom-32 self-center z-50 bg-slate-900 px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                        <Text style={{ color: 'white' }} className="font-bold">{toastMsg}</Text>
                    </MotiView>
                )}
            </AnimatePresence>

            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient colors={theme.isDark ? ['#0f172a', '#1e293b'] : ['#f8fafc', '#f1f5f9']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-xl items-center justify-center bg-slate-800/40">
                    <MaterialIcons name="arrow-back-ios" size={20} color={theme.text} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">{activeMesa.nombre}</Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                        <View style={{ backgroundColor: syncStatus === 'SYNCED' ? '#10b981' : '#f59e0b' }} className="w-1.5 h-1.5 rounded-full" />
                        <Text style={{ color: syncStatus === 'SYNCED' ? '#10b981' : '#f59e0b' }} className="text-[10px] font-black uppercase tracking-widest">
                            {syncStatus === 'SYNCED' ? 'Sincronizado' : 'Cambios Pendientes'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => router.push('/scan-qr')} className="w-10 h-10 rounded-xl items-center justify-center bg-blue-500/10">
                    <MaterialIcons name="qr-code-scanner" size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <TabSelector />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }} className="px-6">
                {activeTab === 'members' && (
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4">
                        {activeMesa.participantes.map(p => (
                            <View key={p.id} style={{ backgroundColor: theme.cardSecondary }} className="flex-row items-center justify-between p-4 rounded-3xl border border-white/5">
                                <View className="flex-row items-center gap-4">
                                    <Image source={{ uri: p.avatar }} className="w-12 h-12 rounded-full border-2" style={{ borderColor: p.color }} />
                                    <View>
                                        <Text style={{ color: theme.text }} className="font-bold">{p.nombre} {p.isLeader ? '(Líder)' : ''}</Text>
                                        <Text className="text-emerald-400 text-[10px] font-bold">{p.status}</Text>
                                    </View>
                                </View>
                                <MaterialIcons name="more-horiz" size={24} color={theme.textSecondary} />
                            </View>
                        ))}
                    </MotiView>
                )}

                {activeTab === 'items' && (
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4">
                        <View className="flex-row justify-between items-center px-2 mb-2">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px]">Consumos</Text>
                            <TouchableOpacity onPress={() => router.push('/ocr-review')} className="flex-row items-center gap-1">
                                <MaterialIcons name="compare" size={14} color={theme.primary} />
                                <Text style={{ color: theme.primary }} className="text-[10px] font-bold uppercase">OCR Compare</Text>
                            </TouchableOpacity>
                        </View>
                        {activeMesa.items.map((item) => (
                            <TouchableOpacity key={item.id} activeOpacity={0.7} 
                                onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id, name: item.nombre, price: item.precio, quantity: item.cantidad }})}
                                style={{ backgroundColor: theme.cardSecondary }} className="p-5 rounded-[40px] border border-white/10">
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text style={{ color: theme.text }} className="text-lg font-black">{item.nombre}</Text>
                                    <Text style={{ color: theme.text }} className="text-lg font-black">${item.precio * item.cantidad}</Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2 pt-4 border-t border-white/5">
                                    {activeMesa.participantes.map(p => (
                                        <TouchableOpacity key={p.id} onPress={() => toggleAssignment(item.id, p.id)}
                                            style={{ backgroundColor: item.asignadoA.includes(p.id) ? p.color : 'rgba(255,255,255,0.05)' }} className="px-4 py-2 rounded-2xl">
                                            <Text style={{ color: item.asignadoA.includes(p.id) ? 'white' : theme.textSecondary, fontSize: 10 * fontScale }} className="font-bold">{p.nombre}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </MotiView>
                )}

                {activeTab === 'totals' && (
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-6 pt-4">
                        <View className="bg-slate-900/60 p-8 rounded-[50px] items-center border border-white/5">
                            <Text className="text-slate-500 font-bold uppercase tracking-[4px] mb-2 text-[10px]">Total Acumulado</Text>
                            <Text style={{ color: 'white', fontSize: 64 * fontScale }} className="font-black tracking-tighter">${activeMesa.subtotal}</Text>
                        </View>
                    </MotiView>
                )}
            </ScrollView>

            <View className="absolute bottom-8 left-6 right-6 gap-4">
                {isLeader ? (
                    <TouchableOpacity disabled={!isReadyToClose || isLoading} onPress={handleCloseMesa} 
                        style={{ backgroundColor: isReadyToClose ? theme.primary : '#1e293b' }} className="w-full py-5 rounded-[28px] items-center justify-center shadow-2xl">
                        <Text className="text-black font-black uppercase tracking-widest">{isReadyToClose ? 'Cerrar y Dividir Mesa' : `Faltan $${pendingAmount}`}</Text>
                    </TouchableOpacity>
                ) : (
                    <View className="bg-slate-900/80 py-5 rounded-[28px] items-center justify-center border border-white/5">
                        <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Esperando que el líder cierre la cuenta</Text>
                    </View>
                )}
            </View>

            {isClosing && (
                <View className="absolute inset-0 bg-black/80 z-50 justify-center px-6">
                    <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 rounded-[40px] p-8 border border-white/5">
                        <View className="items-center mb-6">
                            <Text style={{ color: 'white' }} className="text-xl font-black">Cerrar y Dividir</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-center mt-2 font-medium">Subtotal: ${activeMesa.subtotal} + Propina Sugerida</Text>
                        </View>
                        <TouchableOpacity onPress={handleFinalize} style={{ backgroundColor: theme.primary }} className="w-full py-5 rounded-3xl items-center shadow-xl shadow-blue-500/20">
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
