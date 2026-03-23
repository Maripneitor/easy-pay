import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthPhoneScreen() {

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]" edges={['top', 'bottom']}>
            <StatusBar style="light" />

            {/* Background effects (Matching Stitch radial gradient) */}
            <View className="absolute top-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <View className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] bg-[#1976D2]/10 rounded-full blur-[100px]" />
                <View className="absolute -bottom-[10%] -right-[10%] w-[80%] h-[80%] bg-[#0D47A1]/15 rounded-full blur-[100px]" />
            </View>

            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="w-full max-w-md mx-auto z-10">
                    <MotiView 
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center mb-8"
                    >
                        <View className="w-16 h-16 bg-[#64B5F6]/10 rounded-2xl items-center justify-center mb-4 border border-[#64B5F6]/20 shadow-glow">
                            <MaterialIcons name="smartphone" size={36} color="#64B5F6" />
                        </View>
                        <Text className="text-3xl font-bold tracking-tight text-white">Easy-Pay</Text>
                        <Text className="text-slate-400 mt-2 text-sm">Acceso rápido y seguro</Text>
                    </MotiView>

                    <MotiView 
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200 }}
                        className="bg-[#1e293b]/40 border border-white/10 p-8 rounded-[32px] shadow-2xl w-full"
                    >
                        <Text className="text-xl font-semibold text-center mb-6 text-slate-200">Ingresa con tu móvil</Text>
                        
                        <View className="space-y-6">
                            <View className="mb-6">
                                <Text className="text-sm font-medium text-slate-300 mb-2 ml-1">Número de teléfono</Text>
                                <View className="flex-row">
                                    <View className="bg-[#1e293b] border border-[#334155] border-r-0 rounded-l-xl flex-row items-center px-3 w-28 h-[52px]">
                                        <Text className="text-slate-300 flex-1 font-medium">+34 🇪🇸</Text>
                                        <MaterialIcons name="expand-more" size={16} color="#94a3b8" />
                                    </View>
                                    <TextInput
                                        className="bg-[#1e293b] border border-[#334155] text-slate-200 flex-1 pl-4 pr-3 py-3 rounded-r-xl font-medium h-[52px]"
                                        placeholder="600 000 000"
                                        placeholderTextColor="#475569"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                                <Text className="text-xs text-slate-500 mt-2 pl-1 italic">Te enviaremos un código de verificación.</Text>
                            </View>

                            <TouchableOpacity 
                                onPress={() => router.push('/security-2fa')}
                                className="active:scale-[0.98] mb-4 overflow-hidden rounded-xl"
                            >
                                <LinearGradient
                                    colors={['#2196F3', '#0D47A1']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="p-4 items-center"
                                >
                                    <Text className="text-white font-bold text-sm">Enviar Código</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={() => router.back()}
                                className="flex-row items-center justify-center py-2 active:opacity-70"
                            >
                                <MaterialIcons name="arrow-back" size={16} color="#64b5f6" />
                                <Text className="text-[#64b5f6] text-sm font-semibold ml-2">Volver al login con email</Text>
                            </TouchableOpacity>
                            
                            <View className="items-center mt-6 mb-6">
                                <View className="w-full h-[1px] bg-slate-700/50 absolute top-2" />
                                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-[#141f30] px-3 z-10">O continúa con</Text>
                            </View>

                            <View className="flex-row gap-3">
                                <TouchableOpacity className="flex-1 py-3 border border-slate-700 rounded-xl bg-[#1e293b] items-center justify-center active:bg-slate-700">
                                    <FontAwesome5 name="google" size={18} color="#cbd5e1" />
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 py-3 border border-slate-700 rounded-xl bg-[#1e293b] items-center justify-center active:bg-slate-700">
                                    <FontAwesome5 name="apple" size={20} color="#cbd5e1" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </MotiView>

                    <View className="mt-8 items-center">
                        <TouchableOpacity 
                            onPress={() => router.push('/(tabs)/dashboard')}
                            className="flex-row items-center px-6 py-2.5 border border-slate-600 rounded-full active:bg-white/5"
                        >
                            <Text className="text-slate-300 font-semibold text-sm mr-2">Continuar como Invitado</Text>
                            <MaterialIcons name="arrow-forward" size={18} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
