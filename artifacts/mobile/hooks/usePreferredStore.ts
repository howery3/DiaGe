import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";

export const PREFERRED_STORES_KEY = "@dige_preferred_stores_v2";
const LEGACY_KEY = "@dige_preferred_store";

export interface PreferredStore {
  id: string;
  name: string;
  banner: string;
  address: string;
  distanceMi: number;
  phone: string;
}

export function usePreferredStore(retailer?: string) {
  const [stores, setStores] = useState<Record<string, PreferredStore>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        let v = await AsyncStorage.getItem(PREFERRED_STORES_KEY);
        if (!v) {
          const legacy = await AsyncStorage.getItem(LEGACY_KEY);
          if (legacy) {
            const parsed: PreferredStore = JSON.parse(legacy);
            if (parsed?.banner) {
              const migrated: Record<string, PreferredStore> = { [parsed.banner]: parsed };
              await AsyncStorage.setItem(PREFERRED_STORES_KEY, JSON.stringify(migrated));
              setStores(migrated);
            }
          }
        } else {
          setStores(JSON.parse(v) ?? {});
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  const saveStore = useCallback(async (retailerKey: string, s: PreferredStore | null) => {
    setStores((prev) => {
      const next = { ...prev };
      if (s) {
        next[retailerKey] = s;
      } else {
        delete next[retailerKey];
      }
      AsyncStorage.setItem(PREFERRED_STORES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getStore = useCallback((key: string): PreferredStore | null => {
    return stores[key] ?? null;
  }, [stores]);

  const store = retailer
    ? (stores[retailer] ?? null)
    : (Object.values(stores)[0] ?? null);

  return { store, stores, getStore, saveStore, loading };
}
