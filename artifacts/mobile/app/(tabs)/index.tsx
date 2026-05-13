import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

interface RetailerSummary {
  name: string;
  pieceCount: number;
  wishlistCount: number;
}

async function captureReceiptPhoto(): Promise<string | null> {
  if (Platform.OS === "ios") {
    return new Promise((resolve) => {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["Cancel", "Take Photo", "Choose from Library"], cancelButtonIndex: 0 },
        async (idx) => {
          if (idx === 1) {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") { Alert.alert("Permission needed", "Allow camera access to scan receipts."); resolve(null); return; }
            const r = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.9 });
            resolve(r.canceled ? null : r.assets[0].uri);
          } else if (idx === 2) {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") { Alert.alert("Permission needed", "Allow photo library access."); resolve(null); return; }
            const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.9 });
            resolve(r.canceled ? null : r.assets[0].uri);
          } else {
            resolve(null);
          }
        }
      );
    });
  } else {
    return new Promise((resolve) => {
      Alert.alert("Scan Receipt", "Choose a source", [
        { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
        {
          text: "Camera", onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") { resolve(null); return; }
            const r = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.9 });
            resolve(r.canceled ? null : r.assets[0].uri);
          }
        },
        {
          text: "Photo Library", onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") { resolve(null); return; }
            const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.9 });
            resolve(r.canceled ? null : r.assets[0].uri);
          }
        },
      ]);
    });
  }
}

