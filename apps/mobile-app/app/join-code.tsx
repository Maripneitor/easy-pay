import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MotiView, AnimatePresence } from 'moti';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useMesa } from '../context/MesaContext';

export default function JoinCodeScreen() {
    const { theme, fontScale } = useTheme();
    const { joinMesa } = useMesa();
    const router = useRouter();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (code.length < 4) {
            setError('El código debe tener al menos 4 caracteres');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const success = await joinMesa(code);
            if (success) {
                router.replace('/new-mesa');
            } else {
                setError('No se pudo encontrar ninguna mesa con ese código');
            }
        } catch (e) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-6 py-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-bold ml-2">Unirse por Código</Text>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 px-8 justify-center"
            >
                <MotiView 
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="items-center mb-12"
                >
                    <View style={{ backgroundColor: theme.primary + '15' }} className="w-24 h-24 rounded-3xl items-center justify-center mb-6">
                        <MaterialIcons name="vpn-key" size={48} color={theme.primary} />
                    </View>
                    <Text style={{ color: theme.text }} className="text-2xl font-black text-center">Ingresa el código</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-center mt-2 font-medium">Pide el código al líder de la mesa</Text>
                </MotiView>

                <View className="gap-6">
                    <View>
                        <TextInput 
                            value={code}
                            onChangeText={(val) => { setCode(val.toUpperCase()); setError(''); }}
                            placeholder="Ej. AB12"
                            placeholderTextColor={theme.textSecondary + '60'}
                            maxLength={6}
                            autoFocus
                            style={{ 
                                backgroundColor: theme.cardSecondary, 
                                color: theme.text,
                                borderBottomColor: error ? '#f43f5e' : theme.primary,
                                borderBottomWidth: 3,
                                fontSize: 32 * fontScale,
                                textAlign: 'center',
                                paddingVertical: 20,
                                borderRadius: 16
                            }}
                            className="font-black"
                        />
                        <AnimatePresence>
                            {error && (
                                <MotiView 
                                    from={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-2 items-center"
                                >
                                    <Text className="text-rose-500 font-bold text-xs">{error}</Text>
                                </MotiView>
                            )}
                        </AnimatePresence>
                    </View>

                    <TouchableOpacity 
                        onPress={handleJoin}
                        disabled={loading}
                        style={{ backgroundColor: code.length >= 4 ? theme.primary : theme.border }}
                        className="w-full py-5 rounded-2xl items-center shadow-xl shadow-blue-500/20"
                    >
                        {loading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text style={{ color: code.length >= 4 ? 'black' : theme.textSecondary }} className="font-black uppercase tracking-widest">Entrar a Mesa</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
