import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
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
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
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
    title: "Say goodbye to your paperwork,\nand hello to DiaGe!",
    body: "Store warranties, receipts, certifications, and appraisals for every piece. Pull them up in seconds right from your pocket.",
    features: ["Gold & diamond warranty tracking", "Receipt & document storage", "Certification records"],
  },
  {
    id: "wishlist",
    icon: "heart" as const,
    iconBg: "#7C3AED",
    accentBg: "#F0EBFF",
    tag: "The Look you Love!",
    title: "Build wishlists at\nyour favorite stores",
    body: "Save pieces you love. Share your wishlist with family for birthdays, anniversaries, and holidays.",
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
    features: ["Inspection reminders", "One-tap insurance quotes", "Book in-store appointments"],
  },
];

function FloatingIcon({ iconBg, icon }: { iconBg: string; icon: React.ComponentProps<typeof Feather>["name"] }) {
  const floatY = useSharedValue(0);
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    scale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.4)) });
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    return () => {
      cancelAnimation(floatY);
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.illustrationCircle, { backgroundColor: iconBg }, animStyle]}>
      <Feather name={icon} size={52} color="#fff" />
    </Animated.View>
  );
}

function DecoCircle({ style, iconBg, delay }: { style: object; iconBg: string; delay: number }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2400 + delay, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.92, { duration: 2400 + delay, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, { backgroundColor: iconBg }, animStyle]} />;
}

function SlideContent({
  slide,
  active,
}: {
  slide: (typeof SLIDES)[0];
  active: boolean;
}) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (active) setKey((k) => k + 1);
  }, [active]);

  if (!active) return null;

  return (
    <View key={key} style={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400).springify()}>
        <View style={[styles.tagPill, { backgroundColor: slide.iconBg + "14" }]}>
          <Text style={[styles.tagText, { color: slide.iconBg }]}>{slide.tag}</Text>
        </View>
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(200).duration(400).springify()}
        style={styles.title}
      >
        {slide.title}
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.delay(300).duration(400).springify()}
        style={styles.body}
      >
        {slide.body}
      </Animated.Text>

      <View style={styles.featureList}>
        {slide.features.map((f, i) => (
          <Animated.View
            key={f}
            entering={FadeInDown.delay(380 + i * 80).duration(400).springify()}
            style={styles.featureRow}
          >
            <View style={[styles.featureCheck, { backgroundColor: slide.iconBg }]}>
              <Feather name="check" size={11} color="#fff" />
            </View>
            <Text style={styles.featureText}>{f}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const isLastSlide = activeIndex === SLIDES.length - 1;

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 32 : insets.bottom;

  async function finish() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace("/(auth)/sign-in" as any);
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
      {activeIndex < SLIDES.length - 1 ? (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.skipBtn}>
          <Pressable onPress={finish} hitSlop={12}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </Animated.View>
      ) : null}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScroll}
        style={styles.scroller}
        scrollEnabled={false}
      >
        {SLIDES.map((s, idx) => (
          <View key={s.id} style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <View style={[styles.illustrationWrap, { backgroundColor: s.accentBg }]}>
              {activeIndex === idx && <FloatingIcon iconBg={s.iconBg} icon={s.icon} />}
              {activeIndex !== idx && (
                <View style={[styles.illustrationCircle, { backgroundColor: s.iconBg }]}>
                  <Feather name={s.icon} size={52} color="#fff" />
                </View>
              )}
              <DecoCircle style={styles.deco1} iconBg={s.iconBg + "20"} delay={0} />
              <DecoCircle style={styles.deco2} iconBg={s.iconBg + "14"} delay={300} />
              <DecoCircle style={styles.deco3} iconBg={s.iconBg + "10"} delay={150} />
            </View>

            <SlideContent slide={s} active={activeIndex === idx} />
          </View>
        ))}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: bottomPad + 16 }]}>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <Animated.View
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

        {isLastSlide ? (
          <Animated.View entering={FadeInDown.duration(350).springify()}>
            <Pressable
              onPress={() => setTermsAccepted((v) => !v)}
              style={styles.termsRow}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: termsAccepted ? "#5B21B6" : "transparent",
                    borderColor: termsAccepted ? "#5B21B6" : "#DDD5F5",
                  },
                ]}
              >
                {termsAccepted ? <Feather name="check" size={13} color="#fff" /> : null}
              </View>
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => router.push("/terms")}
                >
                  Terms &amp; Conditions
                </Text>
                , including data sharing with business partners.
              </Text>
            </Pressable>
          </Animated.View>
        ) : null}

        <Pressable
          onPress={isLastSlide && !termsAccepted ? undefined : goNext}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: isLastSlide && !termsAccepted ? "#DDD5F5" : slide.iconBg,
              opacity: pressed && !(isLastSlide && !termsAccepted) ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[styles.ctaText, { color: isLastSlide && !termsAccepted ? "#9E8FC4" : "#fff" }]}>
            {!isLastSlide ? "Continue" : "Get Started"}
          </Text>
          <Feather
            name={!isLastSlide ? "arrow-right" : "check"}
            size={18}
            color={isLastSlide && !termsAccepted ? "#9E8FC4" : "#fff"}
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
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#7C6D9A",
    lineHeight: 20,
  },
  termsLink: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#5B21B6",
    textDecorationLine: "underline",
  },
});
