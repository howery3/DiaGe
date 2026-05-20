import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PROFILE_KEY = "@dige_profile";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photoUri: string;
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
  photoUri: "",
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
    profile.photoUri,
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

  const completionPct = Math.round((completionCount / 13) * 100);

  function initials(): string {
    const parts = profile.name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function buildShareText(): string {
    const lines: string[] = [];
    lines.push(`💍 ${profile.name ? profile.name + "'s" : "My"} Jewelry Profile`);
    lines.push("");

    const sizes: string[] = [];
    if (profile.ringSize) sizes.push(`Ring: ${profile.ringSize}`);
    if (profile.braceletSize) sizes.push(`Bracelet: ${profile.braceletSize}`);
    if (profile.necklaceLength) sizes.push(`Necklace: ${profile.necklaceLength}`);
    if (sizes.length) {
      lines.push("📏 Sizes");
      sizes.forEach((s) => lines.push(`  • ${s}`));
      lines.push("");
    }

    const style: string[] = [];
    if (profile.preferredGoldColor) style.push(`Gold: ${profile.preferredGoldColor}`);
    if (profile.preferredMetals.length) style.push(`Metals: ${profile.preferredMetals.join(", ")}`);
    if (profile.preferredStones.length) style.push(`Stones: ${profile.preferredStones.join(", ")}`);
    if (style.length) {
      lines.push("✨ Style Preferences");
      style.forEach((s) => lines.push(`  • ${s}`));
      lines.push("");
    }

    if (profile.birthday || profile.anniversary) {
      lines.push("🎂 Special Dates");
      if (profile.birthday) {
        const d = new Date(profile.birthday + "T12:00:00");
        lines.push(`  • Birthday: ${d.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`);
      }
      if (profile.anniversary) {
        const d = new Date(profile.anniversary + "T12:00:00");
        lines.push(`  • Anniversary: ${d.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`);
      }
      lines.push("");
    }

    if (profile.budgetRange) {
      lines.push(`💰 Budget: ${profile.budgetRange}`);
      lines.push("");
    }

    lines.push("Sent via DiaGe ✨");
    return lines.join("\n");
  }

  return { profile, saveProfile, clearProfile, loaded, hasProfile, initials, completionPct, buildShareText };
}
