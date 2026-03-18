import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@easy-pay/ui';
import { StatusBar } from 'expo-status-bar';

export default function PasswordRecoveryScreen() {
    const [email, setEmail] = useState('');

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]">
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView 
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Background Decorative Particles */}
                    <View className="absolute inset-0 opacity-20">
                        <View className="w-2 h-2 rounded-full bg-blue-500 absolute top-20 left-10" />
                        <View className="w-1 h-1 rounded-full bg-blue-300 absolute top-40 right-20" />
                        <View className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-40 left-1/4" />
                        <View className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
                        <View className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]" />
                    </View>

                    {/* Top Bar */}
                    <View className="px-6 py-4 flex-row justify-between items-center">
                        <Pressable 
                            onPress={() => router.back()}
                            className="flex-row items-center gap-2"
                        >
                            <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center border border-white/10">
                                <MaterialIcons name="confirmation-number" size={24} color={Colors.coolSky} />
                            </View>
                            <Text className="text-white font-bold text-xl tracking-tight">Easy-Pay</Text>
                        </Pressable>
                        <Pressable className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center border border-white/5 shadow-sm">
                            <MaterialIcons name="light-mode" size={20} color="#94a3b8" />
                        </Pressable>
                    </View>

                    {/* Main Content */}
                    <View className="flex-1 justify-center px-6 pb-20">
                        <View className="bg-slate-800/40 rounded-[40px] p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
                            {/* Hero Icon */}
                            <View className="items-center mb-8">
                                <View className="w-16 h-16 rounded-2xl bg-blue-500/20 items-center justify-center mb-6 border border-blue-500/30">
                                    <MaterialIcons name="lock-reset" size={40} color={Colors.coolSky} />
                                </View>
                                <Text className="text-white text-2xl font-black text-center mb-3">¿Olvidaste tu contraseña?</Text>
                                <Text className="text-slate-400 text-sm text-center leading-relaxed max-w-[280px]">
                                    Introduce tu email y te enviaremos las instrucciones para restablecerla.
                                </Text>
                            </View>

                            {/* Recovery Form */}
                            <View className="gap-6">
                                <View>
                                    <Text className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Email</Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-4 z-10">
                                            <MaterialIcons name="mail-outline" size={20} color="#64748b" />
                                        </View>
                                        <TextInput 
                                            placeholder="tu@email.com"
                                            placeholderTextColor="#475569"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            className="bg-slate-900/50 border border-slate-700 text-white px-12 py-4 rounded-2xl font-medium"
                                        />
                                    </View>
                                </View>

                                <Pressable 
                                    onPress={() => {
                                        // Accción de recuperación
                                    }}
                                    className="bg-blue-600 py-5 rounded-2xl items-center shadow-lg shadow-blue-500/30 active:scale-95 flex-row justify-center gap-2"
                                    style={{ backgroundColor: Colors.brilliantAzure }}
                                >
                                    <Text className="text-white font-black text-lg">Enviar instrucciones</Text>
                                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                                </Pressable>
                            </View>

                            {/* Footer Link */}
                            <View className="mt-8 pt-6 border-t border-slate-700/50">
                                <Pressable 
                                    onPress={() => router.push('/auth')}
                                    className="flex-row items-center justify-center gap-2"
                                >
                                    <MaterialIcons name="arrow-back" size={18} color={Colors.coolSky} />
                                    <Text className="text-blue-400 font-bold text-sm">Volver al inicio de sesión</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Branding Footer */}
                        <View className="mt-8">
                            <Text className="text-slate-600 text-[10px] text-center font-black uppercase tracking-[3px]">
                                SECURE PAYMENTS BY EASY-PAY
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
