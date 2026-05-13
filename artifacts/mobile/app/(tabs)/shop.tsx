import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PARTNER_CATALOGS } from "@/data/partnerCatalogs";
import { useColors } from "@/hooks/useColors";

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBlock}>
        <Text style={[styles.title, { color: colors.foreground }]}>Shop</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Browse partner retailers and save anything to your wishlist
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>PARTNER RETAILERS</Text>

      {PARTNER_CATALOGS.map((catalog) => (
        <Pressable
          key={catalog.id}
          onPress={() =>
            router.push(
              `/retailer-browser?url=${encodeURIComponent(catalog.catalogUrl)}&retailer=${encodeURIComponent(catalog.retailerName)}`
            )
          }
          style={({ pressed }) => [
            styles.retailerCard,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.88 : 1 },
          ]}
        >
          {/* Accent stripe */}
          <View style={[styles.accentStripe, { backgroundColor: catalog.accentColor }]} />

          <View style={styles.cardBody}>
            <View style={styles.cardTop}>
              <View style={[styles.retailerIcon, { backgroundColor: catalog.accentLight }]}>
                <Feather name="shopping-bag" size={22} color={catalog.accentColor} />
              </View>
              <View style={styles.retailerInfo}>
                <Text style={[styles.retailerName, { color: colors.foreground }]}>{catalog.retailerName}</Text>
                <Text style={[styles.retailerTagline, { color: colors.mutedForeground }]}>{catalog.tagline}</Text>
              </View>
              <View style={[styles.itemCountBadge, { backgroundColor: catalog.accentLight }]}>
                <Text style={[styles.itemCountText, { color: catalog.accentColor }]}>
                  {catalog.items.length} items
                </Text>
              </View>
            </View>

            <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

            <View style={styles.cardActions}>
              <View style={[styles.browseBtn, { backgroundColor: catalog.accentColor }]}>
                <Feather name="globe" size={14} color="#fff" />
                <Text style={styles.browseBtnText}>Browse Website</Text>
              </View>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  router.push("/catalog-browse");
                }}
                style={[styles.catalogBtn, { borderColor: colors.border }]}
              >
                <Feather name="grid" size={14} color={colors.mutedForeground} />
                <Text style={[styles.catalogBtnText, { color: colors.mutedForeground }]}>View Catalog</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      ))}

      {/* Partner CTA */}
      <Pressable
        onPress={() => router.push("/partner-inquiry")}
        style={[styles.partnerCard, { backgroundColor: colors.primary + "0D", borderColor: colors.primary + "30" }]}
      >
        <View style={[styles.partnerIcon, { backgroundColor: colors.primary + "18" }]}>
          <Feather name="briefcase" size={20} color={colors.primary} />
        </View>
        <View style={styles.partnerText}>
          <Text style={[styles.partnerTitle, { color: colors.foreground }]}>Are you a retailer?</Text>
          <Text style={[styles.partnerSub, { color: colors.mutedForeground }]}>
            List your store in DiaGe and connect with customers directly — no setup fee.
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.primary} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, gap: 12 },
  headerBlock: { gap: 4, marginBottom: 4 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  retailerCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  accentStripe: { height: 4, width: "100%" },
  cardBody: { padding: 16, gap: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  retailerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  retailerInfo: { flex: 1, gap: 3 },
  retailerName: { fontSize: 17, fontFamily: "Inter_700Bold" },
  retailerTagline: { fontSize: 12, fontFamily: "Inter_400Regular" },
  itemCountBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  itemCountText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  cardDivider: { height: StyleSheet.hairlineWidth },
  cardActions: { flexDirection: "row", gap: 10 },
  browseBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 11,
    borderRadius: 12,
  },
  browseBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_700Bold" },
  catalogBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  catalogBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  partnerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
  },
  partnerIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  partnerText: { flex: 1, gap: 3 },
  partnerTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  partnerSub: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
});
