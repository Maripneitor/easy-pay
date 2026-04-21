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
            className="px-4 pt-2"
        >
            <View className="flex-row justify-between items-end mb-6 mt-2 px-2">
                <View>
                    <Text style={{ color: theme.text, fontSize: 18 * fontScale, fontFamily: 'Manrope' }} className="font-bold tracking-tight">Detalle de la cuenta</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale, fontFamily: 'Inter' }} className="mt-1 opacity-80">Asigna quién consumió qué.</Text>
                </View>
                <TouchableOpacity 
                    className="flex-row items-center gap-1 px-4 py-2 rounded-full active:opacity-70"
                >
                    <Ionicons name="add" size={16} color={theme.primary} />
                    <Text style={{ color: theme.primary, fontSize: 14 * fontScale, fontFamily: 'Inter' }} className="font-bold">Añadir</Text>
                </TouchableOpacity>
            </View>

            <View className="gap-y-4">
                {items.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        activeOpacity={0.7}
                        style={{ 
                            backgroundColor: theme.card, 
                            borderColor: theme.border + '26', // 15% opacity ghost border
                        }} 
                        className="rounded-xl p-5 border shadow-sm"
                    >
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1 pr-4">
                                <Text style={{ color: theme.text, fontSize: 16 * fontScale, fontFamily: 'Manrope' }} className="font-bold">{item.name}</Text>
                                <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale, fontFamily: 'Inter' }} className="mt-1 opacity-70">{item.detail}</Text>
                            </View>
                            <Text style={{ color: theme.text, fontSize: 18 * fontScale, fontFamily: 'Manrope' }} className="font-black">${item.amount.toFixed(2)}</Text>
                        </View>
                        
                        <View className="flex-row items-center justify-between mt-2 pt-4 border-t" style={{ borderColor: theme.cardSecondary }}>
                            <View className="flex-row -space-x-2">
                                {item.avatars.map((av, idx) => (
                                    <Image 
                                        key={idx} 
                                        source={{ uri: av }} 
                                        className="w-8 h-8 rounded-full border-2" 
                                        style={{ borderColor: theme.card }} 
                                    />
                                ))}
                            </View>
                            <TouchableOpacity 
                                style={{ backgroundColor: theme.cardSecondary }} 
                                className="w-8 h-8 rounded-full items-center justify-center active:opacity-60"
                            >
                                <MaterialIcons name="edit" size={18} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Tax/Tip Row (Non-interactive style from Stitch) */}
                <View 
                    style={{ backgroundColor: theme.cardSecondary }} 
                    className="rounded-xl p-4 flex-row justify-between items-center mt-2"
                >
                    <View className="flex-row items-center gap-3">
                        <View style={{ backgroundColor: theme.card }} className="w-8 h-8 rounded-full items-center justify-center shadow-xs">
                            <MaterialIcons name="receipt-long" size={18} color={theme.textSecondary} />
                        </View>
                        <View>
                            <Text style={{ color: theme.text, fontSize: 14 * fontScale, fontFamily: 'Manrope' }} className="font-bold">Propina y Servicio</Text>
                            <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale, fontFamily: 'Inter' }} className="mt-0.5 opacity-70">Dividido en partes iguales</Text>
                        </View>
                    </View>
                    <Text style={{ color: theme.text, fontSize: 14 * fontScale, fontFamily: 'Manrope' }} className="font-bold">${serviceFee.toFixed(2)}</Text>
                </View>
            </View>
        </MotiView>
    );
};
