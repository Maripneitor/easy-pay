import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FriendsScreen() {
  // Datos falsos (Mock data) solo para ver el diseño frontend
  const friendsMock = [
    { id: '1', name: 'Carlos López', balance: 150, status: 'Te debe' },
    { id: '2', name: 'Ana Martínez', balance: -50, status: 'Le debes' },
    { id: '3', name: 'Roberto Gómez', balance: 0, status: 'Al día' },
  ];

  return (
    <View className="flex-1 bg-gray-50 pt-12 px-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-gray-900">Amigos</Text>
        <TouchableOpacity className="bg-blue-100 p-2 rounded-full">
          <Ionicons name="person-add" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View className="flex-row items-center bg-white px-4 py-3 rounded-2xl shadow-sm mb-6 border border-gray-100">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput 
          placeholder="Buscar un amigo..." 
          className="flex-1 ml-3 text-base text-gray-700"
        />
      </View>

      {/* Lista de Amigos */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {friendsMock.map((friend) => (
          <TouchableOpacity 
            key={friend.id} 
            className="flex-row items-center bg-white p-4 rounded-2xl shadow-sm mb-3 border border-gray-100"
          >
            {/* Avatar */}
            <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mr-4">
              <Text className="text-blue-600 font-bold text-lg">
                {friend.name.charAt(0)}
              </Text>
            </View>

            {/* Info */}
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">{friend.name}</Text>
              <Text className={`text-sm ${
                friend.balance > 0 ? 'text-green-500' : 
                friend.balance < 0 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {friend.status} {friend.balance !== 0 && `$${Math.abs(friend.balance)}`}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
