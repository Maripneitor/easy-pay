import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useMesa } from '../context/MesaContext';
import { MotiView } from 'moti';

export default function CreateGroupScreen() {
    const { user } = useAuth();
    const { theme, fontScale } = useTheme();
    const { createMesa } = useMesa();
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Por favor ingresa un nombre para la mesa');
            return;
        }

        if (!user?.id) {
            Alert.alert('Error', 'Debes iniciar sesión para crear una mesa');
            return;
        }

        setIsLoading(true);
        try {
            await createMesa(groupName, user.id);
            router.replace('/new-mesa');
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear la mesa. Revisa tu conexión.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: theme.bg }} className="flex-1">
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />
            
            <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/5 z-50">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-xl items-center justify-center bg-slate-800/40">
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text }} className="text-lg font-black tracking-tight">Easy-Pay</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6 pt-8" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <MotiView 
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="gap-8"
                >
                    <View className="items-center gap-2">
                        <View style={{ backgroundColor: theme.primary + '15' }} className="w-20 h-20 rounded-[30px] items-center justify-center mb-2">
                            <MaterialIcons name="add-business" size={40} color={theme.primary} />
                        </View>
                        <Text style={{ color: theme.text }} className="text-3xl font-black tracking-tight text-center">
                            Crear Mesa
                        </Text>
                        <Text style={{ color: theme.textSecondary }} className="text-base text-center opacity-70">
                            Inicia una nueva sesión para dividir la cuenta con tus amigos.
                        </Text>
                    </View>

                    <View className="gap-6">
                        <View className="gap-2">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-1 ml-1">Nombre de la Mesa</Text>
                            <TextInput 
                                value={groupName}
                                onChangeText={setGroupName}
                                placeholder="Ej. Restaurante Sonora Grill"
                                placeholderTextColor={theme.textSecondary + '40'}
                                style={{ backgroundColor: theme.cardSecondary, color: theme.text }}
                                className="w-full text-lg font-bold rounded-2xl p-5 border border-white/5"
                            />
                        </View>
                        
                        <View className="gap-2">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-1 ml-1">Descripción (Opcional)</Text>
                            <TextInput 
                                value={groupDesc}
                                onChangeText={setGroupDesc}
                                placeholder="Describe el propósito de este grupo..."
                                placeholderTextColor={theme.textSecondary + '40'}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                style={{ backgroundColor: theme.cardSecondary, color: theme.text }}
                                className="w-full text-base rounded-2xl p-5 h-32 border border-white/5"
                            />
                        </View>
                    </View>

                    <View className="bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20">
                        <View className="flex-row items-center gap-3 mb-2">
                            <MaterialIcons name="info-outline" size={18} color={theme.primary} />
                            <Text style={{ color: theme.primary }} className="font-black text-xs uppercase tracking-widest">Rol: Líder</Text>
                        </View>
                        <Text style={{ color: theme.textSecondary }} className="text-xs leading-relaxed">
                            Al crear la mesa serás el **Líder**. Podrás escanear tickets, asignar platillos y cerrar la cuenta final.
                        </Text>
                    </View>
                </MotiView>
            </ScrollView>

            <View className="px-6 pb-10">
                <TouchableOpacity 
                    onPress={handleCreateGroup}
                    disabled={isLoading}
                    style={{ backgroundColor: theme.primary }}
                    className="w-full py-5 rounded-2xl shadow-xl shadow-blue-500/20 items-center justify-center active:scale-[0.98]"
                >
                    {isLoading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className="text-black font-black text-base uppercase tracking-widest">Iniciar Sesión de Mesa</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
