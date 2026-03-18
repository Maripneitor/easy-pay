import { Tabs } from 'expo-router';
import { View, Platform, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@easy-pay/ui';
import { useColorScheme } from '../../components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: '#1e293b', // Fondo oscuro premium
          borderRadius: 25,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#2196F3',
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 20,
          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.05)',
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialIcons name="dashboard" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Amigos',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialIcons name="people" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="group"
        options={{
          title: 'Grupos',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialIcons name="group-work" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Cartera',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialIcons name="account-balance-wallet" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialIcons name="notifications" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen name="two" options={{ href: null }} />
      <Tabs.Screen name="group/[id]" options={{ href: null }} />
    </Tabs>

  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    shadowColor: '#2196F3',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  }
});

