import { useState } from "react";
import { Phone, Mail, ChevronDown, ChevronUp, Gem } from "lucide-react";
import { LEADS, RETAILER_NAME, type Lead } from "@/data/demo";

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

function fmt(n: number) {
  return `$${n.toLocaleString()}`;
}

function LeadCard({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E2F0] overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#F3F0FF] flex items-center justify-center text-[#5B21B6] font-bold text-sm flex-shrink-0">
              {lead.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
              <p className="text-xs text-gray-400">{lead.location} · Shared {lead.sharedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
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
  const [filter, setFilter] = useState<"all" | Lead["priority"]>("all");

  const filtered = filter === "all" ? LEADS : LEADS.filter((l) => l.priority === filter);
  const high = LEADS.filter((l) => l.priority === "high").length;
  const med = LEADS.filter((l) => l.priority === "medium").length;
  const low = LEADS.filter((l) => l.priority === "low").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Wishlist Leads</h1>
        <p className="text-sm text-gray-500 mt-0.5">Customers who shared their wishlist with {RETAILER_NAME}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: "all", label: `All (${LEADS.length})` },
          { key: "high", label: `High Priority (${high})` },
          { key: "medium", label: `Medium (${med})` },
          { key: "low", label: `Low (${low})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              filter === key
                ? "bg-[#5B21B6] text-white border-[#5B21B6]"
                : "bg-white text-gray-600 border-[#E5E2F0] hover:border-[#8B5CF6]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
