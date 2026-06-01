import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";
import { useColors } from "@/hooks/useColors";
import { usePreferredStore, type PreferredStore } from "@/hooks/usePreferredStore";
import { useProfile } from "@/hooks/useProfile";

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

const BANNER_TAGLINE: Record<string, string> = {
  "Kay Jewelers": "Every kiss begins with Kay",
  "Jared": "He went to Jared",
  "Zales": "The diamond store",
  "Banter by Piercing Pagoda": "Fine piercing & jewelry",
};

function storeInitial(banner: string) {
  if (banner.startsWith("Kay")) return "K";
  if (banner.startsWith("Jared")) return "J";
  if (banner.startsWith("Zales")) return "Z";
  return "B";
}

function AccordionSection({
  banner,
  stores,
  isExpanded,
  onToggle,
  isSelected,
  saving,
  onSelect,
  colors,
}: {
  banner: string;
  stores: PreferredStore[];
  isExpanded: boolean;
  onToggle: () => void;
  isSelected: (s: PreferredStore) => boolean;
  saving: string | null;
  onSelect: (s: PreferredStore) => void;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  const bc = BANNER_COLOR[banner] ?? "#5B21B6";
  const initial = storeInitial(banner);
  const linkedCount = stores.filter(isSelected).length;
  const chevronAnim = React.useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(chevronAnim, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: true,
      damping: 18,
      stiffness: 220,
    }).start();
  }, [isExpanded]);

  const chevronRotate = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={[styles.section, { borderColor: isExpanded ? `${bc}40` : colors.border }]}>
      {/* Banner header row — always visible */}
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          styles.bannerRow,
          {
            backgroundColor: isExpanded ? `${bc}0A` : colors.card,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={[styles.bannerInitial, { backgroundColor: `${bc}18` }]}>
          <Text style={[styles.bannerInitialText, { color: bc }]}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.bannerName, { color: colors.foreground }]}>{banner}</Text>
          <Text style={[styles.bannerTagline, { color: colors.mutedForeground }]}>
            {BANNER_TAGLINE[banner] ?? ""} · {stores.length} location{stores.length !== 1 ? "s" : ""}
          </Text>
        </View>
        {linkedCount > 0 ? (
          <View style={[styles.linkedBadge, { backgroundColor: bc }]}>
            <Feather name="check" size={10} color="#fff" />
            <Text style={styles.linkedBadgeText}>Linked</Text>
          </View>
        ) : null}
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Feather name="chevron-right" size={18} color={isExpanded ? bc : colors.mutedForeground} />
        </Animated.View>
      </Pressable>

      {/* Store list — only shown when expanded */}
      {isExpanded ? (
        <View style={[styles.storeList, { borderTopColor: `${bc}20` }]}>
          {stores.map((store) => {
            const sel = isSelected(store);
            const isSaving = saving === store.id;
            return (
              <Pressable
                key={store.id}
                onPress={() => onSelect(store)}
                style={({ pressed }) => [
                  styles.storeCard,
                  {
                    backgroundColor: sel ? `${bc}10` : colors.background,
                    borderColor: sel ? bc : colors.border,
                    opacity: pressed ? 0.88 : 1,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>
                    {store.name}
                  </Text>
                  <Text style={[styles.storeAddress, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {store.address}
                  </Text>
                  <View style={styles.storeFooter}>
                    <Feather name="navigation" size={9} color={colors.mutedForeground} />
                    <Text style={[styles.distanceText, { color: colors.mutedForeground }]}>
                      {store.distanceMi} mi away
                    </Text>
                  </View>
                </View>
                {isSaving ? (
                  <ActivityIndicator size="small" color={bc} />
                ) : sel ? (
                  <View style={[styles.checkBubble, { backgroundColor: bc }]}>
                    <Feather name="check" size={13} color="#fff" />
                  </View>
                ) : (
                  <View style={[styles.selectBubble, { borderColor: colors.border }]}>
                    <Feather name="plus" size={14} color={colors.mutedForeground} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export default function StorePickerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { retailer: retailerParam } = useLocalSearchParams<{ retailer?: string }>();
  const { stores, getStore, saveStore } = usePreferredStore();
  const { getToken } = useAuth();
  const { profile } = useProfile();

  const [allStores, setAllStores] = useState<PreferredStore[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Default: expand the retailerParam banner if set, otherwise expand all
  const [expandedBanners, setExpandedBanners] = useState<Set<string>>(
    () => new Set(retailerParam ? [retailerParam] : BANNER_ORDER)
  );

  useEffect(() => {
    async function loadStores() {
      let locSuffix = "";
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          locSuffix = `&lat=${loc.coords.latitude}&lng=${loc.coords.longitude}`;
        }
      } catch { /* location optional */ }

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

  const filtered = useMemo(() => {
    if (!query) return allStores;
    const q = query.toLowerCase();
    return allStores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.banner.toLowerCase().includes(q)
    );
  }, [allStores, query]);

  const grouped = useMemo(() =>
    BANNER_ORDER
      .map((banner) => ({ banner, stores: filtered.filter((s) => s.banner === banner) }))
      .filter((g) => g.stores.length > 0),
    [filtered]
  );

  // Expand all sections when searching so results are always visible
  useEffect(() => {
    if (query) {
      setExpandedBanners(new Set(BANNER_ORDER));
    }
  }, [query]);

  const saveKey = retailerParam ?? null;

  function isSelected(store: PreferredStore) {
    const key = saveKey ?? store.banner;
    return getStore(key)?.id === store.id;
  }

  function toggleBanner(banner: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedBanners((prev) => {
      const next = new Set(prev);
      if (next.has(banner)) {
        next.delete(banner);
      } else {
        next.add(banner);
      }
      return next;
    });
  }

  async function handleSelect(store: PreferredStore) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(store.id);
    const key = saveKey ?? store.banner;
    await saveStore(key, store);

    getToken().then((token) => {
      fetch(`${API_BASE}/store-share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          storeId: store.id,
          type: "customer_linked",
          data: {
            userName: profile.name || "DiaGe Customer",
            userEmail: profile.email || "",
            userPhone: profile.phone || "",
            ringSize: profile.ringSize || "",
            budgetRange: profile.budgetRange || "",
            retailer: key,
            linkedAt: new Date().toISOString(),
          },
        }),
      }).catch(() => {});
    }).catch(() => {});

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(null);
    router.back();
  }

  const topPad = Platform.OS === "web" ? 20 : insets.top + 16;

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.foreground }]}>Find Your Store</Text>
            <Text style={[styles.sub, { color: colors.mutedForeground }]}>
              Tap a retailer to expand, then select your location
            </Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search by store name or city"
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
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading nearby stores…
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          {grouped.map((group) => (
            <AccordionSection
              key={group.banner}
              banner={group.banner}
              stores={group.stores}
              isExpanded={expandedBanners.has(group.banner)}
              onToggle={() => toggleBanner(group.banner)}
              isSelected={isSelected}
              saving={saving}
              onSelect={handleSelect}
              colors={colors}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  backBtn: { marginTop: 2 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  sub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 3, lineHeight: 18 },
  searchWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginHorizontal: 16, marginBottom: 12,
    paddingHorizontal: 14, paddingVertical: 11,
    borderRadius: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  loadingText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  list: { paddingHorizontal: 16, paddingTop: 4, gap: 10 },

  section: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  bannerInitial: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bannerInitialText: { fontSize: 17, fontFamily: "Inter_700Bold" },
  bannerName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  bannerTagline: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  linkedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  linkedBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#fff" },

  storeList: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 8,
  },
  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  storeName: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  storeAddress: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 3 },
  storeFooter: { flexDirection: "row", alignItems: "center", gap: 4 },
  distanceText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  checkBubble: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  selectBubble: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, flexShrink: 0,
  },
});
