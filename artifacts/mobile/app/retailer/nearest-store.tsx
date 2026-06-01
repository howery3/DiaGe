import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe, type WishlistItem } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";
import { capture } from "@/utils/posthog";

const PRIMARY = "#5B21B6";
const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  detailsLoaded?: boolean;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearestStoreScreen() {
  const { name: encodedName } = useLocalSearchParams<{ name: string }>();
  const retailerName = decodeURIComponent(encodedName ?? "");
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { wishlistItems } = useDiGe();
  const { profile, hasProfile } = useProfile();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noApiKey, setNoApiKey] = useState(false);
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

  const [zipInput, setZipInput] = useState("");
  const [zipResults, setZipResults] = useState<PlaceResult[] | null>(null);
  const [zipLoading, setZipLoading] = useState(false);
  const zipRef = useRef<TextInput>(null);

  const wishlist = wishlistItems.filter(
    (w: WishlistItem) => w.retailer.trim() === retailerName
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError(
          "Location permission is required to find nearby stores."
        );
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude: lat, longitude: lng } = loc.coords;
      setUserLocation({ lat, lng });

      const res = await fetch(
        `${API_BASE}/places/nearby?query=${encodeURIComponent(retailerName)}&lat=${lat}&lng=${lng}`
      );
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503) {
          setNoApiKey(true);
        } else {
          setError(data.error ?? "Could not find nearby stores.");
        }
        return;
      }

      setPlaces(data.places ?? []);
    } catch {
      setError("Could not get your location. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [retailerName]);

  useEffect(() => {
    load();
  }, [load]);

  const searchByZip = useCallback(async (zip: string) => {
    if (zip.length < 3) { setZipResults(null); return; }
    setZipLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/stores?q=${encodeURIComponent(zip)}&retailer=${encodeURIComponent(retailerName)}`
      );
      const data: { id: string; name: string; address: string; phone: string; distanceMi: number }[] = await res.json();
      setZipResults(
        data.map((s) => ({
          placeId: s.id,
          name: s.name,
          address: s.address,
          phone: s.phone,
          lat: 0,
          lng: 0,
          detailsLoaded: true,
        }))
      );
    } catch {
      setZipResults([]);
    } finally {
      setZipLoading(false);
    }
  }, [retailerName]);

  async function loadDetails(place: PlaceResult) {
    if (place.detailsLoaded) return;
    setLoadingDetails(place.placeId);
    try {
      const res = await fetch(
        `${API_BASE}/places/details/${place.placeId}`
      );
      if (res.ok) {
        const d = await res.json();
        setPlaces((prev) =>
          prev.map((p) =>
            p.placeId === place.placeId
              ? { ...p, phone: d.phone, website: d.website, detailsLoaded: true }
              : p
          )
        );
      }
    } finally {
      setLoadingDetails(null);
    }
  }

  function buildWishlistMessage(): string {
    const date = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const lines = [
      `💍 My ${retailerName} Wishlist`,
      `Sent via DiaGe — ${date}`,
      "─".repeat(28),
      "",
    ];
    wishlist.forEach((item: WishlistItem, i: number) => {
      lines.push(`${i + 1}. ${item.name}`);
      const meta = [item.brand, item.type].filter(Boolean);
      if (meta.length) lines.push(`   ${meta.join(" · ")}`);
      if (item.estimatedPrice) lines.push(`   $${item.estimatedPrice}`);
      if (item.notes) lines.push(`   ${item.notes}`);
    });
    if (hasProfile) {
      lines.push("", "─".repeat(28));
      if (profile.name) lines.push(`From: ${profile.name}`);
      if (profile.phone) lines.push(`📞 ${profile.phone}`);
      if (profile.email) lines.push(`📧 ${profile.email}`);
    }
    lines.push("", "Shared via DiaGe 💎");
    return lines.join("\n");
  }

  async function doSendWishlist(place: PlaceResult) {
    const body = buildWishlistMessage();
    const subject = encodeURIComponent(`My ${retailerName} Wishlist — DiaGe`);
    const mailto = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
    capture("wishlist_sent_to_store", {
      retailer: retailerName,
      store_name: place.name,
      item_count: wishlist.length,
      has_contact_info: !!(profile.name && (profile.phone || profile.email)),
    });
    const canOpen = await Linking.canOpenURL(mailto);
    if (canOpen) {
      await Linking.openURL(mailto);
    } else {
      await Share.share({ message: body, title: `My ${retailerName} Wishlist` });
    }
  }

  async function handleEmailWishlist(place: PlaceResult) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isIncomplete = !profile.name || (!profile.phone && !profile.email);
    if (isIncomplete) {
      Alert.alert(
        "Add Your Contact Info?",
        "The store won't know how to reach you. Add your name and phone or email so they can follow up.",
        [
          {
            text: "Complete Profile",
            onPress: () => {
              router.push("/(tabs)/profile");
            },
          },
          {
            text: "Send Anyway",
            style: "destructive",
            onPress: () => doSendWishlist(place),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }
    await doSendWishlist(place);
  }

  async function handleCall(phone: string) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone.replace(/\D/g, "")}`);
  }

  async function handleDirections(place: PlaceResult) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const query = encodeURIComponent(place.address);
    Linking.openURL(`maps://?q=${query}`);
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Find Nearest Store",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />

      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Zip code search ── */}
        <View style={[styles.zipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.zipRow}>
            <Feather name="map-pin" size={15} color={PRIMARY} style={{ marginTop: 1 }} />
            <TextInput
              ref={zipRef}
              style={[styles.zipInput, { color: colors.foreground }]}
              placeholder="Search by zip code or city"
              placeholderTextColor={colors.mutedForeground}
              value={zipInput}
              onChangeText={(v) => {
                setZipInput(v);
                searchByZip(v);
              }}
              keyboardType="default"
              returnKeyType="search"
              onSubmitEditing={() => searchByZip(zipInput)}
              autoCorrect={false}
            />
            {zipLoading ? (
              <ActivityIndicator size="small" color={PRIMARY} />
            ) : zipInput.length > 0 ? (
              <Pressable onPress={() => { setZipInput(""); setZipResults(null); }} hitSlop={8}>
                <Feather name="x" size={15} color={colors.mutedForeground} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* ── Zip results ── */}
        {zipResults !== null ? (
          zipResults.length === 0 ? (
            <View style={[styles.stateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="map-pin" size={28} color={colors.mutedForeground} />
              <Text style={[styles.stateTitle, { color: colors.foreground }]}>No locations found</Text>
              <Text style={[styles.stateBody, { color: colors.mutedForeground }]}>
                No {retailerName} locations match "{zipInput}". Try a nearby city or different zip.
              </Text>
            </View>
          ) : (
            zipResults.map((place, index) => (
              <PlaceCard
                key={place.placeId}
                place={place}
                index={index}
                userLocation={null}
                loadingDetails={loadingDetails}
                wishlist={wishlist}
                colors={colors}
                onLoadDetails={() => loadDetails(place)}
                onCall={handleCall}
                onDirections={handleDirections}
                onEmailWishlist={handleEmailWishlist}
              />
            ))
          )
        ) : loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
              Finding {retailerName} locations near you...
            </Text>
          </View>
        ) : (noApiKey || error) ? (
          <View style={[styles.stateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="search" size={32} color={PRIMARY} />
            <Text style={[styles.stateTitle, { color: colors.foreground }]}>
              Search by zip or city above
            </Text>
            <Text style={[styles.stateBody, { color: colors.mutedForeground }]}>
              Type your zip code or city name to find nearby {retailerName} locations.
            </Text>
          </View>
        ) : places.length === 0 ? (
          <View
            style={[
              styles.stateCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name="map-pin" size={32} color={colors.mutedForeground} />
            <Text style={[styles.stateTitle, { color: colors.foreground }]}>
              No locations found
            </Text>
            <Text
              style={[styles.stateBody, { color: colors.mutedForeground }]}
            >
              No {retailerName} locations found within 30 miles. You can still
              share your wishlist directly.
            </Text>
          </View>
        ) : (
          places.map((place, index) => (
            <PlaceCard
              key={place.placeId}
              place={place}
              index={index}
              userLocation={userLocation}
              loadingDetails={loadingDetails}
              wishlist={wishlist}
              colors={colors}
              onLoadDetails={() => loadDetails(place)}
              onCall={handleCall}
              onDirections={handleDirections}
              onEmailWishlist={handleEmailWishlist}
            />
          ))
        )}

        {wishlist.length > 0 && !loading ? (
          <View
            style={[styles.wishlistNote, { backgroundColor: colors.muted }]}
          >
            <Feather name="heart" size={14} color={PRIMARY} />
            <Text
              style={[
                styles.wishlistNoteText,
                { color: colors.mutedForeground },
              ]}
            >
              {wishlist.length} item
              {wishlist.length !== 1 ? "s" : ""} in your {retailerName}{" "}
              wishlist will be included when you email a store.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}

function PlaceCard({
  place, index, userLocation, loadingDetails, wishlist, colors,
  onLoadDetails, onCall, onDirections, onEmailWishlist,
}: {
  place: PlaceResult;
  index: number;
  userLocation: { lat: number; lng: number } | null;
  loadingDetails: string | null;
  wishlist: WishlistItem[];
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  onLoadDetails: () => void;
  onCall: (phone: string) => void;
  onDirections: (place: PlaceResult) => void;
  onEmailWishlist: (place: PlaceResult) => void;
}) {
  const distance =
    userLocation !== null && place.lat !== 0 && place.lng !== 0
      ? haversineDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)
      : null;

  return (
    <View style={[styles.placeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.placeHeader}>
        <View style={[styles.placeIndex, { backgroundColor: index === 0 ? PRIMARY : colors.muted }]}>
          <Text style={[styles.placeIndexText, { color: index === 0 ? "#fff" : colors.mutedForeground }]}>
            {index + 1}
          </Text>
        </View>
        <View style={styles.placeInfo}>
          <Text style={[styles.placeName, { color: colors.foreground }]}>{place.name}</Text>
          <Text style={[styles.placeAddress, { color: colors.mutedForeground }]}>{place.address}</Text>
          <View style={styles.placeMeta}>
            {distance !== null && (
              <Text style={[styles.placeDistance, { color: colors.primary }]}>
                {distance < 0.2 ? `${(distance * 5280).toFixed(0)} ft away` : `${distance.toFixed(1)} mi away`}
              </Text>
            )}
            {place.rating ? (
              <Text style={[styles.placeRating, { color: colors.mutedForeground }]}>⭐ {place.rating}</Text>
            ) : null}
          </View>
        </View>
      </View>

      {!place.detailsLoaded && loadingDetails !== place.placeId ? (
        <Pressable onPress={onLoadDetails} style={styles.loadDetailsBtn}>
          <Text style={[styles.loadDetailsText, { color: colors.primary }]}>Load phone & contact details</Text>
        </Pressable>
      ) : loadingDetails === place.placeId ? (
        <ActivityIndicator size="small" color={PRIMARY} style={{ marginTop: 8 }} />
      ) : null}

      <View style={styles.placeActions}>
        {place.phone ? (
          <Pressable onPress={() => onCall(place.phone!)} style={[styles.actionBtn, { backgroundColor: "#EDE8FA" }]}>
            <Feather name="phone" size={15} color={PRIMARY} />
            <Text style={[styles.actionBtnText, { color: PRIMARY }]}>Call</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={() => onDirections(place)} style={[styles.actionBtn, { backgroundColor: colors.muted }]}>
          <Feather name="navigation" size={15} color={colors.mutedForeground} />
          <Text style={[styles.actionBtnText, { color: colors.mutedForeground }]}>Directions</Text>
        </Pressable>
        {wishlist.length > 0 && (
          <Pressable onPress={() => onEmailWishlist(place)} style={[styles.actionBtn, { backgroundColor: PRIMARY, flex: 1 }]}>
            <Feather name="mail" size={15} color="#fff" />
            <Text style={[styles.actionBtnText, { color: "#fff" }]}>
              {wishlist.length === 1 ? "Send Wishlist" : `Send ${wishlist.length} Items`}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    gap: 16,
  },
  center: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  stateCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
  },
  stateTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  stateBody: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  retryText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  placeCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
  },
  placeHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  placeIndex: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  placeIndexText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  placeInfo: {
    flex: 1,
    gap: 3,
  },
  placeName: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  placeAddress: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  placeMeta: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 2,
  },
  placeDistance: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  placeRating: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  loadDetailsBtn: {
    paddingVertical: 4,
  },
  loadDetailsText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  placeActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  wishlistNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    padding: 14,
  },
  wishlistNoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  zipCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  zipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  zipInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
