import React, { useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions, 
    Image, 
    StyleSheet,
    Animated,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MotiView, MotiText } from 'moti';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock Data for "Mesa"
const MOCK_PARTICIPANTS = [
    { id: '1', name: 'Tú', avatar: 'https://i.pravatar.cc/150?u=me', color: '#3b82f6' },
    { id: '2', name: 'Ana', avatar: 'https://i.pravatar.cc/150?u=ana', color: '#ec4899' },
    { id: '3', name: 'Carlos', avatar: 'https://i.pravatar.cc/150?u=carlos', color: '#10b981' },
    { id: '4', name: 'Mario', avatar: 'https://i.pravatar.cc/150?u=mario', color: '#f59e0b' },
];

const MOCK_CONSUMPTION = [
    { id: 'c1', name: 'Hamburguesa Sonora', price: 280, quantity: 1, assigned: ['1', '2'] },
    { id: 'c2', name: 'Papas Trufadas', price: 120, quantity: 1, assigned: ['3'] },
    { id: 'c3', name: 'Cerveza Artesanal', price: 95, quantity: 1, assigned: ['1'] },
    { id: 'c4', name: 'Nachos Supreme', price: 180, quantity: 1, assigned: ['1', '2', '3', '4'] },
];

export default function NewMesaScreen() {
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const [consumption, setConsumption] = useState(MOCK_CONSUMPTION);
    const [participants, setParticipants] = useState([
        { id: user?.id || '1', name: 'Tú', avatar: `https://ui-avatars.com/api/?name=${user?.nombre || 'U'}&background=random`, color: '#3b82f6' },
        ...MOCK_PARTICIPANTS.slice(1)
    ]);
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'progress' | 'review' | 'closed'>('progress');
    const [viewState, setViewState] = useState<'edit' | 'summary'>('edit');
    const [tipPercent, setTipPercent] = useState(10);

    const totalCalculated = consumption.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const GRAN_TOTAL_TICKET = 850; // Total real del ticket físico
    const pendingAmount = GRAN_TOTAL_TICKET - totalCalculated;
    const isReadyToClose = pendingAmount <= 0;

    const calculateUserDebt = (participantId: string) => {
        let base = consumption.reduce((acc, item) => {
            if (item.assigned.includes(participantId)) {
                return acc + (item.price * item.quantity / item.assigned.length);
            }
            return acc;
        }, 0);
        const tip = base * (tipPercent / 100);
        return base + tip;
    };

    const handleCloseMesa = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsClosing(true);
        }, 800);
    };

    const handleFinalize = () => {
        setStatus('closed');
        setViewState('summary');
        setIsClosing(false);
    };

    const toggleAssignment = (itemId: string, participantId: string) => {
        if (status === 'closed') return;
        setConsumption(prev => prev.map(item => {
            if (item.id === itemId) {
                const isAssigned = item.assigned.includes(participantId);
                return {
                    ...item,
                    assigned: isAssigned 
                        ? item.assigned.filter(id => id !== participantId)
                        : [...item.assigned, participantId]
                };
            }
            return item;
        }));
    };

    const updateQuantity = (itemId: string, delta: number) => {
        if (status !== 'progress') return;
        setConsumption(prev => prev.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    if (viewState === 'summary') {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
                <StatusBar style={theme.isDark ? "light" : "dark"} />
                <Stack.Screen options={{ headerShown: false }} />
                
                {/* Header Summary */}
                <View className="px-6 py-6 flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => setViewState('edit')}>
                        <MaterialIcons name="arrow-back-ios" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">Resumen Final</Text>
                        <Text style={{ color: theme.primary }} className="text-[10px] font-black uppercase tracking-widest">Cuenta Cerrada</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/dashboard')}>
                        <MaterialIcons name="home" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                    <MotiView 
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ backgroundColor: theme.primary }}
                        className="p-8 rounded-[40px] items-center mb-8 shadow-2xl shadow-blue-500/40"
                    >
                        <Text className="text-slate-900/60 font-black uppercase tracking-[4px] mb-2">Tú debes pagar</Text>
                        <Text style={{ fontSize: 56 * fontScale }} className="text-slate-900 font-black tracking-tighter">
                            ${calculateUserDebt('1').toFixed(2)}
                        </Text>
                        <View className="flex-row items-center gap-2 mt-4 bg-white/20 px-4 py-1.5 rounded-full">
                            <MaterialIcons name="info-outline" size={14} color="black" />
                            <Text style={{ fontSize: 11 * fontScale }} className="text-slate-900 font-bold">Base + {tipPercent}% Propina</Text>
                        </View>
                    </MotiView>

                    <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="font-black uppercase tracking-[3px] mb-4">Desglose por Persona</Text>
                    <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-[32px] border p-6 mb-8">
                        {participants.map((p, idx) => (
                            <View key={p.id} className={`flex-row items-center justify-between py-4 ${idx !== participants.length - 1 ? 'border-b border-white/5' : ''}`}>
                                <View className="flex-row items-center gap-3">
                                    <View style={{ borderColor: p.color }} className="w-10 h-10 rounded-xl border-2 p-0.5">
                                        <Image source={{ uri: p.avatar }} className="w-full h-full rounded-lg" />
                                    </View>
                                    <Text style={{ color: theme.text }} className="font-bold">{p.id === '1' ? 'Tú (Base)' : p.name}</Text>
                                </View>
                                <Text style={{ color: theme.text }} className="font-black text-lg">${calculateUserDebt(p.id).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="flex-row justify-between mb-2">
                        <Text style={{ color: theme.textSecondary }} className="font-bold">Total del Ticket</Text>
                        <Text style={{ color: theme.text }} className="font-black">${GRAN_TOTAL_TICKET}</Text>
                    </View>
                    <View className="flex-row justify-between mb-8">
                        <Text style={{ color: theme.textSecondary }} className="font-bold">Propina Total ({tipPercent}%)</Text>
                        <Text style={{ color: theme.text }} className="font-black">${(GRAN_TOTAL_TICKET * tipPercent / 100).toFixed(2)}</Text>
                    </View>

                    <View className="gap-4 pb-20">
                        <TouchableOpacity 
                            onPress={() => router.push('/settle-up')}
                            style={{ backgroundColor: theme.primary }}
                            className="w-full py-5 rounded-[24px] items-center shadow-xl shadow-blue-500/20"
                        >
                            <Text className="text-black font-black uppercase tracking-[4px]">Pagar mi parte</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{ backgroundColor: theme.glassBg, borderColor: theme.border }}
                            className="w-full py-5 rounded-[24px] items-center border flex-row justify-center gap-3"
                        >
                            <MaterialIcons name="share" size={20} color={theme.text} />
                            <Text style={{ color: theme.text }} className="font-black uppercase tracking-[4px]">Compartir Ticket</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            <LinearGradient
                colors={theme.isDark ? ['#0f172a', '#1e293b'] : ['#f8fafc', '#f1f5f9']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            {/* CABECERA (Header) */}
            <View style={{ backgroundColor: 'transparent' }} className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ backgroundColor: theme.cardSecondary }}
                    className="w-10 h-10 rounded-xl items-center justify-center border border-white/5"
                >
                    <MaterialIcons name="arrow-back-ios" size={20} color={theme.text} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">Cena en Sonora Grill</Text>
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                        <View style={{ backgroundColor: status === 'progress' ? '#10b981' : '#f59e0b' }} className="w-2 h-2 rounded-full" />
                        <Text style={{ color: status === 'progress' ? '#10b981' : '#f59e0b' }} className="text-[10px] font-black uppercase tracking-widest">
                            {status === 'progress' ? 'En Progreso' : 'En Revisión'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={{ backgroundColor: theme.cardSecondary }}
                    className="w-10 h-10 rounded-xl items-center justify-center border border-white/5"
                >
                    <MaterialIcons name="more-vert" size={20} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* EL GRAN TOTAL */}
            <View className="items-center py-6">
                <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-[4px] mb-2">Total de la Mesa</Text>
                <MotiText 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ type: 'spring', duration: 1000 }}
                    style={{ color: theme.text, fontSize: 56 * fontScale }} 
                    className="font-black tracking-tighter"
                >
                    ${GRAN_TOTAL_TICKET.toLocaleString()}
                </MotiText>
            </View>

            {/* PARTICIPANTES (Carousel) */}
            <View className="mb-4">
                <View className="flex-row items-center justify-between px-6 mb-4">
                    <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-[3px]">Participantes</Text>
                    <Text style={{ color: theme.primary, fontSize: 10 * fontScale }} className="font-black uppercase">{participants.length} Miembros</Text>
                </View>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
                >
                    {participants.map((p) => (
                        <MotiView 
                            key={p.id}
                            from={{ opacity: 0, translateX: -20 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            className="items-center"
                        >
                            <View style={{ borderColor: p.color }} className="w-14 h-14 rounded-2xl border-2 p-0.5 mb-1.5 shadow-lg">
                                <Image source={{ uri: p.avatar }} className="w-full h-full rounded-[14px]" />
                                <View style={{ backgroundColor: p.color }} className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border border-white/20" />
                            </View>
                            <Text style={{ color: theme.text, fontSize: 9 * fontScale }} className="font-bold text-center opacity-80">{p.name}</Text>
                        </MotiView>
                    ))}
                    <TouchableOpacity 
                        style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                        className="w-14 h-14 rounded-2xl border border-dashed items-center justify-center"
                    >
                        <MaterialIcons name="add" size={20} color={theme.primary} />
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* LISTA DE CONSUMOS (El Ticket) */}
            <View className="flex-1 px-6">
                <View className="flex-row items-center justify-between mb-6">
                    <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-[3px]">Consumos (Ticket)</Text>
                    <TouchableOpacity className="flex-row items-center gap-1">
                        <MaterialIcons name="camera-alt" size={16} color={theme.primary} />
                        <Text style={{ color: theme.primary, fontSize: 10 * fontScale }} className="font-black uppercase">Escanear Ticket</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                    {consumption.map((item) => (
                        <MotiView 
                            key={item.id}
                            className="mb-4"
                        >
                            <View 
                                style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                className="p-5 rounded-[32px] border"
                            >
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center gap-3">
                                        <View style={{ backgroundColor: theme.glassBg }} className="px-2 py-1 rounded-lg">
                                            <Text style={{ color: theme.text, fontSize: 12 * fontScale }} className="font-black">x{item.quantity}</Text>
                                        </View>
                                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">{item.name}</Text>
                                    </View>
                                    <Text style={{ color: theme.primary, fontSize: 16 * fontScale }} className="font-black">${item.price * item.quantity}</Text>
                                </View>
                                
                                {/* Asignados */}
                                <View className="flex-row flex-wrap gap-2 mb-4">
                                    {participants.map(p => {
                                        const isSelected = item.assigned.includes(p.id);
                                        return (
                                            <TouchableOpacity 
                                                key={p.id}
                                                onPress={() => toggleAssignment(item.id, p.id)}
                                                style={{ 
                                                    backgroundColor: isSelected ? p.color : theme.glassBg,
                                                    borderColor: isSelected ? p.color : theme.border 
                                                }}
                                                className="px-3 py-1.5 rounded-full border flex-row items-center gap-2"
                                            >
                                                <Image source={{ uri: p.avatar }} className="w-4 h-4 rounded-full" />
                                                <Text style={{ color: isSelected ? 'white' : theme.textSecondary, fontSize: 9 * fontScale }} className="font-black uppercase tracking-tighter">
                                                    {p.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {status === 'progress' && (
                                    <View className="flex-row justify-end gap-3 mt-1">
                                        <TouchableOpacity 
                                            onPress={() => updateQuantity(item.id, -1)}
                                            style={{ backgroundColor: theme.glassBg }} className="w-8 h-8 rounded-full items-center justify-center"
                                        >
                                            <MaterialIcons name="remove" size={16} color={theme.text} />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={() => updateQuantity(item.id, 1)}
                                            style={{ backgroundColor: theme.glassBg }} className="w-8 h-8 rounded-full items-center justify-center"
                                        >
                                            <MaterialIcons name="add" size={16} color={theme.text} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </MotiView>
                    ))}

                    {/* Pending Items Placeholder */}
                    {pendingAmount > 0 && (
                        <MotiView 
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ backgroundColor: `${theme.primary}10`, borderColor: `${theme.primary}20` }}
                            className="p-5 rounded-[32px] border border-dashed mb-4 flex-row items-center justify-between"
                        >
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons name="help-outline" size={24} color={theme.primary} />
                                <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="font-bold italic">
                                    Partidas pendientes de itemizar...
                                </Text>
                            </View>
                            <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">${pendingAmount}</Text>
                        </MotiView>
                    )}
                    
                    {status === 'progress' && (
                        <TouchableOpacity 
                            style={{ borderColor: theme.border }}
                            className="w-full h-20 rounded-[32px] border-2 border-dashed items-center justify-center flex-row gap-3 mt-2"
                        >
                            <MaterialIcons name="add-circle" size={24} color={theme.textSecondary} />
                            <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="font-black uppercase tracking-widest">Agregar Platillo</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            {/* BOTONES DE ACCIÓN PRINCIPALES */}
            {status !== 'closed' && (
                <MotiView 
                    animate={{ translateY: 0 }}
                    from={{ translateY: 100 }}
                    className="absolute bottom-8 left-6 right-6 gap-4"
                >
                    <TouchableOpacity 
                        disabled={!isReadyToClose || isLoading}
                        onPress={handleCloseMesa}
                        style={{ 
                            backgroundColor: '#2196F3',
                            shadowColor: '#2196F3',
                            opacity: isReadyToClose ? 1 : 0.5
                        }}
                        className="w-full h-18 rounded-[24px] items-center justify-center shadow-lg shadow-blue-500/40"
                    >
                        {isLoading ? (
                            <View className="flex-row items-center gap-3">
                                <ActivityIndicator color="white" />
                                <Text className="text-white font-black text-base uppercase tracking-[4px]">Sincronizando...</Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center gap-3">
                                <Text className="text-white font-black text-base uppercase tracking-[4px]">
                                    {isReadyToClose ? 'Cerrar y Dividir' : 'Faltan Items'}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </MotiView>
            )}

            {/* Modal de Propina (Bottom Sheet Simulation) */}
            {isClosing && (
                <View className="absolute inset-0 bg-black/60 z-50 justify-end">
                    <TouchableOpacity className="absolute inset-0" onPress={() => setIsClosing(false)} />
                    <MotiView 
                        from={{ translateY: 400 }}
                        animate={{ translateY: 0 }}
                        style={{ backgroundColor: theme.card }}
                        className="p-10 rounded-t-[50px]"
                    >
                        <View className="w-16 h-1.5 bg-slate-800 rounded-full self-center mb-8" />
                        <Text style={{ color: theme.text }} className="text-2xl font-black text-center mb-2">Resumen de la Mesa</Text>
                        <View className="bg-slate-900/50 p-6 rounded-3xl my-6">
                            <View className="flex-row justify-between mb-4">
                                <Text style={{ color: theme.textSecondary }} className="font-bold">Subtotal</Text>
                                <Text style={{ color: theme.text }} className="font-black">${GRAN_TOTAL_TICKET}</Text>
                            </View>
                            <View className="flex-row justify-between mb-4">
                                <Text style={{ color: theme.textSecondary }} className="font-bold">Propina Sugerida</Text>
                                <Text style={{ color: theme.text }} className="font-black">
                                    ${(GRAN_TOTAL_TICKET * tipPercent / 100).toFixed(2)} ({tipPercent}%)
                                </Text>
                            </View>
                            <View className="h-px bg-white/5 my-2" />
                            <View className="flex-row justify-between mt-2">
                                <Text style={{ color: theme.text }} className="text-lg font-black">Total Final</Text>
                                <Text style={{ color: theme.primary }} className="text-xl font-black">
                                    ${(GRAN_TOTAL_TICKET * (1 + tipPercent / 100)).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                        
                        <View className="flex-row gap-3 mb-10">
                            {[
                                { label: '0%', value: 0 },
                                { label: '10%', value: 10 },
                                { label: '15%', value: 15 },
                                { label: '20%', value: 20 }
                            ].map((p) => (
                                <TouchableOpacity 
                                    key={p.label}
                                    onPress={() => setTipPercent(p.value)}
                                    style={{ backgroundColor: tipPercent === p.value ? theme.primary : theme.glassBg }}
                                    className="flex-1 py-4 rounded-2xl items-center border border-white/5"
                                >
                                    <Text style={{ color: tipPercent === p.value ? 'black' : theme.text }} className="font-black text-xs">{p.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity 
                            onPress={handleFinalize}
                            style={{ backgroundColor: theme.primary }}
                            className="w-full py-5 rounded-3xl items-center mb-4 shadow-xl shadow-blue-500/20"
                        >
                            <Text className="text-black font-black uppercase tracking-widest">Enviar a Cobro</Text>
                        </TouchableOpacity>
                    </MotiView>
                </View>
            )}
        </SafeAreaView>
    );
}
