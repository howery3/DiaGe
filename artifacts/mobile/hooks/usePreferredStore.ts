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

// Module-level singleton so all hook instances share the same state
let _stores: Record<string, PreferredStore> = {};
let _loaded = false;
const _listeners = new Set<(s: Record<string, PreferredStore>) => void>();

function _notify(next: Record<string, PreferredStore>) {
  _stores = next;
  _listeners.forEach((fn) => fn({ ...next }));
}

async function _load() {
  if (_loaded) return;
  try {
    let v = await AsyncStorage.getItem(PREFERRED_STORES_KEY);
    if (!v) {
      const legacy = await AsyncStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const parsed: PreferredStore = JSON.parse(legacy);
        if (parsed?.banner) {
          const migrated: Record<string, PreferredStore> = { [parsed.banner]: parsed };
          await AsyncStorage.setItem(PREFERRED_STORES_KEY, JSON.stringify(migrated));
          _notify(migrated);
        }
      }
    } else {
      _notify(JSON.parse(v) ?? {});
    }
  } catch { /* ignore */ }
  _loaded = true;
}

export function usePreferredStore(retailer?: string) {
  const [stores, setStores] = useState<Record<string, PreferredStore>>({ ..._stores });
  const [loading, setLoading] = useState(!_loaded);

  useEffect(() => {
    _listeners.add(setStores);
    if (!_loaded) {
      _load().then(() => setLoading(false));
    }
    return () => {
      _listeners.delete(setStores);
    };
  }, []);

  const saveStore = useCallback(async (retailerKey: string, s: PreferredStore | null) => {
    const next = { ..._stores };
    if (s) {
      next[retailerKey] = s;
    } else {
      delete next[retailerKey];
    }
    _notify(next);
    await AsyncStorage.setItem(PREFERRED_STORES_KEY, JSON.stringify(next));
  }, []);

  const getStore = useCallback((key: string): PreferredStore | null => {
    return stores[key] ?? null;
  }, [stores]);

  const store = retailer
    ? (stores[retailer] ?? null)
    : (Object.values(stores)[0] ?? null);

  return { store, stores, getStore, saveStore, loading };
}
