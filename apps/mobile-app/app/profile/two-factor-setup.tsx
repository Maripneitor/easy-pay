import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { userRepository } from '../../src/infrastructure/api/repositories/UserRepository';

export default function TwoFactorSetupScreen() {
    const { theme, fontScale } = useTheme();
    const router = useRouter();
    const [isEnabled, setIsEnabled] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleToggle = async (value: boolean) => {
        setIsLoading(true);
        try {
            const result = await userRepository.toggleTwoFactor(value);
            setIsEnabled(value);
            if (value && result.qr_code) {
                setQrCode(result.qr_code);
                setSecret(result.secret || null);
            } else {
                setQrCode(null);
                setSecret(null);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cambiar la configuración de 2FA');
            setIsEnabled(!value);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (verificationCode.length !== 6) {
            Alert.alert('Error', 'Ingresa un código de 6 dígitos');
            return;
        }
        setIsVerifying(true);
        try {
            await userRepository.verifyTwoFactor(verificationCode);
            Alert.alert('Éxito', '2FA verificado y activado correctamente');
            setQrCode(null);
            setSecret(null);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Código de verificación incorrecto');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <Stack.Screen options={{ title: 'Seguridad 2FA', headerShown: false }} />
            
            <View style={{ height: 80, borderBottomColor: theme.border }} className="px-6 flex-row items-center justify-between border-b">
                <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
                    <MaterialIcons name="arrow-back" size={20} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary }} className="font-bold">Volver</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16 * fontScale, color: theme.text }} className="font-black uppercase tracking-widest">Seguridad</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6 pt-10" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mb-10">
                    <Text style={{ fontSize: 10 * fontScale, color: theme.textSecondary }} className="font-black uppercase tracking-[3px] mb-4">Autenticación de dos pasos</Text>
                    <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="p-6 rounded-[32px] border flex-row items-center justify-between">
                        <View className="flex-1 pr-4">
                            <Text style={{ color: theme.text }} className="text-lg font-black mb-1">Estado</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-xs font-medium">Añade una capa extra de seguridad a tu cuenta.</Text>
                        </View>
                        {isLoading ? (
                            <ActivityIndicator color={theme.primary} />
                        ) : (
                            <Switch 
                                value={isEnabled} 
                                onValueChange={handleToggle}
                                trackColor={{ false: '#334155', true: theme.primary }}
                                thumbColor="white"
                            />
                        )}
                    </View>
                </View>

                {qrCode && (
                    <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="p-8 rounded-[40px] border items-center mb-10">
                        <Text style={{ color: theme.text }} className="text-xl font-black mb-6 text-center">Configura tu App</Text>
                        <Text style={{ color: theme.textSecondary }} className="text-sm text-center mb-8">Escanea el código QR o ingresa la clave en tu app de autenticación (Google Authenticator, Authy, etc.)</Text>
                        
                        <View className="p-4 bg-white rounded-3xl mb-8">
                             {/* In a real app we'd render the QR image here */}
                             <Ionicons name="qr-code" size={180} color="#0f172a" />
                        </View>

                        {secret && (
                            <View style={{ backgroundColor: theme.bg }} className="p-4 rounded-xl mb-10 border border-white/5 w-full">
                                <Text className="text-slate-500 text-[10px] font-black uppercase mb-1">Clave de respaldo</Text>
                                <Text style={{ color: theme.text }} className="font-mono font-bold select-all">{secret}</Text>
                            </View>
                        )}

                        <Text style={{ color: theme.textSecondary }} className="text-xs font-black uppercase mb-4 ml-2 self-start">Verificar Código</Text>
                        <TextInput
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            keyboardType="numeric"
                            maxLength={6}
                            style={{ backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }}
                            className="p-5 rounded-2xl border font-bold w-full text-center text-2xl tracking-[10px]"
                            placeholder="000000"
                            placeholderTextColor={theme.textSecondary + '40'}
                        />

                        <TouchableOpacity 
                            onPress={handleVerify}
                            disabled={isVerifying}
                            style={{ backgroundColor: theme.primary }}
                            className="mt-8 w-full py-5 rounded-2xl items-center shadow-lg"
                        >
                            {isVerifying ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-black uppercase tracking-widest">Confirmar Activación</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
