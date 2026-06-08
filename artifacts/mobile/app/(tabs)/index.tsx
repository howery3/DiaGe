import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
import { useDiGe, type JewelryType } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { usePreferredStore } from "@/hooks/usePreferredStore";

interface RetailerSummary {
  name: string;
  pieceCount: number;
  wishlistCount: number;
}

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const TYPE_ICONS: Record<JewelryType, MCIName> = {
  ring: "ring",
  necklace: "necklace",
  bracelet: "circle-outline",
  earrings: "diamond-outline",
  watch: "watch",
  brooch: "flower-outline",
  other: "diamond",
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
  const { stores } = usePreferredStore();
  const linkedStores = Object.values(stores);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<JewelryType | "all">("all");
  const flatListRef = React.useRef<FlatList<RetailerSummary>>(null);

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
    const byType = typeFilter === "all" ? sorted : sorted.filter((p) => p.type === typeFilter);
    if (!query.trim()) return byType;
    const q = query.toLowerCase();
    return byType.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.retailer?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q)
    );
  }, [pieces, typeFilter, query]);

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
          {([
            {
              label: "Pieces", value: pieces.length, icon: "box" as const,
              onPress: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTypeFilter("all");
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
              },
            },
            {
              label: "Retailers", value: retailers.length, icon: "archive" as const,
              onPress: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (filteredRetailers.length > 0) {
                  flatListRef.current?.scrollToIndex({ index: 0, animated: true });
                }
              },
            },
            {
              label: "Wishlist", value: wishlistItems.length, icon: "heart" as const,
              onPress: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(tabs)/wishlist");
              },
            },
            {
              label: "Reminders", value: upcomingReminderCount, icon: "bell" as const,
              onPress: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(tabs)/reminders");
              },
            },
          ] as const).map((s) => (
            <Pressable
              key={s.label}
              onPress={s.onPress}
              style={({ pressed }) => [
                styles.statChip,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Feather name={s.icon} size={15} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Store shortcut */}
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/store-picker" as any); }}
        style={({ pressed }) => [styles.storeChip, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 }]}
      >
        <Feather name="map-pin" size={14} color={linkedStores.length > 0 ? "#5B21B6" : colors.mutedForeground} />
        <Text style={[styles.storeChipText, { color: linkedStores.length > 0 ? colors.foreground : colors.mutedForeground }]} numberOfLines={1}>
          {linkedStores.length > 0 ? linkedStores.map(s => s.name).join(" · ") : "Link a store"}
        </Text>
        <Feather name="chevron-right" size={14} color={colors.mutedForeground} style={{ marginLeft: "auto" }} />
      </Pressable>

      {/* Collection value banner */}
      {collectionValue > 0 ? (
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/insurance-report" as never); }}
          style={({ pressed }) => [styles.valueBanner, { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 }]}
        >
          <View style={styles.valueBannerInner}>
            <View>
              <Text style={styles.valueBannerLabel}>COLLECTION VALUE</Text>
              <Text style={styles.valueBannerAmount}>
                ${collectionValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Text>
            </View>
            <View style={styles.valueBannerRight}>
              <Feather name="file-text" size={18} color="rgba(255,255,255,0.7)" />
              <Text style={styles.valueBannerPieceCount}>View Report</Text>
            </View>
          </View>
        </Pressable>
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
                  <MaterialCommunityIcons name={TYPE_ICONS[t]} size={13} color={typeFilter === t ? colors.primaryForeground : colors.mutedForeground} />
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
                  <MaterialCommunityIcons name={TYPE_ICONS[p.type]} size={26} color={colors.primary} />
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

      {filteredRetailers.length > 0 || query.trim() ? (
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, paddingHorizontal: 20, marginBottom: 8 }]}>BY RETAILER</Text>
      ) : null}
    </>
  );

  if (pieces.length === 0) {
    return (
      <VaultEmptyState
        colors={colors}
        topPad={topPad}
        bottomPad={insets.bottom}
        onAdd={handleAddPiece}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.logo, { color: colors.primary }]}>DiaGe</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {query.trim()
                ? `${recentPieces.length} piece${recentPieces.length !== 1 ? "s" : ""} · ${filteredRetailers.length} retailer${filteredRetailers.length !== 1 ? "s" : ""}`
                : `${pieces.length} ${pieces.length === 1 ? "piece" : "pieces"} · ${retailers.length} ${retailers.length === 1 ? "retailer" : "retailers"}`}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push("/insurance-report")}
              style={[styles.headerBtn, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}
              hitSlop={8}
            >
              <Feather name="file-text" size={14} color={colors.primary} />
              <Text style={[styles.headerBtnText, { color: colors.primary }]}>Report</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/settings")}
              style={[styles.settingsBtn, { backgroundColor: colors.muted }]}
              hitSlop={8}
            >
              <Feather name="settings" size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>
        <View style={[styles.searchWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="search" size={15} color={colors.mutedForeground} />
          <TextInput
            style={[styles.search, { color: colors.foreground }]}
            placeholder="Search pieces, brands, retailers…"
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query ? (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Feather name="x" size={15} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
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
            <View style={styles.searchEmptyWrap}>
              <Feather name="search" size={28} color={colors.mutedForeground} />
              <Text style={[styles.searchEmptyTitle, { color: colors.foreground }]}>No retailers found</Text>
              <Text style={[styles.searchEmptySubtitle, { color: colors.mutedForeground }]}>Try a different search.</Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function VaultEmptyState({
  colors,
  topPad,
  bottomPad,
  onAdd,
}: {
  colors: ReturnType<typeof useColors>;
  topPad: number;
  bottomPad: number;
  onAdd: () => void;
}) {
  const features = [
    { icon: "image" as const, label: "Photos & docs" },
    { icon: "shield" as const, label: "Warranties tracked" },
    { icon: "file-text" as const, label: "Insurance ready" },
  ];

  const ghostPieces = [
    { icon: "circle" as const, name: "Engagement Ring", brand: "Tiffany & Co." },
    { icon: "clock" as const, name: "Gold Watch", brand: "Rolex" },
    { icon: "link" as const, name: "Diamond Necklace", brand: "Kay Jewelers" },
  ];

  return (
    <ScrollView
      style={[es.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[es.scroll, { paddingBottom: bottomPad + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={[es.hero, { paddingTop: topPad + 24, backgroundColor: colors.primary }]}>
        <View style={es.heroTop}>
          <Text style={es.heroLogo}>DiaGe</Text>
          <Pressable
            onPress={() => router.push("/settings")}
            style={es.heroSettings}
            hitSlop={8}
          >
            <Feather name="settings" size={18} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>

        {/* Gem icon */}
        <View style={es.gemOuter}>
          <View style={es.gemMiddle}>
            <View style={es.gemInner}>
              <Feather name="box" size={36} color={colors.primary} />
            </View>
          </View>
        </View>

        <Text style={es.heroTitle}>Your vault awaits</Text>
        <Text style={es.heroSubtitle}>
          Store every piece of jewelry you own — photos, warranties, receipts, and appraisals — all in one place.
        </Text>

        {/* Feature pills */}
        <View style={es.featureRow}>
          {features.map((f) => (
            <View key={f.label} style={es.featurePill}>
              <Feather name={f.icon} size={12} color="rgba(255,255,255,0.9)" />
              <Text style={es.featurePillText}>{f.label}</Text>
            </View>
          ))}
        </View>

        <View style={es.heroBottom} />
      </View>

      {/* CTA */}
      <View style={es.ctaWrap}>
        <Pressable onPress={onAdd} style={[es.ctaBtn, { backgroundColor: colors.primary }]}>
          <Feather name="plus" size={20} color="#fff" />
          <Text style={es.ctaBtnText}>Add Your First Piece</Text>
        </Pressable>
      </View>

      {/* Ghost preview cards */}
      <Text style={[es.previewLabel, { color: colors.mutedForeground }]}>WHAT IT LOOKS LIKE</Text>
      <View style={es.ghostList}>
        {ghostPieces.map((g, i) => (
          <View
            key={g.name}
            style={[
              es.ghostCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: 1 - i * 0.2,
              },
            ]}
          >
            <View style={[es.ghostIcon, { backgroundColor: colors.primary + "14" }]}>
              <Feather name={g.icon} size={22} color={colors.primary} />
            </View>
            <View style={es.ghostInfo}>
              <View style={[es.ghostBar, { backgroundColor: colors.muted, width: "60%" }]} />
              <View style={[es.ghostBarThin, { backgroundColor: colors.muted, width: "40%" }]} />
            </View>
            <Feather name="chevron-right" size={18} color={colors.border} />
          </View>
        ))}
      </View>
    </ScrollView>
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

  statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 10 },
  storeChip: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 20, marginBottom: 10, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  storeChipText: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
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

  searchWrap: { flexDirection: "row", alignItems: "center", marginTop: 10, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, borderWidth: 1, gap: 8 },
  search: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", paddingVertical: 0 },

  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase" },

  list: { paddingTop: 4, flexGrow: 1 },
  card: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10, gap: 14, marginHorizontal: 20 },
  cardIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  cardInfo: { flex: 1, gap: 4 },
  cardName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  cardMeta: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },

  searchEmptyWrap: { alignItems: "center", gap: 8, paddingTop: 40 },
  searchEmptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  searchEmptySubtitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
});

const es = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },

  hero: { paddingHorizontal: 24, paddingBottom: 0 },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 32 },
  heroLogo: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.5 },
  heroSettings: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },

  gemOuter: { alignSelf: "center", width: 104, height: 104, borderRadius: 52, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  gemMiddle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  gemInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },

  heroTitle: { color: "#fff", fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center", letterSpacing: -0.4, marginBottom: 10 },
  heroSubtitle: { color: "rgba(255,255,255,0.75)", fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 21, paddingHorizontal: 8, marginBottom: 24 },

  featureRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 32 },
  featurePill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  featurePillText: { color: "rgba(255,255,255,0.95)", fontSize: 11, fontFamily: "Inter_600SemiBold" },

  heroBottom: { height: 28 },

  ctaWrap: { paddingHorizontal: 20, marginTop: -14 },
  ctaBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, shadowColor: "#5B21B6", shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  ctaBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },

  previewLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase", paddingHorizontal: 20, marginTop: 28, marginBottom: 12 },

  ghostList: { paddingHorizontal: 20, gap: 10 },
  ghostCard: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 16, borderWidth: 1, gap: 14 },
  ghostIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  ghostInfo: { flex: 1, gap: 8 },
  ghostBar: { height: 12, borderRadius: 6 },
  ghostBarThin: { height: 9, borderRadius: 5 },
});
