import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getCatalogBySyncCode,
  type PartnerCatalog,
  type CatalogItem,
} from "@/data/partnerCatalogs";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

// QR payload format:
// { "dige": "1.0", "retailer": "Name", "code": "SYNCCODE" }
// Or just a plain sync code string like "BE2025"

function parseQrPayload(raw: string): string | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed.code) return parsed.code;
    if (parsed.retailer) return parsed.retailer;
  } catch {}
  if (/^[A-Z0-9]{4,10}$/i.test(raw.trim())) return raw.trim();
  return null;
}

export default function CatalogScanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [showManual, setShowManual] = useState(Platform.OS === "web");
  const [foundCatalog, setFoundCatalog] = useState<PartnerCatalog | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addWishlistItem } = useDiGe();
  const scanCooldown = useRef(false);

  useEffect(() => {
    if (Platform.OS !== "web" && !permission?.granted) {
      requestPermission();
    }
  }, []);

  function handleBarcodeScanned({ data }: { data: string }) {
    if (scanned || scanCooldown.current) return;
    scanCooldown.current = true;
    const code = parseQrPayload(data);
    if (!code) {
      scanCooldown.current = false;
      return;
    }
    const catalog = getCatalogBySyncCode(code);
    if (catalog) {
      setScanned(true);
      setFoundCatalog(catalog);
    } else {
      Alert.alert("Unrecognized Code", "This QR code isn't a DiGe retailer catalog. Ask your retailer for a DiGe partner code.");
      setTimeout(() => { scanCooldown.current = false; }, 2000);
    }
  }

  function handleManualLookup() {
    const catalog = getCatalogBySyncCode(manualCode);
    if (catalog) {
      setFoundCatalog(catalog);
    } else {
      Alert.alert("Code Not Found", `"${manualCode.toUpperCase()}" isn't a recognized partner code. Check with your retailer.`);
    }
  }

  function handleDemoScan() {
    const catalog = getCatalogBySyncCode("BE2025");
    if (catalog) setFoundCatalog(catalog);
  }

  function handleAddItem(item: CatalogItem, catalog: PartnerCatalog) {
    if (addedIds.has(item.id)) return;
    addWishlistItem({
      name: item.name,
      type: item.type,
      brand: catalog.retailerName,
      retailer: catalog.retailerName,
      retailerUrl: catalog.catalogUrl,
      estimatedPrice: item.price,
      notes: `SKU: ${item.sku} — ${item.description}`,
      priority: "medium",
    });
    setAddedIds((prev) => new Set([...prev, item.id]));
  }

  function handleAddAll(catalog: PartnerCatalog) {
    catalog.items.forEach((item) => handleAddItem(item, catalog));
    Alert.alert("All Added!", `${catalog.items.length} items from ${catalog.retailerName} have been added to your wishlist.`);
  }

  function handleReset() {
    setFoundCatalog(null);
    setScanned(false);
    setManualCode("");
    setAddedIds(new Set());
    scanCooldown.current = false;
  }

  // — Result view —
  if (foundCatalog) {
    return (
      <>
        <Stack.Screen
          options={{
            title: foundCatalog.retailerName,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.foreground,
            headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
            headerLeft: () => (
              <Pressable onPress={handleReset} hitSlop={8}>
                <Feather name="arrow-left" size={22} color={colors.foreground} />
              </Pressable>
            ),
          }}
        />
        <View style={[styles.resultRoot, { backgroundColor: colors.background }]}>
          {/* Catalog header */}
          <View style={[styles.catalogHeader, { backgroundColor: foundCatalog.accentColor }]}>
            <View style={styles.catalogHeaderInner}>
              <View style={styles.catalogCheckBadge}>
                <Feather name="check-circle" size={20} color={foundCatalog.accentColor} />
              </View>
              <View>
                <Text style={styles.catalogSynced}>Catalog synced</Text>
                <Text style={styles.catalogName}>{foundCatalog.retailerName}</Text>
                <Text style={styles.catalogTagline}>{foundCatalog.tagline}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => handleAddAll(foundCatalog)}
              style={styles.addAllBtn}
            >
              <Feather name="heart" size={14} color={foundCatalog.accentColor} />
              <Text style={[styles.addAllBtnText, { color: foundCatalog.accentColor }]}>
                Wishlist All ({foundCatalog.items.length})
              </Text>
            </Pressable>
          </View>

          {/* Items */}
          {foundCatalog.items.map((item, idx) => {
            const added = addedIds.has(item.id);
            return (
              <View
                key={item.id}
                style={[
                  styles.syncItemRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: added ? foundCatalog.accentColor + "40" : colors.border,
                    borderWidth: added ? 1.5 : 1,
                  },
                ]}
              >
                <View style={[styles.syncItemIcon, { backgroundColor: foundCatalog.accentLight }]}>
                  <Feather name="box" size={16} color={foundCatalog.accentColor} />
                </View>
                <View style={styles.syncItemInfo}>
                  <Text style={[styles.syncItemName, { color: colors.foreground }]}>{item.name}</Text>
                  <Text style={[styles.syncItemMat, { color: colors.mutedForeground }]} numberOfLines={1}>{item.material}</Text>
                  <Text style={[styles.syncItemSku, { color: colors.mutedForeground }]}>SKU {item.sku}</Text>
                </View>
                <View style={styles.syncItemRight}>
                  <Text style={[styles.syncItemPrice, { color: colors.foreground }]}>
                    ${parseInt(item.price).toLocaleString()}
                  </Text>
                  <Pressable
                    onPress={() => handleAddItem(item, foundCatalog)}
                    style={[
                      styles.syncAddBtn,
                      { backgroundColor: added ? colors.muted : foundCatalog.accentColor },
                    ]}
                  >
                    <Feather name={added ? "check" : "heart"} size={13} color={added ? colors.mutedForeground : "#fff"} />
                    <Text style={[styles.syncAddBtnText, { color: added ? colors.mutedForeground : "#fff" }]}>
                      {added ? "Saved" : "Save"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}

          {addedIds.size > 0 && (
            <Pressable
              onPress={() => router.push("/")}
              style={[styles.doneBtn, { backgroundColor: colors.primary }]}
            >
              <Feather name="check" size={16} color="#fff" />
              <Text style={styles.doneBtnText}>
                {addedIds.size} item{addedIds.size > 1 ? "s" : ""} added — Go to Retailers
              </Text>
            </Pressable>
          )}
        </View>
      </>
    );
  }

  // — Scanner view —
  return (
    <>
      <Stack.Screen
        options={{
          title: "Scan Retailer Code",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />
      <View style={styles.scanRoot}>
        {/* Camera / placeholder */}
        {Platform.OS !== "web" && permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
        ) : (
          <View style={[styles.fakeCam, { paddingTop: insets.top }]}>
            <Feather name="maximize" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.fakeCamText}>
              {Platform.OS === "web"
                ? "Camera preview available on iOS & Android"
                : "Camera permission required to scan"}
            </Text>
          </View>
        )}

        {/* Viewfinder overlay */}
        <View style={[styles.overlay, { paddingTop: insets.top + 40 }]}>
          <Text style={styles.scanTitle}>Point camera at retailer's QR code</Text>

          <View style={styles.viewfinder}>
            <Corner pos="tl" />
            <Corner pos="tr" />
            <Corner pos="bl" />
            <Corner pos="br" />
            <View style={styles.scanLine} />
          </View>

          <Text style={styles.scanHint}>
            Ask your jeweler for a DiGe catalog QR code or sync code
          </Text>

          {/* Demo scan */}
          <Pressable onPress={handleDemoScan} style={styles.demoBtn}>
            <Feather name="zap" size={14} color="#fff" />
            <Text style={styles.demoBtnText}>Demo: Load Sample Catalog</Text>
          </Pressable>

          {/* Manual code entry */}
          <Pressable onPress={() => setShowManual((v) => !v)} style={styles.manualToggle}>
            <Feather name="edit-2" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.manualToggleText}>Enter sync code manually</Text>
          </Pressable>

          {showManual && (
            <View style={styles.manualRow}>
              <TextInput
                value={manualCode}
                onChangeText={setManualCode}
                placeholder="e.g. BE2025"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoCapitalize="characters"
                style={styles.manualInput}
              />
              <Pressable
                onPress={handleManualLookup}
                style={styles.manualBtn}
                disabled={!manualCode.trim()}
              >
                <Text style={styles.manualBtnText}>Go</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const iT = pos.startsWith("t");
  const iL = pos.endsWith("l");
  return (
    <View
      style={[
        styles.corner,
        iT ? styles.cornerTop : styles.cornerBottom,
        iL ? styles.cornerLeft : styles.cornerRight,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  // Scanner
  scanRoot: { flex: 1, backgroundColor: "#000" },
  fakeCam: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, backgroundColor: "#111" },
  fakeCamText: { fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 260, fontFamily: "Inter_400Regular" },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", gap: 16 },
  scanTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff", textShadowColor: "rgba(0,0,0,0.7)", textShadowRadius: 4, textShadowOffset: { width: 0, height: 1 } },
  viewfinder: { width: 220, height: 220, alignItems: "center", justifyContent: "center" },
  corner: { position: "absolute", width: 28, height: 28, borderColor: "#fff", borderWidth: 3 },
  cornerTop: { top: 0, borderBottomWidth: 0 },
  cornerBottom: { bottom: 0, borderTopWidth: 0 },
  cornerLeft: { left: 0, borderRightWidth: 0 },
  cornerRight: { right: 0, borderLeftWidth: 0 },
  scanLine: { width: "80%", height: 2, backgroundColor: "#8B5CF6", opacity: 0.8 },
  scanHint: { fontSize: 12, color: "rgba(255,255,255,0.65)", textAlign: "center", maxWidth: 260, fontFamily: "Inter_400Regular" },
  demoBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(91,33,182,0.85)", paddingHorizontal: 18, paddingVertical: 11, borderRadius: 24 },
  demoBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },
  manualToggle: { flexDirection: "row", alignItems: "center", gap: 6 },
  manualToggleText: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" },
  manualRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  manualInput: { flex: 1, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, color: "#fff", fontFamily: "Inter_600SemiBold", letterSpacing: 2, maxWidth: 180 },
  manualBtn: { backgroundColor: "#5B21B6", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  manualBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },

  // Result
  resultRoot: { flex: 1, padding: 16, gap: 10 },
  catalogHeader: { borderRadius: 16, padding: 16, gap: 12 },
  catalogHeaderInner: { flexDirection: "row", alignItems: "center", gap: 12 },
  catalogCheckBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  catalogSynced: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.5 },
  catalogName: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff" },
  catalogTagline: { fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular" },
  addAllBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, alignSelf: "flex-start" },
  addAllBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },

  syncItemRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14 },
  syncItemIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  syncItemInfo: { flex: 1, gap: 2 },
  syncItemName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  syncItemMat: { fontSize: 11, fontFamily: "Inter_400Regular" },
  syncItemSku: { fontSize: 10, fontFamily: "Inter_500Medium" },
  syncItemRight: { alignItems: "flex-end", gap: 6 },
  syncItemPrice: { fontSize: 14, fontFamily: "Inter_700Bold" },
  syncAddBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  syncAddBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  doneBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 50, borderRadius: 14, marginTop: 4 },
  doneBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
