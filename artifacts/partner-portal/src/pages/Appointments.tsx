import { useState, useEffect, useCallback } from "react";
import { CalendarClock, MapPin, Navigation, Gem, Clock, MessageSquare, UserPlus, CheckCircle2, ArrowRight, Star, Wrench, Gift, Heart, Eye, ExternalLink, RefreshCw } from "lucide-react";
import { APPOINTMENT_REQUESTS, RETAILER_NAME, type AppointmentRequest } from "@/data/demo";

const PORTAL_STORE_ID = "kay-fifth-ave";

interface LiveShare {
  id: string;
  userId: string;
  storeId: string;
  type: string;
  data: {
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    timePref?: string;
    datePref?: string;
    itemCount?: number;
    message?: string;
    retailer?: string;
    ringSize?: string;
    budgetRange?: string;
    wishlistItems?: Array<{ name?: string; estimatedPrice?: number }>;
  };
  createdAt: string;
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function liveShareToRequest(s: LiveShare): AppointmentRequest {
  const items = s.data.wishlistItems ?? [];
  return {
    id: s.id,
    customerName: s.data.userName || "DiaGe Customer",
    location: "Linked via DiaGe",
    distanceMiles: 0,
    requestedAt: timeAgo(s.createdAt),
    preferredWindow: [s.data.timePref, s.data.datePref].filter(Boolean).join(" · ") || "Flexible",
    occasion: "Appointment Request",
    occasionType: "browse",
    wishlistPreview: items.map((w) => w.name ?? "").filter(Boolean),
    totalWishlistValue: items.reduce((sum, w) => sum + (w.estimatedPrice ?? 0), 0),
    ringSize: s.data.ringSize || undefined,
    budget: s.data.budgetRange || undefined,
    note: s.data.message || undefined,
    status: "new",
    isOptIn: true,
    urgency: "high",
  };
}

const OCCASION_CONFIG: Record<AppointmentRequest["occasionType"], { icon: React.ElementType; bg: string; text: string; border: string }> = {
  engagement:  { icon: Gem,           bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200"   },
  anniversary: { icon: Heart,         bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200"   },
  inspection:  { icon: Wrench,        bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  gift:        { icon: Gift,          bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
  browse:      { icon: Eye,           bg: "bg-[#F3F0FF]", text: "text-[#5B21B6]",  border: "border-[#DDD6FE]"  },
};

const STATUS_CONFIG: Record<AppointmentRequest["status"], { label: string; bg: string; text: string; border: string }> = {
  new:          { label: "New request",          bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200"    },
  acknowledged: { label: "Acknowledged",         bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
  logged:       { label: "Logged in system",     bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200"  },
  completed:    { label: "Visit completed",      bg: "bg-gray-50",   text: "text-gray-500",   border: "border-gray-200"   },
};

const STATUS_ORDER: AppointmentRequest["status"][] = ["new", "acknowledged", "logged", "completed"];

function StatusFlow({ current }: { current: AppointmentRequest["status"] }) {
  const steps = [
    { key: "new",          label: "Received"       },
    { key: "acknowledged", label: "Acknowledged"   },
    { key: "logged",       label: "Booked in system" },
    { key: "completed",    label: "Visit done"     },
  ] as const;
  const currentIdx = STATUS_ORDER.indexOf(current);

  return (
    <div className="flex items-center gap-0.5">
      {steps.map((s, i) => {
        const done   = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s.key} className="flex items-center gap-0.5">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              done ? "bg-green-500" : active ? "bg-[#5B21B6]" : "bg-gray-200"
            }`} />
            {i < steps.length - 1 && (
              <div className={`w-4 h-px ${done ? "bg-green-300" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
      <span className={`ml-2 text-[10px] font-semibold ${STATUS_CONFIG[current].text}`}>
        {STATUS_CONFIG[current].label}
      </span>
    </div>
  );
}

function RequestCard({ req, onStatusChange }: { req: AppointmentRequest; onStatusChange: (id: string, s: AppointmentRequest["status"]) => void }) {
  const [expanded, setExpanded] = useState(false);
  const occ  = OCCASION_CONFIG[req.occasionType];
  const OccIcon = occ.icon;

  const nextStatus: Record<AppointmentRequest["status"], AppointmentRequest["status"] | null> = {
    new:          "acknowledged",
    acknowledged: "logged",
    logged:       "completed",
    completed:    null,
  };
  const next = nextStatus[req.status];

  const nextLabel: Record<string, string> = {
    acknowledged: "Mark acknowledged",
    logged:       "Mark as logged in booking system",
    completed:    "Mark visit complete",
  };

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden ${
      req.status === "new" ? "border-[#5B21B6] shadow-sm shadow-[#EDE8FA]" : "border-[#E5E2F0]"
    }`}>
      <div className="px-5 py-4">

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                req.isOptIn ? "bg-[#F3F0FF] text-[#5B21B6]" : "bg-gray-100 text-gray-600"
              }`}>
                {req.customerName.split(" ").map((n) => n[0]).join("")}
              </div>
              {req.isOptIn && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#5B21B6] rounded-full flex items-center justify-center">
                  <Star size={7} fill="white" className="text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-semibold text-gray-900 text-sm">{req.customerName}</p>
                {req.isOptIn ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F3F0FF] text-[#5B21B6] border border-[#DDD6FE]">
                    Opt-In customer
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 flex items-center gap-0.5">
                    <UserPlus size={8} /> Anonymous
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                <MapPin size={10} />
                <span>{req.location}</span>
                <span className="text-gray-300">·</span>
                <Navigation size={9} />
                <span>{req.distanceMiles} mi</span>
                <span className="text-gray-300">·</span>
                <Clock size={9} />
                <span>{req.requestedAt}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${occ.bg} ${occ.text} ${occ.border}`}>
              <OccIcon size={10} />
              {req.occasion}
            </span>
          </div>
        </div>

        {/* Status flow */}
        <StatusFlow current={req.status} />

        {/* Preferred timing */}
        <div className="mt-3 flex items-center gap-2 bg-[#F8F7FF] rounded-lg px-3 py-2">
          <CalendarClock size={13} className="text-[#8B5CF6] flex-shrink-0" />
          <span className="text-xs text-gray-700">
            <span className="font-semibold">Preferred timing: </span>{req.preferredWindow}
          </span>
        </div>

        {/* Wishlist preview */}
        <div className="mt-2 flex flex-col gap-1">
          {req.wishlistPreview.slice(0, 2).map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-gray-600">
              <Gem size={10} className="text-[#8B5CF6] flex-shrink-0" />
              <span className="truncate">{item}</span>
            </div>
          ))}
          {req.wishlistPreview.length > 2 && (
            <span className="text-xs text-gray-400 ml-4">+{req.wishlistPreview.length - 2} more</span>
          )}
          {req.totalWishlistValue > 0 && (
            <span className="text-xs font-bold text-[#5B21B6] ml-4">≈${req.totalWishlistValue.toLocaleString()} wishlist value</span>
          )}
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#F0EEF8] space-y-3">

            {/* Positioning note */}
            <div className="flex items-start gap-2 bg-[#F3F0FF] rounded-xl px-3 py-2.5">
              <CalendarClock size={13} className="text-[#5B21B6] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#5B21B6] leading-relaxed">
                This customer initiated this request through the DiaGe app.
                Use the context below to prepare — then <span className="font-semibold">schedule the actual appointment in your existing booking system</span> and mark it logged here.
              </p>
            </div>

            {/* Context details */}
            <div className="grid grid-cols-2 gap-2">
              {req.ringSize && (
                <div className="bg-[#F8F7FF] rounded-lg px-3 py-2">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Ring Size</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{req.ringSize}</p>
                </div>
              )}
              {req.budget && (
                <div className="bg-[#F8F7FF] rounded-lg px-3 py-2">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Budget</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{req.budget}</p>
                </div>
              )}
            </div>

            {req.note && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Their Note</p>
                <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <MessageSquare size={12} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed italic">"{req.note}"</p>
                </div>
              </div>
            )}

            {/* Full wishlist for context */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Items They Want to Discuss</p>
              <div className="space-y-1.5">
                {req.wishlistPreview.map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-[#F8F7FF] rounded-lg px-3 py-2">
                    <Gem size={11} className="text-[#8B5CF6] flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {req.isOptIn && (
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                <CheckCircle2 size={13} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-green-700 leading-relaxed">
                  <span className="font-semibold">Linked customer</span> — you can view their full purchase history, active warranties, and collection on the DiaGe Opt-Ins page to prepare for this visit.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action footer */}
      {req.status !== "completed" && (
        <div className="border-t border-[#F0EEF8] px-5 py-3 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="text-xs text-gray-400 hover:text-[#5B21B6] transition-colors flex items-center gap-1"
          >
            {expanded ? "Hide" : "See context"}
            <ArrowRight size={10} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>

          <div className="flex-1" />

          {req.status === "new" || req.status === "acknowledged" ? (
            <button
              type="button"
              onClick={() => next && onStatusChange(req.id, next)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#5B21B6] text-white px-3 py-1.5 rounded-xl hover:bg-[#4C1D95] transition-colors"
            >
              <CheckCircle2 size={12} />
              {next ? nextLabel[next] : ""}
            </button>
          ) : req.status === "logged" ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                <CheckCircle2 size={11} /> Logged in booking system
              </span>
              <button
                type="button"
                onClick={() => onStatusChange(req.id, "completed")}
                className="text-xs text-gray-400 hover:text-[#5B21B6] transition-colors underline"
              >
                Mark visit done
              </button>
            </div>
          ) : null}
        </div>
      )}

      {req.status === "completed" && (
        <div className="border-t border-[#F0EEF8] px-5 py-2.5 flex items-center gap-2 text-xs text-gray-400">
          <CheckCircle2 size={12} className="text-green-500" />
          Visit completed · {req.requestedAt}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="ml-auto hover:text-[#5B21B6] transition-colors"
          >
            {expanded ? "Hide" : "View context"}
          </button>
        </div>
      )}
    </div>
  );
}

const STATUS_TABS = [
  { key: "all",          label: "All"        },
  { key: "new",          label: "New"        },
  { key: "acknowledged", label: "Acknowledged" },
  { key: "logged",       label: "Logged"     },
  { key: "completed",    label: "Completed"  },
] as const;

export default function Appointments() {
  const [demoRequests, setDemoRequests] = useState(APPOINTMENT_REQUESTS);
  const [liveRequests, setLiveRequests] = useState<AppointmentRequest[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [tab, setTab] = useState<"all" | AppointmentRequest["status"]>("all");

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch(`/api/store-shares?storeId=${PORTAL_STORE_ID}`);
      if (!res.ok) return;
      const all: LiveShare[] = await res.json();
      const appts = all
        .filter((s) => s.type === "appointment")
        .map(liveShareToRequest);
      setLiveRequests(appts);
    } catch { /* silently ignore */ } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 10000);
    return () => clearInterval(interval);
  }, [fetchLive]);

  // Live requests lead, demo fills in below
  const requests = [...liveRequests, ...demoRequests];

  function handleStatusChange(id: string, next: AppointmentRequest["status"]) {
    if (liveRequests.find((r) => r.id === id)) {
      setLiveRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: next } : r));
    } else {
      setDemoRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: next } : r));
    }
  }

  const displayed = tab === "all" ? requests : requests.filter((r) => r.status === tab);
  const newCount  = requests.filter((r) => r.status === "new").length;
  const highCount = requests.filter((r) => r.urgency === "high").length;
  const loggedPct = requests.length > 0
    ? Math.round((requests.filter((r) => r.status === "logged" || r.status === "completed").length / requests.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Appointment Requests</h1>
            {liveRequests.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {liveRequests.length} live
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Customer-initiated visit requests from the DiaGe app — not a scheduling tool
          </p>
        </div>
        <button
          type="button"
          onClick={fetchLive}
          disabled={liveLoading}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#5B21B6] transition-colors mt-1"
        >
          <RefreshCw size={12} className={liveLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Positioning callout */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#DDD6FE] bg-[#F3F0FF] px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock size={13} className="text-[#5B21B6]" />
            <p className="text-xs font-bold text-[#3B0764] uppercase tracking-wide">What DiaGe does here</p>
          </div>
          <p className="text-xs text-[#6D28D9] leading-relaxed">
            Surfaces <span className="font-semibold">who wants to come in and why</span> — with their full wishlist context so you can prepare. Customer-initiated only; no store-side booking.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink size={13} className="text-gray-500" />
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Your existing booking system</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Handles the actual <span className="font-semibold">calendar, time slots, and confirmation</span>. After reviewing the request here, log the appointment there as usual.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#5B21B6] rounded-xl px-4 py-3">
          <p className="text-xl font-bold text-white">{newCount}</p>
          <p className="text-xs text-[#C4B5FD] mt-0.5">Awaiting response</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E2F0] px-4 py-3">
          <p className="text-xl font-bold text-gray-900">{highCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">High-intent occasions</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E2F0] px-4 py-3">
          <p className="text-xl font-bold text-gray-900">{loggedPct}%</p>
          <p className="text-xs text-gray-400 mt-0.5">Booked or completed</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_TABS.map(({ key, label }) => {
          const count = key === "all" ? requests.length : requests.filter((r) => r.status === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                tab === key
                  ? "bg-[#5B21B6] text-white border-[#5B21B6]"
                  : "bg-white text-gray-600 border-[#E5E2F0] hover:border-[#8B5CF6]"
              }`}
            >
              {label} {count > 0 && <span className="opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CalendarClock size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No requests in this status</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {displayed.map((req) => (
            <RequestCard key={req.id} req={req} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
