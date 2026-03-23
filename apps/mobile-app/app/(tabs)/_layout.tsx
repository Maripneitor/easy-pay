import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { useNotifications } from '../../src/infrastructure/context/NotificationContext';
import { MotiView } from 'moti';

const CustomTabBarButton = ({ children, onPress, theme }: any) => {
  const [isExpanding, setIsExpanding] = React.useState(false);

  const handlePress = () => {
    setIsExpanding(true);
    setTimeout(() => {
      onPress();
      setTimeout(() => setIsExpanding(false), 500); // Reset for next time
    }, 400);
  };

  return (
    <View style={{ alignItems: 'center' }}>
      {/* Background Expansion Circle */}
      {isExpanding && (
        <MotiView 
          from={{ scale: 0, opacity: 1 }}
          animate={{ scale: 20, opacity: 1 }}
          transition={{ type: 'timing', duration: 500 }}
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: theme.primary,
            zIndex: 1000,
            top: -40,
          }}
        />
      )}
      
      <TouchableOpacity
        style={{
          top: -20,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001,
          ...styles.shadow
        }}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <MotiView
          from={{ scale: 1, shadowOpacity: 0.3 }}
          animate={{ scale: [1, 1.05, 1], shadowOpacity: [0.3, 0.6, 0.3] }}
          transition={{ loop: true, type: 'timing', duration: 3000 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 4,
            borderColor: theme.bg,
          }}
        >
          {children}
        </MotiView>
      </TouchableOpacity>
    </View>
  );
};

export default function TabLayout() {
  const { theme } = useTheme();
  const { hasAlerts } = useNotifications();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: '#475569',
        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 95 : 75,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 10,
          position: 'absolute',
          elevation: 0,
          borderTopColor: 'transparent',
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <MotiView animate={{ scale: focused ? 1.2 : 1, translateY: focused ? -2 : 0 }}>
              <MaterialIcons name="grid-view" size={26} color={color} />
            </MotiView>
          ),
        }}
      />
      <Tabs.Screen
        name="group"
        options={{
          title: 'Grupos',
          tabBarIcon: ({ color, focused }) => (
            <MotiView animate={{ scale: focused ? 1.2 : 1, translateY: focused ? -2 : 0 }}>
              <MaterialIcons name="group-work" size={26} color={color} />
            </MotiView>
          ),
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => (
            <CustomTabBarButton theme={theme} {...props}>
              <MaterialIcons name="qr-code-scanner" size={32} color="white" />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Cartera',
          tabBarIcon: ({ color, focused }) => (
            <MotiView animate={{ scale: focused ? 1.2 : 1, translateY: focused ? -2 : 0 }}>
              <MaterialIcons name="account-balance-wallet" size={26} color={color} />
            </MotiView>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, focused }) => (
            <MotiView animate={{ scale: focused ? 1.2 : 1, translateY: focused ? -2 : 0 }}>
              <View>
                <MaterialIcons name="notifications-none" size={26} color={color} />
                {hasAlerts && (
                  <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#050a15]" />
                )}
              </View>
            </MotiView>
          ),
        }}
      />
      
      {/* Hide internal/deprecated routes from tab bar */}
      <Tabs.Screen name="friends" options={{ href: null }} />
      <Tabs.Screen name="two" options={{ href: null }} />
      <Tabs.Screen name="group/[id]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
