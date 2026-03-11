import React from 'react';
import { ScrollView, View, Text, Pressable, SafeAreaView, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
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
];

export default function NotificationsScreen() {

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]">
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-slate-500 font-bold text-xs uppercase tracking-widest">Hoy</Text>
                    <Pressable>
                        <Text className="text-[#2196F3] text-xs font-bold">Marcar todo como leído</Text>
                    </Pressable>
                </View>

                {NOTIFICATIONS.map((notif) => (
                    <View key={notif.id} className="relative mb-4">
                        {notif.unread && (
                            <View className="absolute -left-3 top-1/2 -translate-y-4 w-1 h-8 bg-[#2196F3] rounded-full shadow-lg shadow-blue-500/50" />
                        )}
                        <View className="bg-slate-800/40 border border-white/5 rounded-3xl p-5 flex-row gap-4">
                            {notif.avatar ? (
                                <Image source={{ uri: notif.avatar }} className="w-12 h-12 rounded-full border border-slate-700" />
                            ) : (
                                <View className={`w-12 h-12 rounded-full items-center justify-center`} style={{ backgroundColor: `${notif.iconColor}20`, borderColor: `${notif.iconColor}40`, borderWidth: 1 }}>
                                    <MaterialIcons name={notif.icon as any} size={24} color={notif.iconColor} />
                                </View>
                            )}

                            <View className="flex-1">
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1">
                                        <Text className="text-white text-base font-medium leading-snug">
                                            {notif.title} {notif.groupName && <Text className="text-[#2196F3] font-black">{notif.groupName}</Text>}
                                        </Text>
                                        <Text className="text-slate-500 text-xs mt-1">{notif.time}</Text>
                                    </View>
                                    {notif.amount && (
                                        <View className="items-end">
                                            <Text className="text-white font-black text-lg">{notif.amount}</Text>
                                            <Text className={`text-[10px] font-bold uppercase tracking-tight ${notif.type === 'expense' ? 'text-orange-400' : 'text-green-400'}`}>
                                                {notif.type === 'expense' ? 'Gasto' : 'Recibido'}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {notif.type === 'invitation' && (
                                    <View className="flex-row gap-3 mt-4">
                                        <Pressable className="bg-[#2196F3] px-6 py-2 rounded-xl shadow-lg shadow-blue-500/20">
                                            <Text className="text-white font-bold text-sm">Aceptar</Text>
                                        </Pressable>
                                        <Pressable className="bg-transparent border border-slate-700 px-6 py-2 rounded-xl">
                                            <Text className="text-slate-400 font-bold text-sm">Rechazar</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                ))}

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
