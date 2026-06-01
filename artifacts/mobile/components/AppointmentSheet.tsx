import { Feather } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";
import type { PreferredStore } from "@/hooks/usePreferredStore";
import type { WishlistItem } from "@/context/DiGeContext";

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`
  : "http://localhost:5000/api";

const BANNER_COLORS: Record<string, string> = {
  "Kay Jewelers": "#5B21B6",
  "Jared": "#0079F2",
  "Zales": "#D97706",
  "Banter by Piercing Pagoda": "#B91C1C",
};

const TIME_PREFS = [
  { id: "morning",   label: "Morning",   sub: "9 AM – 12 PM", icon: "sunrise" },
  { id: "afternoon", label: "Afternoon", sub: "12 PM – 4 PM",  icon: "sun"     },
  { id: "evening",   label: "Evening",   sub: "4 PM – 6 PM",   icon: "sunset"  },
  { id: "flexible",  label: "Flexible",  sub: "Any time works", icon: "clock"  },
];

const DATE_PREFS = [
  { id: "asap",     label: "As soon as possible" },
  { id: "thisweek", label: "This week"            },
  { id: "nextweek", label: "Next week"            },
  { id: "later",    label: "No rush — I'll wait"  },
];

interface Props {
  visible: boolean;
  store: PreferredStore;
  retailer: string;
  items: WishlistItem[];
  onClose: () => void;
  onSent: () => void;
}

export function AppointmentSheet({ visible, store, retailer, items, onClose, onSent }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const { getToken } = useAuth();

  const [timePref, setTimePref] = useState("morning");
  const [datePref, setDatePref] = useState("asap");
  const [sending, setSending] = useState(false);

  const accentColor = BANNER_COLORS[store.banner] ?? "#5B21B6";
  const timeLabel = TIME_PREFS.find((t) => t.id === timePref)?.label ?? "Morning";
  const dateLabel = DATE_PREFS.find((d) => d.id === datePref)?.label ?? "As soon as possible";

  async function handleSend() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSending(true);
    try {
      const token = await getToken();
      await fetch(`${API_BASE}/store-share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          storeId: store.id,
          type: "appointment",
          data: {
            userName: profile.name || "DiaGe User",
            userEmail: profile.email || "",
            userPhone: profile.phone || "",
            retailer,
            itemCount: items.length,
            timePref: timeLabel,
            datePref: dateLabel,
            message: `I'd like to schedule an appointment. Preferred time: ${timeLabel}. Preferred date: ${dateLabel}. Wishlist items: ${items.length}.`,
            sharedAt: new Date().toISOString(),
          },
        }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
      onSent();
      Alert.alert(
        "Request Received",
        `Your request is now visible in ${store.name}'s DiaGe Partner Portal — they can see your timing preference and wishlist to prepare.\n\n${timeLabel} · ${dateLabel}`,
        [{ text: "Got it" }]
      );
    } catch {
      Alert.alert("Couldn't send", "Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.root, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
        {/* Handle + header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.foreground }]}>Book Appointment</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
                {store.name}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
              <Feather name="x" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Store card */}
          <View style={[styles.storeCard, { backgroundColor: `${accentColor}0D`, borderColor: `${accentColor}30` }]}>
            <Feather name="map-pin" size={15} color={accentColor} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.storeName, { color: colors.foreground }]}>{store.name}</Text>
              <Text style={[styles.storeAddr, { color: colors.mutedForeground }]}>{store.address} · {store.distanceMi} mi</Text>
            </View>
            <Pressable
              onPress={() => {
                onClose();
                router.push(`/store-picker?retailer=${encodeURIComponent(store.banner)}` as any);
              }}
              hitSlop={8}
            >
              <Text style={[styles.changeLink, { color: accentColor }]}>Change</Text>
            </Pressable>
          </View>

          {/* Time preference */}
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Preferred Time</Text>
          <View style={styles.timeGrid}>
            {TIME_PREFS.map((t) => {
              const selected = timePref === t.id;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setTimePref(t.id)}
                  style={[
                    styles.timeCard,
                    {
                      backgroundColor: selected ? `${accentColor}12` : colors.card,
                      borderColor: selected ? accentColor : colors.border,
                      borderWidth: selected ? 2 : 1,
                    },
                  ]}
                >
                  <Feather
                    name={t.icon as any}
                    size={18}
                    color={selected ? accentColor : colors.mutedForeground}
                  />
                  <Text style={[styles.timeLabel, { color: selected ? accentColor : colors.foreground }]}>
                    {t.label}
                  </Text>
                  <Text style={[styles.timeSub, { color: colors.mutedForeground }]}>{t.sub}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Date preference */}
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Preferred Date</Text>
          <View style={[styles.dateList, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {DATE_PREFS.map((d, idx) => {
              const selected = datePref === d.id;
              return (
                <Pressable
                  key={d.id}
                  onPress={() => setDatePref(d.id)}
                  style={[
                    styles.dateRow,
                    idx < DATE_PREFS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: selected ? accentColor : colors.border,
                        backgroundColor: selected ? accentColor : "transparent",
                      },
                    ]}
                  >
                    {selected ? <Feather name="check" size={10} color="#fff" /> : null}
                  </View>
                  <Text style={[styles.dateLabel, { color: colors.foreground }]}>{d.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Summary preview */}
          <View style={[styles.preview, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="file-text" size={13} color={colors.mutedForeground} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.previewLabel, { color: colors.mutedForeground }]}>Request summary</Text>
              <Text style={[styles.previewText, { color: colors.foreground }]}>
                {timeLabel} · {dateLabel}
              </Text>
              {items.length > 0 && (
                <Text style={[styles.previewSub, { color: colors.mutedForeground }]}>
                  {items.length} wishlist item{items.length !== 1 ? "s" : ""} will be referenced
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Send button */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Pressable
            onPress={handleSend}
            disabled={sending}
            style={({ pressed }) => [
              styles.sendBtn,
              { backgroundColor: accentColor, opacity: (pressed || sending) ? 0.8 : 1 },
            ]}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="calendar" size={16} color="#fff" />
                <Text style={styles.sendBtnText}>Send Appointment Request</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth, alignItems: "center" },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB", marginTop: 10, marginBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, width: "100%" },
  title: { fontSize: 18, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  scroll: { padding: 20, gap: 14, paddingBottom: 8 },
  storeCard: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  storeName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  storeAddr: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  changeLink: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sectionLabel: { fontSize: 14, fontFamily: "Inter_700Bold", marginTop: 4 },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  timeCard: { width: "47%", borderRadius: 14, padding: 14, gap: 6, alignItems: "flex-start" },
  timeLabel: { fontSize: 14, fontFamily: "Inter_700Bold" },
  timeSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  dateList: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  dateLabel: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1 },
  preview: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  previewLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.4 },
  previewText: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  previewSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  sendBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    height: 52, borderRadius: 14,
  },
  sendBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
});
