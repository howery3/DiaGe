import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DatePickerModal } from "@/components/DatePickerModal";
import { useProfile } from "@/hooks/useProfile";
import { useColors } from "@/hooks/useColors";

const RING_SIZES = ["4", "4½", "5", "5½", "6", "6½", "7", "7½", "8", "8½", "9", "9½", "10", "10½", "11", "11½", "12"];
const BRACELET_SIZES = ['6"', '6½"', '7"', '7½"', '8"', '8½"'];
const NECKLACE_LENGTHS = ['14"', '16"', '18"', '20"', '22"', '24"', '30"'];
const GOLD_COLORS = ["Yellow Gold", "White Gold", "Rose Gold", "Two-Tone", "Platinum"];
const METALS = ["Gold", "Silver", "Platinum", "Sterling Silver", "Titanium", "Stainless Steel"];
const STONES = ["Diamond", "Sapphire", "Ruby", "Emerald", "Pearl", "Opal", "Amethyst", "Topaz", "Garnet"];
const BUDGET_RANGES = ["Under $500", "$500–$1K", "$1K–$2.5K", "$2.5K–$5K", "$5K–$10K", "$10K+"];

type DateField = "birthday" | "anniversary";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, saveProfile, initials, completionPct, hasProfile } = useProfile();
  const [activePicker, setActivePicker] = useState<DateField | null>(null);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function toggleMulti(field: "preferredMetals" | "preferredStones", value: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const current: string[] = profile[field] ?? [];
    const next = current.includes(value)
      ? current.filter((x) => x !== value)
      : [...current, value];
    saveProfile({ [field]: next });
  }

  function selectSingle(field: keyof typeof profile, value: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    saveProfile({ [field]: profile[field] === value ? "" : value } as any);
  }

  const dateValues: Record<DateField, string> = {
    birthday: profile.birthday,
    anniversary: profile.anniversary,
  };

  const profileInitials = initials();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>My Profile</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              {completionPct}% complete
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/settings")}
            hitSlop={10}
            style={[styles.settingsBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
          >
            <Feather name="settings" size={18} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Avatar + completion bar */}
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: hasProfile ? colors.primary : colors.muted }]}>
            {hasProfile ? (
              <Text style={styles.avatarText}>{profileInitials}</Text>
            ) : (
              <Feather name="user" size={26} color={colors.mutedForeground} />
            )}
          </View>
          <View style={styles.completionWrap}>
            <View style={[styles.completionBarBg, { backgroundColor: colors.secondary }]}>
              <View style={[styles.completionBarFill, { width: `${completionPct}%` as any, backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.completionLabel, { color: colors.mutedForeground }]}>
              {completionPct < 100
                ? "Complete your profile for better retailer recommendations"
                : "Profile complete — ready to share with retailers"}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
        showsVerticalScrollIndicator={false}
      >
        {/* CONTACT */}
        <SectionLabel label="Contact" colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <InlineField
            icon="user"
            placeholder="Full name"
            value={profile.name}
            onChangeText={(v) => saveProfile({ name: v })}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            colors={colors}
          />
          <FieldDivider colors={colors} />
          <InlineField
            ref={emailRef}
            icon="mail"
            placeholder="Email address"
            value={profile.email}
            onChangeText={(v) => saveProfile({ email: v })}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            colors={colors}
          />
          <FieldDivider colors={colors} />
          <InlineField
            ref={phoneRef}
            icon="phone"
            placeholder="Phone number"
            value={profile.phone}
            onChangeText={(v) => saveProfile({ phone: v })}
            keyboardType="phone-pad"
            returnKeyType="done"
            colors={colors}
          />
        </View>

        {/* SIZES */}
        <SectionLabel label="Jewelry Sizes" colors={colors} />
        <View style={styles.sectionGap}>
          <FieldLabel label="Ring Size" colors={colors} />
          <View style={styles.pillRow}>
            {RING_SIZES.map((s) => (
              <Pill
                key={s}
                label={s}
                selected={profile.ringSize === s}
                onPress={() => selectSingle("ringSize", s)}
                colors={colors}
              />
            ))}
          </View>

          <FieldLabel label="Bracelet Size" colors={colors} style={{ marginTop: 16 }} />
          <View style={styles.pillRow}>
            {BRACELET_SIZES.map((s) => (
              <Pill
                key={s}
                label={s}
                selected={profile.braceletSize === s}
                onPress={() => selectSingle("braceletSize", s)}
                colors={colors}
              />
            ))}
          </View>

          <FieldLabel label="Necklace Length" colors={colors} style={{ marginTop: 16 }} />
          <View style={styles.pillRow}>
            {NECKLACE_LENGTHS.map((s) => (
              <Pill
                key={s}
                label={s}
                selected={profile.necklaceLength === s}
                onPress={() => selectSingle("necklaceLength", s)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* STYLE */}
        <SectionLabel label="Style Preferences" colors={colors} />
        <View style={styles.sectionGap}>
          <FieldLabel label="Preferred Gold Color" colors={colors} />
          <View style={styles.pillRow}>
            {GOLD_COLORS.map((c) => (
              <Pill
                key={c}
                label={c}
                selected={profile.preferredGoldColor === c}
                onPress={() => selectSingle("preferredGoldColor", c)}
                colors={colors}
              />
            ))}
          </View>

          <FieldLabel label="Preferred Metals" colors={colors} style={{ marginTop: 16 }} />
          <View style={styles.pillRow}>
            {METALS.map((m) => (
              <Pill
                key={m}
                label={m}
                selected={(profile.preferredMetals ?? []).includes(m)}
                onPress={() => toggleMulti("preferredMetals", m)}
                colors={colors}
              />
            ))}
          </View>

          <FieldLabel label="Preferred Stones" colors={colors} style={{ marginTop: 16 }} />
          <View style={styles.pillRow}>
            {STONES.map((s) => (
              <Pill
                key={s}
                label={s}
                selected={(profile.preferredStones ?? []).includes(s)}
                onPress={() => toggleMulti("preferredStones", s)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* SPECIAL DATES */}
        <SectionLabel label="Special Dates" colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <DateRow
            icon="gift"
            label="Birthday"
            value={profile.birthday}
            onPress={() => setActivePicker("birthday")}
            onClear={() => saveProfile({ birthday: "" })}
            colors={colors}
          />
          <FieldDivider colors={colors} />
          <DateRow
            icon="heart"
            label="Anniversary"
            value={profile.anniversary}
            onPress={() => setActivePicker("anniversary")}
            onClear={() => saveProfile({ anniversary: "" })}
            colors={colors}
          />
        </View>

        {/* SHOPPING */}
        <SectionLabel label="Shopping Preferences" colors={colors} />
        <View style={styles.sectionGap}>
          <FieldLabel label="Budget Range" colors={colors} />
          <View style={styles.pillRow}>
            {BUDGET_RANGES.map((b) => (
              <Pill
                key={b}
                label={b}
                selected={profile.budgetRange === b}
                onPress={() => selectSingle("budgetRange", b)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        <View style={[styles.privacyNote, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="lock" size={13} color={colors.mutedForeground} />
          <Text style={[styles.privacyText, { color: colors.mutedForeground }]}>
            Stored privately on your device. Only shared with retailers when you explicitly opt in.
          </Text>
        </View>
      </KeyboardAwareScrollView>

      <DatePickerModal
        visible={activePicker !== null}
        value={activePicker ? dateValues[activePicker] : ""}
        label={activePicker === "birthday" ? "Birthday" : "Anniversary"}
        onConfirm={(date) => {
          if (activePicker) saveProfile({ [activePicker]: date } as any);
          setActivePicker(null);
        }}
        onCancel={() => setActivePicker(null)}
      />
    </View>
  );
}

const InlineField = React.forwardRef<
  TextInput,
  {
    icon: string;
    placeholder: string;
    value: string;
    onChangeText: (v: string) => void;
    keyboardType?: "default" | "email-address" | "phone-pad";
    autoCapitalize?: "none" | "words";
    returnKeyType?: "next" | "done";
    onSubmitEditing?: () => void;
    colors: ReturnType<typeof useColors>;
  }
>(function InlineField(
  { icon, placeholder, value, onChangeText, keyboardType = "default", autoCapitalize = "words", returnKeyType = "done", onSubmitEditing, colors },
  ref
) {
  return (
    <View style={styles.inlineField}>
      <Feather name={icon as any} size={16} color={colors.mutedForeground} style={styles.fieldIcon} />
      <TextInput
        ref={ref}
        style={[styles.fieldInput, { color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={returnKeyType === "done"}
      />
    </View>
  );
});

function DateRow({ icon, label, value, onPress, onClear, colors }: {
  icon: string; label: string; value: string;
  onPress: () => void; onClear: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable onPress={onPress} style={styles.dateRow}>
      <Feather name={icon as any} size={16} color={value ? colors.primary : colors.mutedForeground} style={styles.fieldIcon} />
      <View style={styles.dateRowContent}>
        <Text style={[styles.dateRowLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.dateRowValue, { color: value ? colors.foreground : colors.mutedForeground }]}>
          {value ? formatDate(value) : "Not set"}
        </Text>
      </View>
      {value ? (
        <Pressable onPress={(e) => { e.stopPropagation(); onClear(); }} hitSlop={10}>
          <Feather name="x" size={15} color={colors.mutedForeground} />
        </Pressable>
      ) : (
        <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

function Pill({ label, selected, onPress, colors }: {
  label: string; selected: boolean;
  onPress: () => void; colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, {
        backgroundColor: selected ? colors.primary : colors.secondary,
        borderColor: selected ? colors.primary : colors.border,
      }]}
    >
      <Text style={[styles.pillText, { color: selected ? colors.primaryForeground : colors.foreground }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function SectionLabel({ label, colors }: { label: string; colors: ReturnType<typeof useColors> }) {
  return (
    <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
      {label.toUpperCase()}
    </Text>
  );
}

function FieldLabel({ label, colors, style }: { label: string; colors: ReturnType<typeof useColors>; style?: object }) {
  return (
    <Text style={[styles.fieldLabel, { color: colors.mutedForeground }, style]}>{label}</Text>
  );
}

function FieldDivider({ colors }: { colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 44 }]} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  completionWrap: { flex: 1, gap: 8 },
  completionBarBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  completionBarFill: { height: 6, borderRadius: 3 },
  completionLabel: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 16 },
  scroll: { paddingHorizontal: 20, paddingTop: 16, gap: 6 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 2,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionGap: { gap: 0 },
  inlineField: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  fieldIcon: { width: 20, textAlign: "center" },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
  },
  divider: { height: StyleSheet.hairlineWidth },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dateRowContent: { flex: 1 },
  dateRowLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 2 },
  dateRowValue: { fontSize: 15, fontFamily: "Inter_400Regular" },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 8, marginLeft: 2 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  privacyNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
  },
  privacyText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
});
