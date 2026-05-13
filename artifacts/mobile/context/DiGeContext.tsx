import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  cancelNotification,
  cancelWarrantyNotifications,
  scheduleReminderNotification,
  syncWarrantyNotifications,
} from "@/utils/notifications";

export type JewelryType =
  | "ring"
  | "necklace"
  | "bracelet"
  | "earrings"
  | "watch"
  | "brooch"
  | "other";

export type GoldWarrantyType = "lifetime" | "dated" | "none";

export type DocumentLabel =
  | "Receipt"
  | "Certificate"
  | "Appraisal"
  | "Insurance Doc"
  | "Warranty Card"
  | "Photo"
  | "Other";

export interface DocumentAttachment {
  id: string;
  uri: string;
  label: DocumentLabel;
  caption: string;
  createdAt: string;
}

export interface RepairEntry {
  id: string;
  date: string;
  repairType: string;
  retailer: string;
  cost: string;
  description: string;
  createdAt: string;
}

export interface JewelryPiece {
  id: string;
  name: string;
  type: JewelryType;
  brand: string;
  material: string;
  metals?: string[];
  diamondType?: string;
  gemstones?: string[];
  watchBand?: string;
  watchMovement?: string;
  watchCrystal?: string;
  watchCase?: string;
  purchaseDate: string;
  purchasePrice: string;
  retailer: string;
  serialNumber: string;
  goldWarrantyType: GoldWarrantyType;
  goldWarrantyNumber: string;
  goldWarrantyExpiry: string;
  goldWarrantyDetails: string;
  diamondBondNumber: string;
  diamondBondExpiry: string;
  diamondBondDetails: string;
  repairHistory: RepairEntry[];
  documents: DocumentAttachment[];
  description: string;
  lastInspection: string;
  imageUri?: string;
  createdAt: string;
}

export type WishlistPriority = "low" | "medium" | "high";

export interface WishlistItem {
  id: string;
  name: string;
  type: string;
  brand: string;
  retailer: string;
  retailerUrl: string;
  estimatedPrice: string;
  notes: string;
  priority: WishlistPriority;
  createdAt: string;
}

export type ReminderRecurrence = "none" | "6months" | "1year" | "2years";

export interface InspectionReminder {
  id: string;
  jewelryId?: string;
  jewelryName: string;
  retailer: string;
  scheduledDate: string;
  recurrence: ReminderRecurrence;
  notes: string;
  isCompleted: boolean;
  notificationId?: string;
  createdAt: string;
}

