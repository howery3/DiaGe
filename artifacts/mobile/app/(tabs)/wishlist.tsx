import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { WishlistCard } from "@/components/WishlistCard";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { capture } from "@/utils/posthog";
import type { WishlistItem } from "@/context/DiGeContext";

export default function WishlistScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { wishlistItems, deleteWishlistItem } = useDiGe();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!query.trim()) return wishlistItems;
    const q = query.toLowerCase();
    return wishlistItems.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.retailer?.toLowerCase().includes(q) ||
        item.sku?.toLowerCase().includes(q)
    );
  }, [wishlistItems, query]);

  const grouped: { retailer: string; items: WishlistItem[] }[] = useMemo(() => {
    const map: Record<string, WishlistItem[]> = {};
    for (const item of filteredItems) {
      const key = item.retailer?.trim() || "Other";
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }
    return Object.entries(map)
      .sort(([a], [b]) => {
        if (a === "Other") return 1;
        if (b === "Other") return -1;
        return a.localeCompare(b);
      })
      .map(([retailer, items]) => ({ retailer, items }));
  }, [filteredItems]);

  const isGrouped = !query.trim() || grouped.length > 1;

  async function handleAdd() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/wishlist-item/add");
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Wishlist</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {query.trim()
                ? `${filteredItems.length} of ${wishlistItems.length} items`
                : `${wishlistItems.length} ${wishlistItems.length === 1 ? "item" : "items"}`}
            </Text>
          </View>
        </View>

        {wishlistItems.length > 0 && (
          <View style={[styles.searchWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Feather name="search" size={15} color={colors.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Search by name, brand, retailer, SKU…"
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
        )}
      </View>

      {wishlistItems.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="heart"
            title="Your wishlist is empty"
            subtitle="Save jewelry pieces you love and share them with friends or family."
          />
        </View>
      ) : filteredItems.length === 0 && query.trim() ? (
        <View style={styles.searchEmpty}>
          <Feather name="search" size={28} color={colors.mutedForeground} />
          <Text style={[styles.searchEmptyTitle, { color: colors.foreground }]}>No results</Text>
          <Text style={[styles.searchEmptySub, { color: colors.mutedForeground }]}>
            Nothing matches "{query}"
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {grouped.map(({ retailer, items }) => (
            <View key={retailer} style={styles.retailerGroup}>
              {/* Retailer section header — only shown when grouped */}
              {grouped.length > 1 || retailer !== "Other" ? (
                <View style={styles.retailerHeader}>
                  <View style={[styles.retailerDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.retailerLabel, { color: colors.mutedForeground }]}>
                    {retailer.toUpperCase()}
                  </Text>
                  <Text style={[styles.retailerCount, { color: colors.mutedForeground }]}>
                    {items.length}
                  </Text>
                </View>
              ) : null}

              {/* Wishlist cards */}
              {items.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/wishlist-item/edit?id=${item.id}`);
                  }}
                  onEdit={() => router.push(`/wishlist-item/edit?id=${item.id}`)}
                  onDelete={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    capture("wishlist_item_removed", {
                      retailer: item.retailer || "unknown",
                      type: item.type || "unknown",
                      sku: item.sku || "unknown",
                      brand: item.brand || "unknown",
                    });
                    deleteWishlistItem(item.id);
                  }}
                />
              ))}

            </View>
          ))}
        </ScrollView>
      )}

      <Pressable
        onPress={handleAdd}
        style={[styles.fab, { backgroundColor: colors.primary, bottom: insets.bottom + 100 }]}
      >
        <Feather name="plus" size={24} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  searchWrap: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", paddingVertical: 0 },
  emptyWrap: { flex: 1 },
  searchEmpty: { flex: 1, alignItems: "center", paddingTop: 60, gap: 8 },
  searchEmptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", marginTop: 4 },
  searchEmptySub: { fontSize: 14, fontFamily: "Inter_400Regular" },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  retailerGroup: { marginBottom: 20 },
  retailerHeader: {
    flexDirection: "row", alignItems: "center", gap: 7,
    marginBottom: 10,
  },
  retailerDot: { width: 6, height: 6, borderRadius: 3 },
  retailerLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8, flex: 1 },
  retailerCount: { fontSize: 11, fontFamily: "Inter_500Medium" },
  fab: {
    position: "absolute",
    right: 20,
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
