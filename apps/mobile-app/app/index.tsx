import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function LandingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.backgroundDark }}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Fondo con degradado radial simulado */}
      <LinearGradient
        colors={[COLORS.brilliantAzure, COLORS.backgroundDark]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 1 }}
      />

      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Navbar */}
          <View className="px-6 py-6 flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-lg">
                <MaterialIcons name="receipt-long" size={24} color={COLORS.dodgerBlue} />
              </View>
              <Text className="text-2xl font-bold text-white tracking-tight">Easy-Pay</Text>
            </View>
            <TouchableOpacity className="bg-white/10 px-6 py-2 rounded-full border border-white/20">
              <Text className="text-white font-bold text-sm">Mi Perfil</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Section */}
          <View className="px-6 pt-12 pb-16">
            <Text className="text-5xl font-black text-white leading-[55px] mb-6 shadow-sm">
              La cuenta,{'\n'}
              dividida en{'\n'}
              <Text className="text-cool-sky">segundos</Text>.
            </Text>
            <Text className="text-lg text-white/80 font-light leading-7 mb-10 max-w-[90%]">
              Cero estrés. Escanea, asigna y paga tu parte. Olvídate de las calculadoras y disfruta de la sobremesa.
            </Text>

            {/* Action Cards */}
            <View className="flex-row gap-4 mb-8">
              <View className="flex-1 bg-white/5 border border-white/20 p-5 rounded-3xl">
                <View className="flex-row items-center gap-2 mb-3">
                  <Ionicons name="add-circle" size={24} color={COLORS.coolSky} />
                  <Text className="text-white font-bold text-base">Nueva Mesa</Text>
                </View>
                <Text className="text-white/60 text-xs mb-5">Eres el anfitrión. Crea un código.</Text>
                <TouchableOpacity 
                  onPress={() => router.push('/(tabs)/dashboard')}
                  className="bg-dodger-blue py-3 rounded-xl items-center shadow-lg shadow-blue-900/40"
                >
                  <Text className="text-white font-bold">Crear Mesa</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-1 bg-white/5 border border-white/20 p-5 rounded-3xl">
                <View className="flex-row items-center gap-2 mb-3">
                  <Ionicons name="people" size={24} color={COLORS.emerald} />
                  <Text className="text-white font-bold text-base">Unirme</Text>
                </View>
                <Text className="text-white/60 text-xs mb-5">¿Tienes código? Únete ya.</Text>
                <TouchableOpacity 
                  onPress={() => router.push('/(tabs)/dashboard')}
                  className="bg-white py-3 rounded-xl items-center shadow-lg shadow-white/10"
                >
                  <Text className="text-dodger-blue font-bold">Unirme</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="bg-white/5 border border-white/10 px-5 py-3 rounded-full flex-row items-center gap-3 self-start">
              <Text className="text-lg">💡</Text>
              <Text className="text-white/70 text-xs">El anfitrión crea la mesa y comparte el código.</Text>
            </View>
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
                { step: '1', title: 'Escanear', desc: 'Sube una foto del ticket o introduce el código QR de la mesa.', icon: 'qr-code-scanner' },
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

          {/* Testimonials */}
          <View className="px-6 py-20 bg-[#0D47A1]">
            <Text className="text-3xl font-bold text-white text-center mb-12">Lo que dicen nuestros expertos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={width * 0.8 + 16} decelerationRate="fast">
              {[
                { name: 'Carlos M.', quote: 'Increíblemente fácil de usar. Ya no hay discusiones incómodas.' },
                { name: 'Sofia R.', quote: 'La mejor app para salir con amigos. Calculamos la propina en segundos.' },
                { name: 'Javier L.', quote: 'Me encanta pagar solo por lo que consumí. ¡Adiós a dividir en partes iguales!' }
              ].map((item, index) => (
                <View key={index} style={{ width: width * 0.8 }} className="bg-white/5 p-8 rounded-3xl border border-white/10 mr-4 items-center">
                   <View className="w-16 h-16 bg-gray-400 rounded-full mb-4 border-2 border-cool-sky items-center justify-center">
                     <Ionicons name="person" size={32} color="white" />
                   </View>
                   <View className="flex-row gap-1 mb-4">
                     {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={14} color="#facc15" />)}
                   </View>
                   <Text className="text-white/80 italic text-center text-lg mb-6">"{item.quote}"</Text>
                   <Text className="text-white font-bold">{item.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* FAQ */}
          <View className="px-6 py-20 bg-[#0D47A1]">
            <Text className="text-3xl font-bold text-white text-center mb-12">Preguntas Frecuentes</Text>
            <View className="gap-4">
              {[
                { q: '¿Es seguro pagar?', a: 'Absolutamente. Utilizamos encriptación de grado bancario.' },
                { q: '¿Necesito la app?', a: 'No necesariamente, pero ofrece funciones adicionales como histórico.' },
                { q: '¿Puedo dividir desigual?', a: '¡Sí! Puedes asignar items específicos a cada persona.' }
              ].map((item, index) => (
                <View key={index} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-bold text-lg">{item.q}</Text>
                    <Ionicons name="chevron-down" size={20} color={COLORS.coolSky} />
                  </View>
                  <Text className="text-white/60 leading-5">{item.a}</Text>
                </View>
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
                onPress={() => router.push('/(tabs)/dashboard')}
                className="bg-dodger-blue px-10 py-5 rounded-full shadow-xl shadow-blue-500/40"
              >
                <Text className="text-white font-black text-lg">COMENZAR GRATIS</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white/20 text-center text-xs mt-12">© 2023 Easy-Pay. Divide y vencerás.</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

