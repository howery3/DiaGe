import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BarcodeScannerModal } from "@/components/BarcodeScannerModal";
import { DatePickerModal } from "@/components/DatePickerModal";
import { useDiGe, type GoldWarrantyType, type JewelryType } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

const TYPES: { value: JewelryType; label: string }[] = [
  { value: "ring", label: "Ring" },
  { value: "necklace", label: "Necklace" },
  { value: "bracelet", label: "Bracelet" },
  { value: "earrings", label: "Earrings" },
  { value: "watch", label: "Watch" },
  { value: "brooch", label: "Brooch" },
  { value: "other", label: "Other" },
];

const METALS = ["Silver", "Yellow Gold", "White Gold", "Rose Gold", "Platinum", "10K", "14K", "18K", "24K", "Two-Tone"];
const DIAMOND_OPTIONS = [
  { value: "none", label: "None" },
  { value: "natural", label: "Natural" },
  { value: "lab", label: "Lab-Grown" },
];
const GEMSTONES = ["Ruby", "Sapphire", "Emerald", "Pearl", "Opal", "Amethyst", "Topaz", "Garnet", "Turquoise", "Other"];

const GOLD_WARRANTY_OPTIONS: { value: GoldWarrantyType; label: string; desc: string }[] = [
  { value: "lifetime", label: "Lifetime", desc: "No expiry" },
  { value: "dated", label: "Set Date", desc: "Has expiry" },
  { value: "none", label: "None", desc: "No coverage" },
];

function formatPickerDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
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

type DateField = "purchaseDate" | "goldExpiry" | "diamondExpiry" | "lastInspection";

