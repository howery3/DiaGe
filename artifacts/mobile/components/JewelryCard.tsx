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

function dateBadge(expiry: string): { label: string; color: string } | null {
  if (!expiry) return null;
  const diff = new Date(expiry).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "Expired", color: "#DC2626" };
  if (days <= 90) return { label: `${days}d left`, color: "#B45309" };
  return { label: "Active", color: "#15803D" };
}

function warrantyBadges(piece: JewelryPiece): { label: string; color: string; key: string }[] {
  const badges: { label: string; color: string; key: string }[] = [];

  if (piece.goldWarrantyType === "lifetime") {
    badges.push({ label: "Lifetime", color: "#15803D", key: "gold" });
  } else if (piece.goldWarrantyType === "dated") {
    const b = dateBadge(piece.goldWarrantyExpiry);
    if (b) badges.push({ ...b, key: "gold" });
  }

  if (piece.diamondBondExpiry) {
    const b = dateBadge(piece.diamondBondExpiry);
    if (b) {
      const isExpired = b.label === "Expired";
      badges.push({
        label: isExpired ? "Bond Exp." : `Bond ${b.label}`,
        color: b.color,
        key: "diamond",
      });
    }
  }

  return badges;
}

interface JewelryCardProps {
  piece: JewelryPiece;
  onPress: () => void;
}

export function JewelryCard({ piece, onPress }: JewelryCardProps) {
  const colors = useColors();
  const icon = TYPE_ICONS[piece.type] ?? "package";
  const badges = warrantyBadges(piece);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {piece.name}
        </Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={1}>
          {[piece.brand, piece.material].filter(Boolean).join(" · ")}
        </Text>
        {badges.length > 0 ? (
          <View style={styles.badgeRow}>
            {badges.map((b) => (
              <View key={b.key} style={[styles.badge, { backgroundColor: b.color + "18" }]}>
                <Text style={[styles.badgeText, { color: b.color }]}>{b.label}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
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
  info: { flex: 1, gap: 4 },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  meta: { fontSize: 13, fontFamily: "Inter_400Regular" },
  badgeRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
