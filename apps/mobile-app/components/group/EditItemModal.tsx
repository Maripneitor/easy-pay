import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput, 
    ScrollView, 
    ActivityIndicator,
    Alert,
    Dimensions
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { groupRepository } from '../../src/infrastructure/api/repositories/GroupRepository';

const { height } = Dimensions.get('window');

interface EditItemModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: any;
    groupId: string;
    members: any[];
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ 
    visible, 
    onClose, 
    onSuccess, 
    item, 
    groupId,
    members
}) => {
    const { theme, fontScale } = useTheme();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
    const [category, setCategory] = useState('Otros');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const CATEGORIES = [
        { id: 'Comida', icon: 'restaurant', color: '#f59e0b' },
        { id: 'Transporte', icon: 'directions-car', color: '#3b82f6' },
        { id: 'Súper', icon: 'shopping-cart', color: '#10b981' },
        { id: 'Entretenimiento', icon: 'sports-esports', color: '#8b5cf6' },
        { id: 'Hogar', icon: 'home', color: '#ec4899' },
        { id: 'Otros', icon: 'more-horiz', color: '#64748b' }
    ];

    useEffect(() => {
        if (item) {
            setName(item.name || item.nombre || '');
            setAmount(item.amount?.toString() || item.precio?.toString() || '');
            setSelectedParticipants(item.participants_ids || item.participants || item.assignedTo || []);
            setCategory(item.category || 'Otros');
        }
    }, [item]);

    const handleSave = async () => {
        if (!name.trim() || !amount.trim()) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        setIsSaving(true);
        try {
            await groupRepository.editItem(groupId, item.id, {
                nombre: name,
                precio: parseFloat(amount),
                category: category,
                participantes_ids: selectedParticipants
            });
            onSuccess();
            onClose();
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el gasto');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Eliminar Gasto',
            '¿Estás seguro de que quieres eliminar este gasto permanentemente?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: async () => {
                        setIsDeleting(true);
                        try {
                            await groupRepository.removeItem(groupId, item.id);
                            onSuccess();
                            onClose();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el gasto');
                        } finally {
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    const toggleParticipant = (id: string) => {
        setSelectedParticipants(prev => 
            prev.includes(id) 
                ? prev.filter(p => p !== id) 
                : [...prev, id]
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <BlurView intensity={20} tint="dark" className="flex-1 justify-end">
                <TouchableOpacity 
                    activeOpacity={1} 
                    className="flex-1" 
                    onPress={onClose} 
                />
                <View 
                    style={{ backgroundColor: theme.bg, height: height * 0.85 }} 
                    className="rounded-t-[40px] border-t border-white/10 p-8"
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-8">
                        <Text style={{ color: theme.text }} className="text-2xl font-black">Editar Gasto</Text>
                        <TouchableOpacity onPress={handleDelete} className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center">
                            <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                        {/* Name Input */}
                        <View className="mb-6">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-widest mb-3">Descripción</Text>
                            <View style={{ backgroundColor: theme.cardSecondary }} className="rounded-2xl px-5 py-4">
                                <TextInput 
                                    value={name}
                                    onChangeText={setName}
                                    style={{ color: theme.text }}
                                    className="font-bold text-base"
                                    placeholder="Ej: Pizza familiar"
                                    placeholderTextColor={theme.textSecondary + '50'}
                                />
                            </View>
                        </View>

                        {/* Amount Input */}
                        <View className="mb-8">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-widest mb-3">Monto Total</Text>
                            <View style={{ backgroundColor: theme.cardSecondary }} className="flex-row items-center rounded-2xl px-5 py-4">
                                <Text style={{ color: theme.primary }} className="text-xl font-black mr-2">$</Text>
                                <TextInput 
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                    style={{ color: theme.text }}
                                    className="flex-1 font-black text-2xl"
                                    placeholder="0.00"
                                    placeholderTextColor={theme.textSecondary + '50'}
                                />
                            </View>
                        </View>

                        {/* Category Selection */}
                        <View className="mb-8">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-widest mb-4">Categoría</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {CATEGORIES.map(cat => (
                                    <TouchableOpacity 
                                        key={cat.id}
                                        onPress={() => setCategory(cat.id)}
                                        style={{ 
                                            backgroundColor: category === cat.id ? cat.color + '20' : theme.cardSecondary,
                                            borderColor: category === cat.id ? cat.color : 'transparent'
                                        }}
                                        className="mr-3 px-5 py-3 rounded-2xl border items-center gap-2"
                                    >
                                        <MaterialIcons name={cat.icon as any} size={20} color={category === cat.id ? cat.color : theme.textSecondary} />
                                        <Text style={{ color: category === cat.id ? theme.text : theme.textSecondary, fontSize: 10 }} className="font-black uppercase">{cat.id}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Participants Selection */}
                        <View className="mb-10">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-widest">¿Quiénes dividen?</Text>
                                <View className="flex-row gap-2">
                                    <TouchableOpacity 
                                        onPress={() => setSelectedParticipants(members.map(m => m.id))}
                                        className="bg-slate-500/10 px-3 py-1.5 rounded-lg border border-slate-500/20"
                                    >
                                        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase">Todos</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => setSelectedParticipants([members.find(m => m.id === (item.addedBy || item.comprador_id))?.id].filter(Boolean) as string[])}
                                        className="bg-slate-500/10 px-3 py-1.5 rounded-lg border border-slate-500/20"
                                    >
                                        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase">Solo Yo</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="flex-row flex-wrap gap-3">
                                {members.map(member => {
                                    const isSelected = selectedParticipants.includes(member.id);
                                    return (
                                        <TouchableOpacity 
                                            key={member.id}
                                            onPress={() => toggleParticipant(member.id)}
                                            style={{ 
                                                backgroundColor: isSelected ? theme.primary : theme.cardSecondary,
                                                borderColor: isSelected ? theme.primary : theme.border
                                            }}
                                            className="flex-row items-center gap-2 px-4 py-3 rounded-xl border"
                                        >
                                            <Text 
                                                style={{ color: isSelected ? 'black' : theme.text }} 
                                                className="text-xs font-black uppercase"
                                            >
                                                {(member.nombre || member.name || "Miembro").split(' ')[0]}
                                            </Text>
                                            {isSelected && <Ionicons name="checkmark-circle" size={16} color="black" />}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer Actions */}
                    <View className="flex-row gap-4 mt-4">
                        <TouchableOpacity 
                            onPress={onClose}
                            style={{ backgroundColor: theme.cardSecondary }}
                            className="flex-1 h-16 rounded-2xl items-center justify-center"
                        >
                            <Text style={{ color: theme.text }} className="font-black uppercase tracking-widest text-xs">Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={handleSave}
                            disabled={isSaving}
                            style={{ backgroundColor: theme.primary }}
                            className="flex-[2] h-16 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/20"
                        >
                            {isSaving ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <Text className="text-black font-black uppercase tracking-widest text-xs">Guardar Cambios</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};
