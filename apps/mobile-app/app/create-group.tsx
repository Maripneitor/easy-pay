import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useDependencies } from '../src/infrastructure/context/DependenciesContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../src/infrastructure/context/ThemeContext';

export default function CreateGroupScreen() {
    const { useCases } = useDependencies();
    const { user } = useAuth();
    const { theme } = useTheme();
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
                id: user?.id || 'me', 
                name: user?.nombre || 'Usuario', 
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
            <View style={{ backgroundColor: theme.bg }} className="flex-row items-center justify-between px-6 py-4 border-b border-white/5 z-50">
                <Pressable onPress={() => router.back()} className="flex-row items-center gap-2">
                    <MaterialIcons name="arrow-back" size={24} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary }} className="font-medium text-sm text-slate-400">Volver</Text>
                </Pressable>
                
                <Text style={{ color: theme.text }} className="text-lg font-bold tracking-tight absolute left-1/2 -translate-x-1/2">
                    Easy-Pay
                </Text>
                
                <View style={{ backgroundColor: theme.primary }} className="w-8 h-8 rounded-full p-[1px]">
                    <View style={{ backgroundColor: theme.bg }} className="w-full h-full rounded-full border-2 border-transparent justify-center items-center overflow-hidden">
                         <Text style={{ color: theme.primary, fontSize: 10 }} className="font-black">
                             {user?.nombre?.substring(0,2).toUpperCase() || 'EP'}
                         </Text>
                    </View>
                </View>
            </View>

            <ScrollView style={{ backgroundColor: theme.bg }} className="flex-1 px-4 sm:px-6 lg:px-10" contentContainerStyle={{ paddingVertical: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Decorative background glow */}
                <View className="absolute top-0 left-[20%] right-[20%] h-64 bg-blue-500/10 rounded-full z-0 pointer-events-none" />

                <View className="w-full max-w-2xl mx-auto z-10 gap-8">
                    {/* Header */}
                    <View className="items-center gap-2">
                        <Text style={{ color: theme.text }} className="text-3xl sm:text-4xl font-black tracking-tight text-center">
                            Crear nuevo grupo
                        </Text>
                        <Text style={{ color: theme.textSecondary }} className="text-base text-center max-w-[400px]">
                            Configura los detalles del grupo y añade participantes para comenzar a dividir gastos fácilmente.
                        </Text>
                    </View>

                    {/* Glassmorphic Card Form */}
                    <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="border shadow-2xl rounded-3xl p-6 sm:p-8 gap-8">
                        
                        {/* Section 1: Basic Information */}
                        <View className="gap-5">
                            <View style={{ borderBottomColor: theme.border }} className="flex-row items-center gap-2 pb-2 border-b">
                                <MaterialIcons name="info" size={20} color={theme.primary} />
                                <Text style={{ color: theme.text }} className="text-lg font-bold tracking-tight">Información básica</Text>
                            </View>
                            
                            <View className="gap-5">
                                <View className="gap-2">
                                    <View className="flex-row justify-between">
                                        <Text style={{ color: theme.textSecondary }} className="text-sm font-medium">Nombre del grupo</Text>
                                        <Text className="text-red-500 font-bold">*</Text>
                                    </View>
                                    <TextInput 
                                        value={groupName}
                                        onChangeText={setGroupName}
                                        placeholder="Ej. Cena en taquería"
                                        placeholderTextColor={theme.textSecondary}
                                        style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
                                        className="w-full border text-base rounded-xl p-4"
                                    />
                                </View>
                                
                                <View className="gap-2">
                                    <Text style={{ color: theme.textSecondary }} className="text-sm font-medium">Descripción <Text style={{ color: theme.textSecondary, opacity: 0.6 }} className="text-xs font-normal">(opcional)</Text></Text>
                                    <TextInput 
                                        value={groupDesc}
                                        onChangeText={setGroupDesc}
                                        placeholder="Describe el propósito de este grupo..."
                                        placeholderTextColor={theme.textSecondary}
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                        style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
                                        className="w-full border text-base rounded-xl p-4 h-24"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Section 2: Members */}
                        <View className="gap-5">
                            <View style={{ borderBottomColor: theme.border }} className="flex-row items-center gap-2 pb-2 border-b">
                                <MaterialIcons name="group-add" size={20} color={theme.primary} />
                                <Text style={{ color: theme.text }} className="text-lg font-bold tracking-tight">Invitar miembros</Text>
                            </View>
                            
                            <View className="gap-6">
                                {/* Search & Add */}
                                <View className="flex-row gap-2">
                                    <View className="flex-1 relative justify-center">
                                        <View className="absolute left-4 z-10">
                                            <MaterialIcons name="search" size={20} color={theme.textSecondary} />
                                        </View>
                                        <TextInput 
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                            placeholder="Nombre o email..."
                                            placeholderTextColor={theme.textSecondary}
                                            style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
                                            className="w-full border text-sm rounded-xl py-3.5 pl-11 pr-4"
                                        />
                                    </View>
                                    <Pressable style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="border rounded-xl px-4 justify-center items-center active:opacity-70">
                                        <MaterialIcons name="add" size={24} color={theme.text} />
                                    </Pressable>
                                </View>
                                
                                {/* Members List */}
                                <View className="gap-3">
                                    <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-widest mb-1 ml-1 opacity-70">Participantes</Text>
                                    
                                    {/* Admin */}
                                    <View style={{ backgroundColor: theme.bg, borderColor: theme.border }} className="flex-row items-center justify-between p-4 rounded-2xl border">
                                        <View className="flex-row items-center gap-3">
                                            <View style={{ backgroundColor: `${theme.primary}10`, borderColor: `${theme.primary}20` }} className="w-10 h-10 rounded-full justify-center items-center border">
                                                <MaterialIcons name="person" size={20} color={theme.primary} />
                                            </View>
                                            <View>
                                                <Text style={{ color: theme.text }} className="text-sm font-bold">{user?.nombre || 'Usuario'} (Tú)</Text>
                                                <Text style={{ color: theme.textSecondary }} className="text-xs">Administrador</Text>
                                            </View>
                                        </View>
                                        <MaterialIcons name="stars" size={20} color={theme.primary} />
                                    </View>

                                    {/* Member 2 */}
                                    <View style={{ backgroundColor: theme.bg, borderColor: theme.border }} className="flex-row items-center justify-between p-4 rounded-2xl border">
                                        <View className="flex-row items-center gap-3">
                                            <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="w-10 h-10 rounded-full justify-center items-center border">
                                                <MaterialIcons name="person-outline" size={20} color={theme.textSecondary} />
                                            </View>
                                            <View>
                                                <Text style={{ color: theme.text }} className="text-sm font-bold">Carlos López</Text>
                                                <Text style={{ color: theme.textSecondary }} className="text-xs text-wrap">carlos@example.com</Text>
                                            </View>
                                        </View>
                                        <Pressable className="p-2 active:opacity-70 rounded-lg">
                                            <MaterialIcons name="delete-outline" size={20} color={theme.textSecondary} />
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Footer Actions */}
                        <View style={{ borderColor: theme.border }} className="pt-4 border-t">
                            <Pressable 
                                onPress={handleCreateGroup}
                                disabled={isLoading}
                                style={{ backgroundColor: '#2196F3', shadowColor: '#2196F3' }}
                                className={`w-full py-5 rounded-2xl shadow-lg shadow-blue-500/40 flex-row items-center justify-center active:scale-[0.98] ${isLoading ? 'opacity-70' : ''}`}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-black text-base uppercase tracking-widest">Crear Grupo</Text>
                                )}
                            </Pressable>
                        </View>
                        
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
