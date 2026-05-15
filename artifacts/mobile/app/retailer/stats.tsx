import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe, type WishlistItem } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

const PRIMARY = "#5B21B6";

export default function RetailerStatsScreen() {
  const { name: encodedName } = useLocalSearchParams<{ name: string }>();
  const retailerName = decodeURIComponent(encodedName ?? "");
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces, wishlistItems, reminders } = useDiGe();

  const retailerPieces = pieces.filter(
    (p) => p.retailer.trim() === retailerName
  );
  const retailerWishlist = wishlistItems.filter(
    (w) => w.retailer.trim() === retailerName
  );
  const retailerReminders = reminders.filter(
    (r) => r.retailer.trim() === retailerName
  );

  const totalValue = retailerPieces
    .map((p) => parseFloat(p.purchasePrice.replace(/[^0-9.]/g, "") || "0"))
    .reduce((a, b) => a + b, 0);

  const warrantyCount = retailerPieces.filter(
    (p) => p.goldWarrantyType !== "none" || !!p.diamondBondNumber
  ).length;

  const docsCount = retailerPieces.reduce(
    (sum, p) => sum + (p.documents?.length ?? 0),
    0
  );

  async function handleShare() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const date = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const lines: string[] = [
      `📊 DiaGe Customer Snapshot — ${retailerName}`,
      `Generated: ${date}`,
      "─".repeat(30),
      "",
      "VAULT ACTIVITY",
      `• ${retailerPieces.length} piece${retailerPieces.length !== 1 ? "s" : ""} purchased from ${retailerName}`,
      ...(totalValue > 0
        ? [`• Total documented value: $${totalValue.toLocaleString()}`]
        : []),
      `• ${warrantyCount} active warranty/bond${warrantyCount !== 1 ? "s" : ""} tracked`,
      `• ${docsCount} document${docsCount !== 1 ? "s" : ""} stored (receipts, certificates, appraisals)`,
      "",
      "WISHLIST",
      `• ${retailerWishlist.length} item${retailerWishlist.length !== 1 ? "s" : ""} saved`,
      ...retailerWishlist.slice(0, 6).map(
        (w: WishlistItem) =>
          `  – ${w.name}${w.estimatedPrice ? ` ($${w.estimatedPrice})` : ""}${w.priority === "high" ? " ⭐ High priority" : ""}`
      ),
      "",
      "REMINDERS",
      `• ${retailerReminders.length} inspection/service reminder${retailerReminders.length !== 1 ? "s" : ""} set`,
      "",
      "─".repeat(30),
      "Powered by DiaGe — Jewelry Vault & Clienteling App",
      `This snapshot represents one customer's documented relationship with ${retailerName}.`,
    ];

    await Share.share({
      message: lines.join("\n"),
      title: `DiaGe Snapshot — ${retailerName}`,
    });
  }

  const stats = [
    {
      icon: "box" as const,
      label: "Pieces Owned",
      value: String(retailerPieces.length),
      color: PRIMARY,
    },
    {
      icon: "heart" as const,
      label: "Wishlist Items",
      value: String(retailerWishlist.length),
      color: "#7C3AED",
    },
    {
      icon: "shield" as const,
      label: "Active Warranties",
      value: String(warrantyCount),
      color: "#0E6655",
    },
    {
      icon: "bell" as const,
      label: "Reminders",
      value: String(retailerReminders.length),
      color: "#B45309",
    },
    {
      icon: "file-text" as const,
      label: "Documents Stored",
      value: String(docsCount),
      color: "#1D4ED8",
    },
    ...(totalValue > 0
      ? [
          {
            icon: "dollar-sign" as const,
            label: "Documented Value",
            value: `$${totalValue.toLocaleString()}`,
            color: "#065F46",
          },
        ]
      : []),
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Partner Snapshot",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Feather name="bar-chart-2" size={24} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>{retailerName}</Text>
          <Text style={styles.heroSub}>Customer engagement snapshot</Text>
        </View>

        <View style={styles.grid}>
          {stats.map((s) => (
            <View
              key={s.label}
              style={[
                styles.statCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: s.color + "18" },
                ]}
              >
                <Feather name={s.icon} size={16} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {s.value}
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.mutedForeground }]}
              >
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {retailerWishlist.length > 0 && (
          <View
            style={[
              styles.section,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Saved Wishlist Items
            </Text>
            {retailerWishlist.map((item: WishlistItem, i: number) => (
              <View
                key={item.id}
                style={[
                  styles.wishlistRow,
                  {
                    borderTopColor: colors.border,
                    borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <View style={styles.wishlistInfo}>
                  <Text
                    style={[styles.wishlistName, { color: colors.foreground }]}
                  >
                    {item.name}
                  </Text>
                  {(item.brand || item.type) ? (
                    <Text
                      style={[
                        styles.wishlistMeta,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {[item.brand, item.type].filter(Boolean).join(" · ")}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.wishlistRight}>
                  {item.estimatedPrice ? (
                    <Text
                      style={[
                        styles.wishlistPrice,
                        { color: colors.primary },
                      ]}
                    >
                      ${item.estimatedPrice}
                    </Text>
                  ) : null}
                  {item.priority === "high" ? (
                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityText}>High</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        <View
          style={[styles.note, { backgroundColor: colors.muted }]}
        >
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text
            style={[styles.noteText, { color: colors.mutedForeground }]}
          >
            Share this snapshot with your {retailerName} sales associate to personalize your next visit — they can see exactly what you love and what you already own.
          </Text>
        </View>

        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            styles.shareBtn,
            { backgroundColor: PRIMARY, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="share-2" size={18} color="#fff" />
          <Text style={styles.shareBtnText}>Share Snapshot with Store</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    gap: 20,
  },
  hero: {
    backgroundColor: PRIMARY,
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
  heroTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "44%",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    padding: 16,
    paddingBottom: 12,
  },
  wishlistRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wishlistInfo: {
    flex: 1,
    gap: 2,
  },
  wishlistName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  wishlistMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  wishlistRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  wishlistPrice: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "#FEF3C7",
  },
  priorityText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: "#92400E",
  },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 12,
    padding: 14,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  shareBtn: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  shareBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
});
