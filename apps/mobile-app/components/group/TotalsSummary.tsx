import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';

interface TotalsSummaryProps {
    subtotal: number;
    tax: number;
    service: number;
    tip: number;
    total: number;
    paidAmount: number;
    pendingAmount: number;
}

export const TotalsSummary: React.FC<TotalsSummaryProps> = ({ 
    subtotal, tax, service, tip, total, paidAmount, pendingAmount 
}) => {
    const { theme, fontScale } = useTheme();
    const paidProgress = (paidAmount / total) * 100;
    const pendingProgress = (pendingAmount / total) * 100;

    return (
        <MotiView 
            from={{ opacity: 0, translateY: 20 }} 
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
            className="gap-y-8 px-5 pt-4 pb-10"
        >
            {/* Breakdown Card */}
            <View 
                style={{ backgroundColor: theme.card, borderColor: theme.border }} 
                className="rounded-[2.5rem] p-7 border shadow-xl overflow-hidden"
            >
                <Text style={{ color: theme.text, fontSize: 20 * fontScale }} className="font-black mb-6 tracking-tight">Desglose de Cuenta</Text>
                
                <View className="gap-y-5 mb-4">
                    <View className="flex-row justify-between items-center">
                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="font-bold uppercase tracking-wider opacity-70">Subtotal</Text>
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">${subtotal.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="font-bold uppercase tracking-wider opacity-70">IVA (12%)</Text>
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">${tax.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="font-bold uppercase tracking-wider opacity-70">Servicio (5%)</Text>
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">${service.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale }} className="font-bold uppercase tracking-wider opacity-70">Propina</Text>
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-black">${tip.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Total Section with different background */}
                <View 
                    style={{ backgroundColor: theme.cardSecondary, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }} 
                    className="-mx-7 -mb-7 p-7 mt-6 flex-row justify-between items-end border-t"
                    style={{ borderTopColor: theme.border + '20', backgroundColor: theme.cardSecondary }}
                >
                    <View>
                        <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="font-black uppercase tracking-[0.2em] mb-1">Total General</Text>
                        <Text style={{ color: theme.primary, fontSize: 36 * fontScale }} className="font-black tracking-tighter">${total.toFixed(2)}</Text>
                    </View>
                    <View className="bg-emerald-500/10 px-3 py-1.5 rounded-xl mb-1">
                        <Text className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Verificado</Text>
                    </View>
                </View>
            </View>

            {/* Aportes Section */}
            <View>
                <Text style={{ color: theme.text, fontSize: 19 * fontScale }} className="font-black mb-5 tracking-tight px-1">Resumen de Aportes</Text>
                <View className="flex-row gap-x-4">
                    {/* Paid Card */}
                    <View 
                        style={{ backgroundColor: theme.card, borderColor: theme.border }} 
                        className="flex-1 rounded-[2rem] p-6 border shadow-sm"
                    >
                        <View className="flex-row items-center mb-3">
                            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                            <Text style={{ color: theme.textSecondary, fontSize: 11 * fontScale }} className="uppercase tracking-widest font-black opacity-60">Pagado</Text>
                        </View>
                        <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-black tracking-tight">${paidAmount.toFixed(2)}</Text>
                        <View style={{ backgroundColor: theme.cardSecondary }} className="w-full h-2 rounded-full mt-4 overflow-hidden">
                            <MotiView 
                                from={{ width: '0%' }}
                                animate={{ width: `${paidProgress}%` }}
                                transition={{ type: 'timing', duration: 1000 }}
                                style={{ backgroundColor: theme.primary }} 
                                className="h-full rounded-full" 
                            />
                        </View>
                    </View>

                    {/* Pending Card */}
                    <View 
                        style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} 
                        className="flex-1 rounded-[2rem] p-6 border"
                    >
                        <View className="flex-row items-center mb-3">
                            <View className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                            <Text style={{ color: '#F59E0B', fontSize: 11 * fontScale }} className="uppercase tracking-widest font-black opacity-80">Pendiente</Text>
                        </View>
                        <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-black tracking-tight">${pendingAmount.toFixed(2)}</Text>
                        <View style={{ backgroundColor: theme.card }} className="w-full h-2 rounded-full mt-4 overflow-hidden">
                            <MotiView 
                                from={{ width: '0%' }}
                                animate={{ width: `${pendingProgress}%` }}
                                transition={{ type: 'timing', duration: 1000 }}
                                style={{ backgroundColor: '#F59E0B' }} 
                                className="h-full rounded-full" 
                            />
                        </View>
                    </View>
                </View>
            </View>
        </MotiView>
    );
};
