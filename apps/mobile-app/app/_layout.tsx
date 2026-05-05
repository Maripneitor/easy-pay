import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DependenciesProvider } from '@/src/infrastructure/context/DependenciesContext';
import { ThemeProvider as AppThemeProvider } from '@/src/infrastructure/context/ThemeContext';
import { NotificationProvider } from '@/src/infrastructure/context/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { GrupoProvider } from '@/context/GrupoContext';
import { PaymentProvider } from '@/src/infrastructure/context/PaymentContext';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <GrupoProvider>
          <AppThemeProvider>
            <PaymentProvider>
              <NotificationProvider>
                <QueryClientProvider client={queryClient}>
                  <DependenciesProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                      <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
                        <Stack.Screen name="index" />
                        <Stack.Screen name="login" />
                        <Stack.Screen name="security-2fa" />
                        <Stack.Screen name="friends/add" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="wallet/security" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="wallet/methods/new" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="wallet/methods/[id]" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="wallet/history/[id]" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="(tabs)" />
                      </Stack>
                    </ThemeProvider>
                  </DependenciesProvider>
                </QueryClientProvider>
              </NotificationProvider>
            </PaymentProvider>
          </AppThemeProvider>
        </GrupoProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

import { ErrorBoundaryProps } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050a15', padding: 24 }}>
      <MaterialIcons name="wifi-off" size={64} color="#f43f5e" />
      <Text style={{ color: 'white', fontSize: 20, fontWeight: '900', marginTop: 16, textAlign: 'center' }}>Error de conexión</Text>
      <Text style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 }}>
        No se pudo cargar la página. Esto suele ocurrir si el servidor de desarrollo se reinició.
      </Text>
      <TouchableOpacity 
        onPress={retry}
        style={{ marginTop: 32, paddingVertical: 14, paddingHorizontal: 32, backgroundColor: '#3b82f6', borderRadius: 16 }}
      >
        <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
}
