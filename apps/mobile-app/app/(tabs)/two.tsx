import React from 'react';
import { ScrollView, View, Text, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function HistoryScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]">
            <StatusBar style="light" />
            
            <View className="px-6 py-8">
                <Text className="text-white text-3xl font-bold tracking-tight">Historial</Text>
                <Text className="text-slate-400 text-sm mt-1">Tus gastos y pagos pasados</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="items-center justify-center py-20 opacity-40">
                    <View className="w-20 h-20 rounded-full bg-slate-800 items-center justify-center mb-4">
                        <MaterialIcons name="history" size={40} color="#64748b" />
                    </View>
                    <Text className="text-white text-lg font-bold">Sin actividad reciente</Text>
                    <Text className="text-slate-500 text-sm text-center mt-2 px-10">
                        Aquí verás los grupos que hayas liquidado y tus facturas pasadas.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
