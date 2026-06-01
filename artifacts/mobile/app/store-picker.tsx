import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { usePreferredStore, type PreferredStore } from "@/hooks/usePreferredStore";

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`
  : "http://localhost:5000/api";

const BANNER_ORDER = ["Kay Jewelers", "Jared", "Zales", "Banter by Piercing Pagoda"];

const BANNER_COLOR: Record<string, string> = {
  "Kay Jewelers": "#5B21B6",
  "Jared": "#0079F2",
  "Zales": "#D97706",
  "Banter by Piercing Pagoda": "#B91C1C",
};

function storeInitial(banner: string) {
  if (banner.startsWith("Kay")) return "K";
  if (banner.startsWith("Jared")) return "J";
  if (banner.startsWith("Zales")) return "Z";
  return "B";
}

export default function StorePickerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { retailer: retailerParam } = useLocalSearchParams<{ retailer?: string }>();
  const { stores, getStore, saveStore } = usePreferredStore();

  const [allStores, setAllStores] = useState<PreferredStore[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function loadStores() {
      let locSuffix = "";
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          locSuffix = `&lat=${loc.coords.latitude}&lng=${loc.coords.longitude}`;
        }
      } catch { /* location optional — stores still load without it */ }

      try {
        const r = await fetch(`${API_BASE}/stores${locSuffix ? `?${locSuffix.slice(1)}` : ""}`);
        const data = await r.json();
        setAllStores(data);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    }
    loadStores();
  }, []);

  const baseStores = retailerParam
    ? allStores.filter((s) => s.banner === retailerParam)
    : allStores;

  const filtered = baseStores.filter((s) =>
    !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.address.toLowerCase().includes(query.toLowerCase())
  );

  const grouped: { banner: string; stores: PreferredStore[] }[] = BANNER_ORDER
    .map((banner) => ({ banner, stores: filtered.filter((s) => s.banner === banner) }))
    .filter((g) => g.stores.length > 0);

  const saveKey = retailerParam ?? null;

  function isSelected(store: PreferredStore) {
    const key = saveKey ?? store.banner;
    return getStore(key)?.id === store.id;
  }

  async function handleSelect(store: PreferredStore) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(store.id);
    const key = saveKey ?? store.banner;
    await saveStore(key, store);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(null);
    router.back();
  }

  const topPad = Platform.OS === "web" ? 20 : insets.top + 16;

  const title = retailerParam ? `Set ${retailerParam} Store` : "Find Your Store";
  const subtitle = retailerParam
    ? `Choose which ${retailerParam} location to link to this part of your wishlist.`
    : "Your wishlist leads, appointment requests, and reminders will go directly to this store.";

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
            <Text style={[styles.sub, { color: colors.mutedForeground }]}>{subtitle}</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search by store name or address"
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Feather name="x" size={14} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#5B21B6" />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading nearby stores…</Text>
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(g) => g.banner}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: group }) => (
            <View style={styles.bannerGroup}>
              <View style={styles.bannerHeader}>
                <View style={[styles.bannerDot, { backgroundColor: BANNER_COLOR[group.banner] ?? "#5B21B6" }]} />
                <Text style={[styles.bannerLabel, { color: colors.mutedForeground }]}>{group.banner.toUpperCase()}</Text>
              </View>
              {group.stores.map((store) => {
                const sel = isSelected(store);
                const isSaving = saving === store.id;
                const bannerColor = BANNER_COLOR[store.banner] ?? "#5B21B6";
                return (
                  <Pressable
                    key={store.id}
                    onPress={() => handleSelect(store)}
                    style={({ pressed }) => [
                      styles.storeCard,
                      {
                        backgroundColor: sel ? `${bannerColor}12` : colors.card,
                        borderColor: sel ? bannerColor : colors.border,
                        opacity: pressed ? 0.88 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.storeInitialBubble, { backgroundColor: `${bannerColor}18` }]}>
                      <Text style={[styles.storeInitialText, { color: bannerColor }]}>
                        {storeInitial(store.banner)}
                      </Text>
                    </View>
                    <View style={styles.storeMeta}>
                      <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>
                        {store.name}
                      </Text>
                      <Text style={[styles.storeAddress, { color: colors.mutedForeground }]} numberOfLines={1}>
                        {store.address}
                      </Text>
                      <View style={styles.storeFooter}>
                        <View style={styles.distancePill}>
                          <Feather name="navigation" size={9} color={colors.mutedForeground} />
                          <Text style={[styles.distanceText, { color: colors.mutedForeground }]}>{store.distanceMi} mi</Text>
                        </View>
                        <Text style={[styles.phoneText, { color: colors.mutedForeground }]}>{store.phone}</Text>
                      </View>
                    </View>
                    {isSaving ? (
                      <ActivityIndicator size="small" color={bannerColor} />
                    ) : sel ? (
                      <View style={[styles.checkBubble, { backgroundColor: bannerColor }]}>
                        <Feather name="check" size={13} color="#fff" />
                      </View>
                    ) : (
                      <View style={[styles.selectBubble, { borderColor: colors.border }]}>
                        <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  backBtn: { marginTop: 2 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  sub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 4, lineHeight: 18 },
  searchWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginHorizontal: 16, marginBottom: 8,
    paddingHorizontal: 14, paddingVertical: 11,
    borderRadius: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  loadingText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  bannerGroup: { marginBottom: 16 },
  bannerHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8, marginLeft: 2 },
  bannerDot: { width: 7, height: 7, borderRadius: 4 },
  bannerLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.6 },
  storeCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, borderRadius: 16, borderWidth: 1.5, marginBottom: 8,
  },
  storeInitialBubble: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  storeInitialText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  storeMeta: { flex: 1 },
  storeName: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  storeAddress: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 4 },
  storeFooter: { flexDirection: "row", alignItems: "center", gap: 10 },
  distancePill: { flexDirection: "row", alignItems: "center", gap: 3 },
  distanceText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  phoneText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  checkBubble: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  selectBubble: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center", borderWidth: 1, flexShrink: 0,
  },
});
