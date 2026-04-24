import React from 'react';
import { View, Text } from 'react-native';
// // import { MotiView, AnimatePresence } from 'moti';
const MotiView = ({ children, style, ...props }: any) => <View style={style} {...props}>{children}</View>;
const AnimatePresence = ({ children }: any) => children;
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
            className="gap-y-8 px-6 pt-4 pb-10"
        >
            {/* Summary Card (Bento-style) */}
            <View 
                style={{ backgroundColor: theme.card }} 
                className="rounded-xl p-6 flex-col gap-5 relative overflow-hidden shadow-xs"
            >
                {/* Subtle glow effect */}
                <View className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <Text style={{ color: theme.text, fontSize: 18 * fontScale, fontFamily: 'Manrope' }} className="font-extrabold tracking-tight mb-2">Desglose de Cuenta</Text>
                
                <View className="gap-y-3">
                    <View className="flex-row justify-between items-center px-1">
                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale, fontFamily: 'Inter' }} className="font-medium">Subtotal</Text>
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale, fontFamily: 'Manrope' }} className="font-bold">${subtotal.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between items-center px-1">
                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale, fontFamily: 'Inter' }} className="font-medium">IVA (12%)</Text>
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale, fontFamily: 'Manrope' }} className="font-bold">${tax.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between items-center px-1">
                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale, fontFamily: 'Inter' }} className="font-medium">Servicio (5%)</Text>
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale, fontFamily: 'Manrope' }} className="font-bold">${service.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between items-center px-1">
                        <Text style={{ color: theme.textSecondary, fontSize: 14 * fontScale, fontFamily: 'Inter' }} className="font-medium">Propina (Opcional)</Text>
                        <Text style={{ color: theme.text, fontSize: 16 * fontScale, fontFamily: 'Manrope' }} className="font-bold">${tip.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Total General Callout */}
                <View 
                    style={{ backgroundColor: theme.cardSecondary }} 
                    className="mt-2 -mx-6 -mb-6 px-6 py-6 flex-row justify-between items-end rounded-b-xl"
                >
                    <Text style={{ color: theme.textSecondary, fontSize: 16 * fontScale, fontFamily: 'Inter' }} className="font-bold">Total General</Text>
                    <Text style={{ color: theme.primary, fontSize: 32 * fontScale, fontFamily: 'Manrope' }} className="font-black tracking-tight">${total.toFixed(2)}</Text>
                </View>
            </View>

            {/* Aportes Section */}
            <View>
                <Text style={{ color: theme.text, fontSize: 18 * fontScale, fontFamily: 'Manrope' }} className="font-extrabold mb-4 tracking-tight px-1">Aportes de Miembros</Text>
                <View className="flex-row gap-x-4">
                    {/* Pagado Card */}
                    <View 
                        style={{ backgroundColor: theme.card }} 
                        className="flex-1 rounded-xl p-5 flex-col gap-1.5 relative overflow-hidden shadow-xs"
                    >
                        <View className="absolute top-0 left-0 w-1 h-full bg-[#10B981] opacity-80" />
                        <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale, fontFamily: 'Inter' }} className="uppercase tracking-wider font-semibold">Pagado</Text>
                        <Text style={{ color: theme.text, fontSize: 22 * fontScale, fontFamily: 'Manrope' }} className="font-bold tracking-tight">${paidAmount.toFixed(2)}</Text>
                        <View style={{ backgroundColor: theme.cardSecondary }} className="w-full h-1 rounded-full mt-2 overflow-hidden">
                            <MotiView 
                                from={{ width: '0%' }}
                                animate={{ width: `${paidProgress}%` }}
                                transition={{ type: 'timing', duration: 1000 }}
                                style={{ backgroundColor: '#10B981' }} 
                                className="h-full rounded-full" 
                            />
                        </View>
                    </View>

                    {/* Pendiente Card */}
                    <View 
                        style={{ backgroundColor: theme.cardSecondary }} 
                        className="flex-1 rounded-xl p-5 flex-col gap-1.5 relative overflow-hidden border border-outline-variant/15"
                    >
                        <View className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                        <Text style={{ color: '#D97706', fontSize: 10 * fontScale, fontFamily: 'Inter' }} className="uppercase tracking-wider font-semibold">Pendiente</Text>
                        <Text style={{ color: theme.text, fontSize: 22 * fontScale, fontFamily: 'Manrope' }} className="font-bold tracking-tight">${pendingAmount.toFixed(2)}</Text>
                        <View style={{ backgroundColor: theme.card }} className="w-full h-1 rounded-full mt-2 overflow-hidden">
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
