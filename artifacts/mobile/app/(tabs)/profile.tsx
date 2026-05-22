import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import { captureRef } from "react-native-view-shot";
import {
  ActionSheetIOS,
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DatePickerModal } from "@/components/DatePickerModal";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RING_SIZES = ["4", "4½", "5", "5½", "6", "6½", "7", "7½", "8", "8½", "9", "9½", "10", "10½", "11", "11½", "12"];
const BRACELET_SIZES = ['6"', '6½"', '7"', '7½"', '8"', '8½"'];
const NECKLACE_LENGTHS = ['14"', '16"', '18"', '20"', '22"', '24"', '30"'];
const GOLD_COLORS = ["Yellow Gold", "White Gold", "Rose Gold", "Two-Tone", "Platinum"];
const METALS = ["Gold", "Silver", "Platinum", "Sterling Silver", "Titanium", "Stainless Steel"];
const STONES = ["Diamond", "Sapphire", "Ruby", "Emerald", "Pearl", "Opal", "Amethyst", "Topaz", "Garnet"];
const BUDGET_RANGES = ["Under $500", "$500–$1K", "$1K–$2.5K", "$2.5K–$5K", "$5K–$10K", "$10K+"];

type Section = "contact" | "sizes" | "style" | "dates" | "shopping";
type DateField = "birthday" | "anniversary";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, saveProfile, initials, completionPct, hasProfile, buildShareText } = useProfile();
  const [openSection, setOpenSection] = useState<Section | null>("contact");
  const [activePicker, setActivePicker] = useState<DateField | null>(null);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const profileShareRef = useRef<View>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function toggleSection(s: Section) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection((prev) => (prev === s ? null : s));
  }

  function toggleMulti(field: "preferredMetals" | "preferredStones", value: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const current: string[] = profile[field] ?? [];
    const next = current.includes(value) ? current.filter((x) => x !== value) : [...current, value];
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
      const uri = await captureRef(profileShareRef, { format: "png", quality: 1, result: "tmpfile" });
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "My Jewelry Profile" });
      } else {
        Alert.alert("Sharing not available", "Your device doesn't support image sharing.");
      }
    } catch { }
  }

  // Summary strings shown on closed accordion headers
  const contactSummary = [profile.name, profile.email, profile.phone].filter(Boolean).join(" · ") || "Not set";
  const sizesSummary = [
    profile.ringSize && `Ring ${profile.ringSize}`,
    profile.braceletSize && `Bracelet ${profile.braceletSize}`,
    profile.necklaceLength && `Necklace ${profile.necklaceLength}`,
  ].filter(Boolean).join(" · ") || "Not set";
  const styleSummary = [
    profile.preferredGoldColor,
    ...(profile.preferredMetals ?? []).slice(0, 2),
    ...(profile.preferredStones ?? []).slice(0, 2),
  ].filter(Boolean).join(", ") || "Not set";
  const datesSummary = [
    profile.birthday && `Birthday ${formatDate(profile.birthday)}`,
    profile.anniversary && `Anniversary ${formatDate(profile.anniversary)}`,
  ].filter(Boolean).join(" · ") || "Not set";
  const shoppingSummary = profile.budgetRange || "Not set";

  const profileInitials = initials();
  const shareDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      {/* Off-screen profile snapshot card */}
      <View ref={profileShareRef} collapsable={false} style={snap.card} pointerEvents="none">
        {/* Header */}
        <View style={snap.header}>
          <View style={snap.headerRow}>
            <View style={snap.logoBadge}>
              <Text style={snap.logoEmoji}>💎</Text>
            </View>
            <View style={snap.headerText}>
              <Text style={snap.brandName}>DiaGe</Text>
              <Text style={snap.headerSub}>Jewelry Profile</Text>
            </View>
          </View>
          {profile.name ? (
            <Text style={snap.profileName}>{profile.name}</Text>
          ) : null}
          <Text style={snap.metaLine}>{shareDate}</Text>
        </View>

        {/* Sizes */}
        {(profile.ringSize || profile.braceletSize || profile.necklaceLength) ? (
          <View style={snap.section}>
            <Text style={snap.sectionTitle}>SIZES</Text>
            <View style={snap.rowList}>
              {profile.ringSize ? <Text style={snap.rowItem}>Ring  <Text style={snap.rowValue}>{profile.ringSize}</Text></Text> : null}
              {profile.braceletSize ? <Text style={snap.rowItem}>Bracelet  <Text style={snap.rowValue}>{profile.braceletSize}</Text></Text> : null}
              {profile.necklaceLength ? <Text style={snap.rowItem}>Necklace  <Text style={snap.rowValue}>{profile.necklaceLength}</Text></Text> : null}
            </View>
          </View>
        ) : null}

        {/* Style preferences */}
        {(profile.preferredGoldColor || (profile.preferredMetals ?? []).length > 0 || (profile.preferredStones ?? []).length > 0) ? (
          <View style={[snap.section, snap.sectionBorder]}>
            <Text style={snap.sectionTitle}>STYLE PREFERENCES</Text>
            <View style={snap.rowList}>
              {profile.preferredGoldColor ? <Text style={snap.rowItem}>Gold  <Text style={snap.rowValue}>{profile.preferredGoldColor}</Text></Text> : null}
              {(profile.preferredMetals ?? []).length > 0 ? <Text style={snap.rowItem}>Metals  <Text style={snap.rowValue}>{profile.preferredMetals.join(", ")}</Text></Text> : null}
              {(profile.preferredStones ?? []).length > 0 ? <Text style={snap.rowItem}>Stones  <Text style={snap.rowValue}>{profile.preferredStones.join(", ")}</Text></Text> : null}
            </View>
          </View>
        ) : null}

        {/* Special dates */}
        {(profile.birthday || profile.anniversary) ? (
          <View style={[snap.section, snap.sectionBorder]}>
            <Text style={snap.sectionTitle}>SPECIAL DATES</Text>
            <View style={snap.rowList}>
              {profile.birthday ? <Text style={snap.rowItem}>Birthday  <Text style={snap.rowValue}>{formatDate(profile.birthday)}</Text></Text> : null}
              {profile.anniversary ? <Text style={snap.rowItem}>Anniversary  <Text style={snap.rowValue}>{formatDate(profile.anniversary)}</Text></Text> : null}
            </View>
          </View>
        ) : null}

        {/* Budget */}
        {profile.budgetRange ? (
          <View style={[snap.section, snap.sectionBorder]}>
            <Text style={snap.sectionTitle}>SHOPPING</Text>
            <Text style={snap.rowItem}>Budget  <Text style={snap.rowValue}>{profile.budgetRange}</Text></Text>
          </View>
        ) : null}

        {/* Contact */}
        {(profile.email || profile.phone) ? (
          <View style={snap.contact}>
            <View style={snap.contactRow}>
              {profile.phone ? <Text style={snap.contactDetail}>📞 {profile.phone}</Text> : null}
              {profile.email ? <Text style={snap.contactDetail}>📧 {profile.email}</Text> : null}
            </View>
          </View>
        ) : null}

        {/* Footer */}
        <View style={snap.footer}>
          <Text style={snap.footerText}>📱 Download DiaGe on the App Store</Text>
          <Text style={snap.footerSub}>diageapp.com</Text>
        </View>
      </View>

    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Hero ── */}
      <LinearGradient
        colors={["#4C1D95", "#6D28D9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: topPad + 10 }]}
      >
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

        <View style={styles.avatarRow}>
          <Pressable onPress={pickPhoto} style={styles.avatarPressable}>
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatarImg} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
                {hasProfile
                  ? <Text style={styles.avatarInitials}>{profileInitials}</Text>
                  : <Feather name="user" size={30} color="rgba(255,255,255,0.6)" />}
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={11} color="#fff" />
            </View>
          </Pressable>

          <View style={styles.avatarMeta}>
            <Text style={[styles.heroName, !profile.name && { opacity: 0.45 }]}>
              {profile.name || "Add your name"}
            </Text>
            {(profile.email || profile.phone) ? (
              <Text style={styles.heroSub}>{profile.email || profile.phone}</Text>
            ) : null}
            <View style={styles.completionRow}>
              <View style={styles.completionBarBg}>
                <View style={[styles.completionBarFill, { width: `${completionPct}%` as any }]} />
              </View>
              <Text style={styles.completionPct}>{completionPct}%</Text>
            </View>
          </View>
        </View>

        <Pressable onPress={handleShare} style={styles.shareCta}>
          <Feather name="share-2" size={14} color="#fff" />
          <Text style={styles.shareCtaText}>Share with friends & family</Text>
          <Feather name="chevron-right" size={14} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </LinearGradient>

      {/* ── Accordions ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Contact */}
        <Accordion
          icon="user"
          title="Contact"
          summary={contactSummary}
          open={openSection === "contact"}
          onToggle={() => toggleSection("contact")}
          colors={colors}
        >
          <View style={[styles.cardInner, { borderTopColor: colors.border }]}>
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
        </Accordion>

        {/* Jewelry Sizes */}
        <Accordion
          icon="maximize-2"
          title="Jewelry Sizes"
          summary={sizesSummary}
          open={openSection === "sizes"}
          onToggle={() => toggleSection("sizes")}
          colors={colors}
        >
          <View style={[styles.cardInner, { borderTopColor: colors.border }]}>
            <SubLabel label="Ring Size" colors={colors} />
            <PillRow>
              {RING_SIZES.map((s) => (
                <Pill key={s} label={s} selected={profile.ringSize === s} onPress={() => selectSingle("ringSize", s)} colors={colors} />
              ))}
            </PillRow>
            <SubLabel label="Bracelet Size" colors={colors} />
            <PillRow>
              {BRACELET_SIZES.map((s) => (
                <Pill key={s} label={s} selected={profile.braceletSize === s} onPress={() => selectSingle("braceletSize", s)} colors={colors} />
              ))}
            </PillRow>
            <SubLabel label="Necklace Length" colors={colors} />
            <PillRow>
              {NECKLACE_LENGTHS.map((s) => (
                <Pill key={s} label={s} selected={profile.necklaceLength === s} onPress={() => selectSingle("necklaceLength", s)} colors={colors} />
              ))}
            </PillRow>
          </View>
        </Accordion>

        {/* Style Preferences */}
        <Accordion
          icon="star"
          title="Style Preferences"
          summary={styleSummary}
          open={openSection === "style"}
          onToggle={() => toggleSection("style")}
          colors={colors}
        >
          <View style={[styles.cardInner, { borderTopColor: colors.border }]}>
            <SubLabel label="Preferred Gold Color" colors={colors} />
            <PillRow>
              {GOLD_COLORS.map((c) => (
                <Pill key={c} label={c} selected={profile.preferredGoldColor === c} onPress={() => selectSingle("preferredGoldColor", c)} colors={colors} />
              ))}
            </PillRow>
            <SubLabel label="Preferred Metals" colors={colors} />
            <PillRow>
              {METALS.map((m) => (
                <Pill key={m} label={m} selected={(profile.preferredMetals ?? []).includes(m)} onPress={() => toggleMulti("preferredMetals", m)} colors={colors} />
              ))}
            </PillRow>
            <SubLabel label="Preferred Stones" colors={colors} />
            <PillRow>
              {STONES.map((s) => (
                <Pill key={s} label={s} selected={(profile.preferredStones ?? []).includes(s)} onPress={() => toggleMulti("preferredStones", s)} colors={colors} />
              ))}
            </PillRow>
          </View>
        </Accordion>

        {/* Special Dates */}
        <Accordion
          icon="calendar"
          title="Special Dates"
          summary={datesSummary}
          open={openSection === "dates"}
          onToggle={() => toggleSection("dates")}
          colors={colors}
        >
          <View style={[styles.cardInner, { borderTopColor: colors.border }]}>
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
        </Accordion>

        {/* Shopping */}
        <Accordion
          icon="shopping-bag"
          title="Shopping Preferences"
          summary={shoppingSummary}
          open={openSection === "shopping"}
          onToggle={() => toggleSection("shopping")}
          colors={colors}
        >
          <View style={[styles.cardInner, { borderTopColor: colors.border }]}>
            <SubLabel label="Budget Range" colors={colors} />
            <PillRow>
              {BUDGET_RANGES.map((b) => (
                <Pill key={b} label={b} selected={profile.budgetRange === b} onPress={() => selectSingle("budgetRange", b)} colors={colors} />
              ))}
            </PillRow>
          </View>
        </Accordion>

        {/* Share button */}
        <Pressable onPress={handleShare} style={({ pressed }) => [styles.shareButton, { opacity: pressed ? 0.85 : 1 }]}>
          <LinearGradient colors={["#5B21B6", "#7C3AED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.shareButtonGrad}>
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
      </ScrollView>

      <DatePickerModal
        visible={activePicker !== null}
        value={activePicker === "birthday" ? profile.birthday : profile.anniversary}
        label={activePicker === "birthday" ? "Birthday" : "Anniversary"}
        onConfirm={(date) => {
          if (activePicker) saveProfile({ [activePicker]: date } as any);
          setActivePicker(null);
        }}
        onCancel={() => setActivePicker(null)}
      />
    </View>
    </>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────

function Accordion({
  icon, title, summary, open, onToggle, colors, children,
}: {
  icon: string; title: string; summary: string; open: boolean;
  onToggle: () => void; colors: ReturnType<typeof useColors>; children: React.ReactNode;
}) {
  return (
    <View style={[styles.accordionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable onPress={onToggle} style={styles.accordionHeader}>
        <View style={[styles.accordionIconWrap, { backgroundColor: open ? "#5B21B6" : colors.secondary }]}>
          <Feather name={icon as any} size={15} color={open ? "#fff" : colors.mutedForeground} />
        </View>
        <View style={styles.accordionMeta}>
          <Text style={[styles.accordionTitle, { color: colors.foreground }]}>{title}</Text>
          {!open && (
            <Text style={[styles.accordionSummary, { color: colors.mutedForeground }]} numberOfLines={1}>
              {summary}
            </Text>
          )}
        </View>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.mutedForeground}
        />
      </Pressable>
      {open && children}
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const InlineField = React.forwardRef<
  TextInput,
  {
    icon: string; placeholder: string; value: string; onChangeText: (v: string) => void;
    keyboardType?: "default" | "email-address" | "phone-pad"; autoCapitalize?: "none" | "words";
    returnKeyType?: "next" | "done"; onSubmitEditing?: () => void;
    colors: ReturnType<typeof useColors>;
  }
>(function InlineField({ icon, placeholder, value, onChangeText, keyboardType = "default", autoCapitalize = "words", returnKeyType = "done", onSubmitEditing, colors }, ref) {
  return (
    <View style={styles.inlineField}>
      <Feather name={icon as any} size={15} color={colors.mutedForeground} style={styles.fieldIcon} />
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
  onPress: () => void; onClear: () => void; colors: ReturnType<typeof useColors>;
}) {
  const full = value ? new Date(value + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
  return (
    <Pressable onPress={onPress} style={styles.dateRow}>
      <Feather name={icon as any} size={15} color={value ? "#7C3AED" : colors.mutedForeground} style={styles.fieldIcon} />
      <View style={styles.dateRowContent}>
        <Text style={[styles.dateRowLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.dateRowValue, { color: value ? colors.foreground : colors.mutedForeground }]}>
          {full || "Not set"}
        </Text>
      </View>
      {value
        ? <Pressable onPress={(e) => { e.stopPropagation(); onClear(); }} hitSlop={10}><Feather name="x" size={14} color={colors.mutedForeground} /></Pressable>
        : <Feather name="chevron-right" size={14} color={colors.mutedForeground} />}
    </Pressable>
  );
}

function PillRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.pillRow}>{children}</View>;
}

function Pill({ label, selected, onPress, colors }: {
  label: string; selected: boolean; onPress: () => void; colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, { backgroundColor: selected ? "#5B21B6" : colors.secondary, borderColor: selected ? "#5B21B6" : colors.border }]}
    >
      <Text style={[styles.pillText, { color: selected ? "#fff" : colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

function SubLabel({ label, colors }: { label: string; colors: ReturnType<typeof useColors> }) {
  return <Text style={[styles.subLabel, { color: colors.mutedForeground }]}>{label}</Text>;
}

function FieldDivider({ colors }: { colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 42 }]} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Hero
  hero: { paddingHorizontal: 20, paddingBottom: 18 },
  heroBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  heroTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.4 },
  heroActions: { flexDirection: "row", gap: 10 },
  heroBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },

  avatarRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  avatarPressable: { position: "relative", flexShrink: 0 },
  avatarImg: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: "rgba(255,255,255,0.3)" },
  avatarFallback: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.2)" },
  avatarInitials: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#fff" },
  cameraBadge: { position: "absolute", bottom: 2, right: 2, width: 24, height: 24, borderRadius: 12, backgroundColor: "#7C3AED", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#4C1D95" },
  avatarMeta: { flex: 1, gap: 4 },
  heroName: { fontSize: 19, fontFamily: "Inter_700Bold", color: "#fff" },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  completionRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  completionBarBg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.2)", overflow: "hidden" },
  completionBarFill: { height: 4, borderRadius: 2, backgroundColor: "#A78BFA" },
  completionPct: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.8)", width: 30, textAlign: "right" },

  shareCta: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  shareCtaText: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },

  // Scroll / layout
  scroll: { padding: 16, gap: 10 },

  // Accordion card
  accordionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  accordionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  accordionIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  accordionMeta: { flex: 1, gap: 2 },
  accordionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  accordionSummary: { fontSize: 12, fontFamily: "Inter_400Regular" },

  // Card inner content
  cardInner: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },

  // Inline field
  inlineField: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  fieldIcon: { width: 18, textAlign: "center" },
  fieldInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", paddingVertical: 0 },
  divider: { height: StyleSheet.hairlineWidth },

  // Date row
  dateRow: { flexDirection: "row", alignItems: "center", paddingVertical: 13, gap: 12 },
  dateRowContent: { flex: 1 },
  dateRowLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 2 },
  dateRowValue: { fontSize: 15, fontFamily: "Inter_400Regular" },

  // Pills
  subLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, marginTop: 14, marginBottom: 8 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },

  // Share button
  shareButton: { borderRadius: 16, overflow: "hidden", marginTop: 6 },
  shareButtonGrad: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16 },
  shareButtonText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },

  // Privacy note
  privacyNote: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, marginTop: 2 },
  privacyText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
});

