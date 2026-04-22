import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    TextInput,
    Dimensions,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../src/infrastructure/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function RegisterCardScreen() {
    const { theme, fontScale } = useTheme();
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* TopAppBar */}
            <View className="flex-row items-center justify-between px-6 py-4 w-full">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
                    <MaterialIcons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black tracking-tight flex-1 text-center pr-10">Nueva Tarjeta</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}>
                {/* Virtual Card Preview */}
                <View className="mb-10 items-center">
                    <LinearGradient
                        colors={['#1e293b', '#0f172a']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-full h-56 rounded-[32px] p-8 justify-between shadow-2xl relative overflow-hidden"
                    >
                        <View className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24" />
                        
                        <View className="flex-row justify-between items-start">
                            <View className="w-12 h-10 bg-amber-400/20 rounded-md items-center justify-center">
                                <View className="w-8 h-6 bg-amber-400/40 rounded-sm" />
                            </View>
                            <FontAwesome5 name="visa" size={32} color="white" />
                        </View>

                        <View>
                            <Text className="text-white text-2xl font-black tracking-[4px] mb-6">
                                {cardNumber || '•••• •••• •••• ••••'}
                            </Text>
                            <View className="flex-row justify-between items-end">
                                <View>
                                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Titular</Text>
                                    <Text className="text-white font-bold text-sm uppercase">{cardName || 'Nombre en la tarjeta'}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Expira</Text>
                                    <Text className="text-white font-bold text-sm">{expiry || 'MM/YY'}</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Form Section */}
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="rounded-[2.5rem] p-8 border mb-8 gap-6">
                    <View>
                        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-3 ml-1">Número de Tarjeta</Text>
                        <View style={{ backgroundColor: theme.bg }} className="flex-row items-center px-5 py-4 rounded-2xl">
                            <MaterialIcons name="credit-card" size={20} color={theme.textSecondary} className="mr-3" />
                            <TextInput 
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                keyboardType="numeric"
                                maxLength={19}
                                placeholder="4242 4242 4242 4242"
                                placeholderTextColor="#475569"
                                style={{ color: theme.text, flex: 1, fontWeight: 'bold' }}
                            />
                        </View>
                    </View>

                    <View>
                        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-3 ml-1">Nombre del Titular</Text>
                        <View style={{ backgroundColor: theme.bg }} className="flex-row items-center px-5 py-4 rounded-2xl">
                            <MaterialIcons name="person-outline" size={20} color={theme.textSecondary} className="mr-3" />
                            <TextInput 
                                value={cardName}
                                onChangeText={setCardName}
                                autoCapitalize="words"
                                placeholder="JUAN PEREZ"
                                placeholderTextColor="#475569"
                                style={{ color: theme.text, flex: 1, fontWeight: 'bold' }}
                            />
                        </View>
                    </View>

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-3 ml-1">Expiración</Text>
                            <View style={{ backgroundColor: theme.bg }} className="flex-row items-center px-5 py-4 rounded-2xl">
                                <TextInput 
                                    value={expiry}
                                    onChangeText={setExpiry}
                                    keyboardType="numeric"
                                    maxLength={5}
                                    placeholder="MM/YY"
                                    placeholderTextColor="#475569"
                                    style={{ color: theme.text, flex: 1, fontWeight: 'bold', textAlign: 'center' }}
                                />
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-black uppercase tracking-[3px] mb-3 ml-1">CVV</Text>
                            <View style={{ backgroundColor: theme.bg }} className="flex-row items-center px-5 py-4 rounded-2xl">
                                <TextInput 
                                    value={cvv}
                                    onChangeText={setCvv}
                                    keyboardType="numeric"
                                    maxLength={3}
                                    secureTextEntry
                                    placeholder="•••"
                                    placeholderTextColor="#475569"
                                    style={{ color: theme.text, flex: 1, fontWeight: 'bold', textAlign: 'center' }}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Info Text */}
                <View className="flex-row items-center gap-3 px-4 opacity-60">
                    <Ionicons name="shield-checkmark-outline" size={20} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary }} className="text-[10px] font-medium flex-1">
                        Tus datos están protegidos bajo estándares PCI-DSS de nivel bancario.
                    </Text>
                </View>
            </ScrollView>

            {/* Footer Action */}
            <View 
                style={{ backgroundColor: theme.bg, borderColor: theme.border }} 
                className="absolute bottom-0 w-full px-6 py-8 border-t"
            >
                <TouchableOpacity 
                    activeOpacity={0.8}
                    className="w-full h-16 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/20"
                >
                    <LinearGradient
                        colors={[theme.primary, theme.primary + 'CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-full h-full items-center justify-center"
                    >
                        <Text className="text-black font-black text-base uppercase tracking-widest">Guardar Tarjeta</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
