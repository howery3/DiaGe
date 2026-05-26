import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import { TrendingUp, Award, Tag } from "lucide-react";
import { TOP_SKUS, TOP_BRANDS, TYPE_BREAKDOWN, RETAILER_NAME } from "@/data/demo";

const PURPLE = "#5B21B6";
const LIGHT = "#8B5CF6";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5E2F0] rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="text-gray-600">
          {p.name}: <span className="font-semibold text-gray-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Trends() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Trends & Insights</h1>
        <p className="text-sm text-gray-500 mt-0.5">What {RETAILER_NAME} customers are saving and sharing via DiaGe</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E2F0] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={16} className="text-[#5B21B6]" />
          <h2 className="text-sm font-semibold text-gray-800">Top Saved SKUs</h2>
          <span className="ml-auto text-xs text-gray-400">by save count</span>
        </div>
        <div className="space-y-2.5">
          {TOP_SKUS.map((sku, i) => (
            <div key={sku.sku} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-300 w-4 text-right">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-800 truncate">{sku.name}</p>
                  <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">SKU {sku.sku}</span>
                    <span className="text-xs font-bold text-[#5B21B6]">{sku.saves} saves</span>
                  </div>
                </div>
                <div className="w-full bg-[#F3F0FF] rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-[#5B21B6] to-[#8B5CF6]"
                    style={{ width: `${(sku.saves / TOP_SKUS[0].saves) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">${sku.avgPrice.toLocaleString()} avg</span>
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
            <BarChart data={TOP_BRANDS} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEF8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="brand" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="saves" name="Saves" fill={LIGHT} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E2F0] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#5B21B6]" />
            <h2 className="text-sm font-semibold text-gray-800">Category Radar</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={TYPE_BREAKDOWN} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="#E5E2F0" />
              <PolarAngleAxis dataKey="type" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <Radar name="Items Saved" dataKey="count" stroke={PURPLE} fill={PURPLE} fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1E0B4B] rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-bold text-lg mb-1">Powered by DiaGe Customer Intelligence</h2>
            <p className="text-[#C4B5FD] text-sm max-w-xl">
              These insights come from real opt-in data shared by {RETAILER_NAME} customers through the DiaGe jewelry vault app.
              Every wishlist save and share represents a customer actively shopping and ready to buy.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-bold">89%</p>
            <p className="text-[#C4B5FD] text-xs mt-0.5">customers who share<br />visit within 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
