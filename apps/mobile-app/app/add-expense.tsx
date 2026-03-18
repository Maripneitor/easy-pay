import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@easy-pay/ui';
import { StatusBar } from 'expo-status-bar';

export default function AddExpenseScreen() {
    const [splitType, setSplitType] = useState('equally');

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]">
            <StatusBar style="light" />
            <Stack.Screen options={{ 
                headerShown: true,
                headerTitle: 'Nuevo Gasto',
                headerTintColor: 'white',
                headerStyle: { backgroundColor: '#0f172a' },
                headerLeft: () => (
                    <Pressable onPress={() => router.back()} className="ml-2">
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </Pressable>
                )
            }} />
            
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-6 pb-40" showsVerticalScrollIndicator={false}>
                    {/* Page Title */}
                    <View className="flex-row items-center py-8">
                        <View className="bg-blue-500/10 p-3 rounded-2xl mr-4 border border-blue-500/20">
                            <MaterialIcons name="receipt-long" size={28} color={Colors.coolSky} />
                        </View>
                        <Text className="text-white text-3xl font-black tracking-tight">Registrar Gasto</Text>
                    </View>

                    {/* Basic Info Card */}
                    <View className="bg-slate-800/40 border border-white/10 rounded-[40px] p-8 mb-6 shadow-2xl">
                        <Text className="text-slate-300 font-black text-xs uppercase tracking-widest mb-6 border-b border-slate-700/50 pb-3">Datos del gasto</Text>
                        
                        <View className="gap-6">
                            <View>
                                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Descripción</Text>
                                <View className="relative">
                                    <View className="absolute left-4 top-3.5 z-10">
                                        <MaterialIcons name="edit" size={18} color="#64748b" />
                                    </View>
                                    <TextInput 
                                        placeholder="Ej. Cena en taquería"
                                        placeholderTextColor="#475569"
                                        className="bg-slate-900/50 border border-slate-700 text-white pl-12 pr-6 py-4 rounded-2xl font-medium"
                                        defaultValue="Cena en taquería"
                                    />
                                </View>
                            </View>

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Monto Total</Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-3.5 z-10">
                                            <MaterialIcons name="attach-money" size={18} color="#64748b" />
                                        </View>
                                        <TextInput 
                                            placeholder="0.00"
                                            placeholderTextColor="#475569"
                                            keyboardType="numeric"
                                            className="bg-slate-900/50 border border-slate-700 text-white pl-12 pr-6 py-4 rounded-2xl font-black text-lg"
                                            defaultValue="1250.00"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Split Type Card */}
                    <View className="bg-slate-800/40 border border-white/10 rounded-[40px] p-8 mb-6 shadow-2xl">
                        <Text className="text-slate-300 font-black text-xs uppercase tracking-widest mb-6 border-b border-slate-700/50 pb-3">Tipo de división</Text>
                        
                        <View className="flex-row gap-3">
                            {[
                                { id: 'equally', label: 'Equitativa', desc: 'Pares' },
                                { id: 'percentage', label: 'Porcentaje', desc: '%' },
                                { id: 'shares', label: 'Partes', desc: '1/n' }
                            ].map((type) => (
                                <Pressable 
                                    key={type.id}
                                    onPress={() => setSplitType(type.id)}
                                    className={`flex-1 p-4 rounded-2xl border ${splitType === type.id ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-900/50 border-slate-700'}`}
                                >
                                    <View className="flex-row justify-between items-start mb-1">
                                        <Text className={`font-bold text-xs ${splitType === type.id ? 'text-white' : 'text-slate-400'}`}>{type.label}</Text>
                                        {splitType === type.id && <MaterialIcons name="check-circle" size={14} color="#3b82f6" />}
                                    </View>
                                    <Text className="text-[9px] text-slate-500 font-medium">{type.desc}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Participants Card */}
                    <View className="bg-slate-800/40 border border-white/10 rounded-[40px] p-8 mb-32 shadow-2xl">
                        <View className="flex-row justify-between items-center mb-6 border-b border-slate-700/50 pb-3">
                            <Text className="text-slate-300 font-black text-xs uppercase tracking-widest">Participantes</Text>
                            <Pressable><Text className="text-blue-500 text-[10px] font-bold">Seleccionar todos</Text></Pressable>
                        </View>

                        <View className="gap-3">
                            {[
                                { name: 'Ana Pérez', initial: 'AP', color: '#ec4899', active: true },
                                { name: 'Carlos López', initial: 'CL', color: '#10b981', active: true },
                                { name: 'Tú (Juan)', initial: 'TÚ', color: '#3b82f6', active: true },
                                { name: 'Luis Martínez', initial: 'LM', color: '#f59e0b', active: false },
                            ].map((p, i) => (
                                <Pressable key={i} className="flex-row items-center gap-4 py-2">
                                    <View className={`w-5 h-5 rounded-md border-2 items-center justify-center ${p.active ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-slate-700'}`}>
                                        {p.active && <MaterialIcons name="check" size={12} color="white" />}
                                    </View>
                                    <View className="w-8 h-8 rounded-full items-center justify-center border border-white/10" style={{ backgroundColor: `${p.color}20` }}>
                                        <Text style={{ color: p.color }} className="text-[10px] font-black">{p.initial}</Text>
                                    </View>
                                    <Text className="text-white font-medium text-sm flex-1">{p.name}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <View className="bg-slate-900/50 rounded-2xl p-4 mt-8 border border-white/5">
                            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">División preliminar:</Text>
                            <Text className="text-blue-400 font-black text-sm">Con 3 personas: $416.67 c/u</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Floating Action */}
            <View className="absolute bottom-10 left-6 right-6 gap-3">
                <Pressable 
                    onPress={() => router.push('/(tabs)/dashboard')}
                    className="bg-blue-600 py-5 rounded-[22px] items-center shadow-2xl shadow-blue-500/50 active:scale-95 flex-row justify-center gap-3"
                    style={{ backgroundColor: Colors.brilliantAzure }}
                >
                    <MaterialIcons name="save" size={20} color="white" />
                    <Text className="text-white font-black text-lg">GUARDAR GASTO</Text>
                </Pressable>
                <Pressable className="items-center">
                    <Text className="text-slate-500 font-bold text-xs underline">Guardar y agregar otro</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
