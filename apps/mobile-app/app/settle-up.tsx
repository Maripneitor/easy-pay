import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform, 
    ActivityIndicator,
    Modal,
    Dimensions,
    Pressable
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/infrastructure/context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_DEBT = 1500.00;

export default function SettleUpScreen() {
    const { theme, fontScale } = useTheme();
    const [amount, setAmount] = useState('');
    const [isTotalPayment, setIsTotalPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [showMethods, setShowMethods] = useState(false);
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState('');
    const [error, setError] = useState(false);

    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
    const isValidAmount = numericAmount > 0 && numericAmount <= TOTAL_DEBT;

    const handleSettle = () => {
        if (!isValidAmount) {
            setError(true);
            setTimeout(() => setError(false), 500);
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/payment-success');
        }, 2000);
    };

    const handlePayAll = () => {
        setAmount(TOTAL_DEBT.toString());
        setIsTotalPayment(true);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top', 'bottom']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={{ backgroundColor: theme.bg, borderColor: theme.border }} className="px-6 py-4 flex-row items-center justify-between border-b">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        style={{ backgroundColor: theme.card }}
                        className="w-10 h-10 items-center justify-center rounded-full"
                    >
                        <Ionicons name="arrow-back" size={22} color="white" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16 * fontScale, color: theme.text }} className="font-black uppercase tracking-widest">Liquidar Deuda</Text>
                    <View className="w-10" /> 
                </View>

                <ScrollView 
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Destination Card */}
                    <View className="px-6 py-10">
                        <View style={{ backgroundColor: theme.card, borderColor: theme.border }} className="p-8 rounded-[48px] items-center border shadow-2xl">
                            <MotiView 
                                from={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ backgroundColor: `${theme.primary}15` }}
                                className="w-24 h-24 rounded-[36px] items-center justify-center mb-6"
                            >
                                <Ionicons name="person" size={44} color={theme.primary} />
                            </MotiView>
                            <Text style={{ fontSize: 12 * fontScale }} className="text-slate-500 font-bold uppercase tracking-widest mb-2">Estás pagando a</Text>
                            <Text style={{ fontSize: 28 * fontScale, color: theme.text }} className="font-black">Nexium S.A.S.</Text>
                            <View style={{ backgroundColor: `${theme.primary}15` }} className="flex-row items-center px-4 py-2 rounded-full mt-4">
                                <View style={{ backgroundColor: theme.primary }} className="w-2 h-2 rounded-full mr-2" />
                                <Text style={{ color: theme.primary, fontSize: 10 * fontScale }} className="font-black uppercase tracking-wider">Grupo Oficial</Text>
                            </View>
                        </View>
                    </View>

                    {/* Amount Input */}
                    <View className="px-6">
                        <View className="flex-row justify-between items-end mb-4 px-2">
                            <View>
                                <Text style={{ fontSize: 10 * fontScale }} className="text-slate-500 font-black uppercase tracking-widest mb-1">Monto a pagar</Text>
                                <Text style={{ fontSize: 13 * fontScale, color: theme.textSecondary }} className="font-bold">Deuda total: ${TOTAL_DEBT.toLocaleString()}</Text>
                            </View>
                            <TouchableOpacity onPress={handlePayAll} style={{ backgroundColor: `${theme.primary}20` }} className="px-5 py-2.5 rounded-2xl">
                                <Text style={{ color: theme.primary, fontSize: 10 * fontScale }} className="font-black uppercase">Pagar todo</Text>
                            </TouchableOpacity>
                        </View>

                        <MotiView 
                            animate={{ 
                                translateX: error ? [-5, 5, -5, 5, 0] : 0,
                                borderColor: error ? '#EF4444' : theme.border
                            }}
                            style={{ backgroundColor: theme.card }}
                            className="p-10 rounded-[40px] border shadow-2xl flex-row items-center justify-center"
                        >
                            <Text style={{ fontSize: 32 * fontScale }} className="text-slate-500 font-black mr-3">$</Text>
                            <TextInput
                                value={amount}
                                onChangeText={(val) => {
                                    setAmount(val);
                                    setIsTotalPayment(parseFloat(val) === TOTAL_DEBT);
                                }}
                                placeholder="0.00"
                                placeholderTextColor="#334155"
                                keyboardType="decimal-pad"
                                style={{ fontSize: 52 * fontScale, color: theme.text }}
                                className="font-black"
                                autoFocus
                            />
                        </MotiView>
                    </View>

                    {/* Note Field */}
                    <View className="px-6 mt-10">
                        <Text style={{ fontSize: 10 * fontScale }} className="text-slate-500 font-black uppercase tracking-widest mb-3 ml-2">Nota (Opcional)</Text>
                        <View style={{ backgroundColor: theme.card, borderColor: theme.border }} className="p-5 rounded-2xl border flex-row items-center">
                            <Feather name="edit-3" size={18} color="#64748b" />
                            <TextInput
                                placeholder="Concepto del pago..."
                                placeholderTextColor="#334155"
                                style={{ flex: 1, marginLeft: 16, color: 'white', fontWeight: 'bold' }}
                                value={note}
                                onChangeText={setNote}
                            />
                        </View>
                    </View>

                    {/* Payment Method */}
                    <View className="px-6 mt-10">
                        <Text style={{ fontSize: 10 * fontScale }} className="text-slate-500 font-black uppercase tracking-widest mb-3 ml-2">Método de pago</Text>
                        <TouchableOpacity 
                            onPress={() => setShowMethods(true)}
                            style={{ backgroundColor: theme.card, borderColor: theme.border }}
                            className="p-5 rounded-3xl border flex-row items-center justify-between"
                        >
                            <View className="flex-row items-center">
                                <View style={{ backgroundColor: `${theme.primary}10` }} className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                    <Ionicons 
                                        name={paymentMethod === 'Efectivo' ? 'cash' : (paymentMethod === 'Transferencia' ? 'send' : 'card')} 
                                        size={22} 
                                        color={theme.primary} 
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16 * fontScale, color: theme.text }} className="font-black">{paymentMethod}</Text>
                                    <Text style={{ fontSize: 9 * fontScale }} className="text-emerald-500 font-black uppercase tracking-wider">Verificado</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#334155" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Footer and Button */}
                <View style={{ backgroundColor: theme.bg, borderColor: theme.border }} className="p-10 border-t pb-16">
                    <TouchableOpacity 
                        onPress={handleSettle}
                        disabled={loading || !isValidAmount}
                        style={{ 
                            backgroundColor: isValidAmount ? theme.primary : '#1e293b', 
                            shadowColor: theme.primary,
                            shadowOpacity: 0.3,
                            shadowRadius: 15
                        }}
                        className="h-20 rounded-3xl items-center justify-center shadow-2xl"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={{ fontSize: 13 * fontScale }} className="text-white font-black uppercase tracking-widest">
                                {isTotalPayment ? 'Liquidar Todo' : 'Confirmar Pago'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Bottom Sheet Methods */}
                <Modal visible={showMethods} transparent animationType="slide">
                    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        <Pressable style={{ flex: 1 }} onPress={() => setShowMethods(false)} />
                        <View style={{ backgroundColor: theme.card, borderTopLeftRadius: 50, borderTopRightRadius: 50, padding: 32, paddingBottom: 64, borderTopWidth: 1, borderTopColor: theme.border }}>
                            <View style={{ width: 48, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, alignSelf: 'center', marginBottom: 32 }} />
                            <Text style={{ fontSize: 24 * fontScale, color: theme.text }} className="font-black mb-6">Método de Pago</Text>
                            
                            {[
                                { id: 'Efectivo', icon: 'cash', color: '#10B981', label: 'Cash / Efectivo' },
                                { id: 'Transferencia', icon: 'send', color: '#3B82F6', label: 'Spei / Transferencia' },
                                { id: 'Tarjeta', icon: 'card', color: '#8B5CF6', label: 'Crédito o Débito' }
                            ].map((method) => (
                                <TouchableOpacity 
                                    key={method.id}
                                    onPress={() => { setPaymentMethod(method.id); setShowMethods(false); }}
                                    style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: theme.border }}
                                    className="flex-row items-center p-6 rounded-3xl border mb-4"
                                >
                                    <View style={{ backgroundColor: `${method.color}15` }} className="w-14 h-14 rounded-2xl items-center justify-center mr-5">
                                        <Ionicons name={method.icon as any} size={28} color={method.color} />
                                    </View>
                                    <Text style={{ fontSize: 18 * fontScale, color: theme.text }} className="flex-1 font-black">{method.label}</Text>
                                    {paymentMethod === method.id && (
                                        <Ionicons name="checkmark-circle" size={28} color={theme.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
