import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet, Image as RNImage } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
// import { MotiView, MotiText } from 'moti';
// import { Skeleton } from 'moti/skeleton';
const MotiView = View as any;
const MotiText = Text as any;

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
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Navbar */}
          <View className="px-6 py-6 flex-row justify-between items-center z-50">
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
          <View className="px-6 pt-12 pb-16 relative overflow-hidden">
            {/* Elementos Decorativos Flotantes */}
            <MotiView
              from={{ translateY: -10, rotate: '0deg' }}
              animate={{ translateY: 10, rotate: '5deg' }}
              transition={{ loop: true, type: 'timing', duration: 4000 }}
              style={{ position: 'absolute', top: 40, right: -20, opacity: 0.2 }}
            >
              <MaterialCommunityIcons name="currency-usd" size={100} color="white" />
            </MotiView>
            <MotiView
              from={{ translateY: 10, rotate: '0deg' }}
              animate={{ translateY: -10, rotate: '-10deg' }}
              transition={{ loop: true, type: 'timing', duration: 5000, delay: 500 }}
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
              Cero estrés. Escanea, asigna y paga tu parte. Olvídate de las calculadoras y disfruta de la sobremesa.
            </MotiText>

            {/* Action Cards */}
            <View className="flex-row gap-4 mb-8">
              <View className="flex-1 bg-white/5 border border-white/20 p-5 rounded-3xl">
                <View className="flex-row items-center gap-2 mb-3">
                  <Ionicons name="add-circle" size={24} color={COLORS.coolSky} />
                  <Text className="text-white font-bold text-base">Nueva Mesa</Text>
                </View>
                <Text className="text-white/60 text-xs mb-5">Eres el anfitrión. Crea un código.</Text>
                <TouchableOpacity 
                  onPress={() => router.push('/auth')}
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
                  onPress={() => router.push('/auth')}
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
            <Text className="text-3xl font-bold text-white text-center mb-12">Lo que dicen nuestros usuarios</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={width * 0.8 + 16} decelerationRate="fast">
              {[
                { name: 'Carlos M.', quote: 'Increíblemente fácil de usar. Ya no hay discusiones incómodas.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDainCyPQs2p8Eeuu3PGJLemedOuJ3mpJvuzcJASmmrFTiVCoj22mihB_NzIc8G9W5JCqk9Y8Fuy8Kd7UKSQwv6ATBYcmeM_7Vi93SCphJ5DZkgm_HNiUeWg7GHt5PWYEVCa3hlTEyradWkryGGm3zucv_L5yDFRA8FCCfcDVwWL1mZ0HX6lzamzqXhEdehkKTUkzR96RBsCpMCUtWjuJmPQcwpqH3f1MrJCFsO7Rpm5IRJIVnf7Gg2ams1kdv3fK11x4bYJ1xpZBid' },
                { name: 'Sofia R.', quote: 'La mejor app para salir con amigos. Calculamos la propina en segundos.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq9Z-pK4VHG9jpMzu4OF7LWRJ21XplOxmtUFVYf0kwJZShmTajlh8Lz9zcV567aJDXcr1hG8WUPhd12Cwp2Tm-K1pdXamNOMITQ_hRGpQHIQQAWPJJXxIV0dcJSaBxMYOSfj8fIyrVEY5o2wwYlvdCWemXMB_6hIaP1xRC58VbkdAuTDR8tI2GzM2_J3IGxP34by8ULPk2rLiXMrRxNC79ylXrY0ky928t7r1YuQ5nvOKqF--y1jVM6b4bzB72-KhJqZG62BM_r8-U' },
                { name: 'Javier L.', quote: 'Me encanta pagar solo por lo que consumí. ¡Adiós a dividir en partes iguales!', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqJjrs0fkwpw2ovn5Cg-2iLba3PLCVoIy5rbhebJ5EbMI7X1eBPqasof8aJR4igDEku9JIXkFh8L81PcMsqM1AMz9KoJznCwwvYWNMVRuRiJS_NdkqLTgA00bxsg1w1joaDUnLRXTS71YmroDPieXUFJwKr5lN-lIhaOaPqcex6eKvnmERpJEG7f9ApEpkAI9IMQU-lSgBQMjonDUSAfb1VYDWQ4PPS9C7CIXUtgSSF2RNZZbc7rqH8iZFNK6B5TlWm7mmRf3OBq9Y' }
              ].map((item, index) => (
                <View key={index} style={{ width: width * 0.8 }} className="bg-white/5 p-8 rounded-3xl border border-white/10 mr-4 items-center">
                   <View className="w-16 h-16 bg-gray-400 rounded-full mb-4 border-2 border-cool-sky items-center justify-center overflow-hidden">
                     {item.avatar ? (
                       <RNImage source={{ uri: item.avatar }} style={{ width: '100%', height: '100%' }} />
                     ) : (
                       <Ionicons name="person" size={32} color="white" />
                     )}
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

          {/* ¿Por qué elegir Easy-Pay? / Comparativa */}
          <View className="px-6 py-20 bg-[#0D47A1]">
            <Text className="text-3xl font-bold text-white text-center mb-12">
              ¿Por qué elegir Easy-Pay?
            </Text>
            
            <View className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
              <View className="flex-row border-b border-white/10 p-4 bg-white/5">
                <View className="flex-[1.5]"><Text className="text-white/40 text-xs font-bold uppercase">Características</Text></View>
                <View className="flex-1 items-center"><Text className="text-white/40 text-xs font-bold uppercase text-center">Tradicional</Text></View>
                <View className="flex-1 items-center"><Text className="text-white/40 text-xs font-bold uppercase text-center">Easy-Pay</Text></View>
              </View>

              {[
                { label: 'Tiempo de cobro', trad: '15-25 min', easy: '< 2 min', green: true },
                { label: 'Precisión', trad: false, border: true, easy: true },
                { label: 'Pago contactless', trad: false, easy: true },
                { label: 'Historial', trad: false, easy: true },
              ].map((row, i) => (
                <View key={i} className="flex-row p-5 border-b border-white/5 items-center">
                  <View className="flex-[1.5]">
                    <Text className="text-white font-medium text-sm">{row.label}</Text>
                  </View>
                  <View className="flex-1 items-center">
                    {typeof row.trad === 'string' ? (
                      <Text className="text-white/60 text-xs">{row.trad}</Text>
                    ) : (
                      <Ionicons name="close-circle" size={20} color="#f87171" />
                    )}
                  </View>
                  <View className="flex-1 items-center bg-blue-500/10 rounded-lg py-2">
                    {typeof row.easy === 'string' ? (
                      <Text className="text-emerald text-xs font-bold">{row.easy}</Text>
                    ) : (
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.emerald} />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* FAQ */}
          <View className="px-6 py-20 bg-[#0D47A1]">
            <Text className="text-3xl font-bold text-white text-center mb-12">Preguntas Frecuentes</Text>
            <View className="gap-4">
              {[
                { q: '¿Es seguro pagar?', a: 'Absolutamente. Utilizamos encriptación de grado bancario para proteger todos tus datos y transacciones. Tu seguridad es nuestra prioridad.' },
                { q: '¿Necesito la app?', a: 'No necesariamente. Puedes usar nuestra versión web directamente desde tu navegador escaneando el código QR. Sin embargo, la app ofrece funciones adicionales.' },
                { q: '¿Puedo dividir desigual?', a: '¡Sí! Puedes asignar items específicos a cada persona o dividir el costo de platos compartidos como prefieras.' }
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
                      transition={{ type: 'timing', duration: 300 }}
                    >
                      <Ionicons name="chevron-down" size={20} color={COLORS.coolSky} />
                    </MotiView>
                  </View>
                  {expandedFaq === index && (
                    <MotiView
                      from={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ type: 'timing', duration: 300 }}
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
                onPress={() => router.push('/auth')}
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

