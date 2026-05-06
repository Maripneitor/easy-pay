import React, { useState } from 'react';
import { 
    ScrollView, 
    View, 
    Text, 
    Pressable, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform, 
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { httpClient } from '../src/infrastructure/api/http-client';
import { authService } from '../src/infrastructure/services/AuthService';


const { width } = Dimensions.get('window');

export default function AuthScreen() {
    const { theme, fontScale, cycleTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [authMode, setAuthMode] = useState<'email' | 'register' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState('');
    const { saveSession } = useAuth();

    const handleAuth = async () => {
        setError('');
        
        if (authMode === 'phone') {
            if (!phone || phone.length < 9) {
                setError('Por favor ingresa un número de teléfono válido.');
                return;
            }
            setIsAuthenticating(true);
            // Simulación de envío de SMS y navegación a 2FA
            setTimeout(() => {
                setIsAuthenticating(false);
                router.push({
                    pathname: '/security-2fa',
                    params: { 
                        userId: 'phone-user', 
                        phone: `+34${phone}`,
                        name: 'Usuario Teléfono'
                    }
                } as any);
            }, 1000);
            return;
        }

        if (!email || !password || (authMode === 'register' && !name)) {
            setError('Por favor completa todos los campos.');
            return;
        }

        setIsAuthenticating(true);
        try {
            if (authMode === 'email') {
                const data = await authService.login(email, password);
                
                if (data.status === 'success') {
                    await saveSession(data.access_token!, {
                        id: data.user?.id || data.user?._id || 'unknown',
                        nombre: data.user?.nombre || 'Usuario',
                        email: data.user?.email || email,
                        isGuest: false
                    });
                    router.replace('/(tabs)');
                } else {
                    setError(data.message || 'Credenciales incorrectas');
                }
            } else if (authMode === 'register') {
                const response = await httpClient.post('/api/auth/register', {
                    nombre: name,
                    email,
                    password
                });
                const data = response.data;

                if (data.status === 'success') {
                    router.replace({
                        pathname: '/security-setup',
                        params: { 
                            userId: data.user_id || data.user?.id || data.user?._id || 'pending', 
                            email: email, 
                            name: name 
                        }
                    } as any);
                } else {
                    setError(data.detail || data.message || 'Error en el registro');
                }
            }
        } catch (err: any) {
            setError(err.message || 'No se pudo conectar con el servidor.');
        } finally {
            setIsAuthenticating(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
            <StatusBar style="light" />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Background Decor */}
                <View style={{ ...styles.blob, top: 0, left: 0, backgroundColor: 'rgba(25, 118, 210, 0.1)', transform: [{ translateX: -width/3 }, { translateY: -width/3 }] }} />
                <View style={{ ...styles.blob, bottom: 0, right: 0, backgroundColor: 'rgba(13, 71, 161, 0.15)', transform: [{ translateX: width/3 }, { translateY: width/3 }] }} />
                
                <ScrollView 
                    style={{ flex: 1 }}
                    contentContainerStyle={{ 
                        flexGrow: 1, 
                        justifyContent: 'center', 
                        paddingHorizontal: 24, 
                        paddingTop: 40,
                        paddingBottom: insets.bottom + 40
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View className="items-center mb-10">
                        <View className="w-24 h-24 mb-4 items-center justify-center">
                            <Image 
                                source={require('../assets/images/logo-ep.png')} 
                                style={{ width: 100, height: 100 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={{ fontSize: 32 * fontScale, color: 'white' }} className="font-bold tracking-tight">Easy-Pay</Text>
                        <View className="h-[2px] w-12 bg-blue-500/50 mt-1 mb-2 rounded-full" />
                        <Text style={{ fontSize: 13 * fontScale }} className="text-slate-400 font-medium">Sin matemáticas, sin dramas</Text>
                    </View>

                    {/* Form Card */}
                    <View className="bg-[#1e293b]/40 border border-white/10 rounded-[32px] p-8 shadow-2xl">
                        {/* Selector Centralizado */}
                        <View className="flex-row p-1 bg-[#1e293b]/50 rounded-xl mb-8 border border-white/5">
                            <TouchableOpacity onPress={() => { setAuthMode('email'); setError(''); }} className={`flex-1 py-3 items-center rounded-lg ${authMode === 'email' ? 'bg-[#334155]' : ''}`}>
                                <Text className={`text-xs font-semibold ${authMode === 'email' ? 'text-white' : 'text-slate-400'}`}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setAuthMode('phone'); setError(''); }} className={`flex-1 py-3 items-center rounded-lg ${authMode === 'phone' ? 'bg-[#334155]' : ''}`}>
                                <Text className={`text-xs font-semibold ${authMode === 'phone' ? 'text-white' : 'text-slate-400'}`}>Teléfono</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setAuthMode('register'); setError(''); }} className={`flex-1 py-3 items-center rounded-lg ${authMode === 'register' ? 'bg-[#334155]' : ''}`}>
                                <Text className={`text-xs font-semibold ${authMode === 'register' ? 'text-white' : 'text-slate-400'}`}>Registro</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Error */}
                        {error && (
                            <View className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl mb-6 flex-row items-center gap-3">
                                <Ionicons name="alert-circle" size={18} color="#f43f5e" />
                                <Text className="text-rose-400 text-xs font-medium flex-1">{error}</Text>
                            </View>
                        )}

                        {/* Form */}
                        <View className="gap-6">
                            {authMode === 'register' && (
                                <View>
                                    <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">Nombre completo</Text>
                                    <View className="bg-[#1e293b] border border-[#334155] p-3.5 rounded-xl flex-row items-center">
                                        <MaterialIcons name="person" size={20} color="#64748b" />
                                        <TextInput 
                                            placeholder="Juan Pérez" 
                                            placeholderTextColor="#475569" 
                                            className="flex-1 ml-3 text-white font-medium"
                                            value={name} 
                                            onChangeText={setName} 
                                        />
                                    </View>
                                </View>
                            )}
                            
                            {authMode === 'phone' ? (
                                <View>
                                    <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">Número de Teléfono</Text>
                                    <View className="bg-[#1e293b] border border-[#334155] p-3.5 rounded-xl flex-row items-center">
                                        <View className="flex-row items-center gap-2 pr-3 border-r border-slate-700">
                                            <Text className="text-white font-bold">+34</Text>
                                        </View>
                                        <TextInput 
                                            placeholder="600 000 000" 
                                            placeholderTextColor="#475569" 
                                            keyboardType="phone-pad"
                                            className="flex-1 ml-3 text-white font-medium"
                                            value={phone} 
                                            onChangeText={setPhone} 
                                        />
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <View>
                                        <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">Email</Text>
                                        <View className="bg-[#1e293b] border border-[#334155] p-3.5 rounded-xl flex-row items-center">
                                            <MaterialIcons name="mail" size={20} color="#64748b" />
                                            <TextInput 
                                                placeholder="tu@ejemplo.com" 
                                                placeholderTextColor="#475569" 
                                                keyboardType="email-address" 
                                                autoCapitalize="none" 
                                                className="flex-1 ml-3 text-white font-medium"
                                                value={email} 
                                                onChangeText={setEmail} 
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">Contraseña</Text>
                                        <View className="bg-[#1e293b] border border-[#334155] p-3.5 rounded-xl flex-row items-center">
                                            <MaterialIcons name="lock" size={20} color="#64748b" />
                                            <TextInput 
                                                placeholder="••••••••" 
                                                placeholderTextColor="#475569" 
                                                secureTextEntry={!showPassword} 
                                                className="flex-1 ml-3 text-white font-medium"
                                                value={password} 
                                                onChangeText={setPassword} 
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#64748b" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            )}

                            <TouchableOpacity 
                                 onPress={handleAuth}
                                 disabled={isAuthenticating}
                                 className="mt-6 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/40"
                                 activeOpacity={0.8}
                             >
                                 <View 
                                     className="bg-[#2196F3] py-5 items-center justify-center"
                                 >
                                     {isAuthenticating ? (
                                         <ActivityIndicator color="white" size="small" />
                                     ) : (
                                         <Text style={{ fontSize: 16 * fontScale }} className="text-white font-bold tracking-wide">
                                             {authMode === 'email' ? 'Entrar' : authMode === 'register' ? 'Crear Cuenta' : 'Enviar Código SMS'}
                                         </Text>
                                     )}
                                 </View>
                             </TouchableOpacity>
                        </View>

                        {/* Social Buttons */}
                        <View className="items-center mt-8 mb-6">
                            <View className="w-full h-[1px] bg-slate-700/50 absolute top-2" />
                            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-[#1a2536] px-3 z-10">O continúa con</Text>
                        </View>
                        <View className="flex-row gap-4">
                            <TouchableOpacity className="flex-1 h-12 bg-[#1e293b] border border-slate-700 rounded-xl items-center justify-center">
                                <FontAwesome5 name="google" size={18} color="#cbd5e1" />
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 h-12 bg-[#1e293b] border border-slate-700 rounded-xl items-center justify-center">
                                <FontAwesome5 name="apple" size={20} color="#cbd5e1" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    blob: {
        position: 'absolute',
        width: width,
        height: width,
        borderRadius: width / 2,
        opacity: 0.5,
    }
});
