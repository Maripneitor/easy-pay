import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions, 
    Image, 
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { useTheme } from '../../../src/infrastructure/context/ThemeContext';
import { SHARED_USER } from '../../../src/infrastructure/constants/MockUser';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock Data for "Grupo"
const MOCK_HISTORY = [
    { id: 'h1', title: 'Boletos de Avión', group: 'Cancún 2024', date: 'Hace 3 días', amount: 4500.0, paidBy: 'Tú', assigned: ['Tú', 'Ana', 'Carlos'], expanded: false },
    { id: 'h2', title: 'Súper (Chedraui)', group: 'Roomies', date: 'Ayer', amount: 1200.50, paidBy: 'Ana', assigned: ['Tú', 'Ana'], expanded: false },
    { id: 'h3', title: 'Gasolina', group: 'Viaje Valle', date: 'Hace 1 semana', amount: 800.0, paidBy: 'Carlos', assigned: ['Ana', 'Carlos'], expanded: false },
];

const MOCK_BALANCES = [
    { id: 'b1', name: 'Ana', avatar: 'https://i.pravatar.cc/150?u=ana', status: 'Debe', amount: 450.0, color: '#ec4899' },
    { id: 'b2', name: 'Carlos', avatar: 'https://i.pravatar.cc/150?u=carlos', status: 'Debes', amount: 120.0, color: '#10b981' },
];

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme, fontScale } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'balances' | 'history'>('balances');
    const [history, setHistory] = useState(MOCK_HISTORY);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setHistory(prev => prev.map(item => ({
            ...item,
            expanded: item.id === id ? !item.expanded : false
        })));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* CABECERA (Header) */}
            <View className="px-6 py-4 flex-row items-center justify-between z-20">
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">Viaje a Cancún</Text>
                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={22} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* CABECERA DE CONTEXTO */}
                <View className="px-6 py-6">
                    <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-[40px] border p-8 items-center overflow-hidden">
                        {/* Status Resumen Personal */}
                        <MotiView 
                            from={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="items-center"
                        >
                            <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="font-black uppercase tracking-[3px] mb-2 text-center">Tu Estado</Text>
                            <Text style={{ color: '#10b981', fontSize: 36 * fontScale }} className="font-black text-center tracking-tighter">Te deben $450</Text>
                            <View 
                                style={{ backgroundColor: '#10b98110', borderColor: '#10b98130' }}
                                className="px-4 py-1 rounded-full mt-4 border"
                            >
                                <Text className="text-[#10b981] text-[10px] font-black uppercase tracking-widest">Saldo a Favor</Text>
                            </View>
                        </MotiView>
                    </View>
                </View>

                {/* BOTÓN "LIQUIDAR" (KING) */}
                <View className="px-6 mb-8">
                    <TouchableOpacity 
                        onPress={() => router.push('/(tabs)/payments')}
                        style={{ backgroundColor: theme.primary }}
                        className="w-full h-16 rounded-[24px] items-center justify-center shadow-xl shadow-blue-500/30 flex-row gap-3"
                    >
                        <MaterialIcons name="account-balance-wallet" size={20} color="black" />
                        <Text className="text-black font-black uppercase tracking-widest text-sm">Liquidar Deuda</Text>
                    </TouchableOpacity>
                </View>

                {/* TABS NAVEGACIÓN */}
                <View className="px-6 mb-6">
                    <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="flex-row rounded-3xl p-1.5 border">
                        <TouchableOpacity 
                            onPress={() => setActiveTab('balances')}
                            style={{ backgroundColor: activeTab === 'balances' ? theme.card : 'transparent' }}
                            className="flex-1 py-3 rounded-2xl items-center"
                        >
                            <Text style={{ color: activeTab === 'balances' ? theme.text : theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest">Saldos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setActiveTab('history')}
                            style={{ backgroundColor: activeTab === 'history' ? theme.card : 'transparent' }}
                            className="flex-1 py-3 rounded-2xl items-center"
                        >
                            <Text style={{ color: activeTab === 'history' ? theme.text : theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest">Gastos</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* LISTA DINÁMICA */}
                <View className="px-6">
                    {activeTab === 'balances' ? (
                        <View className="gap-4">
                            {MOCK_BALANCES.map(item => (
                                <MotiView 
                                    key={item.id}
                                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                    className="p-5 rounded-[32px] border flex-row items-center justify-between"
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View style={{ borderColor: item.color }} className="w-12 h-12 rounded-2xl border-2 p-0.5">
                                            <Image source={{ uri: item.avatar }} className="w-full h-full rounded-[14px]" />
                                        </View>
                                        <View>
                                            <Text style={{ color: theme.text, fontSize: 15 * fontScale }} className="font-black">{item.name}</Text>
                                            <Text style={{ color: item.status === 'Debe' ? '#10b981' : '#f43f5e', fontSize: 10 * fontScale }} className="font-bold uppercase">{item.status}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight">${item.amount}</Text>
                                </MotiView>
                            ))}
                        </View>
                    ) : (
                        <View className="gap-4">
                            {history.map(item => (
                                <TouchableOpacity 
                                    key={item.id}
                                    activeOpacity={0.9}
                                    onPress={() => toggleExpand(item.id)}
                                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                    className="p-5 rounded-[32px] border"
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center gap-4">
                                            <View style={{ backgroundColor: theme.glassBg }} className="w-12 h-12 rounded-2xl items-center justify-center">
                                                <MaterialIcons name="receipt" size={24} color={theme.primary} />
                                            </View>
                                            <View>
                                                <Text style={{ color: theme.text, fontSize: 15 * fontScale }} className="font-black">{item.title}</Text>
                                                <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-bold uppercase">{item.paidBy} pagó</Text>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">${item.amount.toLocaleString()}</Text>
                                            <Text style={{ color: theme.textSecondary, fontSize: 9 * fontScale }} className="font-medium text-slate-500">{item.date}</Text>
                                        </View>
                                    </View>
                                    
                                    {item.expanded && (
                                        <MotiView 
                                            from={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-6 pt-6 border-t border-white/5"
                                        >
                                            <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest mb-4">Detalle de División</Text>
                                            <View className="gap-2">
                                                {item.assigned.map(name => (
                                                    <View key={name} className="flex-row justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                        <Text style={{ color: theme.text, fontSize: 12 * fontScale }} className="font-bold text-slate-400">{name}</Text>
                                                        <Text style={{ color: theme.primary, fontSize: 12 * fontScale }} className="font-black">${(item.amount / item.assigned.length).toFixed(2)}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </MotiView>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* BOTÓN FLOTANTE (FAB) */}
            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => router.push('/new-mesa')}
                style={{ backgroundColor: theme.primary }}
                className="absolute bottom-8 right-6 w-16 h-16 rounded-[24px] items-center justify-center shadow-2xl shadow-blue-500/40"
            >
                <MaterialIcons name="add" size={32} color="black" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

