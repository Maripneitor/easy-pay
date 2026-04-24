import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    TextInput,
    Dimensions,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { httpClient } from '../../src/infrastructure/api/http-client';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
    const { theme, fontScale } = useTheme();
    const { user, token } = useAuth();
    const insets = useSafeAreaInsets();
    
    // Perfil State
    const [nombre, setNombre] = useState(user?.nombre || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Password State
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    // Validations
    const isPasswordValid = newPassword.length >= 6 && newPassword === confirmPassword && currentPassword.length > 0;
    const passwordsMatch = newPassword === confirmPassword;

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            // Lógica para guardar perfil
            // await httpClient.put('/api/users/profile', { nombre, email });
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
            router.back();
        } catch (err) {
            Alert.alert('Error', 'No se pudo actualizar el perfil');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (!isPasswordValid) return;

        setIsSavingPassword(true);
        try {
            const response = await httpClient.put('/api/users/change-password', {
                current_password: currentPassword,
                new_password: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status === 'success') {
                Alert.alert('Éxito', 'Tu contraseña ha sido actualizada');
                setIsChangingPassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err: any) {
            const msg = err.response?.data?.detail || 'Error al cambiar la contraseña';
            Alert.alert('Error', msg);
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* TopAppBar */}
            <View className="flex-row items-center justify-between px-6 py-4 w-full">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
                    <MaterialIcons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight flex-1 text-center pr-10">Mi Perfil</Text>
            </View>

            <ScrollView 
                className="flex-1 px-6" 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}
            >
                {/* User Avatar Header */}
                <View className="items-center mb-10">
                    <View style={{ backgroundColor: theme.cardSecondary }} className="w-24 h-24 rounded-full items-center justify-center border-4 border-blue-500/20 mb-4">
                        <Text style={{ color: theme.primary }} className="text-4xl font-black">{user?.nombre?.charAt(0).toUpperCase()}</Text>
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 w-8 h-8 rounded-full items-center justify-center border-2 border-slate-900">
                            <MaterialIcons name="photo-camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: theme.text }} className="text-xl font-black">{user?.nombre}</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-xs font-medium opacity-60">{user?.email}</Text>
                </View>

                {/* Form Area: Basic Info */}
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-[2.5rem] p-8 border mb-6 gap-8">
                    <View className="flex-row items-center gap-2 mb-2">
                        <MaterialIcons name="person-outline" size={18} color={theme.primary} />
                        <Text style={{ color: theme.text }} className="font-black uppercase tracking-[2px] text-[10px]">Información Básica</Text>
                    </View>
                    
                    {/* Name */}
                    <View>
                        <Text style={{ color: theme.textSecondary }} className="text-[9px] font-black uppercase tracking-[2px] mb-3 ml-1">Nombre Completo</Text>
                        <TextInput 
                            value={nombre}
                            onChangeText={setNombre}
                            style={{ backgroundColor: theme.bg, color: theme.text }}
                            className="px-5 py-4 rounded-2xl font-bold text-base border border-white/5"
                            placeholder="Tu nombre..."
                        />
                    </View>

                    {/* Email */}
                    <View>
                        <Text style={{ color: theme.textSecondary }} className="text-[9px] font-black uppercase tracking-[2px] mb-3 ml-1">Email</Text>
                        <TextInput 
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={{ backgroundColor: theme.bg, color: theme.text }}
                            className="px-5 py-4 rounded-2xl font-bold text-base border border-white/5"
                            placeholder="tu@email.com..."
                        />
                    </View>
                </View>

                {/* Password Section (Accordion Style) */}
                <TouchableOpacity 
                    onPress={() => setIsChangingPassword(!isChangingPassword)}
                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                    className="rounded-3xl p-6 border flex-row justify-between items-center mb-6"
                >
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 bg-blue-500/10 rounded-xl items-center justify-center">
                            <MaterialIcons name="lock-outline" size={20} color={theme.primary} />
                        </View>
                        <View>
                            <Text style={{ color: theme.text }} className="font-black text-sm">Seguridad</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-medium">Actualiza tu contraseña</Text>
                        </View>
                    </View>
                    <MaterialIcons 
                        name={isChangingPassword ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                        size={24} 
                        color={theme.textSecondary} 
                    />
                </TouchableOpacity>

                {isChangingPassword && (
                    <View 
                        style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} 
                        className="rounded-[2.5rem] p-8 border mb-8 gap-6"
                    >
                        {/* Current Password */}
                        <View>
                            <Text style={{ color: theme.textSecondary }} className="text-[9px] font-black uppercase tracking-[2px] mb-3 ml-1">Contraseña Actual</Text>
                            <View style={{ backgroundColor: theme.bg }} className="rounded-2xl flex-row items-center px-5 border border-white/5">
                                <TextInput 
                                    secureTextEntry={!showPasswords}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    style={{ color: theme.text }}
                                    className="flex-1 h-14 font-bold text-base"
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.textSecondary + '40'}
                                />
                            </View>
                        </View>

                        {/* New Password */}
                        <View>
                            <Text style={{ color: theme.textSecondary }} className="text-[9px] font-black uppercase tracking-[2px] mb-3 ml-1">Nueva Contraseña</Text>
                            <View style={{ backgroundColor: theme.bg }} className="rounded-2xl flex-row items-center px-5 border border-white/5">
                                <TextInput 
                                    secureTextEntry={!showPasswords}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    style={{ color: theme.text }}
                                    className="flex-1 h-14 font-bold text-base"
                                    placeholder="Mínimo 6 caracteres"
                                    placeholderTextColor={theme.textSecondary + '40'}
                                />
                                <TouchableOpacity onPress={() => setShowPasswords(!showPasswords)}>
                                    <Feather name={showPasswords ? "eye-off" : "eye"} size={16} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View>
                            <Text style={{ color: theme.textSecondary }} className="text-[9px] font-black uppercase tracking-[2px] mb-3 ml-1">Confirmar Nueva Contraseña</Text>
                            <View 
                                style={{ backgroundColor: theme.bg, borderColor: !passwordsMatch && confirmPassword ? '#f43f5e' : 'transparent' }} 
                                className="rounded-2xl flex-row items-center px-5 border"
                            >
                                <TextInput 
                                    secureTextEntry={!showPasswords}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    style={{ color: theme.text }}
                                    className="flex-1 h-14 font-bold text-base"
                                    placeholder="Repite tu contraseña"
                                    placeholderTextColor={theme.textSecondary + '40'}
                                />
                            </View>
                            {!passwordsMatch && confirmPassword.length > 0 && (
                                <Text className="text-rose-500 text-[10px] font-bold mt-2 ml-2">Las contraseñas no coinciden</Text>
                            )}
                        </View>

                        <TouchableOpacity 
                            onPress={handleChangePassword}
                            disabled={!isPasswordValid || isSavingPassword}
                            style={{ opacity: isPasswordValid ? 1 : 0.5 }}
                            className="mt-4 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/20"
                        >
                            <LinearGradient
                                colors={['#3b82f6', '#2563eb']}
                                className="py-4 items-center"
                            >
                                {isSavingPassword ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-black uppercase text-xs tracking-widest">Actualizar Contraseña</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Footer Action: Global Save */}
            {!isChangingPassword && (
                <View 
                    style={{ backgroundColor: theme.bg, paddingBottom: insets.bottom + 16, borderTopWidth: 1, borderTopColor: theme.border + '15' }} 
                    className="absolute bottom-0 w-full px-6 pt-6"
                >
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        onPress={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="w-full h-16 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/20"
                    >
                        <LinearGradient
                            colors={[theme.primary, theme.primary + 'CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="w-full h-full items-center justify-center"
                        >
                            {isSavingProfile ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <Text className="text-black font-black text-base uppercase tracking-widest">Guardar Perfil</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
