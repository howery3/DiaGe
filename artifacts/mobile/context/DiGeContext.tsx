import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type JewelryType =
  | "ring"
  | "necklace"
  | "bracelet"
  | "earrings"
  | "watch"
  | "brooch"
  | "other";

export type GoldWarrantyType = "lifetime" | "dated" | "none";

export interface JewelryPiece {
  id: string;
  name: string;
  type: JewelryType;
  brand: string;
  material: string;
  purchaseDate: string;
  purchasePrice: string;
  retailer: string;
  serialNumber: string;
  goldWarrantyType: GoldWarrantyType;
  goldWarrantyExpiry: string;
  goldWarrantyDetails: string;
  diamondBondExpiry: string;
  diamondBondDetails: string;
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
  addWishlistItem: (item: Omit<WishlistItem, "id" | "createdAt">) => void;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void;
  deleteWishlistItem: (id: string) => void;
  addReminder: (reminder: Omit<InspectionReminder, "id" | "createdAt">) => void;
  updateReminder: (id: string, updates: Partial<InspectionReminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
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

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(PIECES_KEY, JSON.stringify(pieces));
  }, [pieces, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  }, [reminders, loaded]);

  const addPiece = useCallback((piece: Omit<JewelryPiece, "id" | "createdAt">) => {
    setPieces((prev) => [
      { ...piece, id: generateId(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const updatePiece = useCallback((id: string, updates: Partial<JewelryPiece>) => {
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deletePiece = useCallback((id: string) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getPiece = useCallback((id: string) => pieces.find((p) => p.id === id), [pieces]);

  const addWishlistItem = useCallback((item: Omit<WishlistItem, "id" | "createdAt">) => {
    setWishlistItems((prev) => [
      { ...item, id: generateId(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const updateWishlistItem = useCallback((id: string, updates: Partial<WishlistItem>) => {
    setWishlistItems((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  }, []);

  const deleteWishlistItem = useCallback((id: string) => {
    setWishlistItems((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const addReminder = useCallback((reminder: Omit<InspectionReminder, "id" | "createdAt">) => {
    setReminders((prev) => [
      { ...reminder, id: generateId(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const updateReminder = useCallback((id: string, updates: Partial<InspectionReminder>) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const completeReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const completed = { ...r, isCompleted: true };
        if (r.recurrence !== "none") {
          const base = new Date(r.scheduledDate);
          const months =
            r.recurrence === "6months" ? 6 : r.recurrence === "1year" ? 12 : 24;
          base.setMonth(base.getMonth() + months);
          const next: InspectionReminder = {
            ...r,
            id: generateId(),
            scheduledDate: base.toISOString(),
            isCompleted: false,
            createdAt: new Date().toISOString(),
          };
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

  return (
    <DiGeContext.Provider
      value={{
        pieces,
        wishlistItems,
        reminders,
        addPiece,
        updatePiece,
        deletePiece,
        getPiece,
        addWishlistItem,
        updateWishlistItem,
        deleteWishlistItem,
        addReminder,
        updateReminder,
        deleteReminder,
        completeReminder,
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