const SNAP_WIDTH = 360;
const SNAP_PRIMARY = "#4C1D95";
const SNAP_ACCENT = "#5B21B6";

const snap = StyleSheet.create({
  card: {
    position: "absolute",
    left: -2000,
    top: 0,
    width: SNAP_WIDTH,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  header: {
    backgroundColor: SNAP_PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    gap: 8,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  logoBadge: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  logoEmoji: { fontSize: 18 },
  headerText: { gap: 1 },
  brandName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: {
    fontSize: 10, fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  profileName: {
    fontSize: 24, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.4,
  },
  metaLine: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.55)" },

  section: { paddingHorizontal: 20, paddingVertical: 14 },
  sectionBorder: { borderTopWidth: 1, borderTopColor: "#F0ECF8" },
  sectionTitle: {
    fontSize: 10, fontFamily: "Inter_700Bold",
    color: SNAP_ACCENT, letterSpacing: 0.8,
    textTransform: "uppercase", marginBottom: 10,
  },
  rowList: { gap: 6 },
  rowItem: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#555" },
  rowValue: { fontFamily: "Inter_600SemiBold", color: "#1A1A2E" },

  contact: {
    backgroundColor: "#F8F7FF",
    paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: "#E8E3F5",
    gap: 4,
  },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  contactDetail: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#555" },

  footer: {
    backgroundColor: SNAP_PRIMARY,
    paddingVertical: 10, paddingHorizontal: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11, fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.75)", letterSpacing: 0.2,
  },
  footerSub: {
    fontSize: 10, fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.4)", letterSpacing: 0.3, marginTop: 2,
  },
});
