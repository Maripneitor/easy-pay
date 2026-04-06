import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useMesa } from '../context/MesaContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function ItemDetailScreen() {
    const { theme, fontScale } = useTheme();
    const { activeMesa, updateItem, deleteItem } = useMesa();
    const { user } = useAuth();
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const itemId = String(params.id);
    const item = activeMesa?.items.find(i => i.id === itemId);

    const [nombre, setNombre] = useState(item?.nombre || '');
    const [precio, setPrecio] = useState(String(item?.precio || '0'));
    const [cantidad, setCantidad] = useState(String(item?.cantidad || '1'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!item && !loading) {
            router.back();
        }
    }, [item]);

    const isLeader = activeMesa?.liderId === user?.id;
    const isOwner = item?.autorId === user?.id;
    const canEdit = isLeader || isOwner;

    const handleDelete = () => {
        if (!canEdit) return;
        Alert.alert(
            "Eliminar platillo",
            "¿Estás seguro de que deseas eliminar este ítem de la mesa?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: async () => {
                    setLoading(true);
                    await deleteItem(itemId);
                    setLoading(false);
                    router.back();
                }}
            ]
        );
    };

    const handleSave = async () => {
        if (!canEdit) return;
        setLoading(true);
        try {
            await updateItem(itemId, {
                nombre,
                precio: parseFloat(precio),
                cantidad: parseInt(cantidad) || 1
            });
            router.back();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!item) return null;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text }} className="text-xl font-black">Detalle del Platillo</Text>
                {canEdit ? (
                    <TouchableOpacity onPress={handleDelete} className="p-2 -mr-2">
                        <MaterialIcons name="delete-outline" size={24} color="#f43f5e" />
                    </TouchableOpacity>
                ) : <View className="w-10" />}
            </View>

            <ScrollView className="flex-1 px-8 pt-8">
                <MotiView 
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="gap-8"
                >
                    <View style={{ backgroundColor: theme.primary + '10' }} className="w-24 h-24 rounded-[40px] items-center justify-center self-center mb-4">
                        <MaterialIcons name="restaurant" size={40} color={theme.primary} />
                    </View>

                    <View className="gap-6">
                        <View>
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-2 ml-1">Nombre</Text>
                            <TextInput 
                                value={nombre}
                                onChangeText={setNombre}
                                editable={canEdit}
                                style={{ backgroundColor: theme.cardSecondary, color: theme.text }}
                                className="px-5 py-4 rounded-2xl font-bold text-lg border border-white/5"
                                placeholder="Nombre del platillo..."
                                placeholderTextColor="#475569"
                            />
                        </View>

                        <View className="flex-row gap-4">
                            <View className="flex-1">
                                <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-2 ml-1">Precio Unitario</Text>
                                <View className="relative">
                                    <Text className="absolute left-5 top-4 font-bold text-slate-500">$</Text>
                                    <TextInput 
                                        value={precio}
                                        onChangeText={setPrecio}
                                        editable={canEdit}
                                        keyboardType="numeric"
                                        style={{ backgroundColor: theme.cardSecondary, color: theme.text }}
                                        className="pl-8 pr-5 py-4 rounded-2xl font-black text-lg border border-white/5"
                                    />
                                </View>
                            </View>
                            <View className="w-24">
                                <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-2 ml-1">Cant.</Text>
                                <TextInput 
                                    value={cantidad}
                                    onChangeText={setCantidad}
                                    editable={canEdit}
                                    keyboardType="numeric"
                                    style={{ backgroundColor: theme.cardSecondary, color: theme.text }}
                                    className="px-5 py-4 rounded-2xl font-black text-lg text-center border border-white/5"
                                />
                            </View>
                        </View>
                        
                        <View>
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-2 ml-1">Consumido por</Text>
                            <View style={{ backgroundColor: theme.cardSecondary }} className="p-5 rounded-2xl border border-white/5">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-full bg-slate-700 items-center justify-center">
                                        <Text className="text-white text-[10px] font-bold">
                                            {isOwner ? 'TÚ' : item.autorId.substring(0,2).toUpperCase()}
                                        </Text>
                                    </View>
                                    <Text style={{ color: theme.text }} className="font-bold flex-1">
                                        {isOwner ? `Tú (${isLeader ? 'Líder' : 'Miembro'})` : 'Otro Participante'}
                                    </Text>
                                    {isLeader && <MaterialIcons name="verified-user" size={16} color={theme.primary} />}
                                </View>
                            </View>
                        </View>

                        {!canEdit && (
                            <View className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 mt-4">
                                <Text className="text-blue-400 text-xs font-bold text-center">
                                    Solo el autor o el líder pueden editar este platillo.
                                </Text>
                            </View>
                        )}
                    </View>
                </MotiView>
            </ScrollView>

            {canEdit && (
                <View className="px-8 pb-10">
                    <TouchableOpacity 
                        onPress={handleSave}
                        disabled={loading}
                        style={{ backgroundColor: theme.primary }}
                        className="w-full py-5 rounded-2xl items-center shadow-xl shadow-blue-500/20"
                    >
                        {loading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text className="text-black font-black uppercase tracking-widest">Guardar Cambios</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
