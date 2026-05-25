import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe, type JewelryPiece } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { capture } from "@/utils/posthog";

function fmtValue(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 10_000) return `$${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function fmt(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso || "—";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function daysUntil(iso: string): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  if (isNaN(diff)) return null;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function expiryColor(days: number | null): string {
  if (days === null) return "#9CA3AF";
  if (days < 0) return "#DC2626";
  if (days <= 90) return "#B45309";
  return "#15803D";
}

function expiryLabel(days: number | null, expiry: string): string {
  if (days === null) return "—";
  if (days < 0) return `Expired ${fmt(expiry)}`;
  if (days === 0) return "Expires today";
  if (days <= 90) return `${days} days · ${fmt(expiry)}`;
  return fmt(expiry);
}

export default function InsuranceReportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces } = useDiGe();

  const totalValue = useMemo(() => {
    return pieces.reduce((sum, p) => {
      const n = parseFloat(p.purchasePrice.replace(/[^0-9.]/g, ""));
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
  }, [pieces]);

  const totalDocs = useMemo(
    () => pieces.reduce((sum, p) => sum + (p.documents ?? []).length, 0),
    [pieces]
  );

  const totalRepairs = useMemo(
    () => pieces.reduce((sum, p) => sum + (p.repairHistory ?? []).length, 0),
    [pieces]
  );

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  function valueRange(n: number): string {
    if (n < 500) return "under_500";
    if (n < 1000) return "500_to_1000";
    if (n < 5000) return "1000_to_5000";
    if (n < 10000) return "5000_to_10000";
    if (n < 50000) return "10000_to_50000";
    return "over_50000";
  }

  async function handleShareText() {
    const hr = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    const lines: string[] = [
      "💎 DiaGe — Insurance Summary",
      `Generated: ${today}`,
      hr,
      "",
      "OVERVIEW",
      `Total Pieces: ${pieces.length}`,
      `Total Estimated Value: $${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `Documents on File: ${totalDocs}`,
      `Repairs Logged: ${totalRepairs}`,
      "",
    ];

    pieces.forEach((p, i) => {
      lines.push(hr);
      lines.push(`[${i + 1}] ${p.name.toUpperCase()}`);
      if (p.brand) lines.push(`Brand: ${p.brand}`);
      if (p.material) lines.push(`Material: ${p.material}`);
      lines.push(`Type: ${p.type.charAt(0).toUpperCase() + p.type.slice(1)}`);
      if (p.retailer) lines.push(`Retailer: ${p.retailer}`);
      if (p.purchaseDate) lines.push(`Purchase Date: ${fmt(p.purchaseDate)}`);
      if (p.purchasePrice) lines.push(`Purchase Price: $${p.purchasePrice}`);
      if (p.serialNumber) lines.push(`Serial / Certificate: ${p.serialNumber}`);
      lines.push("");
      lines.push("  WARRANTY (GOLD / METAL)");
      if (!p.goldWarrantyType || p.goldWarrantyType === "none") {
        lines.push("  None");
      } else {
        lines.push(`  Coverage: ${p.goldWarrantyType === "lifetime" ? "Lifetime ∞" : "Dated"}`);
        if (p.goldWarrantyNumber) lines.push(`  Number: ${p.goldWarrantyNumber}`);
        if (p.goldWarrantyType === "dated" && p.goldWarrantyExpiry)
          lines.push(`  Expires: ${fmt(p.goldWarrantyExpiry)}`);
        if (p.goldWarrantyDetails) lines.push(`  Details: ${p.goldWarrantyDetails}`);
      }
      lines.push("");
      lines.push("  DIAMOND BOND");
      if (!p.diamondBondExpiry && !p.diamondBondNumber) {
        lines.push("  None");
      } else {
        if (p.diamondBondNumber) lines.push(`  Number: ${p.diamondBondNumber}`);
        if (p.diamondBondExpiry) lines.push(`  Expires: ${fmt(p.diamondBondExpiry)}`);
        if (p.diamondBondDetails) lines.push(`  Details: ${p.diamondBondDetails}`);
      }
      lines.push("");
      if (p.lastInspection) lines.push(`  Last Inspection: ${fmt(p.lastInspection)}`);
      lines.push(`  Repairs Logged: ${(p.repairHistory ?? []).length}`);
      lines.push(`  Documents on File: ${(p.documents ?? []).length}`);
      lines.push("");
    });

    lines.push(hr);
    lines.push(`Generated with DiaGe • ${today}`);

    await Share.share({ message: lines.join("\n") });
    capture("insurance_report_shared", {
      piece_count: pieces.length,
      total_value_range: valueRange(totalValue),
      total_docs: totalDocs,
      total_repairs: totalRepairs,
    });
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Insurance Summary",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
          headerRight: () => (
            <Pressable onPress={handleShareText} hitSlop={8}>
              <Feather name="share-2" size={20} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Screenshot hint */}
        <View style={[styles.hint, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="info" size={14} color={colors.primary} />
          <Text style={[styles.hintText, { color: colors.mutedForeground }]}>
            Screenshot or use the share icon to send this report to your insurer
          </Text>
        </View>

        {/* Summary stats */}
        <View style={[styles.statsCard, { backgroundColor: "#5B21B6" }]}>
          <View style={styles.statsTop}>
            <View style={[styles.digeWordmark]}>
              <View style={styles.diamondDot} />
              <Text style={styles.statsTitle}>DiaGe</Text>
            </View>
            <Text style={styles.statsDate}>Generated {today}</Text>
          </View>
          <Text style={styles.statsHeading}>Insurance Summary</Text>
          <View style={styles.statsRow}>
            <StatBox label="Pieces" value={`${pieces.length}`} />
            <StatBox
              label="Est. Value"
              value={totalValue > 0 ? fmtValue(totalValue) : "—"}
            />
            <StatBox label="Documents" value={`${totalDocs}`} />
            <StatBox label="Repairs" value={`${totalRepairs}`} />
          </View>
        </View>

        {pieces.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="box" size={28} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No pieces yet</Text>
            <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>
              Add jewelry pieces to your vault to generate an insurance report
            </Text>
          </View>
        ) : (
          pieces.map((piece, idx) => (
            <PieceReportCard key={piece.id} piece={piece} index={idx + 1} colors={colors} />
          ))
        )}

        {pieces.length > 0 ? (
          <Pressable
            onPress={handleShareText}
            style={[styles.shareBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="share-2" size={18} color="#fff" />
            <Text style={styles.shareBtnText}>Share Full Report</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function PieceReportCard({
  piece,
  index,
  colors,
}: {
  piece: JewelryPiece;
  index: number;
  colors: ReturnType<typeof useColors>;
}) {
  const goldDays =
    piece.goldWarrantyType === "dated" ? daysUntil(piece.goldWarrantyExpiry) : null;
  const diamondDays = daysUntil(piece.diamondBondExpiry);
  const hasGold = piece.goldWarrantyType && piece.goldWarrantyType !== "none";
  const hasDiamond = !!(piece.diamondBondExpiry || piece.diamondBondNumber);
  const repairs = piece.repairHistory ?? [];
  const documents = piece.documents ?? [];

  return (
    <View style={[styles.pieceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Card header */}
      <View style={[styles.pieceCardHeader, { borderBottomColor: colors.border }]}>
        <View style={[styles.indexBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.indexText}>{index}</Text>
        </View>
        <View style={styles.pieceCardTitleWrap}>
          <Text style={[styles.pieceCardName, { color: colors.foreground }]} numberOfLines={1}>
            {piece.name}
          </Text>
          <Text style={[styles.pieceCardMeta, { color: colors.mutedForeground }]}>
            {[piece.type.charAt(0).toUpperCase() + piece.type.slice(1), piece.brand, piece.material]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        </View>
        <View style={styles.pieceCardBadges}>
          {documents.length > 0 && (
            <View style={[styles.countChip, { backgroundColor: colors.secondary }]}>
              <Feather name="file" size={10} color={colors.mutedForeground} />
              <Text style={[styles.countChipText, { color: colors.mutedForeground }]}>
                {documents.length}
              </Text>
            </View>
          )}
          {repairs.length > 0 && (
            <View style={[styles.countChip, { backgroundColor: colors.secondary }]}>
              <Feather name="tool" size={10} color={colors.mutedForeground} />
              <Text style={[styles.countChipText, { color: colors.mutedForeground }]}>
                {repairs.length}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Purchase details */}
      <View style={styles.fieldGrid}>
        <ReportField label="Retailer" value={piece.retailer} colors={colors} />
        <ReportField label="Purchase Date" value={fmt(piece.purchaseDate)} colors={colors} />
        {piece.purchasePrice ? (
          <ReportField label="Purchase Price" value={`$${piece.purchasePrice}`} colors={colors} />
        ) : null}
        {piece.serialNumber ? (
          <ReportField label="Serial / Certificate" value={piece.serialNumber} colors={colors} wide />
        ) : null}
        {piece.lastInspection ? (
          <ReportField label="Last Inspection" value={fmt(piece.lastInspection)} colors={colors} />
        ) : null}
      </View>

      {/* Warranty row */}
      <View style={[styles.warrantyDivider, { borderTopColor: colors.border }]} />
      <View style={styles.warrantyRow}>
        {/* Gold */}
        <View style={[styles.warrantyBox, { backgroundColor: "#FFFBF0", borderColor: "#E5D9C0" }]}>
          <View style={styles.wBoxHeader}>
            <Feather name="shield" size={12} color="#D4AA3A" />
            <Text style={styles.wBoxTitle}>Gold / Metal</Text>
          </View>
          {!hasGold ? (
            <Text style={styles.wBoxNone}>None</Text>
          ) : (
            <>
              <Text style={[styles.wBoxCoverage, { color: piece.goldWarrantyType === "lifetime" ? "#15803D" : "#B45309" }]}>
                {piece.goldWarrantyType === "lifetime" ? "Lifetime ∞" : "Dated"}
              </Text>
              {piece.goldWarrantyNumber ? (
                <View style={styles.wNumRow}>
                  <Feather name="hash" size={10} color="#92601A" />
                  <Text style={styles.wNum}>{piece.goldWarrantyNumber}</Text>
                </View>
              ) : null}
              {piece.goldWarrantyType === "dated" && piece.goldWarrantyExpiry ? (
                <Text style={[styles.wExp, { color: expiryColor(goldDays) }]}>
                  {expiryLabel(goldDays, piece.goldWarrantyExpiry)}
                </Text>
              ) : null}
            </>
          )}
        </View>

        {/* Diamond */}
        <View style={[styles.warrantyBox, { backgroundColor: "#F7F4FF", borderColor: "#D8D0F0" }]}>
          <View style={styles.wBoxHeader}>
            <Feather name="hexagon" size={12} color="#7C3AED" />
            <Text style={[styles.wBoxTitle, { color: "#5B21B6" }]}>Diamond Bond</Text>
          </View>
          {!hasDiamond ? (
            <Text style={styles.wBoxNone}>None</Text>
          ) : (
            <>
              {piece.diamondBondNumber ? (
                <View style={styles.wNumRow}>
                  <Feather name="hash" size={10} color="#7C3AED" />
                  <Text style={[styles.wNum, { color: "#5B21B6" }]}>{piece.diamondBondNumber}</Text>
                </View>
              ) : null}
              {piece.diamondBondExpiry ? (
                <Text style={[styles.wExp, { color: expiryColor(diamondDays) }]}>
                  {expiryLabel(diamondDays, piece.diamondBondExpiry)}
                </Text>
              ) : null}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

function ReportField({
  label,
  value,
  colors,
  wide,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  wide?: boolean;
}) {
  if (!value || value === "—") return null;
  return (
    <View style={[styles.reportField, wide && styles.reportFieldWide]}>
      <Text style={[styles.reportFieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.reportFieldValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 14 },

  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  hintText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },

  statsCard: { borderRadius: 20, padding: 20, gap: 14 },
  statsTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  digeWordmark: { flexDirection: "row", alignItems: "center", gap: 7 },
  diamondDot: { width: 9, height: 9, borderRadius: 2, backgroundColor: "#fff", transform: [{ rotate: "45deg" }] },
  statsTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  statsDate: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  statsHeading: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.3 },
  statsRow: { flexDirection: "row", gap: 8 },
  statBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 10, alignItems: "center", gap: 3 },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  statLabel: { fontSize: 10, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.7)", textAlign: "center" },

  empty: { padding: 32, borderRadius: 16, borderWidth: 1, alignItems: "center", gap: 10 },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  emptyHint: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 19 },

  pieceCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  pieceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  indexBadge: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  indexText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#fff" },
  pieceCardTitleWrap: { flex: 1, gap: 2 },
  pieceCardName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  pieceCardMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  pieceCardBadges: { flexDirection: "row", gap: 6 },
  countChip: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10 },
  countChipText: { fontSize: 11, fontFamily: "Inter_500Medium" },

  fieldGrid: { flexDirection: "row", flexWrap: "wrap", padding: 14, gap: 12 },
  reportField: { width: "45%", gap: 2 },
  reportFieldWide: { width: "100%" },
  reportFieldLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  reportFieldValue: { fontSize: 13, fontFamily: "Inter_500Medium" },

  warrantyDivider: { borderTopWidth: StyleSheet.hairlineWidth },
  warrantyRow: { flexDirection: "row", gap: 8, padding: 12 },
  warrantyBox: { flex: 1, borderRadius: 10, borderWidth: 1, padding: 10, gap: 5 },
  wBoxHeader: { flexDirection: "row", alignItems: "center", gap: 5 },
  wBoxTitle: { fontSize: 10, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.4, color: "#92601A" },
  wBoxNone: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#9CA3AF", fontStyle: "italic" },
  wBoxCoverage: { fontSize: 13, fontFamily: "Inter_700Bold" },
  wNumRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  wNum: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#92601A", letterSpacing: 0.2 },
  wExp: { fontSize: 11, fontFamily: "Inter_400Regular" },

  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    borderRadius: 16,
    marginTop: 4,
  },
  shareBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
