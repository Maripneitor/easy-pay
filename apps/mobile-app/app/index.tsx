import React from 'react';
import { ScrollView, View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/StitchTheme';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function LandingScreen() {

    const handleGetStarted = () => {
        router.push('/auth');
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
            >
                {/* HERO NAV */}
                <View className="flex-row items-center justify-between p-6 bg-transparent">
                    <View className="flex-row items-center gap-3 bg-transparent">
                        <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-2xl shadow-blue-500/20">
                            <MaterialIcons name="receipt-long" size={28} color={Colors.dodgerBlue} />
                        </View>
                        <Text className="font-black text-3xl text-white tracking-tighter">Easy-Pay</Text>
                    </View>
                    <Pressable 
                        onPress={() => router.push('/auth')}
                        className="bg-white/10 px-6 py-2.5 rounded-full border border-white/20 active:bg-white/20"
                    >
                        <Text className="text-white font-bold text-sm">Entrar</Text>
                    </Pressable>
                </View>

                {/* HERO SECTION */}
                <View className="px-8 py-12 items-start bg-transparent">
                    <View className="bg-blue-400/10 px-4 py-1.5 rounded-full border border-blue-400/20 mb-6">
                        <Text className="text-blue-300 font-bold text-[10px] uppercase tracking-widest">v2.0 Beta • Premium Split</Text>
                    </View>
                    <Text className="text-6xl font-black text-white mb-6 leading-[55px] tracking-tighter">
                        La cuenta,{'\n'}dividida en{'\n'}
                        <Text className="text-blue-400">segundos.</Text>
                    </Text>
                    <Text className="text-lg text-slate-300/90 mb-12 leading-relaxed font-medium">
                        Cero estrés. Escanea, asigna y paga tu parte. Olvídate de las calculadoras y disfruta de la sobremesa.
                    </Text>

                    <View className="w-full gap-5 bg-transparent">
                        <Pressable 
                            onPress={() => router.push('/create-group')}
                            className="bg-white/5 border border-white/10 p-7 rounded-[35px] flex-row items-center justify-between active:bg-white/10 shadow-2xl"
                        >
                            <View className="bg-transparent">
                                <View className="flex-row items-center gap-3 mb-2 bg-transparent">
                                    <View className="bg-blue-500/20 p-2 rounded-xl">
                                        <MaterialIcons name="add-circle" size={24} color={Colors.coolSky} />
                                    </View>
                                    <Text className="text-xl font-black text-white">Nueva Mesa</Text>
                                </View>
                                <Text className="text-slate-400 font-medium">Eres el anfitrión. Crea un código.</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={28} color="#475569" />
                        </Pressable>

                        <Pressable 
                            onPress={() => router.push('/(tabs)/dashboard')}
                            className="bg-white/5 border border-white/10 p-7 rounded-[35px] flex-row items-center justify-between active:bg-white/10 shadow-2xl"
                        >
                            <View className="bg-transparent">
                                <View className="flex-row items-center gap-3 mb-2 bg-transparent">
                                    <View className="bg-emerald-500/20 p-2 rounded-xl">
                                        <MaterialIcons name="group-add" size={24} color="#6EE7B7" />
                                    </View>
                                    <Text className="text-xl font-black text-white">Unirme</Text>
                                </View>
                                <Text className="text-slate-400 font-medium">¿Tienes código? Únete ya.</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={28} color="#475569" />
                        </Pressable>
                    </View>
                </View>

                {/* Mockup Receipt - VISUAL DEL OBJETIVO */}
                <View className="items-center py-12 px-6 bg-transparent my-6">
                    <View className="w-[85%] bg-white rounded-t-[40px] rounded-b-[20px] shadow-3xl overflow-hidden pt-8 pb-10 border border-slate-200">
                        <View className="items-center border-b border-slate-100 border-dashed pb-6 mb-6 px-10">
                            <View className="w-14 h-14 bg-slate-50 rounded-full items-center justify-center mb-4">
                                <MaterialIcons name="restaurant" size={24} color="#64748b" />
                            </View>
                            <Text className="text-slate-900 font-black text-xl mb-1">Cena Grill</Text>
                            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">Mesa #12 • 21:45 PM</Text>
                        </View>
                        <View className="px-10">
                            <View className="flex-row justify-between mb-4">
                                <Text className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Platillo</Text>
                                <Text className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Monto</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-4 bg-transparent">
                                <Text className="text-slate-800 font-bold text-base">Hamburguesa Pro</Text>
                                <Text className="text-slate-900 font-black text-base">$15.00</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-4 bg-transparent">
                                <Text className="text-slate-800 font-bold text-base">Cervezas Artesanales</Text>
                                <Text className="text-slate-900 font-black text-base">$18.00</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-6 bg-transparent">
                                <Text className="text-slate-800 font-bold text-base">Nachos Suizos</Text>
                                <Text className="text-slate-900 font-black text-base">$12.00</Text>
                            </View>
                            <View className="border-t-2 border-slate-50 border-dashed my-4" />
                            <View className="flex-row justify-between items-center mt-4 bg-transparent">
                                <Text className="text-slate-900 font-black text-2xl tracking-tighter">TOTAL</Text>
                                <Text className="text-blue-600 font-black text-2xl tracking-tighter">$45.00</Text>
                            </View>
                        </View>
                        <View className="items-center mt-10">
                            <MaterialIcons name="qr-code-scanner" size={50} color="#f1f5f9" />
                        </View>
                    </View>
                </View>

                {/* Steps Section - CÓMO FUNCIONA */}
                <View className="px-8 py-16 bg-slate-900/50 mt-10 border-t border-white/5">
                    <Text className="text-blue-400 font-black tracking-[5px] uppercase text-[10px] mb-4 text-center">Fácil y Rápido</Text>
                    <Text className="text-4xl font-black text-white text-center mb-14 tracking-tight">Cómo funciona</Text>
                    
                    <View className="gap-10 bg-transparent">
                        {[{
                            n: 1, title: 'Escanear', desc: 'Sube una foto del ticket o escanea el QR de la mesa.', icon: 'qr-code-scanner', color: '#60a5fa'
                        },
                        {
                            n: 2, title: 'Asignar', desc: 'Toca tus platos o divídelos entre varios amigos.', icon: 'touch-app', color: '#34d399'
                        },
                        {
                            n: 3, title: 'Calcular', desc: 'Impuestos y propinas se calculan automáticamente.', icon: 'calculate', color: '#fbbf24'
                        },
                        {
                            n: 4, title: 'Pagar', desc: 'Paga tu parte con un click desde tu móvil.', icon: 'payments', color: '#f87171'
                        }].map((step, idx) => (
                            <View key={idx} className="flex-row items-start gap-6 bg-white/5 p-8 rounded-[35px] border border-white/10 shadow-sm">
                                <View className="w-14 h-14 bg-slate-800 rounded-2xl items-center justify-center border border-white/10 shadow-xl" style={{ borderLeftWidth: 4, borderLeftColor: step.color }}>
                                    <Text className="font-black text-white text-2xl">{step.n}</Text>
                                </View>
                                <View className="flex-1 bg-transparent">
                                    <Text className="text-xl font-black text-white mb-2">{step.title}</Text>
                                    <Text className="text-slate-400 font-medium leading-6">{step.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* FINAL CTA - CURADURÍA DE INFORMACIÓN */}
                <View className="py-24 px-10 items-center bg-transparent">
                    <Text className="text-4xl font-black text-white text-center mb-6 tracking-tight leading-tight">
                        ¡Empieza a dividir{'\n'}sin dramas hoy!
                    </Text>
                    <Text className="text-slate-400 text-center mb-12 px-2 font-medium leading-relaxed">
                        Únete a miles de personas que ya no sufren con la cuenta al final de la cena.
                    </Text>
                    <Pressable 
                        onPress={handleGetStarted}
                        className="bg-blue-600 px-12 py-6 rounded-[35px] shadow-3xl shadow-blue-500/50 active:scale-95 flex-row items-center gap-3"
                        style={{ backgroundColor: Colors.brilliantAzure }}
                    >
                        <Text className="text-white font-black text-xl uppercase tracking-widest">Crear cuenta gratis</Text>
                        <MaterialIcons name="arrow-forward" size={24} color="white" />
                    </Pressable>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
