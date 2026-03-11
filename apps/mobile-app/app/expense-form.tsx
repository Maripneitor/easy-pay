import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/StitchTheme';
import { StatusBar } from 'expo-status-bar';

const CATEGORIES = [
  { id: '1', name: 'Comida', icon: 'flatware', color: '#f97316' },
  { id: '2', name: 'Bebidas', icon: 'local-bar', color: '#3b82f6' },
  { id: '3', name: 'Transporte', icon: 'directions-car', color: '#a855f7' },
  { id: '4', name: 'Ocio', icon: 'movie', color: '#ec4899' },
  { id: '5', name: 'Propinas', icon: 'volunteer-activism', color: '#10b981' },
  { id: '6', name: 'Otros', icon: 'more-horiz', color: '#64748b' },
];

export default function RegisterExpenseScreen() {
    const [amount, setAmount] = useState('1,250.00'); // Monto de ejemplo claro
    const [selectedCategory, setSelectedCategory] = useState('1');

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]">
            <StatusBar style="light" />
            <Stack.Screen options={{ 
                headerShown: true,
                headerTitle: '',
                headerTintColor: 'white',
                headerTransparent: true,
                headerLeft: () => (
                    <Pressable onPress={() => router.back()} className="ml-4 bg-white/10 w-10 h-10 rounded-full items-center justify-center">
                        <MaterialIcons name="close" size={20} color="white" />
                    </Pressable>
                )
            }} />
            
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView 
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 160 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Amount Hero Section - EL OBJETIVO */}
                    <View className="pt-24 pb-12 items-center">
                        <Text className="text-blue-400 text-[10px] font-black uppercase tracking-[5px] mb-4">Monto el Gasto</Text>
                        <View className="flex-row items-center">
                            <Text className="text-white text-7xl font-black tracking-tighter">${amount}</Text>
                        </View>
                    </View>

                    {/* Details Card - CURADURÍA */}
                    <View className="px-6 mb-12">
                        <View className="bg-slate-800/40 rounded-[45px] p-8 border border-white/10 shadow-3xl">
                            <TextInput 
                                placeholder="¿En qué gastaste?"
                                placeholderTextColor="#475569"
                                className="text-white text-2xl font-bold p-0 text-center mb-6"
                            />
                            <View className="h-[1px] bg-slate-700/50 w-full mb-8" />
                            
                            <Text className="text-slate-500 text-center text-[10px] font-black uppercase tracking-[3px] mb-6">Categoría</Text>
                            <View className="flex-row flex-wrap justify-center gap-6">
                                {CATEGORIES.map((cat) => (
                                    <Pressable 
                                        key={cat.id} 
                                        onPress={() => setSelectedCategory(cat.id)}
                                        className="items-center w-[25%]"
                                    >
                                        <View 
                                            className={`w-14 h-14 rounded-full items-center justify-center border-2 ${selectedCategory === cat.id ? 'bg-blue-600 shadow-xl shadow-blue-500/50' : 'bg-slate-900/40 border-transparent'}`}
                                            style={selectedCategory === cat.id ? { borderColor: 'white' } : {}}
                                        >
                                            <MaterialIcons name={cat.icon as any} size={24} color={selectedCategory === cat.id ? 'white' : '#64748b'} />
                                        </View>
                                        <Text className={`text-[9px] font-bold mt-2 uppercase tracking-tighter ${selectedCategory === cat.id ? 'text-white' : 'text-slate-500'}`}>{cat.name}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Quick Summary - PREVENIR AMBIGÜEDADES */}
                    <View className="px-10 items-center">
                        <View className="flex-row items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                            <MaterialIcons name="bolt" size={14} color="#10b981" />
                            <Text className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Dividir entre 4 personas</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Sticky Action Button - LA ACCIÓN */}
            <View className="absolute bottom-0 left-0 right-0 p-10 bg-[#0f172a]">
                <Pressable 
                    onPress={() => router.push('/(tabs)/dashboard')}
                    className="bg-blue-600 w-full py-6 rounded-[35px] flex-row items-center justify-center gap-3 shadow-3xl shadow-blue-600/50 active:scale-[0.97]"
                >
                    <Text className="text-white font-black text-xl tracking-widest uppercase">Confirmar Gasto</Text>
                </Pressable>
            </View>

            {/* Bottom Sticky Action Button */}
            <View className="absolute bottom-0 left-0 right-0 p-8 bg-slate-900/80 backdrop-blur-xl border-t border-white/5">
                <Pressable 
                    onPress={() => router.push('/(tabs)/dashboard')}
                    className="bg-blue-600 w-full py-5 rounded-full flex-row items-center justify-center gap-3 shadow-2xl shadow-blue-600/50 active:scale-95"
                    style={{ backgroundColor: Colors.brilliantAzure }}
                >
                    <MaterialIcons name="check-circle" size={24} color="white" />
                    <Text className="text-white font-black text-xl">Confirmar Gasto</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
