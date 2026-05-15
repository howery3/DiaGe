import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";
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
  onEdit?: () => void;
}

export function WishlistCard({ item, onPress, onDelete, onEdit }: WishlistCardProps) {
  const colors = useColors();
  const { profile, hasProfile } = useProfile();
  const priorityColor = PRIORITY_COLORS[item.priority];

  async function handleShare() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    async function doShare(includeContact: boolean) {
      const lines = [
        `✨ ${item.name}`,
        item.brand ? `by ${item.brand}` : "",
        item.retailer ? `Available at ${item.retailer}` : "",
        item.retailerUrl ? item.retailerUrl : "",
        item.estimatedPrice ? `Est. $${item.estimatedPrice}` : "",
        item.notes ? `\n${item.notes}` : "",
      ].filter(Boolean);

      if (includeContact) {
        lines.push("─────────────");
        if (profile.name) lines.push(`From: ${profile.name}`);
        if (profile.phone) lines.push(`📞 ${profile.phone}`);
        if (profile.email) lines.push(`📧 ${profile.email}`);
      }

      lines.push("\nShared via DiaGe");
      await Share.share({ message: lines.join("\n"), title: item.name });
    }

    if (hasProfile) {
      Alert.alert(
        "Share Wishlist Item",
        "Include your contact info so the retailer can follow up?",
        [
          { text: "No, share anonymously", onPress: () => doShare(false) },
          { text: "Yes, include my details", onPress: () => doShare(true) },
        ]
      );
    } else {
      await doShare(false);
    }
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
        <View style={styles.row}>
          <View style={styles.textBlock}>
            <View style={styles.header}>
              <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.actions}>
                <Pressable onPress={handleShare} hitSlop={8} style={styles.actionBtn}>
                  <Feather name="share-2" size={16} color={colors.gold} />
                </Pressable>
                {onEdit ? (
                  <Pressable onPress={onEdit} hitSlop={8} style={styles.actionBtn}>
                    <Feather name="edit-2" size={16} color={colors.mutedForeground} />
                  </Pressable>
                ) : null}
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

          {/* Thumbnail */}
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={[styles.thumb, { borderColor: colors.border }]}
              contentFit="cover"
            />
          ) : null}
        </View>
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
  row: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  textBlock: { flex: 1, gap: 4 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: { padding: 4 },
  meta: { fontSize: 13, fontFamily: "Inter_400Regular" },
  retailerRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  retailerText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  price: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 1,
    flexShrink: 0,
  },
});
