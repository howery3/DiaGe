import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PROFILE_KEY = "@dige_profile";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

const EMPTY: UserProfile = { name: "", email: "", phone: "" };

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((v) => {
      if (v) setProfile(JSON.parse(v));
      setLoaded(true);
    });
  }, []);

  const saveProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearProfile = useCallback(async () => {
    setProfile(EMPTY);
    await AsyncStorage.removeItem(PROFILE_KEY);
  }, []);

  const hasProfile = !!(profile.name || profile.email || profile.phone);

  function initials(): string {
    const parts = profile.name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return { profile, saveProfile, clearProfile, loaded, hasProfile, initials };
}
