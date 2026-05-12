import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DatePickerModal } from "@/components/DatePickerModal";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

const REPAIR_TYPES = [
  "Resize",
  "Stone Replacement",
  "Prong Repair",
  "Setting Repair",
  "Cleaning & Polish",
  "Chain Repair",
  "Clasp Repair",
  "Re-dipping / Rhodium",
  "Engraving",
  "Other",
];

function formatPickerDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function AddRepairScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieceId, pieceName } = useLocalSearchParams<{
    pieceId: string;
    pieceName: string;
  }>();
  const { addRepair } = useDiGe();

  const [date, setDate] = useState("");
  const [repairType, setRepairType] = useState("Resize");
  const [retailer, setRetailer] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  function handleSave() {
    if (!date) {
      Alert.alert("Required", "Please select the date of the repair.");
      return;
    }
    if (!description.trim() && !repairType) {
      Alert.alert("Required", "Please add a description.");
      return;
    }
    addRepair(pieceId, {
      date,
      repairType,
      retailer: retailer.trim(),
      cost: cost.trim(),
      description: description.trim(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Repair",
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
        {pieceName ? (
          <View style={[styles.pieceBanner, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Feather name="box" size={14} color={colors.primary} />
            <Text style={[styles.pieceBannerText, { color: colors.primary }]}>
              {decodeURIComponent(pieceName)}
            </Text>
          </View>
        ) : null}

        <SectionLabel label="Repair Type" colors={colors} />
        <View style={styles.typeGrid}>
          {REPAIR_TYPES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setRepairType(t)}
              style={[
                styles.typePill,
                {
                  backgroundColor:
                    repairType === t ? colors.primary + "18" : colors.secondary,
                  borderColor: repairType === t ? colors.primary : colors.border,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Text
                style={[
                  styles.typePillText,
                  {
                    color:
                      repairType === t ? colors.primary : colors.foreground,
                  },
                ]}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        <SectionLabel label="Details" colors={colors} />

        <Field label="Date of Repair *" colors={colors}>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={[styles.dateRow, { borderColor: colors.border, backgroundColor: colors.background }]}
          >
            <Feather name="calendar" size={16} color={date ? colors.primary : colors.mutedForeground} />
            <Text style={[styles.dateRowText, { color: date ? colors.foreground : colors.mutedForeground }]} numberOfLines={1}>
              {date ? formatPickerDate(date) : "Select date"}
            </Text>
            {date ? (
              <Pressable onPress={(e) => { e.stopPropagation(); setDate(""); }} hitSlop={8}>
                <Feather name="x" size={15} color={colors.mutedForeground} />
              </Pressable>
            ) : (
              <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
            )}
          </Pressable>
        </Field>

        <Field label="Retailer / Jeweler" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. Zales, Kay, Local Jeweler..."
            placeholderTextColor={colors.mutedForeground}
            value={retailer}
            onChangeText={setRetailer}
          />
        </Field>

        <Field label="Cost ($)" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="0.00 (or leave blank if covered under warranty)"
            placeholderTextColor={colors.mutedForeground}
            value={cost}
            onChangeText={setCost}
            keyboardType="decimal-pad"
          />
        </Field>

        <Field label="Notes" colors={colors}>
          <TextInput
            style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="What was done, stone size, ring size changed to, technician notes..."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Field>
      </KeyboardAwareScrollView>

      <DatePickerModal
        visible={showDatePicker}
        value={date}
        label="Date of Repair"
        onConfirm={(d) => { setDate(d); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
      />
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
    <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
      {label}
    </Text>
  );
}

function Field({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 4 },
  saveBtn: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  pieceBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  pieceBannerText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 8,
  },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typePillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  field: { marginBottom: 10 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 6 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11 },
  dateRowText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
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
    minHeight: 100,
  },
});