export default function VaultScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces, wishlistItems } = useDiGe();
  const [query, setQuery] = useState("");

  const retailers = useMemo<RetailerSummary[]>(() => {
    const map = new Map<string, RetailerSummary>();
    const key = (r: string) => r.trim() || "Uncategorized";
    for (const p of pieces) {
      const k = key(p.retailer);
      if (!map.has(k)) map.set(k, { name: k, pieceCount: 0, wishlistCount: 0 });
      map.get(k)!.pieceCount += 1;
    }
    for (const w of wishlistItems) {
      const k = key(w.retailer);
      if (!map.has(k)) map.set(k, { name: k, pieceCount: 0, wishlistCount: 0 });
      map.get(k)!.wishlistCount += 1;
    }
    return Array.from(map.values()).sort((a, b) => {
      if (a.name === "Uncategorized") return 1;
      if (b.name === "Uncategorized") return -1;
      return a.name.localeCompare(b.name);
    });
  }, [pieces, wishlistItems]);

  const filtered = query.trim()
    ? retailers.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    : retailers;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const totalDocs = pieces.reduce((acc, p) => acc + (p.documents?.length ?? 0), 0);

  async function handleScanReceipt() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const uri = await captureReceiptPhoto();
    if (uri) {
      router.push(`/piece/add?receiptUri=${encodeURIComponent(uri)}`);
    }
  }

  function handleAddPiece() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/piece/add");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.logo, { color: colors.primary }]}>DiaGe</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {pieces.length} {pieces.length === 1 ? "piece" : "pieces"} · {totalDocs} {totalDocs === 1 ? "document" : "documents"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {pieces.length > 0 ? (
              <Pressable
                onPress={() => router.push("/insurance-report")}
                style={[styles.headerBtn, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}
                hitSlop={8}
              >
                <Feather name="file-text" size={14} color={colors.primary} />
                <Text style={[styles.headerBtnText, { color: colors.primary }]}>Report</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={() => router.push("/settings")}
              style={[styles.settingsBtn, { backgroundColor: colors.muted }]}
              hitSlop={8}
            >
              <Feather name="settings" size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Primary action strip */}
      <View style={styles.actionStrip}>
        <Pressable
          onPress={handleAddPiece}
          style={[styles.addPieceBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name="plus" size={18} color="#fff" />
          <Text style={styles.addPieceBtnText}>Add Jewelry Piece</Text>
        </Pressable>
        <Pressable
          onPress={handleScanReceipt}
          style={[styles.scanBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="camera" size={18} color={colors.primary} />
          <Text style={[styles.scanBtnText, { color: colors.primary }]}>Scan Receipt</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.search, { color: colors.foreground }]}
          placeholder="Search by retailer..."
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query ? (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
        ListHeaderComponent={
          filtered.length > 0 ? (
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>BY RETAILER</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <RetailerCard
            retailer={item}
            colors={colors}
            onPress={() => router.push(`/retailer/${encodeURIComponent(item.name)}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="archive"
              title={query ? "No retailers found" : "Your vault is empty"}
              subtitle={
                query
                  ? "Try a different search."
                  : "Tap \"Add Jewelry Piece\" above to store your first piece with its receipts, warranties, and paperwork."
              }
            />
            <View style={[styles.shopSyncSection, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginBottom: 10 }]}>SHOP &amp; SYNC</Text>
              <View style={styles.shopSyncRow}>
                <Pressable
                  onPress={() => router.push("/catalog-scan")}
                  style={[styles.shopSyncCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={[styles.shopSyncIcon, { backgroundColor: "#5B21B6" }]}>
                    <Feather name="maximize" size={18} color="#fff" />
                  </View>
                  <View style={styles.shopSyncText}>
                    <Text style={[styles.shopSyncTitle, { color: colors.foreground }]}>Scan In-Store</Text>
                    <Text style={[styles.shopSyncSub, { color: colors.mutedForeground }]}>Load catalog via QR</Text>
                  </View>
                  <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
                </Pressable>
                <Pressable
                  onPress={() => router.push("/catalog-browse")}
                  style={[styles.shopSyncCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={[styles.shopSyncIcon, { backgroundColor: "#0E6655" }]}>
                    <Feather name="grid" size={18} color="#fff" />
                  </View>
                  <View style={styles.shopSyncText}>
                    <Text style={[styles.shopSyncTitle, { color: colors.foreground }]}>Browse Online</Text>
                    <Text style={[styles.shopSyncSub, { color: colors.mutedForeground }]}>Shop partner catalogs</Text>
                  </View>
                  <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={
          filtered.length > 0 ? (
            <View style={[styles.shopSyncSection, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginBottom: 10 }]}>SHOP &amp; SYNC</Text>
              <View style={styles.shopSyncRow}>
                <Pressable
                  onPress={() => router.push("/catalog-scan")}
                  style={[styles.shopSyncCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={[styles.shopSyncIcon, { backgroundColor: "#5B21B6" }]}>
                    <Feather name="maximize" size={18} color="#fff" />
                  </View>
                  <View style={styles.shopSyncText}>
                    <Text style={[styles.shopSyncTitle, { color: colors.foreground }]}>Scan In-Store</Text>
                    <Text style={[styles.shopSyncSub, { color: colors.mutedForeground }]}>Load catalog via QR</Text>
                  </View>
                  <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
                </Pressable>
                <Pressable
                  onPress={() => router.push("/catalog-browse")}
                  style={[styles.shopSyncCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={[styles.shopSyncIcon, { backgroundColor: "#0E6655" }]}>
                    <Feather name="grid" size={18} color="#fff" />
                  </View>
                  <View style={styles.shopSyncText}>
                    <Text style={[styles.shopSyncTitle, { color: colors.foreground }]}>Browse Online</Text>
                    <Text style={[styles.shopSyncSub, { color: colors.mutedForeground }]}>Shop partner catalogs</Text>
                  </View>
                  <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function RetailerCard({
  retailer,
  colors,
  onPress,
}: {
  retailer: RetailerSummary;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  const isUncategorized = retailer.name === "Uncategorized";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.cardIcon, { backgroundColor: isUncategorized ? colors.muted : colors.primary + "18" }]}>
        <Feather
          name={isUncategorized ? "folder" : "archive"}
          size={22}
          color={isUncategorized ? colors.mutedForeground : colors.primary}
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardName, { color: colors.foreground }]} numberOfLines={1}>
          {retailer.name}
        </Text>
        <View style={styles.cardMeta}>
          {retailer.pieceCount > 0 ? (
            <View style={styles.metaChip}>
              <Feather name="box" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {retailer.pieceCount} {retailer.pieceCount === 1 ? "piece" : "pieces"}
              </Text>
            </View>
          ) : null}
          {retailer.wishlistCount > 0 ? (
            <View style={styles.metaChip}>
              <Feather name="heart" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {retailer.wishlistCount} wishlist
              </Text>
            </View>
          ) : null}
          {retailer.pieceCount === 0 && retailer.wishlistCount === 0 ? (
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>Empty</Text>
          ) : null}
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  headerBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  settingsBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  actionStrip: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 14 },
  addPieceBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#5B21B6",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  addPieceBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
  scanBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  scanBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  searchWrap: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, gap: 10 },
  search: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },

  list: { paddingHorizontal: 20, paddingTop: 4, flexGrow: 1 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 },

  card: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10, gap: 14 },
  cardIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  cardInfo: { flex: 1, gap: 4 },
  cardName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  cardMeta: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },

  emptyWrap: { flex: 1 },
  shopSyncSection: { marginTop: 28, paddingTop: 24, borderTopWidth: StyleSheet.hairlineWidth },
  shopSyncRow: { gap: 8 },
  shopSyncCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 13, borderRadius: 14, borderWidth: 1 },
  shopSyncIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  shopSyncText: { flex: 1, gap: 2 },
  shopSyncTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  shopSyncSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
