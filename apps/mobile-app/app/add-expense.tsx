import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@easy-pay/ui';
import { StatusBar } from 'expo-status-bar';
import { useMesa } from '../context/MesaContext';
import { useAuth } from '../context/AuthContext';

export default function AddExpenseScreen() {
    const { activeMesa, addItem, assignItem } = useMesa();
    const { user } = useAuth();
    
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([user?.id || '1']);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!nombre || !precio) return;
        setIsLoading(true);
        try {
            await addItem({
                nombre,
                precio: parseFloat(precio),
                cantidad: 1,
                autorId: user?.id || '1',
                asignadoA: selectedParticipants
            });
            router.back();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleParticipant = (id: string) => {
        setSelectedParticipants(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    if (!activeMesa) return null;

    const shareAmount = selectedParticipants.length > 0 
        ? (parseFloat(precio || '0') / selectedParticipants.length).toFixed(2)
        : '0.00';

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
                                        placeholder="Ej. Hamburguesa"
                                        placeholderTextColor="#475569"
                                        value={nombre}
                                        onChangeText={setNombre}
                                        className="bg-slate-900/50 border border-slate-700 text-white pl-12 pr-6 py-4 rounded-2xl font-medium"
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
                                            value={precio}
                                            onChangeText={setPrecio}
                                            className="bg-slate-900/50 border border-slate-700 text-white pl-12 pr-6 py-4 rounded-2xl font-black text-lg"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Participants Card */}
                    <View className="bg-slate-800/40 border border-white/10 rounded-[40px] p-8 mb-32 shadow-2xl">
                        <View className="flex-row justify-between items-center mb-6 border-b border-slate-700/50 pb-3">
                            <Text className="text-slate-300 font-black text-xs uppercase tracking-widest">Participantes</Text>
                            <Pressable onPress={() => setSelectedParticipants(activeMesa.participantes.map(p => p.id).concat(user?.id || '1'))}>
                                <Text className="text-blue-500 text-[10px] font-bold">Seleccionar todos</Text>
                            </Pressable>
                        </View>

                        <View className="gap-3">
                            {/* Current User */}
                            <Pressable onPress={() => toggleParticipant(user?.id || '1')} className="flex-row items-center gap-4 py-2">
                                <View className={`w-5 h-5 rounded-md border-2 items-center justify-center ${selectedParticipants.includes(user?.id || '1') ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-slate-700'}`}>
                                    {selectedParticipants.includes(user?.id || '1') && <MaterialIcons name="check" size={12} color="white" />}
                                </View>
                                <Text className="text-white font-medium text-sm flex-1">Tú ({user?.nombre || 'Mi Usuario'})</Text>
                            </Pressable>

                            {activeMesa.participantes.map((p) => (
                                <Pressable key={p.id} onPress={() => toggleParticipant(p.id)} className="flex-row items-center gap-4 py-2">
                                    <View className={`w-5 h-5 rounded-md border-2 items-center justify-center ${selectedParticipants.includes(p.id) ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-slate-700'}`}>
                                        {selectedParticipants.includes(p.id) && <MaterialIcons name="check" size={12} color="white" />}
                                    </View>
                                    <View className="w-8 h-8 rounded-full items-center justify-center border border-white/10" style={{ backgroundColor: `${p.color}20` }}>
                                        <Text style={{ color: p.color }} className="text-[10px] font-black">{p.nombre.substring(0,2).toUpperCase()}</Text>
                                    </View>
                                    <Text className="text-white font-medium text-sm flex-1">{p.nombre}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <View className="bg-slate-900/50 rounded-2xl p-4 mt-8 border border-white/5">
                            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">División:</Text>
                            <Text className="text-blue-400 font-black text-sm">Con {selectedParticipants.length} personas: ${shareAmount} c/u</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Floating Action */}
            <View className="absolute bottom-10 left-6 right-6 gap-3">
                <Pressable 
                    onPress={handleSave}
                    disabled={isLoading || !nombre || !precio}
                    className="bg-blue-600 py-5 rounded-[22px] items-center shadow-2xl shadow-blue-500/50 active:scale-95 flex-row justify-center gap-3"
                    style={{ backgroundColor: (nombre && precio) ? Colors.brilliantAzure : '#1e293b' }}
                >
                    {isLoading ? <ActivityIndicator color="white" /> : (
                        <>
                            <MaterialIcons name="save" size={20} color="white" />
                            <Text className="text-white font-black text-lg">GUARDAR GASTO</Text>
                        </>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
