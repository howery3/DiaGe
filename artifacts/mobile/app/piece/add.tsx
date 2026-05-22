import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { capture } from "@/utils/posthog";
import {
  ActionSheetIOS,
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DatePickerModal } from "@/components/DatePickerModal";
import { useDiGe, type GoldWarrantyType, type JewelryType } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
const WATCH_CASE_MATERIALS = ["Stainless Steel", "Gold", "Rose Gold", "Two-Tone", "Titanium", "Ceramic", "Aluminum", "Plastic"];
const WATCH_BANDS = ["Steel Bracelet", "Gold Bracelet", "Rubber", "Silicone", "Leather", "NATO", "Mesh", "Ceramic", "Titanium"];
const WATCH_MOVEMENTS = ["Automatic", "Manual", "Quartz", "Swiss Automatic", "Swiss Quartz", "Japanese Automatic", "Japanese Quartz", "Solar", "Kinetic"];
const WATCH_CRYSTALS = ["Sapphire", "Mineral", "Acrylic", "Hardlex"];
const DIAMOND_CUTS = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const DIAMOND_COLORS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const DIAMOND_CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2"];
const GOLD_WARRANTY_OPTIONS: { value: GoldWarrantyType; label: string; desc: string }[] = [
  { value: "lifetime", label: "Lifetime", desc: "No expiry" },
  { value: "dated", label: "Set Date", desc: "Has expiry" },
  { value: "none", label: "None", desc: "No coverage" },
];

