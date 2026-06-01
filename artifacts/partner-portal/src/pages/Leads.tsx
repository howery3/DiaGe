import { useState, useEffect } from "react";
import { Phone, Mail, ChevronDown, ChevronUp, Gem, MapPin, Navigation, Zap } from "lucide-react";
import { LEADS, RETAILER_NAME, STORE_NAME, STORE_CITY, type Lead } from "@/data/demo";

const PORTAL_STORE_ID = "kay-fifth-ave";

interface LiveShare {
  id: string;
  type: string;
  data: {
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    ringSize?: string;
    budgetRange?: string;
    wishlistItems?: Array<{ name: string; estimatedPrice: string; priority: string; retailer: string }>;
    message?: string;
    sharedAt?: string;
  };
  createdAt: string;
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function LiveShareCard({ share }: { share: LiveShare }) {
  const d = share.data;
  const isWishlist = share.type === "wishlist";
  const items = d.wishlistItems ?? [];
  const topItem = items[0];
  const totalValue = items.reduce((sum, w) => {
    const num = parseFloat(w.estimatedPrice.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="bg-white rounded-2xl border-2 border-green-300 overflow-hidden relative">
      {/* Live badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
        LIVE
      </div>

      <div className="px-5 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
            {(d.userName ?? "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 text-sm">{d.userName ?? "DiaGe User"}</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                {isWishlist ? "Wishlist Share" : "Appt Request"}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Shared via DiaGe app · {timeAgo(share.createdAt)}
            </p>
          </div>
        </div>

        {isWishlist && items.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {items.slice(0, 3).map((w, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <Gem size={10} className="text-[#8B5CF6] flex-shrink-0" />
                <span className="flex-1 text-gray-700 truncate">{w.name}</span>
                <span className="font-semibold text-[#5B21B6]">{w.estimatedPrice}</span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-xs text-gray-400">+{items.length - 3} more items</p>
            )}
          </div>
        )}

        {!isWishlist && d.message && (
          <p className="text-sm text-gray-600 italic mb-3 leading-relaxed">"{d.message}"</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {d.ringSize && <span>💍 Ring size {d.ringSize}</span>}
          {d.budgetRange && <span>💰 Budget {d.budgetRange}</span>}
          {totalValue > 0 && <span className="font-semibold text-[#5B21B6]">Total value ${totalValue.toLocaleString()}</span>}
        </div>
      </div>

      <div className="border-t border-green-100 px-5 py-2.5 flex gap-3">
        {d.userEmail && (
          <a href={`mailto:${d.userEmail}`} className="flex items-center gap-1.5 text-xs font-medium text-[#5B21B6] hover:underline">
            <Mail size={12} /> {d.userEmail}
          </a>
        )}
        {d.userPhone && (
          <a href={`tel:${d.userPhone}`} className="flex items-center gap-1.5 text-xs font-medium text-[#5B21B6] hover:underline">
            <Phone size={12} /> {d.userPhone}
          </a>
        )}
      </div>
    </div>
  );
}

const PRIORITY_STYLE: Record<Lead["priority"], string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-green-50 text-green-700 border-green-200",
};

const PRIORITY_LABEL: Record<Lead["priority"], string> = {
  high: "High Priority",
  medium: "Medium",
  low: "Low Priority",
};

const RANGE_OPTIONS = [
  { key: "25", label: "< 25 mi", max: 25 },
  { key: "100", label: "< 100 mi", max: 100 },
  { key: "500", label: "< 500 mi", max: 500 },
  { key: "all", label: "All", max: Infinity },
];

function distanceBadge(miles: number) {
  if (miles < 15) return { label: `${miles} mi`, bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
  if (miles < 50) return { label: `${miles} mi`, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
  if (miles < 250) return { label: `${miles} mi`, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
  return { label: `${miles} mi`, bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" };
}

function fmt(n: number) {
  return `$${n.toLocaleString()}`;
}

function LeadCard({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false);
  const badge = distanceBadge(lead.distanceMiles);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E2F0] overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#F3F0FF] flex items-center justify-center text-[#5B21B6] font-bold text-sm flex-shrink-0">
              {lead.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-400 truncate">{lead.location} · Shared {lead.sharedDate}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.bg} ${badge.text} ${badge.border}`}>
              <Navigation size={9} />
              {badge.label}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_STYLE[lead.priority]}`}>
              {PRIORITY_LABEL[lead.priority]}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Gem size={12} className="text-[#8B5CF6]" />
            <span>{lead.itemCount} {lead.itemCount === 1 ? "item" : "items"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="truncate">Top: <span className="font-medium text-gray-700">{lead.topItem}</span></span>
          </div>
          <span className="font-semibold text-[#5B21B6]">{fmt(lead.estimatedValue)}</span>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#F0EEF8] space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Contact Information</p>
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${lead.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#5B21B6] transition-colors"
                >
                  <Phone size={13} className="text-[#8B5CF6]" />
                  {lead.phone}
                </a>
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#5B21B6] transition-colors"
                >
                  <Mail size={13} className="text-[#8B5CF6]" />
                  {lead.email}
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Top Saved Item</p>
              <div className="bg-[#F8F7FF] rounded-lg px-3 py-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{lead.topItem}</p>
                  <p className="text-xs text-gray-400">SKU {lead.topSku}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <a
                href={`tel:${lead.phone.replace(/\D/g, "")}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#5B21B6] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#4C1D95] transition-colors"
              >
                <Phone size={14} />
                Call Now
              </a>
              <a
                href={`mailto:${lead.email}?subject=Your ${RETAILER_NAME} Wishlist&body=Hi ${lead.name.split(" ")[0]}, I'm reaching out about the items you saved on your DiaGe wishlist...`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F3F0FF] text-[#5B21B6] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#EDE8FA] transition-colors"
              >
                <Mail size={14} />
                Email
              </a>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-[#5B21B6] hover:bg-[#F8F7FF] transition-colors border-t border-[#F0EEF8]"
      >
        {expanded ? (
          <><ChevronUp size={14} /> Hide details</>
        ) : (
          <><ChevronDown size={14} /> View contact & details</>
        )}
      </button>
    </div>
  );
}

export default function Leads() {
  const [priorityFilter, setPriorityFilter] = useState<"all" | Lead["priority"]>("all");
  const [rangeKey, setRangeKey] = useState("100");
  const [liveShares, setLiveShares] = useState<LiveShare[]>([]);

  useEffect(() => {
    async function fetchShares() {
      try {
        const res = await fetch(`/api/store-shares?storeId=${PORTAL_STORE_ID}`);
        if (res.ok) {
          const data = await res.json();
          setLiveShares(data);
        }
      } catch { /* network error — fail silently */ }
    }
    fetchShares();
    const id = setInterval(fetchShares, 6000);
    return () => clearInterval(id);
  }, []);

  const maxMiles = RANGE_OPTIONS.find((r) => r.key === rangeKey)?.max ?? Infinity;

  const sorted = [...LEADS].sort((a, b) => a.distanceMiles - b.distanceMiles);
  const byRange = sorted.filter((l) => l.distanceMiles <= maxMiles);
  const filtered = priorityFilter === "all" ? byRange : byRange.filter((l) => l.priority === priorityFilter);

  const high = byRange.filter((l) => l.priority === "high").length;
  const med = byRange.filter((l) => l.priority === "medium").length;
  const low = byRange.filter((l) => l.priority === "low").length;
  const nearby = LEADS.filter((l) => l.distanceMiles <= 25).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Wishlist Leads</h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <MapPin size={12} className="text-[#8B5CF6]" />
          <p className="text-sm text-gray-500">
            {STORE_NAME} — sorted nearest first
          </p>
        </div>
      </div>

      {/* Live shares from DiaGe app */}
      {liveShares.length > 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-green-700" />
            <p className="text-sm font-bold text-green-800">
              {liveShares.length} live share{liveShares.length !== 1 ? "s" : ""} from the DiaGe app
            </p>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              Updating every 6s
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {liveShares.map((share) => (
              <LiveShareCard key={share.id} share={share} />
            ))}
          </div>
        </div>
      )}

