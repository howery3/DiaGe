import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe, type RepairEntry } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysStatus(expiry: string): { text: string; color: string } | null {
  if (!expiry) return null;
  const diff = new Date(expiry).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { text: "Expired", color: "#DC2626" };
  if (days === 0) return { text: "Expires today", color: "#B45309" };
  if (days <= 90) return { text: `${days} days remaining`, color: "#B45309" };
  return { text: `Active — ${days} days remaining`, color: "#15803D" };
}

async function pickFromLibrary(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") { Alert.alert("Permission needed", "Allow photo library access."); return null; }
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [4, 3], quality: 0.85 });
  return result.canceled ? null : result.assets[0].uri;
}

async function pickFromCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") { Alert.alert("Permission needed", "Allow camera access."); return null; }
  const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.85 });
  return result.canceled ? null : result.assets[0].uri;
}

const REPAIR_TYPE_COLORS: Record<string, string> = {
  "Resize": "#7C3AED",
  "Stone Replacement": "#0EA5E9",
  "Prong Repair": "#F59E0B",
  "Setting Repair": "#F59E0B",
  "Cleaning & Polish": "#10B981",
  "Chain Repair": "#8B5CF6",
  "Clasp Repair": "#6366F1",
  "Re-dipping / Rhodium": "#EC4899",
  "Engraving": "#14B8A6",
  "Other": "#78716C",
};

