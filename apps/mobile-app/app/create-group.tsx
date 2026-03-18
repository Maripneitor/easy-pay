import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useDependencies } from '../src/infrastructure/context/DependenciesContext';

export default function CreateGroupScreen() {
    const { useCases } = useDependencies();
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Por favor ingresa un nombre para el grupo');
            return;
        }

        setIsLoading(true);
        try {
            // In a real app, we'd get the current user from an AuthContext
            const leader = { 
                id: 'me', 
                name: 'Ana Pérez', 
                role: 'leader' as const, 
                hasPaid: false 
            };
            
            await useCases.createGroup.execute(leader, groupName);
            
            Alert.alert(
                '¡Éxito!', 
                `Grupo "${groupName}" creado correctamente.`,
                [{ text: 'OK', onPress: () => router.push('/(tabs)/dashboard') }]
            );
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear el grupo');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

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
                
                <View className="w-8 h-8 rounded-full bg-blue-500 p-[1px]">
                    <View className="w-full h-full rounded-full border-2 border-[#0f172a] bg-slate-600 justify-center items-center overflow-hidden">
                         <MaterialIcons name="person" size={20} color="white" />
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 sm:px-6 lg:px-10" contentContainerStyle={{ paddingVertical: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Decorative background glow */}
                <View className="absolute top-0 left-[20%] right-[20%] h-64 bg-blue-500/10 rounded-full z-0 pointer-events-none" />

                <View className="w-full max-w-2xl mx-auto z-10 gap-8">
                    {/* Header */}
                    <View className="items-center gap-2">
                        <Text className="text-white text-3xl sm:text-4xl font-black tracking-tight text-center">
                            Crear nuevo grupo
                        </Text>
                        <Text className="text-slate-400 text-base text-center max-w-[400px]">
                            Configura los detalles del grupo y añade participantes para comenzar a dividir gastos fácilmente.
                        </Text>
                    </View>

                    {/* Glassmorphic Card Form */}
                    <View className="bg-slate-800/40 border border-white/5 shadow-2xl rounded-3xl p-6 sm:p-8 gap-8">
                        
                        {/* Section 1: Basic Information */}
                        <View className="gap-5">
                            <View className="flex-row items-center gap-2 pb-2 border-b border-slate-700/50">
                                <MaterialIcons name="info" size={20} color="#3b82f6" />
                                <Text className="text-white text-lg font-bold tracking-tight">Información básica</Text>
                            </View>
                            
                            <View className="gap-5">
                                <View className="gap-2">
                                    <View className="flex-row justify-between">
                                        <Text className="text-slate-300 text-sm font-medium">Nombre del grupo</Text>
                                        <Text className="text-red-500 font-bold">*</Text>
                                    </View>
                                    <TextInput 
                                        value={groupName}
                                        onChangeText={setGroupName}
                                        placeholder="Ej. Cena en taquería"
                                        placeholderTextColor="#475569"
                                        className="w-full bg-slate-900/50 border border-slate-700 text-white text-base rounded-xl p-4 focus:border-blue-500"
                                    />
                                </View>
                                
                                <View className="gap-2">
                                    <Text className="text-slate-300 text-sm font-medium">Descripción <Text className="text-slate-500 text-xs font-normal">(opcional)</Text></Text>
                                    <TextInput 
                                        value={groupDesc}
                                        onChangeText={setGroupDesc}
                                        placeholder="Describe el propósito de este grupo..."
                                        placeholderTextColor="#475569"
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                        className="w-full bg-slate-900/50 border border-slate-700 text-white text-base rounded-xl p-4 focus:border-blue-500 h-24"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Section 2: Members */}
                        <View className="gap-5">
                            <View className="flex-row items-center gap-2 pb-2 border-b border-slate-700/50">
                                <MaterialIcons name="group-add" size={20} color="#3b82f6" />
                                <Text className="text-white text-lg font-bold tracking-tight">Invitar miembros</Text>
                            </View>
                            
                            <View className="gap-6">
                                {/* Search & Add */}
                                <View className="flex-row gap-2">
                                    <View className="flex-1 relative justify-center">
                                        <View className="absolute left-4 z-10">
                                            <MaterialIcons name="search" size={20} color="#64748b" />
                                        </View>
                                        <TextInput 
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                            placeholder="Nombre o email..."
                                            placeholderTextColor="#475569"
                                            className="w-full bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:border-blue-500"
                                        />
                                    </View>
                                    <Pressable className="bg-slate-700/50 border border-slate-600 rounded-xl px-4 justify-center items-center active:bg-slate-700">
                                        <MaterialIcons name="add" size={24} color="white" />
                                    </Pressable>
                                </View>
                                
                                {/* Members List */}
                                <View className="gap-3">
                                    <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Participantes</Text>
                                    
                                    {/* Admin */}
                                    <View className="flex-row items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-white/5">
                                        <View className="flex-row items-center gap-3">
                                            <View className="w-10 h-10 rounded-full bg-blue-500/10 justify-center items-center border border-blue-500/20">
                                                <MaterialIcons name="person" size={20} color="#3b82f6" />
                                            </View>
                                            <View>
                                                <Text className="text-white text-sm font-bold">Ana Pérez (Tú)</Text>
                                                <Text className="text-slate-500 text-xs">Administrador</Text>
                                            </View>
                                        </View>
                                        <MaterialIcons name="stars" size={20} color="#3b82f6" />
                                    </View>

                                    {/* Member 2 */}
                                    <View className="flex-row items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-white/5">
                                        <View className="flex-row items-center gap-3">
                                            <View className="w-10 h-10 rounded-full bg-slate-800 justify-center items-center border border-slate-700">
                                                <MaterialIcons name="person-outline" size={20} color="#94a3b8" />
                                            </View>
                                            <View>
                                                <Text className="text-white text-sm font-bold">Carlos López</Text>
                                                <Text className="text-slate-500 text-xs text-wrap">carlos@example.com</Text>
                                            </View>
                                        </View>
                                        <Pressable className="p-2 active:bg-red-500/10 rounded-lg">
                                            <MaterialIcons name="delete-outline" size={20} color="#64748b" />
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Footer Actions */}
                        <View className="pt-4 border-t border-slate-700/50">
                            <Pressable 
                                onPress={handleCreateGroup}
                                disabled={isLoading}
                                className={`w-full bg-blue-600 py-5 rounded-2xl shadow-xl flex-row items-center justify-center gap-3 active:scale-[0.98] ${isLoading ? 'opacity-70' : ''}`}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Text className="text-white font-black text-base uppercase tracking-widest">Crear Grupo</Text>
                                        <MaterialIcons name="check-circle" size={22} color="white" />
                                    </>
                                )}
                            </Pressable>
                        </View>
                        
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
