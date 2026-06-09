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

const WEEKLY_WISHLIST_ID = "wishlist-weekly-reminder";

export async function scheduleWeeklyWishlistReminder(itemCount: number): Promise<void> {
  try {
    if (itemCount === 0) {
      await Notifications.cancelScheduledNotificationAsync(WEEKLY_WISHLIST_ID).catch(() => {});
      return;
    }

    // If already scheduled, leave it alone so the 7-day timer is not reset on every app open
    const existing = await Notifications.getAllScheduledNotificationsAsync();
    const alreadyPending = existing.some((n) => n.identifier === WEEKLY_WISHLIST_ID);
    if (alreadyPending) return;

    const body =
      itemCount === 1
        ? "You have 1 saved item. Check if it's on sale this week"
        : `You have ${itemCount} saved items. Check if any are on sale this week`;

    await Notifications.scheduleNotificationAsync({
      identifier: WEEKLY_WISHLIST_ID,
      content: {
        title: "Wishlist Check-In",
        body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 7 * 24 * 60 * 60,
        repeats: true,
      },
    });
  } catch {}
}

export async function cancelWeeklyWishlistReminder(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(WEEKLY_WISHLIST_ID);
  } catch {}
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
