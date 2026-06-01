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
import { AppointmentSheet } from "@/components/AppointmentSheet";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { usePreferredStore, type PreferredStore } from "@/hooks/usePreferredStore";
import { useProfile } from "@/hooks/useProfile";

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

function StoreRow({ store, wishlistCount }: { store: PreferredStore; wishlistCount: number }) {
  const colors = useColors();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { saveStore } = usePreferredStore();
  const bc = bannerColor(store.banner);

  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [showApptSheet, setShowApptSheet] = useState(false);
  const { wishlistItems } = useDiGe();
  const storeWishlist = wishlistItems.filter(
    (w) => !w.retailer || w.retailer === store.banner || store.banner.toLowerCase().includes((w.retailer ?? "").toLowerCase())
  );

  async function handleShareWishlist() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSharing(true);
    try {
      const token = await getToken();
      const payload = {
        storeId: store.id,
        type: "wishlist",
        data: {
          userName: profile.name || "DiaGe User",
          userEmail: profile.email || "",
          userPhone: profile.phone || "",
          ringSize: profile.ringSize || null,
          budgetRange: profile.budgetRange || null,
          wishlistItems: wishlistItems.slice(0, 20).map((w) => ({
            name: w.name,
            estimatedPrice: w.estimatedPrice,
            priority: w.priority,
            retailer: w.retailer,
            sku: w.sku,
            retailerUrl: w.retailerUrl,
          })),
          sharedAt: new Date().toISOString(),
        },
      };
      const res = await fetch(`${API_BASE}/store-share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Share failed");
      setShared(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setShared(false), 4000);
    } catch {
      Alert.alert("Couldn't send", "Please check your connection and try again.");
    } finally {
      setSharing(false);
    }
  }

  function handleBookAppointment() {
    setShowApptSheet(true);
  }

  return (
    <>
    <AppointmentSheet
      visible={showApptSheet}
      store={store}
      retailer={store.banner}
      items={wishlistItems}
      onClose={() => setShowApptSheet(false)}
      onSent={() => {}}
    />
    <View style={[styles.storeBlock, { borderTopColor: colors.border }]}>
      {/* Store info row */}
      <View style={styles.storeRow}>
        <View style={[styles.storeBadge, { backgroundColor: `${bc}18` }]}>
          <Text style={[styles.storeBadgeText, { color: bc }]}>{storeInitial(store.banner)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>{store.name}</Text>
          <Text style={[styles.storeAddress, { color: colors.mutedForeground }]} numberOfLines={1}>{store.address}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
            <Feather name="navigation" size={9} color={colors.mutedForeground} />
            <Text style={[styles.storeMeta, { color: colors.mutedForeground }]}>{store.distanceMi} mi · {store.phone}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => saveStore(store.banner, null)}
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Feather name="x-circle" size={16} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {/* Success banner or actions */}
      {shared ? (
        <View style={[styles.successBanner, { backgroundColor: `${bc}12`, borderColor: `${bc}30` }]}>
          <Feather name="check-circle" size={15} color={bc} />
          <Text style={[styles.successText, { color: bc }]}>
            Wishlist sent to {store.name}! An associate will reach out soon.
          </Text>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleShareWishlist}
            disabled={sharing || wishlistCount === 0}
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: bc, opacity: (pressed || sharing || wishlistCount === 0) ? 0.7 : 1, flex: 1 },
            ]}
          >
            {sharing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="send" size={13} color="#fff" />
                <Text style={styles.actionBtnText}>
                  {wishlistCount === 0 ? "Empty Wishlist" : `Send Wishlist (${wishlistCount})`}
                </Text>
              </>
            )}
          </Pressable>
          <Pressable
            onPress={handleBookAppointment}
            disabled={sharing}
            style={({ pressed }) => [
              styles.actionBtnOutline,
              { borderColor: bc, opacity: (pressed || sharing) ? 0.7 : 1 },
            ]}
          >
            <Feather name="calendar" size={13} color={bc} />
            <Text style={[styles.actionBtnOutlineText, { color: bc }]}>Book Appt</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        onPress={() => router.push(`/store-picker?retailer=${encodeURIComponent(store.banner)}` as any)}
        hitSlop={8}
        style={styles.changeLink}
      >
        <Text style={[styles.changeLinkText, { color: colors.mutedForeground }]}>Change store</Text>
      </Pressable>
    </View>
    </>
  );
}

export function MyStoreCard() {
  const colors = useColors();
  const { stores } = usePreferredStore();
  const { wishlistItems } = useDiGe();
  const linkedStores = Object.values(stores);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { backgroundColor: linkedStores.length > 0 ? "#5B21B618" : colors.secondary }]}>
          <Feather name="map-pin" size={15} color={linkedStores.length > 0 ? "#5B21B6" : colors.mutedForeground} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Stores</Text>
          {linkedStores.length > 0 && (
            <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
              {linkedStores.length} {linkedStores.length === 1 ? "retailer" : "retailers"} linked
            </Text>
          )}
        </View>
        {linkedStores.length > 0 && (
          <Pressable
            onPress={() => router.push("/(tabs)/wishlist" as any)}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text style={[styles.addLink, { color: "#5B21B6" }]}>+ Add</Text>
          </Pressable>
        )}
      </View>

      {linkedStores.length === 0 ? (
        <View style={[styles.emptyInner, { borderTopColor: colors.border }]}>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Link Signet stores to your wishlist retailers to send wishlists, book appointments, and receive personalised outreach. Set them per-retailer in your Wishlist tab.
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/wishlist" as any)}
            style={({ pressed }) => [styles.findBtn, { backgroundColor: "#5B21B6", opacity: pressed ? 0.88 : 1 }]}
          >
            <Feather name="heart" size={14} color="#fff" />
            <Text style={styles.findBtnText}>Go to Wishlist</Text>
          </Pressable>
        </View>
      ) : (
        linkedStores.map((s) => (
          <StoreRow
            key={s.id}
            store={s}
            wishlistCount={wishlistItems.length}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  iconWrap: {
    width: 30, height: 30, borderRadius: 9,
    alignItems: "center", justifyContent: "center",
  },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  sectionSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  addLink: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  emptyInner: { borderTopWidth: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19, marginBottom: 14 },
  findBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7,
    height: 44, borderRadius: 12,
  },
  findBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },
  storeBlock: { borderTopWidth: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 12 },
  storeRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  storeBadge: {
    width: 38, height: 38, borderRadius: 11,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  storeBadgeText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  storeName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  storeAddress: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  storeMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  actionRow: { flexDirection: "row", gap: 8 },
  actionBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    height: 42, borderRadius: 11,
  },
  actionBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
  actionBtnOutline: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    height: 42, borderRadius: 11, borderWidth: 1.5, paddingHorizontal: 14,
  },
  actionBtnOutlineText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  successBanner: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    padding: 12, borderRadius: 11, borderWidth: 1,
  },
  successText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 18 },
  changeLink: { alignSelf: "flex-start" },
  changeLinkText: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