export default function AddPieceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addPiece } = useDiGe();
  const { retailer: prefillRetailer, receiptUri } = useLocalSearchParams<{ retailer?: string; receiptUri?: string }>();

  const [name, setName] = useState("");
  const [type, setType] = useState<JewelryType>("ring");
  const [brand, setBrand] = useState("");
  const [metals, setMetals] = useState<string[]>([]);
  const [diamondType, setDiamondType] = useState("none");
  const [gemstones, setGemstones] = useState<string[]>([]);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [retailer, setRetailer] = useState(prefillRetailer ? decodeURIComponent(prefillRetailer) : "");
  const [serialNumber, setSerialNumber] = useState("");

  const [goldWarrantyType, setGoldWarrantyType] = useState<GoldWarrantyType>("none");
  const [goldWarrantyNumber, setGoldWarrantyNumber] = useState("");
  const [goldWarrantyExpiry, setGoldWarrantyExpiry] = useState("");
  const [goldWarrantyDetails, setGoldWarrantyDetails] = useState("");

  const [diamondBondNumber, setDiamondBondNumber] = useState("");
  const [diamondBondExpiry, setDiamondBondExpiry] = useState("");
  const [diamondBondDetails, setDiamondBondDetails] = useState("");

  const [description, setDescription] = useState("");
  const [lastInspection, setLastInspection] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(receiptUri ? decodeURIComponent(receiptUri) : undefined);

  const [activePicker, setActivePicker] = useState<DateField | null>(null);
  const [barcodeTarget, setBarcodeTarget] = useState<"goldWarrantyNumber" | "diamondBondNumber" | null>(null);

  const dateValues: Record<DateField, string> = {
    purchaseDate,
    goldExpiry: goldWarrantyExpiry,
    diamondExpiry: diamondBondExpiry,
    lastInspection,
  };
  const dateLabels: Record<DateField, string> = {
    purchaseDate: "Purchase Date",
    goldExpiry: "Warranty Expiry",
    diamondExpiry: "Bond Expiry",
    lastInspection: "Last Inspection",
  };
  const dateSetters: Record<DateField, (v: string) => void> = {
    purchaseDate: setPurchaseDate,
    goldExpiry: setGoldWarrantyExpiry,
    diamondExpiry: setDiamondBondExpiry,
    lastInspection: setLastInspection,
  };

  function handleSave() {
    if (!name.trim()) { Alert.alert("Required", "Please enter a name for this piece."); return; }
    const materialSummary = [
      ...metals,
      ...(diamondType !== "none" ? [diamondType === "lab" ? "Lab Diamond" : "Natural Diamond"] : []),
      ...gemstones,
    ].join(", ");
    addPiece({
      name: name.trim(), type, brand: brand.trim(),
      material: materialSummary, metals, diamondType, gemstones,
      purchaseDate, purchasePrice: purchasePrice.trim(), retailer: retailer.trim(),
      serialNumber: serialNumber.trim(),
      goldWarrantyType, goldWarrantyNumber: goldWarrantyNumber.trim(),
      goldWarrantyExpiry, goldWarrantyDetails: goldWarrantyDetails.trim(),
      diamondBondNumber: diamondBondNumber.trim(),
      diamondBondExpiry, diamondBondDetails: diamondBondDetails.trim(),
      repairHistory: [], documents: [],
      description: description.trim(), lastInspection, imageUri,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  function handlePickPhoto() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["Cancel", "Take Photo", "Choose from Library"], cancelButtonIndex: 0 },
        async (idx) => {
          if (idx === 1) { const u = await pickFromCamera(); if (u) setImageUri(u); }
          else if (idx === 2) { const u = await pickFromLibrary(); if (u) setImageUri(u); }
        }
      );
    } else {
      Alert.alert("Add Photo", "Choose a source", [
        { text: "Cancel", style: "cancel" },
        { text: "Camera", onPress: async () => { const u = await pickFromCamera(); if (u) setImageUri(u); } },
        { text: "Photo Library", onPress: async () => { const u = await pickFromLibrary(); if (u) setImageUri(u); } },
      ]);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: retailer ? `Add to ${retailer}` : "Add Piece",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
          headerRight: () => (
            <Pressable onPress={handleSave} hitSlop={8}>
              <Text style={[styles.saveBtn, { color: colors.primary }]}>Save</Text>
            </Pressable>
          ),
        }}
      />
      <KeyboardAwareScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo */}
        <View style={styles.photoSection}>
          {imageUri ? (
            <View style={styles.photoPreviewWrap}>
              <Image source={{ uri: imageUri }} style={styles.photoPreview} resizeMode="cover" />
              <Pressable onPress={() => setImageUri(undefined)} style={[styles.removePhoto, { backgroundColor: colors.destructive }]}>
                <Feather name="x" size={14} color="#fff" />
              </Pressable>
              <Pressable onPress={handlePickPhoto} style={[styles.changePhoto, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="camera" size={14} color={colors.primary} />
                <Text style={[styles.changePhotoText, { color: colors.primary }]}>Change</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={handlePickPhoto} style={[styles.photoPlaceholder, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Feather name="camera" size={26} color={colors.primary} />
              <Text style={[styles.photoLabel, { color: colors.primary }]}>Add Photo</Text>
              <Text style={[styles.photoHint, { color: colors.mutedForeground }]}>Receipt, certificate, or piece photo</Text>
            </Pressable>
          )}
        </View>

        <SectionLabel label="Basic Info" colors={colors} />
        <Field label="Name *" colors={colors}>
          <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="e.g. Engagement Ring" placeholderTextColor={colors.mutedForeground} value={name} onChangeText={setName} />
        </Field>
        <Field label="Type" colors={colors}>
          <View style={styles.pillRow}>
            {TYPES.map((t) => (
              <Pressable key={t.value} onPress={() => setType(t.value)} style={[styles.pill, { backgroundColor: type === t.value ? colors.primary : colors.secondary, borderColor: type === t.value ? colors.primary : colors.border }]}>
                <Text style={[styles.pillText, { color: type === t.value ? colors.primaryForeground : colors.foreground }]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
        </Field>
        <Field label="Brand" colors={colors}>
          <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="e.g. Tiffany & Co." placeholderTextColor={colors.mutedForeground} value={brand} onChangeText={setBrand} />
        </Field>

        <Field label="Metal" colors={colors}>
          <View style={styles.pillRow}>
            {METALS.map((m) => {
              const selected = metals.includes(m);
              return (
                <Pressable key={m} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setMetals((prev) => selected ? prev.filter((x) => x !== m) : [...prev, m]); }} style={[styles.pill, { backgroundColor: selected ? colors.primary : colors.secondary, borderColor: selected ? colors.primary : colors.border }]}>
                  <Text style={[styles.pillText, { color: selected ? colors.primaryForeground : colors.foreground }]}>{m}</Text>
                </Pressable>
              );
            })}
          </View>
        </Field>

        <Field label="Diamond" colors={colors}>
          <View style={styles.pillRow}>
            {DIAMOND_OPTIONS.map((opt) => {
              const selected = diamondType === opt.value;
              return (
                <Pressable key={opt.value} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDiamondType(opt.value); }} style={[styles.pill, { backgroundColor: selected ? colors.primary : colors.secondary, borderColor: selected ? colors.primary : colors.border }]}>
                  <Text style={[styles.pillText, { color: selected ? colors.primaryForeground : colors.foreground }]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Field>

        <Field label="Gemstones" colors={colors}>
          <View style={styles.pillRow}>
            {GEMSTONES.map((g) => {
              const selected = gemstones.includes(g);
              return (
                <Pressable key={g} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setGemstones((prev) => selected ? prev.filter((x) => x !== g) : [...prev, g]); }} style={[styles.pill, { backgroundColor: selected ? colors.primary : colors.secondary, borderColor: selected ? colors.primary : colors.border }]}>
                  <Text style={[styles.pillText, { color: selected ? colors.primaryForeground : colors.foreground }]}>{g}</Text>
                </Pressable>
              );
            })}
          </View>
        </Field>

        <SectionLabel label="Purchase Details" colors={colors} />
        <Field label="Retailer" colors={colors}>
          <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="e.g. Zales, Kay, Helzberg..." placeholderTextColor={colors.mutedForeground} value={retailer} onChangeText={setRetailer} />
        </Field>
        <View style={styles.row}>
          <Field label="Purchase Date" colors={colors} style={{ flex: 1 }}>
            <DateRow value={purchaseDate} onPress={() => setActivePicker("purchaseDate")} onClear={() => setPurchaseDate("")} colors={colors} />
          </Field>
          <Field label="Price ($)" colors={colors} style={{ flex: 1 }}>
            <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="0.00" placeholderTextColor={colors.mutedForeground} value={purchasePrice} onChangeText={setPurchasePrice} keyboardType="decimal-pad" />
          </Field>
        </View>
        <Field label="Serial / Certificate Number" colors={colors}>
          <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="Optional" placeholderTextColor={colors.mutedForeground} value={serialNumber} onChangeText={setSerialNumber} />
        </Field>

        {/* Gold / Lifetime Warranty */}
        <View style={[styles.warrantyBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.warrantyHeader}>
            <View style={[styles.warrantyIconWrap, { backgroundColor: "#D4AA3A18" }]}>
              <Feather name="shield" size={16} color="#D4AA3A" />
            </View>
            <View>
              <Text style={[styles.warrantyTitle, { color: colors.foreground }]}>Lifetime Warranty</Text>
              <Text style={[styles.warrantySubtitle, { color: colors.mutedForeground }]}>Gold / Metal Coverage</Text>
            </View>
          </View>

          <View style={styles.optionRow}>
            {GOLD_WARRANTY_OPTIONS.map((opt) => (
              <Pressable key={opt.value} onPress={() => setGoldWarrantyType(opt.value)}
                style={[styles.optionPill, { backgroundColor: goldWarrantyType === opt.value ? colors.primary + "18" : colors.secondary, borderColor: goldWarrantyType === opt.value ? colors.primary : colors.border, borderWidth: 1.5 }]}>
                <Text style={[styles.optionPillLabel, { color: goldWarrantyType === opt.value ? colors.primary : colors.foreground }]}>{opt.label}</Text>
                <Text style={[styles.optionPillDesc, { color: colors.mutedForeground }]}>{opt.desc}</Text>
              </Pressable>
            ))}
          </View>

          {goldWarrantyType !== "none" ? (
            <>
              <Field label="Warranty Number" colors={colors} style={{ marginTop: 12, marginBottom: 0 }}>
                <View style={styles.scanInputRow}>
                  <TextInput style={[styles.input, styles.scanInputFlex, { color: colors.foreground, borderColor: colors.border }]} placeholder="e.g. LW-2024-001234" placeholderTextColor={colors.mutedForeground} value={goldWarrantyNumber} onChangeText={setGoldWarrantyNumber} autoCapitalize="characters" />
                  <Pressable onPress={() => setBarcodeTarget("goldWarrantyNumber")} style={[styles.scanIconBtn, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]} hitSlop={6}>
                    <Feather name="camera" size={18} color={colors.primary} />
                  </Pressable>
                </View>
              </Field>
              {goldWarrantyType === "dated" ? (
                <Field label="Expiry Date" colors={colors} style={{ marginTop: 10, marginBottom: 0 }}>
                  <DateRow value={goldWarrantyExpiry} onPress={() => setActivePicker("goldExpiry")} onClear={() => setGoldWarrantyExpiry("")} colors={colors} />
                </Field>
              ) : null}
              <Field label="Details (retailer, terms, contact)" colors={colors} style={{ marginTop: 10, marginBottom: 0 }}>
                <TextInput style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]} placeholder="Coverage info, inspection schedule, contact..." placeholderTextColor={colors.mutedForeground} value={goldWarrantyDetails} onChangeText={setGoldWarrantyDetails} multiline numberOfLines={2} textAlignVertical="top" />
              </Field>
            </>
          ) : null}
        </View>

        {/* Diamond Bond */}
        <View style={[styles.warrantyBlock, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 10 }]}>
          <View style={styles.warrantyHeader}>
            <View style={[styles.warrantyIconWrap, { backgroundColor: colors.primary + "18" }]}>
              <Feather name="hexagon" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.warrantyTitle, { color: colors.foreground }]}>Diamond Bond</Text>
              <Text style={[styles.warrantySubtitle, { color: colors.mutedForeground }]}>Stone / Diamond Coverage</Text>
            </View>
          </View>

          <Field label="Bond Number" colors={colors} style={{ marginTop: 12, marginBottom: 0 }}>
            <View style={styles.scanInputRow}>
              <TextInput style={[styles.input, styles.scanInputFlex, { color: colors.foreground, borderColor: colors.border }]} placeholder="e.g. DB-2024-567890" placeholderTextColor={colors.mutedForeground} value={diamondBondNumber} onChangeText={setDiamondBondNumber} autoCapitalize="characters" />
              <Pressable onPress={() => setBarcodeTarget("diamondBondNumber")} style={[styles.scanIconBtn, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]} hitSlop={6}>
                <Feather name="camera" size={18} color={colors.primary} />
              </Pressable>
            </View>
          </Field>
          <Field label="Bond Expiry Date (leave blank if no bond)" colors={colors} style={{ marginTop: 10, marginBottom: 0 }}>
            <DateRow value={diamondBondExpiry} onPress={() => setActivePicker("diamondExpiry")} onClear={() => setDiamondBondExpiry("")} colors={colors} />
          </Field>
          {diamondBondExpiry || diamondBondNumber ? (
            <Field label="Bond Details (terms, coverage, contact)" colors={colors} style={{ marginTop: 10, marginBottom: 0 }}>
              <TextInput style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]} placeholder="Bond coverage terms, what's included, claim process..." placeholderTextColor={colors.mutedForeground} value={diamondBondDetails} onChangeText={setDiamondBondDetails} multiline numberOfLines={2} textAlignVertical="top" />
            </Field>
          ) : null}
        </View>

        <SectionLabel label="Inspection & Notes" colors={colors} />
        <Field label="Last Inspection" colors={colors}>
          <DateRow value={lastInspection} onPress={() => setActivePicker("lastInspection")} onClear={() => setLastInspection("")} colors={colors} />
        </Field>
        <Field label="Documents & Notes" colors={colors}>
          <TextInput style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]} placeholder="Receipts, appraisals, care instructions, special notes..." placeholderTextColor={colors.mutedForeground} value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />
        </Field>
      </KeyboardAwareScrollView>

      <DatePickerModal
        visible={activePicker !== null}
        value={activePicker ? dateValues[activePicker] : ""}
        label={activePicker ? dateLabels[activePicker] : undefined}
        onConfirm={(date) => { if (activePicker) dateSetters[activePicker](date); setActivePicker(null); }}
        onCancel={() => setActivePicker(null)}
      />
      <BarcodeScannerModal
        visible={barcodeTarget !== null}
        hint={barcodeTarget === "goldWarrantyNumber" ? "Scan your warranty card barcode" : "Scan your diamond bond barcode"}
        onScanned={(code) => {
          if (barcodeTarget === "goldWarrantyNumber") setGoldWarrantyNumber(code);
          else if (barcodeTarget === "diamondBondNumber") setDiamondBondNumber(code);
          setBarcodeTarget(null);
        }}
        onCancel={() => setBarcodeTarget(null)}
      />
    </>
  );
}

