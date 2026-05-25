import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { capture } from "@/utils/posthog";
import {
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
import { useColors } from "@/hooks/useColors";

type PartnerType = "insurance" | "retail";

const INSURANCE_BENEFITS = [
  "Access high-intent jewelry owners with documented vaults",
  "Receive pre-filled quote data: piece names, prices, serials",
  "Co-branded reminders and warranty alerts drive engagement",
  "Reduce underwriting friction with structured data",
  "In-app partner listing reaches active DiaGe users",
];

const RETAIL_BENEFITS = [
  "In-store QR codes let customers save wishlists on the spot",
  "Customers can send their wishlist to your nearest location automatically",
  "Partner snapshot reports show exactly what your customers own and love",
  "Automated inspection reminders bring customers back to your store",
  "Digital warranty tracking tied to your store builds long-term loyalty",
  "Wishlist integration converts browsers into buyers",
];

export default function PartnerInquiryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [partnerType, setPartnerType] = useState<PartnerType>("retail");
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function buildInquiry(): string {
    const type = partnerType === "insurance" ? "Insurance Provider" : "Jewelry Retailer";
    const lines = [
      `💎 DiaGe — Partnership Inquiry`,
      `Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
      `Partner Type: ${type}`,
      "",
      "CONTACT INFORMATION",
      `Company: ${company || "(not provided)"}`,
      `Contact Name: ${contactName || "(not provided)"}`,
      `Email: ${email || "(not provided)"}`,
      `Phone: ${phone || "(not provided)"}`,
      `Website: ${website || "(not provided)"}`,
      "",
      "MESSAGE",
      message || "(no message provided)",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Sent via DiaGe — Jewelry Vault & Insurance App",
    ];
    return lines.join("\n");
  }

  async function handleSubmit() {
    if (!company.trim() || !email.trim()) {
      Alert.alert("Required Fields", "Please enter your company name and email address.");
      return;
    }

    const body = buildInquiry();
    const subject = encodeURIComponent(`DiaGe Partnership Inquiry — ${company}`);
    const bodyEncoded = encodeURIComponent(body);
    const mailto = `mailto:partnerships@digejewelry.com?subject=${subject}&body=${bodyEncoded}`;

    const canOpen = await Linking.canOpenURL(mailto);
    if (canOpen) {
      await Linking.openURL(mailto);
    } else {
      await Share.share({ message: body });
    }
    capture("partner_inquiry_submitted", { partner_type: partnerType });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Partnership Inquiry",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.foreground,
            headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
          }}
        />
        <View style={[styles.successRoot, { backgroundColor: colors.background }]}>
          <View style={[styles.successIconWrap, { backgroundColor: "#5B21B6" }]}>
            <Feather name="check" size={36} color="#fff" />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Inquiry Sent!</Text>
          <Text style={[styles.successBody, { color: colors.mutedForeground }]}>
            Thank you for your interest in partnering with DiaGe. Our partnerships team will review your inquiry and reach out within 2-3 business days.
          </Text>
          <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="mail" size={16} color={colors.primary} />
            <Text style={[styles.successCardText, { color: colors.mutedForeground }]}>
              A copy of your inquiry was shared so you have a record for your files.
            </Text>
          </View>
        </View>
      </>
    );
  }

  const benefits = partnerType === "insurance" ? INSURANCE_BENEFITS : RETAIL_BENEFITS;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Become a Partner",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: "#5B21B6" }]}>
          <View style={styles.heroIcon}>
            <Feather name="briefcase" size={28} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Partner with DiaGe</Text>
          <Text style={styles.heroSub}>
            Connect your business with an engaged audience of jewelry owners who actively document and protect their collections.
          </Text>
        </View>

        {/* Partner type toggle */}
        <View style={[styles.toggleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.toggleLabel, { color: colors.mutedForeground }]}>I represent a...</Text>
          <View style={[styles.toggleRow, { backgroundColor: colors.muted }]}>
            <Pressable
              onPress={() => setPartnerType("retail")}
              style={[
                styles.toggleBtn,
                partnerType === "retail" && { backgroundColor: colors.primary },
              ]}
            >
              <Feather
                name="shopping-bag"
                size={14}
                color={partnerType === "retail" ? "#fff" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.toggleBtnText,
                  { color: partnerType === "retail" ? "#fff" : colors.mutedForeground },
                ]}
              >
                Jewelry Retailer
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPartnerType("insurance")}
              style={[
                styles.toggleBtn,
                partnerType === "insurance" && { backgroundColor: colors.primary },
              ]}
            >
              <Feather
                name="shield"
                size={14}
                color={partnerType === "insurance" ? "#fff" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.toggleBtnText,
                  { color: partnerType === "insurance" ? "#fff" : colors.mutedForeground },
                ]}
              >
                Insurance Provider
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Benefits */}
        <View style={[styles.benefitsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.benefitsTitle, { color: colors.foreground }]}>
            {partnerType === "insurance" ? "Why insurance providers partner with DiaGe" : "Why retailers partner with DiaGe"}
          </Text>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={[styles.benefitDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.benefitText, { color: colors.mutedForeground }]}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Form */}
        <Text style={[styles.formTitle, { color: colors.foreground }]}>Tell us about your company</Text>
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FormField
            label="Company Name *"
            value={company}
            onChangeText={setCompany}
            placeholder={partnerType === "insurance" ? "Acme Insurance Group" : "Smith Fine Jewelers"}
            colors={colors}
          />
          <FormField
            label="Your Name *"
            value={contactName}
            onChangeText={setContactName}
            placeholder="Jane Smith"
            colors={colors}
          />
          <FormField
            label="Email Address *"
            value={email}
            onChangeText={setEmail}
            placeholder="jane@yourcompany.com"
            keyboardType="email-address"
            colors={colors}
          />
          <FormField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="(555) 123-4567"
            keyboardType="phone-pad"
            colors={colors}
          />
          <FormField
            label="Website"
            value={website}
            onChangeText={setWebsite}
            placeholder="https://yourcompany.com"
            keyboardType="url"
            colors={colors}
          />
          <View style={[styles.fieldWrap, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Message (optional)</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={
                partnerType === "insurance"
                  ? "Tell us about your coverage offerings, target markets, and how you'd like to integrate with DiaGe..."
                  : "Tell us about your store(s), your customer base, and what kind of partnership you have in mind..."
              }
              placeholderTextColor={colors.mutedForeground + "88"}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={[styles.fieldInput, styles.fieldTextArea, { color: colors.foreground }]}
            />
          </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 },
          ]}
        >
          <Feather name="send" size={18} color="#fff" />
          <Text style={styles.submitBtnText}>Send Partnership Inquiry</Text>
        </Pressable>

        <Text style={[styles.submitNote, { color: colors.mutedForeground }]}>
          We respond to all partnership inquiries within 2-3 business days.
        </Text>
      </ScrollView>
    </>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad" | "url";
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.fieldWrap, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground + "88"}
        keyboardType={keyboardType ?? "default"}
        autoCapitalize={keyboardType === "email-address" || keyboardType === "url" ? "none" : "words"}
        style={[styles.fieldInput, { color: colors.foreground }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 14 },

  successRoot: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 16 },
  successIconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  successBody: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  successCard: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
  successCardText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },

  hero: { borderRadius: 20, padding: 20, gap: 10, alignItems: "center" },
  heroIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  heroTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", textAlign: "center" },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)", textAlign: "center", lineHeight: 19 },

  toggleCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  toggleLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  toggleRow: { flexDirection: "row", borderRadius: 10, padding: 4, gap: 4 },
  toggleBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 8 },
  toggleBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  benefitsCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 10 },
  benefitsTitle: { fontSize: 14, fontFamily: "Inter_700Bold", lineHeight: 19 },
  benefitRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  benefitDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5, flexShrink: 0 },
  benefitText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },

  formTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  formCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  fieldWrap: { paddingHorizontal: 16, paddingVertical: 12 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 5 },
  fieldInput: { fontSize: 15, fontFamily: "Inter_400Regular" },
  fieldTextArea: { minHeight: 80, paddingTop: 4 },

  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 54, borderRadius: 16, marginTop: 4 },
  submitBtnText: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  submitNote: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 17 },
});
