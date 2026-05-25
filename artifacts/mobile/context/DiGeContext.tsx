import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@clerk/expo";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  cancelNotification,
  cancelWarrantyNotifications,
  scheduleReminderNotification,
  scheduleWeeklyWishlistReminder,
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
  diamondColor?: string;
  diamondClarity?: string;
  diamondCaratWeight?: string;
  diamondCut?: string;
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
  sku: string;
  type: string;
  brand: string;
  retailer: string;
  retailerUrl: string;
  estimatedPrice: string;
  notes: string;
  priority: WishlistPriority;
  imageUrl?: string;
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
const SYNC_DEBOUNCE_MS = 1500;

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`
  : "/api";

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

export function DiGeProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const [pieces, setPieces] = useState<JewelryPiece[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [reminders, setReminders] = useState<InspectionReminder[]>([]);
  const [loaded, setLoaded] = useState(false);

  const piecesRef = useRef<JewelryPiece[]>([]);
  const wishlistRef = useRef<WishlistItem[]>([]);
  const remindersRef = useRef<InspectionReminder[]>([]);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  piecesRef.current = pieces;
  wishlistRef.current = wishlistItems;
  remindersRef.current = reminders;

  const getHeaders = useCallback(async (): Promise<HeadersInit> => {
    try {
      const token = await getToken();
      if (token) return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
    } catch {}
    return { "Content-Type": "application/json" };
  }, [getToken]);

  const pushToApi = useCallback(async (
    p: JewelryPiece[],
    w: WishlistItem[],
    r: InspectionReminder[]
  ) => {
    try {
      const headers = await getHeaders();
      await fetch(`${API_BASE}/sync`, {
        method: "POST",
        headers,
        body: JSON.stringify({ pieces: p, wishlist: w, reminders: r }),
      });
    } catch {}
  }, [getHeaders]);

  const schedulePush = useCallback(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      void pushToApi(piecesRef.current, wishlistRef.current, remindersRef.current);
    }, SYNC_DEBOUNCE_MS);
  }, [pushToApi]);

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
    if (!loaded || !isSignedIn) return;
    async function syncFromApi() {
      try {
        const headers = await getHeaders();
        const res = await fetch(`${API_BASE}/sync`, { headers });
        if (!res.ok) return;
        const data = (await res.json()) as {
          pieces: JewelryPiece[];
          wishlist: WishlistItem[];
          reminders: InspectionReminder[];
        };
        if (data.pieces.length > 0 || data.wishlist.length > 0 || data.reminders.length > 0) {
          setPieces(data.pieces);
          setWishlistItems(data.wishlist);
          setReminders(data.reminders);
          void AsyncStorage.setItem(PIECES_KEY, JSON.stringify(data.pieces));
          void AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(data.wishlist));
          void AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(data.reminders));
        } else {
          const localPieces = piecesRef.current;
          const localWishlist = wishlistRef.current;
          const localReminders = remindersRef.current;
          if (localPieces.length > 0 || localWishlist.length > 0 || localReminders.length > 0) {
            void pushToApi(localPieces, localWishlist, localReminders);
          }
        }
      } catch {}
    }
    void syncFromApi();
  }, [loaded, isSignedIn]);

  useEffect(() => { if (!loaded) return; void AsyncStorage.setItem(PIECES_KEY, JSON.stringify(pieces)); }, [pieces, loaded]);
  useEffect(() => { if (!loaded) return; void AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems)); }, [wishlistItems, loaded]);
  useEffect(() => { if (!loaded) return; void AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders)); }, [reminders, loaded]);

  useEffect(() => {
    if (!loaded) return;
    void scheduleWeeklyWishlistReminder(wishlistItems.length);
  }, [wishlistItems.length, loaded]);

  const addPiece = useCallback((piece: Omit<JewelryPiece, "id" | "createdAt">) => {
    const newPiece: JewelryPiece = { ...piece, id: generateId(), createdAt: new Date().toISOString() };
    setPieces((prev) => { const next = [newPiece, ...prev]; schedulePush(); return next; });
    void syncWarrantyNotifications(newPiece);
  }, [schedulePush]);

  const updatePiece = useCallback((id: string, updates: Partial<JewelryPiece>) => {
    setPieces((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      const updated = next.find((p) => p.id === id);
      if (updated) void syncWarrantyNotifications(updated);
      schedulePush();
      return next;
    });
  }, [schedulePush]);

  const deletePiece = useCallback((id: string) => {
    setPieces((prev) => { const next = prev.filter((p) => p.id !== id); schedulePush(); return next; });
    void cancelWarrantyNotifications(id);
  }, [schedulePush]);

  const getPiece = useCallback((id: string) => pieces.find((p) => p.id === id), [pieces]);

  const addRepair = useCallback((pieceId: string, repair: Omit<RepairEntry, "id" | "createdAt">) => {
    const entry: RepairEntry = { ...repair, id: generateId(), createdAt: new Date().toISOString() };
    setPieces((prev) => {
      const next = prev.map((p) => p.id === pieceId ? { ...p, repairHistory: [entry, ...(p.repairHistory ?? [])] } : p);
      schedulePush();
      return next;
    });
  }, [schedulePush]);

  const deleteRepair = useCallback((pieceId: string, repairId: string) => {
    setPieces((prev) => {
      const next = prev.map((p) => p.id === pieceId ? { ...p, repairHistory: (p.repairHistory ?? []).filter((r) => r.id !== repairId) } : p);
      schedulePush();
      return next;
    });
  }, [schedulePush]);

  const addDocument = useCallback((pieceId: string, doc: Omit<DocumentAttachment, "id" | "createdAt">) => {
    const entry: DocumentAttachment = { ...doc, id: generateId(), createdAt: new Date().toISOString() };
    setPieces((prev) => {
      const next = prev.map((p) => p.id === pieceId ? { ...p, documents: [...(p.documents ?? []), entry] } : p);
      schedulePush();
      return next;
    });
  }, [schedulePush]);

  const deleteDocument = useCallback((pieceId: string, docId: string) => {
    setPieces((prev) => {
      const next = prev.map((p) => p.id === pieceId ? { ...p, documents: (p.documents ?? []).filter((d) => d.id !== docId) } : p);
      schedulePush();
      return next;
    });
  }, [schedulePush]);

  const addWishlistItem = useCallback((item: Omit<WishlistItem, "id" | "createdAt">) => {
    setWishlistItems((prev) => { const next = [{ ...item, id: generateId(), createdAt: new Date().toISOString() }, ...prev]; schedulePush(); return next; });
  }, [schedulePush]);

  const updateWishlistItem = useCallback((id: string, updates: Partial<WishlistItem>) => {
    setWishlistItems((prev) => { const next = prev.map((w) => (w.id === id ? { ...w, ...updates } : w)); schedulePush(); return next; });
  }, [schedulePush]);

  const deleteWishlistItem = useCallback((id: string) => {
    setWishlistItems((prev) => { const next = prev.filter((w) => w.id !== id); schedulePush(); return next; });
  }, [schedulePush]);

  const addReminder = useCallback((reminder: Omit<InspectionReminder, "id" | "createdAt">) => {
    const id = generateId();
    const newReminder: InspectionReminder = { ...reminder, id, createdAt: new Date().toISOString() };
    setReminders((prev) => { const next = [newReminder, ...prev]; schedulePush(); return next; });
    scheduleReminderNotification(newReminder).then((notifId) => {
      if (notifId) {
        setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, notificationId: notifId } : r)));
        schedulePush();
      }
    });
  }, [schedulePush]);

  const updateReminder = useCallback((id: string, updates: Partial<InspectionReminder>) => {
    setReminders((prev) => { const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r)); schedulePush(); return next; });
  }, [schedulePush]);

  const deleteReminder = useCallback((id: string) => {
    const target = remindersRef.current.find((r) => r.id === id);
    if (target?.notificationId) void cancelNotification(target.notificationId);
    void cancelNotification(`${id}-advance`);
    setReminders((prev) => { const next = prev.filter((r) => r.id !== id); schedulePush(); return next; });
  }, [schedulePush]);

  const completeReminder = useCallback((id: string) => {
    const current = remindersRef.current.find((r) => r.id === id);
    if (!current) return;

    if (current.notificationId) void cancelNotification(current.notificationId);
    void cancelNotification(`${id}-advance`);
    const completed = { ...current, isCompleted: true, notificationId: undefined };

    if (current.recurrence !== "none") {
      const base = new Date(current.scheduledDate);
      const months = current.recurrence === "6months" ? 6 : current.recurrence === "1year" ? 12 : 24;
      base.setMonth(base.getMonth() + months);
      const next: InspectionReminder = {
        ...current,
        id: generateId(),
        scheduledDate: base.toISOString(),
        isCompleted: false,
        notificationId: undefined,
        createdAt: new Date().toISOString(),
      };
      setReminders((prev) => [next, ...prev.map((r) => (r.id === id ? completed : r))]);
      scheduleReminderNotification(next).then((notifId) => {
        if (notifId) {
          setReminders((prev) => prev.map((r) => (r.id === next.id ? { ...r, notificationId: notifId } : r)));
          schedulePush();
        }
      });
    } else {
      setReminders((prev) => prev.map((r) => (r.id === id ? completed : r)));
    }

    schedulePush();
  }, [schedulePush]);

  const upcomingReminderCount = reminders.filter((r) => !r.isCompleted).length;

  const clearAllData = useCallback(async () => {
    setPieces([]);
    setWishlistItems([]);
    setReminders([]);
    await AsyncStorage.multiRemove([PIECES_KEY, WISHLIST_KEY, REMINDERS_KEY]);
    try {
      const headers = await getHeaders();
      await fetch(`${API_BASE}/sync`, { method: "DELETE", headers });
    } catch {}
  }, [getHeaders]);

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
