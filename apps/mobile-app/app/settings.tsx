import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    Pressable, 
    Switch, 
    Modal, 
    Dimensions, 
    StyleSheet,
    TouchableOpacity,
    Image as RNImage
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { groupRepository } from '../src/infrastructure/api/repositories/GroupRepository';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { MotiView } from 'moti';

export default function SettingsScreen() {
    const { colorTheme, fontSize, theme, fontScale, setColorTheme, setFontSize } = useTheme();
    const { user, logout } = useAuth();
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showQR, setShowQR] = useState(false);
    const [userGroups, setUserGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.id) return;
            try {
                const groups = await groupRepository.findByUser(user.id);
                setUserGroups(Array.isArray(groups) ? groups : []);
            } catch (err) {
                console.error('Error fetching settings stats:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [user?.id]);

    const totalSpent = userGroups.reduce((acc, g) => acc + (g.total_gastado || 0), 0);
    const paidGroups = userGroups.filter(g => g.is_settled).length;

    const SectionHeader = ({ title }: { title: string }) => (
        <Text 
            style={{ fontSize: 10 * fontScale, color: theme.textSecondary }} 
            className="font-black uppercase tracking-[3px] mb-4 ml-2"
        >
            {title}
        </Text>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ borderBottomColor: theme.border, height: 80 }} className="px-6 flex-row items-center justify-between border-b">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="flex-row items-center gap-2"
                >
                    <MaterialIcons name="arrow-back" size={20} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary }} className="text-sm font-bold">Volver</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12 * fontScale, color: theme.text }} className="absolute left-0 right-0 text-center font-black tracking-[4px] uppercase -z-10">
                    Mi Perfil
                </Text>
                <TouchableOpacity 
                    onPress={() => setShowQR(true)}
                    style={{ backgroundColor: theme.glassBg, borderColor: theme.border }}
                    className="w-10 h-10 rounded-xl items-center justify-center border"
                >
                    <MaterialIcons name="qr-code" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24, paddingTop: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View 
                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                    className="p-8 rounded-[40px] border items-center mb-10 overflow-hidden"
                >
                    <View style={{ backgroundColor: `${theme.primary}10` }} className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24" />
                    
                    <View className="relative mb-6">
                        <View style={{ borderColor: theme.primary, backgroundColor: theme.card }} className="w-28 h-28 rounded-[40px] p-1 border-2 overflow-hidden shadow-2xl items-center justify-center">
                            {user?.nombre ? (
                                <View style={{ backgroundColor: theme.primary }} className="w-full h-full items-center justify-center rounded-[36px]">
                                    <Text className="text-white font-black text-4xl">{user.nombre.charAt(0).toUpperCase()}</Text>
                                </View>
                            ) : (
                                <MaterialIcons name="person" size={60} color={theme.textSecondary} />
                            )}
                        </View>
                        <View className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4" style={{ borderColor: theme.bg }} />
                    </View>

                    <Text 
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.5}
                        style={{ fontSize: 24 * fontScale, color: theme.text }} 
                        className="font-black tracking-tight mb-1"
                    >
                        {user?.nombre || 'Usuario'}
                    </Text>
                    <Text style={{ fontSize: 13 * fontScale, color: theme.textSecondary }} className="font-black uppercase tracking-widest mb-6">Personal Account</Text>
                    
                    <TouchableOpacity 
                        onPress={() => router.push('/profile/edit')}
                        style={{ backgroundColor: theme.primary }}
                        className="px-8 py-3 rounded-full shadow-lg"
                    >
                        <Text style={{ color: 'white', fontSize: 12 * fontScale }} className="font-black uppercase tracking-wider">Editar Perfil</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-between items-center mb-6">
                    <SectionHeader title="Historial" />
                    <TouchableOpacity onPress={() => router.push('/profile/stats')}>
                        <Text style={{ color: theme.primary }} className="text-[10px] font-black uppercase mb-4">Ver Detalles</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap gap-4 mb-10">
                    <TouchableOpacity onPress={() => router.push('/profile/stats')} style={{ backgroundColor: theme.cardSecondary, width: (SCREEN_WIDTH - 64) / 2, borderColor: theme.border }} className="p-5 rounded-[32px] border">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-slate-400 text-[10px] font-black uppercase">Gastado</Text>
                            <MaterialIcons name="payments" size={16} color={theme.primary} />
                        </View>
                        <Text style={{ fontSize: 18 * fontScale, color: theme.text }} className="font-mono font-black">
                            ${isLoading ? '...' : totalSpent.toFixed(2)}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/profile/stats')} style={{ backgroundColor: theme.cardSecondary, width: (SCREEN_WIDTH - 64) / 2, borderColor: theme.border }} className="p-5 rounded-[32px] border">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-slate-400 text-[10px] font-black uppercase">Grupos</Text>
                            <MaterialIcons name="groups" size={16} color={theme.primary} />
                        </View>
                        <Text style={{ fontSize: 18 * fontScale, color: theme.text }} className="font-mono font-black">
                            {isLoading ? '...' : userGroups.length}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Personalization Section */}
                <SectionHeader title="Personalización" />
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="p-6 rounded-[40px] border mb-10">
                    <Text style={{ color: theme.text, fontSize: 14 * fontScale }} className="font-black mb-6">Tema de Color</Text>
                    <View className="flex-row flex-wrap gap-4 mb-4">
                        {[
                            { id: 'light', color: '#2196F3', label: 'Claro' },
                            { id: 'default', color: '#38bdf8', label: 'Original' },
                            { id: 'vibrant', color: '#f87171', label: 'Vibrante' },
                            { id: 'serene', color: '#34d399', label: 'Sereno' },
                            { id: 'earth', color: '#fbbf24', label: 'Tierra' },
                            { id: 'pink', color: '#ff4081', label: 'Rosa' },
                        ].map((item) => (
                            <TouchableOpacity 
                                key={item.id} 
                                onPress={() => setColorTheme(item.id as any)}
                                className="items-center"
                                style={{ width: (SCREEN_WIDTH - 100) / 3 }}
                            >
                                <View 
                                    style={[
                                        { width: 50, height: 50, borderRadius: 15, backgroundColor: item.color, marginBottom: 8 },
                                        colorTheme === item.id && { borderWidth: 3, borderColor: theme.primary, transform: [{ scale: 1.1 }] }
                                    ]}
                                    className="shadow-sm shadow-black/20"
                                />
                                <Text style={{ color: colorTheme === item.id ? theme.primary : theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest text-center">
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={{ color: theme.text, fontSize: 14 * fontScale }} className="font-black mb-4">Tamaño de Texto</Text>
                    <View className="flex-row p-1.5 rounded-2xl" style={{ backgroundColor: theme.glassBg }}>
                        {(['small', 'medium', 'large'] as const).map((size) => (
                            <Pressable
                                key={size}
                                onPress={() => setFontSize(size)}
                                className="flex-1"
                            >
                                <View className={`py-3 rounded-xl items-center ${fontSize === size ? 'bg-white' : ''}`}>
                                    <Text style={{ color: fontSize === size ? '#0f172a' : '#64748b' }} className="font-black text-[10px] uppercase">{size === 'small' ? 'Chico' : size === 'medium' ? 'Normal' : 'Grande'}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Ajustes Section */}
                <SectionHeader title="Seguridad" />
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-[40px] border overflow-hidden mb-10">
                    <TouchableOpacity 
                        onPress={() => router.push('/profile/change-password')}
                        style={{ borderBottomColor: theme.border }} 
                        className="p-6 flex-row items-center justify-between border-b"
                    >
                        <View className="flex-row items-center gap-4">
                            <MaterialIcons name="lock-outline" size={24} color="#94a3b8" />
                            <Text style={{ color: theme.text, fontSize: 15 * fontScale }} className="font-bold">Cambiar Contraseña</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => router.push('/profile/two-factor-setup')}
                        className="p-6 flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center gap-4">
                            <MaterialIcons name="security" size={24} color="#94a3b8" />
                            <Text style={{ color: theme.text, fontSize: 15 * fontScale }} className="font-bold">Seguridad 2FA</Text>
                        </View>
                        <View className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <Text className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">Configurar</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity 
                    onPress={async () => {
                        await logout();
                        router.replace('/');
                    }}
                    className="flex-row items-center justify-center gap-3 py-6 rounded-[32px] bg-rose-500/10 border border-rose-500/20"
                >
                    <MaterialIcons name="logout" size={20} color="#f43f5e" />
                    <Text style={{ fontSize: 13 * fontScale }} className="text-rose-500 font-black uppercase tracking-[3px]">Cerrar Sesión</Text>
                </TouchableOpacity>

                <Text className="text-center text-slate-600 text-[10px] font-bold mt-10 uppercase tracking-widest">
                    Easy-Pay v2.4.0 (Build 942)
                </Text>
            </ScrollView>

            {/* QR View */}
            <Modal visible={showQR} transparent animationType="slide">
                <View className="flex-1 bg-black/95 justify-end">
                    <TouchableOpacity className="flex-1" onPress={() => setShowQR(false)} />
                    <View className="bg-white rounded-t-[60px] p-10 items-center">
                        <View className="w-16 h-1.5 bg-slate-100 rounded-full mb-8" />
                        <Text className="text-[#0f172a] text-2xl font-black mb-2">Mi Easy-ID</Text>
                        <Text className="text-slate-400 font-bold mb-8">Scan para unirse a grupos</Text>
                        <View className="p-6 bg-slate-50 rounded-[40px]">
                             <Ionicons name="qr-code" size={SCREEN_WIDTH * 0.6} color="#0f172a" />
                        </View>
                        <Text className="text-[#0f172a] text-xl font-black mt-8">@{user?.nombre?.toLowerCase().replace(' ', '') || 'usuario'}</Text>
                        <TouchableOpacity 
                            onPress={() => setShowQR(false)}
                            className="mt-10 bg-[#0f172a] px-12 py-4 rounded-full"
                        >
                            <Text className="text-white font-black uppercase tracking-widest text-xs">Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
