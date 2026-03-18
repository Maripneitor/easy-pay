import React from 'react';
import { ScrollView, View, Text, Pressable, SafeAreaView, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/StitchTheme';
import { StatusBar } from 'expo-status-bar';

const NOTIFICATIONS = [
    {
        id: '1',
        type: 'invitation',
        title: 'Luis te invitó al grupo',
        groupName: 'Viaje a Cancún',
        time: 'Hace 2 horas',
        unread: true,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4a7XazcCNYEZasnwMgx1vtfQCNnmg3LypHLUmqNM-nXbybnSyeiaxmz-wydbcA9S2m106sT8Cp37P2YK6qqvrXQ_xQksA2amMk3qyQUKENks8ighHbZMZBkz-NpOLw6ZhyfSPwYrmJr8v2MzCtFQfrTgMiNHspPviuWLUE-dPFjMZly5kiesg8bIkq-qmpf96tyJEt5KxaNHMoH980U06acRhAI4hSeGhvFYQvlpn5x4O7NWg1gFKpBiiOtuxccfHNWlePQLBrKVb',
    },
    {
        id: '2',
        type: 'expense',
        title: 'Ana agregó Hamburguesas',
        amount: '$200.00',
        time: '09:15 AM',
        unread: true,
        icon: 'receipt-long',
        iconColor: '#fb923c',
    },
    {
        id: '3',
        type: 'payment',
        title: 'Carlos te pagó su parte',
        amount: '+$50.00',
        time: '4:00 PM',
        unread: false,
        icon: 'attach-money',
        iconColor: '#4ade80',
    },
    {
        id: '4',
        type: 'alert',
        title: 'Inicio de sesión detectado en un nuevo dispositivo',
        time: 'Martes, 14:00',
        unread: false,
        icon: 'security',
        iconColor: '#2196F3',
    },
    {
        id: '5',
        type: 'expense',
        title: 'Sofia agregó Uber a casa',
        amount: '$15.50',
        time: 'Lunes, 23:45',
        unread: false,
        icon: 'directions-car',
        iconColor: '#fb923c',
    },
];

export default function NotificationsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]">
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5">
                <View className="flex-row items-center gap-2">
                    <Text className="text-white text-xl font-black">NOTIFICACIONES</Text>
                    <View className="bg-blue-600 px-2 py-0.5 rounded-full">
                        <Text className="text-white text-[10px] font-bold">4</Text>
                    </View>
                </View>
                <Pressable>
                    <Text className="text-blue-400 text-xs font-bold">Marcar todas como leídas</Text>
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Grupos de notificaciones */}
                <View className="mb-8">
                    <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-[2px] mb-6">Hoy</Text>
                    {NOTIFICATIONS.filter(n => ['1', '2', '3'].includes(n.id)).map(n => renderNotificationCard(n))}
                </View>

                <View className="mb-8">
                    <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-[2px] mb-6">Ayer</Text>
                    {NOTIFICATIONS.filter(n => n.id === '3').map(n => renderNotificationCard(n))}
                </View>

                <View className="mb-8">
                    <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-[2px] mb-6">Semana Pasada</Text>
                    {NOTIFICATIONS.filter(n => ['4', '5'].includes(n.id)).map(n => renderNotificationCard(n))}
                </View>

                {/* Footer Empty State Style */}
                <View className="items-center py-10 opacity-30">
                    <View className="h-[1px] w-full bg-slate-800 absolute top-1/2" />
                    <View className="bg-[#0f172a] px-4">
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">No hay más notificaciones</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function renderNotificationCard(notif: any) {
    return (
        <View key={notif.id} className="relative mb-4">
            {notif.unread && (
                <View className="absolute -left-4 top-1/2 -translate-y-6 w-1 h-12 bg-blue-500 rounded-full shadow-lg shadow-blue-500" />
            )}
            <View className="bg-white/5 border border-white/10 rounded-3xl p-5 flex-row gap-4 items-center">
                {notif.avatar ? (
                    <Image source={{ uri: notif.avatar }} className="w-12 h-12 rounded-full border border-slate-700" />
                ) : (
                    <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: `${notif.iconColor}15`, borderWidth: 1, borderColor: `${notif.iconColor}30` }}>
                        <MaterialIcons name={notif.icon as any} size={24} color={notif.iconColor} />
                    </View>
                )}

                <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                            <Text className="text-white text-[15px] font-bold leading-tight flex-row flex-wrap">
                                {notif.title} {notif.groupName && <Text className="text-blue-500"> {notif.groupName}</Text>}
                            </Text>
                            <Text className="text-slate-500 text-[11px] mt-1 font-medium">{notif.time}</Text>
                        </View>
                        
                        {notif.amount && (
                            <View className="items-end ml-2">
                                <Text className="text-white font-black text-base">{notif.amount}</Text>
                                <Text className={`text-[9px] font-black uppercase tracking-tighter ${notif.type === 'expense' ? 'text-orange-400' : 'text-emerald-400'}`}>
                                    {notif.type === 'expense' ? 'Gasto' : 'Recibido'}
                                </Text>
                            </View>
                        )}

                        {notif.type === 'alert' && (
                            <Ionicons name="chevron-forward" size={16} color="#475569" />
                        )}
                    </View>

                    {notif.type === 'invitation' && (
                        <View className="flex-row gap-3 mt-4">
                            <Pressable className="bg-blue-600 px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 active:scale-95">
                                <Text className="text-white font-black text-xs uppercase">Aceptar</Text>
                            </Pressable>
                            <Pressable className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl active:bg-white/10">
                                <Text className="text-slate-400 font-bold text-xs uppercase">Rechazar</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

