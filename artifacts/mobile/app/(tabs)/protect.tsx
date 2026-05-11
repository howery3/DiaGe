import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

const INSURANCE_PARTNERS = [
  {
    id: "jewelers-mutual",
    name: "Jewelers Mutual",
    tagline: "The jewelry insurance specialists",
    description:
      "Over 110 years protecting jewelry. Covers loss, theft, mysterious disappearance, and damage with no deductible options.",
    specialty: "Standalone Jewelry Policy",
    coverageTypes: ["Loss", "Theft", "Damage", "Disappearance"],
    url: "https://www.jewelersmutual.com",
    quoteUrl: "https://www.jewelersmutual.com/jewelry-insurance/get-a-quote",
    highlight: "No deductible options",
  },
  {
    id: "briteco",
    name: "BriteCo",
    tagline: "Modern jewelry insurance",
    description:
      "Appraisal-based coverage up to 125% of appraised value. Instant online quotes, no inspection required for most pieces.",
    specialty: "Appraisal-Based Coverage",
    coverageTypes: ["Loss", "Theft", "Damage", "Mysterious Disappearance"],
    url: "https://brite.co",
    quoteUrl: "https://brite.co/get-a-quote",
    highlight: "Up to 125% of appraised value",
  },
  {
    id: "lavalier",
    name: "Lavalier",
    tagline: "Online jewelry insurance made simple",
    description:
      "Flexible monthly or annual plans. Coverage worldwide with no appraisal required under $5,000.",
    specialty: "Flexible Coverage Plans",
    coverageTypes: ["Loss", "Theft", "Accidental Damage", "Travel"],
    url: "https://www.lavalier.com",
    quoteUrl: "https://www.lavalier.com/jewelry-insurance-quote",
    highlight: "Worldwide coverage",
  },
  {
    id: "chubb",
    name: "Chubb Personal Risk",
    tagline: "High-value jewelry and collections",
    description:
      "Premium coverage for high-value collections. Agreed value settlement with no depreciation — ideal for estate and heirloom pieces.",
    specialty: "High-Value Collections",
    coverageTypes: ["Agreed Value", "Estate Pieces", "Collections", "Travel"],
    url: "https://www.chubb.com/us-en/individuals-families/products/valuable-articles.html",
    quoteUrl: "https://www.chubb.com/us-en/individuals-families/products/valuable-articles.html",
    highlight: "Agreed value — no depreciation",
  },
];

const RETAILER_BENEFITS = [
  {
    icon: "bell",
    title: "Automated Inspection Reminders",
    desc: "Your customers get co-branded reminders to return for inspections, driving repeat foot traffic automatically.",
  },
  {
    icon: "shield",
    title: "Digital Warranty Management",
    desc: "Customers store and track your warranty plans in DiGe, reducing support calls and improving satisfaction.",
  },
  {
    icon: "heart",
    title: "Wishlist Integration",
    desc: "Shoppers build wishlists tied directly to your store. Share and convert wishlists into sales events.",
  },
  {
    icon: "file-text",
    title: "Insurance Report Support",
    desc: "Customers can generate insurer-ready reports from their vault — featuring your store prominently.",
  },
];

