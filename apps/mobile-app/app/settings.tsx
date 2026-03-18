import React from 'react';
import { View, Text, ScrollView, Pressable, Switch, Image } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(true);

    const SettingItem = ({ icon, title, subtitle, value, type = 'chevron', onPress, color = '#3b82f6' }: any) => (
        <Pressable 
            onPress={onPress}
            className="flex-row items-center justify-between py-4 border-b border-white/5"
        >
            <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-xl bg-slate-800 items-center justify-center border border-white/5">
                    <MaterialIcons name={icon} size={22} color={color} />
                </View>
                <View>
                    <Text className="text-white font-bold text-base">{title}</Text>
                    {subtitle && <Text className="text-slate-500 text-xs">{subtitle}</Text>}
                </View>
            </View>
            {type === 'chevron' && <MaterialIcons name="chevron-right" size={24} color="#334155" />}
            {type === 'switch' && (
                <Switch 
                    value={value} 
                    onValueChange={onPress}
                    trackColor={{ false: '#334155', true: '#3b82f6' }}
                    thumbColor="white"
                />
            )}
        </Pressable>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ 
                headerShown: true, 
                headerTitle: 'AJUSTES',
                headerTitleStyle: { fontWeight: '900', fontSize: 16 },
                headerTintColor: 'white',
                headerStyle: { backgroundColor: '#1e293b' },
                headerLeft: () => (
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </Pressable>
                )
            }} />

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View className="items-center py-10">
                    <View className="relative">
                        <View className="w-24 h-24 rounded-[35px] bg-blue-600 items-center justify-center border-4 border-slate-900 shadow-2xl">
                            <Text className="text-white text-3xl font-black">LG</Text>
                        </View>
                        <Pressable className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full items-center justify-center border-2 border-slate-900">
                            <MaterialIcons name="edit" size={16} color="white" />
                        </Pressable>
                    </View>
                    <Text className="text-white text-2xl font-black mt-4">Luis Gonzalez</Text>
                    <Text className="text-slate-500 font-medium">luis.gonzalez@example.com</Text>
                </View>

                {/* Account Settings */}
                <View className="mb-8">
                    <Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">MI CUENTA</Text>
                    <View className="bg-slate-800/20 border border-white/5 rounded-[30px] px-5">
                        <SettingItem 
                            icon="person-outline" 
                            title="Información Personal" 
                            subtitle="Nombre, correo, teléfono" 
                        />
                        <SettingItem 
                            icon="account-balance-wallet" 
                            title="Métodos de Pago" 
                            subtitle="Visa **** 4242" 
                            onPress={() => router.push('/(tabs)/payments')}
                        />
                        <SettingItem 
                            icon="qr-code-2" 
                            title="Mi Código QR" 
                            subtitle="Para unirse a mesas rápido" 
                        />
                    </View>
                </View>

                {/* Preferences */}
                <View className="mb-8">
                    <Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">PREFERENCIAS</Text>
                    <View className="bg-slate-800/20 border border-white/5 rounded-[30px] px-5">
                        <SettingItem 
                            icon="notifications-none" 
                            title="Notificaciones" 
                            type="switch"
                            value={notificationsEnabled}
                            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                            color="#c084fc"
                        />
                        <SettingItem 
                            icon="dark-mode" 
                            title="Modo Oscuro" 
                            type="switch"
                            value={darkMode}
                            onPress={() => setDarkMode(!darkMode)}
                            color="#fbbf24"
                        />
                        <SettingItem 
                            icon="attach-money" 
                            title="Moneda Predeterminada" 
                            subtitle="MXN ($)" 
                            color="#10b981"
                        />
                    </View>
                </View>

                {/* Security & Support */}
                <View className="mb-12">
                    <Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">SEGURIDAD Y SOPORTE</Text>
                    <View className="bg-slate-800/20 border border-white/5 rounded-[30px] px-5">
                        <SettingItem 
                            icon="security" 
                            title="Privacidad y Seguridad" 
                            color="#64748b"
                        />
                        <SettingItem 
                            icon="help-outline" 
                            title="Centro de Ayuda" 
                            color="#64748b"
                        />
                    </View>
                </View>

                {/* Logout */}
                <Pressable 
                    onPress={() => router.replace('/auth')}
                    className="flex-row items-center justify-center gap-2 py-5 bg-red-500/10 rounded-2xl border border-red-500/20 mb-20"
                >
                    <MaterialIcons name="logout" size={20} color="#ef4444" />
                    <Text className="text-red-500 font-black text-xs uppercase tracking-widest">Cerrar Sesión</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
