import React, { useState, useMemo, useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    Dimensions,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../src/infrastructure/context/ThemeContext';
import { usePayments } from '../src/infrastructure/context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { groupRepository } from '../src/infrastructure/api/repositories/GroupRepository';
import { getApiBaseUrl } from '../src/infrastructure/api/network.config';
import QRCode from 'react-native-qrcode-svg';
import { Modal } from 'react-native';

const { width } = Dimensions.get('window');

export default function SettleUpScreen() {
    const { theme, fontScale } = useTheme();
    const { amount, method, groupId } = useLocalSearchParams<{ amount: string, method: string, groupId: string }>();
    const { cards, loading: loadingCards } = usePayments();
    const { user } = useAuth();
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedAccounts, setSelectedAccounts] = useState<any[]>([]);
    const [loadingGroup, setLoadingGroup] = useState(false);
    const [qrValue, setQrValue] = useState<string | null>(null);

    const numericAmount = parseFloat(amount || '0');
    const defaultCard = useMemo(() => cards.find(c => c.isDefault) || cards[0], [cards]);

    useEffect(() => {
        if (method === 'transfer' && groupId) {
            fetchGroupData();
        }
    }, [method, groupId]);

    const fetchGroupData = async () => {
        setLoadingGroup(true);
        try {
            const group = await groupRepository.getGroup(groupId!);
            if (group.selected_bank_accounts) {
                setSelectedAccounts(group.selected_bank_accounts);
            }
        } catch (error) {
            console.error("Error fetching group data:", error);
        } finally {
            setLoadingGroup(false);
        }
    };

    const copyToClipboard = async (text: string, label: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copiado', `${label} copiado al portapapeles.`);
    };

    const handleConfirm = async () => {
        if (!user || !groupId) return;

        setIsConfirming(true);
        try {
            await groupRepository.markMemberAsPaid(groupId, user.id);
            
            Alert.alert('¡Éxito!', 'Tu pago ha sido procesado correctamente.', [
                { text: 'Genial', onPress: () => router.replace({ pathname: '/(tabs)/group/[id]', params: { id: groupId } } as any) }
            ]);
        } catch (error: any) {
            const msg = error.response?.data?.detail || 'No se pudo procesar el pago';
            Alert.alert('Error', msg);
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges = {['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* TopAppBar */}
            <View className="flex-row items-center justify-between px-6 py-4 w-full">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ backgroundColor: theme.cardSecondary }}
                    className="w-10 h-10 rounded-full items-center justify-center"
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight flex-1 text-center pr-10">Liquidar Deuda</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Summary Section */}
                <View className="flex flex-col items-center justify-center py-10 gap-2">
                    <Text style={{ color: theme.textSecondary }} className="text-sm font-medium tracking-wide">Total a Pagar</Text>
                    <Text style={{ fontSize: 48 * fontScale, color: theme.text }} className="font-black">${numericAmount.toFixed(2)}</Text>
                </View>

                {/* Payment Method Section */}
                <View className="gap-4">
                    <Text style={{ color: theme.text }} className="text-lg font-bold">Método de Pago</Text>
                    
                    {method === 'card' && (
                        <>
                            {loadingCards ? (
                                <ActivityIndicator color={theme.primary} />
                            ) : defaultCard ? (
                                <TouchableOpacity 
                                    onPress={() => router.push('/(tabs)/stats' as any)}
                                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                    className="rounded-2xl p-4 flex-row items-center justify-between border"
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View style={{ backgroundColor: theme.glassBg }} className="w-12 h-10 rounded-lg flex items-center justify-center">
                                            <MaterialIcons name="credit-card" size={24} color={theme.primary} />
                                        </View>
                                        <View>
                                            <Text style={{ color: theme.text }} className="font-bold">{defaultCard.brand} terminada en {defaultCard.last4}</Text>
                                            <Text style={{ color: theme.textSecondary }} className="text-xs">Titular: {defaultCard.holder}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ color: theme.primary }} className="font-bold text-sm">Cambiar</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity 
                                    onPress={() => router.push('/wallet/methods/new' as any)}
                                    style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                    className="w-full flex-row items-center justify-center gap-2 py-4 px-4 rounded-2xl border"
                                >
                                    <MaterialIcons name="add" size={20} color={theme.primary} />
                                    <Text style={{ color: theme.primary }} className="font-bold">Agregar nueva tarjeta</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {method === 'cash' && (
                        <View 
                            style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                            className="rounded-2xl p-4 flex-row items-center gap-4 border"
                        >
                            <View style={{ backgroundColor: theme.glassBg }} className="w-12 h-10 rounded-lg flex items-center justify-center">
                                <MaterialIcons name="payments" size={24} color={theme.primary} />
                            </View>
                            <View>
                                <Text style={{ color: theme.text }} className="font-bold">Efectivo</Text>
                                <Text style={{ color: theme.textSecondary }} className="text-xs">Pago presencial</Text>
                            </View>
                        </View>
                    )}

                    {method === 'transfer' && (
                        <View className="gap-4">
                            <View 
                                style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }}
                                className="rounded-2xl p-4 flex-row items-center gap-4 border"
                            >
                                <View style={{ backgroundColor: theme.glassBg }} className="w-12 h-10 rounded-lg flex items-center justify-center">
                                    <MaterialIcons name="account-balance" size={24} color={theme.primary} />
                                </View>
                                <View>
                                    <Text style={{ color: theme.text }} className="font-bold">Transferencia Bancaria</Text>
                                    <Text style={{ color: theme.textSecondary }} className="text-xs">Cuentas autorizadas por el líder</Text>
                                </View>
                            </View>

                            {loadingGroup ? (
                                <ActivityIndicator color={theme.primary} />
                            ) : selectedAccounts.length > 0 ? (
                                <View className="gap-3">
                                    {selectedAccounts.map((acc, index) => (
                                        <View key={index} style={{ backgroundColor: theme.card, borderColor: theme.border }} className="border rounded-3xl p-6 gap-4">
                                            <View className="flex-row justify-between items-start">
                                                <View className="flex-1">
                                                    <Text style={{ color: theme.primary }} className="font-black text-xs uppercase tracking-widest mb-1">{acc.entidad_financiera}</Text>
                                                    <Text style={{ color: theme.text }} className="font-bold text-lg font-mono">{acc.clabe}</Text>
                                                </View>
                                                <View className="flex-row gap-2">
                                                    <TouchableOpacity 
                                                        onPress={() => setQrValue(acc.clabe)}
                                                        style={{ backgroundColor: theme.primary + '20' }}
                                                        className="p-3 rounded-xl"
                                                    >
                                                        <MaterialIcons name="qr-code-2" size={18} color={theme.primary} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity 
                                                        onPress={() => copyToClipboard(acc.clabe, 'CLABE')}
                                                        style={{ backgroundColor: theme.cardSecondary }}
                                                        className="p-3 rounded-xl"
                                                    >
                                                        <MaterialIcons name="content-copy" size={18} color={theme.primary} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <View style={{ backgroundColor: theme.border }} className="h-px w-full opacity-10" />

                                            <View className="flex-row justify-between items-center">
                                                <View>
                                                    <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase">Tipo</Text>
                                                    <Text style={{ color: theme.text }} className="font-bold text-xs">CUENTA {index + 1}</Text>
                                                </View>
                                                <View className="items-end">
                                                    <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase">Beneficiario</Text>
                                                    <Text style={{ color: theme.text }} className="font-bold text-xs">Líder del Grupo</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View style={{ backgroundColor: theme.cardSecondary }} className="p-8 rounded-3xl items-center border-2 border-dashed border-slate-200">
                                    <MaterialIcons name="info-outline" size={32} color={theme.textSecondary} style={{ opacity: 0.3 }} />
                                    <Text style={{ color: theme.textSecondary }} className="text-center text-xs mt-2 font-medium">El líder no ha seleccionado cuentas para este cierre.</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Transaction Details */}
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-2xl p-6 mt-8 border gap-4 shadow-sm">
                    <Text style={{ color: theme.text }} className="text-base font-bold mb-2">Detalles</Text>
                    <View className="flex-row justify-between items-center py-1">
                        <Text style={{ color: theme.textSecondary }} className="text-sm">Monto a liquidar</Text>
                        <Text style={{ color: theme.text }} className="font-medium text-sm">${numericAmount.toFixed(2)}</Text>
                    </View>
                    <View style={{ backgroundColor: theme.border }} className="w-full h-px my-2" />
                    <View className="flex-row justify-between items-center pt-2">
                        <Text style={{ color: theme.text }} className="text-base font-bold">Total</Text>
                        <Text style={{ color: theme.primary }} className="font-black text-xl">${numericAmount.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Action */}
            <View 
                style={{ backgroundColor: theme.bg, borderColor: theme.border }} 
                className="absolute bottom-0 w-full pt-4 pb-10 px-6 border-t"
            >
                <View className="flex-row items-center justify-center gap-2 mb-4 opacity-60">
                    <MaterialIcons name="lock" size={14} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary }} className="text-xs font-medium tracking-wide">Transacción Segura</Text>
                </View>
                <TouchableOpacity 
                    onPress={handleConfirm}
                    disabled={isConfirming || (method === 'card' && !defaultCard)}
                    activeOpacity={0.8}
                    className="w-full rounded-[1.5rem] overflow-hidden"
                    style={{ opacity: isConfirming || (method === 'card' && !defaultCard) ? 0.6 : 1 }}
                >
                    <LinearGradient
                        colors={[theme.primary, theme.primary + 'CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="py-5 items-center justify-center"
                    >
                        {isConfirming ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text className="text-black font-black text-lg">Confirmar Pago</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            {/* QR Modal */}
            <Modal
                visible={!!qrValue}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setQrValue(null)}
            >
                <TouchableOpacity 
                    activeOpacity={1} 
                    onPress={() => setQrValue(null)}
                    className="flex-1 bg-black/80 items-center justify-center p-6"
                >
                    <View style={{ backgroundColor: theme.bg }} className="w-full max-w-xs rounded-[3rem] p-10 items-center gap-6">
                        <Text style={{ color: theme.text }} className="font-black uppercase tracking-tight text-xl">QR de Pago</Text>
                        <View className="p-6 bg-white rounded-3xl border-8 border-white">
                            {qrValue && <QRCode value={qrValue} size={200} color="black" backgroundColor="white" />}
                        </View>
                        <View className="items-center">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-widest">CLABE de Destino</Text>
                            <Text style={{ color: theme.primary }} className="font-bold text-lg font-mono">{qrValue}</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => setQrValue(null)}
                            style={{ backgroundColor: theme.cardSecondary }}
                            className="w-full py-4 rounded-2xl items-center"
                        >
                            <Text style={{ color: theme.textSecondary }} className="font-black uppercase tracking-widest text-[10px]">Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}
