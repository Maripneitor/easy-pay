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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/infrastructure/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
    console.log('AuthScreen rendering...');
    const { theme, fontScale, cycleTheme } = useTheme();
    const router = useRouter(); // Use the hook instead of singleton
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async () => {
        if (!email || !password || (!isLogin && !name)) {
            setError('Por favor completa todos los campos.');
            return;
        }
        setError('');
        setLoading(true);

        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

        try {
            if (isLogin) {
                // Iniciar Sesión - Si tiene 2FA activado el backend lo diría (pero por ahora vamos directo o implementamos login flow)
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identifier: email, password })
                });
                const data = (await response.json()) as any;
                
                if (response.ok && data.status === 'success') {
                    // Si el login es exitoso, guardamos el token (opcional aquí para simplificar) y vamos al dashboard
                    router.replace('/(tabs)/dashboard');
                } else {
                    setError(data.detail || data.message || 'Error al iniciar sesión');
                }
            } else {
                // Registrar Cuenta
                const response = await fetch(`${API_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre: name, email, password })
                });
                const data = (await response.json()) as any;

                if (response.ok && data.status === 'success') {
                    // Registro exitoso -> Ir a configurar 2FA (como en la web)
                    router.push({
                        pathname: '/security-2fa',
                        params: { userId: data.user_id, email: email, name: name }
                    });
                } else {
                    setError(data.detail || data.message || 'Error en el registro');
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError('No se pudo conectar con el servidor.');
        } finally {
            setLoading(true); // Mantener cargando un momento para feedback visual
            setTimeout(() => setLoading(false), 500);
        }
    };

    // Safe ROOT pattern to avoid NativeWind v4 + React 19 + Navigation Context bug
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
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
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
                        {/* Selector (Tabs) */}
                        <View className="flex-row p-1 bg-[#1e293b]/50 rounded-xl mb-8 border border-white/5">
                            <TouchableOpacity 
                                onPress={() => { setIsLogin(true); setError(''); }}
                                className={`flex-1 py-3 items-center rounded-lg ${isLogin ? 'bg-[#334155]' : ''}`}
                            >
                                <Text style={{ fontSize: 12 * fontScale }} className={`font-semibold ${isLogin ? 'text-white' : 'text-slate-400'}`}>Iniciar Sesión</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => { setIsLogin(false); setError(''); }}
                                className={`flex-1 py-3 items-center rounded-lg ${!isLogin ? 'bg-[#334155]' : ''}`}
                            >
                                <Text style={{ fontSize: 12 * fontScale }} className={`font-semibold ${!isLogin ? 'text-white' : 'text-slate-400'}`}>Registrarse</Text>
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
                            {!isLogin && (
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

                            <View className="flex-row items-center justify-between">
                                <TouchableOpacity className="flex-row items-center">
                                    <View className="w-4 h-4 rounded border border-slate-600 bg-slate-800 mr-2 items-center justify-center">
                                        <Ionicons name="checkmark" size={10} color="#2196F3" />
                                    </View>
                                    <Text className="text-slate-400 text-xs">Recordarme</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => router.push('/password-recovery')}>
                                    <Text className="text-[#64B5F6] text-xs font-semibold">¿Olvidaste tu contraseña?</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                onPress={handleAuth}
                                disabled={loading}
                                className="mt-4 overflow-hidden rounded-[20px] shadow-lg shadow-blue-500/30"
                                activeOpacity={0.85}
                            >
                                <LinearGradient
                                    colors={['#3B82F6', '#1D4ED8']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="py-5 items-center justify-center border border-white/10"
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" size="small" />
                                    ) : (
                                        <View className="flex-row items-center gap-2">
                                            <Text style={{ fontSize: 16 * fontScale }} className="text-white font-extra-bold uppercase tracking-wider">
                                                {isLogin ? 'Entrar' : 'Crear Cuenta'}
                                            </Text>
                                            <Feather name="arrow-right" size={20} color="white" />
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={() => router.push('/auth-phone')}
                                className="items-center py-2"
                            >
                                <Text className="text-[#64B5F6] text-xs font-semibold">Usar número de teléfono</Text>
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

                    {/* Footer Links */}
                    <View className="items-center mt-10">
                         <TouchableOpacity 
                            onPress={() => router.push('/(tabs)/dashboard')} 
                            className="flex-row items-center gap-2 px-6 py-2.5 border border-slate-600 rounded-full"
                         >
                            <Text className="text-slate-300 font-semibold text-sm">Continuar como Invitado</Text>
                            <MaterialIcons name="arrow-forward" size={18} color="#94a3b8" />
                         </TouchableOpacity>
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