export default function ProtectScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces } = useDiGe();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const totalValue = useMemo(() => {
    return pieces.reduce((sum, p) => {
      const n = parseFloat(p.purchasePrice.replace(/[^0-9.]/g, ""));
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
  }, [pieces]);

  async function pressQuote() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/insurance-quote");
  }

  async function pressPartner() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/partner-inquiry");
  }

  async function openUrl(url: string) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.background }]}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Protect</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Insurance & partner services
          </Text>
        </View>

        {/* Portfolio snapshot */}
        <View style={[styles.snapshotCard, { backgroundColor: "#5B21B6" }]}>
          <View style={styles.snapshotTop}>
            <View>
              <Text style={styles.snapshotLabel}>Your Jewelry Vault</Text>
              <Text style={styles.snapshotValue}>
                {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
              </Text>
            </View>
            {totalValue > 0 ? (
              <View style={styles.snapshotRight}>
                <Text style={styles.snapshotLabel}>Est. Total Value</Text>
                <Text style={styles.snapshotValue}>
                  ${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </Text>
              </View>
            ) : null}
          </View>

          <Pressable
            onPress={pressQuote}
            style={({ pressed }) => [styles.quoteCta, { opacity: pressed ? 0.85 : 1 }]}
          >
            <View style={styles.quoteCtaInner}>
              <Feather name="shield" size={18} color="#5B21B6" />
              <Text style={styles.quoteCtaText}>
                {pieces.length > 0
                  ? "Request Insurance Quotes"
                  : "Learn About Coverage"}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color="#5B21B6" />
          </Pressable>

          {pieces.length > 0 ? (
            <Text style={styles.snapshotHint}>
              Your vault data pre-fills the quote form — one tap sends to multiple insurers
            </Text>
          ) : (
            <Text style={styles.snapshotHint}>
              Add jewelry pieces to your vault to get personalized quotes
            </Text>
          )}
        </View>

        {/* Insurance Partners */}
        <SectionHeader
          title="Insurance Partners"
          subtitle="Trusted providers for jewelry coverage"
          colors={colors}
        />

        {INSURANCE_PARTNERS.map((partner) => (
          <View
            key={partner.id}
            style={[styles.partnerCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.partnerCardHeader}>
              <View style={[styles.partnerIconWrap, { backgroundColor: colors.primary + "15" }]}>
                <Feather name="shield" size={20} color={colors.primary} />
              </View>
              <View style={styles.partnerCardTitles}>
                <Text style={[styles.partnerName, { color: colors.foreground }]}>{partner.name}</Text>
                <Text style={[styles.partnerTagline, { color: colors.mutedForeground }]}>{partner.tagline}</Text>
              </View>
            </View>

            <View style={[styles.highlightBadge, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "25" }]}>
              <Feather name="star" size={11} color={colors.primary} />
              <Text style={[styles.highlightText, { color: colors.primary }]}>{partner.highlight}</Text>
            </View>

            <Text style={[styles.partnerDesc, { color: colors.mutedForeground }]}>{partner.description}</Text>

            <View style={styles.coverageChips}>
              {partner.coverageTypes.map((c) => (
                <View key={c} style={[styles.coverageChip, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.coverageChipText, { color: colors.mutedForeground }]}>{c}</Text>
                </View>
              ))}
            </View>

            <View style={styles.partnerActions}>
              <Pressable
                onPress={() => openUrl(partner.quoteUrl)}
                style={[styles.partnerBtnPrimary, { backgroundColor: colors.primary }]}
              >
                <Feather name="shield" size={14} color="#fff" />
                <Text style={styles.partnerBtnPrimaryText}>Get a Quote</Text>
              </Pressable>
              <Pressable
                onPress={() => openUrl(partner.url)}
                style={[styles.partnerBtnSecondary, { borderColor: colors.border, backgroundColor: colors.background }]}
              >
                <Feather name="external-link" size={14} color={colors.mutedForeground} />
                <Text style={[styles.partnerBtnSecondaryText, { color: colors.mutedForeground }]}>Learn More</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={pressQuote}
              style={[styles.oneClickRow, { borderTopColor: colors.border }]}
            >
              <Feather name="zap" size={13} color={colors.primary} />
              <Text style={[styles.oneClickText, { color: colors.primary }]}>
                One-click quote using your DiGe vault data
              </Text>
              <Feather name="chevron-right" size={13} color={colors.primary} />
            </Pressable>
          </View>
        ))}

        {/* For Businesses — collapsible */}
        <ForBusinessesSection
          colors={colors}
          onRetailerInquiry={pressPartner}
          onInsuranceInquiry={pressPartner}
        />
      </ScrollView>
    </View>
  );
}

