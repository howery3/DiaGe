import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PROFILE_KEY = "@dige_profile";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  ringSize: string;
  braceletSize: string;
  necklaceLength: string;
  preferredGoldColor: string;
  preferredMetals: string[];
  preferredStones: string[];
  birthday: string;
  anniversary: string;
  budgetRange: string;
}

const EMPTY: UserProfile = {
  name: "",
  email: "",
  phone: "",
  ringSize: "",
  braceletSize: "",
  necklaceLength: "",
  preferredGoldColor: "",
  preferredMetals: [],
  preferredStones: [],
  birthday: "",
  anniversary: "",
  budgetRange: "",
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((v) => {
      if (v) {
        const parsed = JSON.parse(v);
        setProfile({ ...EMPTY, ...parsed });
      }
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

  const completionCount = [
    profile.name,
    profile.email,
    profile.phone,
    profile.ringSize,
    profile.braceletSize,
    profile.necklaceLength,
    profile.preferredGoldColor,
    profile.preferredMetals.length > 0 ? "x" : "",
    profile.preferredStones.length > 0 ? "x" : "",
    profile.birthday,
    profile.anniversary,
    profile.budgetRange,
  ].filter(Boolean).length;

  const completionPct = Math.round((completionCount / 12) * 100);

  function initials(): string {
    const parts = profile.name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return { profile, saveProfile, clearProfile, loaded, hasProfile, initials, completionPct };
}
