import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

import { useFonts } from 'expo-font';
import { useEffect, useMemo } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { DependenciesProvider } from '../src/infrastructure/context/DependenciesContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
    <QueryClientProvider client={queryClient}>
      <DependenciesProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="create-group" />
            <Stack.Screen name="password-recovery" />
            <Stack.Screen name="expense-form" />
            <Stack.Screen name="add-expense" />
            <Stack.Screen name="settle-up" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="ocr-scanner" />
            <Stack.Screen name="friends/add" options={{ presentation: 'modal' }} />
            <Stack.Screen name="friends/[id]" />
            <Stack.Screen name="wallet/security" options={{ presentation: 'modal' }} />
            <Stack.Screen name="wallet/methods/new" options={{ presentation: 'modal' }} />
            <Stack.Screen name="wallet/methods/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="wallet/history/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />


          </Stack>
        </ThemeProvider>
      </DependenciesProvider>
    </QueryClientProvider>
  );
}
