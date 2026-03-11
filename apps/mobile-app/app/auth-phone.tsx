import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function AuthPhoneScreen() {

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]" edges={['top', 'bottom']}>
            <StatusBar style="light" />

            {/* Background effects */}
            <View className="absolute top-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <View className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
                <View className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-800/20 rounded-full blur-[120px]" />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
                <View className="w-full max-w-md mx-auto z-10">
                    <View className="flex flex-col items-center mb-8">
                        <View className="w-16 h-16 bg-blue-400/10 rounded-2xl items-center justify-center mb-4 border border-blue-400/20 shadow-lg shadow-blue-500/20">
                            <MaterialIcons name="smartphone" size={36} color="#60a5fa" />
                        </View>
                        <Text className="text-3xl font-bold tracking-tight text-white">Easy-Pay</Text>
                        <Text className="text-slate-400 mt-2 text-sm">Acceso rápido y seguro</Text>
                    </View>

                    <View className="bg-slate-800/40 border border-white/10 p-8 rounded-3xl shadow-2xl w-full">
                        <Text className="text-xl font-semibold text-center mb-6 text-slate-200">Ingresa con tu móvil</Text>
                        
                        <View className="space-y-6">
                            <View className="mb-6">
                                <Text className="block text-sm font-medium text-slate-300 mb-1">Número de teléfono</Text>
                                <View className="flex-row">
                                    <View className="bg-[#1e293b] border border-[#334155] border-r-0 rounded-l-xl flex-row items-center px-3 w-28">
                                        <Text className="text-slate-300 flex-1">+34 🇪🇸</Text>
                                        <MaterialIcons name="expand-more" size={16} color="#94a3b8" />
                                    </View>
                                    <TextInput
                                        className="bg-[#1e293b] border-l border-[#334155] text-slate-200 flex-1 pl-4 pr-3 py-3 rounded-r-xl"
                                        placeholder="600 000 000"
                                        placeholderTextColor="#64748b"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                                <Text className="text-xs text-slate-500 mt-1 pl-1">Te enviaremos un código de verificación.</Text>
                            </View>

                            <Pressable 
                                onPress={() => router.push('/security-2fa')}
                                className="bg-[#2196F3] py-3.5 rounded-xl shadow-lg shadow-blue-500/40 active:scale-[0.98] items-center mb-4"
                            >
                                <Text className="text-white font-bold text-sm">Enviar Código</Text>
                            </Pressable>

                            <View className="items-center mb-6">
                                <Pressable 
                                    onPress={() => router.back()}
                                    className="flex-row items-center active:opacity-70"
                                >
                                    <MaterialIcons name="arrow-back" size={16} color="#64b5f6" className="mr-1" />
                                    <Text className="text-[#64b5f6] text-sm font-medium ml-1">Volver al login con email</Text>
                                </Pressable>
                            </View>
                            
                            <View className="mb-6">
                                <View className="relative flex items-center justify-center">
                                    <View className="absolute w-full border-t border-slate-700"></View>
                                    <Text className="bg-[#1e293b] px-2 text-xs text-slate-500 relative z-10">O continúa con</Text>
                                </View>
                            </View>

                            <View className="flex-row gap-3">
                                <Pressable className="flex-1 py-2.5 border border-slate-700 rounded-xl bg-slate-800 items-center justify-center active:bg-slate-700">
                                    <FontAwesome5 name="google" size={18} color="#cbd5e1" />
                                </Pressable>
                                <Pressable className="flex-1 py-2.5 border border-slate-700 rounded-xl bg-slate-800 items-center justify-center active:bg-slate-700">
                                    <FontAwesome5 name="apple" size={20} color="#cbd5e1" />
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    <View className="mt-8 items-center">
                        <Pressable 
                            onPress={() => router.push('/(tabs)/dashboard')}
                            className="flex-row items-center px-6 py-2 border border-slate-600 rounded-full active:border-slate-400 active:bg-white/5"
                        >
                            <Text className="text-slate-300 font-medium text-sm mr-1">Continuar como Invitado</Text>
                            <MaterialIcons name="arrow-forward" size={18} color="#cbd5e1" />
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
