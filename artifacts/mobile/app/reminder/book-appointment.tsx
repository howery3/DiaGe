import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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

const TIME_PREFS = [
  { id: "morning", label: "Morning", sub: "9 AM – 12 PM", icon: "sunrise" },
  { id: "afternoon", label: "Afternoon", sub: "12 PM – 4 PM", icon: "sun" },
  { id: "evening", label: "Evening", sub: "4 PM – 6 PM", icon: "sunset" },
  { id: "flexible", label: "Flexible", sub: "Any time works", icon: "clock" },
];

const DATE_PREFS = [
  { id: "asap", label: "As soon as possible" },
  { id: "thisweek", label: "This week" },
  { id: "nextweek", label: "Next week" },
  { id: "ondate", label: "On the reminder date" },
];

function fmt(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function gcalDate(iso: string): string {
  // Format: 20250115T100000Z
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export default function BookAppointmentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { reminderId } = useLocalSearchParams<{ reminderId: string }>();
  const { reminders } = useDiGe();
  const reminder = reminders.find((r) => r.id === reminderId);

  const [timePref, setTimePref] = useState("morning");
  const [datePref, setDatePref] = useState("asap");

  if (!reminder) {
    return (
      <>
        <Stack.Screen options={{ title: "Book Appointment" }} />
        <View style={[styles.root, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Reminder not found.</Text>
        </View>
      </>
    );
  }

  const timeLabel = TIME_PREFS.find((t) => t.id === timePref)?.label ?? "Morning";
  const dateLabel = DATE_PREFS.find((d) => d.id === datePref)?.label ?? "As soon as possible";
  const reminderDate = fmt(reminder.scheduledDate);

  function buildEmailBody(): string {
    return [
      `Hello ${reminder!.retailer || "team"},`,
      "",
      `I'd like to schedule a jewelry inspection appointment at your store.`,
      "",
      "APPOINTMENT DETAILS",
      `Item: ${reminder!.jewelryName}`,
      `Preferred Timing: ${timeLabel}`,
      `Preferred Date: ${dateLabel}`,
      `Inspection Due: ${reminderDate}`,
      "",
      "Please let me know your available dates and times. Thank you!",
    ].join("\n");
  }

  async function handleEmail() {
    const subject = encodeURIComponent(`Inspection Appointment Request — ${reminder!.jewelryName}`);
    const body = encodeURIComponent(buildEmailBody());
    const mailto = `mailto:?subject=${subject}&body=${body}`;
    const canOpen = await Linking.canOpenURL(mailto);
    if (canOpen) Linking.openURL(mailto);
  }

  async function handleSearch() {
    const q = encodeURIComponent(`${reminder!.retailer} jewelry store contact appointment`);
    Linking.openURL(`https://www.google.com/search?q=${q}`);
  }

  async function handleCall() {
    const q = encodeURIComponent(`${reminder!.retailer} jewelry store phone number`);
    if (Platform.OS !== "web") {
      // On native, search for their number; we don't store retailer phone numbers yet
      Linking.openURL(`https://www.google.com/search?q=${q}`);
    } else {
      Linking.openURL(`https://www.google.com/search?q=${q}`);
    }
  }

  async function handleAddCalendar() {
    // Use Google Calendar URL — works on all platforms, no package needed
    const start = new Date(reminder!.scheduledDate);
    start.setHours(9, 0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const title = encodeURIComponent(`Jewelry Inspection — ${reminder!.jewelryName}`);
    const details = encodeURIComponent(
      `Inspection at ${reminder!.retailer || "jeweler"}.\n\nTime preference: ${timeLabel}\n\nScheduled via DiGe.`
    );
    const startStr = gcalDate(start.toISOString());
    const endStr = gcalDate(end.toISOString());
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}`;
    Linking.openURL(url);
  }

  const urgencyDays = Math.ceil(
    (new Date(reminder.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = urgencyDays < 0;
  const urgencyColor = isOverdue ? "#DC2626" : urgencyDays <= 30 ? "#B45309" : "#15803D";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Book Appointment",
          presentation: "modal",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Reminder summary */}
        <View style={[styles.summaryCard, { backgroundColor: "#5B21B6" }]}>
          <View style={styles.summaryTop}>
            <View style={[styles.summaryIcon, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Feather name="calendar" size={20} color="#fff" />
            </View>
            <View style={styles.summaryText}>
              <Text style={styles.summaryName}>{reminder.jewelryName}</Text>
              {reminder.retailer ? (
                <Text style={styles.summaryRetailer}>{reminder.retailer}</Text>
              ) : null}
            </View>
            <View style={[styles.urgBadge, { backgroundColor: urgencyColor + "30" }]}>
              <Text style={[styles.urgText, { color: urgencyColor === "#DC2626" ? "#FCA5A5" : urgencyColor === "#B45309" ? "#FCD34D" : "#86EFAC" }]}>
                {isOverdue ? "Overdue" : urgencyDays === 0 ? "Today" : `${urgencyDays}d`}
              </Text>
            </View>
          </View>
          <View style={[styles.summaryDateRow, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
            <Feather name="clock" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.summaryDate}>
              Inspection due {reminderDate}
            </Text>
          </View>
        </View>

        {/* Time preference */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Preferred Time</Text>
        <View style={styles.timeGrid}>
          {TIME_PREFS.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTimePref(t.id)}
              style={[
                styles.timeOption,
                {
                  backgroundColor: colors.card,
                  borderColor: timePref === t.id ? colors.primary : colors.border,
                  borderWidth: timePref === t.id ? 2 : 1,
                },
              ]}
            >
              <Feather
                name={t.icon as any}
                size={18}
                color={timePref === t.id ? colors.primary : colors.mutedForeground}
              />
              <Text style={[styles.timeLabel, { color: timePref === t.id ? colors.primary : colors.foreground }]}>
                {t.label}
              </Text>
              <Text style={[styles.timeSub, { color: colors.mutedForeground }]}>{t.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* Date preference */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Preferred Date</Text>
        <View style={[styles.dateList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {DATE_PREFS.map((d, idx) => (
            <Pressable
              key={d.id}
              onPress={() => setDatePref(d.id)}
              style={[
                styles.dateOption,
                idx < DATE_PREFS.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.dateRadio,
                  {
                    borderColor: datePref === d.id ? colors.primary : colors.border,
                    backgroundColor: datePref === d.id ? colors.primary : "transparent",
                  },
                ]}
              >
                {datePref === d.id ? <Feather name="check" size={11} color="#fff" /> : null}
              </View>
              <Text style={[styles.dateLabel, { color: colors.foreground }]}>{d.label}</Text>
              {d.id === "ondate" && (
                <Text style={[styles.dateHint, { color: colors.mutedForeground }]}>
                  {fmt(reminder.scheduledDate).split(",")[0]}
                </Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* Contact options */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Contact the Store</Text>
        <View style={styles.actionList}>
          <ActionCard
            icon="mail"
            title="Email Appointment Request"
            sub="Sends a pre-written request with your preferred time and inspection details"
            color={colors.primary}
            colors={colors}
            onPress={handleEmail}
            primary
          />
          <ActionCard
            icon="phone"
            title="Find Phone Number"
            sub={`Search online for ${reminder.retailer || "the store"}'s contact number`}
            color="#0E6655"
            colors={colors}
            onPress={handleCall}
          />
          <ActionCard
            icon="globe"
            title="Search Store Online"
            sub={`Find ${reminder.retailer || "the retailer"}'s website, hours, and contact info`}
            color="#B45309"
            colors={colors}
            onPress={handleSearch}
          />
          <ActionCard
            icon="calendar"
            title="Add to My Calendar"
            sub="Save this inspection as a calendar event with your time preference"
            color="#7C3AED"
            colors={colors}
            onPress={handleAddCalendar}
          />
        </View>

        {/* Summary of what will be sent */}
        <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.previewHeader}>
            <Feather name="file-text" size={14} color={colors.mutedForeground} />
            <Text style={[styles.previewTitle, { color: colors.mutedForeground }]}>Email Preview</Text>
          </View>
          <Text style={[styles.previewSubject, { color: colors.foreground }]}>
            Subject: Inspection Appointment Request — {reminder.jewelryName}
          </Text>
          <Text style={[styles.previewBody, { color: colors.mutedForeground }]}>
            {buildEmailBody()}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

function ActionCard({
  icon,
  title,
  sub,
  color,
  colors,
  onPress,
  primary,
}: {
  icon: string;
  title: string;
  sub: string;
  color: string;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        {
          backgroundColor: primary ? color : colors.card,
          borderColor: primary ? color : colors.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.actionIcon,
          { backgroundColor: primary ? "rgba(255,255,255,0.2)" : color + "15" },
        ]}
      >
        <Feather name={icon as any} size={18} color={primary ? "#fff" : color} />
      </View>
      <View style={styles.actionText}>
        <Text style={[styles.actionTitle, { color: primary ? "#fff" : colors.foreground }]}>
          {title}
        </Text>
        <Text style={[styles.actionSub, { color: primary ? "rgba(255,255,255,0.75)" : colors.mutedForeground }]}>
          {sub}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={primary ? "rgba(255,255,255,0.6)" : colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 20, gap: 14 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },

  summaryCard: { borderRadius: 18, padding: 16, gap: 12 },
  summaryTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  summaryIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  summaryText: { flex: 1, gap: 2 },
  summaryName: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  summaryRetailer: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  urgBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  urgText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  summaryDateRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 10 },
  summaryDate: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.85)" },

  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginTop: 4 },

  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  timeOption: {
    width: "47%",
    borderRadius: 14,
    padding: 14,
    gap: 6,
    alignItems: "flex-start",
  },
  timeLabel: { fontSize: 14, fontFamily: "Inter_700Bold" },
  timeSub: { fontSize: 11, fontFamily: "Inter_400Regular" },

  dateList: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  dateOption: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  dateRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  dateLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  dateHint: { fontSize: 11, fontFamily: "Inter_400Regular" },

  actionList: { gap: 10 },
  actionCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  actionIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  actionText: { flex: 1, gap: 2 },
  actionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  actionSub: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 15 },

  previewCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  previewHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  previewTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  previewSubject: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  previewBody: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
