import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";

const PURPLE = "#5B21B6";
const PURPLE_LIGHT = "#7C3AED";
const GOLD = "#D4AA3A";

function fmt(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso || "—";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function warrantyLabel(type: string): string {
  if (type === "lifetime") return "Lifetime ∞";
  if (type === "dated") return "Dated";
  return "None";
}

export default function SharePieceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieceId } = useLocalSearchParams<{ pieceId: string }>();
  const { getPiece } = useDiGe();
  const { profile, hasProfile } = useProfile();
  const piece = getPiece(pieceId ?? "");

  if (!piece) {
    return (
      <>
        <Stack.Screen options={{ title: "Summary Card" }} />
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
            Piece not found.
          </Text>
        </View>
      </>
    );
  }

  const repairs = piece.repairHistory ?? [];
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const hasGoldWarranty = piece.goldWarrantyType && piece.goldWarrantyType !== "none";
  const hasDiamondBond = !!(piece.diamondBondNumber || piece.diamondBondExpiry);

  function buildShareLines(includeContact: boolean): string[] {
    const lines: string[] = [
      "💎 DiaGe — Digital Jewelry Record",
      "─────────────────────────────",
      `${piece!.type.toUpperCase()} · ${piece!.name}`,
    ];
    if (piece!.brand) lines.push(`Brand: ${piece!.brand}`);
    if (piece!.material) lines.push(`Material: ${piece!.material}`);
    lines.push("");
    lines.push("PURCHASE");
    if (piece!.retailer) lines.push(`Retailer: ${piece!.retailer}`);
    if (piece!.purchaseDate) lines.push(`Date: ${fmt(piece!.purchaseDate)}`);
    if (piece!.purchasePrice) lines.push(`Price: $${piece!.purchasePrice}`);
    if (piece!.serialNumber) lines.push(`Serial / Certificate: ${piece!.serialNumber}`);
    lines.push("");
    lines.push("WARRANTY — GOLD / METAL");
    if (piece!.goldWarrantyType === "none" || !piece!.goldWarrantyType) {
      lines.push("None");
    } else {
      lines.push(`Coverage: ${warrantyLabel(piece!.goldWarrantyType)}`);
      if (piece!.goldWarrantyNumber) lines.push(`Number: ${piece!.goldWarrantyNumber}`);
      if (piece!.goldWarrantyType === "dated" && piece!.goldWarrantyExpiry)
        lines.push(`Expires: ${fmt(piece!.goldWarrantyExpiry)}`);
      if (piece!.goldWarrantyDetails) lines.push(`Details: ${piece!.goldWarrantyDetails}`);
    }
    lines.push("");
    lines.push("DIAMOND BOND");
    if (!hasDiamondBond) {
      lines.push("None");
    } else {
      if (piece!.diamondBondNumber) lines.push(`Number: ${piece!.diamondBondNumber}`);
      if (piece!.diamondBondExpiry) lines.push(`Expires: ${fmt(piece!.diamondBondExpiry)}`);
      if (piece!.diamondBondDetails) lines.push(`Details: ${piece!.diamondBondDetails}`);
    }
    lines.push("");
    if (piece!.lastInspection) lines.push(`Last Inspection: ${fmt(piece!.lastInspection)}`);
    lines.push(`Repairs Logged: ${repairs.length}`);
    if (includeContact) {
      lines.push("");
      lines.push("─────────────────────────────");
      if (profile.name) lines.push(`Owner: ${profile.name}`);
      if (profile.phone) lines.push(`📞 ${profile.phone}`);
      if (profile.email) lines.push(`📧 ${profile.email}`);
    }
    lines.push("");
    lines.push(`Generated with DiaGe • ${today}`);
    return lines;
  }

  async function handleShareText() {
    if (hasProfile) {
      Alert.alert(
        "Share Piece Summary",
        "Include your contact info so the recipient can follow up?",
        [
          {
            text: "No, share anonymously",
            onPress: async () => {
              await Share.share({ message: buildShareLines(false).join("\n") });
            },
          },
          {
            text: "Yes, include my details",
            onPress: async () => {
              await Share.share({ message: buildShareLines(true).join("\n") });
            },
          },
        ]
      );
    } else {
      await Share.share({ message: buildShareLines(false).join("\n") });
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Summary Card",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.outer, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hint */}
        <View style={[styles.hint, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="smartphone" size={14} color={colors.primary} />
          <Text style={[styles.hintText, { color: colors.mutedForeground }]}>
            Screenshot this screen to save or send to your insurer or jeweler
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Card header */}
          <View style={[styles.cardHeader, { backgroundColor: PURPLE }]}>
            <View style={styles.cardHeaderTop}>
              <View style={styles.digeWordmark}>
                <View style={[styles.diamondDot, { backgroundColor: "#fff" }]} />
                <Text style={styles.digeText}>DiaGe</Text>
              </View>
              <Text style={styles.recordLabel}>Digital Jewelry Record</Text>
            </View>
            <View style={styles.cardHeaderBottom}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {piece.type.charAt(0).toUpperCase() + piece.type.slice(1)}
                </Text>
              </View>
              <Text style={styles.cardPieceName} numberOfLines={2}>
                {piece.name}
              </Text>
              {piece.brand ? (
                <Text style={styles.cardBrand}>{piece.brand}</Text>
              ) : null}
              {piece.material ? (
                <Text style={styles.cardMaterial}>{piece.material}</Text>
              ) : null}
            </View>
          </View>

          {/* Photo strip */}
          {piece.imageUri ? (
            <Image
              source={{ uri: piece.imageUri }}
              style={styles.cardPhoto}
              resizeMode="cover"
            />
          ) : null}

          {/* Diamond Grading section */}
          {(piece.diamondCut || piece.diamondColor || piece.diamondClarity || piece.diamondCaratWeight) ? (
            <>
              <View style={styles.cardDivider} />
              <View style={styles.cardSection}>
                <View style={styles.cardSectionHeader}>
                  <View style={[styles.cardSectionDot, { backgroundColor: PURPLE_LIGHT }]} />
                  <Text style={[styles.cardSectionTitle, { color: PURPLE }]}>Diamond Grading (4 Cs)</Text>
                </View>
                <View style={styles.cardGrid}>
                  {piece.diamondCaratWeight ? <CardCell label="Carat" value={`${piece.diamondCaratWeight} ct`} /> : null}
                  {piece.diamondCut ? <CardCell label="Cut" value={piece.diamondCut} /> : null}
                  {piece.diamondColor ? <CardCell label="Color" value={piece.diamondColor} /> : null}
                  {piece.diamondClarity ? <CardCell label="Clarity" value={piece.diamondClarity} /> : null}
                </View>
              </View>
            </>
          ) : null}

          {/* Purchase section */}
          <View style={styles.cardSection}>
            <View style={styles.cardSectionHeader}>
              <View style={[styles.cardSectionDot, { backgroundColor: PURPLE }]} />
              <Text style={[styles.cardSectionTitle, { color: PURPLE }]}>Purchase Details</Text>
            </View>
            <View style={styles.cardGrid}>
              {piece.retailer ? <CardCell label="Retailer" value={piece.retailer} /> : null}
              {piece.purchaseDate ? <CardCell label="Date" value={fmt(piece.purchaseDate)} /> : null}
              {piece.purchasePrice ? <CardCell label="Price" value={`$${piece.purchasePrice}`} /> : null}
              {piece.serialNumber ? <CardCell label="Serial / Certificate" value={piece.serialNumber} wide /> : null}
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Warranty section */}
          <View style={styles.cardSection}>
            <View style={styles.cardSectionHeader}>
              <View style={[styles.cardSectionDot, { backgroundColor: GOLD }]} />
              <Text style={[styles.cardSectionTitle, { color: "#92601A" }]}>Warranty & Bond</Text>
            </View>
            <View style={styles.warrantyRow}>
              {/* Gold */}
              <View style={[styles.warrantyBox, { borderColor: "#E5D9C0", backgroundColor: "#FFFBF0" }]}>
                <View style={styles.warrantyBoxHeader}>
                  <Feather name="shield" size={13} color={GOLD} />
                  <Text style={[styles.warrantyBoxTitle, { color: "#92601A" }]}>Gold / Metal</Text>
                </View>
                {!hasGoldWarranty ? (
                  <Text style={styles.warrantyNone}>Not set</Text>
                ) : (
                  <>
                    <Text style={[styles.warrantyType, { color: piece.goldWarrantyType === "lifetime" ? "#15803D" : "#B45309" }]}>
                      {warrantyLabel(piece.goldWarrantyType)}
                    </Text>
                    {piece.goldWarrantyNumber ? (
                      <View style={styles.warrantyNumRow}>
                        <Feather name="hash" size={10} color="#92601A" />
                        <Text style={styles.warrantyNum}>{piece.goldWarrantyNumber}</Text>
                      </View>
                    ) : null}
                    {piece.goldWarrantyType === "dated" && piece.goldWarrantyExpiry ? (
                      <Text style={styles.warrantyExp}>Exp. {fmt(piece.goldWarrantyExpiry)}</Text>
                    ) : null}
                  </>
                )}
              </View>

              {/* Diamond */}
              <View style={[styles.warrantyBox, { borderColor: "#D8D0F0", backgroundColor: "#F7F4FF" }]}>
                <View style={styles.warrantyBoxHeader}>
                  <Feather name="hexagon" size={13} color={PURPLE_LIGHT} />
                  <Text style={[styles.warrantyBoxTitle, { color: PURPLE }]}>Diamond Bond</Text>
                </View>
                {!hasDiamondBond ? (
                  <Text style={styles.warrantyNone}>Not set</Text>
                ) : (
                  <>
                    {piece.diamondBondNumber ? (
                      <View style={styles.warrantyNumRow}>
                        <Feather name="hash" size={10} color={PURPLE_LIGHT} />
                        <Text style={[styles.warrantyNum, { color: PURPLE }]}>{piece.diamondBondNumber}</Text>
                      </View>
                    ) : null}
                    {piece.diamondBondExpiry ? (
                      <Text style={[styles.warrantyExp, { color: "#5B21B6" }]}>Exp. {fmt(piece.diamondBondExpiry)}</Text>
                    ) : null}
                    {!piece.diamondBondNumber && !piece.diamondBondExpiry ? (
                      <Text style={styles.warrantyNone}>Details on file</Text>
                    ) : null}
                  </>
                )}
              </View>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Inspection & Repairs */}
          <View style={styles.cardSection}>
            <View style={styles.cardSectionHeader}>
              <View style={[styles.cardSectionDot, { backgroundColor: "#10B981" }]} />
              <Text style={[styles.cardSectionTitle, { color: "#065F46" }]}>Service History</Text>
            </View>
            <View style={styles.cardGrid}>
              {piece.lastInspection ? (
                <CardCell label="Last Inspection" value={fmt(piece.lastInspection)} />
              ) : null}
              <CardCell label="Repairs Logged" value={`${repairs.length} entr${repairs.length === 1 ? "y" : "ies"}`} />
            </View>
            {piece.description ? (
              <Text style={styles.cardNotes} numberOfLines={3}>{piece.description}</Text>
            ) : null}
          </View>

          {/* Owner section — only when profile is set */}
          {hasProfile ? (
            <>
              <View style={styles.cardDivider} />
              <View style={styles.cardSection}>
                <View style={styles.cardSectionHeader}>
                  <View style={[styles.cardSectionDot, { backgroundColor: PURPLE_LIGHT }]} />
                  <Text style={[styles.cardSectionTitle, { color: PURPLE }]}>Owner</Text>
                </View>
                <View style={styles.ownerRow}>
                  <View style={[styles.ownerAvatar, { backgroundColor: PURPLE }]}>
                    <Text style={styles.ownerInitials}>
                      {profile.name
                        ? profile.name.trim().split(" ").filter(Boolean).length > 1
                          ? (profile.name.trim().split(" ")[0][0] + profile.name.trim().split(" ").pop()![0]).toUpperCase()
                          : profile.name.trim()[0].toUpperCase()
                        : "?"}
                    </Text>
                  </View>
                  <View style={styles.ownerInfo}>
                    {profile.name ? (
                      <Text style={styles.ownerName}>{profile.name}</Text>
                    ) : null}
                    {profile.phone ? (
                      <Text style={styles.ownerContact}>{profile.phone}</Text>
                    ) : null}
                    {profile.email ? (
                      <Text style={styles.ownerContact}>{profile.email}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            </>
          ) : null}

          {/* Card footer */}
          <View style={[styles.cardFooter, { backgroundColor: "#F5F3FF" }]}>
            <View style={styles.footerLeft}>
              <View style={[styles.diamondDot, { backgroundColor: PURPLE }]} />
              <Text style={[styles.footerBrand, { color: PURPLE }]}>DiaGe</Text>
            </View>
            <View style={styles.footerRight}>
              <Text style={styles.footerAppStore}>📱 Download on the App Store</Text>
              <Text style={styles.footerDate}>Generated {today}</Text>
            </View>
          </View>
        </View>

        {/* Share as text button */}
        <Pressable
          onPress={handleShareText}
          style={[styles.shareBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name="share-2" size={18} color="#fff" />
          <Text style={styles.shareBtnText}>Share as Text</Text>
        </Pressable>

        <Text style={[styles.shareNote, { color: colors.mutedForeground }]}>
          "Share as Text" sends all details as a formatted message via any app
        </Text>
      </ScrollView>
    </>
  );
}

function CardCell({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <View style={[styles.cardCell, wide && styles.cardCellWide]}>
      <Text style={styles.cardCellLabel}>{label}</Text>
      <Text style={styles.cardCellValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { padding: 20, gap: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  hintText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  cardHeader: { padding: 20, gap: 14 },
  cardHeaderTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  digeWordmark: { flexDirection: "row", alignItems: "center", gap: 7 },
  diamondDot: { width: 10, height: 10, borderRadius: 3, transform: [{ rotate: "45deg" }] },
  digeText: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.3 },
  recordLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.65)", letterSpacing: 0.3 },
  cardHeaderBottom: { gap: 4 },
  typeBadge: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginBottom: 2 },
  typeBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#fff", textTransform: "uppercase", letterSpacing: 0.5 },
  cardPieceName: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.5 },
  cardBrand: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  cardMaterial: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.9)" },

  cardPhoto: { width: "100%", height: 180 },

  cardSection: { padding: 18, gap: 12 },
  cardSectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardSectionDot: { width: 8, height: 8, borderRadius: 4 },
  cardSectionTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8, textTransform: "uppercase" },
  cardDivider: { height: 1, backgroundColor: "#F0EEF8", marginHorizontal: 18 },

  cardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  cardCell: { width: "45%", gap: 2 },
  cardCellWide: { width: "100%" },
  cardCellLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 },
  cardCellValue: { fontSize: 14, fontFamily: "Inter_500Medium", color: "#111827" },

  warrantyRow: { flexDirection: "row", gap: 10 },
  warrantyBox: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, gap: 6 },
  warrantyBoxHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  warrantyBoxTitle: { fontSize: 11, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.4 },
  warrantyType: { fontSize: 14, fontFamily: "Inter_700Bold" },
  warrantyNumRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  warrantyNum: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#92601A", letterSpacing: 0.3 },
  warrantyExp: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#6B7280" },
  warrantyNone: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#9CA3AF", fontStyle: "italic" },

  cardNotes: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#6B7280", lineHeight: 17, borderTopWidth: 1, borderTopColor: "#F0EEF8", paddingTop: 10 },

  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 12 },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerBrand: { fontSize: 13, fontFamily: "Inter_700Bold" },
  footerRight: { alignItems: "flex-end", gap: 2 },
  footerAppStore: { fontSize: 10, fontFamily: "Inter_500Medium", color: "#6B7280" },
  footerDate: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#9CA3AF" },

  shareBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 52, borderRadius: 16 },
  shareBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  shareNote: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },

  ownerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  ownerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ownerInitials: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#fff" },
  ownerInfo: { flex: 1, gap: 2 },
  ownerName: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#111827" },
  ownerContact: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#6B7280" },
});
