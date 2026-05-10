import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useDiGe,
  type DocumentAttachment,
  type DocumentLabel,
  type RepairEntry,
} from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

const DOCUMENT_LABELS: DocumentLabel[] = [
  "Receipt",
  "Certificate",
  "Appraisal",
  "Insurance Doc",
  "Warranty Card",
  "Photo",
  "Other",
];

const LABEL_ICONS: Record<DocumentLabel, string> = {
  Receipt: "file-text",
  Certificate: "award",
  Appraisal: "dollar-sign",
  "Insurance Doc": "umbrella",
  "Warranty Card": "shield",
  Photo: "image",
  Other: "paperclip",
};

const LABEL_COLORS: Record<DocumentLabel, string> = {
  Receipt: "#0EA5E9",
  Certificate: "#F59E0B",
  Appraisal: "#10B981",
  "Insurance Doc": "#8B5CF6",
  "Warranty Card": "#D4AA3A",
  Photo: "#EC4899",
  Other: "#78716C",
};

const REPAIR_TYPE_COLORS: Record<string, string> = {
  Resize: "#7C3AED",
  "Stone Replacement": "#0EA5E9",
  "Prong Repair": "#F59E0B",
  "Setting Repair": "#F59E0B",
  "Cleaning & Polish": "#10B981",
  "Chain Repair": "#8B5CF6",
  "Clasp Repair": "#6366F1",
  "Re-dipping / Rhodium": "#EC4899",
  Engraving: "#14B8A6",
  Other: "#78716C",
};

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

async function pickImage(): Promise<string | null> {
  if (Platform.OS === "ios") {
    return new Promise((resolve) => {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["Cancel", "Take Photo", "Choose from Library"], cancelButtonIndex: 0 },
        async (idx) => {
          if (idx === 1) {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") { Alert.alert("Permission needed", "Allow camera access."); resolve(null); return; }
            const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.85 });
            resolve(r.canceled ? null : r.assets[0].uri);
          } else if (idx === 2) {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") { Alert.alert("Permission needed", "Allow photo library access."); resolve(null); return; }
            const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: false, quality: 0.85 });
            resolve(r.canceled ? null : r.assets[0].uri);
          } else {
            resolve(null);
          }
        }
      );
    });
  } else {
    return new Promise((resolve) => {
      Alert.alert("Add Document", "Choose a source", [
        { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
        {
          text: "Camera", onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") { Alert.alert("Permission needed"); resolve(null); return; }
            const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.85 });
            resolve(r.canceled ? null : r.assets[0].uri);
          },
        },
        {
          text: "Photo Library", onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") { Alert.alert("Permission needed"); resolve(null); return; }
            const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: false, quality: 0.85 });
            resolve(r.canceled ? null : r.assets[0].uri);
          },
        },
      ]);
    });
  }
}

