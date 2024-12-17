import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import SignIn from './sign-in';
import AsyncStorage from '@react-native-async-storage/async-storage';



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [logged, setLogged] = useState(true);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("Token");
      setLogged(!!token);
    } catch (error) {
      console.log('Błąd przy sprawdzaniu tokena: ', error);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(checkToken, 100);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {logged ? (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="task-info" options={{ headerShown: false }} />
          <Stack.Screen name="task-edit" options={{ headerShown: false }} />
        </Stack>
      ) : (
        <SignIn setLogged={setLogged} />
      )}
    </ThemeProvider>    
  );
}
