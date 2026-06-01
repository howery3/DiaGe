import { Feather } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { usePreferredStore, type PreferredStore } from "@/hooks/usePreferredStore";
import { useProfile } from "@/hooks/useProfile";

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`
  : "http://localhost:5000/api";

const TIME_PREFS = [
  { id: "morning",   label: "Morning",   sub: "9 AM – 12 PM",  icon: "sunrise" },
  { id: "afternoon", label: "Afternoon", sub: "12 PM – 4 PM",  icon: "sun"     },
  { id: "evening",   label: "Evening",   sub: "4 PM – 6 PM",   icon: "sunset"  },
  { id: "flexible",  label: "Flexible",  sub: "Any time works", icon: "clock"  },
];

const DATE_PREFS = [
  { id: "asap",     label: "As soon as possible" },
  { id: "thisweek", label: "This week"            },
  { id: "nextweek", label: "Next week"            },
  { id: "ondate",   label: "On the reminder date" },
];

const BANNER_COLOR: Record<string, string> = {
  "Kay Jewelers": "#5B21B6",
  "Jared": "#0079F2",
  "Zales": "#D97706",
  "Banter by Piercing Pagoda": "#B91C1C",
};

const BANNER_INITIAL: Record<string, string> = {
  "Kay Jewelers": "K",
  "Jared": "J",
  "Zales": "Z",
  "Banter by Piercing Pagoda": "B",
};

function fmt(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function bannerForRetailer(retailer: string): string {
  const r = retailer.toLowerCase();
  if (r.includes("kay")) return "Kay Jewelers";
  if (r.includes("jared")) return "Jared";
  if (r.includes("zales")) return "Zales";
  if (r.includes("banter") || r.includes("piercing pagoda")) return "Banter by Piercing Pagoda";
  return retailer;
}

export default function BookAppointmentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { reminderId } = useLocalSearchParams<{ reminderId: string }>();
  const { reminders } = useDiGe();
  const { stores } = usePreferredStore();
  const { profile } = useProfile();
  const { getToken } = useAuth();

  const reminder = reminders.find((r) => r.id === reminderId);

  const linkedStores = useMemo(() => Object.values(stores), [stores]);

  const defaultStore = useMemo(() => {
    if (!reminder?.retailer) return linkedStores[0] ?? null;
    const banner = bannerForRetailer(reminder.retailer);
    return stores[banner] ?? linkedStores[0] ?? null;
  }, [reminder, stores, linkedStores]);

  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(
    defaultStore?.id ?? null
  );
  const [timePref, setTimePref] = useState("morning");
  const [datePref, setDatePref] = useState("asap");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!reminder) {
    return (
      <>
        <Stack.Screen options={{ title: "Book Appointment" }} />
        <View style={[styles.root, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Reminder not found.</Text>
        </View>
      </>
    );
  }

  const selectedStore: PreferredStore | null =
    linkedStores.find((s) => s.id === selectedStoreId) ?? null;

  const accentColor = selectedStore
    ? (BANNER_COLOR[selectedStore.banner] ?? "#5B21B6")
    : "#5B21B6";

  const timeLabel = TIME_PREFS.find((t) => t.id === timePref)?.label ?? "Morning";
  const dateLabel = DATE_PREFS.find((d) => d.id === datePref)?.label ?? "As soon as possible";

  const urgencyDays = Math.ceil(
    (new Date(reminder.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = urgencyDays < 0;

  async function handleSend() {
    if (!selectedStore) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSending(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/store-share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          storeId: selectedStore.id,
          type: "appointment",
          data: {
            userName: profile.name || "DiaGe User",
            userEmail: profile.email || "",
            userPhone: profile.phone || "",
            jewelryName: reminder.jewelryName,
            retailer: reminder.retailer,
            inspectionDue: reminder.scheduledDate,
            timePref: timeLabel,
            datePref: dateLabel,
            message: `Inspection appointment for "${reminder.jewelryName}". Preferred time: ${timeLabel}. Preferred date: ${dateLabel}. Inspection due: ${fmt(reminder.scheduledDate)}.`,
            sharedAt: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSent(true);
      setTimeout(() => router.back(), 1800);
    } catch {
      Alert.alert("Couldn't send", "Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Book Appointment",
          presentation: "modal",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Reminder summary */}
        <View style={[styles.summaryCard, { backgroundColor: accentColor }]}>
          <View style={styles.summaryTop}>
            <View style={[styles.summaryIcon, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Feather name="calendar" size={20} color="#fff" />
            </View>
            <View style={styles.summaryText}>
              <Text style={styles.summaryName}>{reminder.jewelryName}</Text>
              {reminder.retailer ? (
                <Text style={styles.summaryRetailer}>{reminder.retailer}</Text>
              ) : null}
            </View>
            <View style={[styles.urgBadge, { backgroundColor: "rgba(0,0,0,0.2)" }]}>
              <Text style={styles.urgText}>
                {isOverdue ? "Overdue" : urgencyDays === 0 ? "Today" : `${urgencyDays}d`}
              </Text>
            </View>
          </View>
          <View style={[styles.summaryDateRow, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
            <Feather name="clock" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.summaryDate}>Inspection due {fmt(reminder.scheduledDate)}</Text>
          </View>
        </View>

        {/* ── Store selection ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Send to Store</Text>
          <Pressable
            onPress={() => router.push("/store-picker" as any)}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text style={[styles.addStoreLink, { color: accentColor }]}>+ Add Store</Text>
          </Pressable>
        </View>

        {linkedStores.length === 0 ? (
          <View style={[styles.noStoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="map-pin" size={16} color={colors.mutedForeground} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.noStoreTitle, { color: colors.foreground }]}>No stores linked yet</Text>
              <Text style={[styles.noStoreSub, { color: colors.mutedForeground }]}>
                Add a Signet store to send this request via DiaGe
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/store-picker" as any)}
              style={[styles.linkBtn, { backgroundColor: "#5B21B6" }]}
            >
              <Text style={styles.linkBtnText}>Link Store</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.storeList}>
            {linkedStores.map((s) => {
              const bc = BANNER_COLOR[s.banner] ?? "#5B21B6";
              const initial = BANNER_INITIAL[s.banner] ?? s.banner[0];
              const selected = selectedStoreId === s.id;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedStoreId(s.id);
                    setSent(false);
                  }}
                  style={[
                    styles.storeOption,
                    {
                      backgroundColor: selected ? `${bc}10` : colors.card,
                      borderColor: selected ? bc : colors.border,
                      borderWidth: selected ? 2 : 1,
                    },
                  ]}
                >
                  <View style={[styles.storeBadge, { backgroundColor: `${bc}18` }]}>
                    <Text style={[styles.storeBadgeText, { color: bc }]}>{initial}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>
                      {s.name}
                    </Text>
                    <Text style={[styles.storeAddr, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {s.address}
                    </Text>
                    <Text style={[styles.storeDist, { color: colors.mutedForeground }]}>
                      {s.distanceMi} mi away
                    </Text>
                  </View>
                  {selected ? (
                    <View style={[styles.selectedDot, { backgroundColor: bc }]}>
                      <Feather name="check" size={12} color="#fff" />
                    </View>
                  ) : (
                    <View style={[styles.unselectedDot, { borderColor: colors.border }]} />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Time preference */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Preferred Time</Text>
        <View style={styles.timeGrid}>
          {TIME_PREFS.map((t) => {
            const selected = timePref === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTimePref(t.id)}
                style={[
                  styles.timeOption,
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
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Preferred Date</Text>
        <View style={[styles.dateList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {DATE_PREFS.map((d, idx) => {
            const selected = datePref === d.id;
            return (
              <Pressable
                key={d.id}
                onPress={() => setDatePref(d.id)}
                style={[
                  styles.dateOption,
                  idx < DATE_PREFS.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.dateRadio,
                    {
                      borderColor: selected ? accentColor : colors.border,
                      backgroundColor: selected ? accentColor : "transparent",
                    },
                  ]}
                >
                  {selected ? <Feather name="check" size={11} color="#fff" /> : null}
                </View>
                <Text style={[styles.dateLabel, { color: colors.foreground }]}>{d.label}</Text>
                {d.id === "ondate" ? (
                  <Text style={[styles.dateHint, { color: colors.mutedForeground }]}>
                    {fmt(reminder.scheduledDate).split(",")[0]}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Request preview */}
        {selectedStore ? (
          <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.previewHeader}>
              <Feather name="send" size={13} color={colors.mutedForeground} />
              <Text style={[styles.previewTitle, { color: colors.mutedForeground }]}>
                What gets sent to {selectedStore.name.split("—")[0].trim()}
              </Text>
            </View>
            <Text style={[styles.previewLine, { color: colors.foreground }]}>
              Inspection for{" "}
              <Text style={{ fontFamily: "Inter_600SemiBold" }}>{reminder.jewelryName}</Text>
            </Text>
            <Text style={[styles.previewLine, { color: colors.mutedForeground }]}>
              {timeLabel} · {dateLabel}
            </Text>
            <Text style={[styles.previewLine, { color: colors.mutedForeground }]}>
              Due: {fmt(reminder.scheduledDate)}
            </Text>
            {profile.name ? (
              <Text style={[styles.previewLine, { color: colors.mutedForeground }]}>
                From: {profile.name}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Send button — or success */}
        {sent ? (
          <View
            style={[
              styles.successCard,
              { backgroundColor: `${accentColor}10`, borderColor: `${accentColor}30` },
            ]}
          >
            <Feather name="check-circle" size={20} color={accentColor} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.successTitle, { color: accentColor }]}>
                Request sent via DiaGe!
              </Text>
              <Text style={[styles.successSub, { color: accentColor + "AA" }]}>
                {selectedStore?.name} can see this in their Partner Portal
              </Text>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={handleSend}
            disabled={sending || !selectedStore}
            style={({ pressed }) => [
              styles.sendBtn,
              {
                backgroundColor: selectedStore ? accentColor : colors.border,
                opacity: (pressed || sending || !selectedStore) ? 0.75 : 1,
              },
            ]}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="calendar" size={17} color="#fff" />
                <Text style={styles.sendBtnText}>
                  {selectedStore
                    ? "Send Appointment Request via DiaGe"
                    : "Select a Store Above"}
                </Text>
              </>
            )}
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 20, gap: 14 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },

  summaryCard: { borderRadius: 18, padding: 16, gap: 12 },
  summaryTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  summaryIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
  },
  summaryText: { flex: 1, gap: 2 },
  summaryName: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  summaryRetailer: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  urgBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  urgText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#fff" },
  summaryDateRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 10, borderRadius: 10,
  },
  summaryDate: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.85)" },

  sectionHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginTop: 4,
  },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  addStoreLink: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  noStoreCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 14, borderRadius: 13, borderWidth: 1,
  },
  noStoreTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  noStoreSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  linkBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  linkBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#fff" },

  storeList: { gap: 8 },
  storeOption: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 12, borderRadius: 14,
  },
  storeBadge: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  storeBadgeText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  storeName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  storeAddr: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  storeDist: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  selectedDot: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  unselectedDot: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, flexShrink: 0,
  },

  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  timeOption: { width: "47%", borderRadius: 14, padding: 14, gap: 6, alignItems: "flex-start" },
  timeLabel: { fontSize: 14, fontFamily: "Inter_700Bold" },
  timeSub: { fontSize: 11, fontFamily: "Inter_400Regular" },

  dateList: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  dateOption: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  dateRadio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  dateLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  dateHint: { fontSize: 11, fontFamily: "Inter_400Regular" },

  previewCard: { borderRadius: 13, borderWidth: 1, padding: 14, gap: 6 },
  previewHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  previewTitle: {
    fontSize: 11, fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  previewLine: { fontSize: 13, fontFamily: "Inter_400Regular" },

  successCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    padding: 16, borderRadius: 14, borderWidth: 1,
  },
  successTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  successSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 3 },

  sendBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9,
    height: 54, borderRadius: 15, marginTop: 4,
  },
  sendBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
});
