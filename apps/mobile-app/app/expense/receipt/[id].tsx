import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { useTheme } from '../../../src/infrastructure/context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ReceiptDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme, fontScale } = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 14 * fontScale }} className="font-black uppercase tracking-widest">Recibo Digital</Text>
                <TouchableOpacity>
                    <MaterialIcons name="share" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}>
                {/* Receipt Card */}
                <MotiView 
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    style={{ backgroundColor: theme.card, borderColor: theme.border }}
                    className="rounded-[40px] border p-8 items-center relative overflow-hidden"
                >
                    <View className="absolute top-0 left-0 right-0 h-2 bg-emerald-500" />
                    
                    <View style={{ backgroundColor: theme.glassBg }} className="w-20 h-20 rounded-[24px] items-center justify-center mb-6">
                        <MaterialIcons name="directions-car" size={40} color={theme.primary} />
                    </View>

                    <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-black text-center mb-2">Uber Fiesta</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="font-black uppercase tracking-widest mb-6">PERSONAL</Text>
                    
                    <View className="w-full border-t border-dashed border-white/10 my-6" />
                    
                    <View className="w-full gap-4">
                        <View className="flex-row justify-between">
                            <Text style={{ color: theme.textSecondary }} className="font-bold">Fecha</Text>
                            <Text style={{ color: theme.text }} className="font-black text-right">18 de Marzo, 2024</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text style={{ color: theme.textSecondary }} className="font-bold">Pagado por</Text>
                            <Text style={{ color: theme.text }} className="font-black text-right">Ana Sofía</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text style={{ color: theme.textSecondary }} className="font-bold">Tu Parte</Text>
                            <Text className="text-emerald-500 font-black text-right">+$15.50</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text style={{ color: theme.textSecondary }} className="font-bold">Estado</Text>
                            <View className="bg-emerald-500/10 px-3 py-1 rounded-lg">
                                <Text className="text-emerald-500 text-[10px] font-black uppercase">Completado</Text>
                            </View>
                        </View>
                    </View>

                    <View className="w-full border-t border-dashed border-white/10 my-6" />
                    
                    <View className="w-full items-center">
                        <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest mb-4">Referencia</Text>
                        <View style={{ backgroundColor: theme.glassBg }} className="p-4 rounded-3xl">
                            <Ionicons name="qr-code-outline" size={150} color={theme.text} />
                        </View>
                        <Text style={{ color: theme.textSecondary, fontSize: 9 * fontScale }} className="mt-4 font-mono">TXN_982347201948</Text>
                    </View>
                </MotiView>

                <TouchableOpacity 
                    className="mt-10 mb-20 py-5 rounded-[24px] items-center"
                    style={{ backgroundColor: theme.glassBg, borderColor: theme.border, borderWidth: 1 }}
                >
                    <Text style={{ color: theme.text, fontSize: 12 * fontScale }} className="font-black uppercase tracking-widest">Descargar PDF</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
