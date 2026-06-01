import { createContext, useContext, useState } from "react";

export interface BannerConfig {
  banner: string;
  storeId: string;
  storeName: string;
  color: string;
  initial: string;
  city: string;
  parentCompany: string;
}

export const BANNERS: BannerConfig[] = [
  {
    banner: "Kay Jewelers",
    storeId: "kay-fifth-ave",
    storeName: "Kay Jewelers — Fifth Avenue",
    color: "#5B21B6",
    initial: "K",
    city: "New York, NY",
    parentCompany: "Signet Jewelers",
  },
  {
    banner: "Zales",
    storeId: "zales-herald-sq",
    storeName: "Zales — Herald Square",
    color: "#D97706",
    initial: "Z",
    city: "New York, NY",
    parentCompany: "Signet Jewelers",
  },
  {
    banner: "Jared",
    storeId: "jared-paramus",
    storeName: "Jared — Paramus Park",
    color: "#0079F2",
    initial: "J",
    city: "Paramus, NJ",
    parentCompany: "Signet Jewelers",
  },
  {
    banner: "Banter by Piercing Pagoda",
    storeId: "banter-times-sq",
    storeName: "Banter — Times Square",
    color: "#B91C1C",
    initial: "B",
    city: "New York, NY",
    parentCompany: "Signet Jewelers",
  },
];

interface StoreContextType {
  current: BannerConfig;
  setCurrent: (b: BannerConfig) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<BannerConfig>(BANNERS[0]);
  return (
    <StoreContext.Provider value={{ current, setCurrent }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
