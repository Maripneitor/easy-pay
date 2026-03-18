import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function NewMethodScreen() {
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', holder: '' });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate payment provider call
        setTimeout(() => {
            setIsSaving(false);
            Alert.alert("Éxito", "Tarjeta agregada correctamente.", [
                { text: "OK", onPress: () => router.back() }
            ]);
        }, 1500);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10">
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-black">Nuevo Método</Text>
                <View className="w-10" />
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    <View className="mt-10 mb-10 items-center">
                        {/* Fake Card Preview */}
                        <View className="w-full h-52 bg-slate-800 rounded-[32px] p-8 border border-white/5 relative overflow-hidden">
                            <View className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                            <Image 
                                source={{ uri: 'https://img.icons8.com/color/96/chip.png' }}
                                className="w-12 h-10 mb-8 opacity-60"
                            />
                            <Text className="text-white/30 font-mono text-xl tracking-[4px] mb-8">
                                {cardData.number || '**** **** **** ****'}
                            </Text>
                            <View className="flex-row justify-between items-end">
                                <View>
                                    <Text className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">Titular</Text>
                                    <Text className="text-white/40 font-black text-sm uppercase">{cardData.holder || 'Luis Gonzalez'}</Text>
                                </View>
                                <View>
                                    <Text className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">Expira</Text>
                                    <Text className="text-white/40 font-black text-sm">{cardData.expiry || '--/--'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="gap-6 pb-20">
                        <View>
                            <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-1">Titular de la tarjeta</Text>
                            <TextInput 
                                placeholder="Nombre completo"
                                placeholderTextColor="#334155"
                                className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold"
                                onChangeText={(text) => setCardData({...cardData, holder: text})}
                                value={cardData.holder}
                            />
                        </View>

                        <View>
                            <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-1">Número de tarjeta</Text>
                            <TextInput 
                                placeholder="0000 0000 0000 0000"
                                placeholderTextColor="#334155"
                                keyboardType="number-pad"
                                maxLength={19}
                                className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-mono font-bold"
                                onChangeText={(text) => setCardData({...cardData, number: text})}
                                value={cardData.number}
                            />
                        </View>

                        <View className="flex-row gap-4">
                            <View className="flex-1">
                                <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-1">Vencimiento</Text>
                                <TextInput 
                                    placeholder="MM/YY"
                                    placeholderTextColor="#334155"
                                    keyboardType="number-pad"
                                    maxLength={5}
                                    className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold"
                                    onChangeText={(text) => setCardData({...cardData, expiry: text})}
                                    value={cardData.expiry}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-1">CVV</Text>
                                <TextInput 
                                    placeholder="123"
                                    placeholderTextColor="#334155"
                                    keyboardType="number-pad"
                                    secureTextEntry
                                    maxLength={3}
                                    className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold"
                                    onChangeText={(text) => setCardData({...cardData, cvv: text})}
                                    value={cardData.cvv}
                                />
                            </View>
                        </View>

                        <TouchableOpacity 
                            onPress={handleSave}
                            disabled={isSaving}
                            className="bg-blue-600 p-6 rounded-[28px] items-center justify-center shadow-lg shadow-blue-500/20 mt-6"
                        >
                            {isSaving ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-black uppercase tracking-widest text-[11px]">Validar y Guardar Método</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

import { Image } from 'react-native';
