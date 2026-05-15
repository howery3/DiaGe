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

  function looksLikeSku(val) {
    if (!val) return false;
    val = String(val).trim();
    // 3-25 chars, alphanumeric + hyphens/underscores/periods, must have at least one digit, not a plain year
    return /^[A-Za-z0-9][A-Za-z0-9\\-_.]{2,24}$/.test(val) && /\\d/.test(val) && !/^\\d{4}$/.test(val) && !/^\\d{1,2}$/.test(val);
  }

  function extractSku() {
    // 1. JSON-LD structured data (most reliable)
    try {
      var scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (var i = 0; i < scripts.length; i++) {
        var json = JSON.parse(scripts[i].textContent || '{}');
        var items = Array.isArray(json) ? json : [json];
        for (var j = 0; j < items.length; j++) {
          var item = items[j];
          if (item['@type'] === 'Product') {
            var candidates = [item.sku, item.mpn, item.gtin8, item.productID];
            for (var k = 0; k < candidates.length; k++) {
              var v = String(candidates[k] || '').replace(/\\s/g, '');
              if (looksLikeSku(v)) return v.toUpperCase();
            }
          }
        }
      }
    } catch(e) {}

    // 2. Meta tags
    var metaNames = ['sku', 'product:sku', 'product_id', 'item_number', 'og:product:item_group_id'];
    for (var m = 0; m < metaNames.length; m++) {
      var val = getMeta(metaNames[m]).replace(/\\s/g, '');
      if (looksLikeSku(val)) return val.toUpperCase();
    }

    // 3. DOM attributes — itemprop, data-sku, data-product-id
    var domSelectors = ['[itemprop="sku"]', '[data-sku]', '[data-product-id]', '[data-item-id]'];
    for (var d = 0; d < domSelectors.length; d++) {
      var el = document.querySelector(domSelectors[d]);
      if (el) {
        var text = (el.getAttribute('content') || el.getAttribute('data-sku') || el.getAttribute('data-product-id') || el.getAttribute('data-item-id') || el.textContent || '').replace(/\\s/g, '');
        if (looksLikeSku(text)) return text.toUpperCase();
      }
    }

    // 4. URL — named query params first, then path segments
    var SKU_PARAMS = ['sku', 'item', 'itemid', 'productid', 'pid', 'item_number', 'style', 'modelnumber', 'partnumber'];
    var SKIP_SEGS = ['products','product','item','items','shop','store','jewelry','ring','rings','necklace','necklaces','bracelet','bracelets','earring','earrings','watch','watches','collection','collections','category','categories','p','en','us','www','com','html','aspx'];
    try {
      var search = window.location.search.slice(1);
      var pairs = search.split('&');
      for (var pi = 0; pi < pairs.length; pi++) {
        var kv = pairs[pi].split('=');
        if (kv.length === 2 && SKU_PARAMS.indexOf(kv[0].toLowerCase()) !== -1) {
          var qv = decodeURIComponent(kv[1] || '').replace(/\\s/g, '');
          if (looksLikeSku(qv)) return qv.toUpperCase();
        }
      }
    } catch(e) {}
    var segs = window.location.pathname.split('/').filter(Boolean).reverse();
    for (var si = 0; si < segs.length; si++) {
      var seg = segs[si].replace(/\\.[^.]+$/, '');
      if (SKIP_SEGS.indexOf(seg.toLowerCase()) === -1 && looksLikeSku(seg)) return seg.toUpperCase();
    }

    return '';
  }

  var data = {
    title: getMeta('og:title') || document.title || '',
    description: getMeta('og:description') || getMeta('description') || '',
    image: getMeta('og:image') || '',
    price: getMeta('og:price:amount') || getMeta('product:price:amount') || getMeta('price') || '',
    url: window.location.href,
    sku: extractSku(),
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
  sku: string;
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
  const [wishlistSku, setWishlistSku] = useState("");
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
        setWishlistSku(meta.sku ?? "");
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
      sku: wishlistSku.trim(),
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
              <Text style={[styles.sheetLabel, { color: colors.mutedForeground }]}>
                SKU / Item #{wishlistSku ? " · auto-filled" : ""}
              </Text>
              <TextInput
                style={[styles.sheetInput, { color: colors.foreground, borderColor: wishlistSku ? colors.primary + "60" : colors.border, backgroundColor: colors.muted }]}
                value={wishlistSku}
                onChangeText={setWishlistSku}
                placeholder="8-digit item number"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="number-pad"
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
