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
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function warrantyDaysLeft(expiry: string): { text: string; color: string } | null {
  if (!expiry) return null;
  const diff = new Date(expiry).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { text: "Warranty Expired", color: "#DC2626" };
  if (days === 0) return { text: "Warranty Expires Today", color: "#B45309" };
  if (days <= 90) return { text: `Warranty expires in ${days} days`, color: "#B45309" };
  return { text: `Warranty active — ${days} days remaining`, color: "#15803D" };
}

async function pickFromLibrary(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission needed", "Allow photo library access to attach images.");
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.85,
  });
  return result.canceled ? null : result.assets[0].uri;
}

async function pickFromCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission needed", "Allow camera access to take photos.");
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.85,
  });
  return result.canceled ? null : result.assets[0].uri;
}

export default function PieceDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPiece, deletePiece, updatePiece } = useDiGe();

  const piece = getPiece(id ?? "");

  if (!piece) {
    return (
      <>
        <Stack.Screen options={{ title: "Not Found" }} />
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <Text style={[styles.notFound, { color: colors.mutedForeground }]}>
            Piece not found.
          </Text>
        </View>
      </>
    );
  }

  const warrantyInfo = warrantyDaysLeft(piece.warrantyExpiry);

  function handleDelete() {
    Alert.alert("Delete Piece", `Remove "${piece!.name}" from your vault?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deletePiece(piece!.id);
          router.back();
        },
      },
    ]);
  }

  function handleChangePhoto() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: piece!.imageUri
            ? ["Cancel", "Take Photo", "Choose from Library", "Remove Photo"]
            : ["Cancel", "Take Photo", "Choose from Library"],
          cancelButtonIndex: 0,
          destructiveButtonIndex: piece!.imageUri ? 3 : undefined,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            const uri = await pickFromCamera();
            if (uri) updatePiece(piece!.id, { imageUri: uri });
          } else if (buttonIndex === 2) {
            const uri = await pickFromLibrary();
            if (uri) updatePiece(piece!.id, { imageUri: uri });
          } else if (buttonIndex === 3 && piece!.imageUri) {
            updatePiece(piece!.id, { imageUri: undefined });
          }
        }
      );
    } else {
      const options: Alert.AlertButton[] = [
        { text: "Cancel", style: "cancel" },
        {
          text: "Camera",
          onPress: async () => {
            const uri = await pickFromCamera();
            if (uri) updatePiece(piece!.id, { imageUri: uri });
          },
        },
        {
          text: "Photo Library",
          onPress: async () => {
            const uri = await pickFromLibrary();
            if (uri) updatePiece(piece!.id, { imageUri: uri });
          },
        },
      ];
      if (piece.imageUri) {
        options.push({
          text: "Remove Photo",
          style: "destructive",
          onPress: () => updatePiece(piece!.id, { imageUri: undefined }),
        });
      }
      Alert.alert("Photo", "Choose an option", options);
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
        {piece.imageUri ? (
          <Pressable onPress={handleChangePhoto} style={styles.heroImageWrap}>
            <Image
              source={{ uri: piece.imageUri }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={[styles.photoEditChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="camera" size={12} color={colors.primary} />
              <Text style={[styles.photoEditText, { color: colors.primary }]}>Change Photo</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleChangePhoto}
            style={[styles.photoAdd, { backgroundColor: colors.secondary, borderColor: colors.border }]}
          >
            <Feather name="camera" size={20} color={colors.primary} />
            <Text style={[styles.photoAddText, { color: colors.primary }]}>Add Photo</Text>
          </Pressable>
        )}

        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.typeTag, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.typeTagText, { color: colors.mutedForeground }]}>
              {piece.type.charAt(0).toUpperCase() + piece.type.slice(1)}
            </Text>
          </View>
          <Text style={[styles.heroName, { color: colors.foreground }]}>{piece.name}</Text>
          {piece.brand ? (
            <Text style={[styles.heroBrand, { color: colors.mutedForeground }]}>{piece.brand}</Text>
          ) : null}
          {piece.material ? (
            <Text style={[styles.heroMaterial, { color: colors.primary }]}>{piece.material}</Text>
          ) : null}
        </View>

        {warrantyInfo ? (
          <View
            style={[
              styles.warrantyBanner,
              {
                backgroundColor: warrantyInfo.color + "15",
                borderColor: warrantyInfo.color + "40",
              },
            ]}
          >
            <Feather name="shield" size={16} color={warrantyInfo.color} />
            <Text style={[styles.warrantyBannerText, { color: warrantyInfo.color }]}>
              {warrantyInfo.text}
            </Text>
          </View>
        ) : null}

        <SectionCard label="Purchase Details" colors={colors}>
          <Row label="Retailer" value={piece.retailer} colors={colors} />
          <Row label="Purchase Date" value={formatDate(piece.purchaseDate)} colors={colors} />
          <Row
            label="Price"
            value={piece.purchasePrice ? `$${piece.purchasePrice}` : ""}
            colors={colors}
          />
          <Row label="Serial / Certificate" value={piece.serialNumber} colors={colors} />
        </SectionCard>

        <SectionCard label="Warranty" colors={colors}>
          <Row label="Expiry Date" value={formatDate(piece.warrantyExpiry)} colors={colors} />
          <Row label="Last Inspection" value={formatDate(piece.lastInspection)} colors={colors} />
          {piece.warrantyDetails ? (
            <View style={styles.textBlock}>
              <Text style={[styles.textBlockLabel, { color: colors.mutedForeground }]}>Details</Text>
              <Text style={[styles.textBlockContent, { color: colors.foreground }]}>
                {piece.warrantyDetails}
              </Text>
            </View>
          ) : null}
        </SectionCard>

        {piece.description ? (
          <SectionCard label="Documents & Notes" colors={colors}>
            <Text style={[styles.textBlockContent, { color: colors.foreground }]}>
              {piece.description}
            </Text>
          </SectionCard>
        ) : null}
      </ScrollView>
    </>
  );
}

function SectionCard({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
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
  heroImageWrap: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
  },
  photoEditChip: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  photoEditText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  photoAdd: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  photoAddText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  heroCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  typeTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  typeTagText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroName: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  heroBrand: { fontSize: 15, fontFamily: "Inter_400Regular" },
  heroMaterial: { fontSize: 14, fontFamily: "Inter_500Medium" },
  warrantyBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  warrantyBannerText: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1 },
  section: { gap: 8 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  sectionCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  rowLabel: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  rowValue: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1, textAlign: "right" },
  textBlock: { gap: 4 },
  textBlockLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  textBlockContent: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
