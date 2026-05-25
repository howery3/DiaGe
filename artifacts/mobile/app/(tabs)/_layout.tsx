import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useDiGe } from "@/context/DiGeContext";

const TOUR_KEY = "@dige_tour_seen";
const PRIMARY = "#5B21B6";
const { width: SW } = Dimensions.get("window");

const STEPS = [
  {
    tab: 0,
    icon: "archive" as const,
    tag: "My Vault",
    title: "Store every piece you own",
    body: "Add your jewelry with photos, warranty documents, and purchase receipts, all organized in one place.",
    accentColor: "#5B21B6",
  },
  {
    tab: 1,
    icon: "shopping-bag" as const,
    tag: "Shop",
    title: "Browse & build wishlists",
    body: "Explore partner retailers, save pieces you love, and share wishlists for birthdays and anniversaries.",
    accentColor: "#7C3AED",
  },
  {
    tab: 2,
    icon: "bell" as const,
    tag: "Reminders",
    title: "Never miss an inspection",
    body: "Set reminders for cleanings, prong checks, and warranty renewals. Your jewelry stays protected year-round.",
    accentColor: "#5B21B6",
  },
  {
    tab: 3,
    icon: "shield" as const,
    tag: "Protect",
    title: "Get insurance in one tap",
    body: "Connect with licensed insurance partners and request quotes instantly for your most valuable pieces.",
    accentColor: "#B45309",
  },
  {
    tab: 4,
    icon: "user" as const,
    tag: "Profile",
    title: "Your jewelry identity",
    body: "Set your ring size, preferred metals, and special dates. Share your preferences so loved ones always find the perfect gift.",
    accentColor: "#6D28D9",
  },
];

const TAB_HEIGHT = 49;
const TAB_W = SW / 5;

function TourOverlay({ onDismiss }: { onDismiss: () => void }) {
  const [step, setStep] = useState(0);
  const insets = useSafeAreaInsets();
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  // Pulsing dot animation
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 650 }),
        withTiming(1, { duration: 650 })
      ),
      -1,
      true
    );
  }, [pulse]);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value,
  }));

  const tabBarBottom = insets.bottom; // safe area below tab bar
  const tabBarTop = TAB_HEIGHT + tabBarBottom; // distance from bottom of screen to top of tab bar
  const dotCenterX = (current.tab + 0.5) * TAB_W;
  const dotBottom = tabBarTop - TAB_HEIGHT / 2; // center of the tab bar from screen bottom

  async function advance() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLast) {
      await AsyncStorage.setItem(TOUR_KEY, "true");
      onDismiss();
    } else {
      setStep((s) => s + 1);
    }
  }

  async function skip() {
    await AsyncStorage.setItem(TOUR_KEY, "true");
    onDismiss();
  }

  return (
    <Modal transparent animationType="none" visible statusBarTranslucent>
      {/* Dimmed overlay — fills everything except the tab bar area */}
      <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Top region overlay */}
        <View
          style={[
            styles.overlaySegment,
            { bottom: tabBarTop, top: 0 },
          ]}
          pointerEvents="none"
        />
        {/* Tab bar overlay — slightly lighter so the tabs remain readable */}
        <View
          style={[
            styles.tabBarOverlay,
            { height: tabBarTop, bottom: 0 },
          ]}
          pointerEvents="none"
        />
      </Animated.View>

      {/* Pulsing dot indicator on the active tab */}
      <View
        style={[
          styles.dotWrap,
          {
            bottom: dotBottom - 10,
            left: dotCenterX - 20,
          },
        ]}
        pointerEvents="none"
      >
        <Animated.View
          style={[
            styles.dotRing,
            { borderColor: current.accentColor },
            pulseStyle,
          ]}
        />
        <View style={[styles.dot, { backgroundColor: current.accentColor }]} />
      </View>

      {/* Downward arrow pointing at the tab */}
      <View
        style={[
          styles.arrowDown,
          {
            bottom: tabBarTop + 4,
            left: dotCenterX - 10,
            borderTopColor: current.accentColor,
          },
        ]}
        pointerEvents="none"
      />

      {/* Step card */}
      <Animated.View
        key={`step-${step}`}
        entering={FadeInUp.duration(320).springify()}
        style={[
          styles.card,
          { bottom: tabBarTop + 28 },
        ]}
        pointerEvents="box-none"
      >
        {/* Progress dots */}
        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor: i === step ? current.accentColor : "#DDD5F5",
                  width: i === step ? 22 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Icon + tag */}
        <View style={styles.iconTagRow}>
          <View style={[styles.iconBubble, { backgroundColor: current.accentColor + "1A" }]}>
            <Feather name={current.icon} size={20} color={current.accentColor} />
          </View>
          <View style={[styles.tag, { backgroundColor: current.accentColor + "18" }]}>
            <Text style={[styles.tagText, { color: current.accentColor }]}>{current.tag}</Text>
          </View>
        </View>

        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>

        {/* Buttons */}
        <View style={styles.btnRow}>
          {!isLast && (
            <Pressable onPress={skip} style={styles.skipBtn} hitSlop={8}>
              <Text style={styles.skipText}>Skip tour</Text>
            </Pressable>
          )}
          <Pressable
            onPress={advance}
            style={({ pressed }) => [
              styles.nextBtn,
              { backgroundColor: current.accentColor, opacity: pressed ? 0.88 : 1, flex: isLast ? 1 : 0 },
            ]}
          >
            <Text style={styles.nextText}>{isLast ? "Get Started" : "Next"}</Text>
            <Feather name={isLast ? "check" : "arrow-right"} size={16} color="#fff" />
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ─── Tab layouts ────────────────────────────────────────────────────────────

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const { upcomingReminderCount } = useDiGe();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Vault",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="archivebox" tintColor={color} size={24} />
            ) : (
              <Feather name="archive" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="bag" tintColor={color} size={24} />
            ) : (
              <Feather name="shopping-bag" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Reminders",
          tabBarBadge: upcomingReminderCount > 0 ? upcomingReminderCount : undefined,
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="bell" tintColor={color} size={24} />
            ) : (
              <Feather name="bell" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="protect"
        options={{
          title: "Protect",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="shield" tintColor={color} size={24} />
            ) : (
              <Feather name="shield" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person.circle" tintColor={color} size={24} />
            ) : (
              <Feather name="user" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen name="wishlist" options={{ href: null }} />
    </Tabs>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────

export default function TabLayout() {
  const [tourVisible, setTourVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(TOUR_KEY).then((v) => {
      if (!v) setTourVisible(true);
    });
  }, []);

  return (
    <>
      <ClassicTabLayout />
      {tourVisible && <TourOverlay onDismiss={() => setTourVisible(false)} />}
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlaySegment: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "rgba(8, 2, 22, 0.72)",
  },
  tabBarOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "rgba(8, 2, 22, 0.38)",
  },
  dotWrap: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dotRing: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  arrowDown: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  card: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#FAFAFF",
    borderRadius: 24,
    padding: 22,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  iconTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#1A0F2E",
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  body: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#7C6D9A",
    lineHeight: 21,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#9E8FC4",
  },
  nextBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 14,
  },
  nextText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
});