function ForBusinessesSection({
  colors,
  onRetailerInquiry,
  onInsuranceInquiry,
}: {
  colors: ReturnType<typeof useColors>;
  onRetailerInquiry: () => void;
  onInsuranceInquiry: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.bizCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.bizHeader}>
        <View style={[styles.bizIconWrap, { backgroundColor: colors.primary + "12" }]}>
          <Feather name="briefcase" size={18} color={colors.primary} />
        </View>
        <View style={styles.bizTitles}>
          <Text style={[styles.bizTitle, { color: colors.foreground }]}>For Businesses</Text>
          <Text style={[styles.bizSub, { color: colors.mutedForeground }]}>
            Retailers & insurance providers
          </Text>
        </View>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedForeground} />
      </Pressable>

      {open && (
        <View style={[styles.bizBody, { borderTopColor: colors.border }]}>
          {/* Retailers */}
          <View style={styles.bizSection}>
            <Text style={[styles.bizSectionTitle, { color: colors.foreground }]}>
              Jewelry Retailers
            </Text>
            <Text style={[styles.bizSectionBody, { color: colors.mutedForeground }]}>
              Automated inspection reminders bring customers back. Digital warranty tracking reduces support calls. Wishlist integration converts browsers into buyers — and your store is featured prominently in customers' insurance reports.
            </Text>
            <Pressable
              onPress={onRetailerInquiry}
              style={[styles.bizBtn, { borderColor: colors.primary }]}
            >
              <Feather name="shopping-bag" size={14} color={colors.primary} />
              <Text style={[styles.bizBtnText, { color: colors.primary }]}>Retailer Partnership Inquiry</Text>
            </Pressable>
          </View>

          <View style={[styles.bizDivider, { backgroundColor: colors.border }]} />

          {/* Insurance providers */}
          <View style={styles.bizSection}>
            <Text style={[styles.bizSectionTitle, { color: colors.foreground }]}>
              Insurance Providers
            </Text>
            <Text style={[styles.bizSectionBody, { color: colors.mutedForeground }]}>
              DiGe users document their collections with serial numbers, purchase prices, and appraisals — the highest-intent insurance prospects in the market. Quote requests arrive pre-loaded with structured data, dramatically reducing underwriting friction.
            </Text>
            <Pressable
              onPress={onInsuranceInquiry}
              style={[styles.bizBtn, { borderColor: colors.primary }]}
            >
              <Feather name="shield" size={14} color={colors.primary} />
              <Text style={[styles.bizBtnText, { color: colors.primary }]}>Insurance Provider Inquiry</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function SectionHeader({
  title,
  subtitle,
  colors,
}: {
  title: string;
  subtitle: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>{subtitle}</Text>
    </View>
  );
}

function StatPill({
  label,
  icon,
  colors,
}: {
  label: string;
  icon: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.statPill, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "25" }]}>
      <Feather name={icon as any} size={11} color={colors.primary} />
      <Text style={[styles.statPillText, { color: colors.primary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 14 },
  header: { paddingBottom: 4 },
  headerTitle: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },

  snapshotCard: { borderRadius: 20, padding: 20, gap: 12 },
  snapshotTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  snapshotRight: { alignItems: "flex-end" },
  snapshotLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 0.5 },
  snapshotValue: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", marginTop: 2 },
  quoteCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
  },
  quoteCtaInner: { flexDirection: "row", alignItems: "center", gap: 10 },
  quoteCtaText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#5B21B6" },
  snapshotHint: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.55)", textAlign: "center" },

  sectionHeader: { gap: 2, marginTop: 6 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  sectionSub: { fontSize: 12, fontFamily: "Inter_400Regular" },

  partnerCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  partnerCardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  partnerIconWrap: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  partnerCardTitles: { flex: 1, gap: 2 },
  partnerName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  partnerTagline: { fontSize: 12, fontFamily: "Inter_400Regular" },
  highlightBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  highlightText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  partnerDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  coverageChips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  coverageChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  coverageChipText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  partnerActions: { flexDirection: "row", gap: 8 },
  partnerBtnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    height: 42,
    borderRadius: 12,
  },
  partnerBtnPrimaryText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },
  partnerBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  partnerBtnSecondaryText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  oneClickRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 10,
    marginTop: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  oneClickText: { flex: 1, fontSize: 12, fontFamily: "Inter_600SemiBold" },

  retailCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  retailIntro: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  benefitsList: { gap: 12 },
  benefitRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  benefitIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
  benefitText: { flex: 1, gap: 2 },
  benefitTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  benefitDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  retailCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 48,
    borderRadius: 14,
  },
  retailCtaText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },

  insurerCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12, alignItems: "center" },
  insurerIconWrap: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  insurerHeadline: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center", letterSpacing: -0.3 },
  insurerBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19, textAlign: "center" },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center" },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  insurerCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 48,
    borderRadius: 14,
    alignSelf: "stretch",
    marginTop: 4,
  },
  insurerCtaText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },


  bizCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  bizHeader: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  bizIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  bizTitles: { flex: 1, gap: 2 },
  bizTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  bizSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  bizBody: { borderTopWidth: StyleSheet.hairlineWidth, padding: 16, gap: 16 },
  bizSection: { gap: 10 },
  bizSectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  bizSectionBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  bizBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  bizBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  bizDivider: { height: StyleSheet.hairlineWidth },
});
