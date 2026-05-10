import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import type { WishlistItem, WishlistPriority } from "@/context/DiGeContext";

const PRIORITY_COLORS: Record<WishlistPriority, string> = {
  low: "#15803D",
  medium: "#B45309",
  high: "#DC2626",
};

interface WishlistCardProps {
  item: WishlistItem;
  onPress: () => void;
  onDelete: () => void;
}

export function WishlistCard({ item, onPress, onDelete }: WishlistCardProps) {
  const colors = useColors();
  const priorityColor = PRIORITY_COLORS[item.priority];

  async function handleShare() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const lines = [
      `✨ ${item.name}`,
      item.brand ? `by ${item.brand}` : "",
      item.retailer ? `Available at ${item.retailer}` : "",
      item.retailerUrl ? item.retailerUrl : "",
      item.estimatedPrice ? `Est. $${item.estimatedPrice}` : "",
      item.notes ? `\n${item.notes}` : "",
      "\nShared via DiGe",
    ].filter(Boolean);
    await Share.share({ message: lines.join("\n"), title: item.name });
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.actions}>
            <Pressable onPress={handleShare} hitSlop={8} style={styles.actionBtn}>
              <Feather name="share-2" size={16} color={colors.gold} />
            </Pressable>
            <Pressable onPress={onDelete} hitSlop={8} style={styles.actionBtn}>
              <Feather name="trash-2" size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>
        {item.brand ? (
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>{item.brand}</Text>
        ) : null}
        {item.retailer ? (
          <View style={styles.retailerRow}>
            <Feather name="map-pin" size={12} color={colors.mutedForeground} />
            <Text style={[styles.retailerText, { color: colors.mutedForeground }]}>
              {item.retailer}
            </Text>
          </View>
        ) : null}
        {item.estimatedPrice ? (
          <Text style={[styles.price, { color: colors.gold }]}>${item.estimatedPrice}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
  },
  priorityBar: { width: 4 },
  content: { flex: 1, padding: 14, gap: 4 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: { padding: 4 },
  meta: { fontSize: 13, fontFamily: "Inter_400Regular" },
  retailerRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  retailerText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  price: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 2 },
});
