import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { useEasyPay } from '../../context/EasyPayContext';

export default function ChangePasswordScreen() {
    const { theme, fontScale } = useTheme();
    const { user, changePassword } = useEasyPay();
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (!user?.id) {
            Alert.alert('Error', 'No se pudo identificar al usuario');
            return;
        }

        setIsLoading(true);
        try {
            await changePassword(user.id, { 
                new_password: newPassword, 
                confirm_password: confirmPassword 
            });
            Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cambiar la contraseña. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <Stack.Screen options={{ title: 'Cambiar Contraseña', headerShown: false }} />
            
            <View style={{ height: 80, borderBottomColor: theme.border }} className="px-6 flex-row items-center justify-between border-b">
                <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
                    <MaterialIcons name="arrow-back" size={20} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary }} className="font-bold">Volver</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16 * fontScale, color: theme.text }} className="font-black uppercase tracking-widest">Seguridad</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6 pt-10" showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: theme.cardSecondary + '50' }} className="p-8 rounded-[40px] border border-white/5 backdrop-blur-xl shadow-2xl">
                    <Text style={{ fontSize: 10 * fontScale, color: theme.textSecondary }} className="font-black uppercase tracking-[3px] mb-8">Actualizar Contraseña</Text>

                    <View className="gap-8">
                        <View>
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase mb-3 ml-2">Nueva Contraseña</Text>
                            <TextInput
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                                style={{ backgroundColor: theme.bg + '80', color: theme.text, borderColor: theme.border + '30' }}
                                className="p-6 rounded-[24px] border font-bold"
                                placeholder="••••••••"
                                placeholderTextColor={theme.textSecondary + '40'}
                            />
                        </View>

                        <View>
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase mb-3 ml-2">Confirmar Nueva</Text>
                            <TextInput
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                style={{ backgroundColor: theme.bg + '80', color: theme.text, borderColor: theme.border + '30' }}
                                className="p-6 rounded-[24px] border font-bold"
                                placeholder="••••••••"
                                placeholderTextColor={theme.textSecondary + '40'}
                            />
                        </View>

                        <TouchableOpacity 
                            onPress={handleSave}
                            disabled={isLoading}
                            style={{ backgroundColor: theme.primary }}
                            className="mt-6 py-6 rounded-[28px] items-center shadow-xl shadow-blue-500/30"
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-black uppercase tracking-widest text-xs">Guardar Nueva Contraseña</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mt-10 px-4 items-center">
                    <MaterialIcons name="security" size={32} color={theme.textSecondary + '20'} />
                    <Text style={{ color: theme.textSecondary + '60' }} className="text-[10px] font-bold text-center mt-4 px-10">
                        Tu seguridad es nuestra prioridad. Las contraseñas están cifradas de extremo a extremo.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
