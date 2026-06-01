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
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { usePreferredStore, type PreferredStore } from "@/hooks/usePreferredStore";
import { useProfile } from "@/hooks/useProfile";
import type { WishlistItem } from "@/context/DiGeContext";

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`
  : "http://localhost:5000/api";

const BANNER_COLOR: Record<string, string> = {
  "Kay Jewelers": "#5B21B6",
  "Jared": "#0079F2",
  "Zales": "#D97706",
  "Banter by Piercing Pagoda": "#B91C1C",
};

function bannerColor(banner: string) {
  return BANNER_COLOR[banner] ?? "#5B21B6";
}

function storeInitial(banner: string) {
  if (banner.startsWith("Kay")) return "K";
  if (banner.startsWith("Jared")) return "J";
  if (banner.startsWith("Zales")) return "Z";
  return "B";
}

function bannerForRetailer(retailer: string): string {
  const r = retailer.toLowerCase();
  if (r.includes("kay")) return "Kay Jewelers";
  if (r.includes("jared")) return "Jared";
  if (r.includes("zales")) return "Zales";
  if (r.includes("banter") || r.includes("piercing pagoda")) return "Banter by Piercing Pagoda";
  return retailer;
}

interface StoreRowProps {
  store: PreferredStore;
  storeItems: WishlistItem[];
  saveStore: (key: string, s: PreferredStore | null) => void;
}

function StoreRow({ store, storeItems, saveStore }: StoreRowProps) {
  const colors = useColors();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const bc = bannerColor(store.banner);

  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  async function handleBookAppointment() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBooking(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/store-share`, {
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
            itemCount: storeItems.length,
            message: "I'd like to schedule a jewelry inspection appointment.",
            sharedAt: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setBooked(true);
      setTimeout(() => setBooked(false), 5000);
    } catch {
      Alert.alert("Couldn't send", "Please check your connection and try again.");
    } finally {
      setBooking(false);
    }
  }

  async function handleShareWishlist() {
    if (storeItems.length === 0) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSharing(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/store-share`, {
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
            wishlistItems: storeItems.slice(0, 20).map((w) => ({
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
      if (!res.ok) throw new Error("Share failed");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShared(true);
      setTimeout(() => setShared(false), 5000);
    } catch {
      Alert.alert("Couldn't send", "Please check your connection and try again.");
    } finally {
      setSharing(false);
    }
  }

  return (
    <View style={[styles.storeBlock, { borderTopColor: colors.border }]}>
      {/* Store identity row */}
      <View style={styles.storeRow}>
        <View style={[styles.storeBadge, { backgroundColor: `${bc}18` }]}>
          <Text style={[styles.storeBadgeText, { color: bc }]}>{storeInitial(store.banner)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>
            {store.name}
          </Text>
          <Text style={[styles.storeAddress, { color: colors.mutedForeground }]} numberOfLines={1}>
            {store.address}
          </Text>
          <Text style={[styles.storeDist, { color: colors.mutedForeground }]}>
            {store.distanceMi} mi away
          </Text>
        </View>
        <Pressable
          onPress={() => saveStore(store.banner, null)}
          hitSlop={14}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
        >
          <Feather name="x" size={16} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {/* Action area */}
      {booked ? (
        <View style={[styles.successBanner, { backgroundColor: `${bc}12`, borderColor: `${bc}30` }]}>
          <Feather name="check-circle" size={14} color={bc} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.successTitle, { color: bc }]}>Appointment request sent!</Text>
            <Text style={[styles.successSub, { color: bc + "BB" }]}>
              {store.name} will see this in their DiaGe Portal
            </Text>
          </View>
        </View>
      ) : shared ? (
        <View style={[styles.successBanner, { backgroundColor: `${bc}12`, borderColor: `${bc}30` }]}>
          <Feather name="check-circle" size={14} color={bc} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.successTitle, { color: bc }]}>Wishlist sent!</Text>
            <Text style={[styles.successSub, { color: bc + "BB" }]}>
              {store.name} can view it in their DiaGe Portal
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.actionCol}>
          {/* Primary: Book Appointment */}
          <Pressable
            onPress={handleBookAppointment}
            disabled={booking || sharing}
            style={({ pressed }) => [
              styles.bookBtn,
              { backgroundColor: bc, opacity: (pressed || booking || sharing) ? 0.75 : 1 },
            ]}
          >
            {booking ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="calendar" size={15} color="#fff" />
                <Text style={styles.bookBtnText}>Book Appointment</Text>
                <View style={styles.diageTag}>
                  <Text style={styles.diageTagText}>via DiaGe</Text>
                </View>
              </>
            )}
          </Pressable>

          {/* Secondary: Send Wishlist */}
          <Pressable
            onPress={handleShareWishlist}
            disabled={sharing || booking || storeItems.length === 0}
            style={({ pressed }) => [
              styles.wishlistBtn,
              {
                borderColor: storeItems.length === 0 ? colors.border : `${bc}60`,
                opacity: (pressed || sharing || storeItems.length === 0) ? 0.55 : 1,
              },
            ]}
          >
            {sharing ? (
              <ActivityIndicator size="small" color={bc} />
            ) : (
              <>
                <Feather
                  name="send"
                  size={13}
                  color={storeItems.length === 0 ? colors.mutedForeground : bc}
                />
                <Text
                  style={[
                    styles.wishlistBtnText,
                    { color: storeItems.length === 0 ? colors.mutedForeground : bc },
                  ]}
                >
                  {storeItems.length === 0
                    ? "Send Wishlist — no items yet"
                    : `Send Wishlist (${storeItems.length} item${storeItems.length !== 1 ? "s" : ""})`}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      )}

      {/* Change store link */}
      <Pressable
        onPress={() => router.push("/store-picker" as any)}
        hitSlop={8}
        style={styles.changeLink}
      >
        <Feather name="refresh-cw" size={11} color={colors.mutedForeground} />
        <Text style={[styles.changeLinkText, { color: colors.mutedForeground }]}>Change store</Text>
      </Pressable>
    </View>
  );
}

export function MyStoreCard() {
  const colors = useColors();
  const { stores, saveStore } = usePreferredStore();
  const { wishlistItems } = useDiGe();
  const linkedStores = Object.values(stores);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: linkedStores.length > 0 ? "#5B21B618" : colors.secondary },
          ]}
        >
          <Feather
            name="map-pin"
            size={15}
            color={linkedStores.length > 0 ? "#5B21B6" : colors.mutedForeground}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Preferred Store</Text>
          {linkedStores.length > 0 && (
            <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
              Tap Book Appointment to notify them via DiaGe
            </Text>
          )}
        </View>
        <Pressable
          onPress={() => router.push("/store-picker" as any)}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text style={[styles.addLink, { color: "#5B21B6" }]}>+ Add</Text>
        </Pressable>
      </View>

      {linkedStores.length === 0 ? (
        <View style={[styles.emptyInner, { borderTopColor: colors.border }]}>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Link a Signet store to book appointments and send your wishlist directly through DiaGe.
          </Text>
          <Pressable
            onPress={() => router.push("/store-picker" as any)}
            style={({ pressed }) => [
              styles.findBtn,
              { backgroundColor: "#5B21B6", opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Feather name="map-pin" size={14} color="#fff" />
            <Text style={styles.findBtnText}>Link a Store</Text>
          </Pressable>
        </View>
      ) : (
        linkedStores.map((s) => (
          <StoreRow
            key={s.id}
            store={s}
            storeItems={wishlistItems.filter(
              (w) => bannerForRetailer(w.retailer ?? "") === s.banner
            )}
            saveStore={saveStore}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  sectionSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  addLink: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  emptyInner: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    marginBottom: 14,
  },
  findBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    height: 46,
    borderRadius: 12,
  },
  findBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },
  storeBlock: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    gap: 12,
  },
  storeRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  storeBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  storeBadgeText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  storeName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  storeAddress: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  storeDist: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  actionCol: { gap: 8 },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 13,
  },
  bookBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
  diageTag: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  diageTagText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "#fff" },
  wishlistBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    height: 40,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  wishlistBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  successBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  successTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  successSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  changeLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
  },
  changeLinkText: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