interface DiGeContextType {
  pieces: JewelryPiece[];
  wishlistItems: WishlistItem[];
  reminders: InspectionReminder[];
  addPiece: (piece: Omit<JewelryPiece, "id" | "createdAt">) => void;
  updatePiece: (id: string, updates: Partial<JewelryPiece>) => void;
  deletePiece: (id: string) => void;
  getPiece: (id: string) => JewelryPiece | undefined;
  addRepair: (pieceId: string, repair: Omit<RepairEntry, "id" | "createdAt">) => void;
  deleteRepair: (pieceId: string, repairId: string) => void;
  addDocument: (pieceId: string, doc: Omit<DocumentAttachment, "id" | "createdAt">) => void;
  deleteDocument: (pieceId: string, docId: string) => void;
  addWishlistItem: (item: Omit<WishlistItem, "id" | "createdAt">) => void;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void;
  deleteWishlistItem: (id: string) => void;
  addReminder: (reminder: Omit<InspectionReminder, "id" | "createdAt">) => void;
  updateReminder: (id: string, updates: Partial<InspectionReminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  clearAllData: () => Promise<void>;
  upcomingReminderCount: number;
}

const DiGeContext = createContext<DiGeContextType | null>(null);

const PIECES_KEY = "@dige_pieces";
const WISHLIST_KEY = "@dige_wishlist";
const REMINDERS_KEY = "@dige_reminders";

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

export function DiGeProvider({ children }: { children: React.ReactNode }) {
  const [pieces, setPieces] = useState<JewelryPiece[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [reminders, setReminders] = useState<InspectionReminder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [p, w, r] = await Promise.all([
          AsyncStorage.getItem(PIECES_KEY),
          AsyncStorage.getItem(WISHLIST_KEY),
          AsyncStorage.getItem(REMINDERS_KEY),
        ]);
        if (p) setPieces(JSON.parse(p));
        if (w) setWishlistItems(JSON.parse(w));
        if (r) setReminders(JSON.parse(r));
      } catch {}
      setLoaded(true);
    }
    load();
  }, []);

  useEffect(() => { if (!loaded) return; AsyncStorage.setItem(PIECES_KEY, JSON.stringify(pieces)); }, [pieces, loaded]);
  useEffect(() => { if (!loaded) return; AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems)); }, [wishlistItems, loaded]);
  useEffect(() => { if (!loaded) return; AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders)); }, [reminders, loaded]);

  const addPiece = useCallback((piece: Omit<JewelryPiece, "id" | "createdAt">) => {
    const newPiece: JewelryPiece = { ...piece, id: generateId(), createdAt: new Date().toISOString() };
    setPieces((prev) => [newPiece, ...prev]);
    // Schedule warranty expiry notifications
    void syncWarrantyNotifications(newPiece);
  }, []);

  const updatePiece = useCallback((id: string, updates: Partial<JewelryPiece>) => {
    setPieces((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      const updatedPiece = updated.find((p) => p.id === id);
      if (updatedPiece) void syncWarrantyNotifications(updatedPiece);
      return updated;
    });
  }, []);

  const deletePiece = useCallback((id: string) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
    void cancelWarrantyNotifications(id);
  }, []);

  const getPiece = useCallback((id: string) => pieces.find((p) => p.id === id), [pieces]);

  const addRepair = useCallback((pieceId: string, repair: Omit<RepairEntry, "id" | "createdAt">) => {
    const entry: RepairEntry = { ...repair, id: generateId(), createdAt: new Date().toISOString() };
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId ? { ...p, repairHistory: [entry, ...(p.repairHistory ?? [])] } : p
      )
    );
  }, []);

  const deleteRepair = useCallback((pieceId: string, repairId: string) => {
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId
          ? { ...p, repairHistory: (p.repairHistory ?? []).filter((r) => r.id !== repairId) }
          : p
      )
    );
  }, []);

  const addDocument = useCallback((pieceId: string, doc: Omit<DocumentAttachment, "id" | "createdAt">) => {
    const entry: DocumentAttachment = { ...doc, id: generateId(), createdAt: new Date().toISOString() };
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId ? { ...p, documents: [...(p.documents ?? []), entry] } : p
      )
    );
  }, []);

  const deleteDocument = useCallback((pieceId: string, docId: string) => {
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId
          ? { ...p, documents: (p.documents ?? []).filter((d) => d.id !== docId) }
          : p
      )
    );
  }, []);

  const addWishlistItem = useCallback((item: Omit<WishlistItem, "id" | "createdAt">) => {
    setWishlistItems((prev) => [{ ...item, id: generateId(), createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const updateWishlistItem = useCallback((id: string, updates: Partial<WishlistItem>) => {
    setWishlistItems((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  }, []);

  const deleteWishlistItem = useCallback((id: string) => {
    setWishlistItems((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const addReminder = useCallback((reminder: Omit<InspectionReminder, "id" | "createdAt">) => {
    const id = generateId();
    const newReminder: InspectionReminder = { ...reminder, id, createdAt: new Date().toISOString() };
    setReminders((prev) => [newReminder, ...prev]);

    // Schedule notification; store the returned ID back onto the reminder
    scheduleReminderNotification(newReminder).then((notifId) => {
      if (notifId) {
        setReminders((prev) =>
          prev.map((r) => (r.id === id ? { ...r, notificationId: notifId } : r))
        );
      }
    });
  }, []);

  const updateReminder = useCallback((id: string, updates: Partial<InspectionReminder>) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const target = prev.find((r) => r.id === id);
      if (target?.notificationId) void cancelNotification(target.notificationId);
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const completeReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        // Cancel the existing notification
        if (r.notificationId) void cancelNotification(r.notificationId);
        const completed = { ...r, isCompleted: true, notificationId: undefined };

        if (r.recurrence !== "none") {
          const base = new Date(r.scheduledDate);
          const months = r.recurrence === "6months" ? 6 : r.recurrence === "1year" ? 12 : 24;
          base.setMonth(base.getMonth() + months);
          const next: InspectionReminder = {
            ...r,
            id: generateId(),
            scheduledDate: base.toISOString(),
            isCompleted: false,
            notificationId: undefined,
            createdAt: new Date().toISOString(),
          };
          // Schedule notification for the next occurrence
          scheduleReminderNotification(next).then((notifId) => {
            if (notifId) {
              setReminders((prev2) =>
                prev2.map((x) => (x.id === next.id ? { ...x, notificationId: notifId } : x))
              );
            }
          });
          setTimeout(() => {
            setReminders((prev2) => [next, ...prev2.filter((x) => x.id !== id), completed]);
          }, 0);
          return completed;
        }
        return completed;
      })
    );
  }, []);

  const upcomingReminderCount = reminders.filter((r) => {
    if (r.isCompleted) return false;
    const diff = new Date(r.scheduledDate).getTime() - Date.now();
    return diff <= 30 * 24 * 60 * 60 * 1000;
  }).length;

  const clearAllData = useCallback(async () => {
    setPieces([]);
    setWishlistItems([]);
    setReminders([]);
    await AsyncStorage.multiRemove([PIECES_KEY, WISHLIST_KEY, REMINDERS_KEY]);
  }, []);

  return (
    <DiGeContext.Provider
      value={{
        pieces, wishlistItems, reminders,
        addPiece, updatePiece, deletePiece, getPiece,
        addRepair, deleteRepair,
        addDocument, deleteDocument,
        addWishlistItem, updateWishlistItem, deleteWishlistItem,
        addReminder, updateReminder, deleteReminder, completeReminder,
        clearAllData,
        upcomingReminderCount,
      }}
    >
      {children}
    </DiGeContext.Provider>
  );
}

export function useDiGe(): DiGeContextType {
  const ctx = useContext(DiGeContext);
  if (!ctx) throw new Error("useDiGe must be used within DiGeProvider");
  return ctx;
}
