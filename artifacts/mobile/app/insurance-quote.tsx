import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useMemo, useState } from "react";
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
import { useDiGe } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

const COVERAGE_TYPES = [
  {
    id: "rider",
    label: "Jewelry Rider",
    desc: "Add jewelry coverage to an existing homeowners or renters policy",
    icon: "home",
  },
  {
    id: "standalone",
    label: "Standalone Policy",
    desc: "A dedicated jewelry insurance policy, separate from home insurance",
    icon: "shield",
  },
  {
    id: "appraisal",
    label: "Appraisal-Based",
    desc: "Coverage based on professional appraisal value, not purchase price",
    icon: "award",
  },
];

const INSURERS = [
  { id: "jewelers-mutual", name: "Jewelers Mutual", email: "quotes@jewelersmutual.com", url: "https://www.jewelersmutual.com/jewelry-insurance/get-a-quote" },
  { id: "briteco", name: "BriteCo", email: "hello@brite.co", url: "https://brite.co/get-a-quote" },
  { id: "lavalier", name: "Lavalier", email: "service@lavalier.com", url: "https://www.lavalier.com/jewelry-insurance-quote" },
  { id: "chubb", name: "Chubb Personal Risk", email: "", url: "https://www.chubb.com/us-en/individuals-families/products/valuable-articles.html" },
];

