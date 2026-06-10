import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { PLATFORM_KPIS, MONTHLY_GROWTH, FEATURE_ADOPTION, RETENTION_COHORT, SIGNET_PROJECTION } from "@/data/corporate";
import { Users, TrendingUp, ShoppingBag, MessageSquare, Store, Gem, Building2 } from "lucide-react";

const CHART_COLORS = {
  blue: "#0079F2", purple: "#795EFF", green: "#009118", red: "#A60808", pink: "#ec4899",
};
const gridColor = "#e5e5e5";
const tickColor = "#71717a";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 6, padding: "10px 14px", border: "1px solid #e0e0e0", color: "#1a1a1a", fontSize: 13 }}>
      <div style={{ marginBottom: 6, fontWeight: 500 }}>{label}</div>
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

function fmt(n: number) { return n.toLocaleString("en-US"); }
function fmtM(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const KPIS = [
  { label: "Total Users", value: fmt(PLATFORM_KPIS.totalUsers), sub: "+205% since Jan 2026", icon: Users, color: "#0079F2" },
  { label: "Monthly Active Users", value: fmt(PLATFORM_KPIS.mau), sub: `${PLATFORM_KPIS.dauMauPct}% DAU/MAU ratio`, icon: TrendingUp, color: "#795EFF" },
  { label: "30-Day Retention", value: `${PLATFORM_KPIS.retention30d}%`, sub: "Industry avg: 32%", icon: TrendingUp, color: "#009118" },
  { label: "Total Wishlist Value", value: fmtM(PLATFORM_KPIS.totalWishlistValue), sub: "Across all active wishlists", icon: ShoppingBag, color: "#0079F2" },
  { label: "Quote Requests Sent", value: fmt(PLATFORM_KPIS.quoteRequests), sub: "Via in-app insurance partners", icon: MessageSquare, color: "#795EFF" },
  { label: "Signet Partner Retailers", value: fmt(PLATFORM_KPIS.partnerRetailers), sub: "4 Signet banners + partners", icon: Store, color: "#009118" },
];

export default function Overview() {
  return (
    <div className="p-8 max-w-[1300px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Gem size={18} style={{ color: "#795EFF" }} />
          <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Live platform intelligence — June 2026 · All figures represent real DiaGe user activity
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="bg-card border border-card-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</span>
              <kpi.icon size={15} style={{ color: kpi.color, flexShrink: 0 }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* User Growth */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="mb-1 font-semibold text-sm text-foreground">User Growth</div>
          <div className="text-xs text-muted-foreground mb-4">Total users & monthly actives — Jan–June 2026</div>
          <ResponsiveContainer width="100%" height={220} debounce={0}>
            <AreaChart data={MONTHLY_GROWTH}>
              <defs>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="gMau" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.purple} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={CHART_COLORS.purple} stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: "rgba(0,0,0,0.04)", stroke: "none" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area dataKey="users" name="Total Users" fill="url(#gUsers)" stroke={CHART_COLORS.blue} fillOpacity={1} isAnimationActive={false} />
              <Area dataKey="mau" name="MAU" fill="url(#gMau)" stroke={CHART_COLORS.purple} fillOpacity={1} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Wishlist Value Growth */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="mb-1 font-semibold text-sm text-foreground">Tracked Wishlist Value</div>
          <div className="text-xs text-muted-foreground mb-4">Aggregate estimated value of all active wishlists</div>
          <ResponsiveContainer width="100%" height={220} debounce={0}>
            <AreaChart data={MONTHLY_GROWTH}>
              <defs>
                <linearGradient id="gVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.green} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{ backgroundColor: "#fff", borderRadius: 6, padding: "10px 14px", border: "1px solid #e0e0e0", fontSize: 13 }}>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
                      <div style={{ color: CHART_COLORS.green, fontWeight: 600 }}>{fmtM(payload[0].value)}</div>
                    </div>
                  );
                }}
                isAnimationActive={false}
                cursor={{ fill: "rgba(0,0,0,0.04)", stroke: "none" }}
              />
              <Area dataKey="value" name="Value" fill="url(#gVal)" stroke={CHART_COLORS.green} fillOpacity={1} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Feature Adoption */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="mb-1 font-semibold text-sm text-foreground">Feature Adoption</div>
          <div className="text-xs text-muted-foreground mb-4">% of users who have used each feature at least once</div>
          <ResponsiveContainer width="100%" height={220} debounce={0}>
            <BarChart data={FEATURE_ADOPTION} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} width={100} />
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
              <Bar dataKey="pct" name="% Users" fill={CHART_COLORS.purple} fillOpacity={0.8} isAnimationActive={false} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Retention */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="mb-1 font-semibold text-sm text-foreground">User Retention Curve</div>
          <div className="text-xs text-muted-foreground mb-4">% of users still active after N days (cohort average)</div>
          <ResponsiveContainer width="100%" height={220} debounce={0}>
            <LineChart data={RETENTION_COHORT}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{ backgroundColor: "#fff", borderRadius: 6, padding: "10px 14px", border: "1px solid #e0e0e0", fontSize: 13 }}>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
                      <div style={{ color: CHART_COLORS.blue, fontWeight: 600 }}>{payload[0].value}% retained</div>
                    </div>
                  );
                }}
                isAnimationActive={false}
                cursor={{ stroke: tickColor, strokeDasharray: "3 3" }}
              />
              <Line dataKey="pct" name="Retention %" stroke={CHART_COLORS.blue} strokeWidth={2} dot={{ r: 4, fill: CHART_COLORS.blue, stroke: "#fff", strokeWidth: 2 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>

          {/* Retention callout */}
          <div className="mt-4 rounded-lg px-4 py-3 text-sm" style={{ background: "hsl(262 40% 94%)", color: "hsl(262 80% 30%)" }}>
            <strong>68% 30-day retention</strong> — 2× the industry average for consumer apps (32%).
            Users track high-value assets; churn is inherently low.
          </div>
        </div>
      </div>

      {/* Signet Opportunity Projection */}
      <div className="mt-8 rounded-xl border overflow-hidden" style={{ borderColor: "hsl(262 60% 60% / 0.3)", background: "linear-gradient(135deg, hsl(262 40% 12%) 0%, hsl(262 50% 18%) 100%)" }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: "hsl(262 60% 60% / 0.2)" }}>
          <div className="flex items-center gap-2">
            <Building2 size={16} style={{ color: "#A78BFA" }} />
            <span className="text-sm font-semibold" style={{ color: "#E9D5FF" }}>
              Signet Jewelers · Full-Scale Deployment Opportunity
            </span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(167,139,250,0.2)", color: "#C4B5FD" }}>
              3-Year Projection
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(196,181,253,0.65)" }}>
            Based on {(SIGNET_PROJECTION.addressableCustomers / 1_000_000).toFixed(1)}M Signet customers served annually across {SIGNET_PROJECTION.bannerCount} banners · {SIGNET_PROJECTION.locationCount.toLocaleString()} locations · {SIGNET_PROJECTION.projectedAdoptionPct}% projected adoption at current growth trajectory
          </p>
        </div>
        <div className="grid grid-cols-4 divide-x" style={{ divideColor: "hsl(262 60% 60% / 0.2)" }}>
          {[
            { label: "Projected Users", value: `${(SIGNET_PROJECTION.projectedUsers / 1_000_000).toFixed(1)}M`, sub: `${SIGNET_PROJECTION.projectedAdoptionPct}% of addressable base` },
            { label: "Tracked Wishlist Value", value: `$${(SIGNET_PROJECTION.projectedWishlistValue / 1_000_000_000).toFixed(1)}B`, sub: "At current avg wishlist size" },
            { label: "Quote Requests / Year", value: `${(SIGNET_PROJECTION.projectedQuoteRequests / 1_000).toFixed(0)}K`, sub: "Insurance + financing leads" },
            { label: "Banners Covered", value: `${SIGNET_PROJECTION.bannerCount} banners`, sub: "Kay · Jared · Zales · Banter" },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-4" style={{ borderRight: "1px solid hsl(262 60% 60% / 0.15)" }}>
              <div className="text-xs mb-1" style={{ color: "rgba(196,181,253,0.6)" }}>{stat.label}</div>
              <div className="text-2xl font-bold" style={{ color: "#A78BFA" }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(196,181,253,0.5)" }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
