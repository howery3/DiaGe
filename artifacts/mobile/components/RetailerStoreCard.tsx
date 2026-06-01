import { Feather } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { usePreferredStore } from "@/hooks/usePreferredStore";
import { useProfile } from "@/hooks/useProfile";
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

function bannerForRetailer(retailer: string): string {
  const r = retailer.toLowerCase();
  if (r.includes("kay")) return "Kay Jewelers";
  if (r.includes("jared")) return "Jared";
  if (r.includes("zales")) return "Zales";
  if (r.includes("banter") || r.includes("piercing pagoda")) return "Banter by Piercing Pagoda";
  return retailer;
}

function storeInitial(banner: string) {
  if (banner.startsWith("Kay")) return "K";
  if (banner.startsWith("Jared")) return "J";
  if (banner.startsWith("Zales")) return "Z";
  if (banner.startsWith("Banter") || banner.startsWith("Piercing")) return "B";
  return banner.charAt(0).toUpperCase();
}

interface Props {
  retailer: string;
  items: WishlistItem[];
}

export function RetailerStoreCard({ retailer, items }: Props) {
  const colors = useColors();
  const { getStore, saveStore } = usePreferredStore();
  const { profile } = useProfile();
  const { getToken } = useAuth();

  const [working, setWorking] = useState(false);
  const [success, setSuccess] = useState<"wishlist" | "appointment" | null>(null);

  const banner = bannerForRetailer(retailer);
  const store = getStore(retailer);
  const accentColor = BANNER_COLORS[banner] ?? "#5B21B6";

  async function handleSendWishlist() {
    if (!store) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWorking(true);
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
          type: "wishlist",
          data: {
            userName: profile.name || "DiaGe User",
            userEmail: profile.email || "",
            userPhone: profile.phone || "",
            ringSize: profile.ringSize || null,
            budgetRange: profile.budgetRange || null,
            wishlistItems: items.slice(0, 20).map((w) => ({
              name: w.name,
              estimatedPrice: w.estimatedPrice,
              priority: w.priority,
              retailer: w.retailer,
              sku: w.sku,
              retailerUrl: w.retailerUrl,
            })),
            sharedAt: new Date().toISOString(),
          },
        }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess("wishlist");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      Alert.alert("Couldn't send", "Please check your connection and try again.");
    } finally {
      setWorking(false);
    }
  }

  async function handleBookAppointment() {
    if (!store) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWorking(true);
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
            message: `I'd like to schedule an appointment to discuss my ${retailer} wishlist (${items.length} item${items.length !== 1 ? "s" : ""}).`,
            sharedAt: new Date().toISOString(),
          },
        }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess("appointment");
      Alert.alert(
        "Appointment Requested!",
        `${store.name} will reach out to confirm your appointment time.`,
        [{ text: "OK", onPress: () => setSuccess(null) }]
      );
    } catch {
      Alert.alert("Couldn't send", "Please check your connection and try again.");
    } finally {
      setWorking(false);
    }
  }

  if (!store) {
    return (
      <Pressable
        onPress={() => router.push(`/store-picker?retailer=${encodeURIComponent(banner)}` as any)}
        style={({ pressed }) => [
          styles.setStoreBtn,
          {
            borderColor: accentColor + "40",
            backgroundColor: accentColor + "08",
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={[styles.setStoreIcon, { backgroundColor: accentColor + "18" }]}>
          <Feather name="map-pin" size={14} color={accentColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.setStorePrimary, { color: colors.foreground }]}>
            Set my {retailer} store
          </Text>
          <Text style={[styles.setStoreSub, { color: colors.mutedForeground }]}>
            Link a location to book appointments &amp; send wishlist
          </Text>
        </View>
        <Feather name="chevron-right" size={15} color={accentColor} />
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, { borderColor: accentColor + "40", backgroundColor: accentColor + "06" }]}>
      {/* Store row */}
      <View style={styles.storeRow}>
        <View style={[styles.badge, { backgroundColor: accentColor + "18" }]}>
          <Text style={[styles.badgeText, { color: accentColor }]}>{storeInitial(banner)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>{store.name}</Text>
          <Text style={[styles.storeAddr, { color: colors.mutedForeground }]} numberOfLines={1}>{store.address}</Text>
          <View style={styles.storeMeta}>
            <Feather name="navigation" size={9} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{store.distanceMi} mi</Text>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}> · {store.phone}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => saveStore(retailer, null)}
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Feather name="x" size={15} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {/* Success banner */}
      {success === "wishlist" ? (
        <View style={[styles.successRow, { backgroundColor: accentColor + "12", borderColor: accentColor + "30" }]}>
          <Feather name="check-circle" size={14} color={accentColor} />
          <Text style={[styles.successText, { color: accentColor }]}>
            {items.length} item{items.length !== 1 ? "s" : ""} sent to {store.name}!
          </Text>
        </View>
      ) : (
        <View style={styles.actions}>
          <Pressable
            onPress={handleSendWishlist}
            disabled={working}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: accentColor, opacity: (pressed || working) ? 0.75 : 1, flex: 1 },
            ]}
          >
            {working ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="send" size={13} color="#fff" />
                <Text style={styles.primaryBtnText}>
                  Send {items.length} item{items.length !== 1 ? "s" : ""}
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={handleBookAppointment}
            disabled={working}
            style={({ pressed }) => [
              styles.outlineBtn,
              { borderColor: accentColor, opacity: (pressed || working) ? 0.75 : 1 },
            ]}
          >
            <Feather name="calendar" size={13} color={accentColor} />
            <Text style={[styles.outlineBtnText, { color: accentColor }]}>Book Appt</Text>
          </Pressable>
        </View>
      )}

      {/* Change link */}
      <Pressable
        onPress={() => router.push(`/store-picker?retailer=${encodeURIComponent(banner)}` as any)}
        hitSlop={8}
        style={styles.changeRow}
      >
        <Text style={[styles.changeText, { color: colors.mutedForeground }]}>Change store</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  setStoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 6,
  },
  setStoreIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  setStorePrimary: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  setStoreSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1, lineHeight: 15 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 6,
    padding: 12,
    gap: 10,
  },
  storeRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  badgeText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  storeName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  storeAddr: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  storeMeta: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  metaText: { fontSize: 10, fontFamily: "Inter_400Regular" },

  successRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  successText: { fontSize: 12, fontFamily: "Inter_500Medium", flex: 1 },

  actions: { flexDirection: "row", gap: 8 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 38,
    borderRadius: 10,
  },
  primaryBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#fff" },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  outlineBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  changeRow: { alignSelf: "flex-start" },
  changeText: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
