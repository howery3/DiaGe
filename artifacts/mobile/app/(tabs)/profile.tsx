import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DatePickerModal } from "@/components/DatePickerModal";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";

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
  const { profile, saveProfile, initials, completionPct, hasProfile, buildShareText } = useProfile();
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

  async function pickPhoto() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const launch = async (fromCamera: boolean) => {
      const perm = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!perm.granted) {
        Alert.alert("Permission needed", fromCamera ? "Camera access is required." : "Photo library access is required.");
        return;
      }

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8, mediaTypes: ImagePicker.MediaTypeOptions.Images });

      if (!result.canceled && result.assets[0]) {
        saveProfile({ photoUri: result.assets[0].uri });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    };

    if (Platform.OS === "ios") {
      const options = profile.photoUri
        ? ["Take Photo", "Choose from Library", "Remove Photo", "Cancel"]
        : ["Take Photo", "Choose from Library", "Cancel"];
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: options.length - 1, destructiveButtonIndex: profile.photoUri ? 2 : undefined },
        (idx) => {
          if (idx === 0) launch(true);
          else if (idx === 1) launch(false);
          else if (idx === 2 && profile.photoUri) saveProfile({ photoUri: "" });
        }
      );
    } else {
      Alert.alert("Profile Photo", "Choose a source", [
        { text: "Take Photo", onPress: () => launch(true) },
        { text: "Photo Library", onPress: () => launch(false) },
        ...(profile.photoUri ? [{ text: "Remove Photo", style: "destructive" as const, onPress: () => saveProfile({ photoUri: "" }) }] : []),
        { text: "Cancel", style: "cancel" },
      ]);
    }
  }

  async function handleShare() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({ message: buildShareText() });
    } catch {
      // dismissed
    }
  }

  const dateValues: Record<DateField, string> = {
    birthday: profile.birthday,
    anniversary: profile.anniversary,
  };

  const profileInitials = initials();
  const filled = completionPct;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Hero header */}
      <LinearGradient
        colors={["#4C1D95", "#6D28D9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: topPad + 10 }]}
      >
        {/* Top bar */}
        <View style={styles.heroBar}>
          <Text style={styles.heroTitle}>My Profile</Text>
          <View style={styles.heroActions}>
            <Pressable onPress={handleShare} style={styles.heroBtn} hitSlop={10}>
              <Feather name="share-2" size={18} color="#fff" />
            </Pressable>
            <Pressable onPress={() => router.push("/settings")} style={styles.heroBtn} hitSlop={10}>
              <Feather name="settings" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <Pressable onPress={pickPhoto} style={styles.avatarPressable}>
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatarImg} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
                <Text style={styles.avatarInitials}>{hasProfile ? profileInitials : ""}</Text>
                {!hasProfile && <Feather name="user" size={34} color="rgba(255,255,255,0.6)" />}
              </View>
            )}
            {/* Camera badge */}
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={12} color="#fff" />
            </View>
          </Pressable>

          <View style={styles.avatarMeta}>
            {profile.name ? (
              <Text style={styles.heroName}>{profile.name}</Text>
            ) : (
              <Text style={[styles.heroName, { opacity: 0.5 }]}>Add your name below</Text>
            )}
            {profile.email || profile.phone ? (
              <Text style={styles.heroSub}>{profile.email || profile.phone}</Text>
            ) : null}
          </View>
        </View>

        {/* Completion */}
        <View style={styles.completionRow}>
          <View style={styles.completionBarBg}>
            <View style={[styles.completionBarFill, { width: `${filled}%` as any }]} />
          </View>
          <Text style={styles.completionPct}>{filled}%</Text>
        </View>
        {filled < 100 && (
          <Text style={styles.completionHint}>
            Complete your profile so friends & family know exactly what you love
          </Text>
        )}

        {/* Share CTA */}
        <Pressable onPress={handleShare} style={styles.shareCta}>
          <Feather name="share-2" size={14} color="#fff" />
          <Text style={styles.shareCtaText}>Share with friends & family</Text>
          <Feather name="chevron-right" size={14} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </LinearGradient>

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
        <View>
          <FieldLabel label="Ring Size" colors={colors} />
          <View style={styles.pillRow}>
            {RING_SIZES.map((s) => (
              <Pill key={s} label={s} selected={profile.ringSize === s} onPress={() => selectSingle("ringSize", s)} colors={colors} />
            ))}
          </View>

          <FieldLabel label="Bracelet Size" colors={colors} style={{ marginTop: 16 }} />
          <View style={styles.pillRow}>
            {BRACELET_SIZES.map((s) => (
              <Pill key={s} label={s} selected={profile.braceletSize === s} onPress={() => selectSingle("braceletSize", s)} colors={colors} />
            ))}
          </View>

          <FieldLabel label="Necklace Length" colors={colors} style={{ marginTop: 16 }} />
          <View style={styles.pillRow}>
            {NECKLACE_LENGTHS.map((s) => (
              <Pill key={s} label={s} selected={profile.necklaceLength === s} onPress={() => selectSingle("necklaceLength", s)} colors={colors} />
            ))}
          </View>
        </View>

        {/* STYLE */}
        <SectionLabel label="Style Preferences" colors={colors} />
        <View>
          <FieldLabel label="Preferred Gold Color" colors={colors} />
          <View style={styles.pillRow}>
            {GOLD_COLORS.map((c) => (
              <Pill key={c} label={c} selected={profile.preferredGoldColor === c} onPress={() => selectSingle("preferredGoldColor", c)} colors={colors} />
            ))}
          </View>

          <FieldLabel label="Preferred Metals" colors={colors} style={{ marginTop: 16 }} />
          <View style={styles.pillRow}>
            {METALS.map((m) => (
              <Pill key={m} label={m} selected={(profile.preferredMetals ?? []).includes(m)} onPress={() => toggleMulti("preferredMetals", m)} colors={colors} />
            ))}
          </View>

          <FieldLabel label="Preferred Stones" colors={colors} style={{ marginTop: 16 }} />
          <View style={styles.pillRow}>
            {STONES.map((s) => (
              <Pill key={s} label={s} selected={(profile.preferredStones ?? []).includes(s)} onPress={() => toggleMulti("preferredStones", s)} colors={colors} />
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
        <View>
          <FieldLabel label="Budget Range" colors={colors} />
          <View style={styles.pillRow}>
            {BUDGET_RANGES.map((b) => (
              <Pill key={b} label={b} selected={profile.budgetRange === b} onPress={() => selectSingle("budgetRange", b)} colors={colors} />
            ))}
          </View>
        </View>

        {/* Share button */}
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [styles.shareButton, { opacity: pressed ? 0.85 : 1 }]}
        >
          <LinearGradient
            colors={["#5B21B6", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shareButtonGrad}
          >
            <Feather name="share-2" size={16} color="#fff" />
            <Text style={styles.shareButtonText}>Share My Profile</Text>
          </LinearGradient>
        </Pressable>

        <View style={[styles.privacyNote, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="lock" size={13} color={colors.mutedForeground} />
          <Text style={[styles.privacyText, { color: colors.mutedForeground }]}>
            Stored privately on your device. Only shared when you tap "Share My Profile."
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

// ─── Sub-components ────────────────────────────────────────────────────────────

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
>(function InlineField({ icon, placeholder, value, onChangeText, keyboardType = "default", autoCapitalize = "words", returnKeyType = "done", onSubmitEditing, colors }, ref) {
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
      <Feather name={icon as any} size={16} color={value ? "#7C3AED" : colors.mutedForeground} style={styles.fieldIcon} />
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
        backgroundColor: selected ? "#5B21B6" : colors.secondary,
        borderColor: selected ? "#5B21B6" : colors.border,
      }]}
    >
      <Text style={[styles.pillText, { color: selected ? "#fff" : colors.foreground }]}>
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
  return <Text style={[styles.fieldLabel, { color: colors.mutedForeground }, style]}>{label}</Text>;
}

function FieldDivider({ colors }: { colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 44 }]} />;
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  hero: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  heroTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.4 },
  heroActions: { flexDirection: "row", gap: 10 },
  heroBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarWrap: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  avatarPressable: { position: "relative" },
  avatarImg: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: "rgba(255,255,255,0.3)" },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.2)",
  },
  avatarInitials: { fontSize: 32, fontFamily: "Inter_700Bold", color: "#fff" },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#4C1D95",
  },
  avatarMeta: { flex: 1 },
  heroName: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 4 },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },

  completionRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  completionBarBg: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  completionBarFill: { height: 5, borderRadius: 3, backgroundColor: "#A78BFA" },
  completionPct: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.8)", width: 32, textAlign: "right" },
  completionHint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 14,
    lineHeight: 17,
  },

  shareCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  shareCtaText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },

  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 6 },

  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 2,
  },
  card: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },

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

  shareButton: { marginTop: 28, borderRadius: 16, overflow: "hidden" },
  shareButtonGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  shareButtonText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },

  privacyNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  privacyText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
});
