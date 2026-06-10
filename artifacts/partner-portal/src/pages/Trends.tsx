import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Award, Tag, Zap, Clock, ChevronUp } from "lucide-react";
import { TOP_SKUS, TOP_BRANDS, DAY_OF_WEEK_ACTIVITY, RISING_SKUS, OCCASION_BREAKDOWN } from "@/data/demo";
import { useStore } from "@/context/StoreContext";

const PURPLE = "#5B21B6";
const LIGHT = "#8B5CF6";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5E2F0] rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-gray-600">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color ?? p.fill }} />
          <span>{p.name}: <span className="font-semibold text-gray-900">{p.value.toLocaleString()}</span></span>
        </div>
      ))}
    </div>
  );
};

export default function Trends() {
  const { current } = useStore();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Trends & Insights</h1>
        <p className="text-sm text-gray-500 mt-0.5">What {current.banner} customers are saving and sharing via DiaGe</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {RISING_SKUS.map((item) => {
          const pct = Math.round(((item.savesThisMonth - item.savesLastMonth) / item.savesLastMonth) * 100);
          return (
            <div key={item.sku} className="bg-white rounded-2xl border border-[#E5E2F0] p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Zap size={13} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Rising this month</span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-snug">{item.name}</p>
              <p className="text-[11px] text-gray-400 mb-3">SKU {item.sku} · ${item.avgPrice.toLocaleString()} avg</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-900">{item.savesThisMonth}</p>
                  <p className="text-[11px] text-gray-400">saves this month</p>
                </div>
                <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                  <ChevronUp size={12} />+{pct}%
                </span>
              </div>
              <div className="mt-2.5 w-full bg-[#F3F0FF] rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                  style={{ width: `${Math.min((item.savesThisMonth / 100) * 100, 100)}%` }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{item.savesLastMonth} saves last month</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E2F0] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={16} className="text-[#5B21B6]" />
          <h2 className="text-sm font-semibold text-gray-800">Top Saved SKUs</h2>
          <span className="ml-auto text-xs text-gray-400">by save count · June 2026</span>
        </div>
        <div className="space-y-3">
          {TOP_SKUS.map((sku, i) => (
            <div key={sku.sku} className="flex items-center gap-3">
              <span className={`text-xs font-bold w-5 text-right flex-shrink-0 ${i < 3 ? "text-[#5B21B6]" : "text-gray-300"}`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-800 truncate">{sku.name}</p>
                  <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                    <span className="text-[10px] text-gray-400 hidden sm:block">SKU {sku.sku}</span>
                    <span className="text-xs font-bold text-[#5B21B6]">{sku.saves} saves</span>
                    <span className="text-xs text-gray-400 hidden md:block">${sku.avgPrice.toLocaleString()} avg</span>
                  </div>
                </div>
                <div className="w-full bg-[#F3F0FF] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-[#5B21B6] to-[#8B5CF6]"
                    style={{ width: `${(sku.saves / TOP_SKUS[0].saves) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E2F0] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-[#5B21B6]" />
            <h2 className="text-sm font-semibold text-gray-800">Top Brands by Saves</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOP_BRANDS} layout="vertical" margin={{ top: 0, right: 16, left: 10, bottom: 0 }} barSize={13}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEF8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="brand" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={95} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="saves" name="Saves" radius={[0, 5, 5, 0]}>
                {TOP_BRANDS.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? PURPLE : LIGHT} fillOpacity={i === 0 ? 1 : 0.4 + i * 0.1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E2F0] p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-[#5B21B6]" />
            <h2 className="text-sm font-semibold text-gray-800">Shopping Occasion Breakdown</h2>
          </div>
          <div className="flex gap-4 items-start">
            <ResponsiveContainer width="45%" height={180}>
              <PieChart>
                <Pie data={OCCASION_BREAKDOWN} cx="50%" cy="50%" innerRadius={42} outerRadius={65}
                  dataKey="count" paddingAngle={2} startAngle={90} endAngle={-270}>
                  {OCCASION_BREAKDOWN.map((d) => (
                    <Cell key={d.occasion} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number, n: string) => [`${v} customers`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2 pt-1">
              {OCCASION_BREAKDOWN.map((d) => (
                <div key={d.occasion} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-gray-600">{d.occasion}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-800">{d.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-[#F3F0FF]">
            <span className="font-semibold text-gray-600">38% engagement shoppers</span> — highest-intent, longest research window
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E2F0] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-[#5B21B6]" />
          <h2 className="text-sm font-semibold text-gray-800">When Customers Shop</h2>
          <span className="ml-auto text-[11px] text-gray-400">wishlist saves by day of week</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={DAY_OF_WEEK_ACTIVITY} margin={{ top: 0, right: 10, left: -20, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EEF8" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="saves" name="Wishlist Saves" radius={[5, 5, 0, 0]}>
              {DAY_OF_WEEK_ACTIVITY.map((d) => (
                <Cell key={d.day} fill={d.day === "Sat" ? PURPLE : LIGHT} fillOpacity={d.day === "Sat" ? 1 : 0.55} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-3 pt-3 border-t border-[#F3F0FF]">
          <div className="text-center">
            <p className="text-sm font-bold text-[#5B21B6]">Saturday</p>
            <p className="text-[11px] text-gray-400">Peak save day (621 saves)</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">Fri–Sun</p>
            <p className="text-[11px] text-gray-400">63% of weekly saves</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">Thu spikes</p>
            <p className="text-[11px] text-gray-400">Engagement planning before weekend store visits</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1E0B4B] rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg mb-1">Powered by DiaGe Customer Intelligence</h2>
            <p className="text-[#C4B5FD] text-sm max-w-xl">
              Every wishlist save and store share is a customer actively shopping and ready to buy —
              not inferred behavior, but direct opt-in intent signals from {current.banner} customers.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">89%</p>
              <p className="text-[#C4B5FD] text-[11px] mt-0.5 leading-snug">who share<br />visit in 7 days</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">$3.6K</p>
              <p className="text-[#C4B5FD] text-[11px] mt-0.5 leading-snug">avg wishlist<br />item price</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">4.7×</p>
              <p className="text-[#C4B5FD] text-[11px] mt-0.5 leading-snug">items per<br />customer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
