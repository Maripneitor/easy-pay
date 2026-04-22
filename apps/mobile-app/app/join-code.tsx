import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
const MotiView = View as any;
const AnimatePresence = ({ children }: any) => children;;
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useGrupo } from '../context/GrupoContext';

export default function JoinCodeScreen() {
    const { theme, fontScale } = useTheme();
    const { joinGrupo } = useGrupo();
    const router = useRouter();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (code.length < 4) {
            setError('Ingresa un código de 4 a 6 dígitos');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const success = await joinGrupo(code);
            if (success) {
                router.replace('/new-group');
            } else {
                setError('Código inválido o grupo cerrado');
            }
        } catch (e) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }} edges={['top']}>
            <StatusBar style="dark" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Top AppBar */}
            <View className="px-6 h-16 flex-row items-center justify-between bg-[#F7F9FB]">
                <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full active:scale-95">
                    <Ionicons name="arrow-back" size={24} color="#0061a4" />
                </TouchableOpacity>
                <Text className="font-bold text-xl tracking-tight text-[#191C1E]">Unirse a Grupo</Text>
                <View className="w-10" />
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 px-6 items-center justify-center"
            >
                {/* Icon Container */}
                <View className="mb-8 p-4 bg-white rounded-full shadow-sm relative">
                    <View className="absolute inset-0 bg-[#2196F3]/10 rounded-full blur-xl" />
                    <MaterialIcons name="dialpad" size={48} color="#2196F3" />
                </View>

                {/* Typography Context */}
                <View className="text-center mb-10 items-center">
                    <Text className="font-bold text-3xl text-[#191C1E] mb-3">Ingresa el código</Text>
                    <Text className="text-sm text-[#404752] text-center max-w-[280px] leading-relaxed">
                        Pídele al líder del grupo el código numérico de 4 a 6 dígitos para unirte a la cuenta compartida.
                    </Text>
                </View>

                {/* OTP Input Area */}
                <View className="w-full max-w-md items-center">
                    <View className="flex-row space-x-2 mb-4">
                        {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <View 
                                key={idx}
                                className={`w-12 h-14 items-center justify-center bg-white border rounded-xl shadow-sm ${code.length === idx ? 'border-[#2196F3] border-2 bg-[#F7F9FB]' : 'border-[#bfc7d4]/30'}`}
                            >
                                <Text className="text-2xl font-bold text-[#191C1E]">
                                    {code[idx] || ''}
                                </Text>
                            </View>
                        ))}
                    </View>
                    
                    <TextInput 
                        value={code}
                        onChangeText={(val) => { setCode(val.replace(/[^0-9]/g, '')); setError(''); }}
                        keyboardType="numeric"
                        maxLength={6}
                        autoFocus
                        style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }}
                    />

                    {error && (
                        <View className="flex-row items-center space-x-1 mt-2">
                            <MaterialIcons name="error" size={16} color="#ba1a1a" />
                            <Text className="text-[12px] font-medium text-[#ba1a1a]">{error}</Text>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>

            {/* Footer Action */}
            <View className="p-6 bg-white/80 border-t border-[#bfc7d4]/15">
                <TouchableOpacity 
                    onPress={handleJoin}
                    disabled={loading || code.length < 4}
                    className={`w-full py-4 rounded-xl shadow-md flex-row justify-center items-center active:scale-[0.95] ${code.length >= 4 ? 'bg-[#0061a4]' : 'bg-[#bfc7d4]/30'}`}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className={`font-bold text-lg ${code.length >= 4 ? 'text-white' : 'text-[#707883]'}`}>
                            Validar y Unirse
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
