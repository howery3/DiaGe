// ⚠️ MUST be the very first import — installs the fatal-error capture
// before any other module-level side-effects run.
import { installCrashCapture, popCrashInfo } from "@/utils/crashCapture";
installCrashCapture();

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "expo-router/head";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider } from "posthog-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Appearance, ScrollView, Text, View } from "react-native";
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

SplashScreen.preventAutoHideAsync().catch(() => { /* splash screen unavailable */ });
try { configureNotificationHandler(); } catch { /* notifications unavailable in this runtime */ }

const queryClient = new QueryClient();

const ONBOARDING_KEY = "@dige_onboarded";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const proxyUrl = process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined;

function PostHogIdentify() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const ph = getPostHog();
    if (!ph) return;
    if (isSignedIn && user) {
      const traits: Record<string, string> = {};
      const email = user.primaryEmailAddress?.emailAddress;
      if (email) traits["email"] = email;
      if (user.fullName) traits["name"] = user.fullName;
      ph.identify(user.id, traits);
    } else if (isSignedIn === false) {
      ph.reset();
    }
  }, [isSignedIn, user]);

  return null;
}

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
      <PostHogIdentify />
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
          name="reminder/edit"
          options={{ presentation: "modal", headerShown: true }}
        />
        <Stack.Screen
          name="reminder/book-appointment"
          options={{ presentation: "modal", headerShown: true }}
        />
        <Stack.Screen
          name="wishlist-appointment"
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
        <Stack.Screen
          name="store-picker"
          options={{ presentation: "modal", headerShown: true, title: "Find Your Store" }}
        />
      </Stack>
    </>
  );
}

/**
 * Renders the full app once Clerk is initialized, or a loading spinner while
 * Clerk is still booting. Avoids depending on <ClerkLoaded> / <ClerkLoading>
 * helper components which have had compatibility issues across @clerk/expo versions.
 */
function AuthGatedApp() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0714", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const posthogClient = getPostHog();

  const appTree = (
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

  if (posthogClient) {
    return (
      <ErrorBoundary>
        <PostHogProvider client={posthogClient}>
          {appTree}
        </PostHogProvider>
      </ErrorBoundary>
    );
  }

  return appTree;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [crashInfo, setCrashInfo] = useState<{
    message: string;
    stack: string;
    buildVersion: string;
    ts: string;
  } | null>(null);
  const [crashChecked, setCrashChecked] = useState(false);

  useEffect(() => {
    popCrashInfo().then((info) => {
      if (info) setCrashInfo(info);
      setCrashChecked(true);
    });
  }, []);

  useEffect(() => {
    async function init() {
      SplashScreen.hideAsync();
      try { requestNotificationPermissions(); } catch { /* notifications unavailable */ }
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!value) {
          router.replace("/onboarding");
        }
      } catch {
        // storage failure — proceed to app normally
      }
    }

    async function restoreTheme() {
      try {
        const saved = await AsyncStorage.getItem("@dige_theme");
        if (saved === "dark" || saved === "light") {
          Appearance.setColorScheme(saved);
        }
      } catch {}
    }
    restoreTheme();

    if (fontsLoaded || fontError) {
      init();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;
  if (!crashChecked) return null;

  // If a previous fatal crash was captured, display the error message so it
  // can be read and shared for diagnosis. This screen replaces the normal app.
  if (crashInfo) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0714", padding: 24, paddingTop: 60 }}>
        <Text style={{ color: "#EF4444", fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
          ⚠️ Previous crash captured (build {crashInfo.buildVersion})
        </Text>
        <Text style={{ color: "#FCD34D", fontSize: 13, marginBottom: 8 }}>
          {crashInfo.ts}
        </Text>
        <Text style={{ color: "#F87171", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
          {crashInfo.message}
        </Text>
        <ScrollView style={{ flex: 1 }}>
          <Text style={{ color: "#D1D5DB", fontSize: 11, fontFamily: "monospace" }}>
            {crashInfo.stack}
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      proxyUrl={proxyUrl}
    >
      <AuthGatedApp />
    </ClerkProvider>
  );
}
