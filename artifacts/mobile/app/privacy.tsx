import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
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
import { useColors } from "@/hooks/useColors";

const LAST_UPDATED = "May 2025";

export default function PrivacyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Privacy Policy",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              style={{ marginLeft: Platform.OS === "ios" ? 0 : 4 }}
            >
              <Feather name="x" size={22} color={colors.foreground} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lastUpdated, { color: colors.mutedForeground }]}>
          Last updated: {LAST_UPDATED}
        </Text>

        <InfoBox colors={colors}>
          This Privacy Policy explains what information DiGe collects, how it is used, and the choices you have. DiGe is designed with privacy first — your jewelry data stays on your device.
        </InfoBox>

        <Section title="Who We Are">
          <Body colors={colors}>
            DiGe ("we", "us", "our") is a personal jewelry organizer app that helps you store warranty documents, purchase records, wishlists, and inspection reminders. This Privacy Policy applies to all users of the DiGe mobile application.
          </Body>
          <Body colors={colors}>
            For any privacy-related questions, you can reach us at: <Strong colors={colors}>privacy@digeapp.com</Strong>
          </Body>
        </Section>

        <Section title="What Information We Collect">
          <Body colors={colors}>
            DiGe collects only what you choose to provide:
          </Body>
          <BulletList
            colors={colors}
            items={[
              "Profile information — your name, email address, and phone number (optional, stored only on your device)",
              "Jewelry vault data — piece descriptions, purchase prices, retailer names, warranty dates, and document photos you upload",
              "Wishlist items — jewelry items you save per retailer, including descriptions and price ranges",
              "Inspection reminders — dates and notes you set for jewelry maintenance",
              "Photos and documents — images you attach to vault entries (stored locally on your device)",
            ]}
          />
          <Body colors={colors}>
            We do <Strong colors={colors}>not</Strong> collect: precise location, biometric data, payment card numbers, or any data without your explicit input.
          </Body>
        </Section>

        <Section title="Where Your Data Is Stored">
          <InfoBox colors={colors} icon="lock">
            All personal jewelry data, profile information, and photos are stored exclusively on your device using local storage. DiGe does not operate a cloud server that holds your personal records.
          </InfoBox>
          <Body colors={colors}>
            Because data lives on your device, if you uninstall the app, lose your device, or clear app data, your vault contents cannot be recovered by us. We strongly recommend keeping original physical copies of all important documents.
          </Body>
        </Section>

        <Section title="How We Use Your Information">
          <Body colors={colors}>
            Information you enter into DiGe is used solely to:
          </Body>
          <BulletList
            colors={colors}
            items={[
              "Display your jewelry vault, wishlists, and reminders within the app",
              "Send inspection reminder notifications you have scheduled",
              "Pre-fill sharing summaries when you choose to share a piece or wishlist with a retailer",
              "Personalize your in-app experience (e.g. your name in greetings)",
            ]}
          />
        </Section>

        <Section title="Analytics & Partner Data Sharing">
          <Body colors={colors}>
            To support the app and our retail and insurance partner programs, we may collect and share <Strong colors={colors}>anonymized, aggregated</Strong> usage data with business partners. This may include:
          </Body>
          <BulletList
            colors={colors}
            items={[
              "Jewelry category preferences (e.g. rings, necklaces) — no specific items",
              "Estimated price range brackets from your vault — not exact figures",
              "Retailer browsing patterns within the app",
              "Inspection reminder frequency",
              "Feature usage statistics",
            ]}
          />
          <Body colors={colors}>
            <Strong colors={colors}>We do not sell your name, contact information, photos, or device identifiers to any third party.</Strong> Shared analytics are aggregated across many users and cannot be used to identify you individually.
          </Body>
          <Body colors={colors}>
            If you share a wishlist or piece summary with a retailer through the app, the information in that share is sent directly to that retailer. You are always in control of when and what you share.
          </Body>
        </Section>

        <Section title="Your Rights & Choices">
          <Body colors={colors}>
            Depending on where you live, you may have the following rights regarding your personal data:
          </Body>
          <BulletList
            colors={colors}
            items={[
              "Right to access — request a summary of what data the app holds about you",
              "Right to deletion — delete all your data at any time from Settings → Clear All Vault Data",
              "Right to correction — update your profile information at any time in Settings → My Profile",
              "Right to opt out — contact us to opt out of anonymized analytics sharing",
              "Right to portability — your data is stored locally; you can export it by contacting us",
            ]}
          />
          <Body colors={colors}>
            <Strong colors={colors}>California residents (CCPA):</Strong> You have the right to know what personal information is collected, to delete it, and to opt out of its sale. We do not sell personal information.
          </Body>
          <Body colors={colors}>
            <Strong colors={colors}>EEA / UK residents (GDPR):</Strong> Our legal basis for processing your data is your consent and our legitimate interest in providing the app. You have the right to lodge a complaint with your local data protection authority.
          </Body>
        </Section>

        <Section title="Deleting Your Data">
          <Body colors={colors}>
            You can permanently delete all vault data directly within the app:
          </Body>
          <BulletList
            colors={colors}
            items={[
              "Go to Settings (gear icon in top right of the Retailers tab)",
              "Scroll to the Data section",
              'Tap "Clear All Vault Data" and confirm',
            ]}
          />
          <Body colors={colors}>
            This will permanently erase all pieces, wishlists, reminders, and profile information from your device. This action cannot be undone.
          </Body>
          <Body colors={colors}>
            To request deletion of any analytics data we may hold, email us at <Strong colors={colors}>privacy@digeapp.com</Strong> and we will respond within 30 days.
          </Body>
        </Section>

        <Section title="Third-Party Services">
          <Body colors={colors}>
            DiGe may display information from or link to third-party retailers and insurance providers. These third parties have their own privacy policies, and we are not responsible for their data practices.
          </Body>
          <Body colors={colors}>
            The app uses the following device services, subject to their respective privacy policies:
          </Body>
          <BulletList
            colors={colors}
            items={[
              "Camera — used only to photograph jewelry and scan retailer QR codes",
              "Photo Library — used only to attach images you choose to vault entries",
              "Push Notifications — used only to deliver inspection reminders you set",
            ]}
          />
        </Section>

        <Section title="Children's Privacy">
          <Body colors={colors}>
            DiGe is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.
          </Body>
        </Section>

        <Section title="Data Security">
          <Body colors={colors}>
            Since your data is stored locally on your device, its security depends on your device's security settings. We recommend enabling a passcode or biometric lock on your device. DiGe does not transmit your personal jewelry records over the internet.
          </Body>
        </Section>

        <Section title="Changes to This Policy">
          <Body colors={colors}>
            We may update this Privacy Policy from time to time. We will notify you of any material changes through the app. Continued use of DiGe after changes are posted constitutes your acceptance of the updated policy.
          </Body>
        </Section>

        <Section title="Contact Us">
          <Body colors={colors}>
            For any privacy questions, data requests, or concerns, contact us at:
          </Body>
          <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.contactRow}>
              <Feather name="mail" size={15} color="#5B21B6" />
              <Text style={[styles.contactText, { color: colors.foreground }]}>privacy@digeapp.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Feather name="globe" size={15} color="#5B21B6" />
              <Text style={[styles.contactText, { color: colors.foreground }]}>www.digeapp.com/privacy</Text>
            </View>
          </View>
          <Body colors={colors}>
            We aim to respond to all privacy requests within 30 days.
          </Body>
        </Section>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Your trust matters to us. DiGe is built to keep your jewelry data private and secure — on your device, in your control.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Body({ colors, children }: { colors: ReturnType<typeof useColors>; children: React.ReactNode }) {
  return (
    <Text style={[styles.body, { color: colors.foreground }]}>{children}</Text>
  );
}

