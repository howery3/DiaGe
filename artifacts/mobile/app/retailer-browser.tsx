import { Feather } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView, { type WebViewMessageEvent } from "react-native-webview";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

const EXTRACT_SCRIPT = `
(function() {
  function getMeta(name) {
    var el = document.querySelector('meta[property="' + name + '"], meta[name="' + name + '"]');
    return el ? (el.getAttribute('content') || '') : '';
  }
  var data = {
    title: getMeta('og:title') || document.title || '',
    description: getMeta('og:description') || getMeta('description') || '',
    image: getMeta('og:image') || '',
    price: getMeta('og:price:amount') || getMeta('product:price:amount') || getMeta('price') || '',
    url: window.location.href,
  };
  if (!data.price) {
    try {
      var scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (var i = 0; i < scripts.length; i++) {
        var json = JSON.parse(scripts[i].textContent || '{}');
        var items = Array.isArray(json) ? json : [json];
        for (var j = 0; j < items.length; j++) {
          var item = items[j];
          if (item['@type'] === 'Product' && item.offers) {
            var offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            data.price = String(offer.price || '');
            break;
          }
        }
        if (data.price) break;
      }
    } catch(e) {}
  }
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PAGE_META', data: data }));
  true;
})();
`;

interface PageMeta {
  title: string;
  description: string;
  image: string;
  price: string;
  url: string;
}

