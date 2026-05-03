import React, { useState, useMemo } from 'react';
import { 
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    Dimensions,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';

interface SettlementWizardProps {
    isVisible: boolean;
    onClose: () => void;
    groupData: any;
    balances: any;
    items: any[];
    onComplete: (data: any) => void;
}

export const SettlementWizard: React.FC<SettlementWizardProps> = ({ 
    isVisible, 
    onClose, 
    groupData,
    balances,
    items,
    onComplete
}) => {
    const { theme, fontScale } = useTheme();
    const [step, setStep] = useState(1);
    const [tipPercent, setTipPercent] = useState(10);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = balances?.total_gastado_en_grupo || 0;
    const tipAmount = subtotal * (tipPercent / 100);
    const total = subtotal + tipAmount;

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else onClose();
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simular llamada a API
        setTimeout(() => {
            setIsSubmitting(false);
            onComplete({ tipPercent, total });
            onClose();
            setStep(1);
        }, 2000);
    };

    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <View className="flex-1 bg-black/80 justify-end">
                <View 
                    style={{ backgroundColor: theme.card, minHeight: '80%' }}
                    className="rounded-t-[3rem] p-8 pb-12 border-t"
                    style={{ borderTopColor: theme.border, backgroundColor: theme.card }}
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-8">
                        <TouchableOpacity onPress={handleBack} className="p-2">
                            <Ionicons name={step === 1 ? "close" : "arrow-back"} size={24} color={theme.text} />
                        </TouchableOpacity>
                        <View className="items-center">
                            <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-[0.2em]">Paso {step} de 3</Text>
                            <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">Liquidar Grupo</Text>
                        </View>
                        <View className="w-10" />
                    </View>

                    {/* Progress Bar */}
                    <View className="flex-row gap-2 mb-10">
                        {[1, 2, 3].map(s => (
                            <View 
                                key={s} 
                                className="h-1.5 flex-1 rounded-full" 
                                style={{ backgroundColor: s <= step ? theme.primary : `${theme.textSecondary}20` }}
                            />
                        ))}
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {step === 1 && (
                            <View className="animate-in fade-in">
                                <View className="items-center mb-8">
                                    <View style={{ backgroundColor: `${theme.primary}15` }} className="w-20 h-20 rounded-[2rem] items-center justify-center mb-4">
                                        <MaterialIcons name="fact-check" size={40} color={theme.primary} />
                                    </View>
                                    <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-black text-center">Revisión de Ítems</Text>
                                    <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="font-medium text-center mt-2 opacity-60">
                                        Confirma que todos los gastos estén registrados correctamente.
                                    </Text>
                                </View>

                                <View className="gap-y-3">
                                    {items.slice(0, 5).map((item, idx) => (
                                        <View key={idx} style={{ backgroundColor: theme.cardSecondary }} className="p-4 rounded-2xl flex-row justify-between items-center">
                                            <Text style={{ color: theme.text }} className="font-bold text-sm">{item.description || item.nombre || "Gasto"}</Text>
                                            <Text style={{ color: theme.primary }} className="font-black">${Number(item.amount || item.monto || 0).toFixed(2)}</Text>
                                        </View>
                                    ))}
                                    {items.length > 5 && (
                                        <Text style={{ color: theme.textSecondary }} className="text-center text-xs mt-2 italic">Y {items.length - 5} ítems más...</Text>
                                    )}
                                </View>
                            </View>
                        )}

                        {step === 2 && (
                            <View className="animate-in fade-in">
                                <View className="items-center mb-8">
                                    <View style={{ backgroundColor: '#10b98115' }} className="w-20 h-20 rounded-[2rem] items-center justify-center mb-4">
                                        <FontAwesome5 name="hand-holding-usd" size={32} color="#10b981" />
                                    </View>
                                    <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-black text-center">Propina Sugerida</Text>
                                    <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="font-medium text-center mt-2 opacity-60">
                                        Selecciona el porcentaje de gratitud.
                                    </Text>
                                </View>

                                <View className="flex-row justify-between gap-2 mb-8">
                                    {[5, 10, 15, -1].map(p => (
                                        <TouchableOpacity 
                                            key={p}
                                            onPress={() => setTipPercent(p)}
                                            style={{ 
                                                backgroundColor: tipPercent === p ? theme.primary : theme.cardSecondary,
                                                borderColor: tipPercent === p ? theme.primary : theme.border
                                            }}
                                            className="flex-1 py-4 rounded-2xl items-center border"
                                        >
                                            <Text style={{ color: tipPercent === p ? 'white' : theme.text }} className="font-black text-lg">{p === -1 ? 'Otro' : `${p}%`}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {tipPercent === -1 && (
                                    <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="p-6 rounded-3xl border mb-8 flex-row items-center">
                                        <Text style={{ color: theme.textSecondary }} className="font-black mr-4 text-xl">$</Text>
                                        <View className="flex-1">
                                            <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-widest opacity-40">Monto Manual</Text>
                                            <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-black">100.00</Text> 
                                            {/* Note: In a real app, use a TextInput here */}
                                        </View>
                                    </View>
                                )}

                                <View style={{ backgroundColor: theme.cardSecondary }} className="p-8 rounded-[2.5rem] border border-dashed" style={{ borderColor: theme.border, backgroundColor: theme.cardSecondary }}>
                                    <View className="flex-row justify-between mb-2">
                                        <Text style={{ color: theme.textSecondary }} className="font-bold">Subtotal</Text>
                                        <Text style={{ color: theme.text }} className="font-black">${subtotal.toFixed(2)}</Text>
                                    </View>
                                    <View className="flex-row justify-between mb-4">
                                        <Text style={{ color: theme.textSecondary }} className="font-bold">Propina ({tipPercent}%)</Text>
                                        <Text style={{ color: '#10b981' }} className="font-black">+${tipAmount.toFixed(2)}</Text>
                                    </View>
                                    <View className="h-[1px] bg-white/10 mb-4" />
                                    <View className="flex-row justify-between">
                                        <Text style={{ color: theme.text }} className="font-black text-lg">Total Final</Text>
                                        <Text style={{ color: theme.primary }} className="font-black text-2xl">${total.toFixed(2)}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {step === 3 && (
                            <View className="animate-in fade-in">
                                <View className="items-center mb-8">
                                    <View style={{ backgroundColor: `${theme.primary}15` }} className="w-20 h-20 rounded-[2rem] items-center justify-center mb-4">
                                        <MaterialIcons name="auto-awesome" size={40} color={theme.primary} />
                                    </View>
                                    <Text style={{ color: theme.text, fontSize: 24 * fontScale }} className="font-black text-center">Resumen Final</Text>
                                    <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="font-medium text-center mt-2 opacity-60">
                                        El grupo se cerrará y se enviarán los saldos a cada integrante.
                                    </Text>
                                </View>

                                <View style={{ backgroundColor: theme.primary }} className="p-8 rounded-[3rem] shadow-xl shadow-blue-500/20">
                                    <View className="items-center mb-6">
                                        <Text className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Grupo</Text>
                                        <Text className="text-white font-black text-2xl text-center uppercase tracking-tighter">{groupData?.nombre || "Grupo"}</Text>
                                    </View>
                                    
                                    <View className="flex-row justify-between mb-4">
                                        <View>
                                            <Text className="text-white/40 font-black uppercase tracking-widest text-[9px]">Integrantes</Text>
                                            <Text className="text-white font-black text-lg">{groupData?.integrantes?.length || 0}</Text>
                                        </View>
                                        <View className="items-end">
                                            <Text className="text-white/40 font-black uppercase tracking-widest text-[9px]">Items</Text>
                                            <Text className="text-white font-black text-lg">{items.length}</Text>
                                        </View>
                                    </View>

                                    <View className="h-[1px] bg-white/20 mb-6" />

                                    <View className="items-center">
                                        <Text className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] mb-1">Monto a Liquidar</Text>
                                        <Text className="text-white font-black text-4xl">${total.toFixed(2)}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View className="mt-10 flex-row gap-4">
                        {step > 1 && (
                            <TouchableOpacity 
                                onPress={handleBack}
                                style={{ backgroundColor: theme.cardSecondary }}
                                className="flex-1 py-5 rounded-2xl items-center justify-center border border-white/5"
                            >
                                <Text style={{ color: theme.text }} className="font-black uppercase tracking-widest text-xs">Atrás</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            onPress={handleNext}
                            disabled={isSubmitting}
                            style={{ backgroundColor: step === 3 ? '#10b981' : theme.primary }}
                            className="flex-[2] py-5 rounded-2xl flex-row items-center justify-center gap-3 shadow-lg"
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text className="text-white font-black uppercase tracking-widest text-xs">
                                        {step === 3 ? "Finalizar y Cerrar" : "Siguiente"}
                                    </Text>
                                    <Ionicons name={step === 3 ? "checkmark-circle" : "arrow-forward"} size={18} color="white" />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
