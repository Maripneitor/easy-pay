import React from 'react';
import { ScrollView, View, Text, Pressable, SafeAreaView, Dimensions } from 'react-native';
import { router, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]" edges={['top', 'bottom']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Subtle background */}
            <View className="absolute inset-0 bg-[#0f172a]" />
            
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, paddingVertical: 20, paddingHorizontal: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Logo & Brand */}
                <View className="flex-row items-center gap-2 mb-12">
                    <View className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center shadow-lg shadow-blue-500/30">
                        <MaterialIcons name="account-balance-wallet" size={24} color="white" />
                    </View>
                    <Text className="text-white text-2xl font-black tracking-tighter italic">Easy-Pay</Text>
                </View>

                {/* Hero Section */}
                <View className="flex-1 justify-center items-center py-6">
                    <View className="items-center mb-8 w-full">
                        <Text className="text-white text-4xl font-black tracking-tighter text-center leading-none mb-4">
                            Divide tus gastos,{'\n'}
                            <Text className="text-blue-500">sin dramas.</Text>
                        </Text>
                        <Text className="text-slate-400 text-lg text-center max-w-[300px] leading-6">
                            La forma más rápida y elegante de organizar cuentas grupales.
                        </Text>
                    </View>

                    {/* Minimalist Illustration */}
                    <View className="w-full h-64 items-center justify-center relative">
                        <View className="w-48 h-48 bg-blue-600/5 rounded-full border border-blue-500/10 items-center justify-center">
                            <MaterialIcons name="groups" size={80} color="#3b82f6" opacity={0.5} />
                        </View>
                        
                        {/* Floating elements */}
                        <View className="absolute top-0 right-10 bg-slate-800 border border-white/10 p-4 rounded-3xl shadow-2xl">
                            <MaterialIcons name="restaurant" size={24} color="#f97316" />
                        </View>
                        <View className="absolute bottom-4 left-10 bg-slate-800 border border-white/10 p-4 rounded-3xl shadow-2xl">
                            <MaterialIcons name="receipt" size={24} color="#10b981" />
                        </View>
                    </View>
                </View>

                {/* Bottom Part */}
                <View className="mt-auto gap-4 py-8">
                    <Pressable 
                        onPress={() => router.push('/auth')}
                        className="w-full bg-blue-600 py-5 rounded-2xl items-center shadow-2xl shadow-blue-500/30 active:scale-95"
                    >
                        <Text className="text-white font-black text-lg uppercase tracking-widest">Comenzar Ahora</Text>
                    </Pressable>
                    
                    <Pressable 
                        onPress={() => router.push('/(tabs)/dashboard')}
                        className="w-full bg-slate-800/50 border border-white/5 py-5 rounded-2xl items-center active:bg-slate-700"
                    >
                        <Text className="text-slate-300 font-bold">Ver demostración</Text>
                    </Pressable>

                    <Text className="text-slate-600 text-center text-[10px] font-bold uppercase tracking-widest mt-6">
                        Desarrollado con ♥ por EASY-PAY • 2024
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
