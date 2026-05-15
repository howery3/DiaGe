import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { capture } from "@/utils/posthog";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
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

export default function RetailerDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { name: encodedName, tab } = useLocalSearchParams<{ name: string; tab?: string }>();
  const retailerName = decodeURIComponent(encodedName ?? "");
  const isUncategorized = retailerName === "Uncategorized";
  const { profile, hasProfile } = useProfile();

  const { pieces, wishlistItems, deleteWishlistItem } = useDiGe();
  const [fabOpen, setFabOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"vault" | "wishlist">(tab === "wishlist" ? "wishlist" : "vault");

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

  async function handleFab() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFabOpen((v) => !v);
  }

  async function shareWishlist(includeContact: boolean) {
    const items = retailerWishlist;
    if (!items.length) return;

    const header = `💍 ${retailerName} Wishlist — ${items.length} item${items.length > 1 ? "s" : ""}`;
    const divider = "─────────────────────";

    const itemLines = items.map((item: WishlistItem, i: number) => {
      const parts: string[] = [`${i + 1}. ${item.name}`];
      if (item.sku) parts.push(`   SKU: ${item.sku}`);
      const meta: string[] = [];
      if (item.brand) meta.push(item.brand);
      if (item.type) meta.push(item.type);
      if (meta.length) parts.push(`   ${meta.join(" · ")}`);
      if (item.estimatedPrice) parts.push(`   $${item.estimatedPrice}`);
      if (item.retailerUrl) {
        try {
          const domain = new URL(item.retailerUrl).hostname.replace(/^www\./, "");
          parts.push(`   ${domain}`);
        } catch {
          // skip malformed URL
        }
      }
      if (item.notes) parts.push(`   ${item.notes}`);
      return parts.join("\n");
    });

    const lines = [header, "", ...itemLines];

    if (includeContact) {
      lines.push("");
      lines.push(divider);
      if (profile.name) lines.push(`From: ${profile.name}`);
      if (profile.phone) lines.push(`📞 ${profile.phone}`);
      if (profile.email) lines.push(`📧 ${profile.email}`);
    }

    lines.push("");
    lines.push("Shared via DiaGe 💎");

    await Share.share({
      message: lines.join("\n"),
      title: `${retailerName} Wishlist`,
    });
    capture("wishlist_shared", {
      retailer: retailerName,
      item_count: retailerWishlist.length,
      with_contact: includeContact,
    });
  }

  async function handleShareList() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!retailerWishlist.length) return;
    if (hasProfile) {
      Alert.alert(
        "Share Wishlist",
        `Share your ${retailerName} wishlist (${retailerWishlist.length} item${retailerWishlist.length > 1 ? "s" : ""})?`,
        [
          { text: "Share anonymously", onPress: () => shareWishlist(false) },
          { text: "Include my contact info", onPress: () => shareWishlist(true) },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } else {
      await shareWishlist(false);
    }
  }

  async function handleMoreMenu() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const hasWishlist = retailerWishlist.length > 0;

    const options = [
      "Cancel",
      ...(hasWishlist ? ["Share Wishlist"] : []),
      "QR Code for In-Store",
      "Partner Stats Snapshot",
      ...(hasWishlist ? ["Find Nearest Store"] : []),
    ];

    const run = (label: string) => {
      if (label === "Share Wishlist") handleShareList();
      if (label === "QR Code for In-Store") router.push(`/retailer/qr?name=${encoded}` as never);
      if (label === "Partner Stats Snapshot") router.push(`/retailer/stats?name=${encoded}` as never);
      if (label === "Find Nearest Store") router.push(`/retailer/nearest-store?name=${encoded}` as never);
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 0 },
        (i) => { if (i > 0) run(options[i]); }
      );
    } else {
      Alert.alert(retailerName, "Choose an action", [
        ...(hasWishlist ? [{ text: "Share Wishlist", onPress: () => handleShareList() }] : []),
        { text: "QR Code for In-Store", onPress: () => router.push(`/retailer/qr?name=${encoded}` as never) },
        { text: "Partner Stats Snapshot", onPress: () => router.push(`/retailer/stats?name=${encoded}` as never) },
        ...(hasWishlist ? [{ text: "Find Nearest Store", onPress: () => router.push(`/retailer/nearest-store?name=${encoded}` as never) }] : []),
        { text: "Cancel", style: "cancel" as const },
      ]);
    }
  }

  const encoded = encodeURIComponent(retailerName);

  return (
    <>
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
