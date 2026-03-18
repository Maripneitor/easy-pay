import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettleUpScreen() {
  const [amount, setAmount] = useState('');

  return (
    <View className="flex-1 bg-gray-50 px-6 pt-12">
      {/* Header */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="p-2 bg-white rounded-full shadow-sm mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">Liquidar Deuda</Text>
      </View>

      {/* Target User Info */}
      <View className="bg-white p-6 rounded-3xl shadow-sm mb-6 items-center">
        <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="person" size={32} color="#3b82f6" />
        </View>
        <Text className="text-gray-500 text-base mb-1">Estás pagando a</Text>
        <Text className="text-xl font-bold text-gray-900">Grupo: Nexium S.A.S.</Text>
      </View>

      {/* Amount Input */}
      <View className="mb-8">
        <Text className="text-gray-500 text-sm font-semibold mb-2 ml-2">MONTO A PAGAR</Text>
        <View className="flex-row items-center bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-2xl font-bold text-gray-400 mr-2">$</Text>
          <TextInput
            className="flex-1 text-3xl font-bold text-gray-900"
            keyboardType="numeric"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>
      </View>

      {/* Payment Methods */}
      <View className="mb-8">
        <Text className="text-gray-500 text-sm font-semibold mb-2 ml-2">MÉTODO DE PAGO</Text>
        <TouchableOpacity className="flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-sm mb-3 border border-gray-100">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="cash" size={20} color="#10b981" />
            </View>
            <Text className="font-semibold text-gray-700">Efectivo</Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        className="bg-blue-600 py-4 rounded-2xl items-center shadow-md mt-auto mb-8"
        onPress={() => {
          // Aquí irá la lógica de pago
          alert(`Pago de $${amount} registrado`);
          router.back();
        }}
      >
        <Text className="text-white font-bold text-lg">Confirmar Pago</Text>
      </TouchableOpacity>
    </View>
  );
}
