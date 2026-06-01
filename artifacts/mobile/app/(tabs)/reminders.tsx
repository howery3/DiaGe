import { Feather } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
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
import { usePreferredStore } from "@/hooks/usePreferredStore";
import { useProfile } from "@/hooks/useProfile";

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`
  : "http://localhost:5000/api";

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
  const { store } = usePreferredStore();
  const { profile } = useProfile();
  const { getToken } = useAuth();

  const sections = buildSections(reminders);
  const [menuOpen, setMenuOpen] = useState(false);
  const [booking, setBooking] = useState(false);

  const menuAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  function openMenu() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMenuOpen(true);
    Animated.parallel([
      Animated.spring(menuAnim, { toValue: 1, useNativeDriver: true, damping: 15, stiffness: 200 }),
      Animated.spring(rotateAnim, { toValue: 1, useNativeDriver: true, damping: 15, stiffness: 200 }),
    ]).start();
  }

  function closeMenu() {
    Animated.parallel([
      Animated.spring(menuAnim, { toValue: 0, useNativeDriver: true, damping: 15, stiffness: 200 }),
      Animated.spring(rotateAnim, { toValue: 0, useNativeDriver: true, damping: 15, stiffness: 200 }),
    ]).start(() => setMenuOpen(false));
  }

  function toggleMenu() {
    if (menuOpen) { closeMenu(); } else { openMenu(); }
  }

  async function handleAddReminder() {
    closeMenu();
    await new Promise((r) => setTimeout(r, 120));
    router.push("/reminder/add");
  }

  async function handleBookAppointment() {
    if (!store) {
      closeMenu();
      await new Promise((r) => setTimeout(r, 120));
      Alert.alert(
        "No Store Linked",
        "Link a Signet store from your Profile first, then you can book appointments directly from here.",
        [
          { text: "Go to Profile", onPress: () => router.push("/(tabs)/profile") },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    closeMenu();
    setBooking(true);
    try {
      const token = await getToken();
      const payload = {
        storeId: store.id,
        type: "appointment",
        data: {
          userName: profile.name || "DiaGe User",
          userEmail: profile.email || "",
          userPhone: profile.phone || "",
          message: "I'd like to schedule a jewelry inspection appointment.",
          sharedAt: new Date().toISOString(),
        },
      };
      const res = await fetch(`${API_BASE}/store-share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Request Sent! 🗓",
        `${store.name} will reach out to confirm your appointment time. Expected response within 24 hours.`,
        [{ text: "OK" }]
      );
    } catch {
      Alert.alert("Couldn't send", "Please check your connection and try again.");
    } finally {
      setBooking(false);
    }
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const fabBottom = insets.bottom + 100;

  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "45deg"] });

  const item1Translate = menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -72] });
  const item2Translate = menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -136] });
  const itemOpacity = menuAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const backdropOpacity = menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

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

      <MyStoreCard />

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

      {/* Backdrop — closes menu when tapped */}
      {menuOpen && (
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
          pointerEvents="auto"
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
        </Animated.View>
      )}

      {/* FAB menu items */}
      <View style={[styles.fabArea, { bottom: fabBottom }]} pointerEvents="box-none">

        {/* Item 2 — Book Appointment */}
        <Animated.View
          style={[styles.fabItem, { transform: [{ translateY: item2Translate }], opacity: itemOpacity }]}
          pointerEvents={menuOpen ? "auto" : "none"}
        >
          <Pressable
            onPress={handleBookAppointment}
            disabled={booking}
            style={({ pressed }) => [
              styles.fabItemLabel,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.fabItemText, { color: colors.foreground }]}>
              {store ? `Book at ${store.name.split("—")[0].trim()}` : "Book Appointment"}
            </Text>
          </Pressable>
          <View style={[styles.fabMini, { backgroundColor: "#0079F2" }]}>
            <Feather name="calendar" size={18} color="#fff" />
          </View>
        </Animated.View>

        {/* Item 1 — Add Reminder */}
        <Animated.View
          style={[styles.fabItem, { transform: [{ translateY: item1Translate }], opacity: itemOpacity }]}
          pointerEvents={menuOpen ? "auto" : "none"}
        >
          <Pressable
            onPress={handleAddReminder}
            style={({ pressed }) => [
              styles.fabItemLabel,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.fabItemText, { color: colors.foreground }]}>Add Reminder</Text>
          </Pressable>
          <View style={[styles.fabMini, { backgroundColor: colors.primary }]}>
            <Feather name="bell" size={18} color="#fff" />
          </View>
        </Animated.View>

        {/* Main FAB */}
        <Pressable
          onPress={toggleMenu}
          style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }]}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Feather name="plus" size={24} color={colors.primaryForeground} />
          </Animated.View>
        </Pressable>
      </View>
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 10,
  },
  fabArea: {
    position: "absolute",
    right: 20,
    alignItems: "flex-end",
    zIndex: 20,
  },
  fab: {
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
  fabMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  fabItem: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fabItemLabel: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fabItemText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
