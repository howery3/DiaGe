import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { MyStoreCard } from "@/components/MyStoreCard";
import { ReminderCard } from "@/components/ReminderCard";
import { useDiGe, type InspectionReminder } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

type Section = { title: string; data: InspectionReminder[]; isRetailer?: boolean };

function buildSections(reminders: InspectionReminder[]): Section[] {
  const active = reminders.filter((r) => !r.isCompleted);
  const completed = reminders.filter((r) => r.isCompleted);

  const retailerMap = new Map<string, InspectionReminder[]>();
  for (const r of active) {
    const key = r.retailer.trim() || "General";
    if (!retailerMap.has(key)) retailerMap.set(key, []);
    retailerMap.get(key)!.push(r);
  }

  for (const [, items] of retailerMap) {
    items.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }

  const sortedEntries = [...retailerMap.entries()].sort(([, a], [, b]) => {
    const aMin = Math.min(...a.map((r) => new Date(r.scheduledDate).getTime()));
    const bMin = Math.min(...b.map((r) => new Date(r.scheduledDate).getTime()));
    return aMin - bMin;
  });

  const sections: Section[] = sortedEntries.map(([retailer, data]) => ({
    title: retailer,
    data,
    isRetailer: true,
  }));

  if (completed.length > 0) {
    const sortedCompleted = [...completed].sort(
      (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );
    sections.push({ title: "Completed", data: sortedCompleted });
  }

  return sections;
}

function urgencyChip(reminder: InspectionReminder, colors: ReturnType<typeof useColors>) {
  const now = Date.now();
  const ms = new Date(reminder.scheduledDate).getTime() - now;
  if (ms < 0) {
    return (
      <View style={[chipStyles.chip, { backgroundColor: "#FEE2E2" }]}>
        <Text style={[chipStyles.text, { color: "#DC2626" }]}>Overdue</Text>
      </View>
    );
  }
  if (ms <= 7 * 24 * 60 * 60 * 1000) {
    return (
      <View style={[chipStyles.chip, { backgroundColor: "#FEF3C7" }]}>
        <Text style={[chipStyles.text, { color: "#D97706" }]}>This week</Text>
      </View>
    );
  }
  if (ms <= 30 * 24 * 60 * 60 * 1000) {
    return (
      <View style={[chipStyles.chip, { backgroundColor: colors.primary + "15" }]}>
        <Text style={[chipStyles.text, { color: colors.primary }]}>Due soon</Text>
      </View>
    );
  }
  return null;
}

const chipStyles = StyleSheet.create({
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: "flex-start" },
  text: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});

export default function RemindersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { reminders, completeReminder, deleteReminder, upcomingReminderCount } = useDiGe();

  const sections = buildSections(reminders);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const fabBottom = insets.bottom + 100;

  async function handleAddReminder() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/reminder/add");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>Reminders</Text>
          {upcomingReminderCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
                {upcomingReminderCount}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Inspection schedule & store booking
        </Text>
      </View>

      {reminders.length === 0 ? (
        <ScrollView
          contentContainerStyle={[styles.emptyScroll, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          <MyStoreCard />
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="bell"
              title="No reminders yet"
              subtitle="Schedule inspection reminders for your jewelry pieces to keep warranties valid."
            />
          </View>
        </ScrollView>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<MyStoreCard />}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeaderRow}>
              {section.isRetailer ? (
                <View style={[styles.retailerIconWrap, { backgroundColor: colors.primary + "15" }]}>
                  <Feather name="shopping-bag" size={12} color={colors.primary} />
                </View>
              ) : (
                <View style={[styles.retailerIconWrap, { backgroundColor: colors.mutedForeground + "20" }]}>
                  <Feather name="check-circle" size={12} color={colors.mutedForeground} />
                </View>
              )}
              <Text
                style={[
                  styles.sectionHeader,
                  { color: section.isRetailer ? colors.foreground : colors.mutedForeground },
                ]}
              >
                {section.title}
              </Text>
              {section.isRetailer ? (
                <View style={[styles.countBadge, { backgroundColor: colors.border }]}>
                  <Text style={[styles.countText, { color: colors.mutedForeground }]}>
                    {section.data.length}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
          renderItem={({ item, section }) => (
            <View>
              {section.isRetailer ? (
                <View style={styles.chipRow}>{urgencyChip(item, colors)}</View>
              ) : null}
              <ReminderCard
                reminder={item}
                onComplete={() => completeReminder(item.id)}
                onDelete={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  deleteReminder(item.id);
                }}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* Single FAB — Add Reminder */}
      <Pressable
        onPress={handleAddReminder}
        style={({ pressed }) => [
          styles.fab,
          { bottom: fabBottom, backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <Feather name="plus" size={24} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  emptyScroll: { flexGrow: 1 },
  emptyWrap: { flex: 1, minHeight: 300 },
  list: { paddingHorizontal: 20, flexGrow: 1 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  retailerIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.1,
  },
  countBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  countText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  chipRow: { marginBottom: 4 },
  fab: {
    position: "absolute",
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
