import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Dimensions, 
    ActivityIndicator, 
    Alert,
    ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { useTheme } from '../src/infrastructure/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function SecuritySetupScreen() {
    const router = useRouter();
    const { userId, email, name } = useLocalSearchParams<{ userId: string, email: string, name: string }>();
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const { theme, cycleTheme } = useTheme();
    
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
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            
            {/* Top Bar */}
            <View style={{ backgroundColor: theme.bg }} className="px-6 py-4 flex-row justify-between items-center z-50">
                <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: theme.glassBg, borderColor: theme.border }} className="w-10 h-10 rounded-full items-center justify-center border">
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View className="flex-row items-center gap-2">
                    <Image 
                        source={require('../assets/images/logo-ep.png')} 
                        style={{ width: 32, height: 32 }}
                        resizeMode="contain"
                    />
                    <Text style={{ color: theme.text }} className="font-black text-xl tracking-tight">Easy-Pay</Text>
                </View>
                <TouchableOpacity 
                    onPress={cycleTheme}
                    style={{ backgroundColor: theme.primary }}
                    className="w-10 h-10 rounded-full items-center justify-center shadow-lg shadow-blue-500/20"
                >
                    <Ionicons name={theme.isDark ? "sunny" : "moon"} size={20} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                className="flex-1 px-6" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
            >
                {/* Background Glow Effect */}
                <View style={{ backgroundColor: theme.primary + '10' }} className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" />
                
                {/* Stepper */}
                <View className="flex-row items-center justify-center space-x-3 my-10">
                    <View style={{ backgroundColor: theme.border }} className="w-2 h-2 rounded-full" />
                    <View style={{ backgroundColor: theme.primary }} className="w-10 h-2 rounded-full" />
                    <View style={{ backgroundColor: theme.border }} className="w-2 h-2 rounded-full" />
                </View>

                {/* Title Section */}
                <View className="mb-10 items-center">
                    <Text style={{ color: theme.text }} className="text-3xl font-black mb-3 tracking-tight text-center">Seguridad Easy-Pay</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-base text-center leading-relaxed font-medium px-4">
                        Protege tu cuenta activando la verificación de dos pasos (2FA).
                    </Text>
                </View>

                {/* Main Card Section */}
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-[40px] p-8 shadow-sm border items-center">
                    <View style={{ backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }} className="w-20 h-20 rounded-[30px] items-center justify-center mb-6 border">
                        <MaterialIcons name="shield" size={44} color={theme.primary} />
                    </View>

                    <Text style={{ color: theme.text }} className="text-xl font-black text-center mb-3">Verificación por Correo</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-sm text-center leading-relaxed mb-10 font-medium">
                        Te enviaremos un código de seguridad de 6 dígitos para validar tu identidad.
                    </Text>

                    {/* Email Info Box */}
                    <View style={{ backgroundColor: theme.glassBg, borderColor: theme.border }} className="rounded-3xl p-6 w-full flex-row items-center border">
                        <View style={{ backgroundColor: theme.primary }} className="w-12 h-12 rounded-full items-center justify-center shadow-lg shadow-blue-500/20 mr-4">
                            <MaterialIcons name="alternate-email" size={24} color="black" />
                        </View>
                        <View className="flex-1">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-widest mb-1">Recibirás el código en:</Text>
                            <Text style={{ color: theme.text }} className="text-[15px] font-black">{email || 'tu@ejemplo.com'}</Text>
                        </View>
                    </View>
                </View>

                {/* Security Protocol Indicator */}
                <View className="mt-12 flex-row items-center justify-center space-x-3 opacity-50">
                    <MaterialIcons name="verified-user" size={16} color={theme.primary} />
                    <Text style={{ color: theme.primary }} className="text-[10px] font-black uppercase tracking-[3px]">Protocolo Activo</Text>
                </View>
            </ScrollView>

            {/* Sticky Footer CTA */}
            <View 
                style={{ 
                    paddingBottom: insets.bottom + 24,
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    backgroundColor: theme.bg + 'ee',
                    borderTopColor: theme.border,
                    borderTopWidth: 1
                }} 
                className="absolute bottom-0 left-0 right-0"
            >
                <TouchableOpacity 
                    onPress={handleSendCode}
                    disabled={loading}
                    style={{ backgroundColor: theme.primary }}
                    className="w-full py-5 rounded-[28px] flex-row justify-center items-center shadow-xl shadow-blue-500/30"
                >
                    {loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <>
                            <Text className="text-black font-black text-base mr-2 uppercase tracking-widest">Activar Seguridad</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="black" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
