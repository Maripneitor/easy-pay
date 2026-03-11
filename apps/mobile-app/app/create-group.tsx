import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, SafeAreaView, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function CreateGroupScreen() {
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]">
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Top Navigation */}
            <View className="flex-row items-center justify-between px-6 py-4 bg-[#0f172a]/90 border-b border-slate-800/50 z-50">
                <Pressable onPress={() => router.back()} className="flex-row items-center gap-2">
                    <MaterialIcons name="arrow-back" size={24} color="#64748b" />
                    <Text className="text-slate-400 font-medium text-sm">Volver</Text>
                </Pressable>
                
                <Text className="text-white text-lg font-bold tracking-tight absolute left-1/2 -translate-x-1/2">
                    Easy-Pay
                </Text>
                
                <View className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 p-[1px]">
                    <View className="w-full h-full rounded-full border-2 border-[#0f172a] bg-slate-600 justify-center items-center overflow-hidden">
                         <MaterialIcons name="person" size={20} color="white" />
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 sm:px-6 lg:px-10" contentContainerStyle={{ paddingVertical: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Decorative background glow */}
                <View className="absolute top-0 left-[20%] right-[20%] h-64 bg-blue-500/20 blur-[100px] rounded-full z-0 pointer-events-none" />

                <View className="w-full max-w-2xl mx-auto z-10 gap-8">
                    {/* Header */}
                    <View className="items-center gap-2">
                        <Text className="text-white text-3xl sm:text-4xl font-black tracking-tight text-center drop-shadow-lg">
                            Crear nuevo grupo
                        </Text>
                        <Text className="text-slate-400 text-base text-center max-w-[400px]">
                            Configura los detalles del grupo y añade participantes para comenzar a dividir gastos fácilmente.
                        </Text>
                    </View>

                    {/* Glassmorphic Card Form */}
                    <View className="bg-slate-800/70 border border-white/5 shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 gap-8">
                        
                        {/* Section 1: Basic Information */}
                        <View className="gap-5">
                            <View className="flex-row items-center gap-2 pb-2 border-b border-slate-700/50">
                                <MaterialIcons name="info" size={20} color="#2078f3" />
                                <Text className="text-white text-lg font-bold tracking-tight">Información básica</Text>
                            </View>
                            
                            <View className="gap-5">
                                <View className="gap-2">
                                    <Text className="text-slate-300 text-sm font-medium">Nombre del grupo <Text className="text-[#2078f3]">*</Text></Text>
                                    <TextInput 
                                        value={groupName}
                                        onChangeText={setGroupName}
                                        placeholder="Ej. Viaje a la playa 2024"
                                        placeholderTextColor="#64748b"
                                        className="w-full bg-[#1e293b] border border-slate-700 text-white text-base rounded-lg p-3.5 focus:border-[#2078f3]"
                                    />
                                </View>
                                
                                <View className="gap-2">
                                    <Text className="text-slate-300 text-sm font-medium">Descripción <Text className="text-slate-500 text-xs font-normal">(opcional)</Text></Text>
                                    <TextInput 
                                        value={groupDesc}
                                        onChangeText={setGroupDesc}
                                        placeholder="Describe el propósito de este grupo..."
                                        placeholderTextColor="#64748b"
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                        className="w-full bg-[#1e293b] border border-slate-700 text-white text-base rounded-lg p-3.5 focus:border-[#2078f3] h-24"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Section 2: Members */}
                        <View className="gap-5">
                            <View className="flex-row items-center gap-2 pb-2 border-b border-slate-700/50">
                                <MaterialIcons name="group-add" size={20} color="#2078f3" />
                                <Text className="text-white text-lg font-bold tracking-tight">Invitar miembros</Text>
                            </View>
                            
                            <View className="gap-6">
                                {/* Search & Add */}
                                <View className="flex-row gap-2">
                                    <View className="flex-1 relative justify-center">
                                        <View className="absolute left-3 z-10">
                                            <MaterialIcons name="search" size={20} color="#64748b" />
                                        </View>
                                        <TextInput 
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                            placeholder="Buscar por nombre o email..."
                                            placeholderTextColor="#64748b"
                                            className="w-full bg-[#1e293b] border border-slate-700 text-white text-sm rounded-lg py-3 pl-10 pr-3 focus:border-[#2078f3]"
                                        />
                                    </View>
                                    <Pressable className="bg-[#1e293b] border border-slate-600 rounded-lg px-4 justify-center items-center active:bg-slate-700">
                                        <MaterialIcons name="add" size={24} color="white" />
                                    </Pressable>
                                </View>
                                
                                {/* Members List */}
                                <View className="gap-3">
                                    <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Miembros agregados</Text>
                                    
                                    {/* Admin */}
                                    <View className="flex-row items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                        <View className="flex-row items-center gap-3">
                                            <View className="w-10 h-10 rounded-full border border-slate-600 bg-slate-700 justify-center items-center">
                                                <MaterialIcons name="person" size={20} color="white" />
                                                <View className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full border-2 border-[#0f172a] p-0.5">
                                                    <MaterialIcons name="check" size={10} color="white" />
                                                </View>
                                            </View>
                                            <View>
                                                <Text className="text-white text-sm font-semibold">Ana Pérez</Text>
                                                <Text className="text-slate-400 text-xs">ana.perez@example.com</Text>
                                            </View>
                                        </View>
                                        <View className="bg-[#2078f3]/10 border border-[#2078f3]/20 px-2.5 py-1 rounded-full">
                                            <Text className="text-[#2078f3] text-xs font-medium">Administrador</Text>
                                        </View>
                                    </View>

                                    {/* Member 2 */}
                                    <View className="flex-row items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                        <View className="flex-row items-center gap-3">
                                            <View className="w-10 h-10 rounded-full border border-slate-600 bg-slate-700 justify-center items-center">
                                                <MaterialIcons name="person-outline" size={20} color="white" />
                                            </View>
                                            <View>
                                                <Text className="text-white text-sm font-semibold">Carlos López</Text>
                                                <Text className="text-slate-400 text-xs">carlos.lopez@example.com</Text>
                                            </View>
                                        </View>
                                        <View className="flex-row items-center gap-3">
                                            <View className="bg-slate-700/30 border border-slate-600/30 px-2.5 py-1 rounded-full">
                                                <Text className="text-slate-400 text-xs font-medium">Miembro</Text>
                                            </View>
                                            <Pressable className="p-1 active:bg-red-400/10 rounded">
                                                <MaterialIcons name="delete" size={18} color="#64748b" />
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Footer Actions */}
                        <View className="pt-4 mt-2 border-t border-slate-700/50 items-end">
                            <Pressable 
                                onPress={() => router.push('/(tabs)/dashboard')}
                                className="w-full sm:w-auto bg-[#2078f3] py-3.5 px-8 rounded-lg shadow-lg flex-row items-center justify-center gap-2 active:bg-blue-600"
                            >
                                <Text className="text-white font-bold">CREAR GRUPO</Text>
                                <MaterialIcons name="arrow-forward" size={20} color="white" />
                            </Pressable>
                        </View>
                        
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
