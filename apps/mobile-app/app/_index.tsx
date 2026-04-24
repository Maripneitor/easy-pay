import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image as RNImage,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';

import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const COLORS = {
  backgroundDark: '#0D47A1',
  oceanDeep: '#1565C0',
  brilliantAzure: '#1E88E5',
  dodgerBlue: '#2196F3',
  coolSky: '#64B5F6',
  aliceBlue: '#E3F2FD',
  neonViolet: '#a855f7',
  emerald: '#6ee7b7',
};

export default function AppMain() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(tabs)/' as any);
    }
  }, [user, isLoading]);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleProfilePress = () => {
    if (user) {
      router.push('/(tabs)/settings' as any);
    } else {
      router.push('/login' as any);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.backgroundDark, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.backgroundDark }}>
      <StatusBar style="light" />

      {/* Fondo con degradado radial simulado */}
      <LinearGradient
        colors={[COLORS.brilliantAzure, COLORS.backgroundDark]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 1 }}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroundDark }} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        >

          {/* Navbar */}
          <View className="px-6 py-6 flex-row justify-between items-center z-50">
            <View className="flex-row items-center gap-2">
              <RNImage
                source={require('../assets/images/logo-ep.png')}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
              <Text className="text-2xl font-bold text-white tracking-tight">Easy-Pay</Text>
            </View>
            <TouchableOpacity
              onPress={handleProfilePress}
              className="bg-white/10 px-6 py-2 rounded-full border border-white/20"
            >
              <Text className="text-white font-bold text-sm">{user ? 'Mi Perfil' : 'Iniciar Sesión'}</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Section */}
          <View className="px-6 pt-12 pb-16 relative overflow-hidden">
            {/* Elementos Decorativos Flotantes */}
            <MotiView
              from={{ translateY: -10, rotate: '0deg' }}
              animate={{ translateY: 10, rotate: '5deg' }}
              transition={{ loop: true, type: 'timing', duration: 4000 } as any}
              style={{ position: 'absolute', top: 40, right: -20, opacity: 0.2 }}
            >
              <MaterialCommunityIcons name="currency-usd" size={100} color="white" />
            </MotiView>
            <MotiView
              from={{ translateY: 10, rotate: '0deg' }}
              animate={{ translateY: -10, rotate: '-10deg' }}
              transition={{ loop: true, type: 'timing', duration: 5000, delay: 500 } as any}
              style={{ position: 'absolute', bottom: 100, left: -30, opacity: 0.15 }}
            >
              <Ionicons name="restaurant" size={80} color="white" />
            </MotiView>

            <MotiText
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 800 }}
              className="text-5xl font-black text-white leading-[55px] mb-6 shadow-sm"
            >
              La cuenta,{'\n'}
              dividida en{'\n'}
              <Text style={{ color: COLORS.coolSky }}>segundos</Text>.
            </MotiText>
            <MotiText
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1000, delay: 500 }}
              className="text-lg text-white/80 font-light leading-7 mb-10 max-w-[90%]"
            >
              Cero estrés. Escanea, asigna y paga tu parte. Olvídate de las calculadoras y disfruta de la sobreGrupo.
            </MotiText>

            {/* Availability Badge */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1200, type: 'spring' } as any}
              className="bg-sky-400/10 border border-sky-400/20 px-5 py-2.5 rounded-full flex-row items-center gap-3 self-start mb-8"
            >
              <Text className="text-base">✨</Text>
              <Text style={{ color: COLORS.coolSky }} className="font-bold tracking-wide uppercase text-[10px]">Ahora disponible en Android</Text>
            </MotiView>
          </View>

          {/* Pain Points Section */}
          <View className="px-6 py-20 bg-[#0D47A1]">
            <Text className="text-3xl font-bold text-white text-center mb-4">
              El dolor de cabeza de la cuenta
            </Text>
            <Text className="text-3xl font-bold text-cool-sky/60 text-center mb-12">
              ya es historia
            </Text>

            <View className="gap-4">
              {[
                { icon: 'calculate', title: 'Calculadora infernal', desc: '¿Quién pidió qué? Deja de hacer sumas en servilletas.' },
                { icon: 'forum', title: 'Discusiones incómodas', desc: '"Yo solo comí una ensalada". Evita el drama de pagar lo justo.' },
                { icon: 'payments', title: 'Problemas de Propina', desc: 'Calcula la propina justa automáticamente, sin regatear.' },
                { icon: 'timer-off', title: 'Tiempo perdido', desc: 'Pagar debería tomar segundos, no 20 minutos esperando.' }
              ].map((item, index) => (
                <View key={index} className="bg-white/5 p-6 rounded-2xl border-l-4 border-l-purple-500 border border-white/10">
                  <View className="w-12 h-12 bg-purple-500/20 rounded-full items-center justify-center mb-4">
                    <MaterialIcons name={item.icon as any} size={24} color="#a855f7" />
                  </View>
                  <Text className="text-white font-bold text-xl mb-1">{item.title}</Text>
                  <Text className="text-white/70 leading-5">{item.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* How it Works Section */}
          <LinearGradient colors={[COLORS.oceanDeep, COLORS.brilliantAzure]} className="px-6 py-20">
            <View className="items-center mb-12">
              <Text className="text-white/60 font-bold tracking-widest uppercase text-xs mb-2">Paso a paso</Text>
              <Text className="text-4xl font-bold text-white">Cómo funciona</Text>
            </View>

            <View className="gap-12">
              {[
                { step: '1', title: 'Escanear', desc: 'Sube una foto del ticket o introduce el código QR del grupo.', icon: 'qr-code-scanner' },
                { step: '2', title: 'Asignar', desc: 'Toca tus platos o divídelos entre varios comensales.', icon: 'touch-app' },
                { step: '3', title: 'Calcular', desc: 'Impuestos y propinas se calculan al instante.', icon: 'auto-graph' },
                { step: '4', title: 'Pagar', desc: 'Paga tu parte con un click desde tu móvil.', icon: 'check-circle' }
              ].map((item, index) => (
                <View key={index} className="items-center text-center">
                  <View className="w-16 h-16 bg-[#0D47A1] border-4 border-cool-sky rounded-full items-center justify-center mb-6 shadow-lg">
                    <Text className="text-xl font-black text-white">{item.step}</Text>
                  </View>
                  <Text className="text-2xl font-bold text-white mb-2">{item.title}</Text>
                  <Text className="text-white/70 text-center leading-5 px-8">{item.desc}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* FAQ */}
          <View className="px-6 py-20 bg-[#0D47A1]">
            <Text className="text-3xl font-bold text-white text-center mb-12">Preguntas Frecuentes</Text>
            <View className="gap-4">
              {[
                { q: '¿Es seguro pagar?', a: 'Absolutamente. Utilizamos encriptación de grado bancario para proteger todos tus datos y transacciones.' },
                { q: '¿Necesito la app?', a: 'No necesariamente. Puedes usar nuestra versión web directamente desde tu navegador.' },
                { q: '¿Puedo dividir desigual?', a: '¡Sí! Puedes asignar items específicos a cada persona como prefieras.' }
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleFaq(index)}
                  className="bg-white/5 p-6 rounded-2xl border border-white/10"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-bold text-lg">{item.q}</Text>
                    <MotiView
                      animate={{ rotate: expandedFaq === index ? '180deg' : '0deg' }}
                    >
                      <Ionicons name="chevron-down" size={20} color={COLORS.coolSky} />
                    </MotiView>
                  </View>
                  {expandedFaq === index && (
                    <MotiView
                      from={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Text className="text-white/60 leading-5 pt-2">{item.a}</Text>
                    </MotiView>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Final CTA */}
          <View className="px-6 py-16 bg-[#0A387E]">
            <View className="bg-white/5 p-10 rounded-[40px] border border-white/20 items-center">
              <Text className="text-3xl font-black text-white text-center mb-4">¡Empieza a dividir sin dramas!</Text>
              <Text className="text-white/70 text-center mb-10 leading-6">
                Únete a miles de comensales felices que ya no sufren con la cuenta.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/login' as any)}
                className="bg-dodger-blue px-10 py-5 rounded-full shadow-xl"
              >
                <Text className="text-white font-black text-lg">COMENZAR GRATIS</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white/20 text-center text-xs mt-12">© 2026 Easy-Pay. Divide y vencerás.</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}