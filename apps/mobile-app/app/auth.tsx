import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]">
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Background Floating Circles */}
                <View className="absolute top-0 left-0 w-96 h-96 bg-[#1976D2]/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                <View className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#1565C0]/10 blur-[80px] rounded-full translate-x-1/3 translate-y-1/3" />
                
                <ScrollView 
                    className="flex-1 px-6 mx-auto w-full max-w-md"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Header */}
                    <View className="items-center mb-8 z-10">
                        <View className="w-16 h-16 bg-[#64B5F6]/10 rounded-2xl items-center justify-center mb-4 border border-[#64B5F6]/20 shadow-lg shadow-blue-500/20">
                            <MaterialIcons name="confirmation-number" size={32} color="#64B5F6" />
                        </View>
                        <Text className="text-white text-3xl font-bold tracking-tight">Easy-Pay</Text>
                        <Text className="text-slate-400 mt-2 text-sm z-10">Sin matemáticas, sin dramas</Text>
                    </View>

                    {/* Glass Card */}
                    <View className="bg-slate-800/40 rounded-3xl p-8 border border-white/10 border-t-white/20 border-l-white/20 shadow-2xl z-10">
                        
                        {/* Toggle */}
                        <View className="flex-row bg-slate-800/50 p-1 rounded-xl mb-8">
                            <Pressable 
                                onPress={() => setIsLogin(true)}
                                className={`flex-1 py-2.5 items-center rounded-lg ${isLogin ? 'bg-slate-700 shadow-sm' : ''}`}
                            >
                                <Text className={`text-sm ${isLogin ? 'font-semibold text-white' : 'font-medium text-slate-400'}`}>Iniciar Sesión</Text>
                            </Pressable>
                            <Pressable 
                                onPress={() => setIsLogin(false)}
                                className={`flex-1 py-2.5 items-center rounded-lg ${!isLogin ? 'bg-slate-700 shadow-sm' : ''}`}
                            >
                                <Text className={`text-sm ${!isLogin ? 'font-semibold text-white' : 'font-medium text-slate-400'}`}>Registrarse</Text>
                            </Pressable>
                        </View>

                        {/* Form */}
                        <View className="space-y-6">
                            {!isLogin && (
                                <View className="gap-1 mb-6">
                                    <Text className="text-slate-300 text-sm font-medium">Nombre Completo</Text>
                                    <View className="relative justify-center">
                                        <View className="absolute left-3 z-10">
                                            <MaterialIcons name="person" size={20} color="#64748b" />
                                        </View>
                                        <TextInput 
                                            placeholder="Juan Pérez"
                                            placeholderTextColor="#64748b"
                                            className="bg-[#1e293b] border border-[#334155] text-white pl-10 pr-3 py-3 rounded-xl text-sm focus:border-[#2196F3]"
                                        />
                                    </View>
                                </View>
                            )}

                            <View className="gap-1 mb-6">
                                <Text className="text-slate-300 text-sm font-medium">Email</Text>
                                <View className="relative justify-center">
                                    <View className="absolute left-3 z-10">
                                        <MaterialIcons name="mail" size={20} color="#64748b" />
                                    </View>
                                    <TextInput 
                                        placeholder="tu@ejemplo.com"
                                        placeholderTextColor="#64748b"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        className="bg-[#1e293b] border border-[#334155] text-white pl-10 pr-3 py-3 rounded-xl text-sm focus:border-[#2196F3]"
                                    />
                                </View>
                            </View>

                            <View className="gap-1 mb-6">
                                <Text className="text-slate-300 text-sm font-medium">Contraseña</Text>
                                <View className="relative justify-center">
                                    <View className="absolute left-3 z-10">
                                        <MaterialIcons name="lock" size={20} color="#64748b" />
                                    </View>
                                    <TextInput 
                                        placeholder="••••••••"
                                        placeholderTextColor="#64748b"
                                        secureTextEntry
                                        className="bg-[#1e293b] border border-[#334155] text-white pl-10 pr-3 py-3 rounded-xl text-sm focus:border-[#2196F3]"
                                    />
                                </View>
                            </View>

                            {isLogin && (
                                <View className="flex-row items-center justify-between mb-6">
                                    <View className="flex-row items-center gap-2">
                                        <View className="w-4 h-4 rounded bg-[#1e293b] border border-[#334155]" />
                                        <Text className="text-slate-400 text-xs">Recordarme</Text>
                                    </View>
                                    <Pressable onPress={() => router.push('/password-recovery')}>
                                        <Text className="text-[#64B5F6] text-xs font-medium">¿Olvidaste tu contraseña?</Text>
                                    </Pressable>
                                </View>
                            )}

                            <Pressable 
                                onPress={() => router.push('/create-group')}
                                className="bg-[#2196F3] py-3.5 rounded-xl items-center shadow-lg active:bg-[#1976D2] mb-[32px]"
                            >
                                <Text className="text-white font-bold text-sm">
                                    {isLogin ? 'Entrar' : 'Registrarse'}
                                </Text>
                            </Pressable>
                        </View>

                        {/* Social Auth */}
                        <View className="mt-8">
                            <View className="relative mb-6">
                                <View className="absolute inset-0 flex items-center justify-center">
                                    <View className="w-full border-t border-slate-700" />
                                </View>
                                <View className="flex-row justify-center relative z-10">
                                    <Text className="text-slate-500 text-xs px-2 bg-transparent" style={{ backgroundColor: '#1e293b' }}>O continúa con</Text>
                                </View>
                            </View>
                            
                            <View className="flex-row gap-3">
                                <Pressable className="flex-1 border border-slate-700 bg-slate-800 py-2.5 rounded-xl justify-center items-center shadow-sm active:bg-slate-700">
                                    <FontAwesome5 name="google" size={18} color="#ef4444" />
                                </Pressable>
                                <Pressable className="flex-1 border border-slate-700 bg-slate-800 py-2.5 rounded-xl justify-center items-center shadow-sm active:bg-slate-700">
                                    <FontAwesome5 name="facebook" size={20} color="#3b5998" />
                                </Pressable>
                            </View>
                        </View>

                    </View>

                    {/* Guest Login */}
                    <View className="items-center mt-8 z-10">
                        <Pressable 
                            onPress={() => router.push('/(tabs)/dashboard')}
                            className="flex-row items-center px-6 py-2 border border-slate-600 rounded-full active:bg-white/5 active:border-slate-400"
                        >
                            <Text className="text-slate-300 font-medium text-sm">Continuar como Invitado</Text>
                            <MaterialIcons name="arrow-forward" size={18} color="#cbd5e1" style={{ marginLeft: 4 }} />
                        </Pressable>
                    </View>
                    
                    {/* Decorative stars / particles (simplified) */}
                    <View className="absolute top-10 left-10 w-2 h-2 bg-blue-300 rounded-full opacity-50 z-0" />
                    <View className="absolute bottom-40 left-10 w-1.5 h-1.5 bg-white rounded-full opacity-20 z-0" />
                    <View className="absolute top-20 right-10 w-1 h-1 bg-blue-400 rounded-full opacity-30 z-0" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
