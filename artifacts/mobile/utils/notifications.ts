import * as Notifications from "expo-notifications";
import type { InspectionReminder, JewelryPiece } from "@/context/DiGeContext";

export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

export async function scheduleReminderNotification(
  reminder: InspectionReminder
): Promise<string | null> {
  try {
    const triggerDate = new Date(reminder.scheduledDate);
    triggerDate.setHours(9, 0, 0, 0);
    if (triggerDate <= new Date()) return null;

    const body = reminder.retailer
      ? `${reminder.jewelryName} is due for inspection at ${reminder.retailer}`
      : `${reminder.jewelryName} is due for an inspection`;

    // Schedule the on-day notification
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "💎 Inspection Reminder",
        body,
        sound: true,
        data: { reminderId: reminder.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });

    // Schedule a 7-day advance notification
    const advanceDate = new Date(triggerDate);
    advanceDate.setDate(advanceDate.getDate() - 7);
    if (advanceDate > new Date()) {
      const advanceBody = reminder.retailer
        ? `${reminder.jewelryName} inspection at ${reminder.retailer} is coming up in 7 days`
        : `${reminder.jewelryName} inspection is coming up in 7 days`;
      await Notifications.scheduleNotificationAsync({
        identifier: `${reminder.id}-advance`,
        content: {
          title: "💎 Upcoming Inspection",
          body: advanceBody,
          sound: true,
          data: { reminderId: reminder.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: advanceDate,
        },
      }).catch(() => {});
    }

    return id;
  } catch {
    return null;
  }
}

export async function scheduleWarrantyExpiryNotification(
  piece: JewelryPiece,
  coverageType: "gold" | "diamond"
): Promise<void> {
  const expiry =
    coverageType === "gold" ? piece.goldWarrantyExpiry : piece.diamondBondExpiry;
  if (!expiry) return;

  const expiryDate = new Date(expiry);
  if (isNaN(expiryDate.getTime())) return;

  const notifyDate = new Date(expiryDate);
  notifyDate.setDate(notifyDate.getDate() - 30);
  notifyDate.setHours(10, 0, 0, 0);
  if (notifyDate <= new Date()) return;

  const identifier =
    coverageType === "gold"
      ? `warranty-gold-${piece.id}`
      : `warranty-diamond-${piece.id}`;

  const coverageLabel =
    coverageType === "gold" ? "Lifetime Warranty" : "Diamond Bond";

  try {
    // Cancel existing before rescheduling
    await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: `⚠️ ${coverageLabel} Expiring Soon`,
        body: `${piece.name}'s ${coverageLabel} expires in 30 days. Schedule your jeweler visit soon.`,
        sound: true,
        data: { pieceId: piece.id, coverageType },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notifyDate,
      },
    });
  } catch {
    // Notifications not available (web / simulator without perms)
  }
}

export async function cancelNotification(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {}
}

// Three recurring slots: Fri 5:30pm, Sat 5:30pm, and one mid-week morning (Mon/Tue/Wed)
// Weekday values: 1=Sun 2=Mon 3=Tue 4=Wed 5=Thu 6=Fri 7=Sat
const WISHLIST_SLOT_IDS = ["wishlist-friday", "wishlist-saturday", "wishlist-weekday"] as const;

type WishlistSlot = {
  identifier: string;
  weekday: number;
  hour: number;
  minute: number;
};

function getWishlistSlots(itemCount: number): WishlistSlot[] {
  // Pick a mid-week day deterministically based on item count so it doesn't change on every call
  // 0 mod 3 = Mon (2), 1 mod 3 = Tue (3), 2 mod 3 = Wed (4)
  const weekdayOptions = [2, 3, 4];
  const midWeekDay = weekdayOptions[itemCount % 3];

  return [
    { identifier: "wishlist-friday",  weekday: 6, hour: 17, minute: 30 },
    { identifier: "wishlist-saturday", weekday: 7, hour: 17, minute: 30 },
    { identifier: "wishlist-weekday", weekday: midWeekDay, hour: 10, minute: 0 },
  ];
}

export async function scheduleWeeklyWishlistReminder(itemCount: number): Promise<void> {
  try {
    if (itemCount === 0) {
      await cancelWeeklyWishlistReminder();
      return;
    }

    const body =
      itemCount === 1
        ? "You have 1 saved item. Check if it's on sale this week"
        : `You have ${itemCount} saved items. Check if any are on sale this week`;

    const existing = await Notifications.getAllScheduledNotificationsAsync();
    const pendingIds = new Set(existing.map((n) => n.identifier));

    for (const slot of getWishlistSlots(itemCount)) {
      if (pendingIds.has(slot.identifier)) continue; // already scheduled, leave it alone
      await Notifications.scheduleNotificationAsync({
        identifier: slot.identifier,
        content: { title: "Wishlist Check-In", body, sound: true },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: slot.weekday,
          hour: slot.hour,
          minute: slot.minute,
          repeats: true,
        },
      }).catch(() => {});
    }
  } catch {}
}

export async function cancelWeeklyWishlistReminder(): Promise<void> {
  for (const id of WISHLIST_SLOT_IDS) {
    await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
  }
}

export async function cancelWarrantyNotifications(pieceId: string): Promise<void> {
  await cancelNotification(`warranty-gold-${pieceId}`);
  await cancelNotification(`warranty-diamond-${pieceId}`);
}

export async function syncWarrantyNotifications(piece: JewelryPiece): Promise<void> {
  await cancelWarrantyNotifications(piece.id);
  if (piece.goldWarrantyType === "dated" && piece.goldWarrantyExpiry) {
    await scheduleWarrantyExpiryNotification(piece, "gold");
  }
  if (piece.diamondBondExpiry) {
    await scheduleWarrantyExpiryNotification(piece, "diamond");
  }
}
