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
  { id: "later",    label: "No rush — I'll wait"  },
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

function bannerForRetailer(retailer: string): string {
  const r = retailer.toLowerCase();
  if (r.includes("kay")) return "Kay Jewelers";
  if (r.includes("jared")) return "Jared";
  if (r.includes("zales")) return "Zales";
  if (r.includes("banter") || r.includes("piercing pagoda")) return "Banter by Piercing Pagoda";
  return retailer;
}

export default function WishlistAppointmentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { retailer: retailerParam } = useLocalSearchParams<{ retailer?: string }>();
  const { wishlistItems, addReminder } = useDiGe();
  const { stores } = usePreferredStore();
  const { profile } = useProfile();
  const { getToken } = useAuth();

  const retailer = retailerParam ?? "";
  const banner = bannerForRetailer(retailer);
  const accentColor = BANNER_COLOR[banner] ?? "#5B21B6";
  const initial = BANNER_INITIAL[banner] ?? banner[0] ?? "?";

  const items = useMemo(
    () => wishlistItems.filter((w) => bannerForRetailer(w.retailer ?? "") === banner),
    [wishlistItems, banner]
  );

  const linkedStores = useMemo(() => Object.values(stores), [stores]);

  const defaultStore = stores[banner] ?? linkedStores[0] ?? null;
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(defaultStore?.id ?? null);
  const [timePref, setTimePref] = useState("morning");
  const [datePref, setDatePref] = useState("asap");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const selectedStore: PreferredStore | null =
    linkedStores.find((s) => s.id === selectedStoreId) ?? null;

  const timeLabel = TIME_PREFS.find((t) => t.id === timePref)?.label ?? "Morning";
  const dateLabel = DATE_PREFS.find((d) => d.id === datePref)?.label ?? "As soon as possible";

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
            ringSize: profile.ringSize || null,
            budgetRange: profile.budgetRange || null,
            appointmentReason: "wishlist",
            retailer,
            timePref: timeLabel,
            datePref: dateLabel,
            itemCount: items.length,
            wishlistItems: items.slice(0, 20).map((w) => ({
              name: w.name,
              estimatedPrice: w.estimatedPrice,
              priority: w.priority,
              sku: w.sku,
              retailerUrl: w.retailerUrl,
            })),
            message: `I'd like to come in to discuss my wishlist. ${items.length} item${items.length !== 1 ? "s" : ""} saved. Preferred time: ${timeLabel}. Preferred date: ${dateLabel}.`,
            sharedAt: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) throw new Error("Request failed");

      // Create a reminder so the appointment shows up in the Reminders tab
      const daysAhead: Record<string, number> = {
        asap: 1,
        thisweek: 5,
        nextweek: 12,
        later: 30,
      };
      const apptDate = new Date();
      apptDate.setDate(apptDate.getDate() + (daysAhead[datePref] ?? 7));

      addReminder({
        jewelryName: `Wishlist Appt — ${retailer || "Signet Store"}`,
        retailer: selectedStore!.name,
        scheduledDate: apptDate.toISOString(),
        recurrence: "none",
        notes: `Booked via DiaGe · ${items.length} item${items.length !== 1 ? "s" : ""} · ${timeLabel} · ${dateLabel}`,
        isCompleted: false,
      });

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
        {/* Retailer + items summary */}
        <View style={[styles.summaryCard, { backgroundColor: accentColor }]}>
          <View style={styles.summaryTop}>
            <View style={[styles.summaryBadge, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Text style={styles.summaryBadgeText}>{initial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryRetailer}>{retailer || "Signet Store"}</Text>
              <Text style={styles.summarySubtitle}>Wishlist appointment</Text>
            </View>
            <View style={[styles.countBadge, { backgroundColor: "rgba(0,0,0,0.2)" }]}>
              <Text style={styles.countText}>{items.length} item{items.length !== 1 ? "s" : ""}</Text>
            </View>
          </View>

          {/* Wishlist item preview */}
          {items.length > 0 ? (
            <View style={[styles.itemsPreview, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
              {items.slice(0, 3).map((w, i) => (
                <View key={w.id} style={[styles.itemRow, i > 0 && styles.itemRowBorder]}>
                  <Feather name="heart" size={11} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.itemName} numberOfLines={1}>{w.name}</Text>
                  {w.estimatedPrice ? (
                    <Text style={styles.itemPrice}>${w.estimatedPrice.toLocaleString()}</Text>
                  ) : null}
                </View>
              ))}
              {items.length > 3 ? (
                <Text style={styles.moreItems}>+{items.length - 3} more items</Text>
              ) : null}
            </View>
          ) : (
            <View style={[styles.itemsPreview, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
              <Text style={styles.noItemsText}>
                No {retailer} items in your wishlist yet — the store associate will see your profile
              </Text>
            </View>
          )}
        </View>

        {/* Store selection */}
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
                Link a store to send your wishlist appointment via DiaGe
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/store-picker" as any)}
              style={[styles.linkBtn, { backgroundColor: accentColor }]}
            >
              <Text style={styles.linkBtnText}>Link Store</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.storeList}>
            {linkedStores.map((s) => {
              const bc = BANNER_COLOR[s.banner] ?? "#5B21B6";
              const si = BANNER_INITIAL[s.banner] ?? s.banner[0];
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
                    <Text style={[styles.storeBadgeText, { color: bc }]}>{si}</Text>
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
              </Pressable>
            );
          })}
        </View>

        {/* Preview */}
        {selectedStore ? (
          <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.previewHeader}>
              <Feather name="send" size={13} color={colors.mutedForeground} />
              <Text style={[styles.previewTitle, { color: colors.mutedForeground }]}>
                What gets sent to {selectedStore.name.split("—")[0].trim()}
              </Text>
            </View>
            <Text style={[styles.previewLine, { color: colors.foreground }]}>
              Wishlist appointment · {items.length} item{items.length !== 1 ? "s" : ""}
            </Text>
            <Text style={[styles.previewLine, { color: colors.mutedForeground }]}>
              {timeLabel} · {dateLabel}
            </Text>
            {profile.name ? (
              <Text style={[styles.previewLine, { color: colors.mutedForeground }]}>
                From: {profile.name}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Send / success */}
        {sent ? (
          <View style={[styles.successCard, { backgroundColor: `${accentColor}10`, borderColor: `${accentColor}30` }]}>
            <Feather name="check-circle" size={20} color={accentColor} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.successTitle, { color: accentColor }]}>Request sent via DiaGe!</Text>
              <Text style={[styles.successSub, { color: accentColor + "AA" }]}>
                {selectedStore?.name} can view your wishlist in their Partner Portal
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
                  {selectedStore ? "Send Wishlist Appointment via DiaGe" : "Select a Store Above"}
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
  scroll: { padding: 20, gap: 14 },

  summaryCard: { borderRadius: 18, padding: 16, gap: 12 },
  summaryTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  summaryBadge: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  summaryBadgeText: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff" },
  summaryRetailer: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  summarySubtitle: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginTop: 1 },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  countText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#fff" },
  itemsPreview: { borderRadius: 12, padding: 12, gap: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  itemRowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(255,255,255,0.15)", paddingTop: 8 },
  itemName: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.9)" },
  itemPrice: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.7)" },
  moreItems: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)", marginTop: 2 },
  noItemsText: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)", lineHeight: 17 },

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

  previewCard: { borderRadius: 13, borderWidth: 1, padding: 14, gap: 6 },
  previewHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  previewTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
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
