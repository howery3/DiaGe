import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const PRIMARY = "#5B21B6";

export default function RetailerQRScreen() {
  const { name: encodedName } = useLocalSearchParams<{ name: string }>();
  const retailerName = decodeURIComponent(encodedName ?? "");
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const deepLink = `diage://retailer/${encodedName}?tab=wishlist`;

  async function handleShare() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Share.share({
      message: `Scan this QR code to open your ${retailerName} wishlist in DiaGe!\n\n${deepLink}`,
      title: `${retailerName} — DiaGe QR Code`,
    });
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "In-Store QR Code",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.root,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.iconWrap}>
            <Feather name="grid" size={24} color={PRIMARY} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Print this QR for your store
          </Text>
          <Text style={[styles.cardBody, { color: colors.mutedForeground }]}>
            Customers scan it to instantly open their{" "}
            <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}>
              {retailerName}
            </Text>{" "}
            wishlist in DiaGe — no typing required.
          </Text>
        </View>

        <View style={styles.qrWrap}>
          <QRCode
            value={deepLink}
            size={220}
            color="#1A0F2E"
            backgroundColor="#ffffff"
          />
          <View style={styles.qrLabel}>
            <Text style={styles.qrRetailer}>{retailerName}</Text>
            <Text style={styles.qrSub}>Scan to open wishlist in DiaGe</Text>
          </View>
        </View>

        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            styles.shareBtn,
            { backgroundColor: PRIMARY, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="share-2" size={18} color="#fff" />
          <Text style={styles.shareBtnText}>Share / Save QR Code</Text>
        </Pressable>

        <View style={[styles.tipsCard, { backgroundColor: colors.muted }]}>
          <Text style={[styles.tipsTitle, { color: colors.foreground }]}>
            Display ideas
          </Text>
          {[
            "Counter card next to your register",
            "On the jewelry case with double-sided tape",
            "Inside packaging with purchases",
            "In your digital newsletter or Instagram bio",
          ].map((tip) => (
            <View key={tip} style={styles.tipRow}>
              <Feather name="check-circle" size={14} color={PRIMARY} />
              <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
                {tip}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 20,
    gap: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EDE8FA",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  cardBody: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  qrWrap: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 14,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  qrLabel: {
    alignItems: "center",
    gap: 2,
  },
  qrRetailer: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#1A0F2E",
  },
  qrSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#7C6D9A",
  },
  shareBtn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  shareBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  tipsCard: {
    width: "100%",
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
