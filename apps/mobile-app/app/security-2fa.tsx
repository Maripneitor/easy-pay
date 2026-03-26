import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Security2FAScreen() {
    const { userId, email, name } = useLocalSearchParams<{ userId: string; email: string; name: string }>();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const inputs = useRef<Array<TextInput | null>>([]);
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        if (userId && email) {
            handleSetup2FA();
        }
    }, [userId, email]);

    const handleSetup2FA = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/2fa/setup/${userId}`);
            const data = (await response.json()) as any;
            if (data.status !== 'success') {
                Alert.alert('Error', data.message || 'No se pudo enviar el código de seguridad.');
            }
        } catch (err) {
            console.error('Setup 2FA error:', err);
            Alert.alert('Error', 'Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify2FA = async () => {
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            Alert.alert('Código incompleto', 'Por favor ingresa los 6 dígitos.');
            return;
        }

        setVerifying(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/2fa/verify/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: fullCode })
            });

            const data = (await response.json()) as any;

            if (response.ok && data.status === 'success') {
                // Verificación exitosa
                // Podríamos guardar el access_token en el storage aquí (TODO: storage util)
                router.replace('/(tabs)/dashboard');
            } else {
                Alert.alert('Falló la verificación', data.message || 'El código es incorrecto.');
            }
        } catch (err) {
            console.error('Verify 2FA error:', err);
            Alert.alert('Error', 'Error de conexión con el servidor.');
        } finally {
            setVerifying(false);
        }
    };

    const updateCode = (val: string, index: number) => {
        const newCode = [...code];
        newCode[index] = val;
        setCode(newCode);

        // Auto focus next or back
        if (val && index < 5) {
            inputs.current[index + 1]?.focus();
        } else if (!val && index > 0) {
            inputs.current[index - 1]?.focus();
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
                
                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-3">
                        <View className="flex-col items-end mr-2">
                            <Text className="text-sm font-semibold text-white">{name || 'Usuario'}</Text>
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
                                <MaterialIcons name="verified-user" size={24} color="#60a5fa" />
                            </View>
                            <Text className="text-2xl font-bold text-white tracking-tight">Verificación de Seguridad</Text>
                        </View>
                        <Text className="text-slate-400 text-sm leading-relaxed mt-1">
                            Se ha enviado un código de verificación a su correo: <Text className="text-blue-400 font-bold">{email || 'tu correo'}</Text>. Por favor, introdúcelo a continuación para continuar.
                        </Text>
                        <View className="mt-4 px-3 py-1 bg-blue-500/10 rounded-full self-start border border-blue-500/20">
                            <Text className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Easy-Pay Security Protocol v4.0</Text>
                        </View>
                    </View>

                    {/* Card Body */}
                    <View className="p-6 sm:p-8 space-y-8 gap-8">
                        {/* Step 1: Icon instead of static QR */}
                        <View className="items-center">
                            <View className="w-32 h-32 bg-blue-500/10 rounded-full items-center justify-center border-2 border-blue-500/20 mb-4">
                                <Ionicons name="mail-unread" size={60} color="#60a5fa" />
                            </View>
                            {loading && <ActivityIndicator color="#3b82f6" style={{ marginBottom: 10 }} />}
                            <Pressable onPress={handleSetup2FA} className="active:opacity-70">
                                <Text className="text-blue-400 text-xs font-semibold">¿No recibiste el código? Reenviar</Text>
                            </Pressable>
                        </View>

                        {/* Step 2: Input Code */}
                        <View className="gap-4">
                            <Text className="text-sm font-medium text-slate-300 text-center">Ingresa el código de 6 dígitos</Text>
                            <View className="flex-row justify-center items-center gap-2 sm:gap-3">
                                {code.map((char, i) => (
                                    <React.Fragment key={i}>
                                        {i === 3 && <View key={`dash-${i}`} className="w-2 h-1 bg-slate-700" />}
                                        <TextInput 
                                            key={`input-${i}`}
                                            ref={(el) => { inputs.current[i] = el; }}
                                            value={char}
                                            onChangeText={(v) => updateCode(v, i)}
                                            keyboardType="numeric"
                                            maxLength={1}
                                            className="w-10 h-11 sm:w-12 sm:h-12 bg-slate-900/50 border border-slate-700 rounded-lg text-center text-xl font-bold text-white focus:border-[#3b82f6]"
                                            selectionColor="#3b82f6"
                                        />
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="gap-3 pt-2">
                            <Pressable 
                                onPress={handleVerify2FA}
                                disabled={verifying}
                                className="w-full py-3.5 px-4 bg-[#2196F3] rounded-lg shadow-lg shadow-blue-500/25 flex-row items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                {verifying ? <ActivityIndicator color="white" size="small" /> : (
                                    <>
                                        <Text className="text-white font-bold">Verificar Cuenta</Text>
                                        <MaterialIcons name="verified-user" size={18} color="white" />
                                    </>
                                )}
                            </Pressable>
                            <Pressable 
                                onPress={() => router.back()}
                                className="w-full py-3 px-4 bg-transparent border border-slate-600 rounded-lg shadow-sm flex-row justify-center items-center active:scale-[0.98] active:border-slate-400"
                            >
                                <Text className="text-slate-300 font-medium">Volver</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Footer Policy */}
                    <View className="bg-slate-900/40 p-6 sm:p-8 rounded-b-2xl border-t border-white/5">
                        <Text className="text-xs text-slate-500 text-center">
                            Esta seguridad adicional ayuda a proteger tu dinero y tus datos personales contra accesos no autorizados.
                        </Text>
                    </View>
                </View>
                
                {/* Simple Footer */}
                <View className="py-6 mt-4 items-center">
                    <Text className="text-slate-600 text-sm">© 2026 Easy-Pay Security Systems. UNACH.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
