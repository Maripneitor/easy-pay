import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { userRepository } from '../../src/infrastructure/api/repositories/UserRepository';

export default function ChangePasswordScreen() {
    const { theme, fontScale } = useTheme();
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsLoading(true);
        try {
            await userRepository.changePassword(oldPassword, newPassword);
            Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cambiar la contraseña. Verifica tu contraseña actual.');
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

            <ScrollView className="flex-1 px-6 pt-10">
                <Text style={{ fontSize: 10 * fontScale, color: theme.textSecondary }} className="font-black uppercase tracking-[3px] mb-8">Actualizar Contraseña</Text>

                <View className="gap-6">
                    <View>
                        <Text style={{ color: theme.textSecondary }} className="text-xs font-black uppercase mb-2 ml-2">Contraseña Actual</Text>
                        <TextInput
                            secureTextEntry
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            style={{ backgroundColor: theme.cardSecondary, color: theme.text, borderColor: theme.border }}
                            className="p-5 rounded-2xl border font-bold"
                            placeholder="••••••••"
                            placeholderTextColor={theme.textSecondary + '80'}
                        />
                    </View>

                    <View>
                        <Text style={{ color: theme.textSecondary }} className="text-xs font-black uppercase mb-2 ml-2">Nueva Contraseña</Text>
                        <TextInput
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                            style={{ backgroundColor: theme.cardSecondary, color: theme.text, borderColor: theme.border }}
                            className="p-5 rounded-2xl border font-bold"
                            placeholder="••••••••"
                            placeholderTextColor={theme.textSecondary + '80'}
                        />
                    </View>

                    <View>
                        <Text style={{ color: theme.textSecondary }} className="text-xs font-black uppercase mb-2 ml-2">Confirmar Nueva Contraseña</Text>
                        <TextInput
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={{ backgroundColor: theme.cardSecondary, color: theme.text, borderColor: theme.border }}
                            className="p-5 rounded-2xl border font-bold"
                            placeholder="••••••••"
                            placeholderTextColor={theme.textSecondary + '80'}
                        />
                    </View>

                    <TouchableOpacity 
                        onPress={handleSave}
                        disabled={isLoading}
                        style={{ backgroundColor: theme.primary }}
                        className="mt-10 py-5 rounded-2xl items-center shadow-lg"
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-black uppercase tracking-widest">Guardar Cambios</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
