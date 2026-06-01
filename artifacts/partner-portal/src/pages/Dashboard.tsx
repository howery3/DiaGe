import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Users, ShoppingBag, DollarSign, TrendingUp, MessageSquare, Star, Flame, CalendarClock, ShieldAlert, ArrowRight } from "lucide-react";
import { KPI, KPI_DELTAS, MONTHLY_ACTIVITY, TYPE_BREAKDOWN, PRICE_RANGE_DATA, ACTIONABLE_NOW, RETAILER_NAME } from "@/data/demo";
import { useLocation } from "wouter";

const PURPLE = "#5B21B6";
const LIGHT_PURPLE = "#8B5CF6";
const PIE_COLORS = ["#5B21B6", "#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD"];

function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function DeltaBadge({ delta }: { delta: number }) {
  const positive = delta >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
      {positive ? "▲" : "▼"} {Math.abs(delta)}% MoM
    </span>
  );
}

function KpiCard({ label, value, sub, icon: Icon, accent, delta }: {
  label: string; value: string | number; sub: string;
  icon: React.ElementType; accent?: boolean; delta: number;
}) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? "bg-[#5B21B6] border-[#4C1D95] text-white" : "bg-white border-[#E5E2F0]"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${accent ? "bg-white/15" : "bg-[#F3F0FF]"}`}>
          <Icon size={18} className={accent ? "text-white" : "text-[#5B21B6]"} />
        </div>
        {accent
          ? <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">▲ {delta}% MoM</span>
          : <DeltaBadge delta={delta} />
        }
      </div>
      <p className={`text-2xl font-bold mb-0.5 ${accent ? "text-white" : "text-gray-900"}`}>{value}</p>
      <p className={`text-xs font-semibold mb-0.5 ${accent ? "text-white/90" : "text-gray-700"}`}>{label}</p>
      <p className={`text-xs ${accent ? "text-white/65" : "text-gray-400"}`}>{sub}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5E2F0] rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-gray-600">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span>{p.name}: <span className="font-semibold text-gray-900">{p.value.toLocaleString()}</span></span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{RETAILER_NAME} — Partner Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Customer-initiated wishlist signals from the DiaGe app — use alongside your existing clientelling and scheduling tools</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Customers Reached" value={KPI.customersReached} sub="Shared wishlist with your store" icon={Users} accent delta={KPI_DELTAS.customersReached} />
        <KpiCard label="Active Wishlists" value={KPI.activeWishlists} sub="Unique customers this month" icon={ShoppingBag} delta={KPI_DELTAS.activeWishlists} />
        <KpiCard label="Total Wishlist Value" value={fmt(KPI.totalWishlistValue)} sub="Aggregated across all customers" icon={DollarSign} delta={KPI_DELTAS.totalWishlistValue} />
        <KpiCard label="Avg Items / Customer" value={KPI.avgItemsPerCustomer} sub="Per active wishlist" icon={Star} delta={KPI_DELTAS.avgItemsPerCustomer} />
        <KpiCard label="Quote Requests" value={KPI.quoteRequests} sub="Insurance quotes sent this month" icon={MessageSquare} delta={KPI_DELTAS.quoteRequests} />
        <KpiCard label="Items Shared to Store" value={KPI.itemsSharedToStore.toLocaleString()} sub="Via DiaGe app this month" icon={TrendingUp} delta={KPI_DELTAS.itemsSharedToStore} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button type="button" onClick={() => setLocation("/leads")}
          className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-left hover:bg-rose-100 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
            <Flame size={18} className="text-rose-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-rose-700">{ACTIONABLE_NOW.hotLeads}</p>
            <p className="text-xs font-semibold text-rose-600">Hot Wishlist Leads</p>
            <p className="text-[11px] text-rose-400">Shared in last 48 hrs</p>
          </div>
          <ArrowRight size={14} className="text-rose-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button type="button" onClick={() => setLocation("/appointments")}
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left hover:bg-amber-100 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <CalendarClock size={18} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-amber-700">{ACTIONABLE_NOW.pendingVisitRequests}</p>
            <p className="text-xs font-semibold text-amber-600">Visit Requests Pending</p>
            <p className="text-[11px] text-amber-400">Awaiting acknowledgment</p>
          </div>
          <ArrowRight size={14} className="text-amber-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button type="button" onClick={() => setLocation("/customers")}
          className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left hover:bg-blue-100 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={18} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-blue-700">{ACTIONABLE_NOW.expiringWarranties}</p>
            <p className="text-xs font-semibold text-blue-600">Warranties Expiring</p>
            <p className="text-[11px] text-blue-400">Opt-In customers, next 30 days</p>
          </div>
          <ArrowRight size={14} className="text-blue-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5E2F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Monthly Wishlist Activity</h2>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">▲ 32% items shared vs last month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_ACTIVITY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gWish" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PURPLE} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gShare" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={LIGHT_PURPLE} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={LIGHT_PURPLE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEF8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="wishlists" name="Wishlists" stroke={PURPLE} fill="url(#gWish)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="shares" name="Items Shared" stroke={LIGHT_PURPLE} fill="url(#gShare)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className="w-3 h-0.5 bg-[#5B21B6] inline-block rounded" /> Wishlists</div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className="w-3 h-0.5 bg-[#8B5CF6] inline-block rounded" /> Items Shared</div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E2F0] p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Price Range Distribution</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PRICE_RANGE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={72}
                dataKey="count" nameKey="range" paddingAngle={2} startAngle={90} endAngle={-270}>
                {PRICE_RANGE_DATA.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number, n: string) => [`${v} items`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {PRICE_RANGE_DATA.map((d, i) => (
              <div key={d.range} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-xs text-gray-600">{d.range}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-[#F3F0FF] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ background: PIE_COLORS[i], width: `${d.pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8 text-right">{d.pct}%</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-3">Sweet spot: <span className="font-semibold text-gray-600">$1K–$5K</span> — 47% of all wishlisted items</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E2F0] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Wishlisted Items by Category</h2>
          <span className="text-[11px] text-gray-400">count · total wishlist value</span>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={TYPE_BREAKDOWN} margin={{ top: 0, right: 10, left: -20, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EEF8" vertical={false} />
            <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Items Saved" radius={[6, 6, 0, 0]}>
              {TYPE_BREAKDOWN.map((_, i) => (
                <Cell key={i} fill={i === 0 ? PURPLE : LIGHT_PURPLE} fillOpacity={i === 0 ? 1 : 0.55 + i * 0.05} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#F3F0FF]">
          {TYPE_BREAKDOWN.slice(0, 3).map((t) => (
            <div key={t.type} className="text-center">
              <p className="text-xs font-bold text-gray-800">${(t.value / 1000).toFixed(0)}K</p>
              <p className="text-[10px] text-gray-400">{t.type} wishlist value</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
