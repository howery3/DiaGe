import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { capture } from "@/utils/posthog";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe, type WishlistPriority } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { fetchOgImage } from "@/utils/fetchOgImage";

const PRIORITIES: { value: WishlistPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "#15803D" },
  { value: "medium", label: "Medium", color: "#B45309" },
  { value: "high", label: "High", color: "#DC2626" },
];

export default function AddWishlistItemScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addWishlistItem } = useDiGe();
  const { retailer: prefillRetailer } = useLocalSearchParams<{ retailer?: string }>();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [retailer, setRetailer] = useState(
    prefillRetailer ? decodeURIComponent(prefillRetailer) : ""
  );
  const [retailerUrl, setRetailerUrl] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [priority, setPriority] = useState<WishlistPriority>("medium");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fetchingImage, setFetchingImage] = useState(false);

  async function handleUrlBlur() {
    const url = retailerUrl.trim();
    if (!url || !url.startsWith("http") || imageUrl) return;
    setFetchingImage(true);
    const found = await fetchOgImage(url);
    setImageUrl(found);
    setFetchingImage(false);
  }

  function handleSave() {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter a name for this item.");
      return;
    }
    addWishlistItem({
      name: name.trim(),
      sku: sku.trim(),
      brand: brand.trim(),
      type: type.trim(),
      retailer: retailer.trim(),
      retailerUrl: retailerUrl.trim(),
      estimatedPrice: estimatedPrice.trim(),
      priority,
      notes: notes.trim(),
      imageUrl: imageUrl ?? undefined,
    });
    capture("wishlist_item_added", {
      retailer: retailer.trim(),
      priority,
      has_price: !!estimatedPrice.trim(),
      has_url: !!retailerUrl.trim(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: retailer ? `Wishlist — ${retailer}` : "Add to Wishlist",
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
        <SectionLabel label="Item Details" colors={colors} />

        <Field label="Name *" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. Cartier Love Bracelet"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
          />
        </Field>

        <Field label="SKU / Item #" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. BE-LDR-001"
            placeholderTextColor={colors.mutedForeground}
            value={sku}
            onChangeText={setSku}
            autoCapitalize="characters"
          />
        </Field>

        <Field label="Brand" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. Cartier"
            placeholderTextColor={colors.mutedForeground}
            value={brand}
            onChangeText={setBrand}
          />
        </Field>

        <Field label="Type" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. Bracelet, Ring, Necklace..."
            placeholderTextColor={colors.mutedForeground}
            value={type}
            onChangeText={setType}
          />
        </Field>

        <SectionLabel label="Retailer" colors={colors} />

        <Field label="Retailer Name" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="e.g. Zales, Kay, Helzberg..."
            placeholderTextColor={colors.mutedForeground}
            value={retailer}
            onChangeText={setRetailer}
          />
        </Field>

        <Field label="Product URL" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="https://..."
            placeholderTextColor={colors.mutedForeground}
            value={retailerUrl}
            onChangeText={(v) => {
              setRetailerUrl(v);
              if (!v) setImageUrl(null);
            }}
            onBlur={handleUrlBlur}
            keyboardType="url"
            autoCapitalize="none"
          />
        </Field>

        {/* Thumbnail preview */}
        {(fetchingImage || imageUrl) ? (
          <View style={[styles.thumbWrap, { borderColor: colors.border, backgroundColor: colors.muted }]}>
            {fetchingImage ? (
              <View style={styles.thumbLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.thumbHint, { color: colors.mutedForeground }]}>
                  Fetching product image…
                </Text>
              </View>
            ) : imageUrl ? (
              <>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.thumbImage}
                  contentFit="cover"
                />
                <View style={styles.thumbMeta}>
                  <Feather name="image" size={13} color={colors.primary} />
                  <Text style={[styles.thumbHint, { color: colors.mutedForeground }]} numberOfLines={1}>
                    Product thumbnail saved
                  </Text>
                  <Pressable
                    onPress={() => setImageUrl(null)}
                    hitSlop={8}
                    style={styles.thumbRemove}
                  >
                    <Feather name="x" size={14} color={colors.mutedForeground} />
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        ) : null}

        <Field label="Estimated Price ($)" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="0.00"
            placeholderTextColor={colors.mutedForeground}
            value={estimatedPrice}
            onChangeText={setEstimatedPrice}
            keyboardType="decimal-pad"
          />
        </Field>

        <SectionLabel label="Priority" colors={colors} />

        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <Pressable
              key={p.value}
              onPress={() => setPriority(p.value)}
              style={[
                styles.priorityPill,
                {
                  backgroundColor: priority === p.value ? p.color + "20" : colors.secondary,
                  borderColor: priority === p.value ? p.color : colors.border,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  { color: priority === p.value ? p.color : colors.mutedForeground },
                ]}
              >
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <SectionLabel label="Notes" colors={colors} />

        <Field label="Notes" colors={colors}>
          <TextInput
            style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="Size, color preference, occasion..."
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

function SectionLabel({ label, colors }: { label: string; colors: ReturnType<typeof useColors> }) {
  return <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{label}</Text>;
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
  priorityRow: { flexDirection: "row", gap: 10 },
  priorityPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  priorityText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  thumbWrap: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  thumbLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  thumbImage: {
    width: "100%",
    height: 160,
  },
  thumbMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  thumbHint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  thumbRemove: { padding: 2 },
});
