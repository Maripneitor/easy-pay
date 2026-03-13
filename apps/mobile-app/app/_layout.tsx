import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { DependenciesProvider } from '../src/infrastructure/context/DependenciesContext';

SplashScreen.preventAutoHideAsync();

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
    <DependenciesProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="create-group" />
          <Stack.Screen name="password-recovery" />
          <Stack.Screen name="expense-form" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </DependenciesProvider>
  );
}
