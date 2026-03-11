import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Security2FAScreen() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);

    const updateCode = (val: string, index: number) => {
        const newCode = [...code];
        newCode[index] = val;
        setCode(newCode);

        // Auto focus next
        if (val && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Navbar */}
            <View className="flex-row items-center justify-between border-b border-white/5 bg-[#0f172a]/80 px-6 py-4 z-50">
                <Pressable onPress={() => router.back()} className="flex-row items-center gap-3 active:opacity-70">
                    <View className="w-8 h-8 rounded-lg bg-blue-500/10 items-center justify-center">
                        <MaterialIcons name="account-balance-wallet" size={20} color="#3b82f6" />
                    </View>
                    <Text className="text-white text-xl font-bold tracking-tight">Easy-Pay</Text>
                </Pressable>
                
                <View className="flex-row items-center gap-6">
                    <Pressable className="flex-row items-center gap-2 active:opacity-70 hidden sm:flex">
                        <MaterialIcons name="help" size={20} color="#94a3b8" />
                        <Text className="text-sm font-medium text-slate-400">Ayuda</Text>
                    </Pressable>
                    <View className="w-[1px] h-8 bg-white/10 hidden sm:flex" />
                    <View className="flex-row items-center gap-3">
                        <View className="flex-col items-end mr-2 hidden sm:flex">
                            <Text className="text-sm font-semibold text-white">Alex Morgan</Text>
                            <Text className="text-xs text-slate-400">Personal Account</Text>
                        </View>
                        <View className="w-10 h-10 rounded-full bg-slate-700 border-2 border-white/10 overflow-hidden items-center justify-center">
                            <MaterialIcons name="person" size={24} color="#94a3b8" />
                        </View>
                    </View>
                </View>
            </View>

            {/* Main Content */}
            <ScrollView 
                className="flex-1 px-4 sm:px-6 lg:px-8"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Background Decorative Elements */}
                <View className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
                    <View className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                    <View className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                </View>

                {/* Card */}
                <View className="w-full max-w-lg mx-auto bg-slate-800/40 rounded-2xl shadow-2xl border border-white/5">
                    
                    {/* Card Header */}
                    <View className="p-6 sm:p-8 border-b border-white/5">
                        <View className="flex-row items-center gap-3 mb-2">
                            <View className="p-2 bg-blue-500/10 rounded-lg">
                                <MaterialIcons name="security" size={24} color="#60a5fa" />
                            </View>
                            <Text className="text-2xl font-bold text-white tracking-tight">Seguridad: 2FA</Text>
                        </View>
                        <Text className="text-slate-400 text-sm leading-relaxed mt-1">
                            Añade una capa extra de seguridad a tu cuenta escaneando el código con tu app de autenticación (Google Authenticator/Authy).
                        </Text>
                    </View>

                    {/* Card Body */}
                    <View className="p-6 sm:p-8 space-y-8 gap-8">
                        {/* Step 1: QR Code */}
                        <View className="items-center">
                            <View className="bg-white p-3 rounded-xl shadow-lg shadow-black/20 mb-4">
                                <View className="w-40 h-40 items-center justify-center border-4 border-white bg-white">
                                    <MaterialIcons name="qr-code-2" size={140} color="black" />
                                </View>
                            </View>
                            <View className="items-center">
                                <Text className="text-xs font-mono text-slate-400 mb-2">Llave secreta: <Text className="text-white">J2K4 M5N6 P7Q8 R9S0</Text></Text>
                                <Pressable className="flex-row items-center gap-1 active:opacity-70">
                                    <MaterialIcons name="content-copy" size={16} color="#3b82f6" />
                                    <Text className="text-[#3b82f6] text-sm font-medium">Copiar llave</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Step 2: Input Code */}
                        <View className="gap-4">
                            <Text className="text-sm font-medium text-slate-300 text-center">Ingresa el código de 6 dígitos</Text>
                            <View className="flex-row justify-center items-center gap-2 sm:gap-3">
                                {code.map((char, i) => (
                                    <React.Fragment key={i}>
                                        {i === 3 && <Text className="text-slate-600">-</Text>}
                                        <TextInput 
                                            ref={(el) => { inputs.current[i] = el; }}
                                            value={char}
                                            onChangeText={(v) => updateCode(v, i)}
                                            keyboardType="numeric"
                                            maxLength={1}
                                            className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900/50 border border-slate-700 rounded-lg text-center text-xl font-bold text-white focus:border-[#3b82f6]"
                                            selectionColor="#3b82f6"
                                        />
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="gap-3 pt-2">
                            <Pressable 
                                onPress={() => router.push('/(tabs)/dashboard')}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-[#208af3] bg-[#208af3] rounded-lg shadow-lg shadow-blue-500/25 flex-row items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                <Text className="text-white font-bold">Confirmar Activación</Text>
                                <MaterialIcons name="arrow-forward" size={18} color="white" />
                            </Pressable>
                            <Pressable 
                                onPress={() => router.back()}
                                className="w-full py-3 px-4 bg-transparent border border-slate-600 rounded-lg shadow-sm flex-row justify-center items-center active:scale-[0.98] active:border-slate-400"
                            >
                                <Text className="text-slate-300 font-medium">Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Backup Codes Footer */}
                    <View className="bg-slate-900/40 p-6 sm:p-8 rounded-b-2xl border-t border-white/5">
                        <View className="flex-row items-center gap-2 mb-4">
                            <MaterialIcons name="lock-person" size={18} color="#f59e0b" />
                            <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Códigos de respaldo</Text>
                        </View>
                        
                        <View className="flex-row flex-wrap gap-3 justify-between">
                            {['X9A2-BC34', 'L1M0-P9Q8', 'R5T6-Y7U8', 'K9J8-H7G6'].map(codeStr => (
                                <Pressable key={codeStr} className="bg-black/30 p-2.5 rounded border border-white/5 w-[47%] items-center active:bg-white/5">
                                    <Text className="font-mono text-xs sm:text-sm text-slate-400 tracking-wider hover:text-white">{codeStr}</Text>
                                </Pressable>
                            ))}
                        </View>
                        
                        <Text className="text-xs text-slate-500 mt-4 text-center">
                            Guarda estos códigos en un lugar seguro. Podrás usarlos para acceder si pierdes tu dispositivo.
                        </Text>
                    </View>

                </View>
                
                {/* Simple Footer */}
                <View className="py-6 mt-4 items-center">
                    <Text className="text-slate-600 text-sm">© 2024 Easy-Pay Security. All rights reserved.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
