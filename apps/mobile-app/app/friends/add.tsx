import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AddFriendScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.length > 2) {
            setSearching(true);
            // Simulate API search
            setTimeout(() => setSearching(false), 800);
        } else {
            setSearching(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />

            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center bg-[#0d1425]">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10">
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-black">Agregar Amigo</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View className="mt-8">
                    <View className="flex-row items-center bg-white/5 border border-white/10 rounded-3xl px-6 py-4.5 mb-2 focus:border-blue-500/50">
                        <Feather name="search" size={20} color="#64748b" />
                        <TextInput 
                            placeholder="Nombre, usuario o correo..."
                            placeholderTextColor="#475569"
                            className="flex-1 ml-4 text-white font-medium text-lg"
                            value={searchQuery}
                            onChangeText={handleSearch}
                            autoFocus
                        />
                        {searching && <ActivityIndicator color="#3b82f6" />}
                    </View>
                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-4 mt-2 mb-10">Busca a otros usuarios de EasyPay</Text>
                </View>

                {/* Main Options */}
                <View className="gap-4">
                    <TouchableOpacity 
                        onPress={() => router.push('/ocr-scanner')}
                        className="bg-blue-600/10 border border-blue-500/20 rounded-[32px] p-6 flex-row items-center gap-6"
                    >
                        <View className="w-14 h-14 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/20">
                            <MaterialIcons name="qr-code-scanner" size={30} color="white" />
                        </View>
                        <View>
                            <Text className="text-white font-black text-xl">Escanear QR</Text>
                            <Text className="text-blue-200/50 text-[11px] font-bold uppercase tracking-wider">Agrega al instante</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex-row items-center gap-6"
                    >
                        <View className="w-14 h-14 bg-white/10 rounded-2xl items-center justify-center border border-white/10">
                            <MaterialIcons name="share" size={28} color="white" />
                        </View>
                        <View>
                            <Text className="text-white font-black text-xl">Invitar por enlace</Text>
                            <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Envía un código de acceso</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex-row items-center gap-6"
                    >
                        <View className="w-14 h-14 bg-white/10 rounded-2xl items-center justify-center border border-white/10">
                            <MaterialIcons name="contacts" size={28} color="white" />
                        </View>
                        <View>
                            <Text className="text-white font-black text-xl">Buscar en contactos</Text>
                            <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Ver quién ya usa la app</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Invite Friend placeholder */}
                <View className="mt-16 items-center p-8 bg-blue-600/5 rounded-[40px] border border-blue-500/10">
                    <Text className="text-white text-lg font-black text-center mb-2">¿Tu amigo no está en EasyPay?</Text>
                    <Text className="text-slate-500 text-[12px] text-center mb-6 px-4">Recibirán un enlace para unirse y ver el gasto que compartiste con ellos.</Text>
                    <TouchableOpacity className="bg-blue-600 px-8 py-4 rounded-full shadow-lg shadow-blue-500/20">
                        <Text className="text-white font-black uppercase text-[11px] tracking-widest">Enviar Invitación</Text>
                    </TouchableOpacity>
                </View>
                
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
