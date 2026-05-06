import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { router } from 'expo-router';
import ItemAssignModal from '../ItemAssignModal';

interface Item {
    id: string;
    name: string;
    detail?: string;
    amount: number;
    avatars: string[];
    assignedTo: string[];
    addedBy?: string;
    description?: string;
}

interface Member {
    id: string;
    nombre: string;
    color?: string;
}

interface VirtualTicketCardProps {
    items: Item[];
    serviceFee: number;
    groupId?: string;
    members?: Member[];
    onAssign?: (itemId: string, assignedTo: string[]) => Promise<void>;
}

export const VirtualTicketCard: React.FC<VirtualTicketCardProps> = ({
    items, serviceFee, groupId, members = [], onAssign
}) => {
    const { theme, fontScale } = useTheme();
    const [assignModal, setAssignModal] = useState<{ visible: boolean; item: Item | null }>({
        visible: false, item: null,
    });

    const handleAssign = async (itemId: string, assignedTo: string[]) => {
        if (onAssign) await onAssign(itemId, assignedTo);
        setAssignModal({ visible: false, item: null });
    };

    // Color por miembro para los badges
    const COLORS = ['#2196F3', '#f97316', '#a855f7', '#4ade80', '#f43f5e', '#f59e0b'];
    const getMemberColor = (memberId: string) => {
        const member = members.find(m => m.id === memberId);
        if (member?.color) return member.color;
        const idx = members.findIndex(m => m.id === memberId);
        return COLORS[idx % COLORS.length];
    };

    const getMemberName = (memberId: string) => {
        const member = members.find(m => m.id === memberId);
        return member?.nombre?.substring(0, 2).toUpperCase() ?? '??';
    };

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
            className="px-4 pt-2"
        >
            {/* Header section with Add Button */}
            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-bold tracking-tight">
                        Detalle de la cuenta
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="mt-1 opacity-80">
                        Toca el lápiz para asignar quién consumió qué.
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push({ pathname: '/new-expense', params: { groupId } } as any)}
                    className="flex-row items-center gap-1 px-4 py-2 rounded-full active:opacity-70"
                >
                    <Ionicons name="add" size={16} color={theme.primary} />
                    <Text style={{ color: theme.primary, fontSize: 14 * fontScale }} className="font-bold">Añadir</Text>
                </TouchableOpacity>
            </View>

            <View className="gap-y-4">
                {items.map((item) => {
                    const assigned = item.assignedTo ?? [];
                    const isAssigned = assigned.length > 0;
                    const perPerson = isAssigned ? item.amount / assigned.length : null;

                    return (
                        <MotiView
                            key={item.id}
                            from={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                backgroundColor: theme.card,
                                borderColor: isAssigned
                                    ? getMemberColor(assigned[0]) + '30'
                                    : theme.border + '26',
                            }}
                            className="rounded-xl p-5 border shadow-sm"
                        >
                            {/* Nombre y precio */}
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="flex-1 pr-4">
                                    <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-bold">
                                        {item.name}
                                    </Text>
                                    {item.detail ? (
                                        <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="mt-1 opacity-70">
                                            {item.detail}
                                        </Text>
                                    ) : null}
                                    {perPerson && (
                                        <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="mt-1">
                                            ${perPerson.toFixed(2)} por persona
                                        </Text>
                                    )}
                                </View>
                                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">
                                    ${item.amount.toFixed(2)}
                                </Text>
                            </View>

                            {/* Footer: asignados + botón editar */}
                            <View
                                className="flex-row items-center justify-between mt-2 pt-4 border-t"
                                style={{ borderColor: theme.cardSecondary }}
                            >
                                {/* Badges de personas asignadas */}
                                <View className="flex-row items-center gap-2 flex-1 flex-wrap">
                                    {isAssigned ? (
                                        assigned.map(memberId => {
                                            const color = getMemberColor(memberId);
                                            const initials = getMemberName(memberId);
                                            return (
                                                <View
                                                    key={memberId}
                                                    style={{ backgroundColor: color + '20', borderColor: color + '50' }}
                                                    className="flex-row items-center px-2 py-1 rounded-full border gap-1"
                                                >
                                                    <View
                                                        style={{ backgroundColor: color }}
                                                        className="w-4 h-4 rounded-full items-center justify-center"
                                                    >
                                                        <Text className="text-white text-[8px] font-black">{initials}</Text>
                                                    </View>
                                                    <Text style={{ color, fontSize: 10 * fontScale }} className="font-bold">
                                                        {members.find(m => m.id === memberId)?.nombre ?? memberId}
                                                    </Text>
                                                </View>
                                            );
                                        })
                                    ) : (
                                        <View style={{ backgroundColor: '#f59e0b15', borderColor: '#f59e0b30' }} className="flex-row items-center px-3 py-1.5 rounded-full border gap-1">
                                            <MaterialIcons name="person-add" size={12} color="#f59e0b" />
                                            <Text style={{ color: '#f59e0b', fontSize: 10 * fontScale }} className="font-bold">
                                                Sin asignar
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Botón editar — abre modal */}
                                <TouchableOpacity
                                    onPress={() => setAssignModal({ visible: true, item })}
                                    style={{ backgroundColor: theme.cardSecondary }}
                                    className="w-9 h-9 rounded-full items-center justify-center ml-2"
                                >
                                    <MaterialIcons name="edit" size={18} color={theme.primary} />
                                </TouchableOpacity>
                            </View>
                        </MotiView>
                    );
                })}

                {/* Propina */}
                <View
                    style={{ backgroundColor: theme.cardSecondary }}
                    className="rounded-xl p-4 flex-row justify-between items-center mt-2"
                >
                    <View className="flex-row items-center gap-3">
                        <View style={{ backgroundColor: theme.card }} className="w-8 h-8 rounded-full items-center justify-center">
                            <MaterialIcons name="receipt-long" size={18} color={theme.textSecondary} />
                        </View>
                        <View>
                            <Text style={{ color: theme.text, fontSize: 14 * fontScale }} className="font-bold">Propina y Servicio</Text>
                            <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="mt-0.5 opacity-70">Dividido en partes iguales</Text>
                        </View>
                    </View>
                    <Text style={{ color: theme.text, fontSize: 14 * fontScale }} className="font-bold">${serviceFee.toFixed(2)}</Text>
                </View>

                {/* Ticket Bottom Jagged Edge */}
                <View className="flex-row justify-around -mb-2 mt-4">
                    {[...Array(15)].map((_, i) => (
                        <View key={i} className="w-4 h-4 bg-slate-900 rounded-full" />
                    ))}
                </View>
            </View>

            {/* Hint */}
            <View className="mt-6 flex-row items-center justify-center gap-2 opacity-50">
                <Ionicons name="information-circle" size={14} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold">
                    {canEdit ? 'Puedes editar cualquier item tocándolo en la lista.' : 'Solo el líder del grupo puede gestionar los ítems.'}
                </Text>
            </View>

            {/* Modal de asignación */}
            <ItemAssignModal
                visible={assignModal.visible}
                onClose={() => setAssignModal({ visible: false, item: null })}
                item={assignModal.item}
                members={members}
                theme={theme}
                onConfirm={handleAssign}
            />
        </MotiView>
    );
};