function fmt(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function InsuranceQuoteScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pieces } = useDiGe();

  const [coverageType, setCoverageType] = useState("rider");
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>(["jewelers-mutual"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");

  const totalValue = useMemo(() => {
    return pieces.reduce((sum, p) => {
      const n = parseFloat(p.purchasePrice.replace(/[^0-9.]/g, ""));
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
  }, [pieces]);

  function toggleInsurer(id: string) {
    setSelectedInsurers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function buildReportText(): string {
    const hr = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    const lines: string[] = [
      "💎 DiaGe — Insurance Quote Request",
      `Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
      hr,
      "",
      "CONTACT",
      `Name: ${name || "(not provided)"}`,
      `Email: ${email || "(not provided)"}`,
      `Phone: ${phone || "(not provided)"}`,
      `Zip Code: ${zip || "(not provided)"}`,
      `Coverage Type Requested: ${COVERAGE_TYPES.find((c) => c.id === coverageType)?.label ?? coverageType}`,
      "",
      "JEWELRY SUMMARY",
      `Total Pieces: ${pieces.length}`,
      `Total Purchase Value: $${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "",
    ];

    pieces.forEach((p, i) => {
      lines.push(hr);
      lines.push(`[${i + 1}] ${p.name.toUpperCase()}`);
      if (p.brand) lines.push(`  Brand: ${p.brand}`);
      if (p.material) lines.push(`  Material: ${p.material}`);
      lines.push(`  Type: ${p.type.charAt(0).toUpperCase() + p.type.slice(1)}`);
      if (p.retailer) lines.push(`  Purchased From: ${p.retailer}`);
      if (p.purchaseDate) lines.push(`  Purchase Date: ${fmt(p.purchaseDate)}`);
      if (p.purchasePrice) lines.push(`  Purchase Price: $${p.purchasePrice}`);
      if (p.serialNumber) lines.push(`  Serial / Certificate: ${p.serialNumber}`);

      if (p.goldWarrantyType && p.goldWarrantyType !== "none") {
        lines.push(`  Gold Warranty: ${p.goldWarrantyType === "lifetime" ? "Lifetime" : "Dated"}`);
        if (p.goldWarrantyNumber) lines.push(`  Warranty #: ${p.goldWarrantyNumber}`);
      }
      if (p.diamondBondNumber || p.diamondBondExpiry) {
        lines.push(`  Diamond Bond: Yes`);
        if (p.diamondBondNumber) lines.push(`  Bond #: ${p.diamondBondNumber}`);
        if (p.diamondBondExpiry) lines.push(`  Bond Expires: ${fmt(p.diamondBondExpiry)}`);
      }

      const docCount = (p.documents ?? []).length;
      const repairCount = (p.repairHistory ?? []).length;
      if (docCount > 0) lines.push(`  Documents on File: ${docCount}`);
      if (repairCount > 0) lines.push(`  Repairs Logged: ${repairCount}`);
      lines.push("");
    });

    lines.push(hr);
    lines.push("Sent via DiaGe — Jewelry Vault & Insurance App");

    return lines.join("\n");
  }

  async function handleSendQuotes() {
    if (selectedInsurers.length === 0) {
      Alert.alert("Select Insurers", "Please select at least one insurance provider to contact.");
      return;
    }
    const report = buildReportText();
    const emailInsurers = selectedInsurers
      .map((id) => INSURERS.find((i) => i.id === id))
      .filter(Boolean);

    const emailBodies = emailInsurers.filter((i) => i!.email);
    const webInsurers = emailInsurers.filter((i) => !i!.email);

    if (emailBodies.length > 0) {
      const to = emailBodies.map((i) => i!.email).join(",");
      const subject = encodeURIComponent("DiaGe — Jewelry Insurance Quote Request");
      const body = encodeURIComponent(report);
      const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
      const canOpen = await Linking.canOpenURL(mailto);
      if (canOpen) {
        await Linking.openURL(mailto);
      } else {
        await Share.share({ message: report });
      }
    } else {
      await Share.share({ message: report });
    }

    for (const insurer of webInsurers) {
      await Linking.openURL(insurer!.url);
    }
  }

  async function handleShareReport() {
    await Share.share({ message: buildReportText() });
  }

  const isReady = pieces.length > 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Insurance Quote",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
          headerRight: () => (
            <Pressable onPress={handleShareReport} hitSlop={8}>
              <Feather name="share-2" size={20} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Vault snapshot */}
        <View style={[styles.vaultCard, { backgroundColor: "#5B21B6" }]}>
          <Text style={styles.vaultLabel}>Your DiaGe Vault — Pre-filled</Text>
          <View style={styles.vaultRow}>
            <View>
              <Text style={styles.vaultNum}>{pieces.length}</Text>
              <Text style={styles.vaultSub}>{pieces.length === 1 ? "Piece" : "Pieces"}</Text>
            </View>
            {totalValue > 0 ? (
              <>
                <View style={styles.vaultDivider} />
                <View>
                  <Text style={styles.vaultNum}>
                    ${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </Text>
                  <Text style={styles.vaultSub}>Est. Value</Text>
                </View>
              </>
            ) : null}
            <View style={styles.vaultDivider} />
            <View>
              <Text style={styles.vaultNum}>
                {pieces.reduce((s, p) => s + (p.serialNumber ? 1 : 0), 0)}
              </Text>
              <Text style={styles.vaultSub}>Serials</Text>
            </View>
          </View>
          {!isReady && (
            <View style={[styles.emptyNote, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Feather name="info" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.emptyNoteText}>
                Add pieces to your vault to pre-fill quote requests
              </Text>
            </View>
          )}
        </View>

        {/* Contact info */}
        <SectionLabel title="Your Contact Info" colors={colors} />
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FormField label="Full Name" value={name} onChangeText={setName} placeholder="Jane Smith" colors={colors} />
          <FormField label="Email" value={email} onChangeText={setEmail} placeholder="jane@example.com" keyboardType="email-address" colors={colors} />
          <FormField label="Phone" value={phone} onChangeText={setPhone} placeholder="(555) 123-4567" keyboardType="phone-pad" colors={colors} />
          <FormField label="Zip Code" value={zip} onChangeText={setZip} placeholder="10001" keyboardType="number-pad" colors={colors} last />
        </View>

        {/* Coverage type */}
        <SectionLabel title="Coverage Type" colors={colors} />
        <View style={styles.coverageList}>
          {COVERAGE_TYPES.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCoverageType(c.id)}
              style={[
                styles.coverageOption,
                {
                  backgroundColor: colors.card,
                  borderColor: coverageType === c.id ? colors.primary : colors.border,
                  borderWidth: coverageType === c.id ? 2 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.coverageIconWrap,
                  {
                    backgroundColor:
                      coverageType === c.id ? colors.primary : colors.muted,
                  },
                ]}
              >
                <Feather
                  name={c.icon as any}
                  size={16}
                  color={coverageType === c.id ? "#fff" : colors.mutedForeground}
                />
              </View>
              <View style={styles.coverageText}>
                <Text style={[styles.coverageLabel, { color: colors.foreground }]}>{c.label}</Text>
                <Text style={[styles.coverageDesc, { color: colors.mutedForeground }]}>{c.desc}</Text>
              </View>
              {coverageType === c.id ? (
                <Feather name="check-circle" size={18} color={colors.primary} />
              ) : (
                <View style={[styles.radioEmpty, { borderColor: colors.border }]} />
              )}
            </Pressable>
          ))}
        </View>

        {/* Select insurers */}
        <SectionLabel title="Send To" subtitle="Select one or more providers" colors={colors} />
        <View style={styles.insurerList}>
          {INSURERS.map((insurer) => {
            const selected = selectedInsurers.includes(insurer.id);
            return (
              <Pressable
                key={insurer.id}
                onPress={() => toggleInsurer(insurer.id)}
                style={[
                  styles.insurerOption,
                  {
                    backgroundColor: colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                    borderWidth: selected ? 2 : 1,
                  },
                ]}
              >
                <View style={[styles.insurerCheck, { backgroundColor: selected ? colors.primary : colors.muted, borderColor: selected ? colors.primary : colors.border }]}>
                  {selected ? <Feather name="check" size={13} color="#fff" /> : null}
                </View>
                <Text style={[styles.insurerOptionName, { color: colors.foreground }]}>{insurer.name}</Text>
                {insurer.email ? (
                  <Feather name="mail" size={13} color={colors.mutedForeground} />
                ) : (
                  <Feather name="external-link" size={13} color={colors.mutedForeground} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleSendQuotes}
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 },
          ]}
        >
          <Feather name="send" size={18} color="#fff" />
          <Text style={styles.submitBtnText}>
            Send Quote Request{selectedInsurers.length > 1 ? `s (${selectedInsurers.length})` : ""}
          </Text>
        </Pressable>
        <Text style={[styles.submitNote, { color: colors.mutedForeground }]}>
          Your vault data, contact info, and coverage preference are included automatically. No manual form-filling required.
        </Text>
      </ScrollView>
    </>
  );
}

function SectionLabel({
  title,
  subtitle,
  colors,
}: {
  title: string;
  subtitle?: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.sectionLabel}>
      <Text style={[styles.sectionLabelText, { color: colors.foreground }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.sectionLabelSub, { color: colors.mutedForeground }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  colors,
  last,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
  colors: ReturnType<typeof useColors>;
  last?: boolean;
}) {
  return (
    <View style={[styles.fieldWrap, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground + "88"}
        keyboardType={keyboardType ?? "default"}
        autoCapitalize="words"
        style={[styles.fieldInput, { color: colors.foreground }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 12 },

  vaultCard: { borderRadius: 18, padding: 18, gap: 12 },
  vaultLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 0.5 },
  vaultRow: { flexDirection: "row", alignItems: "center", gap: 20 },
  vaultNum: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#fff" },
  vaultSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.65)" },
  vaultDivider: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.2)" },
  emptyNote: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 10 },
  emptyNoteText: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", flex: 1 },

  sectionLabel: { gap: 2 },
  sectionLabelText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  sectionLabelSub: { fontSize: 12, fontFamily: "Inter_400Regular" },

  formCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  fieldWrap: { paddingHorizontal: 16, paddingVertical: 12 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 },
  fieldInput: { fontSize: 15, fontFamily: "Inter_400Regular" },

  coverageList: { gap: 8 },
  coverageOption: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14 },
  coverageIconWrap: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  coverageText: { flex: 1, gap: 2 },
  coverageLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  coverageDesc: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 15 },
  radioEmpty: { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },

  insurerList: { gap: 8 },
  insurerOption: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 12 },
  insurerCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  insurerOptionName: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },

  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: 16,
    marginTop: 4,
  },
  submitBtnText: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  submitNote: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 17 },
});
