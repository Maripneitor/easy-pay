import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useMesa } from '../context/MesaContext';

const { width } = Dimensions.get('window');

// Mock Data for OCR vs Manual
const MOCK_COMPARISON = [
    { id: 'ocr-1', nombre: 'Hamburguesa Sonora', precioManual: 280, precioOCR: 285, matched: false, type: 'discrepancy' },
    { id: 'ocr-2', nombre: 'Papas Trufadas', precioManual: 120, precioOCR: 120, matched: true, type: 'match' },
    { id: 'ocr-3', nombre: 'Nachos Supreme', precioManual: 0, precioOCR: 180, matched: false, type: 'ocr-only' },
];

export default function OCRReviewScreen() {
    const { theme, fontScale } = useTheme();
    const { addItem, activeMesa } = useMesa();
    const router = useRouter();
    const [items, setItems] = useState(MOCK_COMPARISON);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            // In a real app, we'd iterate over findings and add them
            for (const item of items) {
                const finalPrice = item.type === 'discrepancy' || item.type === 'ocr-only' ? item.precioOCR : item.precioManual;
                if (finalPrice > 0) {
                    await addItem({
                        nombre: item.nombre,
                        precio: finalPrice,
                        cantidad: 1,
                        autorId: activeMesa?.liderId || '1',
                        asignadoA: []
                    });
                }
            }
            router.replace('/new-mesa');
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const useOCRValue = (id: string) => {
        setItems(prev => prev.map(item => 
            item.id === id ? { ...item, precioManual: item.precioOCR, matched: true, type: 'match' } : item
        ));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-6 py-4 flex-row items-center border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View className="ml-4 flex-1">
                    <Text style={{ color: theme.text }} className="text-xl font-black">Revisión OCR</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-xs font-bold uppercase tracking-widest">Comparativa vs. Ticket</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                <MotiView 
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="gap-6"
                >
                    {/* Resumen de Hallazgos */}
                    <View className="flex-row gap-4">
                        <View style={{ backgroundColor: theme.cardSecondary }} className="flex-1 p-4 rounded-3xl border border-white/5 items-center">
                            <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-black text-blue-400">
                                {items.filter(i => i.type === 'discrepancy').length}
                            </Text>
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase text-center mt-1">Diferencia</Text>
                        </View>
                        <View style={{ backgroundColor: theme.cardSecondary }} className="flex-1 p-4 rounded-3xl border border-white/5 items-center">
                            <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-black text-rose-500">
                                {items.filter(i => i.type === 'ocr-only').length}
                            </Text>
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase text-center mt-1">Faltante</Text>
                        </View>
                        <View style={{ backgroundColor: theme.cardSecondary }} className="flex-1 p-4 rounded-3xl border border-white/5 items-center">
                            <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-black text-emerald-500">
                                {items.filter(i => i.matched).length}
                            </Text>
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase text-center mt-1">Coincidencia</Text>
                        </View>
                    </View>

                    {/* Lista de Comparación */}
                    <View className="gap-4 pb-40">
                        {items.map((item) => (
                            <View 
                                key={item.id}
                                style={{ backgroundColor: theme.cardSecondary, borderColor: item.matched ? theme.border : (item.type === 'discrepancy' ? '#f59e0b' : '#3b82f6') }}
                                className="p-5 rounded-[32px] border"
                            >
                                <View className="flex-row justify-between items-start mb-3">
                                    <View className="flex-1">
                                        <Text style={{ color: theme.text }} className="text-lg font-black">{item.nombre}</Text>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <MaterialIcons name={item.matched ? "check-circle" : "error-outline"} size={14} color={item.matched ? "#10b981" : "#f59e0b"} />
                                            <Text style={{ color: theme.textSecondary }} className="text-xs font-bold">
                                                {item.type === 'match' && "Totalmente sincronizado"}
                                                {item.type === 'discrepancy' && "Precio difiere del ticket"}
                                                {item.type === 'ocr-only' && "Platillo detectado en ticket"}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex-row gap-4 items-center mt-2 pt-4 border-t border-white/5">
                                    <View className="flex-1 items-center">
                                        <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Manual</Text>
                                        <Text style={{ color: theme.text }} className="text-lg font-black">${item.precioManual || '--'}</Text>
                                    </View>
                                    
                                    <View style={{ backgroundColor: theme.border }} className="w-10 h-10 rounded-full items-center justify-center">
                                        <MaterialIcons name="arrow-forward" size={16} color={theme.text} />
                                    </View>

                                    <View className="flex-1 items-center">
                                        <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Ticket OCR</Text>
                                        <Text style={{ color: theme.primary }} className="text-lg font-black">${item.precioOCR || '--'}</Text>
                                    </View>
                                </View>
                                
                                {!item.matched && (
                                    <TouchableOpacity 
                                        onPress={() => useOCRValue(item.id)}
                                        className="mt-4 bg-slate-900 px-6 py-3 rounded-2xl items-center border border-white/5"
                                    >
                                        <Text style={{ color: theme.primary }} className="text-xs font-black uppercase tracking-widest">Usar valor del ticket</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                </MotiView>
            </ScrollView>

            <View className="px-8 pb-10 absolute bottom-0 left-0 right-0">
                <TouchableOpacity 
                    onPress={handleConfirm}
                    disabled={isLoading}
                    style={{ backgroundColor: theme.primary }}
                    className="w-full py-5 rounded-3xl items-center shadow-xl shadow-blue-500/20"
                >
                    {isLoading ? <ActivityIndicator color="black" /> : <Text className="text-black font-black uppercase tracking-[4px]">Confirmar Hallazgos</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
