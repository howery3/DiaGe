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

const GOLD_WARRANTY_OPTIONS: { value: GoldWarrantyType; label: string; desc: string }[] = [
  { value: "lifetime", label: "Lifetime", desc: "No expiry" },
  { value: "dated", label: "Set Date", desc: "Has expiry" },
  { value: "none", label: "None", desc: "No coverage" },
];

function toStorage(display: string): string {
  if (!display.trim()) return "";
  const m = display.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return m ? `${m[3]}-${m[1]}-${m[2]}` : display;
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

export default function AddPieceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addPiece } = useDiGe();
  const { retailer: prefillRetailer } = useLocalSearchParams<{ retailer?: string }>();

  const [name, setName] = useState("");
  const [type, setType] = useState<JewelryType>("ring");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
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
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  function handleSave() {
    if (!name.trim()) { Alert.alert("Required", "Please enter a name for this piece."); return; }
    addPiece({
      name: name.trim(), type, brand: brand.trim(), material: material.trim(),
      purchaseDate: toStorage(purchaseDate), purchasePrice: purchasePrice.trim(), retailer: retailer.trim(),
      serialNumber: serialNumber.trim(),
      goldWarrantyType, goldWarrantyNumber: goldWarrantyNumber.trim(),
      goldWarrantyExpiry: toStorage(goldWarrantyExpiry), goldWarrantyDetails: goldWarrantyDetails.trim(),
      diamondBondNumber: diamondBondNumber.trim(),
      diamondBondExpiry: toStorage(diamondBondExpiry), diamondBondDetails: diamondBondDetails.trim(),
      repairHistory: [],
      description: description.trim(), lastInspection: toStorage(lastInspection), imageUri,
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
        <Field label="Material" colors={colors}>
          <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="e.g. 18K Yellow Gold, Diamond" placeholderTextColor={colors.mutedForeground} value={material} onChangeText={setMaterial} />
        </Field>

        <SectionLabel label="Purchase Details" colors={colors} />
        <Field label="Retailer" colors={colors}>
          <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="e.g. Zales, Kay, Helzberg..." placeholderTextColor={colors.mutedForeground} value={retailer} onChangeText={setRetailer} />
        </Field>
        <View style={styles.row}>
          <Field label="Purchase Date" colors={colors} style={{ flex: 1 }}>
            <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="MM-DD-YYYY" placeholderTextColor={colors.mutedForeground} value={purchaseDate} onChangeText={setPurchaseDate} />
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
                <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="e.g. LW-2024-001234" placeholderTextColor={colors.mutedForeground} value={goldWarrantyNumber} onChangeText={setGoldWarrantyNumber} autoCapitalize="characters" />
              </Field>
              {goldWarrantyType === "dated" ? (
                <Field label="Expiry Date" colors={colors} style={{ marginTop: 10, marginBottom: 0 }}>
                  <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="MM-DD-YYYY" placeholderTextColor={colors.mutedForeground} value={goldWarrantyExpiry} onChangeText={setGoldWarrantyExpiry} />
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
            <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="e.g. DB-2024-567890" placeholderTextColor={colors.mutedForeground} value={diamondBondNumber} onChangeText={setDiamondBondNumber} autoCapitalize="characters" />
          </Field>
          <Field label="Bond Expiry Date (leave blank if no bond)" colors={colors} style={{ marginTop: 10, marginBottom: 0 }}>
            <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="MM-DD-YYYY" placeholderTextColor={colors.mutedForeground} value={diamondBondExpiry} onChangeText={setDiamondBondExpiry} />
          </Field>
          {diamondBondExpiry || diamondBondNumber ? (
            <Field label="Bond Details (terms, coverage, contact)" colors={colors} style={{ marginTop: 10, marginBottom: 0 }}>
              <TextInput style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]} placeholder="Bond coverage terms, what's included, claim process..." placeholderTextColor={colors.mutedForeground} value={diamondBondDetails} onChangeText={setDiamondBondDetails} multiline numberOfLines={2} textAlignVertical="top" />
            </Field>
          ) : null}
        </View>

        <SectionLabel label="Inspection & Notes" colors={colors} />
        <Field label="Last Inspection" colors={colors}>
          <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="MM-DD-YYYY" placeholderTextColor={colors.mutedForeground} value={lastInspection} onChangeText={setLastInspection} />
        </Field>
        <Field label="Documents & Notes" colors={colors}>
          <TextInput style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]} placeholder="Receipts, appraisals, care instructions, special notes..." placeholderTextColor={colors.mutedForeground} value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />
        </Field>
      </KeyboardAwareScrollView>
    </>
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
});
