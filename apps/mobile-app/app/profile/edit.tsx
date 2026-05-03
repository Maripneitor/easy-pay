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
import { userRepository } from '../../src/infrastructure/api/repositories/UserRepository';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
    const { theme, fontScale } = useTheme();
    const { user, saveSession } = useAuth();
    const insets = useSafeAreaInsets();
    
    // Perfil State
    const [nombre, setNombre] = useState(user?.nombre || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const validate = () => {
        if (!nombre.trim()) {
            Alert.alert('Validación', 'El nombre es obligatorio');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Validación', 'Formato de correo electrónico inválido');
            return false;
        }
        return true;
    };

    const handleSaveProfile = async () => {
        if (!validate()) return;

        setIsSavingProfile(true);
        try {
            const result = await userRepository.updateUser({
                nombre,
                email
            });

            if (result.status === 'success') {
                // ✅ Sincronización inmediata de datos y Token
                await saveSession(result.new_token || result.token || '', {
                    ...user,
                    nombre,
                    email
                });

                Alert.alert('Éxito', 'Perfil actualizado correctamente');
                router.back();
            } else {
                Alert.alert('Error', result.message || 'No se pudo actualizar el perfil');
            }
        } catch (err: any) {
            const msg = err.response?.data?.detail || err.message || 'No se pudo conectar con el servidor';
            Alert.alert('Error', msg);
        } finally {
            setIsSavingProfile(false);
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
                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight flex-1 text-center pr-10">Editar Perfil</Text>
            </View>

            <ScrollView 
                className="flex-1 px-6" 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}
            >
                {/* User Avatar Header */}
                <View className="items-center mb-10">
                    <View style={{ backgroundColor: theme.cardSecondary }} className="w-24 h-24 rounded-full items-center justify-center border-4 border-blue-500/20 mb-4">
                        <Text style={{ color: theme.primary }} className="text-4xl font-black">{nombre?.charAt(0).toUpperCase() || 'U'}</Text>
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 w-8 h-8 rounded-full items-center justify-center border-2 border-slate-900">
                            <MaterialIcons name="photo-camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: theme.text }} className="text-xl font-black">{nombre || 'Usuario'}</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-xs font-medium opacity-60">{email || 'tu@email.com'}</Text>
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

                {/* Password Section (Redirect style) */}
                <TouchableOpacity 
                    onPress={() => router.push('/profile/change-password')}
                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                    className="rounded-3xl p-6 border flex-row justify-between items-center mb-6"
                >
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 bg-blue-500/10 rounded-xl items-center justify-center">
                            <MaterialIcons name="lock-outline" size={20} color={theme.primary} />
                        </View>
                        <View>
                            <Text style={{ color: theme.text }} className="font-black text-sm">Seguridad</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-medium">Cambiar mi contraseña</Text>
                        </View>
                    </View>
                    <MaterialIcons 
                        name="chevron-right" 
                        size={24} 
                        color={theme.textSecondary} 
                    />
                </TouchableOpacity>

                <View className="mt-4 px-4 items-center">
                    <Feather name="shield" size={24} color={theme.primary + '40'} />
                    <Text style={{ color: theme.textSecondary }} className="text-[10px] font-medium text-center mt-4 px-10">
                        Para cambios en datos financieros o de alta seguridad, es posible que se te solicite una verificación adicional.
                    </Text>
                </View>
            </ScrollView>

            {/* Footer Action: Global Save */}
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
                            <Text className="text-black font-black text-base uppercase tracking-widest">Guardar Cambios</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
