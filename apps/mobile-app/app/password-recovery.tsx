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
        <SafeAreaView className="flex-1 bg-[#0f172a]" edges={['top']}>
            <StatusBar style="light" />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Background Decor */}
                <View className="absolute top-0 left-0 w-80 h-80 bg-[#1976D2]/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                <View className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-[#0D47A1]/15 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3" />
                
                <ScrollView 
                    className="flex-1 px-8"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="w-12 h-12 bg-[#1e293b]/50 border border-white/10 rounded-2xl items-center justify-center mb-8"
                    >
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <MotiView 
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1e293b]/40 border border-white/10 rounded-[32px] p-8 shadow-2xl"
                    >
                        {!sent ? (
                            <>
                                <View className="items-center mb-8">
                                    <View className="w-16 h-16 bg-[#64B5F6]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#64B5F6]/20 shadow-glow">
                                        <MaterialIcons name="confirmation-number" size={32} color="#64B5F6" />
                                    </View>
                                    <Text className="text-white text-3xl font-bold tracking-tight">Easy-Pay</Text>
                                </View>

                                <View className="text-center mb-8">
                                    <Text className="text-xl font-bold text-white text-center mb-3">¿Olvidaste tu contraseña?</Text>
                                    <Text className="text-slate-400 text-sm text-center font-medium leading-relaxed">
                                        No te preocupes. Introduce tu email y te enviaremos un código para restablecerla.
                                    </Text>
                                </View>

                                <View className="gap-6">
                                    <View>
                                        <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">Email</Text>
                                        <View className="bg-[#1e293b] border border-[#334155] p-3.5 rounded-xl flex-row items-center">
                                            <MaterialIcons name="mail" size={20} color="#64748b" />
                                            <TextInput 
                                                placeholder="tu@ejemplo.com"
                                                placeholderTextColor="#475569"
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
                                        className="active:scale-[0.98] overflow-hidden rounded-xl"
                                    >
                                        <LinearGradient
                                            colors={['#2196F3', '#0D47A1']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            className="p-4 items-center"
                                        >
                                            {loading ? <ActivityIndicator color="white" /> : (
                                                <Text className="text-white font-bold text-center">Enviar Código de Recuperación</Text>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <MotiView 
                                from={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="items-center py-6"
                            >
                                <View className="w-20 h-20 bg-emerald-500/10 rounded-[30px] items-center justify-center mb-8 border border-emerald-500/20 shadow-lg shadow-emerald-500/20">
                                    <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                                </View>
                                <Text className="text-white text-2xl font-black text-center tracking-tight">¡Enviado!</Text>
                                <Text className="text-slate-500 font-bold text-center mt-4 text-sm px-4 leading-relaxed">
                                    Revisa tu bandeja de entrada en <Text className="text-white">{email}</Text>.
                                </Text>
                                <TouchableOpacity 
                                    onPress={() => router.replace('/auth')}
                                    className="mt-10 bg-white/5 border border-white/10 px-8 py-3.5 rounded-full"
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
