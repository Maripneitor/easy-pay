import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Item {
    id: string;
    name: string;
    detail: string;
    amount: number;
    participants: string[];
}

interface VirtualTicketCardProps {
    items: Item[];
    serviceFee: number;
    groupId?: string;
}

export const VirtualTicketCard: React.FC<VirtualTicketCardProps> = ({ items, serviceFee, groupId }) => {
    const { theme, fontScale } = useTheme();

    return (
        <MotiView 
            from={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="px-6"
        >
            {/* Header section with Add Button */}
            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <Text style={{ color: theme.text }} className="text-xl font-black">Detalle del Ticket</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-xs font-medium">Asigna y divide consumos</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => router.push({ pathname: '/new-expense', params: { groupId } } as any)}
                    style={{ backgroundColor: theme.primary }}
                    className="flex-row items-center gap-2 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20"
                >
                    <Ionicons name="add-circle" size={18} color="black" />
                    <Text className="text-black font-black text-xs uppercase">Añadir</Text>
                </TouchableOpacity>
            </View>

            {/* Virtual Ticket Container */}
            <View 
                style={{ 
                    backgroundColor: 'white', 
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 20 },
                    shadowOpacity: 0.15,
                    shadowRadius: 30,
                    elevation: 10
                }} 
                className="rounded-[30px] overflow-hidden"
            >
                {/* Ticket Top Jagged Edge */}
                <View className="flex-row justify-around -mt-2">
                    {[...Array(15)].map((_, i) => (
                        <View key={i} className="w-4 h-4 bg-slate-900 rounded-full" />
                    ))}
                </View>

                <View className="p-8">
                    {/* Items List */}
                    {items.length === 0 ? (
                        <View className="py-10 items-center opacity-30">
                            <FontAwesome5 name="receipt" size={40} color="black" />
                            <Text className="text-slate-900 font-bold mt-4">Sin consumos registrados</Text>
                        </View>
                    ) : (
                        <View className="gap-y-6">
                            {items.map((item) => (
                                <View key={item.id}>
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View className="flex-1 pr-4">
                                            <Text className="text-slate-900 font-black text-base uppercase leading-tight">{item.name}</Text>
                                            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">{item.detail}</Text>
                                        </View>
                                        <Text className="text-slate-900 font-black text-lg">${item.amount.toFixed(2)}</Text>
                                    </View>
                                    
                                    {/* Participants badges */}
                                    <View className="flex-row flex-wrap gap-1.5 mt-2">
                                        {item.participants.map((p, idx) => (
                                            <View key={idx} className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                                <Text className="text-slate-600 text-[8px] font-black uppercase">{p.split(' ')[0]}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Divider Line */}
                    <View className="my-8 border-t border-dashed border-slate-300" />

                    {/* Subtotal / Fees */}
                    <View className="gap-y-3">
                        <View className="flex-row justify-between">
                            <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest">Subtotal</Text>
                            <Text className="text-slate-600 font-black text-xs">${items.reduce((acc, i) => acc + i.amount, 0).toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest">Servicio / Propina</Text>
                            <Text className="text-slate-600 font-black text-xs">${serviceFee.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Total Section */}
                    <View className="mt-8 bg-slate-900 rounded-2xl p-5 flex-row justify-between items-center shadow-lg">
                        <View>
                            <Text className="text-white/50 text-[10px] font-black uppercase tracking-widest">Total a Pagar</Text>
                            <Text className="text-white text-2xl font-black">${(items.reduce((acc, i) => acc + i.amount, 0) + serviceFee).toFixed(2)}</Text>
                        </View>
                        <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center">
                            <MaterialIcons name="qr-code" size={20} color="white" />
                        </View>
                    </View>
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
                <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold">Puedes editar cualquier item tocándolo en la lista.</Text>
            </View>
        </MotiView>
    );
};