      {/* Geo callout */}
      <div className="rounded-xl bg-[#F3F0FF] border border-[#DDD6FE] px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#5B21B6] flex items-center justify-center flex-shrink-0">
          <Navigation size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#3B0764]">
            {nearby} lead{nearby !== 1 ? "s" : ""} within 25 miles of {STORE_CITY}
          </p>
          <p className="text-xs text-[#6D28D9] mt-0.5">
            Showing customers closest to your store first. Use the range filter to expand your reach.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 text-xs font-semibold text-[#5B21B6] bg-white border border-[#DDD6FE] rounded-lg px-3 py-1.5">
          {LEADS.length} total leads
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Distance range */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-gray-500 mr-1">Range:</span>
          {RANGE_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRangeKey(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                rangeKey === key
                  ? "bg-[#5B21B6] text-white border-[#5B21B6]"
                  : "bg-white text-gray-600 border-[#E5E2F0] hover:border-[#8B5CF6]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-[#E5E2F0]" />

        {/* Priority */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-gray-500 mr-1">Priority:</span>
          {[
            { key: "all", label: `All (${byRange.length})` },
            { key: "high", label: `High (${high})` },
            { key: "medium", label: `Medium (${med})` },
            { key: "low", label: `Low (${low})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPriorityFilter(key as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                priorityFilter === key
                  ? "bg-[#5B21B6] text-white border-[#5B21B6]"
                  : "bg-white text-gray-600 border-[#E5E2F0] hover:border-[#8B5CF6]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Navigation size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No leads within this range</p>
          <p className="text-xs mt-1">Try expanding the distance filter</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
