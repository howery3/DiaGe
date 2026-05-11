import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type Tab = "retailer" | "insurance";

const RETAILER_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "$99",
    period: "/mo per location",
    badge: null,
    badgeColor: null,
    accentColor: "#7C3AED",
    description: "Perfect for independent jewelers and boutiques getting started with digital clientelling.",
    features: [
      "QR catalog sync — your pieces appear in DiGe",
      "Listed in the DiGe retailer directory",
      "Customers can submit one-click quote requests",
      "Basic analytics: wishlist saves & catalog views",
      "Email support",
    ],
    notIncluded: [
      "Customer contact details with shared wishlists",
      "Branded summary cards",
      "Monthly clientelling reports",
    ],
    cta: "Start with Starter",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$299",
    period: "/mo per location",
    badge: "Most Popular",
    badgeColor: "#5B21B6",
    accentColor: "#5B21B6",
    description: "Unlock real clientelling — customer contact info travels with every shared wishlist.",
    features: [
      "Everything in Starter",
      "Customer contact details with shared wishlists",
      "Branded wishlist & summary cards with your logo",
      "Monthly report: saves, shares & wishlist trends",
      "Priority email + chat support",
      "Up to 3 staff accounts",
    ],
    notIncluded: [
      "Catalog sync API",
      "White-label experience",
    ],
    cta: "Get Growth",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    badge: "Best for Chains",
    badgeColor: "#0E6655",
    accentColor: "#1C1435",
    description: "Full integration for multi-location chains, buying groups, and branded retail experiences.",
    features: [
      "Everything in Growth",
      "Catalog sync API — real-time inventory updates",
      "White-label summary cards & insurance reports",
      "Dedicated account manager",
      "Unlimited staff accounts",
      "SLA-backed uptime guarantee",
      "Custom reporting & data exports",
    ],
    notIncluded: [],
    cta: "Talk to Our Team",
  },
];

const INSURANCE_MODEL = {
  headline: "Revenue Share — not a flat fee",
  body: "We don't charge insurance providers a monthly license. Instead, we earn a referral fee on policies that originate from DiGe quote requests. That means our incentives are perfectly aligned — we only win when your customers convert.",
  terms: [
    {
      icon: "percent",
      title: "5–15% referral fee",
      desc: "On first-year premiums for policies originating from DiGe quote requests. Rate negotiated based on volume.",
    },
    {
      icon: "database",
      title: "Pre-filled structured data",
      desc: "Every quote request arrives with piece names, purchase prices, serial numbers, and appraisal details — dramatically reducing underwriting friction.",
    },
    {
      icon: "users",
      title: "High-intent prospects only",
      desc: "DiGe users are actively documenting and protecting their jewelry. These are not tire-kickers — they're already in the mindset to insure.",
    },
    {
      icon: "bell",
      title: "Co-branded reminders",
      desc: "Your brand appears in warranty alerts and inspection reminders, keeping your name top-of-mind between policy renewals.",
    },
  ],
};

