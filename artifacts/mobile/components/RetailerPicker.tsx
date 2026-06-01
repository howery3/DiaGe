import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Colors {
  foreground: string;
  mutedForeground: string;
  border: string;
  background: string;
  card: string;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  colors: Colors;
}

const PARTNERS = [
  { id: "Kay Jewelers", label: "Kay",    full: "Kay Jewelers",              color: "#5B21B6", icon: "K" },
  { id: "Jared",        label: "Jared",  full: "Jared",                     color: "#0079F2", icon: "J" },
  { id: "Zales",        label: "Zales",  full: "Zales",                     color: "#D97706", icon: "Z" },
  { id: "Banter",       label: "Banter", full: "Banter by Piercing Pagoda", color: "#B91C1C", icon: "B" },
];

function matchesPartner(value: string) {
  return PARTNERS.find(
    (p) =>
      value.toLowerCase() === p.full.toLowerCase() ||
      value.toLowerCase() === p.label.toLowerCase() ||
      value.toLowerCase() === p.id.toLowerCase()
  ) ?? null;
}

export function RetailerPicker({ value, onChange, colors }: Props) {
  const matched = matchesPartner(value);
  const isOtherMode = !matched && value.length > 0;

  const [showOtherInput, setShowOtherInput] = useState(isOtherMode);
  const [otherText, setOtherText] = useState(isOtherMode ? value : "");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isOtherMode) {
      setShowOtherInput(true);
      setOtherText(value);
    }
  }, []);

  function selectPartner(p: typeof PARTNERS[number]) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (matched?.id === p.id) {
      onChange("");
    } else {
      setShowOtherInput(false);
      setOtherText("");
      onChange(p.full);
    }
  }

  function selectOther() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (matched) onChange("");
    setShowOtherInput(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  function handleOtherChange(text: string) {
    setOtherText(text);
    onChange(text);
  }

  return (
    <View style={styles.root}>
      {/* Chip row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {PARTNERS.map((p) => {
          const active = matched?.id === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => selectPartner(p)}
              style={({ pressed }) => [
                styles.chip,
                active
                  ? { backgroundColor: p.color, borderColor: p.color }
                  : { backgroundColor: colors.card, borderColor: colors.border },
                { opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <View style={[styles.chipIcon, { backgroundColor: active ? "rgba(255,255,255,0.22)" : `${p.color}18` }]}>
                <Text style={[styles.chipIconText, { color: active ? "#fff" : p.color }]}>{p.icon}</Text>
              </View>
              <Text style={[styles.chipLabel, { color: active ? "#fff" : colors.foreground }]}>{p.label}</Text>
              {active && <Feather name="check" size={12} color="#fff" />}
            </Pressable>
          );
        })}

        {/* Other chip */}
        <Pressable
          onPress={selectOther}
          style={({ pressed }) => [
            styles.chip,
            showOtherInput && !matched
              ? { backgroundColor: colors.foreground, borderColor: colors.foreground }
              : { backgroundColor: colors.card, borderColor: colors.border },
            { opacity: pressed ? 0.82 : 1 },
          ]}
        >
          <Feather
            name="edit-2"
            size={12}
            color={showOtherInput && !matched ? colors.background : colors.mutedForeground}
          />
          <Text
            style={[
              styles.chipLabel,
              { color: showOtherInput && !matched ? colors.background : colors.mutedForeground },
            ]}
          >
            Other
          </Text>
        </Pressable>
      </ScrollView>

      {/* Free-text input shown when "Other" is active */}
      {showOtherInput && !matched && (
        <TextInput
          ref={inputRef}
          style={[
            styles.otherInput,
            {
              color: colors.foreground,
              borderColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
          placeholder="Type retailer name…"
          placeholderTextColor={colors.mutedForeground}
          value={otherText}
          onChangeText={handleOtherChange}
          autoCorrect={false}
          returnKeyType="done"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 10 },
  chipRow: { flexDirection: "row", gap: 8, paddingRight: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  chipIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  chipIconText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  chipLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  otherInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
