import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe, type ReminderRecurrence } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

const RECURRENCES: { value: ReminderRecurrence; label: string; desc: string }[] = [
  { value: "none", label: "Once", desc: "No repeat" },
  { value: "6months", label: "6 Months", desc: "Twice a year" },
  { value: "1year", label: "Yearly", desc: "Annual" },
  { value: "2years", label: "2 Years", desc: "Biennial" },
];

export default function AddReminderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces, addReminder } = useDiGe();

  const [jewelryName, setJewelryName] = useState("");
  const [retailer, setRetailer] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [recurrence, setRecurrence] = useState<ReminderRecurrence>("1year");
  const [notes, setNotes] = useState("");
  const [selectedPieceId, setSelectedPieceId] = useState<string | undefined>(undefined);
  const [showPieces, setShowPieces] = useState(false);

  function selectPiece(id: string) {
    const p = pieces.find((x) => x.id === id);
    if (p) {
      setSelectedPieceId(id);
      setJewelryName(p.name);
      setRetailer(p.retailer);
    }
    setShowPieces(false);
  }

  function handleSave() {
    if (!jewelryName.trim()) {
      Alert.alert("Required", "Please enter the jewelry piece name.");
      return;
    }
    if (!scheduledDate.trim()) {
      Alert.alert("Required", "Please enter the inspection date.");
      return;
    }
    const d = new Date(scheduledDate);
    if (isNaN(d.getTime())) {
      Alert.alert("Invalid Date", "Please use YYYY-MM-DD format.");
      return;
    }
    addReminder({
      jewelryId: selectedPieceId,
      jewelryName: jewelryName.trim(),
      retailer: retailer.trim(),
      scheduledDate: d.toISOString(),
      recurrence,
      notes: notes.trim(),
      isCompleted: false,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Reminder",
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
        <SectionLabel label="Jewelry Piece" colors={colors} />

        {pieces.length > 0 ? (
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
              Link to vault piece (optional)
            </Text>
            <Pressable
              onPress={() => setShowPieces(!showPieces)}
              style={[
                styles.selectBtn,
                { borderColor: colors.border, backgroundColor: colors.secondary },
              ]}
            >
              <Text style={[styles.selectBtnText, { color: selectedPieceId ? colors.foreground : colors.mutedForeground }]}>
                {selectedPieceId
                  ? pieces.find((p) => p.id === selectedPieceId)?.name ?? "Select piece"
                  : "Select from vault…"}
              </Text>
            </Pressable>
            {showPieces ? (
              <View
                style={[
                  styles.pieceList,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {pieces.map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => selectPiece(p.id)}
                    style={[styles.pieceItem, { borderBottomColor: colors.border }]}
                  >
                    <Text style={[styles.pieceName, { color: colors.foreground }]}>{p.name}</Text>
                    <Text style={[styles.pieceMeta, { color: colors.mutedForeground }]}>
                      {p.brand || p.type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        <Field label="Piece Name *" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. Engagement Ring"
            placeholderTextColor={colors.mutedForeground}
            value={jewelryName}
            onChangeText={setJewelryName}
          />
        </Field>

        <Field label="Retailer / Jeweler" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. Tiffany & Co. NYC"
            placeholderTextColor={colors.mutedForeground}
            value={retailer}
            onChangeText={setRetailer}
          />
        </Field>

        <SectionLabel label="Schedule" colors={colors} />

        <Field label="Inspection Date *" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.mutedForeground}
            value={scheduledDate}
            onChangeText={setScheduledDate}
          />
        </Field>

        <SectionLabel label="Recurrence" colors={colors} />

        <View style={styles.recRow}>
          {RECURRENCES.map((r) => (
            <Pressable
              key={r.value}
              onPress={() => setRecurrence(r.value)}
              style={[
                styles.recPill,
                {
                  backgroundColor:
                    recurrence === r.value ? colors.primary + "15" : colors.secondary,
                  borderColor: recurrence === r.value ? colors.primary : colors.border,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Text
                style={[
                  styles.recLabel,
                  { color: recurrence === r.value ? colors.primary : colors.foreground },
                ]}
              >
                {r.label}
              </Text>
              <Text style={[styles.recDesc, { color: colors.mutedForeground }]}>{r.desc}</Text>
            </Pressable>
          ))}
        </View>

        <SectionLabel label="Notes" colors={colors} />

        <Field label="Notes" colors={colors}>
          <TextInput
            style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="What to bring, specific requests..."
            placeholderTextColor={colors.mutedForeground}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
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
}: {
  label: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.field}>
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
  selectBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  selectBtnText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  pieceList: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 4,
    overflow: "hidden",
  },
  pieceItem: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pieceName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  pieceMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  recRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  recPill: {
    width: "47%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    gap: 2,
  },
  recLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  recDesc: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
