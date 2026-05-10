import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { JewelryCard } from "@/components/JewelryCard";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

export default function VaultScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces } = useDiGe();
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? pieces.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.retailer.toLowerCase().includes(query.toLowerCase())
      )
    : pieces;

  async function handleAdd() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/piece/add");
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.logo, { color: colors.gold }]}>DiGe</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Vault</Text>
        </View>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
        </Text>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.search, { color: colors.foreground }]}
          placeholder="Search your collection..."
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        renderItem={({ item }) => (
          <JewelryCard
            piece={item}
            onPress={() => router.push(`/piece/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="box"
            title={query ? "No matches" : "Your vault is empty"}
            subtitle={
              query
                ? "Try a different search term."
                : "Add your first jewelry piece to start tracking paperwork and warranties."
            }
          />
        }
        scrollEnabled={!!filtered.length}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        onPress={handleAdd}
        style={[
          styles.fab,
          { backgroundColor: colors.primary, bottom: insets.bottom + 100 },
        ]}
      >
        <Feather name="plus" size={24} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  titleRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  logo: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
  count: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
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
