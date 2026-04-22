import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    Dimensions,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/infrastructure/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function SettleUpScreen() {
    const { theme, fontScale } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* TopAppBar */}
            <View className="flex-row items-center justify-between px-6 py-4 w-full">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ backgroundColor: theme.cardSecondary }}
                    className="w-10 h-10 rounded-full items-center justify-center"
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight flex-1 text-center pr-10">Liquidar Deuda</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Summary Section */}
                <View className="flex flex-col items-center justify-center py-10 gap-2">
                    <Text style={{ color: theme.textSecondary }} className="text-sm font-medium tracking-wide">Total a Pagar</Text>
                    <Text style={{ fontSize: 48 * fontScale, color: theme.text }} className="font-black">$42.50</Text>
                </View>

                {/* Payment Method Section */}
                <View className="gap-4">
                    <Text style={{ color: theme.text }} className="text-lg font-bold">Método de Pago</Text>
                    <TouchableOpacity 
                        style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                        className="rounded-2xl p-4 flex-row items-center justify-between border"
                    >
                        <View className="flex-row items-center gap-4">
                            <View style={{ backgroundColor: theme.glassBg }} className="w-12 h-10 rounded-lg flex items-center justify-center">
                                <MaterialIcons name="credit-card" size={24} color={theme.primary} />
                            </View>
                            <View>
                                <Text style={{ color: theme.text }} className="font-bold">Visa terminada en 4242</Text>
                                <Text style={{ color: theme.textSecondary }} className="text-xs">Expira 12/25</Text>
                            </View>
                        </View>
                        <Text style={{ color: theme.primary }} className="font-bold text-sm">Cambiar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.push('/wallet/methods/new')}
                        style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                        className="w-full flex-row items-center justify-center gap-2 py-4 px-4 rounded-2xl border"
                    >
                        <MaterialIcons name="add" size={20} color={theme.primary} />
                        <Text style={{ color: theme.primary }} className="font-bold">Agregar nueva tarjeta</Text>
                    </TouchableOpacity>
                </View>

                {/* Transaction Details */}
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-2xl p-6 mt-8 border gap-4 shadow-sm">
                    <Text style={{ color: theme.text }} className="text-base font-bold mb-2">Detalles</Text>
                    <View className="flex-row justify-between items-center py-1">
                        <Text style={{ color: theme.textSecondary }} className="text-sm">Monto Original</Text>
                        <Text style={{ color: theme.text }} className="font-medium text-sm">$40.00</Text>
                    </View>
                    <View className="flex-row justify-between items-center py-1">
                        <Text style={{ color: theme.textSecondary }} className="text-sm">Propina (Elegida)</Text>
                        <Text style={{ color: theme.text }} className="font-medium text-sm">$2.50</Text>
                    </View>
                    <View style={{ backgroundColor: theme.border }} className="w-full h-px my-2" />
                    <View className="flex-row justify-between items-center pt-2">
                        <Text style={{ color: theme.text }} className="text-base font-bold">Total</Text>
                        <Text style={{ color: theme.primary }} className="font-black text-xl">$42.50</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Action */}
            <View 
                style={{ backgroundColor: theme.bg, borderColor: theme.border }} 
                className="absolute bottom-0 w-full pt-4 pb-10 px-6 border-t"
            >
                <View className="flex-row items-center justify-center gap-2 mb-4 opacity-60">
                    <MaterialIcons name="lock" size={14} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary }} className="text-xs font-medium tracking-wide">Pago Protegido y Encriptado</Text>
                </View>
                <TouchableOpacity 
                    activeOpacity={0.8}
                    className="w-full rounded-[1.5rem] overflow-hidden"
                >
                    <LinearGradient
                        colors={[theme.primary, theme.primary + 'CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="py-5 items-center justify-center"
                    >
                        <Text className="text-black font-black text-lg">Confirmar Pago</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
