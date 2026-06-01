import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Users, ShoppingBag, DollarSign, TrendingUp, MessageSquare, Star } from "lucide-react";
import { KPI, MONTHLY_ACTIVITY, TYPE_BREAKDOWN, PRICE_RANGE_DATA, RETAILER_NAME } from "@/data/demo";

const PURPLE = "#5B21B6";
const LIGHT_PURPLE = "#8B5CF6";
const PIE_COLORS = ["#5B21B6", "#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD"];

function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function KpiCard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string | number; sub: string;
  icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? "bg-[#5B21B6] border-[#4C1D95] text-white" : "bg-white border-[#E5E2F0]"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${accent ? "bg-white/15" : "bg-[#F3F0FF]"}`}>
          <Icon size={18} className={accent ? "text-white" : "text-[#5B21B6]"} />
        </div>
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
          <span>{p.name}: <span className="font-semibold text-gray-900">{p.value}</span></span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{RETAILER_NAME} — Partner Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Customer-initiated wishlist signals from the DiaGe app — use alongside your existing clientelling and scheduling tools</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Customers Reached" value={KPI.customersReached} sub="Shared wishlist with your store" icon={Users} accent />
        <KpiCard label="Active Wishlists" value={KPI.activeWishlists} sub="Unique customers this month" icon={ShoppingBag} />
        <KpiCard label="Total Wishlist Value" value={fmt(KPI.totalWishlistValue)} sub="Aggregated across all customers" icon={DollarSign} />
        <KpiCard label="Avg Items / Customer" value={KPI.avgItemsPerCustomer} sub="Per active wishlist" icon={Star} />
        <KpiCard label="Quote Requests" value={KPI.quoteRequests} sub="Insurance quotes sent this month" icon={MessageSquare} />
        <KpiCard label="Items Shared to Store" value={KPI.itemsSharedToStore} sub="Via DiaGe app this month" icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5E2F0] p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Monthly Wishlist Activity</h2>
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
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="wishlists" name="Wishlists" stroke={PURPLE} fill="url(#gWish)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="shares" name="Items Shared" stroke={LIGHT_PURPLE} fill="url(#gShare)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E2F0] p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Price Range Distribution</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PRICE_RANGE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                dataKey="count" nameKey="range" paddingAngle={3}>
                {PRICE_RANGE_DATA.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number, n: string) => [`${v} items`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-1 gap-1 mt-1">
            {PRICE_RANGE_DATA.map((d, i) => (
              <div key={d.range} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-gray-600">{d.range}</span>
                </div>
                <span className="font-semibold text-gray-800">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E2F0] p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Wishlisted Items by Category</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={TYPE_BREAKDOWN} margin={{ top: 0, right: 10, left: -20, bottom: 0 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EEF8" vertical={false} />
            <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Items Saved" fill={PURPLE} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
