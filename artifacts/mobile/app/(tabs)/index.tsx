import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { useDiGe, type JewelryType } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

interface RetailerSummary {
  name: string;
  pieceCount: number;
  wishlistCount: number;
}

const TYPE_ICONS: Record<JewelryType, string> = {
  ring: "circle",
  necklace: "link",
  bracelet: "link-2",
  earrings: "star",
  watch: "clock",
  brooch: "award",
  other: "box",
};

const TYPE_LABELS: Record<JewelryType, string> = {
  ring: "Ring",
  necklace: "Necklace",
  bracelet: "Bracelet",
  earrings: "Earrings",
  watch: "Watch",
  brooch: "Brooch",
  other: "Other",
};

function parsePrice(p: string): number {
  const n = parseFloat(p.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

export default function VaultScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces, wishlistItems, upcomingReminderCount } = useDiGe();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<JewelryType | "all">("all");

  const retailers = useMemo<RetailerSummary[]>(() => {
    const map = new Map<string, RetailerSummary>();
    const key = (r: string) => r.trim() || "Uncategorized";
    for (const p of pieces) {
      const k = key(p.retailer);
      if (!map.has(k)) map.set(k, { name: k, pieceCount: 0, wishlistCount: 0 });
      map.get(k)!.pieceCount += 1;
    }
    for (const w of wishlistItems) {
      const k = key(w.retailer);
      if (!map.has(k)) map.set(k, { name: k, pieceCount: 0, wishlistCount: 0 });
      map.get(k)!.wishlistCount += 1;
    }
    return Array.from(map.values()).sort((a, b) => {
      if (a.name === "Uncategorized") return 1;
      if (b.name === "Uncategorized") return -1;
      return a.name.localeCompare(b.name);
    });
  }, [pieces, wishlistItems]);

  const filteredRetailers = query.trim()
    ? retailers.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    : retailers;

  const recentPieces = useMemo(() => {
    const sorted = [...pieces].reverse();
    return typeFilter === "all" ? sorted : sorted.filter((p) => p.type === typeFilter);
  }, [pieces, typeFilter]);

  const presentTypes = useMemo<JewelryType[]>(() => {
    const seen = new Set<JewelryType>();
    for (const p of pieces) seen.add(p.type);
    return Array.from(seen);
  }, [pieces]);

  const collectionValue = useMemo(() => {
    const total = pieces.reduce((sum, p) => sum + parsePrice(p.purchasePrice), 0);
    return total;
  }, [pieces]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function handleAddPiece() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/piece/add");
  }

  const listHeader = (
    <>
      {/* Stats row */}
      {pieces.length > 0 ? (
        <View style={styles.statsRow}>
          {[
            { label: "Pieces", value: pieces.length, icon: "box" as const },
            { label: "Retailers", value: retailers.length, icon: "archive" as const },
            { label: "Wishlist", value: wishlistItems.length, icon: "heart" as const },
            { label: "Reminders", value: upcomingReminderCount, icon: "bell" as const },
          ].map((s) => (
            <View key={s.label} style={[styles.statChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name={s.icon} size={15} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Collection value banner */}
      {collectionValue > 0 ? (
        <View style={[styles.valueBanner, { backgroundColor: colors.primary }]}>
          <View style={styles.valueBannerInner}>
            <View>
              <Text style={styles.valueBannerLabel}>COLLECTION VALUE</Text>
              <Text style={styles.valueBannerAmount}>
                ${collectionValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Text>
            </View>
            <View style={styles.valueBannerRight}>
              <Feather name="trending-up" size={20} color="rgba(255,255,255,0.5)" />
              <Text style={styles.valueBannerPieceCount}>
                {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* Recent pieces */}
      {pieces.length > 0 ? (
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>YOUR COLLECTION</Text>
            <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTypeFilter("all"); }} hitSlop={8}>
              {typeFilter !== "all" ? (
                <Text style={[styles.seeAll, { color: colors.primary }]}>Clear filter</Text>
              ) : null}
            </Pressable>
          </View>

          {/* Type filter pills */}
          {presentTypes.length > 1 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll} contentContainerStyle={styles.pillScrollContent}>
              <Pressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTypeFilter("all"); }}
                style={[styles.typePill, { backgroundColor: typeFilter === "all" ? colors.primary : colors.secondary, borderColor: typeFilter === "all" ? colors.primary : colors.border }]}
              >
                <Text style={[styles.typePillText, { color: typeFilter === "all" ? colors.primaryForeground : colors.foreground }]}>All</Text>
              </Pressable>
              {presentTypes.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTypeFilter(t); }}
                  style={[styles.typePill, { backgroundColor: typeFilter === t ? colors.primary : colors.secondary, borderColor: typeFilter === t ? colors.primary : colors.border }]}
                >
                  <Feather name={TYPE_ICONS[t] as React.ComponentProps<typeof Feather>["name"]} size={12} color={typeFilter === t ? colors.primaryForeground : colors.mutedForeground} />
                  <Text style={[styles.typePillText, { color: typeFilter === t ? colors.primaryForeground : colors.foreground }]}>{TYPE_LABELS[t]}</Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}

          {/* Piece cards scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pieceScrollContent}>
            {recentPieces.length > 0 ? recentPieces.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/piece/${p.id}`); }}
                style={[styles.pieceCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.pieceIconWrap, { backgroundColor: colors.primary + "14" }]}>
                  <Feather name={TYPE_ICONS[p.type] as React.ComponentProps<typeof Feather>["name"]} size={22} color={colors.primary} />
                </View>
                <Text style={[styles.pieceName, { color: colors.foreground }]} numberOfLines={2}>{p.name}</Text>
                {p.brand ? <Text style={[styles.pieceBrand, { color: colors.mutedForeground }]} numberOfLines={1}>{p.brand}</Text> : null}
                {p.goldWarrantyType !== "none" ? (
                  <View style={[styles.warrantyBadge, { backgroundColor: "#D4AA3A14", borderColor: "#D4AA3A40" }]}>
                    <Feather name="shield" size={9} color="#D4AA3A" />
                    <Text style={styles.warrantyBadgeText}>Warranty</Text>
                  </View>
                ) : null}
              </Pressable>
            )) : (
              <View style={[styles.pieceCard, styles.pieceCardEmpty, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <Text style={[styles.pieceName, { color: colors.mutedForeground, textAlign: "center" }]}>No {typeFilter !== "all" ? TYPE_LABELS[typeFilter].toLowerCase() : ""}s yet</Text>
              </View>
            )}
          </ScrollView>
        </View>
      ) : null}

      {/* Add button */}
      <View style={styles.actionStrip}>
        <Pressable onPress={handleAddPiece} style={[styles.addPieceBtn, { backgroundColor: colors.primary }]}>
          <Feather name="plus" size={18} color="#fff" />
          <Text style={styles.addPieceBtnText}>Add Jewelry Piece</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.search, { color: colors.foreground }]}
          placeholder="Search by retailer..."
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query ? (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        ) : null}
      </View>

      {filteredRetailers.length > 0 ? (
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, paddingHorizontal: 20, marginBottom: 8 }]}>BY RETAILER</Text>
      ) : null}
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.logo, { color: colors.primary }]}>DiaGe</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {pieces.length === 0
                ? "Your jewelry vault"
                : `${pieces.length} ${pieces.length === 1 ? "piece" : "pieces"} · ${retailers.length} ${retailers.length === 1 ? "retailer" : "retailers"}`}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {pieces.length > 0 ? (
              <Pressable
                onPress={() => router.push("/insurance-report")}
                style={[styles.headerBtn, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}
                hitSlop={8}
              >
                <Feather name="file-text" size={14} color={colors.primary} />
                <Text style={[styles.headerBtnText, { color: colors.primary }]}>Report</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={() => router.push("/settings")}
              style={[styles.settingsBtn, { backgroundColor: colors.muted }]}
              hitSlop={8}
            >
              <Feather name="settings" size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredRetailers}
        keyExtractor={(item) => item.name}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <RetailerCard
            retailer={item}
            colors={colors}
            onPress={() => router.push(`/retailer/${encodeURIComponent(item.name)}`)}
          />
        )}
        ListEmptyComponent={
          query.trim() ? (
            <EmptyState icon="search" title="No retailers found" subtitle="Try a different search." />
          ) : pieces.length > 0 ? null : (
            <EmptyState
              icon="archive"
              title="Your vault is empty"
              subtitle={'Tap "Add Jewelry Piece" above to store your first piece with its receipts, warranties, and paperwork.'}
            />
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function RetailerCard({
  retailer,
  colors,
  onPress,
}: {
  retailer: RetailerSummary;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  const isUncategorized = retailer.name === "Uncategorized";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.cardIcon, { backgroundColor: isUncategorized ? colors.muted : colors.primary + "18" }]}>
        <Feather
          name={isUncategorized ? "folder" : "archive"}
          size={22}
          color={isUncategorized ? colors.mutedForeground : colors.primary}
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardName, { color: colors.foreground }]} numberOfLines={1}>
          {retailer.name}
        </Text>
        <View style={styles.cardMeta}>
          {retailer.pieceCount > 0 ? (
            <View style={styles.metaChip}>
              <Feather name="box" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {retailer.pieceCount} {retailer.pieceCount === 1 ? "piece" : "pieces"}
              </Text>
            </View>
          ) : null}
          {retailer.wishlistCount > 0 ? (
            <View style={styles.metaChip}>
              <Feather name="heart" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {retailer.wishlistCount} wishlist
              </Text>
            </View>
          ) : null}
          {retailer.pieceCount === 0 && retailer.wishlistCount === 0 ? (
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>Empty</Text>
          ) : null}
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  headerBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  settingsBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  statChip: { flex: 1, borderRadius: 14, borderWidth: 1, paddingVertical: 10, alignItems: "center", gap: 4 },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold", lineHeight: 22 },
  statLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3, textTransform: "uppercase" },

  valueBanner: { marginHorizontal: 20, marginBottom: 16, borderRadius: 16, padding: 16, overflow: "hidden" },
  valueBannerInner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  valueBannerLabel: { color: "rgba(255,255,255,0.65)", fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  valueBannerAmount: { color: "#fff", fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  valueBannerRight: { alignItems: "flex-end", gap: 6 },
  valueBannerPieceCount: { color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: "Inter_400Regular" },

  recentSection: { marginBottom: 12 },
  recentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 10 },
  seeAll: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  pillScroll: { marginBottom: 10 },
  pillScrollContent: { paddingHorizontal: 20, gap: 8 },
  typePill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  typePillText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  pieceScrollContent: { paddingHorizontal: 20, gap: 10 },
  pieceCard: { width: 108, borderRadius: 16, borderWidth: 1, padding: 12, alignItems: "center", gap: 6 },
  pieceCardEmpty: { width: 140, justifyContent: "center", minHeight: 120 },
  pieceIconWrap: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  pieceName: { fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "center", lineHeight: 16 },
  pieceBrand: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  warrantyBadge: { flexDirection: "row", alignItems: "center", gap: 3, borderWidth: 1, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2, marginTop: 2 },
  warrantyBadgeText: { fontSize: 9, fontFamily: "Inter_600SemiBold", color: "#D4AA3A" },

  actionStrip: { paddingHorizontal: 20, marginBottom: 12 },
  addPieceBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, shadowColor: "#5B21B6", shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  addPieceBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },

  searchWrap: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, gap: 10 },
  search: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },

  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase" },

  list: { paddingTop: 4, flexGrow: 1 },
  card: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10, gap: 14, marginHorizontal: 20 },
  cardIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  cardInfo: { flex: 1, gap: 4 },
  cardName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  cardMeta: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
