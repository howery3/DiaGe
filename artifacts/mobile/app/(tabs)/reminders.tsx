import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { FlatList, Platform, Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { ReminderCard } from "@/components/ReminderCard";
import { useDiGe, type InspectionReminder } from "@/context/DiGeContext";
import { useColors } from "@/hooks/useColors";

type Section = { title: string; data: InspectionReminder[] };

export default function RemindersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { reminders, completeReminder, deleteReminder, upcomingReminderCount } = useDiGe();

  const now = Date.now();

  const overdue = reminders.filter(
    (r) => !r.isCompleted && new Date(r.scheduledDate).getTime() < now
  );
  const upcoming = reminders.filter(
    (r) =>
      !r.isCompleted &&
      new Date(r.scheduledDate).getTime() >= now &&
      new Date(r.scheduledDate).getTime() - now <= 30 * 24 * 60 * 60 * 1000
  );
  const future = reminders.filter(
    (r) =>
      !r.isCompleted && new Date(r.scheduledDate).getTime() - now > 30 * 24 * 60 * 60 * 1000
  );
  const completed = reminders.filter((r) => r.isCompleted);

  const sections: Section[] = [
    ...(overdue.length ? [{ title: "Overdue", data: overdue }] : []),
    ...(upcoming.length ? [{ title: "Due Soon", data: upcoming }] : []),
    ...(future.length ? [{ title: "Upcoming", data: future }] : []),
    ...(completed.length ? [{ title: "Completed", data: completed }] : []),
  ];

  async function handleAdd() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/reminder/add");
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;

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
          Jewelry inspection schedule
        </Text>
      </View>

      {reminders.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="bell"
            title="No reminders yet"
            subtitle="Schedule inspection reminders for your jewelry pieces to keep warranties valid."
          />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => (
            <ReminderCard
              reminder={item}
              onComplete={() => completeReminder(item.id)}
              onDelete={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                deleteReminder(item.id);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}

      <Pressable
        onPress={handleAdd}
        style={[styles.fab, { backgroundColor: colors.primary, bottom: insets.bottom + 100 }]}
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
  emptyWrap: { flex: 1 },
  list: { paddingHorizontal: 20, flexGrow: 1 },
  sectionHeader: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 16,
  },
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
