import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "expo-router/head";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider } from "posthog-react-native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { getPostHog } from "@/utils/posthog";

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

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const proxyUrl = process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined;

function AuthGuard() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      AsyncStorage.getItem(ONBOARDING_KEY).then((v) => {
        if (v) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          router.replace("/(auth)/sign-in" as any);
        }
      });
    }
  }, [isSignedIn, isLoaded]);

  return null;
}

function RootLayoutNav() {
  return (
    <>
      <Head>
        <title>DiaGe — Jewelry Organizer</title>
        <meta name="description" content="DiaGe helps you track your jewelry collection, manage a wishlist, and set inspection reminders — all in one place." />
        <meta name="theme-color" content="#5B21B6" />
        <meta property="og:title" content="DiaGe — Jewelry Organizer" />
        <meta property="og:description" content="DiaGe helps you track your jewelry collection, manage a wishlist, and set inspection reminders — all in one place." />
        <meta property="og:type" content="website" />
      </Head>
      <AuthGuard />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="tour" options={{ headerShown: false }} />
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
          name="retailer/stats"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="retailer/nearest-store"
          options={{ headerShown: false }}
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
          name="partner-pricing"
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="catalog-browse"
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="retailer-browser"
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
        <Stack.Screen
          name="wishlist-item/edit"
          options={{ presentation: "modal", headerShown: true }}
        />
        <Stack.Screen
          name="privacy"
          options={{ headerShown: true }}
        />
      </Stack>
    </>
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

  const posthogClient = getPostHog();

  const inner = (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      proxyUrl={proxyUrl}
    >
      <ClerkLoaded>
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
      </ClerkLoaded>
    </ClerkProvider>
  );

  if (posthogClient) {
    try {
      return (
        <PostHogProvider client={posthogClient}>
          {inner}
        </PostHogProvider>
      );
    } catch {
      // if PostHog provider fails, render the app without it
    }
  }

  return inner;
}
