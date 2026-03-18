import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function SecurityScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10">
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-black">Seguridad de Pago</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="items-center py-10">
                    <View className="w-24 h-24 bg-emerald-500/10 rounded-full items-center justify-center mb-6">
                        <MaterialIcons name="verified-user" size={48} color="#10b981" />
                    </View>
                    <Text className="text-white text-2xl font-black text-center mb-2">Tus pagos están protegidos</Text>
                    <Text className="text-slate-500 text-center px-4 leading-relaxed font-medium">Utilizamos estándares bancarios para proteger tu información financiera.</Text>
                </View>

                <View className="gap-4 pb-20">
                    {[
                        { icon: 'lock', title: 'Cifrado de Extremo a Extremo', desc: 'Tus datos de tarjeta nunca se guardan en texto plano en nuestros servidores.' },
                        { icon: 'fingerprint', title: 'Verificación Biométrica', desc: 'Solicitamos FaceID o Huella antes de autorizar cualquier pago importante.' },
                        { icon: 'verified', title: 'Tokenización PCI-DSS', desc: 'Cumplimos con las normas internacionales de seguridad de datos de la industria de pagos.' },
                        { icon: 'smartphone', title: 'Sesiones Activas', desc: 'Gestiona qué dispositivos pueden realizar pagos con tu cuenta.' },
                    ].map((item, i) => (
                        <View key={i} className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex-row gap-5 items-center">
                            <View className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/5">
                                <MaterialIcons name={item.icon as any} size={24} color="#94a3b8" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black text-base">{item.title}</Text>
                                <Text className="text-slate-500 text-xs font-medium leading-relaxed mt-1">{item.desc}</Text>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity className="mt-10 bg-blue-600 p-6 rounded-[28px] items-center justify-center shadow-lg shadow-blue-500/20">
                        <Text className="text-white font-black uppercase tracking-widest text-[11px]">Verificar Identidad Ahora</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
