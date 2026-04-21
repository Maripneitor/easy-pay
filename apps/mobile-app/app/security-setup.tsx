import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Dimensions, 
    ActivityIndicator, 
    Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function SecuritySetupScreen() {
    const router = useRouter();
    const { userId, email, name } = useLocalSearchParams<{ userId: string, email: string, name: string }>();
    const [loading, setLoading] = useState(false);
    
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

    const handleSendCode = async () => {
        if (!userId && !__DEV__) {
            Alert.alert('Error', 'ID de usuario no encontrado. Reintenta el registro.');
            return;
        }

        setLoading(true);
        try {
            // Llamamos al endpoint de setup
            const response = await fetch(`${API_URL}/api/auth/2fa/setup/${userId || 'demo-user'}`, {
                method: 'POST'
            });
            
            // Check if response is ok
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = (await response.json()) as any;

            if (data.status === 'success') {
                router.push({
                    pathname: '/security-2fa',
                    params: { userId, email, name }
                });
            } else {
                throw new Error(data.message || 'No se pudo enviar el código.');
            }
        } catch (err) {
            console.warn('⚠️ Bypass: Procediendo con modo demo debido a fallo en API:', err);
            
            // En desarrollo, permitimos el bypass si la API falla
            if (__DEV__) {
                router.push({
                    pathname: '/security-2fa',
                    params: { userId: userId || 'demo-id', email: email || 'demo@easy-pay.com', name: name || 'Usuario Demo' }
                } as any);
            } else {
                Alert.alert('Error', 'No se pudo conectar con el servidor de seguridad. Inténtalo más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }} edges={['top']}>
            <StatusBar style="dark" />
            
            {/* Top Bar from Stitch */}
            <View className="px-6 py-4 flex-row justify-between items-center bg-[#F7F9FB]">
                <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full active:scale-95 transition-all">
                    <Ionicons name="arrow-back" size={24} color="#0061a4" />
                </TouchableOpacity>
                <Text className="font-bold text-xl tracking-tight text-[#0061a4]">Easy-Pay</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6 pb-32" showsVerticalScrollIndicator={false}>
                {/* Background Glow Effect */}
                <View className="absolute top-0 right-0 w-64 h-64 bg-[#2196F3]/5 rounded-full blur-3xl" />
                
                {/* Stepper (Step 2 of Onboarding context) */}
                <View className="flex-row items-center justify-center space-x-3 my-6">
                    <View className="w-2 h-2 rounded-full bg-[#E0E3E5]" />
                    <View className="w-8 h-2 rounded-full bg-[#0061a4]" />
                    <View className="w-2 h-2 rounded-full bg-[#E0E3E5]" />
                </View>

                {/* Title Section */}
                <View className="mb-10 text-center">
                    <Text className="text-3xl font-bold text-[#191C1E] mb-3 tracking-tight">Seguridad Easy-Pay</Text>
                    <Text className="text-base text-[#404752] leading-relaxed">
                        Protege tu cuenta activando la verificación de dos pasos (2FA).
                    </Text>
                </View>

                {/* Main Card Section */}
                <View className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#bfc7d4]/15 items-center">
                    <View className="w-20 h-20 bg-[#2196F3]/10 rounded-3xl items-center justify-center mb-6 border border-[#2196F3]/20">
                        <MaterialIcons name="shield" size={44} color="#0061a4" />
                    </View>

                    <Text className="text-xl font-bold text-[#191C1E] text-center mb-3">Verificación por Correo</Text>
                    <Text className="text-sm text-[#707883] text-center leading-relaxed mb-8">
                        Te enviaremos un código de seguridad de 6 dígitos para validar tu identidad.
                    </Text>

                    {/* Email Info Box */}
                    <View className="bg-[#F2F4F6] rounded-2xl p-5 w-full flex-row items-center space-x-4">
                        <View className="w-11 h-11 bg-white rounded-full items-center justify-center shadow-sm">
                            <MaterialIcons name="alternate-email" size={22} color="#0061a4" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[10px] font-bold text-[#404752] uppercase tracking-wider mb-0.5">Recibirás el código en:</Text>
                            <Text className="text-[15px] font-bold text-[#191C1E]">{email || 'tu@ejemplo.com'}</Text>
                        </View>
                    </View>
                </View>

                {/* Security Protocol Indicator */}
                <View className="mt-8 flex-row items-center justify-center space-x-2">
                    <MaterialIcons name="verified-user" size={16} color="#0061a4" />
                    <Text className="text-[10px] font-bold text-[#0061a4] uppercase tracking-widest opacity-60">Protocolo de Seguridad v4.0 Active</Text>
                </View>
            </ScrollView>

            {/* Sticky Footer CTA */}
            <View className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 border-t border-[#bfc7d4]/15">
                <TouchableOpacity 
                    onPress={handleSendCode}
                    disabled={loading}
                    className="w-full bg-[#0061a4] py-5 rounded-2xl flex-row justify-center items-center shadow-lg active:scale-[0.98]"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white font-bold text-lg mr-2 uppercase tracking-wide">Activar Seguridad</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>
                <View style={{ height: 12 }} />
            </View>
        </SafeAreaView>
    );
}
