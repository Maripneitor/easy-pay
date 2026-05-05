import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { useNotifications } from '../../src/infrastructure/context/NotificationContext';

const CustomTabBarButton = ({ children, onPress, theme }: any) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        style={{
          top: -20,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001,
          ...styles.tabButtonShadow
        }}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 4,
            borderColor: theme.bg,
          }}
        >
          {children}
        </View>
      </TouchableOpacity>
    </View>
  );
};

import { Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const { hasAlerts } = useNotifications();
  const { token, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  if (isLoading) return null;
  
  console.log(`🛡️ TabLayout Protection - Token: ${token ? '✅ Presente' : '❌ Ausente'}`);
  if (!token) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: '#475569',
        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopWidth: 0,
          height: 60 + (insets.bottom > 0 ? insets.bottom + 5 : 15),
          paddingBottom: insets.bottom > 0 ? insets.bottom + 5 : 15,
          paddingTop: 12,
          position: 'absolute',
          elevation: 0,
          borderTopColor: 'transparent',
          borderBottomWidth: 0,
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
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <MaterialIcons name="grid-view" size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Grupos',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <MaterialIcons name="group-work" size={26} color={color} />
            </View>
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
        name="stats"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <MaterialIcons name="bar-chart" size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <View>
                <MaterialIcons name="notifications-none" size={26} color={color} />
                {hasAlerts && (
                  <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#050a15]" />
                )}
              </View>
            </View>
          ),
        }}
      />
      
      {/* Hide internal/deprecated/moved routes from tab bar */}
      <Tabs.Screen name="friends_list" options={{ href: null }} />
      <Tabs.Screen name="group/[id]" options={{ href: null }} />
      <Tabs.Screen name="payments" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButtonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});
