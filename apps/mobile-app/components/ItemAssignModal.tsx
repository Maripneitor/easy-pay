import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, Modal, ScrollView, Alert
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';

interface Member {
    id: string;
    nombre: string;
    color?: string;
}

interface Item {
    id: string;
    name: string;
    amount: number;
    assignedTo: string[];
}

interface Props {
    visible: boolean;
    onClose: () => void;
    item: Item | null;
    members: Member[];
    theme: any;
    onConfirm: (itemId: string, assignedTo: string[]) => Promise<void>;
}

export default function ItemAssignModal({ visible, onClose, item, members, theme, onConfirm }: Props) {
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (item) setSelected(item.assignedTo ?? []);
    }, [item]);

    if (!item) return null;

    const toggle = (memberId: string) => {
        setSelected(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const selectAll = () => setSelected(members.map(m => m.id));
    const clearAll = () => setSelected([]);

    const perPersonAmount = selected.length > 0
        ? item.amount / selected.length
        : item.amount;

    const handleConfirm = async () => {
        if (selected.length === 0) {
            Alert.alert('Sin asignar', 'Selecciona al menos una persona.');
            return;
        }
        setLoading(true);
        try {
            await onConfirm(item.id, selected);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1200);
        } catch {
            Alert.alert('Error', 'No se pudo asignar el item.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: theme.bg }}>
                {/* Header */}
                <View style={{ borderBottomColor: theme.border }} className="flex-row items-center justify-between px-6 py-5 border-b">
                    <TouchableOpacity onPress={onClose} className="w-10 h-10 rounded-full bg-white/5 items-center justify-center">
                        <Ionicons name="close" size={22} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={{ color: theme.text }} className="font-black text-lg">Asignar Item</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
                    {success ? (
                        <MotiView
                            from={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="items-center py-20"
                        >
                            <View className="w-24 h-24 bg-green-500/20 rounded-full items-center justify-center mb-4">
                                <MaterialIcons name="check-circle" size={56} color="#4ade80" />
                            </View>
                            <Text style={{ color: theme.text }} className="text-2xl font-black text-center">¡Asignado!</Text>
                        </MotiView>
                    ) : (
                        <>
                            {/* Info del item */}
                            <View style={{ backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }} className="p-5 rounded-[24px] border mb-6">
                                <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-widest mb-1">Producto</Text>
                                <Text style={{ color: theme.text }} className="text-xl font-black">{item.name}</Text>
                                <View className="flex-row justify-between items-center mt-3">
                                    <Text style={{ color: theme.textSecondary }} className="text-sm">Total</Text>
                                    <Text style={{ color: theme.primary }} className="font-black text-2xl">${item.amount.toFixed(2)}</Text>
                                </View>
                                {selected.length > 0 && (
                                    <View style={{ backgroundColor: theme.primary + '10' }} className="mt-3 p-3 rounded-xl flex-row justify-between">
                                        <Text style={{ color: theme.textSecondary }} className="text-xs">Por persona ({selected.length})</Text>
                                        <Text style={{ color: theme.primary }} className="font-black text-sm">${perPersonAmount.toFixed(2)}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Acciones rápidas */}
                            <View className="flex-row gap-3 mb-5">
                                <TouchableOpacity
                                    onPress={selectAll}
                                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                    className="flex-1 py-3 rounded-2xl border items-center"
                                >
                                    <Text style={{ color: theme.text }} className="font-bold text-xs">Todos</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={clearAll}
                                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                    className="flex-1 py-3 rounded-2xl border items-center"
                                >
                                    <Text style={{ color: theme.textSecondary }} className="font-bold text-xs">Ninguno</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Lista de miembros */}
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-widest mb-3">
                                ¿Quién consumió este item?
                            </Text>

                            {members.length === 0 ? (
                                <View style={{ backgroundColor: theme.cardSecondary }} className="p-6 rounded-[24px] items-center">
                                    <MaterialIcons name="group-add" size={32} color={theme.textSecondary} />
                                    <Text style={{ color: theme.textSecondary }} className="text-sm font-bold mt-3 text-center">
                                        No hay miembros en el grupo aún
                                    </Text>
                                </View>
                            ) : (
                                <View className="gap-3">
                                    {members.map(member => {
                                        const isSelected = selected.includes(member.id);
                                        const color = member.color ?? '#2196F3';
                                        return (
                                            <TouchableOpacity
                                                key={member.id}
                                                onPress={() => toggle(member.id)}
                                                style={{
                                                    backgroundColor: isSelected ? color + '15' : theme.cardSecondary,
                                                    borderColor: isSelected ? color : theme.border,
                                                }}
                                                className="flex-row items-center p-4 rounded-[20px] border"
                                            >
                                                {/* Avatar */}
                                                <View
                                                    style={{ backgroundColor: color + '25' }}
                                                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                                                >
                                                    <Text style={{ color }} className="font-black text-base">
                                                        {member.nombre.substring(0, 2).toUpperCase()}
                                                    </Text>
                                                </View>

                                                {/* Nombre */}
                                                <View className="flex-1">
                                                    <Text style={{ color: theme.text }} className="font-black text-base">
                                                        {member.nombre}
                                                    </Text>
                                                    {isSelected && (
                                                        <Text style={{ color }} className="text-xs font-bold mt-0.5">
                                                            Paga ${perPersonAmount.toFixed(2)}
                                                        </Text>
                                                    )}
                                                </View>

                                                {/* Checkbox */}
                                                <View
                                                    style={{
                                                        backgroundColor: isSelected ? color : 'transparent',
                                                        borderColor: isSelected ? color : theme.border,
                                                    }}
                                                    className="w-7 h-7 rounded-full border-2 items-center justify-center"
                                                >
                                                    {isSelected && (
                                                        <MaterialIcons name="check" size={16} color="white" />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>

                {/* Botón confirmar */}
                {!success && (
                    <View style={{ backgroundColor: theme.bg, borderTopColor: theme.border }} className="px-6 pb-10 pt-4 border-t">
                        <TouchableOpacity
                            onPress={handleConfirm}
                            disabled={loading || selected.length === 0}
                            style={{
                                backgroundColor: selected.length > 0 ? theme.primary : theme.cardSecondary,
                                opacity: loading ? 0.7 : 1,
                            }}
                            className="py-5 rounded-2xl items-center"
                        >
                            {loading ? (
                                <Text style={{ color: 'white' }} className="font-black text-base">Guardando...</Text>
                            ) : (
                                <Text style={{ color: selected.length > 0 ? 'white' : theme.textSecondary }} className="font-black text-base">
                                    {selected.length > 0
                                        ? `Asignar a ${selected.length} persona${selected.length > 1 ? 's' : ''}`
                                        : 'Selecciona personas'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
}
