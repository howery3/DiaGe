import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ONBOARDING_KEY = "@dige_onboarded";

const SLIDES = [
  {
    id: "vault",
    icon: "archive" as const,
    iconBg: "#5B21B6",
    accentBg: "#EDE8FA",
    tag: "Your Digital Jewelry Vault",
    title: "All your paperwork,\nnever lost again",
    body: "Store warranties, receipts, serial numbers, and appraisals for every piece. Pull them up in seconds — from your pocket.",
    features: ["Gold & diamond warranty tracking", "Receipt & document storage", "Serial number records"],
  },
  {
    id: "wishlist",
    icon: "heart" as const,
    iconBg: "#7C3AED",
    accentBg: "#F0EBFF",
    tag: "Organized by Retailer",
    title: "Build wishlists at\nyour favorite stores",
    body: "Save pieces you love, organized by jeweler. Share your wishlist with family for birthdays, anniversaries, and holidays.",
    features: ["Wishlist per retailer", "Easy sharing with loved ones", "Sync with in-store QR codes"],
  },
  {
    id: "reminders",
    icon: "bell" as const,
    iconBg: "#5B21B6",
    accentBg: "#EDE8FA",
    tag: "Stay Protected",
    title: "Never miss an\ninspection or renewal",
    body: "Smart reminders keep your warranties valid and your jewelry insured. Book appointments directly from the app.",
    features: ["Inspection reminders", "One-tap insurance quotes", "Book store appointments"],
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 32 : insets.bottom;

  async function finish() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/(tabs)");
  }

  async function goNext() {
    if (activeIndex < SLIDES.length - 1) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const nextIndex = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
      setActiveIndex(nextIndex);
    } else {
      await finish();
    }
  }

  function handleScroll(e: { nativeEvent: { contentOffset: { x: number } } }) {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  }

  const slide = SLIDES[activeIndex];

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      {/* Skip */}
      {activeIndex < SLIDES.length - 1 ? (
        <Pressable
          onPress={finish}
          style={styles.skipBtn}
          hitSlop={12}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      ) : null}

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScroll}
        style={styles.scroller}
      >
        {SLIDES.map((s) => (
          <View key={s.id} style={[styles.slide, { width: SCREEN_WIDTH }]}>
            {/* Illustration area */}
            <View style={[styles.illustrationWrap, { backgroundColor: s.accentBg }]}>
              <View style={[styles.illustrationCircle, { backgroundColor: s.iconBg }]}>
                <Feather name={s.icon} size={52} color="#fff" />
              </View>

              {/* Floating decoration circles */}
              <View style={[styles.deco1, { backgroundColor: s.iconBg + "20" }]} />
              <View style={[styles.deco2, { backgroundColor: s.iconBg + "14" }]} />
              <View style={[styles.deco3, { backgroundColor: s.iconBg + "10" }]} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={[styles.tagPill, { backgroundColor: s.iconBg + "14" }]}>
                <Text style={[styles.tagText, { color: s.iconBg }]}>{s.tag}</Text>
              </View>

              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.body}>{s.body}</Text>

              <View style={styles.featureList}>
                {s.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <View style={[styles.featureCheck, { backgroundColor: s.iconBg }]}>
                      <Feather name="check" size={11} color="#fff" />
                    </View>
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: bottomPad + 16 }]}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <View
              key={s.id}
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeIndex ? slide.iconBg : "#DDD5F5",
                  width: i === activeIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={goNext}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: slide.iconBg, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={styles.ctaText}>
            {activeIndex < SLIDES.length - 1 ? "Continue" : "Get Started"}
          </Text>
          <Feather
            name={activeIndex < SLIDES.length - 1 ? "arrow-right" : "check"}
            size={18}
            color="#fff"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAFAFF",
  },
  skipBtn: {
    position: "absolute",
    top: Platform.OS === "web" ? 72 : 56,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(91,33,182,0.08)",
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#5B21B6",
  },
  scroller: { flex: 1 },
  slide: {
    flex: 1,
  },
  illustrationWrap: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  illustrationCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  deco1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -40,
    right: -40,
  },
  deco2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: -30,
    left: -30,
  },
  deco3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    top: 20,
    left: 30,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 28,
    gap: 14,
    flex: 1,
  },
  tagPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    color: "#1A0F2E",
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  body: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#7C6D9A",
    lineHeight: 23,
  },
  featureList: {
    gap: 10,
    marginTop: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#1A0F2E",
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 20,
    backgroundColor: "#FAFAFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DDD5F5",
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: 16,
  },
  ctaText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
});
