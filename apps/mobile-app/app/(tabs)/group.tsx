import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function GroupListScreen() {
    const GROUPS = [
        { id: 'g1', name: 'Viaje Playa', members: 5, balance: '+$480.00', status: 'Activo', bg: '#3b82f6' },
        { id: 'g2', name: 'Mesa #4', members: 3, balance: '-$120.00', status: 'Pendiente', bg: '#a855f7' },
        { id: 'g3', name: 'Amigos Tech', members: 8, balance: '$0.00', status: 'Completado', bg: '#10b981' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ title: 'Mis Grupos', headerShown: true, headerStyle: { backgroundColor: '#0d1425' }, headerTintColor: '#fff' }} />
            
            <ScrollView className="flex-1 px-6 pt-4">
                <View className="flex-row justify-between items-center mb-8">
                    <View>
                        <Text className="text-white text-3xl font-black">Grupos</Text>
                        <Text className="text-slate-500 text-sm">Gestiona tus cuentas compartidas</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => router.push('/create-group')}
                        className="w-12 h-12 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/20"
                    >
                        <Ionicons name="add" size={28} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="gap-4 pb-20">
                    {GROUPS.map(group => (
                        <TouchableOpacity 
                            key={group.id}
                            onPress={() => router.push({ pathname: '/(tabs)/group/[id]', params: { id: group.id } } as any)}
                            className="bg-white/5 border border-white/10 rounded-[30px] p-5 flex-row items-center"
                        >
                            <View style={{ backgroundColor: `${group.bg}15` }} className="w-14 h-14 rounded-2xl items-center justify-center mr-4">
                                <MaterialIcons name="groups" size={30} color={group.bg} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg">{group.name}</Text>
                                <Text className="text-slate-500 text-xs">{group.members} miembros • {group.status}</Text>
                            </View>
                            <View className="items-end">
                                <Text className={`font-black text-sm ${group.balance.startsWith('+') ? 'text-emerald-500' : group.balance.startsWith('-') ? 'text-rose-500' : 'text-slate-400'}`}>
                                    {group.balance}
                                </Text>
                                <MaterialIcons name="chevron-right" size={20} color="#334155" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