export default function PieceDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPiece, deletePiece, updatePiece, deleteRepair, addDocument, deleteDocument } = useDiGe();
  const piece = getPiece(id ?? "");

  const [viewerDoc, setViewerDoc] = useState<DocumentAttachment | null>(null);
  const [addingDoc, setAddingDoc] = useState(false);
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState<DocumentLabel>("Receipt");
  const [pendingCaption, setPendingCaption] = useState("");

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

  const documents = piece.documents ?? [];
  const repairs = (piece.repairHistory ?? [])
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const goldStatus =
    piece.goldWarrantyType === "lifetime"
      ? { text: "Lifetime — no expiry", color: "#15803D" }
      : piece.goldWarrantyType === "dated"
      ? daysStatus(piece.goldWarrantyExpiry)
      : null;
  const diamondStatus = daysStatus(piece.diamondBondExpiry);

  function handleDelete() {
    Alert.alert("Delete Piece", `Remove "${piece!.name}" from your vault?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deletePiece(piece!.id);
          router.back();
        },
      },
    ]);
  }

  function handleDeleteRepair(repair: RepairEntry) {
    Alert.alert("Delete Repair", `Remove this ${repair.repairType} entry?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          deleteRepair(piece!.id, repair.id);
        },
      },
    ]);
  }

  function handleDeleteDocument(doc: DocumentAttachment) {
    Alert.alert("Delete Document", `Remove this ${doc.label}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          deleteDocument(piece!.id, doc.id);
          if (viewerDoc?.id === doc.id) setViewerDoc(null);
        },
      },
    ]);
  }

  async function handleAddDocument() {
    const uri = await pickImage();
    if (!uri) return;
    setPendingUri(uri);
    setPendingLabel("Receipt");
    setPendingCaption("");
    setAddingDoc(true);
  }

  function handleSaveDocument() {
    if (!pendingUri) return;
    addDocument(piece!.id, { uri: pendingUri, label: pendingLabel, caption: pendingCaption.trim() });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAddingDoc(false);
    setPendingUri(null);
    setPendingCaption("");
  }

  function handleChangeHeroPhoto() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: piece!.imageUri ? ["Cancel", "Take Photo", "Choose from Library", "Remove Photo"] : ["Cancel", "Take Photo", "Choose from Library"], cancelButtonIndex: 0, destructiveButtonIndex: piece!.imageUri ? 3 : undefined },
        async (idx) => {
          if (idx === 1) {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") { Alert.alert("Permission needed"); return; }
            const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.85 });
            if (!r.canceled) updatePiece(piece!.id, { imageUri: r.assets[0].uri });
          } else if (idx === 2) {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") { Alert.alert("Permission needed"); return; }
            const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [4, 3], quality: 0.85 });
            if (!r.canceled) updatePiece(piece!.id, { imageUri: r.assets[0].uri });
          } else if (idx === 3 && piece!.imageUri) {
            updatePiece(piece!.id, { imageUri: undefined });
          }
        }
      );
    } else {
      const opts: Alert.AlertButton[] = [
        { text: "Cancel", style: "cancel" },
        {
          text: "Camera", onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") return;
            const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.85 });
            if (!r.canceled) updatePiece(piece!.id, { imageUri: r.assets[0].uri });
          },
        },
        {
          text: "Photo Library", onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") return;
            const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [4, 3], quality: 0.85 });
            if (!r.canceled) updatePiece(piece!.id, { imageUri: r.assets[0].uri });
          },
        },
      ];
      if (piece.imageUri) opts.push({ text: "Remove Photo", style: "destructive", onPress: () => updatePiece(piece!.id, { imageUri: undefined }) });
      Alert.alert("Hero Photo", "Choose an option", opts);
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

      {/* Document full-screen viewer */}
      <Modal visible={viewerDoc !== null} animationType="fade" statusBarTranslucent>
        <View style={[styles.viewerBg, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.viewerTopBar}>
            <View style={[styles.viewerLabelChip, { backgroundColor: viewerDoc ? LABEL_COLORS[viewerDoc.label] + "30" : "transparent" }]}>
              <Feather name={(viewerDoc ? LABEL_ICONS[viewerDoc.label] : "file") as any} size={13} color={viewerDoc ? LABEL_COLORS[viewerDoc.label] : "#fff"} />
              <Text style={[styles.viewerLabelText, { color: viewerDoc ? LABEL_COLORS[viewerDoc.label] : "#fff" }]}>{viewerDoc?.label}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Pressable onPress={() => { if (viewerDoc) handleDeleteDocument(viewerDoc); }} style={styles.viewerAction} hitSlop={8}>
              <Feather name="trash-2" size={20} color="#EF4444" />
            </Pressable>
            <Pressable onPress={() => setViewerDoc(null)} style={styles.viewerClose} hitSlop={8}>
              <Feather name="x" size={22} color="#fff" />
            </Pressable>
          </View>
          {viewerDoc && (
            <Image source={{ uri: viewerDoc.uri }} style={styles.viewerImage} resizeMode="contain" />
          )}
          {viewerDoc?.caption ? (
            <Text style={styles.viewerCaption}>{viewerDoc.caption}</Text>
          ) : null}
        </View>
      </Modal>

      {/* Add document label modal */}
      <Modal visible={addingDoc} animationType="slide" transparent statusBarTranslucent>
        <View style={styles.labelModalOverlay}>
          <View style={[styles.labelModalSheet, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.labelModalHandle} />
            <Text style={[styles.labelModalTitle, { color: colors.foreground }]}>Label this document</Text>
            {pendingUri && (
              <Image source={{ uri: pendingUri }} style={[styles.labelModalPreview, { borderColor: colors.border }]} resizeMode="cover" />
            )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.labelScroll} contentContainerStyle={styles.labelScrollContent}>
              {DOCUMENT_LABELS.map((lbl) => {
                const color = LABEL_COLORS[lbl];
                const selected = pendingLabel === lbl;
                return (
                  <Pressable
                    key={lbl}
                    onPress={() => setPendingLabel(lbl)}
                    style={[styles.labelChip, { backgroundColor: selected ? color + "20" : colors.secondary, borderColor: selected ? color : colors.border, borderWidth: 1.5 }]}
                  >
                    <Feather name={LABEL_ICONS[lbl] as any} size={14} color={selected ? color : colors.mutedForeground} />
                    <Text style={[styles.labelChipText, { color: selected ? color : colors.foreground }]}>{lbl}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={[styles.captionWrap, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.captionInput, { color: colors.foreground }]}
                placeholder="Optional note (e.g. GIA #12345, appraisal from 2024)..."
                placeholderTextColor={colors.mutedForeground}
                value={pendingCaption}
                onChangeText={setPendingCaption}
                multiline
              />
            </View>
            <View style={styles.labelModalActions}>
              <Pressable onPress={() => { setAddingDoc(false); setPendingUri(null); }} style={[styles.labelCancelBtn, { borderColor: colors.border }]}>
                <Text style={[styles.labelCancelText, { color: colors.mutedForeground }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSaveDocument} style={[styles.labelSaveBtn, { backgroundColor: colors.primary }]}>
                <Feather name="check" size={16} color="#fff" />
                <Text style={styles.labelSaveText}>Save Document</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero photo */}
        {piece.imageUri ? (
          <Pressable onPress={handleChangeHeroPhoto} style={styles.heroImageWrap}>
            <Image source={{ uri: piece.imageUri }} style={styles.heroImage} resizeMode="cover" />
            <View style={[styles.photoEditChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="camera" size={12} color={colors.primary} />
              <Text style={[styles.photoEditText, { color: colors.primary }]}>Change Photo</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={handleChangeHeroPhoto} style={[styles.photoAdd, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Feather name="camera" size={20} color={colors.primary} />
            <Text style={[styles.photoAddText, { color: colors.primary }]}>Add Hero Photo</Text>
          </Pressable>
        )}

        {/* Hero card */}
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

        {/* Warranties */}
        <View style={styles.warrantiesRow}>
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

        {/* Documents & Photos gallery */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              Documents & Photos {documents.length > 0 ? `(${documents.length})` : ""}
            </Text>
            <Pressable
              onPress={handleAddDocument}
              style={[styles.addRepairBtn, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}
            >
              <Feather name="plus" size={13} color={colors.primary} />
              <Text style={[styles.addRepairText, { color: colors.primary }]}>Add</Text>
            </Pressable>
          </View>

          {documents.length === 0 ? (
            <View style={[styles.emptyDocs, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="folder" size={20} color={colors.mutedForeground} />
              <View>
                <Text style={[styles.emptyDocsTitle, { color: colors.foreground }]}>No documents yet</Text>
                <Text style={[styles.emptyDocsHint, { color: colors.mutedForeground }]}>
                  Add receipts, certificates, appraisals, and more
                </Text>
              </View>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll} contentContainerStyle={styles.galleryContent}>
              {documents.map((doc) => {
                const color = LABEL_COLORS[doc.label];
                return (
                  <Pressable key={doc.id} onPress={() => setViewerDoc(doc)} style={[styles.docCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Image source={{ uri: doc.uri }} style={styles.docThumb} resizeMode="cover" />
                    <View style={[styles.docLabelRow, { backgroundColor: color + "18" }]}>
                      <Feather name={LABEL_ICONS[doc.label] as any} size={11} color={color} />
                      <Text style={[styles.docLabelText, { color }]} numberOfLines={1}>{doc.label}</Text>
                    </View>
                    {doc.caption ? (
                      <Text style={[styles.docCaption, { color: colors.mutedForeground }]} numberOfLines={2}>{doc.caption}</Text>
                    ) : null}
                  </Pressable>
                );
              })}
              <Pressable onPress={handleAddDocument} style={[styles.docAddCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <Feather name="plus" size={24} color={colors.primary} />
                <Text style={[styles.docAddText, { color: colors.primary }]}>Add</Text>
              </Pressable>
            </ScrollView>
          )}
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

        {piece.description ? (
          <SectionCard label="Notes" colors={colors}>
            <Text style={[styles.notesText, { color: colors.foreground }]}>{piece.description}</Text>
          </SectionCard>
        ) : null}

        {/* Repair History */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              Repair History {repairs.length > 0 ? `(${repairs.length})` : ""}
            </Text>
            <Pressable
              onPress={() => router.push(`/piece/add-repair?pieceId=${piece.id}&pieceName=${encodeURIComponent(piece.name)}`)}
              style={[styles.addRepairBtn, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}
            >
              <Feather name="plus" size={13} color={colors.primary} />
              <Text style={[styles.addRepairText, { color: colors.primary }]}>Add Repair</Text>
            </Pressable>
          </View>

          {repairs.length === 0 ? (
            <View style={[styles.emptyRepairs, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="tool" size={20} color={colors.mutedForeground} />
              <Text style={[styles.emptyRepairsText, { color: colors.mutedForeground }]}>No repairs logged yet</Text>
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
  sectionCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  rowLabel: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  rowValue: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1, textAlign: "right" },
  notesText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },

  galleryScroll: { marginHorizontal: -4 },
  galleryContent: { paddingHorizontal: 4, gap: 10 },
  docCard: { width: 130, borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  docThumb: { width: 130, height: 100 },
  docLabelRow: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 5 },
  docLabelText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  docCaption: { fontSize: 11, fontFamily: "Inter_400Regular", paddingHorizontal: 8, paddingBottom: 8, lineHeight: 15 },
  docAddCard: { width: 130, height: 100 + 28, borderRadius: 14, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 6 },
  docAddText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  emptyDocs: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 14, borderWidth: 1 },
  emptyDocsTitle: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 2 },
  emptyDocsHint: { fontSize: 12, fontFamily: "Inter_400Regular" },

  addRepairBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  addRepairText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
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

  // Full-screen viewer
  viewerBg: { flex: 1, backgroundColor: "#000" },
  viewerTopBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  viewerLabelChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  viewerLabelText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  viewerAction: { padding: 8 },
  viewerClose: { padding: 8 },
  viewerImage: { flex: 1, width: "100%" },
  viewerCaption: { color: "#ccc", fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", padding: 16 },

  // Add document label sheet
  labelModalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  labelModalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 16 },
  labelModalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#ccc", alignSelf: "center", marginBottom: 4 },
  labelModalTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  labelModalPreview: { width: "100%", height: 140, borderRadius: 14, borderWidth: 1 },
  labelScroll: { flexGrow: 0 },
  labelScrollContent: { gap: 8, paddingVertical: 4 },
  labelChip: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  labelChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  captionWrap: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, minHeight: 60 },
  captionInput: { fontSize: 14, fontFamily: "Inter_400Regular" },
  labelModalActions: { flexDirection: "row", gap: 10 },
  labelCancelBtn: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  labelCancelText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  labelSaveBtn: { flex: 2, height: 48, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  labelSaveText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
