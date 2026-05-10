import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { InspectionReminder } from "@/context/DiGeContext";

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function urgency(iso: string, completed: boolean): { label: string; color: string } {
  if (completed) return { label: "Done", color: "#15803D" };
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "Overdue", color: "#DC2626" };
  if (days <= 7) return { label: `${days}d`, color: "#DC2626" };
  if (days <= 30) return { label: `${days}d`, color: "#B45309" };
  return { label: formatDate(iso), color: "#15803D" };
}

interface ReminderCardProps {
  reminder: InspectionReminder;
  onComplete: () => void;
  onDelete: () => void;
}

export function ReminderCard({ reminder, onComplete, onDelete }: ReminderCardProps) {
  const colors = useColors();
  const urg = urgency(reminder.scheduledDate, reminder.isCompleted);

  async function handleComplete() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: reminder.isCompleted ? 0.6 : 1,
        },
      ]}
    >
      <Pressable
        onPress={reminder.isCompleted ? undefined : handleComplete}
        style={[
          styles.checkBtn,
          {
            borderColor: urg.color,
            backgroundColor: reminder.isCompleted ? urg.color : "transparent",
          },
        ]}
      >
        {reminder.isCompleted ? (
          <Feather name="check" size={14} color="#fff" />
        ) : null}
      </Pressable>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {reminder.jewelryName}
        </Text>
        {reminder.retailer ? (
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>{reminder.retailer}</Text>
        ) : null}
        <View style={styles.row}>
          <Feather name="calendar" size={12} color={colors.mutedForeground} />
          <Text style={[styles.date, { color: colors.mutedForeground }]}>
            {formatDate(reminder.scheduledDate)}
          </Text>
          {reminder.recurrence !== "none" ? (
            <View style={[styles.recBadge, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.recText, { color: colors.mutedForeground }]}>
                {reminder.recurrence === "6months" ? "6mo" : reminder.recurrence === "1year" ? "1yr" : "2yr"}
              </Text>
            </View>
          ) : null}
        </View>
        {reminder.notes ? (
          <Text style={[styles.notes, { color: colors.mutedForeground }]} numberOfLines={1}>
            {reminder.notes}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>
        <View style={[styles.urgBadge, { backgroundColor: urg.color + "18" }]}>
          <Text style={[styles.urgText, { color: urg.color }]}>{urg.label}</Text>
        </View>
        <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteBtn}>
          <Feather name="trash-2" size={15} color={colors.mutedForeground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
    gap: 12,
  },
  checkBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, gap: 3 },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  meta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  row: { flexDirection: "row", alignItems: "center", gap: 5 },
  date: { fontSize: 12, fontFamily: "Inter_400Regular" },
  recBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  recText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  notes: { fontSize: 12, fontFamily: "Inter_400Regular" },
  right: { alignItems: "flex-end", gap: 8 },
  urgBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  urgText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  deleteBtn: { padding: 2 },
});