export default function PieceDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPiece, deletePiece, updatePiece, deleteRepair } = useDiGe();
  const piece = getPiece(id ?? "");

  if (!piece) {
    return (
      <>
        <Stack.Screen options={{ title: "Not Found" }} />
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Piece not found.</Text>
        </View>
      </>
    );
  }

  const goldStatus =
    piece.goldWarrantyType === "lifetime"
      ? { text: "Lifetime — no expiry", color: "#15803D" }
      : piece.goldWarrantyType === "dated"
      ? daysStatus(piece.goldWarrantyExpiry)
      : null;

  const diamondStatus = daysStatus(piece.diamondBondExpiry);
  const repairs = (piece.repairHistory ?? []).slice().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function handleDelete() {
    Alert.alert("Delete Piece", `Remove "${piece!.name}" from your vault?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); deletePiece(piece!.id); router.back(); } },
    ]);
  }

  function handleDeleteRepair(repair: RepairEntry) {
    Alert.alert("Delete Repair", `Remove this ${repair.repairType} entry?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); deleteRepair(piece!.id, repair.id); } },
    ]);
  }

  function handleChangePhoto() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: piece!.imageUri ? ["Cancel", "Take Photo", "Choose from Library", "Remove Photo"] : ["Cancel", "Take Photo", "Choose from Library"], cancelButtonIndex: 0, destructiveButtonIndex: piece!.imageUri ? 3 : undefined },
        async (idx) => {
          if (idx === 1) { const u = await pickFromCamera(); if (u) updatePiece(piece!.id, { imageUri: u }); }
          else if (idx === 2) { const u = await pickFromLibrary(); if (u) updatePiece(piece!.id, { imageUri: u }); }
          else if (idx === 3 && piece!.imageUri) updatePiece(piece!.id, { imageUri: undefined });
        }
      );
    } else {
      const opts: Alert.AlertButton[] = [
        { text: "Cancel", style: "cancel" },
        { text: "Camera", onPress: async () => { const u = await pickFromCamera(); if (u) updatePiece(piece!.id, { imageUri: u }); } },
        { text: "Photo Library", onPress: async () => { const u = await pickFromLibrary(); if (u) updatePiece(piece!.id, { imageUri: u }); } },
      ];
      if (piece.imageUri) opts.push({ text: "Remove Photo", style: "destructive", onPress: () => updatePiece(piece!.id, { imageUri: undefined }) });
      Alert.alert("Photo", "Choose an option", opts);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: piece.name,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
          headerRight: () => (
            <Pressable onPress={handleDelete} hitSlop={8}>
              <Feather name="trash-2" size={20} color={colors.destructive} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo */}
        {piece.imageUri ? (
          <Pressable onPress={handleChangePhoto} style={styles.heroImageWrap}>
            <Image source={{ uri: piece.imageUri }} style={styles.heroImage} resizeMode="cover" />
            <View style={[styles.photoEditChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="camera" size={12} color={colors.primary} />
              <Text style={[styles.photoEditText, { color: colors.primary }]}>Change Photo</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={handleChangePhoto} style={[styles.photoAdd, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Feather name="camera" size={20} color={colors.primary} />
            <Text style={[styles.photoAddText, { color: colors.primary }]}>Add Photo</Text>
          </Pressable>
        )}

        {/* Hero */}
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.typeTag, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.typeTagText, { color: colors.mutedForeground }]}>
              {piece.type.charAt(0).toUpperCase() + piece.type.slice(1)}
            </Text>
          </View>
          <Text style={[styles.heroName, { color: colors.foreground }]}>{piece.name}</Text>
          {piece.brand ? <Text style={[styles.heroBrand, { color: colors.mutedForeground }]}>{piece.brand}</Text> : null}
          {piece.material ? <Text style={[styles.heroMaterial, { color: colors.primary }]}>{piece.material}</Text> : null}
        </View>

        {/* Warranties side by side */}
        <View style={styles.warrantiesRow}>
          {/* Gold / Lifetime */}
          <View style={[styles.warrantyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.warrantyCardHeader}>
              <View style={[styles.warrantyCardIcon, { backgroundColor: "#D4AA3A18" }]}>
                <Feather name="shield" size={14} color="#D4AA3A" />
              </View>
              <Text style={[styles.warrantyCardTitle, { color: colors.foreground }]}>Lifetime Warranty</Text>
            </View>
            <Text style={[styles.warrantyCardSub, { color: colors.mutedForeground }]}>Gold / Metal</Text>

            {piece.goldWarrantyType === "none" || !piece.goldWarrantyType ? (
              <Text style={[styles.notSetText, { color: colors.mutedForeground }]}>Not set</Text>
            ) : (
              <>
                {piece.goldWarrantyType === "lifetime" ? (
                  <View style={[styles.statusPill, { backgroundColor: "#15803D18" }]}>
                    <Text style={[styles.statusPillText, { color: "#15803D" }]}>Lifetime ∞</Text>
                  </View>
                ) : goldStatus ? (
                  <View style={[styles.statusPill, { backgroundColor: goldStatus.color + "18" }]}>
                    <Text style={[styles.statusPillText, { color: goldStatus.color }]}>{goldStatus.text}</Text>
                  </View>
                ) : null}
                {piece.goldWarrantyNumber ? (
                  <View style={[styles.warrantyNumberChip, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                    <Feather name="hash" size={11} color={colors.mutedForeground} />
                    <Text style={[styles.warrantyNumberText, { color: colors.foreground }]}>{piece.goldWarrantyNumber}</Text>
                  </View>
                ) : null}
                {piece.goldWarrantyType === "dated" && piece.goldWarrantyExpiry ? (
                  <Text style={[styles.expiryText, { color: colors.mutedForeground }]}>Exp. {formatDate(piece.goldWarrantyExpiry)}</Text>
                ) : null}
                {piece.goldWarrantyDetails ? (
                  <Text style={[styles.detailsText, { color: colors.mutedForeground }]} numberOfLines={4}>{piece.goldWarrantyDetails}</Text>
                ) : null}
              </>
            )}
          </View>

          {/* Diamond Bond */}
          <View style={[styles.warrantyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.warrantyCardHeader}>
              <View style={[styles.warrantyCardIcon, { backgroundColor: colors.primary + "18" }]}>
                <Feather name="hexagon" size={14} color={colors.primary} />
              </View>
              <Text style={[styles.warrantyCardTitle, { color: colors.foreground }]}>Diamond Bond</Text>
            </View>
            <Text style={[styles.warrantyCardSub, { color: colors.mutedForeground }]}>Stone / Diamond</Text>

            {!piece.diamondBondExpiry && !piece.diamondBondNumber ? (
              <Text style={[styles.notSetText, { color: colors.mutedForeground }]}>Not set</Text>
            ) : (
              <>
                {diamondStatus ? (
                  <View style={[styles.statusPill, { backgroundColor: diamondStatus.color + "18" }]}>
                    <Text style={[styles.statusPillText, { color: diamondStatus.color }]}>{diamondStatus.text}</Text>
                  </View>
                ) : null}
                {piece.diamondBondNumber ? (
                  <View style={[styles.warrantyNumberChip, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                    <Feather name="hash" size={11} color={colors.mutedForeground} />
                    <Text style={[styles.warrantyNumberText, { color: colors.foreground }]}>{piece.diamondBondNumber}</Text>
                  </View>
                ) : null}
                {piece.diamondBondExpiry ? (
                  <Text style={[styles.expiryText, { color: colors.mutedForeground }]}>Exp. {formatDate(piece.diamondBondExpiry)}</Text>
                ) : null}
                {piece.diamondBondDetails ? (
                  <Text style={[styles.detailsText, { color: colors.mutedForeground }]} numberOfLines={4}>{piece.diamondBondDetails}</Text>
                ) : null}
              </>
            )}
          </View>
        </View>

        {/* Purchase Details */}
        <SectionCard label="Purchase Details" colors={colors}>
          <Row label="Retailer" value={piece.retailer} colors={colors} />
          <Row label="Purchase Date" value={formatDate(piece.purchaseDate)} colors={colors} />
          <Row label="Price" value={piece.purchasePrice ? `$${piece.purchasePrice}` : ""} colors={colors} />
          <Row label="Serial / Certificate" value={piece.serialNumber} colors={colors} />
        </SectionCard>

        {/* Inspection */}
        <SectionCard label="Inspection" colors={colors}>
          <Row label="Last Inspection" value={formatDate(piece.lastInspection)} colors={colors} />
        </SectionCard>

        {/* Documents */}
        {piece.description ? (
          <SectionCard label="Documents & Notes" colors={colors}>
            <Text style={[styles.notesText, { color: colors.foreground }]}>{piece.description}</Text>
          </SectionCard>
        ) : null}

        {/* Repair History */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Repair History</Text>
            <Pressable
              onPress={() =>
                router.push(
                  `/piece/add-repair?pieceId=${piece.id}&pieceName=${encodeURIComponent(piece.name)}`
                )
              }
              style={[styles.addRepairBtn, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}
            >
              <Feather name="plus" size={13} color={colors.primary} />
              <Text style={[styles.addRepairText, { color: colors.primary }]}>Add Repair</Text>
            </Pressable>
          </View>

          {repairs.length === 0 ? (
            <View style={[styles.emptyRepairs, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="tool" size={20} color={colors.mutedForeground} />
              <Text style={[styles.emptyRepairsText, { color: colors.mutedForeground }]}>
                No repairs logged yet
              </Text>
            </View>
          ) : (
            repairs.map((repair) => {
              const typeColor = REPAIR_TYPE_COLORS[repair.repairType] ?? "#78716C";
              return (
                <View key={repair.id} style={[styles.repairEntry, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.repairLeft, { borderColor: typeColor }]}>
                    <View style={styles.repairTopRow}>
                      <View style={[styles.repairTypeBadge, { backgroundColor: typeColor + "18" }]}>
                        <Text style={[styles.repairTypeText, { color: typeColor }]}>{repair.repairType}</Text>
                      </View>
                      {repair.cost ? (
                        <Text style={[styles.repairCost, { color: colors.foreground }]}>${repair.cost}</Text>
                      ) : (
                        <View style={[styles.coveredBadge, { backgroundColor: "#15803D18" }]}>
                          <Text style={[styles.coveredText, { color: "#15803D" }]}>Under Warranty</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.repairDate, { color: colors.mutedForeground }]}>
                      {formatDate(repair.date)}{repair.retailer ? ` · ${repair.retailer}` : ""}
                    </Text>
                    {repair.description ? (
                      <Text style={[styles.repairDesc, { color: colors.foreground }]}>{repair.description}</Text>
                    ) : null}
                  </View>
                  <Pressable onPress={() => handleDeleteRepair(repair)} hitSlop={8} style={styles.repairDelete}>
                    <Feather name="trash-2" size={15} color={colors.mutedForeground} />
                  </Pressable>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </>
  );
}

function SectionCard({ label, children, colors }: { label: string; children: React.ReactNode; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>{children}</View>
    </View>
  );
}

function Row({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useColors> }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 16, fontFamily: "Inter_400Regular" },
  heroImageWrap: { borderRadius: 16, overflow: "hidden" },
  heroImage: { width: "100%", height: 220, borderRadius: 16 },
  photoEditChip: { position: "absolute", bottom: 12, right: 12, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  photoEditText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  photoAdd: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 64, borderRadius: 14, borderWidth: 1.5, borderStyle: "dashed" },
  photoAddText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  heroCard: { padding: 20, borderRadius: 16, borderWidth: 1, gap: 6 },
  typeTag: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 4 },
  typeTagText: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  heroName: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  heroBrand: { fontSize: 15, fontFamily: "Inter_400Regular" },
  heroMaterial: { fontSize: 14, fontFamily: "Inter_500Medium" },
  warrantiesRow: { flexDirection: "row", gap: 10 },
  warrantyCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 14, gap: 7 },
  warrantyCardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  warrantyCardIcon: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  warrantyCardTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold", flex: 1 },
  warrantyCardSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  notSetText: { fontSize: 12, fontFamily: "Inter_400Regular", fontStyle: "italic" },
  statusPill: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  warrantyNumberChip: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  warrantyNumberText: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },
  expiryText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  detailsText: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 15 },
  section: { gap: 8 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase" },
  addRepairBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  addRepairText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  sectionCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  rowLabel: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  rowValue: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1, textAlign: "right" },
  notesText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  emptyRepairs: { flexDirection: "row", alignItems: "center", gap: 10, padding: 16, borderRadius: 14, borderWidth: 1 },
  emptyRepairsText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  repairEntry: { borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row", gap: 10 },
  repairLeft: { flex: 1, gap: 6, borderLeftWidth: 3, paddingLeft: 10 },
  repairTopRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  repairTypeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  repairTypeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  repairCost: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  coveredBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  coveredText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  repairDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  repairDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  repairDelete: { padding: 4 },
});
