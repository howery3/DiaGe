import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const PRIMARY = "#5B21B6";

export interface StoreContactInfo {
  bookingUrl?: string;
  phone?: string;
  email?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  retailerName: string;
  contact: StoreContactInfo;
  wishlistCount: number;
  onSendWishlist: () => void;
}

export function ContactStoreSheet({
  visible,
  onClose,
  retailerName,
  contact,
  wishlistCount,
  onSendWishlist,
}: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const hasDirectContact = !!(contact.bookingUrl || contact.phone || contact.email);

  async function openLink(url: string) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View
        style={[
          styles.sheet,
          { backgroundColor: colors.card, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <View style={[styles.sheetIcon, { backgroundColor: PRIMARY + "18" }]}>
            <Feather name="phone-call" size={18} color={PRIMARY} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
              Contact Store
            </Text>
            <Text style={[styles.sheetSub, { color: colors.mutedForeground }]}>
              {retailerName}
            </Text>
          </View>
          <Pressable onPress={onClose} hitSlop={12}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </Pressable>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.options}>
          {/* Book online — primary for enterprise retailers */}
          {contact.bookingUrl ? (
            <Pressable
              onPress={() => openLink(contact.bookingUrl!)}
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: PRIMARY, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name="calendar" size={18} color="#fff" />
              <View style={styles.btnContent}>
                <Text style={styles.primaryBtnLabel}>Book Appointment</Text>
                <Text style={styles.primaryBtnSub}>
                  Opens {retailerName}'s scheduling page
                </Text>
              </View>
              <Feather name="external-link" size={14} color="rgba(255,255,255,0.65)" />
            </Pressable>
          ) : null}

          {/* Call — shown when phone is available */}
          {contact.phone ? (
            <Pressable
              onPress={() =>
                openLink(`tel:${contact.phone!.replace(/[^0-9+]/g, "")}`)
              }
              style={({ pressed }) => [
                styles.outlineBtn,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View
                style={[styles.outlineIcon, { backgroundColor: "#15803D15" }]}
              >
                <Feather name="phone" size={16} color="#15803D" />
              </View>
              <View style={styles.btnContent}>
                <Text
                  style={[styles.outlineBtnLabel, { color: colors.foreground }]}
                >
                  Call Store
                </Text>
                <Text
                  style={[
                    styles.outlineBtnSub,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {contact.phone}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color={colors.mutedForeground}
              />
            </Pressable>
          ) : null}

          {/* Email — only when explicitly configured (small/boutique retailers) */}
          {contact.email ? (
            <Pressable
              onPress={() => openLink(`mailto:${contact.email!}`)}
              style={({ pressed }) => [
                styles.outlineBtn,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View
                style={[styles.outlineIcon, { backgroundColor: "#1D4ED815" }]}
              >
                <Feather name="mail" size={16} color="#1D4ED8" />
              </View>
              <View style={styles.btnContent}>
                <Text
                  style={[styles.outlineBtnLabel, { color: colors.foreground }]}
                >
                  Email Store
                </Text>
                <Text
                  style={[
                    styles.outlineBtnSub,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {contact.email}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color={colors.mutedForeground}
              />
            </Pressable>
          ) : null}

          {/* Universal fallback — works for every retailer */}
          <View
            style={[
              styles.universalBlock,
              {
                borderTopColor: hasDirectContact
                  ? colors.border
                  : "transparent",
                borderTopWidth: hasDirectContact
                  ? StyleSheet.hairlineWidth
                  : 0,
                marginTop: hasDirectContact ? 8 : 0,
                paddingTop: hasDirectContact ? 16 : 0,
              },
            ]}
          >
            {hasDirectContact ? (
              <Text
                style={[
                  styles.universalLabel,
                  { color: colors.mutedForeground },
                ]}
              >
                WORKS WITH ANY RETAILER
              </Text>
            ) : null}

            <Pressable
              onPress={() => {
                onSendWishlist();
                onClose();
              }}
              style={({ pressed }) => [
                styles.outlineBtn,
                {
                  borderColor: PRIMARY + "40",
                  backgroundColor: PRIMARY + "08",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View
                style={[styles.outlineIcon, { backgroundColor: PRIMARY + "18" }]}
              >
                <Feather name="send" size={16} color={PRIMARY} />
              </View>
              <View style={styles.btnContent}>
                <Text
                  style={[styles.outlineBtnLabel, { color: colors.foreground }]}
                >
                  Send My Wishlist
                </Text>
                <Text
                  style={[
                    styles.outlineBtnSub,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {wishlistCount > 0
                    ? `${wishlistCount} saved item${wishlistCount !== 1 ? "s" : ""} — share via SMS, WhatsApp, any app`
                    : "Share your wishlist via SMS, WhatsApp, or any app"}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={PRIMARY} />
            </Pressable>

            {!hasDirectContact ? (
              <Text
                style={[styles.hint, { color: colors.mutedForeground }]}
              >
                No direct booking link for this retailer. Copy your wishlist
                into their website contact form, an SMS, or WhatsApp — it works
                everywhere.
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sheetIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  sheetTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  sheetSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: 16 },

  options: { gap: 10 },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 14,
  },
  primaryBtnLabel: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  primaryBtnSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },

  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  outlineIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  outlineBtnSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },

  btnContent: { flex: 1 },

  universalBlock: { gap: 10 },
  universalLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  hint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginTop: 4,
  },
});
