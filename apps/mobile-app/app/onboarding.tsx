import React, { useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    Dimensions, 
    TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('Luis Gonzalez');
    const [currency, setCurrency] = useState('MXN');

    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            router.replace('/(tabs)/dashboard');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0d1425]" edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 px-8 py-10">
                {/* Stepper Indicator */}
                <View className="flex-row gap-2 mb-16 justify-center">
                    {[1, 2, 3].map((s) => (
                        <View 
                            key={s} 
                            className={`h-1.5 rounded-full ${step >= s ? 'w-8 bg-blue-600' : 'w-4 bg-slate-800'}`} 
                        />
                    ))}
                </View>

                <AnimatePresence exitBeforeEnter>
                    {step === 1 && (
                        <MotiView 
                            key="step1"
                            from={{ opacity: 0, translateX: 50 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            exit={{ opacity: 0, translateX: -50 }}
                            className="flex-1"
                        >
                            <Text className="text-white text-4xl font-black tracking-tight mb-4">Completemos tu perfil</Text>
                            <Text className="text-slate-500 text-sm font-bold mb-12">¿Cómo prefieres que te llamen tus amigos?</Text>
                            
                            <View className="items-center mb-12">
                                <View className="w-32 h-32 bg-white/5 rounded-[40px] items-center justify-center border border-white/10 relative">
                                    <Image 
                                        source={{ uri: 'https://lh3.googleusercontent.com/a/ACg8ocL_FmR_pB6M86B8xH9H_R_W_K_K_K_K_K_K_K_K_K_K=s288-c-no' }} 
                                        className="w-full h-full rounded-[40px]"
                                    />
                                    <View className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-2xl items-center justify-center border-4 border-[#0d1425]">
                                        <MaterialIcons name="camera-alt" size={16} color="white" />
                                    </View>
                                </View>
                            </View>

                            <View>
                                <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-4">Nombre Público</Text>
                                <View className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                    <TextInput 
                                        value={name}
                                        onChangeText={setName}
                                        className="text-white font-bold text-lg"
                                        placeholder="Tu nombre"
                                        placeholderTextColor="#334155"
                                    />
                                </View>
                            </View>
                        </MotiView>
                    )}

                    {step === 2 && (
                        <MotiView 
                            key="step2"
                            from={{ opacity: 0, translateX: 50 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            exit={{ opacity: 0, translateX: -50 }}
                            className="flex-1"
                        >
                            <Text className="text-white text-4xl font-black tracking-tight mb-4">Ajustes financieros</Text>
                            <Text className="text-slate-500 text-sm font-bold mb-12">Configura tu moneda local para los cálculos de deudas.</Text>
                            
                            <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6 ml-4">Elige tu moneda</Text>
                            <View className="gap-3">
                                {['MXN (Pesos Mexicanos)', 'USD (Dólares)', 'EUR (Euros)'].map((curr) => (
                                    <TouchableOpacity 
                                        key={curr}
                                        onPress={() => setCurrency(curr.split(' ')[0])}
                                        className={`p-6 rounded-[28px] border flex-row items-center justify-between ${currency === curr.split(' ')[0] ? 'bg-blue-600/10 border-blue-500/40' : 'bg-white/5 border-white/10'}`}
                                    >
                                        <Text className={`font-bold ${currency === curr.split(' ')[0] ? 'text-white' : 'text-slate-400'}`}>{curr}</Text>
                                        {currency === curr.split(' ')[0] && <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </MotiView>
                    )}

                    {step === 3 && (
                        <MotiView 
                            key="step3"
                            from={{ opacity: 0, translateX: 50 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            exit={{ opacity: 0, translateX: -50 }}
                            className="flex-1"
                        >
                            <Text className="text-white text-4xl font-black tracking-tight mb-4">Todo listo para empezar</Text>
                            <Text className="text-slate-500 text-sm font-bold mb-12">¡Bienvenido a EasyPay! Ya puedes crear tu primer grupo o registrar un gasto.</Text>
                            
                            <View className="bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] p-8 items-center">
                                <View className="w-20 h-20 bg-emerald-500 rounded-[30px] items-center justify-center mb-6 shadow-xl shadow-emerald-500/40">
                                    <MaterialIcons name="celebration" size={40} color="white" />
                                </View>
                                <Text className="text-white font-black text-2xl text-center mb-2">¡Configuración Exitosa!</Text>
                                <Text className="text-slate-500 text-center text-xs leading-relaxed">
                                    Tus deudas ahora serán calculadas en {currency}. Puedes cambiar esto en ajustes.
                                </Text>
                            </View>

                            <View className="bg-blue-600/5 border border-blue-500/10 rounded-[40px] p-6 mt-6 flex-row items-center gap-4">
                                <View className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center">
                                    <MaterialIcons name="security" size={20} color="white" />
                                </View>
                                <Text className="text-blue-200 text-[10px] font-black uppercase flex-1">Tus datos están protegidos por cifrado Easy-ID</Text>
                            </View>
                        </MotiView>
                    )}
                </AnimatePresence>

                {/* Footer Actions */}
                <View className="mt-auto">
                    <TouchableOpacity 
                        onPress={nextStep}
                        className="bg-blue-600 p-6 rounded-[28px] items-center justify-center shadow-2xl shadow-blue-500/40 overflow-hidden"
                    >
                        <Text className="text-white font-black uppercase tracking-widest text-[13px]">
                            {step === 3 ? 'Comenzar ahora' : 'Siguiente Paso'}
                        </Text>
                        <View className="absolute right-8 top-1/2 -mt-2">
                             <Ionicons name="arrow-forward" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                    
                    {step < 3 && (
                        <TouchableOpacity 
                            onPress={nextStep}
                            className="mt-6 self-center"
                        >
                            <Text className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">Omitir por ahora</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
