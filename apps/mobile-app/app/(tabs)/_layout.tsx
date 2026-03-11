import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
            backgroundColor: '#0f172a',
            borderTopColor: '#1e293b',
            borderTopWidth: 1,
            height: 64 + insets.bottom,
            paddingBottom: insets.bottom,
            position: 'absolute',
            elevation: 0,
        }
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Mesa',
          tabBarIcon: ({ focused }) => (
            <View className={`items-center justify-center p-3 rounded-2xl transition-all duration-200 ${focused ? 'bg-blue-500/20 shadow-lg shadow-blue-500/20' : 'bg-transparent'}`}>
                <MaterialIcons name="restaurant" size={26} color={focused ? '#3b82f6' : '#64748b'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Historial',
          tabBarIcon: ({ focused }) => (
            <View className={`items-center justify-center p-3 rounded-2xl transition-all duration-200 ${focused ? 'bg-blue-500/20 shadow-lg shadow-blue-500/20' : 'bg-transparent'}`}>
                <MaterialIcons name="history" size={26} color={focused ? '#3b82f6' : '#64748b'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Pagos',
          tabBarIcon: ({ focused }) => (
            <View className={`items-center justify-center p-3 rounded-2xl transition-all duration-200 ${focused ? 'bg-blue-500/20 shadow-lg shadow-blue-500/20' : 'bg-transparent'}`}>
                <MaterialIcons name="account-balance-wallet" size={26} color={focused ? '#3b82f6' : '#64748b'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ focused }) => (
            <View className={`items-center justify-center p-3 rounded-2xl transition-all duration-200 ${focused ? 'bg-blue-500/20 shadow-lg shadow-blue-500/20' : 'bg-transparent'}`}>
                <MaterialIcons name="notifications" size={26} color={focused ? '#3b82f6' : '#64748b'} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