function DateRow({ value, onPress, onClear, colors }: { value: string; onPress: () => void; onClear: () => void; colors: ReturnType<typeof useColors> }) {
  return (
    <Pressable onPress={onPress} style={[styles.dateRow, { borderColor: colors.border, backgroundColor: colors.background }]}>
      <Feather name="calendar" size={16} color={value ? colors.primary : colors.mutedForeground} />
      <Text style={[styles.dateRowText, { color: value ? colors.foreground : colors.mutedForeground }]} numberOfLines={1}>
        {value ? formatPickerDate(value) : "Select date"}
      </Text>
      {value ? (
        <Pressable onPress={(e) => { e.stopPropagation(); onClear(); }} hitSlop={8}>
          <Feather name="x" size={15} color={colors.mutedForeground} />
        </Pressable>
      ) : (
        <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

function SectionLabel({ label, colors }: { label: string; colors: ReturnType<typeof useColors> }) {
  return <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{label}</Text>;
}
function Field({ label, children, colors, style }: { label: string; children: React.ReactNode; colors: ReturnType<typeof useColors>; style?: object }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 4 },
  saveBtn: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  photoSection: { marginBottom: 8 },
  photoPlaceholder: { height: 140, borderRadius: 14, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 6 },
  photoLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  photoHint: { fontSize: 12, fontFamily: "Inter_400Regular" },
  photoPreviewWrap: { height: 200, borderRadius: 14, overflow: "visible" },
  photoPreview: { width: "100%", height: 200, borderRadius: 14 },
  removePhoto: { position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  changePhoto: { position: "absolute", bottom: 10, right: 10, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  changePhotoText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase", marginTop: 20, marginBottom: 4 },
  field: { marginBottom: 10 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, fontFamily: "Inter_400Regular" },
  textarea: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 72 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11 },
  dateRowText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  row: { flexDirection: "row", gap: 12 },
  warrantyBlock: { borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 20 },
  warrantyHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  warrantyIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  warrantyTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  warrantySubtitle: { fontSize: 12, fontFamily: "Inter_400Regular" },
  optionRow: { flexDirection: "row", gap: 8 },
  optionPill: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 12, alignItems: "center", gap: 2 },
  optionPillLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  optionPillDesc: { fontSize: 10, fontFamily: "Inter_400Regular" },
  scanInputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  scanInputFlex: { flex: 1 },
  scanIconBtn: { width: 44, height: 44, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
