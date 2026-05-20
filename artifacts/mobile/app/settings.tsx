import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";

const ONBOARDING_KEY = "@dige_onboarded";
const APP_VERSION = "1.0.0";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces, wishlistItems, reminders, clearAllData } = useDiGe();
  const { profile, hasProfile, initials, completionPct } = useProfile();
  const [darkMode, setDarkMode] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((v) => setOnboardingDone(!!v));
  }, []);

  const topPad = Platform.OS === "web" ? 60 : insets.top;

  async function handleResetOnboarding() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Reset Onboarding",
      "This will show the welcome screens again the next time you open DiaGe.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          onPress: async () => {
            await AsyncStorage.removeItem(ONBOARDING_KEY);
            setOnboardingDone(false);
            Alert.alert("Done", "Close and reopen the app to see the welcome screens.");
          },
        },
      ]
    );
  }

  async function handleClearVault() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const total = pieces.length + wishlistItems.length + reminders.length;
    Alert.alert(
      "Clear All Data",
      `This will permanently delete all ${total} item${total !== 1 ? "s" : ""} from your vault — including ${pieces.length} piece${pieces.length !== 1 ? "s" : ""}, ${wishlistItems.length} wishlist item${wishlistItems.length !== 1 ? "s" : ""}, and ${reminders.length} reminder${reminders.length !== 1 ? "s" : ""}.\n\nThis cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          },
        },
      ]
    );
  }

  const profileInitials = initials();

  const vaultStats = [
    { label: "Jewelry Pieces", value: pieces.length },
    { label: "Wishlist Items", value: wishlistItems.length },
    { label: "Reminders", value: reminders.length },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Settings</Text>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile link */}
          <SectionLabel label="My Profile" colors={colors} />
          <Pressable
            onPress={() => { router.back(); router.push("/(tabs)/profile"); }}
            style={[styles.profileLink, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.profileLinkAvatar, { backgroundColor: hasProfile ? "#5B21B6" : colors.muted }]}>
              {hasProfile ? (
                <Text style={styles.profileLinkInitials}>{profileInitials}</Text>
              ) : (
                <Feather name="user" size={18} color={colors.mutedForeground} />
              )}
            </View>
            <View style={styles.profileLinkText}>
              <Text style={[styles.profileLinkName, { color: colors.foreground }]}>
                {profile.name || "Set up your profile"}
              </Text>
              <Text style={[styles.profileLinkSub, { color: colors.mutedForeground }]}>
                {completionPct}% complete · ring size, preferences & more
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>

          {/* Vault snapshot */}
          <View style={[styles.vaultCard, { backgroundColor: "#5B21B6" }]}>
            <Text style={styles.vaultCardLabel}>Your Vault</Text>
            <View style={styles.vaultStats}>
              {vaultStats.map((s) => (
                <View key={s.label} style={styles.vaultStat}>
                  <Text style={styles.vaultStatValue}>{s.value}</Text>
                  <Text style={styles.vaultStatLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Appearance */}
          <SectionLabel label="Appearance" colors={colors} />
          <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingsRow
              icon="moon"
              iconBg="#1C1435"
              label="Dark Mode"
              colors={colors}
              right={
                <Switch
                  value={darkMode}
                  onValueChange={(v) => {
                    setDarkMode(v);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  trackColor={{ false: colors.border, true: "#5B21B6" }}
                  thumbColor="#fff"
                />
              }
            />
            <Divider colors={colors} />
            <SettingsRow
              icon="smartphone"
              iconBg="#0E6655"
              label="App Version"
              colors={colors}
              right={
                <Text style={[styles.valueText, { color: colors.mutedForeground }]}>{APP_VERSION}</Text>
              }
            />
          </View>

          {/* Legal */}
          <SectionLabel label="Legal" colors={colors} />
          <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingsRow
              icon="file-text"
              iconBg="#5B21B6"
              label="Terms & Conditions"
              colors={colors}
              onPress={() => router.push("/terms")}
              chevron
            />
            <Divider colors={colors} />
            <SettingsRow
              icon="shield"
              iconBg="#5B21B6"
              label="Privacy Policy"
              sublabel="Data storage, sharing & your rights"
              colors={colors}
              onPress={() => router.push("/privacy")}
              chevron
            />
          </View>

          {/* Onboarding */}
          <SectionLabel label="Onboarding" colors={colors} />
          <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingsRow
              icon="play-circle"
              iconBg="#7C3AED"
              label="Replay Welcome Tour"
              sublabel={onboardingDone ? "Will show on next app open" : "Already reset"}
              colors={colors}
              onPress={handleResetOnboarding}
              chevron
            />
          </View>

          {/* Data */}
          <SectionLabel label="Data" colors={colors} />
          <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingsRow
              icon="alert-triangle"
              iconBg="#DC2626"
              label="Clear All Vault Data"
              sublabel="Permanently deletes all pieces, wishlists & reminders"
              labelColor="#DC2626"
              colors={colors}
              onPress={handleClearVault}
              chevron
            />
          </View>

          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
            DiaGe is a personal jewelry organizer. Keep original hard copies of all important documents — we are not responsible for data loss. See Terms & Conditions for full details.
          </Text>
        </ScrollView>
      </View>
    </>
  );
}

function SectionLabel({ label, colors }: { label: string; colors: ReturnType<typeof useColors> }) {
  return (
    <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{label.toUpperCase()}</Text>
  );
}

function Divider({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 56 }]} />
  );
}

function SettingsRow({
  icon,
  iconBg,
  label,
  sublabel,
  labelColor,
  colors,
  onPress,
  chevron,
  right,
}: {
  icon: string;
  iconBg: string;
  label: string;
  sublabel?: string;
  labelColor?: string;
  colors: ReturnType<typeof useColors>;
  onPress?: () => void;
  chevron?: boolean;
  right?: React.ReactNode;
}) {
  const content = (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Feather name={icon as any} size={16} color="#fff" />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: labelColor ?? colors.foreground }]}>{label}</Text>
        {sublabel ? (
          <Text style={[styles.rowSublabel, { color: colors.mutedForeground }]}>{sublabel}</Text>
        ) : null}
      </View>
      {right ?? null}
      {chevron ? (
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { paddingHorizontal: 20, paddingTop: 16, gap: 8 },

  profileLink: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
    marginBottom: 4,
  },
  profileLinkAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  profileLinkInitials: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
  profileLinkText: { flex: 1, gap: 3 },
  profileLinkName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  profileLinkSub: { fontSize: 12, fontFamily: "Inter_400Regular" },

  vaultCard: { borderRadius: 18, padding: 20, marginTop: 4, marginBottom: 4 },
  vaultCardLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  vaultStats: { flexDirection: "row", justifyContent: "space-around" },
  vaultStat: { alignItems: "center", gap: 4 },
  vaultStatValue: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#fff" },
  vaultStatLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },

  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  group: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  divider: { height: StyleSheet.hairlineWidth },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  rowSublabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  valueText: { fontSize: 14, fontFamily: "Inter_400Regular" },

  disclaimer: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    textAlign: "center",
    marginTop: 8,
  },
});
