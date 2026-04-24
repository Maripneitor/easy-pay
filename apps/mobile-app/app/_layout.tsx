// 1. Imports al inicio (Top Level)
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DependenciesProvider } from '../src/infrastructure/context/DependenciesContext';
import { ThemeProvider as AppThemeProvider } from '../src/infrastructure/context/ThemeContext';
import { NotificationProvider } from '../src/infrastructure/context/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { GrupoProvider } from '../context/GrupoContext';

// 2. Configuración fuera del componente
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

// 3. El componente principal (Único Export Default)
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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppThemeProvider>
            <GrupoProvider>
              <NotificationProvider>
                <DependenciesProvider>
                  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="index" />
                      <Stack.Screen name="login" />
                      <Stack.Screen name="friends/add" options={{ presentation: 'modal' }} />
                      <Stack.Screen name="wallet/security" options={{ presentation: 'modal' }} />
                      <Stack.Screen name="wallet/methods/new" options={{ presentation: 'modal' }} />
                      <Stack.Screen name="wallet/methods/[id]" options={{ presentation: 'modal' }} />
                      <Stack.Screen name="wallet/history/[id]" options={{ presentation: 'modal' }} />
                      <Stack.Screen name="(tabs)" />
                    </Stack>
                  </ThemeProvider>
                </DependenciesProvider>
              </NotificationProvider>
            </GrupoProvider>
          </AppThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}