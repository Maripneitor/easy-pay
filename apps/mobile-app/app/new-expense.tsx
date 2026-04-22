import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    TextInput,
    Image,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { groupRepository } from '../src/infrastructure/api/repositories/GroupRepository';

const { width } = Dimensions.get('window');

export default function NewExpenseScreen() {
    const { theme, fontScale } = useTheme();
    const { user } = useAuth();
    const params = useLocalSearchParams();
    
    const groupId = params.groupId as string;
    const [nombre, setNombre] = useState((params.name as string) || '');
    const [precio, setPrecio] = useState((params.amount as string) || '');
    const [cantidad, setCantidad] = useState(1);
    
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!groupId) {
                setIsLoading(false);
                return;
            }
            try {
                const groupData = await groupRepository.getGroup(groupId);
                const integrantes = groupData.integrantes || [];
                
                // Sort to put current user first
                const sorted = [...integrantes].sort((a, b) => {
                    const idA = a.id || a;
                    const idB = b.id || b;
                    if (idA === user?.id) return -1;
                    if (idB === user?.id) return 1;
                    return 0;
                });
                
                setMembers(sorted);
                // Select current user by default
                if (user?.id) {
                    setSelectedMembers([user.id]);
                }
            } catch (err) {
                console.error('Error fetching members:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMembers();
    }, [groupId, user?.id]);

    const toggleMember = (memberId: string) => {
        setSelectedMembers(prev => 
            prev.includes(memberId) 
                ? prev.filter(id => id !== memberId) 
                : [...prev, memberId]
        );
    };

    const handleSave = async () => {
        if (!nombre || !precio || !groupId) return;
        try {
            await groupRepository.addItem(groupId, {
                id: '',
                description: nombre,
                amount: parseFloat(precio) * cantidad,
                addedBy: user?.id || '',
                assignedTo: selectedMembers,
                date: new Date().toISOString()
            });
            router.back();
        } catch (err) {
            console.error('Error saving expense:', err);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* TopAppBar */}
            <View className="flex-row items-center justify-between px-6 py-4 w-full">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
                    <MaterialIcons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight">Nuevo Gasto</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}>
                {/* Form Area */}
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-[2.5rem] p-8 border mb-8 gap-8">
                    {/* Name */}
                    <View>
                        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-3 ml-1">Descripción del gasto</Text>
                        <TextInput 
                            value={nombre}
                            onChangeText={setNombre}
                            style={{ backgroundColor: theme.bg, color: theme.text }}
                            className="px-5 py-4 rounded-2xl font-bold text-base"
                            placeholder="Ej. Cena, Uber, Super..."
                        />
                    </View>

                    {/* Price & Quantity */}
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-3 ml-1">Precio</Text>
                            <View style={{ backgroundColor: theme.bg }} className="flex-row items-center px-5 py-4 rounded-2xl">
                                <Text style={{ color: theme.textSecondary }} className="mr-1 font-bold">$</Text>
                                <TextInput 
                                    value={precio}
                                    onChangeText={setPrecio}
                                    keyboardType="numeric"
                                    style={{ color: theme.text, flex: 1, fontWeight: 'bold' }}
                                    placeholder="0.00"
                                />
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-3 ml-1">Cantidad</Text>
                            <View style={{ backgroundColor: theme.bg }} className="flex-row items-center justify-between px-2 py-1.5 rounded-2xl h-[58px]">
                                <TouchableOpacity 
                                    onPress={() => setCantidad(Math.max(1, cantidad - 1))}
                                    style={{ backgroundColor: theme.cardSecondary }}
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                >
                                    <MaterialIcons name="remove" size={20} color={theme.primary} />
                                </TouchableOpacity>
                                <Text style={{ color: theme.text }} className="font-black text-lg">{cantidad}</Text>
                                <TouchableOpacity 
                                    onPress={() => setCantidad(cantidad + 1)}
                                    style={{ backgroundColor: theme.cardSecondary }}
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                >
                                    <MaterialIcons name="add" size={20} color={theme.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Assignment Section */}
                <View className="gap-6">
                    <View className="flex-row justify-between items-end px-2">
                        <Text style={{ color: theme.text }} className="text-xl font-black">Compartido por</Text>
                        <TouchableOpacity onPress={() => setSelectedMembers(members.map(m => m.id || m))}>
                            <Text style={{ color: theme.primary }} className="font-bold text-sm">Seleccionar Todos</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size="small" color={theme.primary} />
                    ) : (
                        <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-[2.5rem] p-8 border flex-row flex-wrap gap-6 justify-center">
                            {members.map(member => {
                                const mId = member.id || member;
                                const mNombre = member.nombre || 'Usuario';
                                const isActive = selectedMembers.includes(mId);
                                const isMe = mId === user?.id;

                                return (
                                    <TouchableOpacity 
                                        key={mId}
                                        onPress={() => toggleMember(mId)}
                                        className="items-center gap-2"
                                    >
                                        <View 
                                            style={{ 
                                                borderColor: isActive ? theme.primary : 'transparent',
                                                borderWidth: isActive ? 2 : 0,
                                                opacity: isActive ? 1 : 0.4
                                            }} 
                                            className="p-1 rounded-full relative"
                                        >
                                            {member.avatar ? (
                                                <Image 
                                                    source={{ uri: member.avatar }} 
                                                    className="w-14 h-14 rounded-full"
                                                />
                                            ) : (
                                                <View style={{ backgroundColor: theme.card }} className="w-14 h-14 rounded-full items-center justify-center">
                                                    <Text style={{ color: theme.textSecondary }} className="font-bold text-xl">
                                                        {mNombre.charAt(0).toUpperCase()}
                                                    </Text>
                                                </View>
                                            )}
                                            {isActive && (
                                                <View style={{ backgroundColor: theme.primary }} className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full items-center justify-center border-2 border-slate-900">
                                                    <MaterialIcons name="check" size={12} color="black" />
                                                </View>
                                            )}
                                        </View>
                                        <Text style={{ color: isActive ? theme.text : theme.textSecondary }} className="text-xs font-bold text-center w-16" numberOfLines={1}>
                                            {isMe ? 'Tú' : mNombre}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Contextual Footer Actions */}
            <View 
                style={{ backgroundColor: theme.bg, borderColor: theme.border }} 
                className="absolute bottom-0 w-full px-6 py-8 border-t flex-row gap-4"
            >
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ backgroundColor: '#f43f5e20' }}
                    className="w-[30%] h-16 rounded-2xl items-center justify-center"
                >
                    <MaterialIcons name="delete-outline" size={28} color="#f43f5e" />
                </TouchableOpacity>
                <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={handleSave}
                    className="flex-1 h-16 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/20"
                >
                    <LinearGradient
                        colors={[theme.primary, theme.primary + 'CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-full h-full items-center justify-center"
                    >
                        <Text className="text-black font-black text-base uppercase tracking-widest">Agregar Gasto</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