function Strong({ colors, children }: { colors: ReturnType<typeof useColors>; children: React.ReactNode }) {
  return (
    <Text style={[styles.strong, { color: colors.foreground }]}>{children}</Text>
  );
}

function InfoBox({
  colors,
  icon = "info",
  children,
}: {
  colors: ReturnType<typeof useColors>;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.infoBox, { backgroundColor: "#5B21B6" + "15", borderColor: "#5B21B6" + "40" }]}>
      <Feather name={icon as any} size={15} color="#5B21B6" style={{ marginTop: 1, flexShrink: 0 }} />
      <Text style={[styles.infoBoxText, { color: colors.foreground }]}>{children}</Text>
    </View>
  );
}

function BulletList({ colors, items }: { colors: ReturnType<typeof useColors>; items: string[] }) {
  return (
    <View style={styles.bulletList}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: "#5B21B6" }]} />
          <Text style={[styles.bulletText, { color: colors.foreground }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 0 },
  lastUpdated: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 16 },

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoBoxText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },

  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#5B21B6",
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  sectionBody: { gap: 10 },

  body: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  strong: { fontSize: 14, fontFamily: "Inter_700Bold", lineHeight: 22 },

  bulletList: { gap: 8, paddingLeft: 4 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  bullet: { width: 5, height: 5, borderRadius: 3, marginTop: 8, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },

  contactCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    marginBottom: 10,
  },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  contactText: { fontSize: 14, fontFamily: "Inter_500Medium" },

  footer: {
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, textAlign: "center" },
});
