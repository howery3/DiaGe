import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DiGeProvider } from "@/context/DiGeContext";
import {
  configureNotificationHandler,
  requestNotificationPermissions,
} from "@/utils/notifications";

SplashScreen.preventAutoHideAsync();
configureNotificationHandler();

const queryClient = new QueryClient();

const ONBOARDING_KEY = "@dige_onboarded";

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="piece/add"
        options={{ presentation: "modal", headerShown: true }}
      />
      <Stack.Screen
        name="piece/[id]"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="piece/add-repair"
        options={{ presentation: "modal", headerShown: true }}
      />
      <Stack.Screen
        name="piece/share"
        options={{ presentation: "modal", headerShown: true }}
      />
      <Stack.Screen
        name="wishlist-item/add"
        options={{ presentation: "modal", headerShown: true }}
      />
      <Stack.Screen
        name="reminder/add"
        options={{ presentation: "modal", headerShown: true }}
      />
      <Stack.Screen
        name="retailer/[name]"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="insurance-report"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="insurance-quote"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="partner-inquiry"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="catalog-browse"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="catalog-scan"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="reminder/book-appointment"
        options={{ presentation: "modal", headerShown: true }}
      />
      <Stack.Screen
        name="terms"
        options={{ presentation: "modal", headerShown: true }}
      />
      <Stack.Screen
        name="settings"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    async function init() {
      SplashScreen.hideAsync();
      requestNotificationPermissions();
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!value) {
          router.replace("/onboarding");
        }
      } catch {
        // storage failure — proceed to app normally
      }
    }

    if (fontsLoaded || fontError) {
      init();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <DiGeProvider>
            <GestureHandlerRootView>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </DiGeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
