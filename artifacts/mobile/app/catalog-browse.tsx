import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PARTNER_CATALOGS, type CatalogItem, type PartnerCatalog } from "@/data/partnerCatalogs";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

export default function CatalogBrowseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<string | null>(PARTNER_CATALOGS[0].id);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Shop Partner Catalogs",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
          headerRight: undefined,
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.banner, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "25" }]}>
          <Feather name="zap" size={15} color={colors.primary} />
          <Text style={[styles.bannerText, { color: colors.primary }]}>
            Tap any item to add it to your wishlist instantly
          </Text>
        </View>

        {PARTNER_CATALOGS.map((catalog) => (
          <CatalogSection
            key={catalog.id}
            catalog={catalog}
            expanded={expanded === catalog.id}
            onToggle={() => setExpanded((v) => (v === catalog.id ? null : catalog.id))}
            colors={colors}
          />
        ))}

        <View style={[styles.footer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="briefcase" size={16} color={colors.primary} />
          <View style={styles.footerText}>
            <Text style={[styles.footerTitle, { color: colors.foreground }]}>Are you a retailer?</Text>
            <Text style={[styles.footerSub, { color: colors.mutedForeground }]}>
              List your catalog in DiaGe and connect with your customers directly.
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/partner-inquiry")}
            style={[styles.footerBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.footerBtnText}>Join</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

function CatalogSection({
  catalog,
  expanded,
  onToggle,
  colors,
}: {
  catalog: PartnerCatalog;
  expanded: boolean;
  onToggle: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.catalogCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable onPress={onToggle} style={styles.catalogHeader}>
        <View style={[styles.catalogIconWrap, { backgroundColor: catalog.accentLight }]}>
          <Feather name="shopping-bag" size={20} color={catalog.accentColor} />
        </View>
        <View style={styles.catalogTitles}>
          <Text style={[styles.catalogName, { color: colors.foreground }]}>{catalog.retailerName}</Text>
          <Text style={[styles.catalogTagline, { color: colors.mutedForeground }]}>{catalog.tagline}</Text>
        </View>
        <View style={styles.catalogMeta}>
          <Text style={[styles.catalogCount, { color: colors.mutedForeground }]}>
            {catalog.items.length} items
          </Text>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.mutedForeground}
          />
        </View>
      </Pressable>

      {expanded && (
        <View style={[styles.itemsList, { borderTopColor: colors.border }]}>
          {/* Live website browse button */}
          <Pressable
            onPress={() =>
              router.push(
                `/retailer-browser?url=${encodeURIComponent(catalog.catalogUrl)}&retailer=${encodeURIComponent(catalog.retailerName)}`
              )
            }
            style={[styles.browseWebBtn, { backgroundColor: catalog.accentLight, borderColor: catalog.accentColor + "40" }]}
          >
            <View style={[styles.browseWebIcon, { backgroundColor: catalog.accentColor }]}>
              <Feather name="globe" size={14} color="#fff" />
            </View>
            <View style={styles.browseWebText}>
              <Text style={[styles.browseWebTitle, { color: catalog.accentColor }]}>Browse {catalog.retailerName} Website</Text>
              <Text style={[styles.browseWebSub, { color: catalog.accentColor + "99" }]}>Shop live and save any item to your DiaGe wishlist</Text>
            </View>
            <Feather name="arrow-right" size={15} color={catalog.accentColor} />
          </Pressable>

          {catalog.items.map((item, idx) => (
            <CatalogItemRow
              key={item.id}
              item={item}
              catalog={catalog}
              colors={colors}
              last={idx === catalog.items.length - 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function CatalogItemRow({
  item,
  catalog,
  colors,
  last,
}: {
  item: CatalogItem;
  catalog: PartnerCatalog;
  colors: ReturnType<typeof useColors>;
  last: boolean;
}) {
  const { addWishlistItem, wishlistItems } = useDiGe();
  const alreadyAdded = wishlistItems.some(
    (w) => w.notes?.includes(item.sku)
  );

  function handleAdd() {
    if (alreadyAdded) {
      Alert.alert("Already in Wishlist", `${item.name} is already in your wishlist.`);
      return;
    }
    addWishlistItem({
      name: item.name,
      sku: item.sku,
      type: item.type,
      brand: catalog.retailerName,
      retailer: catalog.retailerName,
      retailerUrl: catalog.catalogUrl,
      estimatedPrice: item.price,
      notes: item.description,
      priority: "medium",
    });
    Alert.alert("Added to Wishlist!", `${item.name} has been saved to your wishlist.`);
  }

  return (
    <View
      style={[
        styles.itemRow,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}
    >
      <View style={[styles.itemTypeIcon, { backgroundColor: catalog.accentLight }]}>
        <Feather name={typeIcon(item.type)} size={14} color={catalog.accentColor} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.itemMaterial, { color: colors.mutedForeground }]} numberOfLines={1}>
          {item.material}
        </Text>
        <View style={styles.itemTags}>
          {item.tags.slice(0, 2).map((t) => (
            <View key={t} style={[styles.tag, { backgroundColor: colors.muted }]}>
              <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.itemPrice, { color: colors.foreground }]}>
          ${parseInt(item.price).toLocaleString()}
        </Text>
        <Pressable
          onPress={handleAdd}
          style={[
            styles.addBtn,
            {
              backgroundColor: alreadyAdded ? colors.muted : catalog.accentColor,
            },
          ]}
        >
          <Feather
            name={alreadyAdded ? "check" : "heart"}
            size={12}
            color={alreadyAdded ? colors.mutedForeground : "#fff"}
          />
          <Text
            style={[
              styles.addBtnText,
              { color: alreadyAdded ? colors.mutedForeground : "#fff" },
            ]}
          >
            {alreadyAdded ? "Saved" : "Wishlist"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function typeIcon(type: string): "circle" | "link" | "square" | "minus" | "watch" | "box" {
  switch (type) {
    case "ring": return "circle";
    case "necklace": return "link";
    case "bracelet": return "minus";
    case "earrings": return "square";
    case "watch": return "watch";
    default: return "box";
  }
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 12 },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  bannerText: { flex: 1, fontSize: 13, fontFamily: "Inter_600SemiBold" },

  catalogCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  catalogHeader: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  catalogIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  catalogTitles: { flex: 1, gap: 2 },
  catalogName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  catalogTagline: { fontSize: 11, fontFamily: "Inter_400Regular" },
  catalogMeta: { alignItems: "flex-end", gap: 4 },
  catalogCount: { fontSize: 11, fontFamily: "Inter_400Regular" },

  itemsList: { borderTopWidth: StyleSheet.hairlineWidth },
  browseWebBtn: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, margin: 10, marginBottom: 4, borderRadius: 12, borderWidth: 1 },
  browseWebIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  browseWebText: { flex: 1, gap: 2 },
  browseWebTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  browseWebSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  itemTypeIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  itemInfo: { flex: 1, gap: 3 },
  itemName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  itemMaterial: { fontSize: 11, fontFamily: "Inter_400Regular" },
  itemTags: { flexDirection: "row", gap: 4, marginTop: 2 },
  tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  tagText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  itemRight: { alignItems: "flex-end", gap: 6 },
  itemPrice: { fontSize: 14, fontFamily: "Inter_700Bold" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  addBtnText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  footer: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 4 },
  footerText: { flex: 1, gap: 2 },
  footerTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  footerSub: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 15 },
  footerBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  footerBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