type Section = "basic" | "materials" | "purchase" | "warranty" | "notes";
type DateField = "purchaseDate" | "goldExpiry" | "diamondExpiry" | "lastInspection";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
  const [metals, setMetals] = useState<string[]>([]);
  const [diamondType, setDiamondType] = useState("none");
  const [gemstones, setGemstones] = useState<string[]>([]);
  const [watchBand, setWatchBand] = useState("");
  const [watchMovement, setWatchMovement] = useState("");
  const [watchCrystal, setWatchCrystal] = useState("");
  const [watchCase, setWatchCase] = useState("");
  const [diamondCut, setDiamondCut] = useState("");
  const [diamondColor, setDiamondColor] = useState("");
  const [diamondClarity, setDiamondClarity] = useState("");
  const [diamondCaratWeight, setDiamondCaratWeight] = useState("");
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
  const [activePicker, setActivePicker] = useState<DateField | null>(null);
  const [openSection, setOpenSection] = useState<Section>("basic");

  const dateValues: Record<DateField, string> = { purchaseDate, goldExpiry: goldWarrantyExpiry, diamondExpiry: diamondBondExpiry, lastInspection };
  const dateLabels: Record<DateField, string> = { purchaseDate: "Purchase Date", goldExpiry: "Warranty Expiry", diamondExpiry: "Bond Expiry", lastInspection: "Last Inspection" };
  const dateSetters: Record<DateField, (v: string) => void> = { purchaseDate: setPurchaseDate, goldExpiry: setGoldWarrantyExpiry, diamondExpiry: setDiamondBondExpiry, lastInspection: setLastInspection };

  function toggleSection(s: Section) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection((prev) => (prev === s ? s : s));
  }

  function handleSave() {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter a name for this piece.");
      toggleSection("basic");
      return;
    }
    const materialSummary = type === "watch"
      ? [watchCase, watchBand, watchMovement, watchCrystal].filter(Boolean).join(", ")
      : [...metals, ...(diamondType !== "none" ? [diamondType === "lab" ? "Lab Diamond" : "Natural Diamond"] : []), ...gemstones].join(", ");
    addPiece({
      name: name.trim(), type, brand: brand.trim(),
      material: materialSummary, metals, diamondType, gemstones,
      watchBand, watchMovement, watchCrystal, watchCase,
      diamondCut: diamondCut.trim(), diamondColor, diamondClarity, diamondCaratWeight: diamondCaratWeight.trim(),
      purchaseDate, purchasePrice: purchasePrice.trim(), retailer: retailer.trim(),
      serialNumber: serialNumber.trim(),
      goldWarrantyType, goldWarrantyNumber: goldWarrantyNumber.trim(),
      goldWarrantyExpiry, goldWarrantyDetails: goldWarrantyDetails.trim(),
      diamondBondNumber: diamondBondNumber.trim(),
      diamondBondExpiry, diamondBondDetails: diamondBondDetails.trim(),
      repairHistory: [], documents: [],
      description: description.trim(), lastInspection, imageUri,
    });
    capture("piece_added", {
      type, has_retailer: !!retailer.trim(), has_warranty: goldWarrantyType !== "none",
      has_diamond_bond: !!diamondBondNumber.trim(), has_price: !!purchasePrice.trim(), has_serial: !!serialNumber.trim(),
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

  // Summary lines for closed accordions
  const typeLabel = TYPES.find((t) => t.value === type)?.label ?? type;
  const basicSummary = [typeLabel, name || "Untitled", brand].filter(Boolean).join(" · ");

  const materialsSummary = type === "watch"
    ? [watchCase, watchBand, watchMovement].filter(Boolean).join(", ") || "Not set"
    : [...metals, ...(diamondType !== "none" ? [[diamondType === "lab" ? "Lab Diamond" : "Natural Diamond", diamondCaratWeight && `${diamondCaratWeight}ct`].filter(Boolean).join(" ")] : []), ...gemstones].join(", ") || "Not set";

  const purchaseSummary = [
    retailer, purchasePrice && `$${purchasePrice}`, purchaseDate && formatDate(purchaseDate),
  ].filter(Boolean).join(" · ") || "Not set";

  const warrantySummary = (() => {
    const parts: string[] = [];
    if (goldWarrantyType !== "none") parts.push(`Gold: ${goldWarrantyType === "lifetime" ? "Lifetime" : "Dated"}`);
    if (diamondBondNumber) parts.push("Diamond Bond");
    return parts.join(" · ") || "None";
  })();

  const notesSummary = [
    lastInspection && `Inspected ${formatDate(lastInspection)}`,
    description && "Has notes",
  ].filter(Boolean).join(" · ") || "Not set";

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
        {/* Photo — always visible above accordions */}
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

        {/* ── Basic Info ── */}
        <Accordion icon="tag" title="Basic Info" summary={basicSummary} open={openSection === "basic"} onToggle={() => toggleSection("basic")} colors={colors}>
          <View style={[styles.cardInner, { borderTopColor: colors.border }]}>
            <SubLabel label="Name *" colors={colors} />
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="e.g. Engagement Ring"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
            />
            <SubLabel label="Type" colors={colors} />
            <PillRow>
              {TYPES.map((t) => (
                <Pill key={t.value} label={t.label} selected={type === t.value} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setType(t.value); }} colors={colors} />
              ))}
            </PillRow>
            <SubLabel label="Brand" colors={colors} />
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="e.g. Tiffany & Co."
              placeholderTextColor={colors.mutedForeground}
              value={brand}
              onChangeText={setBrand}
            />
          </View>
        </Accordion>

        {/* ── Materials ── */}
        <Accordion icon="layers" title="Materials" summary={materialsSummary} open={openSection === "materials"} onToggle={() => toggleSection("materials")} colors={colors}>
          <View style={[styles.cardInner, { borderTopColor: colors.border }]}>
            {type === "watch" ? (
              <>
                <SubLabel label="Case Material" colors={colors} />
                <PillRow>
                  {WATCH_CASE_MATERIALS.map((m) => (
                    <Pill key={m} label={m} selected={watchCase === m} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setWatchCase((p) => p === m ? "" : m); }} colors={colors} />
                  ))}
                </PillRow>
                <SubLabel label="Band / Strap" colors={colors} />
                <PillRow>
                  {WATCH_BANDS.map((b) => (
                    <Pill key={b} label={b} selected={watchBand === b} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setWatchBand((p) => p === b ? "" : b); }} colors={colors} />
                  ))}
                </PillRow>
                <SubLabel label="Movement" colors={colors} />
                <PillRow>
                  {WATCH_MOVEMENTS.map((mv) => (
                    <Pill key={mv} label={mv} selected={watchMovement === mv} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setWatchMovement((p) => p === mv ? "" : mv); }} colors={colors} />
                  ))}
                </PillRow>
                <SubLabel label="Crystal" colors={colors} />
                <PillRow>
                  {WATCH_CRYSTALS.map((c) => (
                    <Pill key={c} label={c} selected={watchCrystal === c} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setWatchCrystal((p) => p === c ? "" : c); }} colors={colors} />
                  ))}
                </PillRow>
              </>
            ) : (
              <>
                <SubLabel label="Metal" colors={colors} />
                <PillRow>
                  {METALS.map((m) => (
                    <Pill key={m} label={m} selected={metals.includes(m)} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setMetals((p) => p.includes(m) ? p.filter((x) => x !== m) : [...p, m]); }} colors={colors} />
                  ))}
                </PillRow>
                <SubLabel label="Diamond" colors={colors} />
                <PillRow>
                  {DIAMOND_OPTIONS.map((opt) => (
                    <Pill key={opt.value} label={opt.label} selected={diamondType === opt.value} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDiamondType(opt.value); }} colors={colors} />
                  ))}
                </PillRow>
                <SubLabel label="Gemstones" colors={colors} />
                <PillRow>
                  {GEMSTONES.map((g) => (
                    <Pill key={g} label={g} selected={gemstones.includes(g)} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setGemstones((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]); }} colors={colors} />
                  ))}
                </PillRow>
                {diamondType !== "none" && (
                  <>
                    <View style={[styles.fourCsDivider, { borderTopColor: colors.border }]}>
                      <Feather name="star" size={11} color="#7C3AED" />
                      <Text style={[styles.fourCsTitle, { color: "#7C3AED" }]}>Diamond Grading (4 Cs)</Text>
                    </View>
                    <SubLabel label="Cut" colors={colors} />
                    <PillRow>
                      {DIAMOND_CUTS.map((c) => (
                        <Pill key={c} label={c} selected={diamondCut === c} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDiamondCut((p) => p === c ? "" : c); }} colors={colors} />
                      ))}
                    </PillRow>
                    <SubLabel label="Color Grade" colors={colors} />
                    <PillRow>
                      {DIAMOND_COLORS.map((c) => (
                        <Pill key={c} label={c} selected={diamondColor === c} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDiamondColor((p) => p === c ? "" : c); }} colors={colors} />
                      ))}
                    </PillRow>
                    <SubLabel label="Clarity" colors={colors} />
                    <PillRow>
                      {DIAMOND_CLARITIES.map((c) => (
                        <Pill key={c} label={c} selected={diamondClarity === c} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDiamondClarity((p) => p === c ? "" : c); }} colors={colors} />
                      ))}
                    </PillRow>
                    <SubLabel label="Carat Weight" colors={colors} />
                    <TextInput
                      style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
                      placeholder="e.g. 1.25"
                      placeholderTextColor={colors.mutedForeground}
                      value={diamondCaratWeight}
                      onChangeText={setDiamondCaratWeight}
                      keyboardType="decimal-pad"
                    />
                  </>
                )}
              </>
            )}
          </View>
        </Accordion>

        {/* ── Purchase Details ── */}
        <Accordion icon="shopping-bag" title="Purchase Details" summary={purchaseSummary} open={openSection === "purchase"} onToggle={() => toggleSection("purchase")} colors={colors}>
          <View style={[styles.cardInner, { borderTopColor: colors.border }]}>
            <SubLabel label="Retailer" colors={colors} />
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="e.g. Kay, Zales, Jared, James Allen..."
              placeholderTextColor={colors.mutedForeground}
              value={retailer}
              onChangeText={setRetailer}
            />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <SubLabel label="Purchase Date" colors={colors} />
                <DateRow value={purchaseDate} onPress={() => setActivePicker("purchaseDate")} onClear={() => setPurchaseDate("")} colors={colors} />
              </View>
              <View style={{ flex: 1 }}>
                <SubLabel label="Price ($)" colors={colors} />
                <TextInput
                  style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="0.00"
                  placeholderTextColor={colors.mutedForeground}
                  value={purchasePrice}
                  onChangeText={setPurchasePrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <SubLabel label="Serial / Certificate Number" colors={colors} />
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="Optional"
              placeholderTextColor={colors.mutedForeground}
              value={serialNumber}
              onChangeText={setSerialNumber}
            />
          </View>
        </Accordion>

        {/* ── Warranty & Bond ── */}
        <Accordion icon="shield" title="Warranty & Bond" summary={warrantySummary} open={openSection === "warranty"} onToggle={() => toggleSection("warranty")} colors={colors}>
          <View style={[styles.cardInner, { borderTopColor: colors.border }]}>
            {/* Gold warranty */}
            <View style={[styles.subCard, { backgroundColor: "#D4AA3A0C", borderColor: "#D4AA3A40" }]}>
              <View style={styles.subCardHeader}>
                <View style={[styles.subCardIcon, { backgroundColor: "#D4AA3A18" }]}>
                  <Feather name="shield" size={13} color="#D4AA3A" />
                </View>
                <View>
                  <Text style={[styles.subCardTitle, { color: colors.foreground }]}>Lifetime Warranty</Text>
                  <Text style={[styles.subCardSub, { color: colors.mutedForeground }]}>Gold / Metal Coverage</Text>
                </View>
              </View>
              <View style={styles.optionRow}>
                {GOLD_WARRANTY_OPTIONS.map((opt) => (
                  <Pressable key={opt.value} onPress={() => setGoldWarrantyType(opt.value)}
                    style={[styles.optionPill, { backgroundColor: goldWarrantyType === opt.value ? colors.primary + "18" : colors.secondary, borderColor: goldWarrantyType === opt.value ? colors.primary : colors.border }]}>
                    <Text style={[styles.optionPillLabel, { color: goldWarrantyType === opt.value ? colors.primary : colors.foreground }]}>{opt.label}</Text>
                    <Text style={[styles.optionPillDesc, { color: colors.mutedForeground }]}>{opt.desc}</Text>
                  </Pressable>
                ))}
              </View>
              {goldWarrantyType !== "none" && (
                <>
                  <SubLabel label="Warranty Number" colors={colors} />
                  <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} placeholder="e.g. LW-2024-001234" placeholderTextColor={colors.mutedForeground} value={goldWarrantyNumber} onChangeText={setGoldWarrantyNumber} autoCapitalize="characters" />
                  {goldWarrantyType === "dated" && (
                    <>
                      <SubLabel label="Expiry Date" colors={colors} />
                      <DateRow value={goldWarrantyExpiry} onPress={() => setActivePicker("goldExpiry")} onClear={() => setGoldWarrantyExpiry("")} colors={colors} />
                    </>
                  )}
                  <SubLabel label="Details" colors={colors} />
                  <TextInput style={[styles.textarea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} placeholder="Coverage info, inspection schedule, contact..." placeholderTextColor={colors.mutedForeground} value={goldWarrantyDetails} onChangeText={setGoldWarrantyDetails} multiline numberOfLines={2} textAlignVertical="top" />
                </>
              )}
            </View>

            {/* Diamond Bond */}
            <View style={[styles.subCard, { backgroundColor: colors.primary + "08", borderColor: colors.primary + "30", marginTop: 12 }]}>
              <View style={styles.subCardHeader}>
                <View style={[styles.subCardIcon, { backgroundColor: colors.primary + "18" }]}>
                  <Feather name="hexagon" size={13} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.subCardTitle, { color: colors.foreground }]}>Diamond Bond</Text>
                  <Text style={[styles.subCardSub, { color: colors.mutedForeground }]}>Stone / Diamond Coverage</Text>
                </View>
              </View>
              <SubLabel label="Bond Number" colors={colors} />
              <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} placeholder="e.g. DB-2024-567890" placeholderTextColor={colors.mutedForeground} value={diamondBondNumber} onChangeText={setDiamondBondNumber} autoCapitalize="characters" />
              <SubLabel label="Bond Expiry Date" colors={colors} />
              <DateRow value={diamondBondExpiry} onPress={() => setActivePicker("diamondExpiry")} onClear={() => setDiamondBondExpiry("")} colors={colors} />
              {(diamondBondExpiry || diamondBondNumber) && (
                <>
                  <SubLabel label="Bond Details" colors={colors} />
                  <TextInput style={[styles.textarea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} placeholder="Bond coverage terms, claim process..." placeholderTextColor={colors.mutedForeground} value={diamondBondDetails} onChangeText={setDiamondBondDetails} multiline numberOfLines={2} textAlignVertical="top" />
                </>
              )}
            </View>
          </View>
        </Accordion>

        {/* ── Inspection & Notes ── */}
        <Accordion icon="clipboard" title="Inspection & Notes" summary={notesSummary} open={openSection === "notes"} onToggle={() => toggleSection("notes")} colors={colors}>
          <View style={[styles.cardInner, { borderTopColor: colors.border }]}>
            <SubLabel label="Last Inspection" colors={colors} />
            <DateRow value={lastInspection} onPress={() => setActivePicker("lastInspection")} onClear={() => setLastInspection("")} colors={colors} />
            <SubLabel label="Documents & Notes" colors={colors} />
            <TextInput
              style={[styles.textarea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="Receipts, appraisals, care instructions, special notes..."
              placeholderTextColor={colors.mutedForeground}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </Accordion>

        {/* Save button at bottom */}
        <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveButton, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}>
          <Feather name="check" size={18} color="#fff" />
          <Text style={styles.saveButtonText}>Save Piece</Text>
        </Pressable>
      </KeyboardAwareScrollView>

      <DatePickerModal
        visible={activePicker !== null}
        value={activePicker ? dateValues[activePicker] : ""}
        label={activePicker ? dateLabels[activePicker] : undefined}
        onConfirm={(date) => { if (activePicker) dateSetters[activePicker](date); setActivePicker(null); }}
        onCancel={() => setActivePicker(null)}
      />
    </>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────

function Accordion({
  icon, title, summary, open, onToggle, colors, children,
}: {
  icon: string; title: string; summary: string; open: boolean;
  onToggle: () => void; colors: ReturnType<typeof useColors>; children: React.ReactNode;
}) {
  return (
    <View style={[styles.accordionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable onPress={onToggle} style={styles.accordionHeader}>
        <View style={[styles.accordionIconWrap, { backgroundColor: open ? "#5B21B6" : colors.secondary }]}>
          <Feather name={icon as any} size={15} color={open ? "#fff" : colors.mutedForeground} />
        </View>
        <View style={styles.accordionMeta}>
          <Text style={[styles.accordionTitle, { color: colors.foreground }]}>{title}</Text>
          {!open && (
            <Text style={[styles.accordionSummary, { color: colors.mutedForeground }]} numberOfLines={1}>
              {summary}
            </Text>
          )}
        </View>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
      </Pressable>
      {open && children}
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DateRow({ value, onPress, onClear, colors }: { value: string; onPress: () => void; onClear: () => void; colors: ReturnType<typeof useColors> }) {
  return (
    <Pressable onPress={onPress} style={[styles.dateRow, { borderColor: colors.border, backgroundColor: colors.background }]}>
      <Feather name="calendar" size={16} color={value ? colors.primary : colors.mutedForeground} />
      <Text style={[styles.dateRowText, { color: value ? colors.foreground : colors.mutedForeground }]} numberOfLines={1}>
        {value ? formatDate(value) : "Select date"}
      </Text>
      {value ? (
        <Pressable onPress={(e) => { e.stopPropagation(); onClear(); }} hitSlop={10}>
          <Feather name="x" size={14} color={colors.mutedForeground} />
        </Pressable>
      ) : (
        <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

function PillRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.pillRow}>{children}</View>;
}

function Pill({ label, selected, onPress, colors }: { label: string; selected: boolean; onPress: () => void; colors: ReturnType<typeof useColors> }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, { backgroundColor: selected ? "#5B21B6" : colors.secondary, borderColor: selected ? "#5B21B6" : colors.border }]}
    >
      <Text style={[styles.pillText, { color: selected ? "#fff" : colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

function SubLabel({ label, colors }: { label: string; colors: ReturnType<typeof useColors> }) {
  return <Text style={[styles.subLabel, { color: colors.mutedForeground }]}>{label}</Text>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: { padding: 16, gap: 10 },
  saveBtn: { fontSize: 16, fontFamily: "Inter_600SemiBold" },

  // Photo
  photoSection: { marginBottom: 6 },
  photoPlaceholder: { borderRadius: 14, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center", paddingVertical: 28, gap: 6 },
  photoLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  photoHint: { fontSize: 12, fontFamily: "Inter_400Regular" },
  photoPreviewWrap: { position: "relative", borderRadius: 14, overflow: "hidden" },
  photoPreview: { width: "100%", height: 200, borderRadius: 14 },
  removePhoto: { position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  changePhoto: { position: "absolute", bottom: 10, right: 10, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  changePhotoText: { fontSize: 13, fontFamily: "Inter_500Medium" },

  // Accordion
  accordionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  accordionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  accordionIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  accordionMeta: { flex: 1, gap: 2 },
  accordionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  accordionSummary: { fontSize: 12, fontFamily: "Inter_400Regular" },

  // Card inner
  cardInner: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },

  // Sub-cards (warranty blocks)
  subCard: { borderRadius: 12, borderWidth: 1, padding: 14 },
  subCardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  subCardIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  subCardTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  subCardSub: { fontSize: 11, fontFamily: "Inter_400Regular" },

  // Warranty option pills
  optionRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  optionPill: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  optionPillLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  optionPillDesc: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2 },

  // Row layout
  row: { flexDirection: "row", gap: 12 },

  // Inputs
  subLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_400Regular" },
  textarea: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_400Regular", minHeight: 80 },

  // Date row
  dateRow: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  dateRowText: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },

  // Pills
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },

  // Save button
  saveButton: { borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, marginTop: 6 },
  saveButtonText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },

  // 4 Cs
  fourCsDivider: { flexDirection: "row", alignItems: "center", gap: 6, borderTopWidth: StyleSheet.hairlineWidth, marginTop: 16, paddingTop: 14 },
  fourCsTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.4 },
});
