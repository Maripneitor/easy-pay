import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { MotiView, AnimatePresence } from 'moti';

const { width } = Dimensions.get('window');

const GROUPS = [
    { id: 'g1', name: 'Viaje Playa', members: 5, balance: '+$480.00', status: 'Deben en grupo', type: 'beach-access' },
    { id: 'g2', name: 'Mesa #4', members: 3, balance: '-$120.00', status: 'Debes en grupo', type: 'restaurant' },
    { id: 'g3', name: 'Amigos Tech', members: 8, balance: '$0.00', status: 'Saldado', type: 'laptop' },
];

export default function GroupListScreen() {
    const { theme, fontScale } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView 
                className="flex-1 px-6 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-10 py-4">
                    <View>
                        <Text style={{ color: theme.text, fontSize: 32 * fontScale }} className="font-black tracking-tighter leading-none">GRUPOS</Text>
                        <Text style={{ color: theme.primary, fontSize: 9 * fontScale }} className="font-black uppercase tracking-[3px] mt-2">Gastos Compartidos</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => router.push('/create-group')}
                        style={{ backgroundColor: theme.primary, shadowColor: theme.primary }}
                        className="w-12 h-12 rounded-[18px] items-center justify-center shadow-lg shadow-pink-500/30"
                    >
                        <Ionicons name="add" size={28} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Groups List */}
                <View className="gap-6">
                    {GROUPS.length > 0 ? (
                        GROUPS.map((group, index) => (
                            <MotiView 
                                key={group.id}
                                from={{ opacity: 0, scale: 0.9, translateY: 10 }}
                                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                                transition={{ delay: index * 100 }}
                            >
                                <TouchableOpacity 
                                    onPress={() => router.push({ pathname: '/(tabs)/group/[id]', params: { id: group.id } } as any)}
                                    activeOpacity={0.85}
                                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                    className="border rounded-[36px] p-6 flex-row items-center"
                                >
                                    <View style={{ backgroundColor: theme.glassBg }} className="w-16 h-16 rounded-[24px] items-center justify-center mr-5 border border-white/5">
                                        <MaterialIcons name={group.type as any} size={32} color={theme.primary} />
                                    </View>
                                    <View className="flex-1">
                                        <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight">{group.name}</Text>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Ionicons name="people" size={12} color={theme.textSecondary} />
                                            <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest">{group.members} MIEMBROS</Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text style={{ 
                                            color: group.balance.startsWith('+') ? '#10b981' : group.balance.startsWith('-') ? '#f43f5e' : theme.textSecondary,
                                            fontSize: 16 * fontScale
                                        }} className="font-black">
                                            {group.balance}
                                        </Text>
                                        <Text style={{ fontSize: 8 * fontScale }} className="text-slate-500 font-black uppercase mt-1 tracking-tighter">{group.status}</Text>
                                    </View>
                                </TouchableOpacity>
                            </MotiView>
                        ))
                    ) : (
                        <MotiView 
                            from={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="items-center justify-center py-20 opacity-40"
                        >
                            <MaterialCommunityIcons name="group" size={60} color={theme.textSecondary} />
                            <Text className="text-white text-lg font-bold mt-4">Aún no tienes grupos</Text>
                            <Text className="text-slate-500 text-sm text-center mt-2 px-10">Crea un grupo para dividir la cuenta de una cena o un viaje de forma fácil.</Text>
                        </MotiView>
                    )}
                </View>

                {/* Suggested Action Bar */}
                <MotiView 
                    from={{ opacity: 0, translateY: 40 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 500 }}
                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                    className="mt-12 rounded-[32px] border p-8 items-center"
                >
                    <Ionicons name="rocket-outline" size={32} color={theme.primary} />
                    <Text style={{ color: theme.text, fontSize: 15 * fontScale }} className="font-black text-center mt-4">¿Dividir un gasto rápido?</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="text-center mt-2 px-4 leading-5 font-bold">Usa el botón QR o crea un grupo temporal para cobrar al instante.</Text>
                    <TouchableOpacity 
                        style={{ backgroundColor: theme.glassBg, borderColor: theme.border }}
                        className="mt-6 px-8 py-3 rounded-full border"
                    >
                        <Text style={{ color: theme.text, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest">Saber Más</Text>
                    </TouchableOpacity>
                </MotiView>
            </ScrollView>

            {/* BOTÓN FLOTANTE (FAB) */}
            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => router.push('/new-mesa')}
                style={{ backgroundColor: theme.primary }}
                className="absolute bottom-10 right-6 w-16 h-16 rounded-[24px] items-center justify-center shadow-2xl shadow-blue-500/40"
            >
                <MaterialIcons name="add" size={32} color="black" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
