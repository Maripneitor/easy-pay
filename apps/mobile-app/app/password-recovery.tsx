import React, { useState } from 'react';
import { 
    ScrollView, 
    View, 
    Text, 
    Pressable, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

export default function PasswordRecoveryScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleRecovery = () => {
        if (!email) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
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
                {/* Background Decor */}
                <View className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                
                <ScrollView 
                    className="flex-1 px-8"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl items-center justify-center mb-8"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <MotiView 
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 rounded-[48px] p-8 shadow-2xl"
                    >
                        {!sent ? (
                            <>
                                <View className="items-center mb-10">
                                    <LinearGradient
                                        colors={['#3b82f6', '#2563eb']}
                                        className="w-20 h-20 rounded-[30px] items-center justify-center mb-6 shadow-xl shadow-blue-500/20"
                                    >
                                        <MaterialIcons name="lock-reset" size={40} color="white" />
                                    </LinearGradient>
                                    <Text className="text-white text-3xl font-black text-center tracking-tight">Recuperar Acceso</Text>
                                    <Text className="text-slate-500 font-bold text-center mt-3 text-sm px-4 leading-relaxed">
                                        Ingresa tu correo y te enviaremos un enlace mágico para restablecer tu contraseña.
                                    </Text>
                                </View>

                                <View className="gap-6">
                                    <View>
                                        <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-4">Tu Correo Institucional</Text>
                                        <View className="bg-white/5 border border-white/10 p-5 rounded-2xl flex-row items-center">
                                            <Feather name="mail" size={18} color="#64748b" />
                                            <TextInput 
                                                placeholder="ejemplo@correo.com"
                                                placeholderTextColor="#334155"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                className="flex-1 ml-4 text-white font-bold"
                                                value={email}
                                                onChangeText={setEmail}
                                            />
                                        </View>
                                    </View>

                                    <TouchableOpacity 
                                        onPress={handleRecovery}
                                        disabled={loading || !email}
                                        className={`p-6 rounded-[28px] items-center justify-center shadow-lg flex-row gap-3 ${!email ? 'bg-slate-800' : 'bg-blue-600 shadow-blue-500/30'}`}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <>
                                                <Text className="text-white font-black uppercase tracking-widest text-[13px]">Enviar Enlace</Text>
                                                <Ionicons name="paper-plane" size={18} color="white" />
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <MotiView 
                                from={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="items-center py-6"
                            >
                                <View className="w-20 h-20 bg-emerald-500/10 rounded-[30px] items-center justify-center mb-8 border border-emerald-500/20">
                                    <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                                </View>
                                <Text className="text-white text-3xl font-black text-center tracking-tight">¡Correo Enviado!</Text>
                                <Text className="text-slate-500 font-bold text-center mt-4 text-sm px-4 leading-relaxed">
                                    Hemos enviado las instrucciones a <Text className="text-white">{email}</Text>. Revisa tu bandeja de entrada o spam.
                                </Text>
                                <TouchableOpacity 
                                    onPress={() => router.replace('/auth')}
                                    className="mt-12 bg-white/5 border border-white/10 px-8 py-4 rounded-full"
                                >
                                    <Text className="text-slate-300 font-bold text-xs uppercase tracking-widest">Volver al Inicio</Text>
                                </TouchableOpacity>
                            </MotiView>
                        )}
                    </MotiView>

                    <View className="items-center mt-12 pb-10">
                        <Text className="text-slate-700 text-[10px] font-black uppercase tracking-[3px]">
                            Secure ID Recovery by EasyPay
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
