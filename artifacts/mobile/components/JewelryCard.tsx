import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { JewelryPiece, JewelryType } from "@/context/DiGeContext";

const TYPE_ICONS: Record<JewelryType, keyof typeof Feather.glyphMap> = {
  ring: "circle",
  necklace: "link",
  bracelet: "rotate-cw",
  earrings: "star",
  watch: "watch",
  brooch: "award",
  other: "package",
};

function warrantyStatus(expiry: string): { label: string; color: string } | null {
  if (!expiry) return null;
  const diff = new Date(expiry).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "Expired", color: "#DC2626" };
  if (days <= 90) return { label: `${days}d left`, color: "#B45309" };
  return { label: "Active", color: "#15803D" };
}

interface JewelryCardProps {
  piece: JewelryPiece;
  onPress: () => void;
}

export function JewelryCard({ piece, onPress }: JewelryCardProps) {
  const colors = useColors();
  const icon = TYPE_ICONS[piece.type] ?? "package";
  const warranty = warrantyStatus(piece.warrantyExpiry);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={20} color={colors.gold} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {piece.name}
        </Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={1}>
          {[piece.brand, piece.material].filter(Boolean).join(" · ")}
        </Text>
        {piece.retailer ? (
          <Text style={[styles.retailer, { color: colors.mutedForeground }]} numberOfLines={1}>
            {piece.retailer}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>
        {warranty ? (
          <View style={[styles.badge, { backgroundColor: warranty.color + "18" }]}>
            <Text style={[styles.badgeText, { color: warranty.color }]}>{warranty.label}</Text>
          </View>
        ) : null}
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  meta: { fontSize: 13, fontFamily: "Inter_400Regular" },
  retailer: { fontSize: 12, fontFamily: "Inter_400Regular" },
  right: { alignItems: "flex-end", gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
