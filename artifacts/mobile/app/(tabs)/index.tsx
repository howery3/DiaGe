import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

interface RetailerSummary {
  name: string;
  pieceCount: number;
  wishlistCount: number;
}

export default function RetailersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces, wishlistItems } = useDiGe();
  const [query, setQuery] = useState("");
  const [fabOpen, setFabOpen] = useState(false);

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

  const filtered = query.trim()
    ? retailers.filter((r) =>
        r.name.toLowerCase().includes(query.toLowerCase())
      )
    : retailers;

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  async function handleFab() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFabOpen((v) => !v);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {fabOpen ? (
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setFabOpen(false)} />
      ) : null}

      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.logo, { color: colors.primary }]}>DiaGe</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {retailers.length} {retailers.length === 1 ? "retailer" : "retailers"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {pieces.length > 0 ? (
              <Pressable
                onPress={() => router.push("/insurance-report")}
                style={[styles.insuranceBtn, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}
                hitSlop={8}
              >
                <Feather name="archive" size={14} color={colors.primary} />
                <Text style={[styles.insuranceBtnText, { color: colors.primary }]}>My Vault</Text>
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

      <View
        style={[
          styles.searchWrap,
          { backgroundColor: colors.muted, borderColor: colors.border },
        ]}
      >
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.search, { color: colors.foreground }]}
          placeholder="Search retailers..."
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 120 },
        ]}
        ListHeaderComponent={
          <View style={styles.shopSync}>
            <Text style={[styles.shopSyncLabel, { color: colors.mutedForeground }]}>
              SHOP &amp; SYNC
            </Text>
            <View style={styles.shopSyncRow}>
              <Pressable
                onPress={() => router.push("/catalog-scan")}
                style={[styles.shopSyncCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.shopSyncIcon, { backgroundColor: "#5B21B6" }]}>
                  <Feather name="maximize" size={18} color="#fff" />
                </View>
                <View style={styles.shopSyncText}>
                  <Text style={[styles.shopSyncTitle, { color: colors.foreground }]}>Scan In-Store</Text>
                  <Text style={[styles.shopSyncSub, { color: colors.mutedForeground }]}>Load catalog via QR</Text>
                </View>
                <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
              </Pressable>
              <Pressable
                onPress={() => router.push("/catalog-browse")}
                style={[styles.shopSyncCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.shopSyncIcon, { backgroundColor: "#0E6655" }]}>
                  <Feather name="grid" size={18} color="#fff" />
                </View>
                <View style={styles.shopSyncText}>
                  <Text style={[styles.shopSyncTitle, { color: colors.foreground }]}>Browse Online</Text>
                  <Text style={[styles.shopSyncSub, { color: colors.mutedForeground }]}>Shop partner catalogs</Text>
                </View>
                <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
              </Pressable>
            </View>
            {filtered.length > 0 ? (
              <Text style={[styles.retailersLabel, { color: colors.mutedForeground }]}>YOUR RETAILERS</Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <RetailerCard
            retailer={item}
            colors={colors}
            onPress={() =>
              router.push(`/retailer/${encodeURIComponent(item.name)}`)
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="shopping-bag"
            title={query ? "No retailers found" : "No retailers yet"}
            subtitle={
              query
                ? "Try a different search."
                : "Add your first jewelry piece or wishlist item to create a retailer folder."
            }
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[
          styles.fabArea,
          { bottom: insets.bottom + 100 },
        ]}
      >
        {fabOpen ? (
          <View style={styles.fabMenu}>
            <Pressable
              onPress={() => {
                setFabOpen(false);
                router.push("/wishlist-item/add");
              }}
              style={[
                styles.fabMenuItem,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.primary,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Feather name="heart" size={16} color={colors.primary} />
              <Text style={[styles.fabMenuLabel, { color: colors.primary }]}>
                Wishlist Item
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setFabOpen(false);
                router.push("/piece/add");
              }}
              style={[styles.fabMenuItem, { backgroundColor: colors.primary }]}
            >
              <Feather name="box" size={16} color={colors.primaryForeground} />
              <Text
                style={[styles.fabMenuLabel, { color: colors.primaryForeground }]}
              >
                Jewelry Piece
              </Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          onPress={handleFab}
          style={[styles.fab, { backgroundColor: colors.primary }]}
        >
          <Feather
            name={fabOpen ? "x" : "plus"}
            size={24}
            color={colors.primaryForeground}
          />
        </Pressable>
      </View>
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
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.cardIcon,
          {
            backgroundColor: isUncategorized
              ? colors.muted
              : colors.primary + "18",
          },
        ]}
      >
        <Feather
          name={isUncategorized ? "folder" : "shopping-bag"}
          size={22}
          color={isUncategorized ? colors.mutedForeground : colors.primary}
        />
      </View>
      <View style={styles.cardInfo}>
        <Text
          style={[styles.cardName, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {retailer.name}
        </Text>
        <View style={styles.cardMeta}>
          {retailer.pieceCount > 0 ? (
            <View style={styles.metaChip}>
              <Feather name="box" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {retailer.pieceCount}{" "}
                {retailer.pieceCount === 1 ? "piece" : "pieces"}
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
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              Empty
            </Text>
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
  insuranceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  insuranceBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  search: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  list: { paddingHorizontal: 20, paddingTop: 4, flexGrow: 1 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 14,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1, gap: 4 },
  cardName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  cardMeta: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  fabArea: {
    position: "absolute",
    right: 20,
    alignItems: "flex-end",
    gap: 10,
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

  shopSync: { paddingTop: 4, paddingBottom: 8, gap: 10 },
  shopSyncLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  shopSyncRow: { gap: 8 },
  shopSyncCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  shopSyncIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  shopSyncText: { flex: 1, gap: 2 },
  shopSyncTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  shopSyncSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  retailersLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 6,
    marginBottom: 2,
  },
});
