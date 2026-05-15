import { Feather, FontAwesome } from "@expo/vector-icons";
import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

const PRIMARY = "#5B21B6";
const PRIMARY_LIGHT = "#8B5CF6";
const BG = "#FAFAFF";

export default function SignInScreen() {
  const { startSSOFlow } = useSSO();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<"apple" | "google" | null>(null);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    WebBrowser.warmUpAsync();
    return () => { WebBrowser.coolDownAsync(); };
  }, []);

  const signInWith = useCallback(
    async (strategy: "oauth_apple" | "oauth_google") => {
      try {
        setLoading(strategy === "oauth_apple" ? "apple" : "google");
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });

        if (createdSessionId) {
          await setActive!({ session: createdSessionId });
          router.replace("/(tabs)");
        }
      } catch (err: unknown) {
        console.error(JSON.stringify(err, null, 2));
        const clerkErrors =
          err && typeof err === "object" && "errors" in err
            ? (err as { errors: { code?: string; message: string }[] }).errors
            : [];
        const isSessionExists = clerkErrors.some(
          (e) =>
            e.code === "session_exists" ||
            e.message?.toLowerCase().includes("session already exists")
        );
        if (isSessionExists) {
          router.replace("/(tabs)");
          return;
        }
        const message =
          clerkErrors.length > 0
            ? clerkErrors.map((e) => e.message).join("\n")
            : err && typeof err === "object" && "message" in err
            ? String((err as { message: string }).message)
            : "Sign-in failed. Please try again.";
        Alert.alert("Sign-in failed", message);
      } finally {
        setLoading(null);
      }
    },
    [startSSOFlow]
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Background decoration */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Logo / branding */}
      <Animated.View entering={FadeInUp.delay(80).duration(500).springify()} style={styles.logoWrap}>
        <View style={styles.logoIcon}>
          <Feather name="hexagon" size={36} color="#fff" />
        </View>
        <Text style={styles.logoName}>DiaGe</Text>
        <Text style={styles.logoTagline}>Your Digital Jewelry Vault</Text>
      </Animated.View>

      {/* Main card */}
      <Animated.View entering={FadeInDown.delay(200).duration(500).springify()} style={styles.card}>
        <Text style={styles.cardTitle}>Welcome back</Text>
        <Text style={styles.cardSubtitle}>
          Sign in to access your jewelry vault, wishlists, and reminders — all secured and private.
        </Text>

        {/* Apple Sign In */}
        <Pressable
          onPress={() => signInWith("oauth_apple")}
          disabled={loading !== null}
          style={({ pressed }) => [
            styles.appleBtn,
            { opacity: pressed || loading !== null ? 0.85 : 1 },
          ]}
        >
          {loading === "apple" ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <FontAwesome name="apple" size={20} color="#fff" />
              <Text style={styles.appleBtnText}>Continue with Apple</Text>
            </>
          )}
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign In */}
        <Pressable
          onPress={() => signInWith("oauth_google")}
          disabled={loading !== null}
          style={({ pressed }) => [
            styles.googleBtn,
            { opacity: pressed || loading !== null ? 0.85 : 1 },
          ]}
        >
          {loading === "google" ? (
            <ActivityIndicator color={PRIMARY} size="small" />
          ) : (
            <>
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </>
          )}
        </Pressable>
      </Animated.View>

      {/* Footer */}
      <Animated.View entering={FadeIn.delay(500).duration(400)} style={styles.footer}>
        <Feather name="lock" size={12} color="#9E8FC4" />
        <Text style={styles.footerText}>
          Your data is stored securely on your device.{"\n"}By continuing you agree to our{" "}
          <Text
            style={styles.footerLink}
            onPress={() => router.push("/privacy")}
          >
            Privacy Policy
          </Text>
          {" & "}
          <Text
            style={styles.footerLink}
            onPress={() => router.push("/terms")}
          >
            Terms
          </Text>
          .
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 24,
  },
  bgCircle1: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: PRIMARY + "0D",
    top: -60,
    right: -80,
  },
  bgCircle2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: PRIMARY_LIGHT + "0A",
    bottom: 40,
    left: -60,
  },
  logoWrap: {
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  logoName: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#1A0F2E",
    letterSpacing: -0.5,
  },
  logoTagline: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#7C6D9A",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#1A0F2E",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#7C6D9A",
    textAlign: "center",
    lineHeight: 20,
  },
  appleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#1A0F2E",
    borderRadius: 14,
    height: 52,
  },
  appleBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5DFF5",
  },
  dividerText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#9E8FC4",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: "#DDD5F5",
  },
  googleG: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: PRIMARY,
  },
  googleBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#1A0F2E",
  },
  footer: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#9E8FC4",
    textAlign: "center",
    lineHeight: 18,
  },
  footerLink: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: PRIMARY,
  },
});
