import { Check, DollarSign, Building2, TrendingUp, Shield, Zap, Gem, Bell, Smartphone, BarChart3, Users, Printer } from "lucide-react";

const PRICE_PER_LOCATION = 369;
const ANNUAL_PRICE = PRICE_PER_LOCATION * 12;
const SIGNET_STORES = 2_800;
const AVG_ORDER_VALUE = 2_847;
const ANNUAL_DISCOUNT_PCT = 15;
const AVG_BRIDAL_SALE = 2_000;
const BRIDAL_WARRANTY = 369;

const TIERS = [
  { label: "Pilot",        stores: 10,          color: "#5B21B6" },
  { label: "Regional",     stores: 100,         color: "#7C3AED" },
  { label: "Full Signet",  stores: SIGNET_STORES, color: "#4C1D95" },
];

const FEATURES = [
  { icon: Smartphone, label: "DiaGe Customer App",           detail: "iOS-first, white-label ready for Signet brands" },
  { icon: Gem,        label: "Live Wishlist Intelligence",    detail: "Real-time signals from customer collections" },
  { icon: Bell,       label: "Diamond Bond Reminders",       detail: "Automated inspection alerts, preventing plan lapses" },
  { icon: Users,      label: "Partner Portal",               detail: "Per-banner store associate dashboard (Kay, Zales, Jared, Banter)" },
  { icon: BarChart3,  label: "Corporate Analytics",          detail: "Signet-wide revenue attribution & cross-banner insights" },
  { icon: Zap,        label: "Ready-to-Buy Signals",         detail: "High-intent lead alerts for store outreach" },
  { icon: Shield,     label: "Diamond Bond Risk Dashboard",  detail: "Network-wide missed inspection monitoring" },
  { icon: TrendingUp, label: "Cross-Banner Intelligence",    detail: "Customers shopping multiple Signet banners — only DiaGe sees this" },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function Pricing() {
  return (
    <div className="space-y-8 print:space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Enterprise Pricing</h1>
          <p className="text-sm text-gray-500 mt-0.5">Prepared for Signet Jewelers · Confidential &amp; Internal</p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#5B21B6] bg-white border border-gray-200 rounded-xl px-4 py-2 hover:border-[#8B5CF6] transition-colors"
        >
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      {/* Print header — only visible when printing */}
      <div className="hidden print:block mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-[#5B21B6] rounded-lg flex items-center justify-center">
            <Gem size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">DiaGe</span>
        </div>
        <p className="text-sm text-gray-500">Enterprise Partnership Pricing · Prepared for Signet Jewelers · Confidential</p>
      </div>

      {/* Hero price card */}
      <div className="bg-[#5B21B6] rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">DiaGe Enterprise · Per Location</p>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-7xl font-black">${PRICE_PER_LOCATION}</span>
            <div className="pb-3">
              <p className="text-white/80 text-sm font-semibold">/ month</p>
              <p className="text-white/60 text-xs">per store location</p>
            </div>
          </div>
          <p className="text-white/70 text-sm mb-5">
            Or <span className="font-semibold text-white">${Math.round(ANNUAL_PRICE * (1 - ANNUAL_DISCOUNT_PCT / 100) / 12)}/mo</span> billed annually — save {ANNUAL_DISCOUNT_PCT}%
          </p>

          {/* Warranty equivalency — the core pitch */}
          <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-4 mb-5">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-2xl font-black">${AVG_BRIDAL_SALE.toLocaleString()}</p>
                <p className="text-xs text-white/70 mt-0.5">avg bridal sale</p>
              </div>
              <div className="text-white/50 text-xl font-light">→</div>
              <div className="text-center px-4 py-2 bg-white/20 rounded-xl ring-2 ring-white/30">
                <p className="text-2xl font-black">${BRIDAL_WARRANTY}</p>
                <p className="text-xs text-white/70 mt-0.5">lifetime protection plan</p>
              </div>
              <div className="text-white/50 text-xl font-light">=</div>
              <div className="flex-1 min-w-[160px]">
                <p className="text-sm font-bold leading-snug">One warranty sold pays for DiaGe for the entire month.</p>
                <p className="text-xs text-white/60 mt-1">The cost of DiaGe is exactly the price of one lifetime protection plan on one average bridal sale — every other sale is pure upside.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/15 rounded-xl px-4 py-2">
              <p className="text-xs text-white/60 mb-0.5">Break-even</p>
              <p className="text-sm font-bold">1 bridal warranty / mo</p>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-2">
              <p className="text-xs text-white/60 mb-0.5">ROI at avg order</p>
              <p className="text-sm font-bold">{Math.round((AVG_ORDER_VALUE / PRICE_PER_LOCATION) * 10) / 10}× on one sale</p>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-2">
              <p className="text-xs text-white/60 mb-0.5">Full Signet / yr</p>
              <p className="text-sm font-bold">{fmt(SIGNET_STORES * ANNUAL_PRICE)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* What's included */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Check size={15} className="text-[#5B21B6]" />
          Everything included at every location
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                <f.icon size={13} className="text-[#5B21B6]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{f.label}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{f.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-5 pt-4 border-t border-gray-100">
          Includes onboarding, associate training materials, and dedicated partner support. No setup fee. No long-term contract required for pilot.
        </p>
      </div>

      {/* Network scale */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-1">Signet Network — Scale Economics</h2>
        <p className="text-xs text-gray-400 mb-5">
          At $369/mo per location, the unit economics improve as the pilot expands. Full rollout across all {SIGNET_STORES.toLocaleString()} Signet doors positions DiaGe as a permanent CRM layer.
        </p>
        <div className="space-y-4">
          {TIERS.map((t) => {
            const monthly  = t.stores * PRICE_PER_LOCATION;
            const annually = monthly * 12;
            const annualDiscounted = annually * (1 - ANNUAL_DISCOUNT_PCT / 100);
            const maxMonthly = TIERS[TIERS.length - 1].stores * PRICE_PER_LOCATION;
            const barPct = Math.round((monthly / maxMonthly) * 100);
            return (
              <div key={t.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-gray-500" />
                    <span className="text-sm font-bold text-gray-800">{t.label}</span>
                    <span className="text-xs text-gray-400">{t.stores.toLocaleString()} locations</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 mb-0.5">Monthly</p>
                      <p className="text-base font-black" style={{ color: t.color }}>{fmt(monthly)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 mb-0.5">Annual (monthly)</p>
                      <p className="text-sm font-bold text-gray-800">{fmt(annually)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-emerald-600 mb-0.5 font-semibold">Annual (−{ANNUAL_DISCOUNT_PCT}%)</p>
                      <p className="text-sm font-bold text-emerald-700">{fmt(annualDiscounted)}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${barPct}%`, background: t.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fine print */}
      <div className="text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-4 pb-2">
        Pricing is per active store location per calendar month. Annual pricing subject to signed agreement. Pilot pricing available for initial cohort of up to 25 locations. All revenue attribution figures are from pilot-store data and projections — actual results may vary. DiaGe retains ownership of the platform; Signet retains all customer relationship data. Custom SLA and data agreements available for enterprise contracts.
      </div>
    </div>
  );
}
