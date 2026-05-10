import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe, type JewelryType } from "@/context/DiGeContext";
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

export default function AddPieceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addPiece } = useDiGe();

  const [name, setName] = useState("");
  const [type, setType] = useState<JewelryType>("ring");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [retailer, setRetailer] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [warrantyExpiry, setWarrantyExpiry] = useState("");
  const [warrantyDetails, setWarrantyDetails] = useState("");
  const [description, setDescription] = useState("");
  const [lastInspection, setLastInspection] = useState("");

  function handleSave() {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter a name for this piece.");
      return;
    }
    addPiece({
      name: name.trim(),
      type,
      brand: brand.trim(),
      material: material.trim(),
      purchaseDate,
      purchasePrice: purchasePrice.trim(),
      retailer: retailer.trim(),
      serialNumber: serialNumber.trim(),
      warrantyExpiry,
      warrantyDetails: warrantyDetails.trim(),
      description: description.trim(),
      lastInspection,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Piece",
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
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
        showsVerticalScrollIndicator={false}
      >
        <SectionLabel label="Basic Info" colors={colors} />

        <Field label="Name *" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. Engagement Ring"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
          />
        </Field>

        <Field label="Type" colors={colors}>
          <View style={styles.typeRow}>
            {TYPES.map((t) => (
              <Pressable
                key={t.value}
                onPress={() => setType(t.value)}
                style={[
                  styles.typePill,
                  {
                    backgroundColor: type === t.value ? colors.primary : colors.secondary,
                    borderColor: type === t.value ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typePillText,
                    { color: type === t.value ? colors.primaryForeground : colors.foreground },
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="Brand" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. Tiffany & Co."
            placeholderTextColor={colors.mutedForeground}
            value={brand}
            onChangeText={setBrand}
          />
        </Field>

        <Field label="Material" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. 18K Yellow Gold, Diamond"
            placeholderTextColor={colors.mutedForeground}
            value={material}
            onChangeText={setMaterial}
          />
        </Field>

        <SectionLabel label="Purchase Details" colors={colors} />

        <Field label="Retailer" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. Tiffany & Co. NYC"
            placeholderTextColor={colors.mutedForeground}
            value={retailer}
            onChangeText={setRetailer}
          />
        </Field>

        <View style={styles.row}>
          <Field label="Purchase Date" colors={colors} style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.mutedForeground}
              value={purchaseDate}
              onChangeText={setPurchaseDate}
            />
          </Field>
          <Field label="Price ($)" colors={colors} style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
              placeholder="0.00"
              placeholderTextColor={colors.mutedForeground}
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              keyboardType="decimal-pad"
            />
          </Field>
        </View>

        <Field label="Serial / Certificate Number" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="Optional"
            placeholderTextColor={colors.mutedForeground}
            value={serialNumber}
            onChangeText={setSerialNumber}
          />
        </Field>

        <SectionLabel label="Warranty" colors={colors} />

        <View style={styles.row}>
          <Field label="Warranty Expiry" colors={colors} style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.mutedForeground}
              value={warrantyExpiry}
              onChangeText={setWarrantyExpiry}
            />
          </Field>
          <Field label="Last Inspection" colors={colors} style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.mutedForeground}
              value={lastInspection}
              onChangeText={setLastInspection}
            />
          </Field>
        </View>

        <Field label="Warranty Details" colors={colors}>
          <TextInput
            style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="Coverage details, terms, contact info..."
            placeholderTextColor={colors.mutedForeground}
            value={warrantyDetails}
            onChangeText={setWarrantyDetails}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </Field>

        <SectionLabel label="Notes" colors={colors} />

        <Field label="Description / Documents" colors={colors}>
          <TextInput
            style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="Receipts, appraisals, care instructions, special notes..."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Field>
      </KeyboardAwareScrollView>
    </>
  );
}

function SectionLabel({
  label,
  colors,
}: {
  label: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{label}</Text>
  );
}

function Field({
  label,
  children,
  colors,
  style,
}: {
  label: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
  style?: object;
}) {
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
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 4,
  },
  field: { marginBottom: 10 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    minHeight: 90,
  },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  typePillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  row: { flexDirection: "row", gap: 12 },
});
