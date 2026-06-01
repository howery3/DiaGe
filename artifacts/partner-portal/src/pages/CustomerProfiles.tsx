import { useState, useMemo } from "react";
import { Search, Phone, Mail, MapPin, ChevronDown, ChevronUp, Star, Gem, Navigation, Clock, Zap, Info, ShieldCheck, ShieldAlert, ShieldOff, Diamond, FileText, Receipt, Award, Wrench, ShoppingBag, Store, ExternalLink } from "lucide-react";
import { CUSTOMER_PROFILES, STORE_CITY, RETAILER_NAME, type CustomerProfile, type RetailerPurchase } from "@/data/demo";

const DOC_ICON: Record<string, React.ElementType> = {
  warranty:    ShieldCheck,
  receipt:     Receipt,
  certificate: Award,
  appraisal:   FileText,
  repair:      Wrench,
};

const WARRANTY_STYLE = {
  active:         { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  icon: ShieldCheck, label: "Active"         },
  "expiring-soon":{ bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  icon: ShieldAlert, label: "Expiring Soon"  },
  expired:        { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200",    icon: ShieldOff,   label: "Expired"        },
} as const;

function PurchaseCard({ p }: { p: RetailerPurchase }) {
  const ws = p.warrantyStatus ? WARRANTY_STYLE[p.warrantyStatus] : null;
  const WIcon = ws?.icon ?? ShieldCheck;

  return (
    <div className="rounded-xl border border-[#E5E2F0] bg-[#FDFCFF] overflow-hidden">
      {/* Item header */}
      <div className="px-3 py-2.5 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug">{p.item}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">SKU {p.sku} · Purchased {p.purchaseDate}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-[#5B21B6]">${p.purchasePrice.toLocaleString()}</p>
        </div>
      </div>

      {/* Badges row */}
      <div className="px-3 pb-2.5 flex flex-wrap gap-1.5">
        {ws && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ws.bg} ${ws.text} ${ws.border}`}>
            <WIcon size={9} />
            {ws.label}
            {p.warrantyType && ` · ${p.warrantyType}`}
            {p.warrantyExpiry && ` · exp. ${p.warrantyExpiry}`}
          </span>
        )}
        {!p.warrantyStatus && p.warrantyType && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
            <ShieldCheck size={9} /> {p.warrantyType}
          </span>
        )}
        {p.diamondBond && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-[#F3F0FF] text-[#5B21B6] border-[#DDD6FE]">
            <Diamond size={9} /> Diamond Bond
          </span>
        )}
      </div>

      {/* Uploaded docs */}
      {p.docs.length > 0 && (
        <div className="border-t border-[#F0EEF8] px-3 pt-2 pb-1.5 flex flex-col gap-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Uploaded Documents</p>
            <span className="text-[9px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full border border-gray-200">
              DEMO — links live in production
            </span>
          </div>
          {p.docs.map((doc) => {
            const DIcon = DOC_ICON[doc.type] ?? FileText;
            return (
              <div
                key={doc.name}
                title="In production, this opens the customer-uploaded file directly from secure storage"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#F3F0FF] group cursor-not-allowed transition-colors"
              >
                <DIcon size={11} className="text-[#8B5CF6] flex-shrink-0" />
                <span className="text-[11px] text-[#5B21B6] underline decoration-dotted underline-offset-2 truncate group-hover:decoration-solid">
                  {doc.name}
                </span>
                <ExternalLink size={9} className="ml-auto text-gray-300 group-hover:text-[#8B5CF6] flex-shrink-0 transition-colors" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const TIER_STYLE: Record<CustomerProfile["tier"], { bg: string; text: string; border: string; label: string }> = {
  vip:     { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-300",   label: "High Intent" },
  regular: { bg: "bg-[#F3F0FF]",  text: "text-[#5B21B6]",   border: "border-[#DDD6FE]",   label: "Active"      },
  new:     { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    label: "New Opt-In"  },
};

function fmtCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function distanceBadge(miles: number) {
  if (miles < 15) return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
  if (miles < 50) return { bg: "bg-blue-50",  text: "text-blue-700",  border: "border-blue-200"  };
  return               { bg: "bg-amber-50",   text: "text-amber-700", border: "border-amber-200" };
}

function CustomerCard({ c }: { c: CustomerProfile }) {
  const [expanded, setExpanded] = useState(false);
  const tier = TIER_STYLE[c.tier];
  const dist = distanceBadge(c.distanceMiles);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E2F0] overflow-hidden">
      <div className="px-5 py-4">
        {/* Header */}
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

        {/* DiaGe-specific stats — intentionally different from clientelling */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "Wishlisted",      value: c.wishlistCount },
            { label: "Pieces Owned",    value: c.collectionCount },
            { label: "Reminders",       value: c.wishlistCount > 3 ? "2 active" : "0 active" },
          ].map((s) => (
            <div key={s.label} className="bg-[#F8F7FF] rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Wishlist preview chips */}
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

        {/* Opted in / last active */}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
          <Clock size={10} />
          <span>Opted in via DiaGe · Active {c.lastActive} · Linked {c.memberSince}</span>
        </div>

        {/* Expanded: wishlist context + outreach */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#F0EEF8] space-y-4">

            {/* Outreach context note */}
            <div className="flex items-start gap-2 bg-[#F3F0FF] rounded-xl px-3 py-2.5">
              <Info size={13} className="text-[#5B21B6] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#5B21B6] leading-relaxed">
                This customer opted in and chose to share their wishlist with your store.
                Use this context to personalise outreach — then log the interaction in your scheduling tool as usual.
              </p>
            </div>

            {/* Full wishlist */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Their Wishlist</p>
              <div className="space-y-1.5">
                {c.topItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-[#F8F7FF] rounded-lg px-3 py-2">
                    <Gem size={11} className="text-[#8B5CF6] flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Retailer purchase snapshot */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Store size={12} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{RETAILER_NAME} Purchases</p>
                </div>
                {c.retailerPurchases.length > 0 && (
                  <span className="text-xs font-bold text-[#5B21B6]">
                    ${c.totalSpend.toLocaleString()} total
                  </span>
                )}
              </div>
              {c.retailerPurchases.length === 0 ? (
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <ShoppingBag size={13} className="text-gray-300 flex-shrink-0" />
                  <p className="text-xs text-gray-400">No purchases on file yet — browsing opt-in customer</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {c.retailerPurchases.map((p) => <PurchaseCard key={p.sku} p={p} />)}
                </div>
              )}
            </div>

            {/* Contact for outreach */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Reach Out</p>
              <div className="flex gap-2">
                <a
                  href={`tel:${c.phone.replace(/\D/g, "")}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#5B21B6] text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#4C1D95] transition-colors"
                >
                  <Phone size={13} /> Call re: wishlist
                </a>
                <a
                  href={`mailto:${c.email}?subject=Your%20DiaGe%20wishlist%20at%20Kay%20Jewelers&body=Hi%20${c.name.split(" ")[0]}%2C%0A%0AI%20noticed%20you%20have%20some%20pieces%20on%20your%20DiaGe%20wishlist%20and%20wanted%20to%20reach%20out.`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#F3F0FF] text-[#5B21B6] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#EDE8FA] transition-colors"
                >
                  <Mail size={13} /> Email re: wishlist
                </a>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-1.5">
                Schedule the appointment in your existing booking system after connecting
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
        className="w-full py-2 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-[#5B21B6] hover:bg-[#F8F7FF] transition-colors border-t border-[#F0EEF8]"
      >
        {expanded
          ? <><ChevronUp size={14} /> Hide wishlist</>
          : <><ChevronDown size={14} /> View wishlist & outreach</>}
      </button>
    </div>
  );
}

const SORT_OPTIONS = [
  { key: "distance", label: "Nearest First"   },
  { key: "value",    label: "Wishlist Value"   },
  { key: "recent",   label: "Recently Active"  },
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
          c.location.toLowerCase().includes(q) ||
          c.topItems.some((i) => i.toLowerCase().includes(q))
      );
    }
    if (tierFilter !== "all") list = list.filter((c) => c.tier === tierFilter);
    if (sort === "distance") list.sort((a, b) => a.distanceMiles - b.distanceMiles);
    else if (sort === "value") list.sort((a, b) => b.estimatedWishlistValue - a.estimatedWishlistValue);
    return list;
  }, [query, sort, tierFilter]);

  const highIntentCount = CUSTOMER_PROFILES.filter((c) => c.tier === "vip").length;
  const totalValue = CUSTOMER_PROFILES.reduce((s, c) => s + c.estimatedWishlistValue, 0);
  const nearby = CUSTOMER_PROFILES.filter((c) => c.distanceMiles <= 25).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">DiaGe Opt-In Customers</h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <MapPin size={12} className="text-[#8B5CF6]" />
          <p className="text-sm text-gray-500">
            Customers who chose to share their wishlist with {STORE_CITY} via the DiaGe app
          </p>
        </div>
      </div>

      {/* Positioning callout */}
      <div className="rounded-xl bg-[#F3F0FF] border border-[#DDD6FE] px-4 py-3 flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-[#5B21B6] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Zap size={13} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#3B0764]">Intent signals, not a client book</p>
          <p className="text-xs text-[#6D28D9] mt-0.5 leading-relaxed">
            These customers opted in and actively shared their wishlist with your store — that's a buying signal.
            Use this alongside your existing scheduling and CRM tools; DiaGe is the layer that tells you
            <em> who to contact and why</em>, not a replacement for how you manage relationships.
          </p>
        </div>
      </div>

      {/* Summary stats — DiaGe-specific numbers only */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Opted-In Customers", value: CUSTOMER_PROFILES.length, accent: false },
          { label: "High Intent",        value: highIntentCount,          accent: true  },
          { label: "Within 25 mi",       value: nearby,                   accent: false },
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
            placeholder="Search by name, location, or wishlist item…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E2F0] text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 mr-1">Intent:</span>
            {(["all", "vip", "regular", "new"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  tierFilter === t
                    ? "bg-[#5B21B6] text-white border-[#5B21B6]"
                    : "bg-white text-gray-600 border-[#E5E2F0] hover:border-[#8B5CF6]"
                }`}
              >
                {t === "all"     ? `All (${CUSTOMER_PROFILES.length})` :
                 t === "vip"     ? "High Intent" :
                 t === "regular" ? "Active" :
                                   "New Opt-In"}
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
          <p className="text-xs mt-1">Try a different name, location, or wishlist item</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {results.map((c) => <CustomerCard key={c.id} c={c} />)}
        </div>
      )}
    </div>
  );
}
