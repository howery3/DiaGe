import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";

export const PREFERRED_STORE_KEY = "@dige_preferred_store";

export interface PreferredStore {
  id: string;
  name: string;
  banner: string;
  address: string;
  distanceMi: number;
  phone: string;
}

export function usePreferredStore() {
  const [store, setStore] = useState<PreferredStore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(PREFERRED_STORE_KEY).then((v) => {
      if (v) {
        try { setStore(JSON.parse(v)); } catch { /* ignore */ }
      }
      setLoading(false);
    });
  }, []);

  const saveStore = useCallback(async (s: PreferredStore | null) => {
    if (s) {
      await AsyncStorage.setItem(PREFERRED_STORE_KEY, JSON.stringify(s));
    } else {
      await AsyncStorage.removeItem(PREFERRED_STORE_KEY);
    }
    setStore(s);
  }, []);

  return { store, saveStore, loading };
}
