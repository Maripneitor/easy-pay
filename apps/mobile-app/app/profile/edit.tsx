import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    TextInput,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function EditProfileScreen() {
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    
    const [nombre, setNombre] = useState(user?.nombre || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleSave = () => {
        // Here would go the logic to save via API
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* TopAppBar */}
            <View className="flex-row items-center justify-between px-6 py-4 w-full">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
                    <MaterialIcons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight flex-1 text-center pr-10">Editar Perfil</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}>
                {/* Form Area */}
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-[2.5rem] p-8 border mb-8 gap-8">
                    {/* Name */}
                    <View>
                        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-3 ml-1">Nombre Completo</Text>
                        <TextInput 
                            value={nombre}
                            onChangeText={setNombre}
                            style={{ backgroundColor: theme.bg, color: theme.text }}
                            className="px-5 py-4 rounded-2xl font-bold text-base"
                            placeholder="Tu nombre..."
                        />
                    </View>

                    {/* Email */}
                    <View>
                        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-3 ml-1">Correo Electrónico</Text>
                        <TextInput 
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={{ backgroundColor: theme.bg, color: theme.text }}
                            className="px-5 py-4 rounded-2xl font-bold text-base"
                            placeholder="tu@email.com..."
                        />
                    </View>
                </View>

                {/* Info Text */}
                <View className="flex-row items-center gap-3 px-4 opacity-60">
                    <Ionicons name="information-circle-outline" size={20} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary }} className="text-[10px] font-medium flex-1">
                        Tu información se sincronizará con todos tus dispositivos automáticamente.
                    </Text>
                </View>
            </ScrollView>

            {/* Footer Action */}
            <View 
                style={{ backgroundColor: theme.bg, borderColor: theme.border }} 
                className="absolute bottom-0 w-full px-6 py-8 border-t"
            >
                <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={handleSave}
                    className="w-full h-16 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/20"
                >
                    <LinearGradient
                        colors={[theme.primary, theme.primary + 'CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-full h-full items-center justify-center"
                    >
                        <Text className="text-black font-black text-base uppercase tracking-widest">Guardar Cambios</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
