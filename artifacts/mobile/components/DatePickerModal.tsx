import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 81 }, (_, i) => CURRENT_YEAR - 50 + i);

interface Props {
  visible: boolean;
  value: string;
  onConfirm: (date: string) => void;
  onCancel: () => void;
  label?: string;
}

function parseISO(iso: string): { year: number; month: number; day: number } | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { year: parseInt(m[1]), month: parseInt(m[2]) - 1, day: parseInt(m[3]) };
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function DatePickerModal({ visible, value, onConfirm, onCancel, label }: Props) {
  const colors = useColors();
  const today = new Date();

  const parsed = parseISO(value);
  const initYear = parsed?.year ?? today.getFullYear();
  const initMonth = parsed?.month ?? today.getMonth();
  const initDay = parsed?.day ?? null;

  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);
  const [selectedDay, setSelectedDay] = useState<number | null>(initDay);
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      const p = parseISO(value);
      const y = p?.year ?? today.getFullYear();
      const mo = p?.month ?? today.getMonth();
      const d = p?.day ?? null;
      setViewYear(y);
      setViewMonth(mo);
      setSelectedDay(d);
      setShowYearPicker(false);
    }
  }, [visible]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
    setSelectedDay(null);
  }

  function handleConfirm() {
    if (selectedDay === null) return;
    onConfirm(toISO(viewYear, viewMonth, selectedDay));
  }

  const totalDays = daysInMonth(viewYear, viewMonth);
  const startOffset = firstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (day: number) => day === selectedDay;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => {}}>

          {label ? (
            <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
          ) : null}

          {showYearPicker ? (
            <>
              <View style={[styles.monthHeader, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => setShowYearPicker(false)} style={styles.navBtn} hitSlop={12}>
                  <Text style={[styles.navBtnText, { color: colors.primary }]}>← Back</Text>
                </Pressable>
                <Text style={[styles.monthTitle, { color: colors.foreground }]}>Select Year</Text>
                <View style={{ width: 60 }} />
              </View>
              <FlatList
                data={YEARS}
                keyExtractor={(y) => String(y)}
                style={styles.yearList}
                initialScrollIndex={Math.max(0, YEARS.indexOf(viewYear) - 3)}
                getItemLayout={(_, index) => ({ length: 48, offset: 48 * index, index })}
                renderItem={({ item: y }) => {
                  const sel = y === viewYear;
                  return (
                    <Pressable
                      onPress={() => { setViewYear(y); setShowYearPicker(false); setSelectedDay(null); }}
                      style={[styles.yearItem, sel && { backgroundColor: colors.primary + "18" }]}
                    >
                      <Text style={[styles.yearItemText, { color: sel ? colors.primary : colors.foreground }, sel && styles.yearItemSelected]}>
                        {y}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            </>
          ) : (
            <>
              <View style={[styles.monthHeader, { borderBottomColor: colors.border }]}>
                <Pressable onPress={prevMonth} style={styles.navBtn} hitSlop={12}>
                  <Text style={[styles.navArrow, { color: colors.primary }]}>‹</Text>
                </Pressable>
                <Pressable onPress={() => setShowYearPicker(true)} style={styles.monthTitleBtn}>
                  <Text style={[styles.monthTitle, { color: colors.foreground }]}>
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </Text>
                  <Text style={[styles.monthTitleCaret, { color: colors.mutedForeground }]}>▾</Text>
                </Pressable>
                <Pressable onPress={nextMonth} style={styles.navBtn} hitSlop={12}>
                  <Text style={[styles.navArrow, { color: colors.primary }]}>›</Text>
                </Pressable>
              </View>

              <View style={styles.dayLabelRow}>
                {DAY_LABELS.map((d) => (
                  <Text key={d} style={[styles.dayLabel, { color: colors.mutedForeground }]}>{d}</Text>
                ))}
              </View>

              <View style={styles.grid}>
                {cells.map((day, idx) => {
                  if (day === null) return <View key={`e${idx}`} style={styles.dayCell} />;
                  const sel = isSelected(day);
                  const tod = isToday(day);
                  return (
                    <Pressable
                      key={`d${day}`}
                      onPress={() => setSelectedDay(day)}
                      style={[
                        styles.dayCell,
                        sel && { backgroundColor: colors.primary, borderRadius: 20 },
                      ]}
                    >
                      <Text style={[
                        styles.dayText,
                        { color: sel ? "#fff" : colors.foreground },
                        sel && styles.dayTextSelected,
                      ]}>
                        {day}
                      </Text>
                      {tod && !sel ? (
                        <View style={[styles.todayDot, { backgroundColor: colors.primary }]} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          <View style={[styles.actions, { borderTopColor: colors.border }]}>
            <Pressable onPress={onCancel} style={[styles.actionBtn, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              style={[styles.actionBtn, { backgroundColor: selectedDay ? colors.primary : colors.muted }]}
            >
              <Text style={[styles.actionBtnText, { color: selectedDay ? "#fff" : colors.mutedForeground }]}>
                Confirm
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const CELL = 40;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  sheet: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    textAlign: "center",
    paddingTop: 16,
    paddingBottom: 4,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navBtn: { width: 40, alignItems: "center" },
  navArrow: { fontSize: 26, fontFamily: "Inter_400Regular", lineHeight: 30 },
  navBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  monthTitleBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  monthTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  monthTitleCaret: { fontSize: 12, marginTop: 2 },
  dayLabelRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: CELL,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  dayTextSelected: { fontFamily: "Inter_700Bold" },
  todayDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  yearList: { maxHeight: 260 },
  yearItem: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  yearItemText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  yearItemSelected: { fontFamily: "Inter_700Bold" },
  actions: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
