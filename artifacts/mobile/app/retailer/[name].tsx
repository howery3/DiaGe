import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { captureRef } from "react-native-view-shot";
import { capture } from "@/utils/posthog";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { JewelryCard } from "@/components/JewelryCard";
import { WishlistCard } from "@/components/WishlistCard";
import { EmptyState } from "@/components/EmptyState";
import { useDiGe, type WishlistItem } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";

const PRIMARY = "#5B21B6";
const PRIMARY_DARK = "#4C1D95";
const PRIORITY_COLORS = { low: "#15803D", medium: "#B45309", high: "#DC2626" };
const CARD_WIDTH = 360;

export default function RetailerDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { name: encodedName, tab } = useLocalSearchParams<{ name: string; tab?: string }>();
  const retailerName = decodeURIComponent(encodedName ?? "");
  const isUncategorized = retailerName === "Uncategorized";
  const { profile } = useProfile();

  const { pieces, wishlistItems, deleteWishlistItem } = useDiGe();
  const [fabOpen, setFabOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"vault" | "wishlist">(tab === "wishlist" ? "wishlist" : "vault");
  const wishlistShareRef = useRef<View>(null);

  const retailerPieces = useMemo(
    () =>
      pieces.filter((p) =>
        isUncategorized ? !p.retailer.trim() : p.retailer.trim() === retailerName
      ),
    [pieces, retailerName, isUncategorized]
  );

  const retailerWishlist = useMemo(
    () =>
      wishlistItems.filter((w) =>
        isUncategorized ? !w.retailer.trim() : w.retailer.trim() === retailerName
      ),
    [wishlistItems, retailerName, isUncategorized]
  );

  const hasContact = !!(profile.name || profile.phone || profile.email);
  const shareDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  async function handleFab() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFabOpen((v) => !v);
  }

  async function handleShareList() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!retailerWishlist.length) return;
    try {
      const uri = await captureRef(wishlistShareRef, { format: "png", quality: 1, result: "tmpfile" });
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: `${retailerName} Wishlist` });
        capture("wishlist_shared", { retailer: retailerName, item_count: retailerWishlist.length });
      } else {
        Alert.alert("Sharing not available", "Your device doesn't support image sharing.");
      }
    } catch {
      Alert.alert("Couldn't capture wishlist", "Please try again.");
    }
  }

  async function handleMoreMenu() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const hasWishlist = retailerWishlist.length > 0;

    const options = [
      "Cancel",
      ...(hasWishlist ? ["Share Wishlist"] : []),
      "My Snapshot",
    ];

    const run = (label: string) => {
      if (label === "Share Wishlist") handleShareList();
      if (label === "My Snapshot") router.push(`/retailer/stats?name=${encoded}` as never);
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 0 },
        (i) => { if (i > 0) run(options[i]); }
      );
    } else {
      Alert.alert(retailerName, "Choose an action", [
        ...(hasWishlist ? [{ text: "Share Wishlist", onPress: () => handleShareList() }] : []),
        { text: "My Snapshot", onPress: () => router.push(`/retailer/stats?name=${encoded}` as never) },
        { text: "Cancel", style: "cancel" as const },
      ]);
    }
  }

  const encoded = encodeURIComponent(retailerName);

  return (
    <>
      {/* Off-screen full wishlist share card */}
      <View ref={wishlistShareRef} collapsable={false} style={snap.card} pointerEvents="none">
        {/* Header */}
        <View style={snap.header}>
          <View style={snap.headerRow}>
            <View style={snap.logoBadge}>
              <Text style={snap.logoEmoji}>💎</Text>
            </View>
            <View style={snap.headerText}>
              <Text style={snap.brandName}>DiaGe</Text>
              <Text style={snap.headerSub}>Wishlist</Text>
            </View>
          </View>
          <Text style={snap.retailerName}>{retailerName}</Text>
          <Text style={snap.metaLine}>
            {retailerWishlist.length} item{retailerWishlist.length !== 1 ? "s" : ""} · {shareDate}
          </Text>
        </View>

        {/* Items */}
        <View style={snap.itemsSection}>
          {retailerWishlist.map((item: WishlistItem, i: number) => (
            <View
              key={item.id}
              style={[snap.itemRow, i > 0 && snap.itemRowBorder]}
            >
              <View style={snap.itemLeft}>
                <Text style={snap.itemNum}>{i + 1}</Text>
                <View style={[snap.dot, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
              </View>
              <View style={snap.itemInfo}>
                <Text style={snap.itemName} numberOfLines={2}>{item.name}</Text>
                {item.sku ? <Text style={snap.itemSku}>SKU {item.sku}</Text> : null}
                {(item.brand || item.type) ? (
                  <Text style={snap.itemMeta}>{[item.brand, item.type].filter(Boolean).join(" · ")}</Text>
                ) : null}
                {item.notes ? <Text style={snap.itemNotes} numberOfLines={2}>{item.notes}</Text> : null}
              </View>
              {item.estimatedPrice ? (
                <Text style={snap.itemPrice}>${item.estimatedPrice}</Text>
              ) : null}
            </View>
          ))}
        </View>

        {/* Contact */}
        {hasContact ? (
          <View style={snap.contact}>
            {profile.name ? <Text style={snap.contactName}>{profile.name}</Text> : null}
            <View style={snap.contactRow}>
              {profile.phone ? <Text style={snap.contactDetail}>📞 {profile.phone}</Text> : null}
              {profile.email ? <Text style={snap.contactDetail}>📧 {profile.email}</Text> : null}
            </View>
          </View>
        ) : null}

        {/* Footer */}
        <View style={snap.footer}>
          <Text style={snap.footerText}>Powered by DiaGe · diageapp.com</Text>
        </View>
      </View>

      <Stack.Screen
        options={{
          title: retailerName,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
          headerRight: () =>
            isUncategorized ? null : (
              <Pressable
                onPress={handleMoreMenu}
                hitSlop={10}
                style={styles.headerShareBtn}
              >
                <Feather name="more-horizontal" size={24} color={colors.primary} />
              </Pressable>
            ),
        }}
      />

      {fabOpen ? (
        <Pressable
          style={[StyleSheet.absoluteFill, { zIndex: 9 }]}
          onPress={() => setFabOpen(false)}
        />
      ) : null}

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.segmentWrap, { backgroundColor: colors.muted }]}>
          <Pressable
            onPress={() => setActiveTab("vault")}
            style={[
              styles.segment,
              activeTab === "vault" && {
                backgroundColor: colors.card,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              },
            ]}
          >
            <Feather
              name="box"
              size={14}
              color={activeTab === "vault" ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === "vault" ? colors.primary : colors.mutedForeground },
              ]}
            >
              Vault
            </Text>
            {retailerPieces.length > 0 ? (
              <View
                style={[
                  styles.segBadge,
                  {
                    backgroundColor:
                      activeTab === "vault" ? colors.primary : colors.mutedForeground,
                  },
                ]}
              >
                <Text style={styles.segBadgeText}>{retailerPieces.length}</Text>
              </View>
            ) : null}
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("wishlist")}
            style={[
              styles.segment,
              activeTab === "wishlist" && {
                backgroundColor: colors.card,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              },
            ]}
          >
            <Feather
              name="heart"
              size={14}
              color={activeTab === "wishlist" ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === "wishlist" ? colors.primary : colors.mutedForeground },
              ]}
            >
              Wishlist
            </Text>
            {retailerWishlist.length > 0 ? (
              <View
                style={[
                  styles.segBadge,
                  {
                    backgroundColor:
                      activeTab === "wishlist" ? colors.primary : colors.mutedForeground,
                  },
                ]}
              >
                <Text style={styles.segBadgeText}>{retailerWishlist.length}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "vault" ? (
            retailerPieces.length > 0 ? (
              retailerPieces.map((piece) => (
                <JewelryCard
                  key={piece.id}
                  piece={piece}
                  onPress={() => router.push(`/piece/${piece.id}`)}
                />
              ))
            ) : (
              <View style={styles.emptyWrap}>
                <EmptyState
                  icon="box"
                  title="No pieces yet"
                  subtitle={
                    isUncategorized
                      ? "Pieces added without a retailer will appear here."
                      : `Add your first piece from ${retailerName} to your vault.`
                  }
                />
              </View>
            )
          ) : retailerWishlist.length > 0 ? (
            retailerWishlist.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onPress={() => {}}
                onEdit={() => router.push(`/wishlist-item/edit?id=${item.id}`)}
                onDelete={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  deleteWishlistItem(item.id);
                }}
              />
            ))
          ) : (
            <View style={styles.emptyWrap}>
              <EmptyState
                icon="heart"
                title="Wishlist is empty"
                subtitle={
                  isUncategorized
                    ? "Wishlist items added without a retailer will appear here."
                    : `Start saving pieces you love from ${retailerName}.`
                }
              />
            </View>
          )}
        </ScrollView>
      </View>

      <View style={[styles.fabArea, { bottom: insets.bottom + 100 }]}>
        {fabOpen ? (
          <View style={styles.fabMenu}>
            <Pressable
              onPress={() => {
                setFabOpen(false);
                router.push(
                  isUncategorized
                    ? "/wishlist-item/add"
                    : `/wishlist-item/add?retailer=${encoded}`
                );
              }}
              style={[
                styles.fabMenuItem,
                { backgroundColor: colors.card, borderColor: colors.primary, borderWidth: 1.5 },
              ]}
            >
              <Feather name="heart" size={16} color={colors.primary} />
              <Text style={[styles.fabMenuLabel, { color: colors.primary }]}>
                Add to Wishlist
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setFabOpen(false);
                router.push(
                  isUncategorized ? "/piece/add" : `/piece/add?retailer=${encoded}`
                );
              }}
              style={[styles.fabMenuItem, { backgroundColor: colors.primary }]}
            >
              <Feather name="box" size={16} color={colors.primaryForeground} />
              <Text style={[styles.fabMenuLabel, { color: colors.primaryForeground }]}>
                Add Jewelry Piece
              </Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          onPress={handleFab}
          style={[styles.fab, { backgroundColor: colors.primary }]}
        >
          <Feather name={fabOpen ? "x" : "plus"} size={24} color={colors.primaryForeground} />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerShareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingRight: 4,
  },
  headerShareText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  segmentWrap: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 14,
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
  },
  segmentText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  segBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  segBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#fff" },
  list: { paddingHorizontal: 20, flexGrow: 1 },
  emptyWrap: { flex: 1, minHeight: 300 },
  fabArea: {
    position: "absolute",
    right: 20,
    alignItems: "flex-end",
    gap: 10,
    zIndex: 10,
  },
  fabMenu: { alignItems: "flex-end", gap: 8, marginBottom: 4 },
  fabMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  fabMenuLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});

const snap = StyleSheet.create({
  card: {
    position: "absolute",
    left: -2000,
    top: 0,
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  header: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 18 },
  headerText: { gap: 1 },
  brandName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  retailerName: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.4,
  },
  metaLine: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
  },

  itemsSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    gap: 10,
  },
  itemRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#F0ECF8",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 2,
    width: 30,
  },
  itemNum: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: PRIMARY,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#1A1A2E", lineHeight: 20 },
  itemSku: { fontSize: 10, fontFamily: "Inter_500Medium", color: "#9989BF", letterSpacing: 0.3 },
  itemMeta: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#777" },
  itemNotes: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#888", lineHeight: 16, fontStyle: "italic" },
  itemPrice: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: PRIMARY,
    paddingTop: 2,
    flexShrink: 0,
  },

  contact: {
    backgroundColor: "#F8F7FF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E8E3F5",
    gap: 4,
  },
  contactName: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  contactDetail: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#555" },

  footer: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.3,
  },
});
