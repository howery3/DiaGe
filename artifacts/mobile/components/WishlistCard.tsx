import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import React, { useRef } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import QRCode from "react-native-qrcode-svg";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";
import type { WishlistItem, WishlistPriority } from "@/context/DiGeContext";
import { capture } from "@/utils/posthog";

const PRIMARY = "#5B21B6";
const PRIMARY_DARK = "#4C1D95";
const CARD_WIDTH = 360;

const PRIORITY_COLORS: Record<WishlistPriority, string> = {
  low: "#15803D",
  medium: "#B45309",
  high: "#DC2626",
};

const PRIORITY_LABELS: Record<WishlistPriority, string> = {
  low: "Low priority",
  medium: "Medium priority",
  high: "High priority",
};

interface WishlistCardProps {
  item: WishlistItem;
  onPress: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export function WishlistCard({ item, onPress, onDelete, onEdit }: WishlistCardProps) {
  const colors = useColors();
  const { profile } = useProfile();
  const priorityColor = PRIORITY_COLORS[item.priority];
  const snapRef = useRef<View>(null);

  const hasContact = !!(profile.name || profile.phone || profile.email);

  let urlDomain = "";
  if (item.retailerUrl) {
    try { urlDomain = new URL(item.retailerUrl).hostname.replace(/^www\./, ""); } catch {}
  }

  async function handleShare() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const uri = await captureRef(snapRef, { format: "png", quality: 1, result: "tmpfile" });
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: item.name });
        capture("wishlist_item_shared", {
          retailer: item.retailer || "unknown",
          type: item.type || "unknown",
          sku: item.sku || "unknown",
          brand: item.brand || "unknown",
        });
      } else {
        Alert.alert("Sharing not available", "Your device doesn't support image sharing.");
      }
    } catch {
      Alert.alert("Couldn't capture", "Please try again.");
    }
  }

  return (
    <>
      {/* Off-screen branded card — captured as image when shared */}
      <View ref={snapRef} collapsable={false} style={snap.card} pointerEvents="none">
        {/* Header */}
        <View style={snap.header}>
          <View style={snap.headerRow}>
            <View style={snap.logoBadge}>
              <Text style={snap.logoEmoji}>💎</Text>
            </View>
            <View style={snap.headerText}>
              <Text style={snap.brandName}>DiaGe</Text>
              <Text style={snap.headerSub}>Wishlist Item</Text>
            </View>
            <View style={[snap.priorityBadge, { backgroundColor: priorityColor + "30", borderColor: priorityColor + "60" }]}>
              <View style={[snap.priorityDot, { backgroundColor: priorityColor }]} />
              <Text style={[snap.priorityLabel, { color: priorityColor }]}>
                {PRIORITY_LABELS[item.priority]}
              </Text>
            </View>
          </View>
          {item.retailer ? (
            <Text style={snap.retailerName}>{item.retailer}</Text>
          ) : null}
        </View>

        {/* Body */}
        <View style={snap.body}>
          <View style={snap.bodyRow}>
            <View style={snap.bodyText}>
              <Text style={snap.itemName}>{item.name}</Text>
              {item.sku ? <Text style={snap.sku}>SKU {item.sku}</Text> : null}
              {(item.brand || item.type) ? (
                <Text style={snap.meta}>{[item.brand, item.type].filter(Boolean).join(" · ")}</Text>
              ) : null}
              {item.estimatedPrice ? (
                <Text style={snap.price}>${item.estimatedPrice}</Text>
              ) : null}
              {urlDomain ? (
                <View style={snap.urlRow}>
                  <Feather name="link" size={11} color="#9989BF" />
                  <Text style={snap.urlText}>{urlDomain}</Text>
                </View>
              ) : null}
              {item.notes ? <Text style={snap.notes}>{item.notes}</Text> : null}
            </View>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={snap.thumb}
                contentFit="cover"
              />
            ) : null}
          </View>

          {/* QR code to buy */}
          {item.retailerUrl ? (
            <View style={snap.qrSection}>
              <View style={snap.qrBox}>
                <QRCode value={item.retailerUrl} size={80} color="#1A1A2E" backgroundColor="#fff" />
              </View>
              <View style={snap.qrLabels}>
                <Text style={snap.qrTitle}>Scan to buy</Text>
                <Text style={snap.qrUrl} numberOfLines={2}>{urlDomain || item.retailerUrl}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Contact section */}
        {hasContact ? (
          <View style={snap.contact}>
            {profile.name ? <Text style={snap.contactName}>{profile.name}</Text> : null}
            <View style={snap.contactRow}>
              {profile.phone ? (
                <Text style={snap.contactDetail}>📞 {profile.phone}</Text>
              ) : null}
              {profile.email ? (
                <Text style={snap.contactDetail}>📧 {profile.email}</Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Footer */}
        <View style={snap.footer}>
          <Text style={snap.footerText}>Powered by DiaGe · diageapp.com</Text>
        </View>
      </View>

      {/* Visible card */}
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
              {item.sku ? (
                <Text style={[styles.sku, { color: colors.mutedForeground }]}>SKU {item.sku}</Text>
              ) : null}
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
    </>
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
  sku: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 0.5 },
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

const snap = StyleSheet.create({
  card: {
    position: "absolute",
    left: -2000,
    top: 0,
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  header: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 18 },
  headerText: { flex: 1, gap: 1 },
  brandName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  priorityDot: { width: 6, height: 6, borderRadius: 3 },
  priorityLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  retailerName: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
  },

  body: {
    backgroundColor: "#fff",
    padding: 20,
  },
  bodyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  bodyText: { flex: 1, gap: 5 },
  itemName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#1A1A2E",
    lineHeight: 26,
  },
  sku: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#9989BF",
    letterSpacing: 0.5,
  },
  meta: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#555",
  },
  price: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: PRIMARY,
    marginTop: 4,
  },
  urlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  urlText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#9989BF",
  },
  notes: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#666",
    lineHeight: 19,
    marginTop: 4,
    fontStyle: "italic",
  },
  thumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
    flexShrink: 0,
    backgroundColor: "#F0ECF8",
  },

  contact: {
    backgroundColor: "#F8F7FF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E8E3F5",
    gap: 4,
  },
  contactName: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#1A1A2E",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  contactDetail: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#555",
  },

  footer: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.3,
  },

  qrSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0ECF8",
  },
  qrBox: {
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E3F5",
  },
  qrLabels: { flex: 1, gap: 4 },
  qrTitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: PRIMARY,
  },
  qrUrl: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#9989BF",
    lineHeight: 16,
  },
});
