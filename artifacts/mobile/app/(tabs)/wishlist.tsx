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

export default function WishlistScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { wishlistItems, deleteWishlistItem } = useDiGe();

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

      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        renderItem={({ item }) => (
          <WishlistCard
            item={item}
            onPress={() => {}}
            onEdit={() => router.push(`/wishlist-item/edit?id=${item.id}`)}
            onDelete={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
