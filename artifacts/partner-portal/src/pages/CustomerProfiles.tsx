import { useState, useMemo } from "react";
import { Search, Phone, Mail, MapPin, ChevronDown, ChevronUp, Star, Gem, Navigation, Clock } from "lucide-react";
import { CUSTOMER_PROFILES, STORE_CITY, type CustomerProfile } from "@/data/demo";

const TIER_STYLE: Record<CustomerProfile["tier"], { bg: string; text: string; border: string; label: string }> = {
  vip: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300", label: "VIP" },
  regular: { bg: "bg-[#F3F0FF]", text: "text-[#5B21B6]", border: "border-[#DDD6FE]", label: "Regular" },
  new: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "New" },
};

function fmtCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function distanceBadge(miles: number) {
  if (miles < 15) return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
  if (miles < 50) return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
  return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
}

function CustomerCard({ c }: { c: CustomerProfile }) {
  const [expanded, setExpanded] = useState(false);
  const tier = TIER_STYLE[c.tier];
  const dist = distanceBadge(c.distanceMiles);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E2F0] overflow-hidden">
      <div className="px-5 py-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-full bg-[#F3F0FF] flex items-center justify-center text-[#5B21B6] font-bold text-sm">
              {c.name.split(" ").map((n) => n[0]).join("")}
            </div>
            {c.tier === "vip" && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                <Star size={8} fill="white" className="text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${tier.bg} ${tier.text} ${tier.border}`}>
                {tier.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin size={10} className="text-gray-400" />
                <span className="text-xs text-gray-400">{c.location}</span>
              </div>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${dist.bg} ${dist.text} ${dist.border}`}>
                <Navigation size={8} />
                {c.distanceMiles} mi
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-[#5B21B6]">{fmtCurrency(c.estimatedWishlistValue)}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">wishlist value</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { label: "Wishlisted", value: c.wishlistCount },
            { label: "Collected", value: c.collectionCount },
            { label: "Total Spend", value: c.totalSpend > 0 ? fmtCurrency(c.totalSpend) : "—" },
            { label: "Visits", value: c.visitCount },
          ].map((s) => (
            <div key={s.label} className="bg-[#F8F7FF] rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Top items preview */}
        <div className="mt-3 flex gap-1.5 flex-wrap">
          {c.topItems.slice(0, 2).map((item) => (
            <span key={item} className="inline-flex items-center gap-1 text-[11px] bg-[#F3F0FF] text-[#5B21B6] px-2 py-0.5 rounded-full">
              <Gem size={9} />
              {item}
            </span>
          ))}
          {c.topItems.length > 2 && (
            <span className="text-[11px] text-gray-400 px-1 self-center">+{c.topItems.length - 2} more</span>
          )}
        </div>

        {/* Last active */}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
          <Clock size={10} />
          <span>Active {c.lastActive} · Member since {c.memberSince} · Last visit {c.lastVisit}</span>
        </div>

        {/* Expanded contact */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#F0EEF8] space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contact</p>
              <div className="flex flex-col gap-2">
                <a href={`tel:${c.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#5B21B6] transition-colors">
                  <Phone size={13} className="text-[#8B5CF6]" /> {c.phone}
                </a>
                <a href={`mailto:${c.email}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#5B21B6] transition-colors">
                  <Mail size={13} className="text-[#8B5CF6]" /> {c.email}
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Full Wishlist Preview</p>
              <div className="space-y-1.5">
                {c.topItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-[#F8F7FF] rounded-lg px-3 py-2">
                    <Gem size={11} className="text-[#8B5CF6] flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <a href={`tel:${c.phone.replace(/\D/g, "")}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#5B21B6] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#4C1D95] transition-colors">
                <Phone size={14} /> Call
              </a>
              <a href={`mailto:${c.email}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F3F0FF] text-[#5B21B6] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#EDE8FA] transition-colors">
                <Mail size={14} /> Email
              </a>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-[#5B21B6] hover:bg-[#F8F7FF] transition-colors border-t border-[#F0EEF8]"
      >
        {expanded ? <><ChevronUp size={14} /> Hide</> : <><ChevronDown size={14} /> View contact & wishlist</>}
      </button>
    </div>
  );
}

const SORT_OPTIONS = [
  { key: "distance", label: "Nearest First" },
  { key: "value", label: "Wishlist Value" },
  { key: "spend", label: "Total Spend" },
  { key: "recent", label: "Recently Active" },
];

export default function CustomerProfiles() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("distance");
  const [tierFilter, setTierFilter] = useState<"all" | CustomerProfile["tier"]>("all");

  const results = useMemo(() => {
    let list = [...CUSTOMER_PROFILES];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }
    if (tierFilter !== "all") list = list.filter((c) => c.tier === tierFilter);
    if (sort === "distance") list.sort((a, b) => a.distanceMiles - b.distanceMiles);
    else if (sort === "value") list.sort((a, b) => b.estimatedWishlistValue - a.estimatedWishlistValue);
    else if (sort === "spend") list.sort((a, b) => b.totalSpend - a.totalSpend);
    return list;
  }, [query, sort, tierFilter]);

  const vipCount = CUSTOMER_PROFILES.filter((c) => c.tier === "vip").length;
  const totalValue = CUSTOMER_PROFILES.reduce((s, c) => s + c.estimatedWishlistValue, 0);
  const nearby = CUSTOMER_PROFILES.filter((c) => c.distanceMiles <= 25).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Your Customers</h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <MapPin size={12} className="text-[#8B5CF6]" />
          <p className="text-sm text-gray-500">
            DiaGe users who have linked their profile to {STORE_CITY}
          </p>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Customers", value: CUSTOMER_PROFILES.length, accent: false },
          { label: "VIP Members", value: vipCount, accent: true },
          { label: "Within 25 mi", value: nearby, accent: false },
          { label: "Combined Wishlist", value: `$${(totalValue / 1000).toFixed(0)}K`, accent: false },
        ].map((s) => (
          <div key={s.label}
            className={`rounded-xl px-4 py-3 border ${s.accent ? "bg-[#5B21B6] border-[#4C1D95]" : "bg-white border-[#E5E2F0]"}`}>
            <p className={`text-xl font-bold ${s.accent ? "text-white" : "text-gray-900"}`}>{s.value}</p>
            <p className={`text-xs mt-0.5 ${s.accent ? "text-[#C4B5FD]" : "text-gray-400"}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone, or location…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E2F0] text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 mr-1">Tier:</span>
            {(["all", "vip", "regular", "new"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-colors ${
                  tierFilter === t
                    ? "bg-[#5B21B6] text-white border-[#5B21B6]"
                    : "bg-white text-gray-600 border-[#E5E2F0] hover:border-[#8B5CF6]"
                }`}
              >
                {t === "all" ? `All (${CUSTOMER_PROFILES.length})` : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-[#E5E2F0]" />

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 mr-1">Sort:</span>
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.key}
                onClick={() => setSort(o.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  sort === o.key
                    ? "bg-[#5B21B6] text-white border-[#5B21B6]"
                    : "bg-white text-gray-600 border-[#E5E2F0] hover:border-[#8B5CF6]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Search size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No customers match your search</p>
          <p className="text-xs mt-1">Try a different name, email, or location</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {results.map((c) => <CustomerCard key={c.id} c={c} />)}
        </div>
      )}
    </div>
  );
}
