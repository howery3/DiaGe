import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { WishlistCard } from "@/components/WishlistCard";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { usePreferredStore } from "@/hooks/usePreferredStore";
import { capture } from "@/utils/posthog";

export default function WishlistScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { wishlistItems, deleteWishlistItem } = useDiGe();
  const { store } = usePreferredStore();

  async function handleAdd() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/wishlist-item/add");
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Wishlist</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {store && wishlistItems.length > 0 && (
        <Pressable
          onPress={() => router.push("/(tabs)/profile" as any)}
          style={({ pressed }) => [
            styles.storeBanner,
            { backgroundColor: "#F3F0FF", borderColor: "#DDD6FE", opacity: pressed ? 0.88 : 1 },
          ]}
        >
          <View style={[styles.storeDot, { backgroundColor: "#5B21B6" }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.storeBannerTitle}>{store.name}</Text>
            <Text style={styles.storeBannerSub}>Tap Profile → Send Wishlist to share your {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} directly with this store</Text>
          </View>
          <Feather name="send" size={14} color="#5B21B6" />
        </Pressable>
      )}

      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        renderItem={({ item }) => (
          <WishlistCard
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
        )}
        ListEmptyComponent={
          <EmptyState
            icon="heart"
            title="Your wishlist is empty"
            subtitle="Save jewelry pieces you love and share them with friends or family."
          />
        }
        scrollEnabled={!!wishlistItems.length}
        showsVerticalScrollIndicator={false}
      />

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
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  storeBanner: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginHorizontal: 20, marginBottom: 8,
    padding: 12, borderRadius: 14, borderWidth: 1,
  },
  storeDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  storeBannerTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#3B0764", marginBottom: 1 },
  storeBannerSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#6D28D9", lineHeight: 15 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  list: { paddingHorizontal: 20, flexGrow: 1 },
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
