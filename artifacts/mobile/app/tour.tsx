import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOUR_KEY = "@dige_tour_seen";
const PRIMARY = "#5B21B6";
const PRIMARY_LIGHT = "#8B5CF6";
const { width: SW, height: SH } = Dimensions.get("window");

const STEPS = [
  {
    id: "welcome",
    icon: "star" as const,
    accentColor: PRIMARY,
    accentBg: "#EDE8FA",
    tag: "Welcome to DiaGe",
    title: "Your jewelry, organized and protected",
    body: "Everything your pieces need — warranties, wishlists, reminders, and insurance — all in one place.",
    arrowTarget: null,
    hint: null,
  },
  {
    id: "vault",
    icon: "archive" as const,
    accentColor: PRIMARY,
    accentBg: "#EDE8FA",
    tag: "My Vault",
    title: "Store every piece you own",
    body: "Add jewelry with photos, warranty details, and purchase receipts. Tap the vault icon in the tab bar to get started.",
    arrowTarget: "left" as const,
    hint: "Tap 'My Vault' in the tab bar",
  },
  {
    id: "shop",
    icon: "shopping-bag" as const,
    accentColor: "#7C3AED",
    accentBg: "#F0EBFF",
    tag: "Shop",
    title: "Browse partner retailers",
    body: "Save pieces you love to wishlists and share them for birthdays and anniversaries. Find it in the Shop tab.",
    arrowTarget: "center-left" as const,
    hint: "Tap 'Shop' in the tab bar",
  },
  {
    id: "reminders",
    icon: "bell" as const,
    accentColor: PRIMARY,
    accentBg: "#EDE8FA",
    tag: "Reminders",
    title: "Never miss an inspection",
    body: "Set reminders for cleanings, inspections, and warranty renewals. Your jewelry stays protected year-round.",
    arrowTarget: "center-right" as const,
    hint: "Tap 'Reminders' in the tab bar",
  },
  {
    id: "protect",
    icon: "shield" as const,
    accentColor: "#D4AA3A",
    accentBg: "#FBF5E6",
    tag: "Protect",
    title: "Get insurance quotes instantly",
    body: "Connect with insurance partners for one-click quotes on your most valuable pieces. Tap Protect to explore.",
    arrowTarget: "right" as const,
    hint: "Tap 'Protect' in the tab bar",
  },
];

const ARROW_POSITIONS: Record<string, { left: number }> = {
  left: { left: SW * 0.1 },
  "center-left": { left: SW * 0.3 },
  "center-right": { left: SW * 0.56 },
  right: { left: SW * 0.74 },
};

export default function TourScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  async function advance() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLast) {
      await AsyncStorage.setItem(TOUR_KEY, "true");
      router.replace("/(tabs)");
    } else {
      setStep((s) => s + 1);
    }
  }

  async function skip() {
    await AsyncStorage.setItem(TOUR_KEY, "true");
    router.replace("/(tabs)");
  }

  const arrowPos = current.arrowTarget ? ARROW_POSITIONS[current.arrowTarget] : null;

  return (
    <View style={styles.root}>
      {/* Dark overlay background */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.overlay} />

      {/* Skip button */}
      {!isLast ? (
        <Pressable
          onPress={skip}
          style={[styles.skipBtn, { top: insets.top + 16 }]}
          hitSlop={12}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      ) : null}

      {/* Tab bar arrow indicator */}
      {arrowPos ? (
        <Animated.View
          key={`arrow-${step}`}
          entering={FadeInDown.delay(300).duration(400)}
          style={[styles.arrowWrap, { bottom: insets.bottom + 100, ...arrowPos }]}
        >
          <View style={[styles.arrowBubble, { backgroundColor: current.accentColor }]}>
            <Text style={styles.arrowText}>{current.hint}</Text>
          </View>
          <View style={[styles.arrowTriangle, { borderTopColor: current.accentColor }]} />
        </Animated.View>
      ) : null}

      {/* Tour card */}
      <View style={[styles.cardWrap, { paddingBottom: insets.bottom + 16 }]}>
        <Animated.View
          key={`card-${step}`}
          entering={SlideInRight.duration(350).springify()}
          exiting={SlideOutLeft.duration(250)}
          style={[styles.card, { borderColor: current.accentColor + "30" }]}
        >
          {/* Progress dots */}
          <View style={styles.dotsRow}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === step ? current.accentColor : "#DDD5F5",
                    width: i === step ? 20 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Icon */}
          <View style={[styles.iconWrap, { backgroundColor: current.accentBg }]}>
            <View style={[styles.iconCircle, { backgroundColor: current.accentColor }]}>
              <Feather name={current.icon} size={28} color="#fff" />
            </View>
          </View>

          {/* Content */}
          <View style={[styles.tagPill, { backgroundColor: current.accentColor + "15" }]}>
            <Text style={[styles.tagText, { color: current.accentColor }]}>{current.tag}</Text>
          </View>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.body}>{current.body}</Text>

          {/* CTA button */}
          <Pressable
            onPress={advance}
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: current.accentColor, opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Text style={styles.btnText}>{isLast ? "Get Started" : "Next"}</Text>
            <Feather name={isLast ? "check" : "arrow-right"} size={18} color="#fff" />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const CARD_HEIGHT = SH * 0.48;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 4, 28, 0.72)",
  },
  skipBtn: {
    position: "absolute",
    right: 20,
    zIndex: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  arrowWrap: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  arrowBubble: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  arrowText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    textAlign: "center",
  },
  arrowTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  cardWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    zIndex: 20,
  },
  card: {
    backgroundColor: "#FAFAFF",
    borderRadius: 28,
    padding: 24,
    gap: 12,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  iconWrap: {
    alignSelf: "flex-start",
    borderRadius: 16,
    padding: 12,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tagPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 4,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#1A0F2E",
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  body: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#7C6D9A",
    lineHeight: 21,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    borderRadius: 16,
    marginTop: 4,
  },
  btnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
});
