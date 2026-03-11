import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* NAV */}
        <View className="flex-row items-center justify-between p-6">
          <View className="flex-row items-center gap-2">
            <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-lg">
              <MaterialIcons name="receipt-long" size={24} color="#2196F3" />
            </View>
            <Text className="font-bold text-2xl text-white">Easy-Pay</Text>
          </View>
          <TouchableOpacity className="bg-white/10 px-6 py-2 rounded-full border border-sky-blue/30">
            <Text className="text-alice-blue font-bold">Mi Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* HERO */}
        <View className="px-6 py-12 items-start">
          <Text className="text-5xl font-black text-alice-blue mb-4 leading-tight">
            La cuenta,{'\n'}dividida en{'\n'}segundos.
          </Text>
          <Text className="text-lg font-light text-alice-blue/90 mb-10">
            Cero estrés. Escanea, asigna y paga tu parte. Olvídate de las calculadoras y disfruta de la sobremesa.
          </Text>

          <View className="w-full gap-4 mb-4">
            <TouchableOpacity className="bg-white/5 border border-sky-blue/40 p-6 rounded-2xl flex-row items-center justify-between">
              <View>
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="add-circle" size={24} color="#64B5F6" />
                  <Text className="text-lg font-bold text-white">Nueva Mesa</Text>
                </View>
                <Text className="text-alice-blue/70">Eres el anfitrión. Crea un código.</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity className="bg-white/5 border border-sky-blue/40 p-6 rounded-2xl flex-row items-center justify-between">
              <View>
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="group-add" size={24} color="#6EE7B7" />
                  <Text className="text-lg font-bold text-white">Unirme</Text>
                </View>
                <Text className="text-alice-blue/70">¿Tienes código? Únete ya.</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mockup Receipt (Simplified for React Native) */}
        <View className="items-center py-10 px-6 my-4 bg-ocean-deep/20 rounded-3xl mx-4">
            <View className="w-56 bg-white rounded-t-lg rounded-b shadow-2xl overflow-hidden pt-4 pb-6">
               <View className="items-center border-b border-gray-300 border-dashed pb-4 mb-4">
                  <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-2">
                     <MaterialIcons name="storefront" size={20} color="#9ca3af" />
                  </View>
                  <View className="h-1.5 w-16 bg-gray-300 rounded mb-1" />
                  <View className="h-1.5 w-24 bg-gray-200 rounded" />
               </View>
               <View className="px-4">
                  <View className="flex-row justify-between mb-2">
                     <Text className="text-[10px] text-gray-400 uppercase font-bold">Item</Text>
                     <Text className="text-[10px] text-gray-400 uppercase font-bold">Precio</Text>
                  </View>
                  <View className="flex-row justify-between items-center mb-3">
                     <Text className="text-gray-800 font-bold text-sm">Hamburguesa</Text>
                     <Text className="text-gray-800 font-bold text-sm">$15.00</Text>
                  </View>
                  <View className="flex-row justify-between items-center mb-3">
                     <Text className="text-gray-800 font-bold text-sm">Cervezas x3</Text>
                     <Text className="text-gray-800 font-bold text-sm">$18.00</Text>
                  </View>
                  <View className="flex-row justify-between items-center mb-4">
                     <Text className="text-gray-800 font-bold text-sm">Nachos</Text>
                     <Text className="text-gray-800 font-bold text-sm">$12.00</Text>
                  </View>
                  <View className="border-t border-gray-300 border-dashed my-2" />
                  <View className="flex-row justify-between items-center mt-2">
                     <Text className="text-gray-900 font-black text-lg">TOTAL</Text>
                     <Text className="text-gray-900 font-black text-lg">$45.00</Text>
                  </View>
               </View>
               <View className="items-center mt-6">
                   <MaterialIcons name="qr-code-2" size={40} color="#e5e7eb" />
               </View>
            </View>
        </View>

        {/* Steps */}
        <View className="px-6 py-12 bg-ocean-deep/50 mt-10">
          <Text className="text-alice-blue/80 font-bold tracking-widest uppercase text-sm mb-2 text-center">Paso a paso</Text>
          <Text className="text-3xl font-bold text-white text-center mb-10">Cómo funciona</Text>
          
          <View className="gap-8">
             {[{
               n: 1, title: 'Escanear', desc: 'Sube una foto del ticket o introduce el código QR de la mesa.', icon: 'qr-code-scanner'
             },
             {
               n: 2, title: 'Asignar', desc: 'Toca tus platos o divídelos entre varios comensales.', icon: 'touch-app'
             },
             {
               n: 3, title: 'Calcular', desc: 'Impuestos y propinas se calculan al instante.', icon: 'calculate'
             },
             {
               n: 4, title: 'Pagar', desc: 'Paga tu parte con un click desde tu móvil.', icon: 'payments'
             }].map((step, idx) => (
               <View key={idx} className="flex-row items-start gap-4 bg-cobalt-blue/80 p-6 rounded-2xl border border-sky-blue/30">
                  <View className="w-12 h-12 bg-dodger-blue rounded-full items-center justify-center border-2 border-sky-blue">
                     <Text className="font-bold text-white text-xl">{step.n}</Text>
                  </View>
                  <View className="flex-1">
                     <Text className="text-xl font-bold text-white mb-1">{step.title}</Text>
                     <Text className="text-alice-blue/80 leading-5">{step.desc}</Text>
                  </View>
                  <View className="w-10 h-10 items-center justify-center rounded-full bg-white/5">
                     <MaterialIcons name={step.icon as any} size={20} color="#E3F2FD" />
                  </View>
               </View>
             ))}
          </View>
        </View>

        {/* CTA */}
        <View className="py-16 px-6 items-center flex-1">
           <Text className="text-3xl font-black text-white text-center mb-4">¡Empieza a dividir sin dramas!</Text>
           <Text className="text-alice-blue/80 text-center mb-8 px-4">Únete a miles de comensales felices que ya no sufren con la cuenta.</Text>
           <TouchableOpacity className="bg-dodger-blue px-8 py-4 rounded-full shadow-lg">
             <Text className="text-white font-bold text-lg">Crear cuenta gratis</Text>
           </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
