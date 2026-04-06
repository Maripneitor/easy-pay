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
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-bold">Viaje a Cancún</Text>
                <TouchableOpacity className="p-2 -mr-2">
                    <Ionicons name="ellipsis-horizontal" size={22} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
                {/* RESUMEN SIMPLIFICADO */}
                <View className="px-6 py-4">
                    <MotiView 
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        className="items-center py-6"
                    >
                        <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale, opacity: 0.6 }} className="font-medium mb-1 tracking-wider uppercase">Tu saldo actual</Text>
                        <Text style={{ color: '#10b981', fontSize: 42 * fontScale }} className="font-bold tracking-tighter">+$450.00</Text>
                        
                        <View className="flex-row gap-4 mt-8 w-full">
                            <TouchableOpacity 
                                onPress={() => router.push('/(tabs)/payments')}
                                style={{ backgroundColor: theme.primary }}
                                className="flex-1 h-14 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/20"
                            >
                                <Text className="text-black font-bold text-sm">Liquidar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                className="flex-1 h-14 rounded-2xl border items-center justify-center"
                            >
                                <Text style={{ color: theme.text }} className="font-bold text-sm">Gasto</Text>
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                </View>

                {/* TABS NAVEGACIÓN SIMPLIFICADA */}
                <View className="px-6 mb-8 mt-4">
                    <View className="flex-row gap-8 border-b" style={{ borderColor: theme.border + '20' }}>
                        <TouchableOpacity 
                            onPress={() => setActiveTab('balances')}
                            className="pb-3"
                            style={{ borderBottomWidth: activeTab === 'balances' ? 2 : 0, borderBottomColor: theme.primary }}
                        >
                            <Text style={{ 
                                color: activeTab === 'balances' ? theme.text : theme.textSecondary, 
                                fontSize: 14 * fontScale,
                                fontWeight: activeTab === 'balances' ? '700' : '500'
                            }}>Participantes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setActiveTab('history')}
                            className="pb-3"
                            style={{ borderBottomWidth: activeTab === 'history' ? 2 : 0, borderBottomColor: theme.primary }}
                        >
                            <Text style={{ 
                                color: activeTab === 'history' ? theme.text : theme.textSecondary, 
                                fontSize: 14 * fontScale,
                                fontWeight: activeTab === 'history' ? '700' : '500'
                            }}>Historial</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* LISTA DINÁMICA CON MEJOR JERARQUÍA */}
                <View className="px-6">
                    {activeTab === 'balances' ? (
                        <View className="gap-6">
                            {MOCK_BALANCES.map(item => (
                                <MotiView 
                                    key={item.id}
                                    className="flex-row items-center justify-between"
                                >
                                    <View className="flex-row items-center gap-4">
                                        <Image source={{ uri: item.avatar }} className="w-12 h-12 rounded-full" />
                                        <View>
                                            <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-semibold">{item.name}</Text>
                                            <View className="h-1" />
                                            <Text 
                                                style={{ color: item.status === 'Debe' ? '#10b981' : '#f43f5e', fontSize: 11 * fontScale, opacity: 0.8 }} 
                                                className="font-medium"
                                            >
                                                {item.status === 'Debe' ? 'Te debe' : 'Le debes'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-bold">${item.amount}</Text>
                                </MotiView>
                            ))}
                        </View>
                    ) : (
                        <View className="gap-8">
                            {history.map(item => (
                                <TouchableOpacity 
                                    key={item.id}
                                    activeOpacity={0.7}
                                    onPress={() => toggleExpand(item.id)}
                                    className="overflow-hidden"
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center gap-4 flex-1">
                                            <View 
                                                style={{ backgroundColor: theme.cardSecondary }} 
                                                className="w-12 h-12 rounded-2xl items-center justify-center"
                                            >
                                                <MaterialIcons name="receipt-long" size={22} color={theme.textSecondary} />
                                            </View>
                                            <View className="flex-1">
                                                <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-semibold">{item.title}</Text>
                                                <View className="h-1" />
                                                <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale, opacity: 0.6 }} className="font-medium">
                                                    {item.paidBy} pagó • {item.date}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="items-end ml-4">
                                            <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-bold">${item.amount.toLocaleString()}</Text>
                                        </View>
                                    </View>
                                    
                                    {item.expanded && (
                                        <MotiView 
                                            from={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 ml-16"
                                        >
                                            <View className="h-[1px] w-full mb-4" style={{ backgroundColor: theme.border + '15' }} />
                                            <View className="gap-3">
                                                {item.assigned.map(name => (
                                                    <View key={name} className="flex-row justify-between items-center pr-4">
                                                        <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="font-medium">{name}</Text>
                                                        <Text style={{ color: theme.text, fontSize: 13 * fontScale }} className="font-semibold">${(item.amount / item.assigned.length).toFixed(2)}</Text>
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

            {/* BOTÓN FLOTANTE DISCRETO */}
            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => router.push('/new-mesa')}
                style={{ backgroundColor: theme.text }}
                className="absolute bottom-8 right-8 w-14 h-14 rounded-full items-center justify-center shadow-xl shadow-black/20"
            >
                <Ionicons name="add" size={30} color={theme.bg} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