export default function PartnerPricingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("retailer");

  async function goToInquiry() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/partner-inquiry");
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Partnership Plans",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: "#1C1435" }]}>
          <View style={styles.heroIconRow}>
            <View style={styles.heroIconWrap}>
              <Feather name="briefcase" size={22} color="#fff" />
            </View>
          </View>
          <Text style={styles.heroTitle}>Partner with DiGe</Text>
          <Text style={styles.heroSub}>
            Transparent pricing for retailers. Revenue-share alignment for insurers. No surprises.
          </Text>
        </View>

        {/* Tab toggle */}
        <View style={[styles.tabBar, { backgroundColor: colors.muted }]}>
          <Pressable
            onPress={() => setActiveTab("retailer")}
            style={[styles.tabBtn, activeTab === "retailer" && { backgroundColor: "#5B21B6" }]}
          >
            <Feather
              name="shopping-bag"
              size={14}
              color={activeTab === "retailer" ? "#fff" : colors.mutedForeground}
            />
            <Text
              style={[
                styles.tabBtnText,
                { color: activeTab === "retailer" ? "#fff" : colors.mutedForeground },
              ]}
            >
              Jewelry Retailers
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("insurance")}
            style={[styles.tabBtn, activeTab === "insurance" && { backgroundColor: "#5B21B6" }]}
          >
            <Feather
              name="shield"
              size={14}
              color={activeTab === "insurance" ? "#fff" : colors.mutedForeground}
            />
            <Text
              style={[
                styles.tabBtnText,
                { color: activeTab === "insurance" ? "#fff" : colors.mutedForeground },
              ]}
            >
              Insurance Providers
            </Text>
          </Pressable>
        </View>

        {activeTab === "retailer" ? (
          <>
            <Text style={[styles.sectionNote, { color: colors.mutedForeground }]}>
              All plans include a free 90-day pilot so you can see real leads before committing.
            </Text>

            {RETAILER_TIERS.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                colors={colors}
                onSelect={goToInquiry}
              />
            ))}

            <View style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.faqTitle, { color: colors.foreground }]}>Common questions</Text>
              <FaqItem
                q="What does the 90-day pilot include?"
                a="Full Growth plan features at no cost for your first location. We want you to see real customer data before you pay a cent."
                colors={colors}
              />
              <FaqItem
                q="Can I add more locations later?"
                a="Yes — each location is billed separately at the same tier rate. Enterprise plans include volume discounts for 5+ locations."
                colors={colors}
              />
              <FaqItem
                q="How does catalog sync work?"
                a="Starter and Growth plans use QR codes that customers scan in-store. Enterprise gets a real-time API that keeps your inventory current automatically."
                colors={colors}
              />
              <FaqItem
                q="What happens to my data if I cancel?"
                a="Your catalog and any customer-shared contact data is deleted within 30 days of cancellation. Customers keep their own vault data."
                colors={colors}
              />
            </View>
          </>
        ) : (
          <>
            <View style={[styles.insuranceHeroCard, { backgroundColor: "#5B21B6" }]}>
              <Text style={styles.insuranceHeroTitle}>{INSURANCE_MODEL.headline}</Text>
              <Text style={styles.insuranceHeroBody}>{INSURANCE_MODEL.body}</Text>
            </View>

            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              WHAT YOU GET
            </Text>

            <View style={[styles.termsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {INSURANCE_MODEL.terms.map((t, i) => (
                <View key={t.title}>
                  <View style={styles.termRow}>
                    <View style={[styles.termIcon, { backgroundColor: "#5B21B6" + "14" }]}>
                      <Feather name={t.icon as any} size={16} color="#5B21B6" />
                    </View>
                    <View style={styles.termText}>
                      <Text style={[styles.termTitle, { color: colors.foreground }]}>{t.title}</Text>
                      <Text style={[styles.termDesc, { color: colors.mutedForeground }]}>{t.desc}</Text>
                    </View>
                  </View>
                  {i < INSURANCE_MODEL.terms.length - 1 ? (
                    <View style={[styles.termDivider, { backgroundColor: colors.border }]} />
                  ) : null}
                </View>
              ))}
            </View>

            <View style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.faqTitle, { color: colors.foreground }]}>Common questions</Text>
              <FaqItem
                q="Is there any upfront cost?"
                a="No. We only earn when your policy converts. There are no setup fees, monthly licenses, or minimum commitments."
                colors={colors}
              />
              <FaqItem
                q="How do quote requests arrive?"
                a="Via a structured JSON payload to your quote API endpoint or email — your choice. Each request includes itemized piece data, total insured value, and customer contact info."
                colors={colors}
              />
              <FaqItem
                q="Can we co-brand the experience?"
                a="Yes. Enterprise insurance partners get co-branded reminder push notifications and prominent logo placement on customer insurance reports."
                colors={colors}
              />
            </View>
          </>
        )}

        {/* Bottom CTA */}
        <View style={[styles.ctaBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.ctaBlockTitle, { color: colors.foreground }]}>
            Ready to start a conversation?
          </Text>
          <Text style={[styles.ctaBlockSub, { color: colors.mutedForeground }]}>
            Fill out a short inquiry and our partnerships team will respond within 2–3 business days.
          </Text>
          <Pressable
            onPress={goToInquiry}
            style={({ pressed }) => [
              styles.ctaBtn,
              { backgroundColor: "#5B21B6", opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Feather name="send" size={16} color="#fff" />
            <Text style={styles.ctaBtnText}>Send a Partnership Inquiry</Text>
          </Pressable>
          <Text style={[styles.ctaNote, { color: colors.mutedForeground }]}>
            No commitment required · We respond to every inquiry
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

function TierCard({
  tier,
  colors,
  onSelect,
}: {
  tier: (typeof RETAILER_TIERS)[0];
  colors: ReturnType<typeof useColors>;
  onSelect: () => void;
}) {
  const isEnterprise = tier.id === "enterprise";
  const isPopular = tier.id === "growth";

  return (
    <View
      style={[
        styles.tierCard,
        {
          backgroundColor: colors.card,
          borderColor: isPopular ? tier.accentColor : colors.border,
          borderWidth: isPopular ? 2 : 1,
        },
      ]}
    >
      {/* Header */}
      <View style={[styles.tierHeader, { borderBottomColor: colors.border }]}>
        <View style={styles.tierHeaderTop}>
          <View style={styles.tierNameRow}>
            <View style={[styles.tierDot, { backgroundColor: tier.accentColor }]} />
            <Text style={[styles.tierName, { color: colors.foreground }]}>{tier.name}</Text>
          </View>
          {tier.badge ? (
            <View style={[styles.tierBadge, { backgroundColor: tier.badgeColor + "18" }]}>
              <Text style={[styles.tierBadgeText, { color: tier.badgeColor! }]}>{tier.badge}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.tierPriceRow}>
          <Text style={[styles.tierPrice, { color: tier.accentColor }]}>{tier.price}</Text>
          <Text style={[styles.tierPeriod, { color: colors.mutedForeground }]}>{tier.period}</Text>
        </View>
        <Text style={[styles.tierDesc, { color: colors.mutedForeground }]}>{tier.description}</Text>
      </View>

      {/* Features */}
      <View style={styles.tierFeatures}>
        {tier.features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <View style={[styles.featureCheck, { backgroundColor: tier.accentColor }]}>
              <Feather name="check" size={10} color="#fff" />
            </View>
            <Text style={[styles.featureText, { color: colors.foreground }]}>{f}</Text>
          </View>
        ))}
        {tier.notIncluded.map((f) => (
          <View key={f} style={styles.featureRow}>
            <View style={[styles.featureX, { backgroundColor: colors.muted }]}>
              <Feather name="x" size={10} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.featureTextMuted, { color: colors.mutedForeground }]}>{f}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <Pressable
        onPress={onSelect}
        style={({ pressed }) => [
          styles.tierCta,
          {
            backgroundColor: isPopular ? tier.accentColor : "transparent",
            borderColor: tier.accentColor,
            borderWidth: isPopular ? 0 : 1.5,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.tierCtaText,
            { color: isPopular ? "#fff" : tier.accentColor },
          ]}
        >
          {isEnterprise ? "Talk to Our Team" : tier.cta}
        </Text>
        <Feather
          name="arrow-right"
          size={15}
          color={isPopular ? "#fff" : tier.accentColor}
        />
      </Pressable>
    </View>
  );
}

function FaqItem({
  q,
  a,
  colors,
}: {
  q: string;
  a: string;
  colors: ReturnType<typeof useColors>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.faqItem, { borderTopColor: colors.border }]}>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.faqQuestion}>
        <Text style={[styles.faqQ, { color: colors.foreground }]}>{q}</Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.mutedForeground}
        />
      </Pressable>
      {open ? (
        <Text style={[styles.faqA, { color: colors.mutedForeground }]}>{a}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 14 },

  hero: {
    borderRadius: 20,
    padding: 24,
    gap: 10,
    alignItems: "center",
  },
  heroIconRow: { marginBottom: 4 },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 20,
  },

  tabBar: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 9,
  },
  tabBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  sectionNote: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 17,
    marginBottom: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginLeft: 4,
    marginBottom: -4,
  },

  tierCard: {
    borderRadius: 18,
    overflow: "hidden",
  },
  tierHeader: {
    padding: 18,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tierHeaderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tierNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tierDot: { width: 10, height: 10, borderRadius: 5 },
  tierName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tierBadgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  tierPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  tierPrice: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  tierPeriod: { fontSize: 13, fontFamily: "Inter_400Regular" },
  tierDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },

  tierFeatures: { padding: 18, gap: 10 },
  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  featureCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  featureX: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  featureText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  featureTextMuted: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },

  tierCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 12,
  },
  tierCtaText: { fontSize: 14, fontFamily: "Inter_700Bold" },

  insuranceHeroCard: {
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  insuranceHeroTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.3,
  },
  insuranceHeroBody: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.78)",
    lineHeight: 20,
  },

  termsCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  termRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
  },
  termIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  termText: { flex: 1, gap: 4 },
  termTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  termDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  termDivider: { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },

  faqCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 0 },
  faqTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 8 },
  faqItem: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12, marginTop: 12 },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  faqQ: { flex: 1, fontSize: 13, fontFamily: "Inter_600SemiBold", lineHeight: 19 },
  faqA: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    marginTop: 8,
  },

  ctaBlock: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    gap: 10,
    alignItems: "center",
    marginTop: 4,
  },
  ctaBlockTitle: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  ctaBlockSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 19,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "stretch",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    marginTop: 4,
  },
  ctaBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  ctaNote: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
