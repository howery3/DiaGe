import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { captureRef } from "react-native-view-shot";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useDiGe,
  type WishlistItem,
  type InspectionReminder,
  type JewelryPiece,
} from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";

const PRIMARY = "#5B21B6";
const PRIMARY_DARK = "#4C1D95";
const PRIORITY_COLORS = { low: "#15803D", medium: "#B45309", high: "#DC2626" };
const CARD_WIDTH = 360;

export default function RetailerStatsScreen() {
  const { name: encodedName } = useLocalSearchParams<{ name: string }>();
  const retailerName = decodeURIComponent(encodedName ?? "");
  const encoded = encodedName ?? "";
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces, wishlistItems, reminders } = useDiGe();
  const { profile } = useProfile();

  const scrollRef = useRef<ScrollView>(null);
  const wishlistSectionRef = useRef<View>(null);
  const warrantySectionRef = useRef<View>(null);
  const reminderSectionRef = useRef<View>(null);
  const snapshotCardRef = useRef<View>(null);

  const retailerPieces = pieces.filter(
    (p) => p.retailer.trim() === retailerName
  );
  const retailerWishlist = wishlistItems.filter(
    (w) => w.retailer.trim() === retailerName
  );
  const retailerReminders = reminders.filter(
    (r) => r.retailer.trim() === retailerName && !r.isCompleted
  );
  const warrantyPieces = retailerPieces.filter(
    (p) => p.goldWarrantyType !== "none" || !!p.diamondBondNumber
  );

  const totalValue = retailerPieces
    .map((p) => parseFloat(p.purchasePrice.replace(/[^0-9.]/g, "") || "0"))
    .reduce((a, b) => a + b, 0);
  const docsCount = retailerPieces.reduce(
    (sum, p) => sum + (p.documents?.length ?? 0),
    0
  );

  const snapshotDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  function scrollTo(ref: React.RefObject<View | null>) {
    ref.current?.measureLayout(
      scrollRef.current as never,
      (_x, y) => scrollRef.current?.scrollTo({ y: y - 16, animated: true }),
      () => {}
    );
  }

  async function handleShareSnapshot() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const uri = await captureRef(snapshotCardRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: `${retailerName} Snapshot`,
        });
      } else {
        Alert.alert("Sharing not available", "Your device doesn't support image sharing.");
      }
    } catch {
      Alert.alert("Couldn't capture snapshot", "Please try again.");
    }
  }

  const stats: {
    icon: React.ComponentProps<typeof Feather>["name"];
    label: string;
    value: string;
    color: string;
    badge?: string;
    onPress: () => void;
  }[] = [
    {
      icon: "box",
      label: "Pieces Owned",
      value: String(retailerPieces.length),
      color: PRIMARY,
      onPress: () => router.push(`/retailer/${encoded}?tab=vault` as never),
    },
    {
      icon: "heart",
      label: "Wishlist Items",
      value: String(retailerWishlist.length),
      color: "#7C3AED",
      onPress: () => scrollTo(wishlistSectionRef),
    },
    {
      icon: "shield",
      label: "Active Warranties",
      value: String(warrantyPieces.length),
      color: "#0E6655",
      badge: warrantyPieces.length > 0 ? "tap to view" : undefined,
      onPress: () => {
        if (warrantyPieces.length > 0) scrollTo(warrantySectionRef);
        else router.push(`/retailer/${encoded}?tab=vault` as never);
      },
    },
    {
      icon: "bell",
      label: "Reminders",
      value: String(retailerReminders.length),
      color: "#B45309",
      badge: retailerReminders.length > 0 ? "tap to view" : undefined,
      onPress: () => {
        if (retailerReminders.length > 0) scrollTo(reminderSectionRef);
        else router.push("/(tabs)/reminders" as never);
      },
    },
    {
      icon: "file-text",
      label: "Documents",
      value: String(docsCount),
      color: "#1D4ED8",
      onPress: () => router.push(`/retailer/${encoded}?tab=vault` as never),
    },
    ...(totalValue > 0
      ? [{
          icon: "dollar-sign" as const,
          label: "Value Tracked",
          value: `$${totalValue.toLocaleString()}`,
          color: "#065F46",
          onPress: () => router.push(`/retailer/${encoded}?tab=vault` as never),
        }]
      : []),
  ];

  const previewWishlist = retailerWishlist.slice(0, 4);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Snapshot",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />

      {/* Off-screen snapshot card — captured as an image when shared */}
      <View
        ref={snapshotCardRef}
        collapsable={false}
        style={snap.card}
        pointerEvents="none"
      >
        {/* Header */}
        <View style={snap.header}>
          <View style={snap.headerTop}>
            <View style={snap.diamondBadge}>
              <Text style={snap.diamondText}>💎</Text>
            </View>
            <View style={snap.headerTextBlock}>
              <Text style={snap.brandName}>DiaGe</Text>
              <Text style={snap.snapshotLabel}>Customer Snapshot</Text>
            </View>
          </View>
          <Text style={snap.retailerName}>{retailerName}</Text>
          {profile.name ? (
            <Text style={snap.customerName}>{profile.name}</Text>
          ) : null}
          <Text style={snap.dateText}>{snapshotDate}</Text>
        </View>

        {/* Stats row */}
        <View style={snap.statsRow}>
          <View style={snap.statItem}>
            <Text style={snap.statValue}>{retailerPieces.length}</Text>
            <Text style={snap.statLabel}>Pieces{"\n"}Owned</Text>
          </View>
          <View style={snap.statDivider} />
          <View style={snap.statItem}>
            <Text style={snap.statValue}>{retailerWishlist.length}</Text>
            <Text style={snap.statLabel}>Wishlist{"\n"}Items</Text>
          </View>
          <View style={snap.statDivider} />
          <View style={snap.statItem}>
            <Text style={snap.statValue}>{warrantyPieces.length}</Text>
            <Text style={snap.statLabel}>Active{"\n"}Warranties</Text>
          </View>
          {totalValue > 0 && (
            <>
              <View style={snap.statDivider} />
              <View style={snap.statItem}>
                <Text style={[snap.statValue, { fontSize: 15 }]}>${totalValue.toLocaleString()}</Text>
                <Text style={snap.statLabel}>Value{"\n"}Tracked</Text>
              </View>
            </>
          )}
        </View>

        {/* Wishlist preview */}
        {previewWishlist.length > 0 && (
          <View style={snap.wishlistSection}>
            <Text style={snap.wishlistTitle}>💍 Wishlist</Text>
            {previewWishlist.map((item) => (
              <View key={item.id} style={snap.wishlistRow}>
                <View style={[snap.priorityDot, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
                <View style={snap.wishlistInfo}>
                  <Text style={snap.wishlistName} numberOfLines={1}>{item.name}</Text>
                  {item.sku ? <Text style={snap.wishlistSku}>SKU {item.sku}</Text> : null}
                </View>
                {item.estimatedPrice ? (
                  <Text style={snap.wishlistPrice}>${item.estimatedPrice}</Text>
                ) : null}
              </View>
            ))}
            {retailerWishlist.length > 4 && (
              <Text style={snap.moreItems}>+{retailerWishlist.length - 4} more items</Text>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={snap.footer}>
          <Text style={snap.footerText}>Powered by DiaGe · diageapp.com</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: PRIMARY }]}>
          <View style={styles.heroIcon}>
            <Feather name="bar-chart-2" size={24} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>{retailerName}</Text>
          <Text style={styles.heroSub}>Tap any section to dive in</Text>
        </View>

        {/* Interactive stat grid */}
        <View style={styles.grid}>
          {stats.map((s) => (
            <Pressable
              key={s.label}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                s.onPress();
              }}
              style={({ pressed }) => [
                styles.statCard,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <View style={[styles.statIcon, { backgroundColor: s.color + "18" }]}>
                <Feather name={s.icon} size={16} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              <View style={styles.statChevron}>
                <Feather name="chevron-right" size={12} color={s.color} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Wishlist section */}
        {retailerWishlist.length > 0 && (
          <View ref={wishlistSectionRef}>
            <View style={[styles.sectionHeader]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Wishlist</Text>
              <Pressable onPress={() => router.push(`/retailer/${encoded}?tab=wishlist` as never)} hitSlop={8}>
                <Text style={[styles.sectionLink, { color: colors.primary }]}>View all</Text>
              </Pressable>
            </View>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {retailerWishlist.map((item: WishlistItem, i: number) => (
                <View
                  key={item.id}
                  style={[
                    styles.wishlistRow,
                    { borderTopColor: colors.border, borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth },
                  ]}
                >
                  <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
                  <View style={styles.wishlistInfo}>
                    <Text style={[styles.wishlistName, { color: colors.foreground }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.sku ? (
                      <Text style={[styles.wishlistSku, { color: colors.mutedForeground }]}>SKU {item.sku}</Text>
                    ) : null}
                    {(item.brand || item.type) ? (
                      <Text style={[styles.wishlistMeta, { color: colors.mutedForeground }]}>
                        {[item.brand, item.type].filter(Boolean).join(" · ")}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.wishlistRight}>
                    {item.estimatedPrice ? (
                      <Text style={[styles.wishlistPrice, { color: PRIMARY }]}>${item.estimatedPrice}</Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Active warranties section */}
        {warrantyPieces.length > 0 && (
          <View ref={warrantySectionRef}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Warranties</Text>
              <Pressable onPress={() => router.push(`/retailer/${encoded}?tab=vault` as never)} hitSlop={8}>
                <Text style={[styles.sectionLink, { color: colors.primary }]}>View vault</Text>
              </Pressable>
            </View>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {warrantyPieces.map((piece: JewelryPiece, i: number) => (
                <Pressable
                  key={piece.id}
                  onPress={() => router.push(`/piece/${piece.id}` as never)}
                  style={({ pressed }) => [
                    styles.warrantyRow,
                    {
                      borderTopColor: colors.border,
                      borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <View style={[styles.warrantyIcon, { backgroundColor: "#0E665518" }]}>
                    <Feather name="shield" size={14} color="#0E6655" />
                  </View>
                  <View style={styles.warrantyInfo}>
                    <Text style={[styles.warrantyName, { color: colors.foreground }]} numberOfLines={1}>
                      {piece.name}
                    </Text>
                    <Text style={[styles.warrantyMeta, { color: colors.mutedForeground }]}>
                      {[
                        piece.goldWarrantyType !== "none" ? "Gold Warranty" : null,
                        piece.diamondBondNumber ? "Diamond Bond" : null,
                      ].filter(Boolean).join(" · ")}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Upcoming reminders section */}
        {retailerReminders.length > 0 && (
          <View ref={reminderSectionRef}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Reminders</Text>
              <Pressable onPress={() => router.push("/(tabs)/reminders" as never)} hitSlop={8}>
                <Text style={[styles.sectionLink, { color: colors.primary }]}>View all</Text>
              </Pressable>
            </View>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {retailerReminders.map((r: InspectionReminder, i: number) => {
                const date = r.scheduledDate
                  ? new Date(r.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : null;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => router.push("/(tabs)/reminders" as never)}
                    style={({ pressed }) => [
                      styles.reminderRow,
                      {
                        borderTopColor: colors.border,
                        borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.reminderIcon, { backgroundColor: "#B4530918" }]}>
                      <Feather name="bell" size={14} color="#B45309" />
                    </View>
                    <View style={styles.reminderInfo}>
                      <Text style={[styles.reminderName, { color: colors.foreground }]} numberOfLines={1}>
                        {r.jewelryName}
                      </Text>
                      {date ? (
                        <Text style={[styles.reminderDate, { color: colors.mutedForeground }]}>{date}</Text>
                      ) : null}
                    </View>
                    <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Share snapshot button */}
        <Pressable
          onPress={handleShareSnapshot}
          style={({ pressed }) => [
            styles.shareBtn,
            { backgroundColor: PRIMARY, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="image" size={18} color="#fff" />
          <Text style={styles.shareBtnText}>Share Snapshot</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 20 },

  hero: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff", textAlign: "center" },
  heroSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    flex: 1,
    minWidth: "44%",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    position: "relative",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textAlign: "center" },
  statChevron: { position: "absolute", top: 10, right: 10 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  sectionLink: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },

  wishlistRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  priorityDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  wishlistInfo: { flex: 1, gap: 2 },
  wishlistName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  wishlistSku: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 0.5 },
  wishlistMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  wishlistRight: { alignItems: "flex-end", gap: 6 },
  wishlistPrice: { fontSize: 13, fontFamily: "Inter_700Bold" },

  warrantyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  warrantyIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  warrantyInfo: { flex: 1, gap: 2 },
  warrantyName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  warrantyMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },

  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  reminderIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  reminderInfo: { flex: 1, gap: 2 },
  reminderName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  reminderDate: { fontSize: 12, fontFamily: "Inter_400Regular" },

  shareBtn: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },
  shareBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
});

const snap = StyleSheet.create({
  card: {
    position: "absolute",
    left: -2000,
    top: 0,
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 0,
    overflow: "hidden",
  },
  header: {
    backgroundColor: PRIMARY_DARK,
    padding: 24,
    gap: 6,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  diamondBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  diamondText: { fontSize: 20 },
  headerTextBlock: { gap: 2 },
  brandName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.3,
  },
  snapshotLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  retailerName: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  customerName: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  dateText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#F8F7FF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3F5",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 18,
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E8E3F5",
    marginVertical: 14,
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: PRIMARY_DARK,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: "#7C6FA0",
    textAlign: "center",
    lineHeight: 14,
  },

  wishlistSection: {
    padding: 20,
    gap: 10,
    backgroundColor: "#fff",
  },
  wishlistTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  wishlistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#F0ECF8",
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    flexShrink: 0,
  },
  wishlistInfo: { flex: 1, gap: 1 },
  wishlistName: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#1A1A2E",
  },
  wishlistSku: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "#9989BF",
    letterSpacing: 0.3,
  },
  wishlistPrice: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: PRIMARY,
  },
  moreItems: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#9989BF",
    textAlign: "center",
    marginTop: 4,
  },

  footer: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 12,
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
