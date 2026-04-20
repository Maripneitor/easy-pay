import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';

interface Item {
    id: string;
    name: string;
    detail: string;
    amount: number;
    avatars: string[];
}

interface VirtualTicketCardProps {
    items: Item[];
    serviceFee: number;
}

export const VirtualTicketCard: React.FC<VirtualTicketCardProps> = ({ items, serviceFee }) => {
    const { theme, fontScale } = useTheme();

    return (
        <MotiView 
            from={{ opacity: 0, translateY: 10 }} 
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
            className="px-5 pt-2"
        >
            <View className="flex-row justify-between items-end mb-6 mt-2">
                <View>
                    <Text style={{ color: theme.text, fontSize: 20 * fontScale }} className="font-bold tracking-tight">Detalle de la cuenta</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="mt-1 opacity-80">Asigna quién consumió qué.</Text>
                </View>
                <TouchableOpacity 
                    className="flex-row items-center gap-1.5 px-4 py-2 rounded-full active:opacity-70"
                    style={{ backgroundColor: theme.primary + '15' }}
                >
                    <Ionicons name="add-circle" size={18} color={theme.primary} />
                    <Text style={{ color: theme.primary, fontSize: 14 * fontScale }} className="font-bold">Añadir</Text>
                </TouchableOpacity>
            </View>

            <View className="gap-y-4">
                {items.map((item) => (
                    <View 
                        key={item.id} 
                        style={{ backgroundColor: theme.card, borderColor: theme.border }} 
                        className="rounded-3xl p-5 border shadow-sm"
                    >
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1 pr-4">
                                <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-bold mb-1">{item.name}</Text>
                                <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="font-medium">{item.detail}</Text>
                            </View>
                            <View className="items-end">
                                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">${item.amount.toFixed(2)}</Text>
                            </View>
                        </View>
                        
                        <View className="flex-row items-center justify-between mt-2 pt-4 border-t" style={{ borderColor: theme.border + '30' }}>
                            <View className="flex-row items-center">
                                <View className="flex-row -space-x-3 mr-3">
                                    {item.avatars.map((av, idx) => (
                                        <Image 
                                            key={idx} 
                                            source={{ uri: av }} 
                                            className="w-8 h-8 rounded-full border-2" 
                                            style={{ borderColor: theme.card }} 
                                        />
                                    ))}
                                </View>
                                <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="font-bold uppercase tracking-wider">
                                    {item.avatars.length} {item.avatars.length === 1 ? 'Persona' : 'Personas'}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={{ backgroundColor: theme.cardSecondary }} 
                                className="w-9 h-9 rounded-full items-center justify-center active:opacity-60 shadow-sm"
                            >
                                <MaterialIcons name="edit" size={18} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* Service & Tip Section */}
                <View 
                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} 
                    className="rounded-3xl p-5 flex-row justify-between items-center mt-2 border border-dashed"
                >
                    <View className="flex-row items-center gap-4">
                        <View style={{ backgroundColor: theme.card }} className="w-11 h-11 rounded-2xl items-center justify-center shadow-sm">
                            <MaterialIcons name="receipt-long" size={22} color={theme.primary} />
                        </View>
                        <View>
                            <Text style={{ color: theme.text, fontSize: 15 * fontScale }} className="font-bold">Propina y Servicio</Text>
                            <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="mt-0.5 font-medium">Dividido en partes iguales</Text>
                        </View>
                    </View>
                    <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">${serviceFee.toFixed(2)}</Text>
                </View>
            </View>
        </MotiView>
    );
};
