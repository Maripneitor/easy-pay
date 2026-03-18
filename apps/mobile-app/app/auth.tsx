import React, { useState, useEffect } from 'react';
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
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView, MotiText } from 'moti';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = () => {
        if (!email || !password || (!isLogin && !name)) {
            setError('Por favor completa todos los campos.');
            return;
        }
        setError('');
        setLoading(true);
        // Simulación de autenticación
        setTimeout(() => {
            setLoading(false);
            if (isLogin) {
                router.replace('/(tabs)/dashboard');
            } else {
                router.replace('/onboarding');
            }

        }, 1500);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Background Dynamic Elements */}
                <View className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                <View className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3" />
                
                <ScrollView 
                    className="flex-1 px-8"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Brand Header */}
                    <MotiView 
                        from={{ opacity: 0, scale: 0.8, translateY: -20 }}
                        animate={{ opacity: 1, scale: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 1000 }}
                        className="items-center mb-12"
                    >
                        <LinearGradient
                            colors={['#3b82f6', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="w-20 h-20 rounded-[30px] items-center justify-center mb-6 shadow-2xl shadow-blue-500/40"
                        >
                            <Ionicons name="flash" size={40} color="white" />
                        </LinearGradient>
                        <Text className="text-white text-4xl font-black tracking-tighter">EasyPay</Text>
                        <Text className="text-slate-500 font-bold mt-2 text-sm uppercase tracking-widest">Sin deudas, solo amigos</Text>
                    </MotiView>

                    {/* Auth Card */}
                    <View className="bg-white/5 border border-white/10 rounded-[48px] p-8 shadow-2xl overflow-hidden">
                        {/* Tab Switcher */}
                        <View className="flex-row bg-white/5 p-1.5 rounded-[24px] mb-10 border border-white/5">
                            <TouchableOpacity 
                                onPress={() => { setIsLogin(true); setError(''); }}
                                className={`flex-1 py-3.5 items-center rounded-[18px] ${isLogin ? 'bg-blue-600 shadow-lg' : ''}`}
                            >
                                <Text className={`text-[13px] font-black uppercase tracking-wider ${isLogin ? 'text-white' : 'text-slate-500'}`}>Entrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => { setIsLogin(false); setError(''); }}
                                className={`flex-1 py-3.5 items-center rounded-[18px] ${!isLogin ? 'bg-blue-600 shadow-lg' : ''}`}
                            >
                                <Text className={`text-[13px] font-black uppercase tracking-wider ${!isLogin ? 'text-white' : 'text-slate-500'}`}>Registrar</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Error Message */}
                        {error ? (
                            <MotiView 
                                from={{ opacity: 0, translateY: -10 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl mb-6 flex-row items-center gap-3"
                            >
                                <Ionicons name="alert-circle" size={20} color="#f43f5e" />
                                <Text className="text-rose-400 text-xs font-bold flex-1">{error}</Text>
                            </MotiView>
                        ) : null}

                        {/* Input Fields */}
                        <View className="gap-5">
                            {!isLogin && (
                                <View>
                                    <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-4">Nombre Completo</Text>
                                    <View className="bg-white/5 border border-white/10 p-5 rounded-2xl flex-row items-center focus:border-blue-500/50">
                                        <Feather name="user" size={18} color="#64748b" />
                                        <TextInput 
                                            placeholder="Juan Pérez"
                                            placeholderTextColor="#334155"
                                            className="flex-1 ml-4 text-white font-bold"
                                            value={name}
                                            onChangeText={setName}
                                        />
                                    </View>
                                </View>
                            )}

                            <View>
                                <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-4">Tu Correo</Text>
                                <View className="bg-white/5 border border-white/10 p-5 rounded-2xl flex-row items-center focus:border-blue-500/50">
                                    <Feather name="mail" size={18} color="#64748b" />
                                    <TextInput 
                                        placeholder="hola@ejemplo.com"
                                        placeholderTextColor="#334155"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        className="flex-1 ml-4 text-white font-bold"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-4">Contraseña</Text>
                                <View className="bg-white/5 border border-white/10 p-5 rounded-2xl flex-row items-center focus:border-blue-500/50">
                                    <Feather name="lock" size={18} color="#64748b" />
                                    <TextInput 
                                        placeholder="••••••••"
                                        placeholderTextColor="#334155"
                                        secureTextEntry={!showPassword}
                                        className="flex-1 ml-4 text-white font-bold"
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {isLogin && (
                                <View className="flex-row justify-end mb-4 pr-2">
                                    <TouchableOpacity onPress={() => router.push('/password-recovery')}>
                                        <Text className="text-blue-500 text-xs font-bold underline">¿Olvidaste el acceso?</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Main Action Button */}
                            <TouchableOpacity 
                                onPress={handleAuth}
                                disabled={loading}
                                className="bg-blue-600 p-6 rounded-[28px] items-center justify-center shadow-lg shadow-blue-500/30 active:opacity-90 overflow-hidden"
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-black uppercase tracking-[2px] text-[13px]">
                                        {isLogin ? 'Iniciar Conexión' : 'Crear mi Cuenta'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className="items-center mt-12 mb-8">
                            <Text className="text-slate-600 text-[10px] font-bold uppercase tracking-widest bg-[#0d1425] px-4 z-10">O accede con</Text>
                            <View className="w-full h-[1px] bg-white/5 absolute top-1.5" />
                        </View>

                        <View className="flex-row gap-4">
                            <TouchableOpacity className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl items-center justify-center active:bg-white/10">
                                <FontAwesome5 name="google" size={20} color="#cbd5e1" />
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl items-center justify-center active:bg-white/10">
                                <FontAwesome5 name="apple" size={24} color="#cbd5e1" />
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl items-center justify-center active:bg-white/10">
                                <FontAwesome5 name="facebook-f" size={20} color="#cbd5e1" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Guest Access Link */}
                    <MotiView 
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 500 }}
                        className="items-center mt-10"
                    >
                        <TouchableOpacity 
                            onPress={() => router.push('/(tabs)/dashboard')}
                            className="bg-white/5 border border-white/10 px-8 py-4 rounded-full flex-row items-center gap-3 active:bg-white/10"
                        >
                            <Text className="text-slate-300 font-bold text-xs uppercase tracking-widest">Entrar como invitado</Text>
                            <Ionicons name="chevron-forward" size={18} color="#3b82f6" />
                        </TouchableOpacity>
                        <Text className="text-slate-600 text-[10px] font-medium text-center mt-4 px-10">
                            Explora la app con acceso limitado. Para guardar métodos de pago reales es necesaria una cuenta.
                        </Text>
                    </MotiView>

                    {/* Footer Legal */}
                    <View className="items-center mt-16 pb-10">
                        <Text className="text-slate-700 text-[10px] font-medium text-center leading-relaxed">
                            Al continuar, aceptas nuestros{' '}
                            <Text className="text-slate-500 font-bold">Términos de Servicio</Text> y la{' '}
                            <Text className="text-slate-500 font-bold">Política de Privacidad</Text>.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

import { Feather } from '@expo/vector-icons';
