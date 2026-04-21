import React from 'react';
import { 
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { MotiView } from 'moti';

interface PaymentMethodModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (method: 'cash' | 'card') => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ 
    isVisible, 
    onClose, 
    onSelect 
}) => {
    const { theme, fontScale } = useTheme();

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View className="flex-1 bg-black/60 justify-end">
                <TouchableOpacity 
                    activeOpacity={1} 
                    className="absolute inset-0" 
                    onPress={onClose} 
                />
                
                <MotiView 
                    from={{ translateY: 300 }}
                    animate={{ translateY: 0 }}
                    style={{ backgroundColor: theme.card }}
                    className="rounded-t-[3rem] p-10 pb-16 border-t"
                    style={{ borderTopColor: theme.border, backgroundColor: theme.card }}
                >
                    {/* Handle */}
                    <View className="w-12 h-1.5 bg-white/10 rounded-full self-center mb-10" />
                    
                    <View className="items-center mb-10">
                        <View style={{ backgroundColor: `${theme.primary}15` }} className="w-20 h-20 rounded-[2.5rem] items-center justify-center mb-6">
                            <MaterialIcons name="payments" size={40} color={theme.primary} />
                        </View>
                        <Text style={{ color: theme.text, fontSize: 26 * fontScale }} className="font-black tracking-tight">Liquidar Deuda</Text>
                        <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="font-medium text-center mt-2 opacity-60">Selecciona tu método de pago preferido</Text>
                    </View>

                    <View className="gap-y-4">
                        <TouchableOpacity 
                            onPress={() => onSelect('card')}
                            style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                            className="flex-row items-center p-6 rounded-[2.5rem] border"
                        >
                            <View className="w-14 h-14 bg-blue-500/10 rounded-2xl items-center justify-center mr-5 border border-blue-500/20">
                                <Ionicons name="card" size={28} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">Tarjeta</Text>
                                <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest opacity-40">Débito o Crédito</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => onSelect('cash')}
                            style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                            className="flex-row items-center p-6 rounded-[2.5rem] border"
                        >
                            <View className="w-14 h-14 bg-emerald-500/10 rounded-2xl items-center justify-center mr-5 border border-emerald-500/20">
                                <Ionicons name="cash" size={28} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">Efectivo</Text>
                                <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest opacity-40">Registro Manual</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View className="mt-12 items-center">
                        <Text style={{ color: theme.textSecondary, fontSize: 9 * fontScale }} className="font-black uppercase tracking-[0.3em] opacity-30 text-center">Seguridad Encriptada por Easy-Pay Protocol</Text>
                    </View>
                </MotiView>
            </View>
        </Modal>
    );
};
