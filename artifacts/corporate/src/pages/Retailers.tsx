import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { RETAILER_KPIS, type RetailerKPI } from "@/data/corporate";
import { Building2, Users, ShoppingBag, MessageSquare, TrendingUp } from "lucide-react";

const CHART_COLORS = { blue: "#0079F2", purple: "#795EFF", green: "#009118" };
const gridColor = "#e5e5e5";
const tickColor = "#71717a";

function fmtCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 6, padding: "10px 14px", border: "1px solid #e0e0e0", color: "#1a1a1a", fontSize: 13 }}>
      <div style={{ fontWeight: 500, marginBottom: 6 }}>{label}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, backgroundColor: entry.color, flexShrink: 0 }} />
          <span style={{ color: "#444" }}>{entry.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function RetailerRow({ r }: { r: RetailerKPI }) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-foreground">{r.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{r.location}</div>
        </div>
        <div className="text-xs px-2 py-1 rounded-full font-medium"
          style={r.type === "signet"
            ? { background: "hsl(262 40% 94%)", color: "hsl(262 80% 30%)" }
            : { background: "hsl(211 100% 93%)", color: "#0055a5" }}>
          {r.type === "signet" ? "Signet Banner" : "Partner Retailer"}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Customers", value: r.customers.toLocaleString(), icon: Users },
          { label: "Active Wishlists", value: r.activeWishlists.toLocaleString(), icon: ShoppingBag },
          { label: "Wishlist Value", value: fmtCurrency(r.totalWishlistValue), icon: TrendingUp },
          { label: "Quote Requests", value: r.quoteRequests.toLocaleString(), icon: MessageSquare },
          { label: "Conversion Rate", value: `${r.conversionRate}%`, icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg p-3" style={{ background: "hsl(240 5% 96%)" }}>
            <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
            <div className="text-lg font-bold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TAB_METRICS = [
  { key: "customers", label: "Customers", color: CHART_COLORS.blue },
  { key: "activeWishlists", label: "Wishlists", color: CHART_COLORS.purple },
  { key: "quoteRequests", label: "Quote Requests", color: CHART_COLORS.green },
];

export default function Retailers() {
  const [tab, setTab] = useState<"signet" | "partner">("signet");
  const [metric, setMetric] = useState("customers");

  const filtered = RETAILER_KPIS.filter((r) => r.type === tab);
  const selectedMetric = TAB_METRICS.find((m) => m.key === metric)!;

  const signetTotal = RETAILER_KPIS.filter((r) => r.type === "signet").reduce((s, r) => s + r.totalWishlistValue, 0);
  const partnerTotal = RETAILER_KPIS.filter((r) => r.type === "partner").reduce((s, r) => s + r.totalWishlistValue, 0);
  const signetConvAvg = RETAILER_KPIS.filter((r) => r.type === "signet").reduce((s, r) => s + r.conversionRate, 0) / RETAILER_KPIS.filter((r) => r.type === "signet").length;
  const partnerConvAvg = RETAILER_KPIS.filter((r) => r.type === "partner").reduce((s, r) => s + r.conversionRate, 0) / RETAILER_KPIS.filter((r) => r.type === "partner").length;

  return (
    <div className="p-8 max-w-[1300px]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={18} style={{ color: "#795EFF" }} />
          <h1 className="text-2xl font-bold text-foreground">Retailer Performance</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Engagement and wishlist value across Signet banners and partner retailers — May 2026
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(262 40% 94%)", color: "hsl(262 80% 30%)" }}>
              Signet Banners
            </span>
            <span className="text-xs text-muted-foreground">Kay · Jared · Zales · Banter</span>
          </div>
          <div className="text-3xl font-bold" style={{ color: CHART_COLORS.purple }}>
            {fmtCurrency(signetTotal)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {RETAILER_KPIS.filter((r) => r.type === "signet").reduce((s, r) => s + r.customers, 0).toLocaleString()} customers ·{" "}
            <span style={{ color: CHART_COLORS.green, fontWeight: 600 }}>{signetConvAvg.toFixed(1)}% avg conversion</span>
          </div>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(211 100% 93%)", color: "#0055a5" }}>
              Partner Retailers
            </span>
            <span className="text-xs text-muted-foreground">Non-Signet platform partners</span>
          </div>
          <div className="text-3xl font-bold" style={{ color: CHART_COLORS.blue }}>
            {fmtCurrency(partnerTotal)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {RETAILER_KPIS.filter((r) => r.type === "partner").reduce((s, r) => s + r.customers, 0).toLocaleString()} customers ·{" "}
            <span style={{ color: CHART_COLORS.green, fontWeight: 600 }}>{partnerConvAvg.toFixed(1)}% avg conversion</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-5">
        {(["signet", "partner"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={tab === t
              ? { background: "#5B21B6", color: "#fff" }
              : { background: "hsl(var(--card))", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}
          >
            {t === "signet" ? "Signet Banners" : "Partner Retailers"}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-semibold text-sm text-foreground">Comparison</div>
            <div className="text-xs text-muted-foreground">
              Side-by-side across {tab === "signet" ? "Signet banners" : "partner retailers"}
            </div>
          </div>
          <div className="flex gap-2">
            {TAB_METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                style={metric === m.key
                  ? { background: m.color, color: "#fff" }
                  : { background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200} debounce={0}>
          <BarChart data={filtered} margin={{ top: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} angle={-15} textAnchor="end" height={40} />
            <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickFormatter={(v) => v.toLocaleString()} />
            <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
            <Bar dataKey={metric} name={selectedMetric.label} isAnimationActive={false} radius={[3, 3, 0, 0]}>
              {filtered.map((_, i) => (
                <Cell key={i} fill={selectedMetric.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail rows */}
      <div className="flex flex-col gap-4">
        {filtered.map((r) => <RetailerRow key={r.name} r={r} />)}
      </div>

      {/* Insight callout */}
      <div className="mt-6 rounded-xl px-5 py-4 text-sm" style={{ background: "hsl(262 40% 94%)", color: "hsl(262 80% 25%)" }}>
        <strong>Kay Jewelers leads all Signet banners</strong> with {fmtCurrency(RETAILER_KPIS.find(r => r.name === "Kay Jewelers")!.totalWishlistValue)} in tracked wishlist value
        and the highest conversion rate at {RETAILER_KPIS.find(r => r.name === "Kay Jewelers")!.conversionRate}%.
        {" "}Banter by Piercing Pagoda shows strong customer volume with significant upside as higher-AOV products are added to the platform.
      </div>
    </div>
  );
}
