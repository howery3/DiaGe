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

const LAST_UPDATED = "May 2026";

export default function TermsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Terms & Conditions",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={10} style={{ marginLeft: Platform.OS === "ios" ? 0 : 4 }}>
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

        <Section title="About DiaGe">
          <Body colors={colors}>
            DiaGe ("the App", "we", "us") is a personal jewelry organizer that helps you store and manage copies of your jewelry-related documents, warranty information, purchase records, wishlists, and inspection reminders in one place.
          </Body>
          <Body colors={colors}>
            DiaGe is a third-party organizational tool only. We are not a jewelry retailer, insurer, warranty provider, or document custodian. Nothing in this App creates any legal relationship between you and any retailer, insurer, or other third party.
          </Body>
        </Section>

        <Section title="Data Storage & Account Sync">
          <Body colors={colors}>
            When you are signed in, your jewelry vault data (pieces, wishlist items, and inspection reminders) is synced to DiaGe's secure servers and associated with your account. This allows your data to be restored when you sign in on a new or replacement device.
          </Body>
          <Body colors={colors}>
            A local cache is also maintained on your device for fast access and offline use. The server copy is the authoritative record.
          </Body>
          <Body colors={colors}>
            You acknowledge and agree that DiaGe is not a substitute for keeping original hard copies of your jewelry paperwork, including but not limited to:
          </Body>
          <BulletList colors={colors} items={[
            "Warranty cards and certificates",
            "Purchase receipts and invoices",
            "Appraisal documents",
            "Insurance documentation",
            "Serial number records",
          ]} />
          <Warning colors={colors}>
            Always retain physical copies of all important documents. DiaGe strongly recommends keeping originals in a secure location (such as a safe or safe-deposit box) independent of this App.
          </Warning>
        </Section>

        <Section title="No Liability for Data Loss">
          <Body colors={colors}>
            While DiaGe syncs your vault data to secure servers, we do not guarantee uninterrupted availability or permanent retention of your data. To the fullest extent permitted by law, DiaGe and its owners, developers, officers, and affiliates shall not be liable for any loss, corruption, or unavailability of data, including losses arising from:
          </Body>
          <BulletList colors={colors} items={[
            "App crashes, bugs, or technical failures",
            "Server outages or infrastructure failures beyond our reasonable control",
            "Accidental deletion by you (including use of the Clear All Vault Data feature)",
            "Account deletion or termination",
            "Operating system updates that affect App functionality",
            "Any other cause beyond our reasonable control",
          ]} />
          <Body colors={colors}>
            Your use of DiaGe as a sole record-keeping system is at your own risk. We expressly disclaim any warranty that information stored in the App will be available, accurate, or recoverable at any time.
          </Body>
        </Section>

        <Section title="No Liability for Third-Party Actions">
          <Body colors={colors}>
            DiaGe displays information about third-party retailers, insurance providers, and partner businesses for organizational and convenience purposes only. We do not endorse, guarantee, or take responsibility for:
          </Body>
          <BulletList colors={colors} items={[
            "The accuracy of any retailer or insurance information displayed",
            "Warranty terms offered by any retailer",
            "Insurance quotes, coverage decisions, or claims",
            "The outcome of any appointments booked through the App",
            "Any transaction you enter into with a third party",
          ]} />
        </Section>

        <Section title="Analytics & Partner Data Sharing">
          <Body colors={colors}>
            By using DiaGe, you agree that we may collect and share certain anonymized usage and behavioral data with our business partners, including but not limited to:
          </Body>
          <BulletList colors={colors} items={[
            "Wishlist item categories and estimated price ranges",
            "Retailer preferences and browsing patterns within the App",
            "Jewelry types and purchase price ranges (from your vault entries)",
            "Inspection reminder frequency and patterns",
            "Catalog browsing and sync activity",
          ]} />
          <Body colors={colors}>
            This data is used to improve the App, provide relevant content, and support our retail and insurance partner programs. <Strong colors={colors}>We do not sell your name, contact information, or device identifiers to third parties.</Strong>
          </Body>
          <Body colors={colors}>
            Shared analytics data is aggregated and anonymized to the extent practicable. We may share non-anonymized data only where required by law or with your explicit consent.
          </Body>
        </Section>

        <Section title="Limitation of Liability">
          <Body colors={colors}>
            In no event shall DiaGe be liable to you for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, revenue, profits, goodwill, or other intangible losses, resulting from your use of or inability to use the App.
          </Body>
          <Body colors={colors}>
            To the extent permitted by applicable law, DiaGe's total liability to you for all claims arising from or related to your use of the App shall not exceed the amount you have paid for the App (if any) in the twelve months preceding the claim.
          </Body>
        </Section>

        <Section title="Disclaimer of Warranties">
          <Body colors={colors}>
            DiaGe is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, secure, or free of viruses or other harmful components.
          </Body>
        </Section>

        <Section title="Changes to These Terms">
          <Body colors={colors}>
            We may update these Terms from time to time. Continued use of the App after any changes constitutes your acceptance of the updated Terms. We will notify you of material changes through the App.
          </Body>
        </Section>

        <Section title="Contact">
          <Body colors={colors}>
            If you have questions about these Terms, please contact us through the App or at the contact information provided on our website.
          </Body>
        </Section>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            By using DiaGe, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
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

function Warning({ colors, children }: { colors: ReturnType<typeof useColors>; children: React.ReactNode }) {
  return (
    <View style={[styles.warning, { backgroundColor: "#B45309" + "12", borderColor: "#B45309" + "40" }]}>
      <Feather name="alert-triangle" size={14} color="#B45309" style={{ marginTop: 1, flexShrink: 0 }} />
      <Text style={[styles.warningText, { color: "#B45309" }]}>{children}</Text>
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
  lastUpdated: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 20 },

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

  warning: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  warningText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 19 },

  bulletList: { gap: 8, paddingLeft: 4 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  bullet: { width: 5, height: 5, borderRadius: 3, marginTop: 8, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },

  footer: {
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, textAlign: "center" },
});