export default function RetailerBrowserScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addWishlistItem, wishlistItems } = useDiGe();
  const { url, retailer } = useLocalSearchParams<{ url: string; retailer: string }>();

  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState(url ? decodeURIComponent(url) : "");
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");

  const [saving, setSaving] = useState(false);
  const [pageMeta, setPageMeta] = useState<PageMeta | null>(null);
  const [wishlistName, setWishlistName] = useState("");
  const [wishlistPrice, setWishlistPrice] = useState("");
  const [wishlistNotes, setWishlistNotes] = useState("");

  const retailerName = retailer ? decodeURIComponent(retailer) : "Retailer";
  const startUrl = url ? decodeURIComponent(url) : "https://google.com";

  function handleMessage(e: WebViewMessageEvent) {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === "PAGE_META") {
        const meta: PageMeta = msg.data;
        setPageMeta(meta);
        setWishlistName(meta.title?.slice(0, 80) ?? "");
        const rawPrice = meta.price?.replace(/[^0-9.]/g, "") ?? "";
        setWishlistPrice(rawPrice);
        setWishlistNotes(meta.url ? `Source: ${meta.url}` : "");
        setSaving(true);
      }
    } catch {}
  }

  function handleSavePress() {
    webViewRef.current?.injectJavaScript(EXTRACT_SCRIPT);
  }

  function handleConfirmSave() {
    if (!wishlistName.trim()) {
      Alert.alert("Name required", "Please enter a name for this wishlist item.");
      return;
    }
    const already = wishlistItems.some(
      (w) => w.notes?.includes(currentUrl) || w.name.toLowerCase() === wishlistName.toLowerCase()
    );
    if (already) {
      Alert.alert("Already saved", "This item looks like it's already in your wishlist.");
      return;
    }
    addWishlistItem({
      name: wishlistName.trim(),
      sku: "",
      type: "other",
      brand: retailerName,
      retailer: retailerName,
      retailerUrl: currentUrl,
      estimatedPrice: wishlistPrice.trim(),
      notes: wishlistNotes.trim(),
      priority: "medium",
    });
    setSaving(false);
    Alert.alert("Saved to Wishlist!", `"${wishlistName.trim()}" has been added to your DiaGe wishlist.`);
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Custom header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border, paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.headerBtn} hitSlop={8}>
            <Feather name="x" size={20} color={colors.foreground} />
          </Pressable>
          <View style={[styles.urlBar, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Feather name="lock" size={11} color={colors.mutedForeground} />
            <Text style={[styles.urlText, { color: colors.mutedForeground }]} numberOfLines={1}>
              {pageTitle || currentUrl}
            </Text>
          </View>
          <Pressable
            onPress={() => webViewRef.current?.reload()}
            style={styles.headerBtn}
            hitSlop={8}
          >
            <Feather name="refresh-cw" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Retailer badge + nav */}
        <View style={styles.navRow}>
          <View style={[styles.retailerBadge, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "25" }]}>
            <Feather name="archive" size={12} color={colors.primary} />
            <Text style={[styles.retailerBadgeText, { color: colors.primary }]}>{retailerName}</Text>
          </View>
          <View style={styles.navBtns}>
            <Pressable
              onPress={() => webViewRef.current?.goBack()}
              disabled={!canGoBack}
              style={[styles.navBtn, { opacity: canGoBack ? 1 : 0.3 }]}
              hitSlop={8}
            >
              <Feather name="arrow-left" size={18} color={colors.foreground} />
            </Pressable>
            <Pressable
              onPress={() => webViewRef.current?.goForward()}
              disabled={!canGoForward}
              style={[styles.navBtn, { opacity: canGoForward ? 1 : 0.3 }]}
              hitSlop={8}
            >
              <Feather name="arrow-right" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        {loading ? (
          <View style={[styles.progressBar, { backgroundColor: colors.primary + "20" }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.primary }]} />
          </View>
        ) : null}
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: startUrl }}
        style={{ flex: 1, backgroundColor: colors.background }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(state) => {
          setCurrentUrl(state.url);
          setPageTitle(state.title || "");
          setCanGoBack(state.canGoBack);
          setCanGoForward(state.canGoForward);
        }}
        onMessage={handleMessage}
        sharedCookiesEnabled
        allowsBackForwardNavigationGestures={Platform.OS === "ios"}
        pullToRefreshEnabled
      />

      {/* Floating save button */}
      <View style={[styles.fabWrap, { bottom: insets.bottom + 20 }]}>
        <Pressable
          onPress={handleSavePress}
          style={[styles.fab, { backgroundColor: colors.primary }]}
        >
          <Feather name="heart" size={18} color="#fff" />
          <Text style={styles.fabText}>Save to Wishlist</Text>
        </Pressable>
      </View>

      {/* Save modal */}
      <Modal
        visible={saving}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSaving(false)}
      >
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Save to Wishlist</Text>
              <Text style={[styles.sheetSub, { color: colors.mutedForeground }]}>{retailerName}</Text>
            </View>
            <Pressable onPress={() => setSaving(false)} hitSlop={8}>
              <Feather name="x" size={22} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {pageMeta?.image ? (
            <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="image" size={14} color={colors.mutedForeground} />
              <Text style={[styles.previewUrl, { color: colors.mutedForeground }]} numberOfLines={1}>
                {pageMeta.url}
              </Text>
            </View>
          ) : null}

          <View style={styles.sheetFields}>
            <View style={styles.sheetField}>
              <Text style={[styles.sheetLabel, { color: colors.mutedForeground }]}>Item Name</Text>
              <TextInput
                style={[styles.sheetInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.muted }]}
                value={wishlistName}
                onChangeText={setWishlistName}
                placeholder="e.g. Diamond Solitaire Ring"
                placeholderTextColor={colors.mutedForeground}
                returnKeyType="next"
              />
            </View>
            <View style={styles.sheetField}>
              <Text style={[styles.sheetLabel, { color: colors.mutedForeground }]}>Price (optional)</Text>
              <TextInput
                style={[styles.sheetInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.muted }]}
                value={wishlistPrice}
                onChangeText={setWishlistPrice}
                placeholder="e.g. 2890"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
            </View>
            <View style={styles.sheetField}>
              <Text style={[styles.sheetLabel, { color: colors.mutedForeground }]}>Notes (optional)</Text>
              <TextInput
                style={[styles.sheetTextarea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.muted }]}
                value={wishlistNotes}
                onChangeText={setWishlistNotes}
                placeholder="Size, color, any other details..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>
          </View>

          <View style={[styles.sheetActions, { paddingBottom: insets.bottom + 16 }]}>
            <Pressable
              onPress={() => setSaving(false)}
              style={[styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirmSave}
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            >
              <Feather name="heart" size={16} color="#fff" />
              <Text style={styles.saveBtnText}>Save to Wishlist</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 6,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 8 },
  headerBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  urlBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  urlText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  navRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4 },
  retailerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  retailerBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  navBtns: { flexDirection: "row", gap: 4 },
  navBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  progressBar: { height: 2, borderRadius: 1, overflow: "hidden", marginTop: 2 },
  progressFill: { width: "60%", height: "100%", borderRadius: 1 },

  fabWrap: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#5B21B6",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },

  sheet: { flex: 1, padding: 20, gap: 16 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 4 },
  sheetHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  sheetTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  sheetSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  previewUrl: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular" },
  sheetFields: { gap: 14 },
  sheetField: { gap: 6 },
  sheetLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sheetInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  sheetTextarea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    minHeight: 80,
  },
  sheetActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, borderWidth: 1, borderRadius: 14, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  cancelBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  saveBtn: { flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 14 },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
});
