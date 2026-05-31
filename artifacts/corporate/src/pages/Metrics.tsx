import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, ReferenceLine,
} from "recharts";
import {
  FUNNEL_STAGES, ATV_COMPARISON, ATV_BY_CATEGORY, ATV_BY_BANNER,
  TRAFFIC_SOURCES, CONVERSION_BENCHMARKS, SESSION_METRICS, WEEKLY_SESSIONS,
} from "@/data/corporate";
import { TrendingUp, Repeat2, ShoppingBag, Zap } from "lucide-react";

const gridColor = "#e5e5e5";
const tickColor = "#71717a";
const PURPLE = "#5B21B6";
const PURPLE_LIGHT = "#795EFF";

function fmt(n: number) { return `$${n.toLocaleString()}`; }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", borderRadius: 6, padding: "10px 14px", border: "1px solid #e0e0e0", fontSize: 13 }}>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color || p.fill, display: "inline-block", flexShrink: 0 }} />
          <span style={{ color: "#444" }}>{p.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

const maxFunnelCount = FUNNEL_STAGES[0]!.count;

export default function Metrics() {
  return (
    <div className="p-8 max-w-[1300px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} style={{ color: PURPLE_LIGHT }} />
          <h1 className="text-2xl font-bold text-foreground">Traffic, Conversion & ATV</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          How DiaGe drives measurable revenue lift for Signet — from first open to in-store purchase
        </p>
      </div>

      {/* Hero callout — 3 big numbers */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: ShoppingBag,
            headline: "2.3×",
            label: "Average Transaction Value Lift",
            sub: "DiaGe users spend $2,847 vs $1,240 avg Signet customer",
            color: PURPLE,
            light: "hsl(262 40% 94%)",
            textLight: "hsl(262 80% 30%)",
          },
          {
            icon: Repeat2,
            headline: "31%",
            label: "Wishlist Lead → Purchase Rate",
            sub: "vs 1–4% industry average for retail apps",
            color: "#009118",
            light: "hsl(142 76% 94%)",
            textLight: "hsl(142 76% 25%)",
          },
          {
            icon: Zap,
            headline: "68%",
            label: "Lead Contact → In-Store Visit",
            sub: "Store associates close 68% of contacted wishlist leads",
            color: "#0079F2",
            light: "hsl(211 100% 94%)",
            textLight: "#0055a5",
          },
        ].map((h) => (
          <div key={h.label} className="rounded-2xl border p-6" style={{ background: h.light, borderColor: `${h.color}30` }}>
            <div className="flex items-start justify-between mb-4">
              <h.icon size={20} style={{ color: h.color }} />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${h.color}18`, color: h.color }}>
                Key Metric
              </span>
            </div>
            <div className="text-5xl font-black mb-2" style={{ color: h.color }}>{h.headline}</div>
            <div className="text-sm font-semibold mb-1" style={{ color: h.textLight }}>{h.label}</div>
            <div className="text-xs" style={{ color: h.textLight, opacity: 0.75 }}>{h.sub}</div>
          </div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
        <div className="mb-1 font-semibold text-sm text-foreground">The DiaGe Purchase Funnel</div>
        <div className="text-xs text-muted-foreground mb-6">From app install to in-store purchase — every step measured</div>
        <div className="flex flex-col gap-2.5">
          {FUNNEL_STAGES.map((stage, i) => {
            const width = (stage.count / maxFunnelCount) * 100;
            const isFirst = i === 0;
            return (
              <div key={stage.stage} className="flex items-center gap-4">
                {/* Stage label */}
                <div className="w-40 text-right flex-shrink-0">
                  <div className="text-xs font-semibold text-foreground">{stage.stage}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{stage.note}</div>
                </div>
                {/* Bar */}
                <div className="flex-1 relative h-9 flex items-center">
                  <div
                    className="h-full rounded-md flex items-center px-3 transition-all"
                    style={{ width: `${width}%`, background: stage.color, minWidth: 80 }}
                  >
                    <span className="text-white text-xs font-bold">{stage.count.toLocaleString()}</span>
                  </div>
                  {!isFirst && (
                    <span className="absolute right-2 text-xs font-semibold text-muted-foreground">
                      {stage.pct}% conversion
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-4 gap-3 pt-4 border-t border-border">
          {CONVERSION_BENCHMARKS.map((b) => (
            <div key={b.metric} className="rounded-lg p-3" style={{ background: "hsl(240 5% 96%)" }}>
              <div className="text-[10px] text-muted-foreground mb-1.5 leading-snug">{b.metric}</div>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-xl font-black" style={{ color: PURPLE }}>{b.diage}%</span>
                <span className="text-xs text-muted-foreground mb-0.5">DiaGe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
                  <div className="h-full rounded-full bg-gray-400" style={{ width: `${(b.industry / b.diage) * 100}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{b.industry}% industry</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ATV + Traffic — 2 column */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* ATV Comparison */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="font-semibold text-sm text-foreground mb-1">Average Transaction Value</div>
          <div className="text-xs text-muted-foreground mb-4">DiaGe users vs benchmarks — attributed purchases</div>
          <ResponsiveContainer width="100%" height={200} debounce={0}>
            <BarChart data={ATV_COMPARISON} margin={{ top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{ background: "#fff", borderRadius: 6, padding: "10px 14px", border: "1px solid #e0e0e0", fontSize: 13 }}>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontWeight: 700, color: payload[0].payload.highlight ? PURPLE : "#555" }}>
                        {fmt(payload[0].value)}
                      </div>
                    </div>
                  );
                }}
                isAnimationActive={false}
                cursor={false}
              />
              <Bar dataKey="value" name="ATV" isAnimationActive={false} radius={[4, 4, 0, 0]}>
                {ATV_COMPARISON.map((d, i) => (
                  <Cell key={i} fill={d.highlight ? PURPLE : "#d4d0e8"} fillOpacity={d.highlight ? 1 : 0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 rounded-lg px-3 py-2.5 text-xs" style={{ background: "hsl(262 40% 94%)", color: "hsl(262 80% 30%)" }}>
            DiaGe users spend <strong>$1,607 more per transaction</strong> on average — a 2.3× lift over the Signet baseline.
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="font-semibold text-sm text-foreground mb-1">How Customers Discover Products</div>
          <div className="text-xs text-muted-foreground mb-4">Traffic source breakdown for wishlist saves</div>
          <div className="flex flex-col gap-2.5 mt-2">
            {TRAFFIC_SOURCES.map((s) => (
              <div key={s.source} className="flex items-center gap-3">
                <div className="w-36 text-right flex-shrink-0">
                  <span className="text-xs text-foreground font-medium">{s.source}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 rounded overflow-hidden bg-gray-100">
                    <div
                      className="h-full rounded flex items-center px-2"
                      style={{ width: `${s.pct}%`, background: s.color, minWidth: 36 }}
                    >
                      <span className="text-white text-[11px] font-bold">{s.pct}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-14 flex-shrink-0">{s.users.toLocaleString()} users</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg px-3 py-2.5 text-xs" style={{ background: "hsl(211 100% 94%)", color: "#0055a5" }}>
            <strong>In-Store QR Scans (19%)</strong> tie digital wishlists directly to physical visits — a Signet-exclusive advantage.
          </div>
        </div>
      </div>

      {/* ATV by Category + Banner — 2 column */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* ATV by Category */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="font-semibold text-sm text-foreground mb-1">ATV by Jewelry Category</div>
          <div className="text-xs text-muted-foreground mb-4">Average transaction value for DiaGe-attributed purchases</div>
          <ResponsiveContainer width="100%" height={210} debounce={0}>
            <BarChart data={ATV_BY_CATEGORY} layout="vertical" margin={{ left: 10, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} width={110} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{ background: "#fff", borderRadius: 6, padding: "10px 14px", border: "1px solid #e0e0e0", fontSize: 13 }}>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontWeight: 700, color: PURPLE }}>{fmt(payload[0].value)}</div>
                    </div>
                  );
                }}
                isAnimationActive={false}
                cursor={false}
              />
              <Bar dataKey="atv" name="ATV" fill={PURPLE} fillOpacity={0.85} isAnimationActive={false} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ATV by Banner */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="font-semibold text-sm text-foreground mb-1">ATV by Signet Banner</div>
          <div className="text-xs text-muted-foreground mb-4">Jared's higher-end assortment drives the highest per-ticket value</div>
          <div className="flex flex-col gap-3 mt-4">
            {ATV_BY_BANNER.map((b, i) => {
              const maxAtv = Math.max(...ATV_BY_BANNER.map((x) => x.atv));
              const width = (b.atv / maxAtv) * 100;
              const colors = [PURPLE, "#7C3AED", "#8B5CF6", "#C4B5FD"];
              return (
                <div key={b.banner} className="flex items-center gap-3">
                  <div className="w-44 text-right flex-shrink-0">
                    <span className="text-xs font-medium text-foreground">{b.banner}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-8 rounded overflow-hidden bg-gray-100">
                      <div
                        className="h-full rounded flex items-center px-3"
                        style={{ width: `${width}%`, background: colors[i] ?? PURPLE, minWidth: 60 }}
                      >
                        <span className="text-white text-xs font-bold">{fmt(b.atv)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg px-3 py-2.5 text-xs" style={{ background: "hsl(262 40% 94%)", color: "hsl(262 80% 30%)" }}>
            Jared customers wishlist the highest-value items and <strong>convert at the same rate</strong> as Kay — more revenue per lead.
          </div>
        </div>
      </div>

      {/* Session Engagement */}
      <div className="bg-card border border-card-border rounded-xl p-5">
        <div className="font-semibold text-sm text-foreground mb-1">App Engagement Metrics</div>
        <div className="text-xs text-muted-foreground mb-5">Users stay highly engaged — sessions per week have plateaued at 3.2×</div>
        <div className="grid grid-cols-[1fr_2fr] gap-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 content-start">
            {[
              { label: "Sessions / Week", value: SESSION_METRICS.sessionsPerWeek, unit: "×", context: "per active user" },
              { label: "Avg Session", value: SESSION_METRICS.avgSessionMinutes, unit: " min", context: "time in-app" },
              { label: "Items Viewed / Session", value: SESSION_METRICS.avgItemsViewed, unit: "", context: "SKUs browsed" },
              { label: "Wishlist Add Rate", value: `${SESSION_METRICS.wishlistAddRate}%`, unit: "", context: "sessions that save" },
              { label: "Push Opt-In", value: `${SESSION_METRICS.pushNotifOptIn}%`, unit: "", context: "notification consent" },
              { label: "Retailer Browse Rate", value: `${SESSION_METRICS.retailerBrowseRate}%`, unit: "", context: "opens in-app browser" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg p-3" style={{ background: "hsl(240 5% 96%)" }}>
                <div className="text-[10px] text-muted-foreground mb-1">{s.label}</div>
                <div className="text-xl font-black" style={{ color: PURPLE }}>{s.value}{s.unit}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{s.context}</div>
              </div>
            ))}
          </div>

          {/* Sessions/week trend */}
          <div>
            <div className="text-xs text-muted-foreground mb-3">Weekly sessions/user — growing toward steady state</div>
            <ResponsiveContainer width="100%" height={190} debounce={0}>
              <LineChart data={WEEKLY_SESSIONS}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: tickColor }} stroke={tickColor} interval={2} />
                <YAxis tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} domain={[0, 4]} tickFormatter={(v) => `${v}×`} />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div style={{ background: "#fff", borderRadius: 6, padding: "10px 14px", border: "1px solid #e0e0e0", fontSize: 13 }}>
                        <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
                        <div style={{ fontWeight: 700, color: PURPLE }}>{payload[0].value}× / week</div>
                      </div>
                    );
                  }}
                  isAnimationActive={false}
                  cursor={{ stroke: tickColor, strokeDasharray: "3 3" }}
                />
                <ReferenceLine y={3.2} stroke={PURPLE} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "3.2× plateau", position: "right", fontSize: 10, fill: PURPLE }} />
                <Line dataKey="sessions" stroke={PURPLE} strokeWidth={2.5} dot={{ r: 3, fill: PURPLE, stroke: "#fff", strokeWidth: 2 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
