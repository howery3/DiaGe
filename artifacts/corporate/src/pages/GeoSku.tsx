import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { SKU_GEO_DATA, METROS, type SkuGeoRow } from "@/data/corporate";
import { MapPin } from "lucide-react";

const CHART_COLORS = { blue: "#0079F2", purple: "#795EFF", green: "#009118" };
const gridColor = "#e5e5e5";
const tickColor = "#71717a";

const RETAILER_COLORS: Record<string, string> = {
  "Kay Jewelers": CHART_COLORS.blue,
  "Jared": CHART_COLORS.purple,
  "Zales": CHART_COLORS.green,
  "Mikimoto": "#f59e0b",
};

function getColor(retailer: string) {
  return RETAILER_COLORS[retailer] ?? CHART_COLORS.blue;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 6, padding: "10px 14px", border: "1px solid #e0e0e0", color: "#1a1a1a", fontSize: 13 }}>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 600, color: CHART_COLORS.blue }}>{payload[0].value.toLocaleString()} saves</div>
    </div>
  );
}

function HeatCell({ value, max }: { value: number; max: number }) {
  const intensity = max > 0 ? value / max : 0;
  const bg = `rgba(91, 33, 182, ${0.08 + intensity * 0.72})`;
  const color = intensity > 0.55 ? "#fff" : "hsl(262 80% 25%)";
  return (
    <td className="text-center text-xs font-medium px-2 py-2.5 border-b border-r border-border" style={{ background: bg, color, minWidth: 56 }}>
      {value > 0 ? value.toLocaleString() : "—"}
    </td>
  );
}

export default function GeoSku() {
  const [selectedSku, setSelectedSku] = useState<SkuGeoRow>(SKU_GEO_DATA[0]!);
  const [retailerFilter, setRetailerFilter] = useState("All");

  const retailers = ["All", ...Array.from(new Set(SKU_GEO_DATA.map((r) => r.retailer)))];
  const filtered = retailerFilter === "All" ? SKU_GEO_DATA : SKU_GEO_DATA.filter((r) => r.retailer === retailerFilter);

  const barData = METROS.map((m) => ({ metro: m, saves: selectedSku.byMetro[m] ?? 0 }));
  const maxSaves = Math.max(...barData.map((d) => d.saves));

  const tableMax = Math.max(...filtered.flatMap((r) => METROS.map((m) => r.byMetro[m] ?? 0)));

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={18} style={{ color: "#795EFF" }} />
          <h1 className="text-2xl font-bold text-foreground">SKU Geography</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Where customers are saving specific SKUs — saves by metro area
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-sm font-medium text-foreground">Retailer:</span>
        <div className="flex gap-2 flex-wrap">
          {retailers.map((r) => (
            <button
              key={r}
              onClick={() => setRetailerFilter(r)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
              style={retailerFilter === r
                ? { background: "#5B21B6", color: "#fff" }
                : { background: "hsl(var(--card))", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SKU selector + bar chart */}
      <div className="grid grid-cols-[280px_1fr] gap-6 mb-8">
        {/* SKU list */}
        <div className="bg-card border border-card-border rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Select SKU
          </div>
          <div className="flex-1 overflow-auto">
            {filtered.map((row) => (
              <button
                key={row.sku}
                onClick={() => setSelectedSku(row)}
                className="w-full text-left px-4 py-3 border-b border-border transition-colors flex flex-col gap-0.5"
                style={selectedSku.sku === row.sku
                  ? { background: "hsl(262 40% 94%)" }
                  : { background: "transparent" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-semibold text-foreground leading-snug line-clamp-2">{row.name}</div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: getColor(row.retailer) }}>
                    {row.totalSaves.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">SKU {row.sku}</span>
                  <span className="text-xs px-1.5 rounded" style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}>
                    {row.retailer}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart for selected SKU */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="mb-1 font-semibold text-sm text-foreground">
            {selectedSku.name}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-muted-foreground">SKU {selectedSku.sku} · {selectedSku.retailer}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "hsl(262 40% 94%)", color: "hsl(262 80% 30%)" }}>
              {selectedSku.totalSaves.toLocaleString()} total saves
            </span>
            <span className="text-xs font-medium" style={{ color: "#009118" }}>
              avg ${selectedSku.avgPrice.toLocaleString()}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240} debounce={0}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="metro" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} angle={-20} textAnchor="end" height={40} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
              <Bar dataKey="saves" name="Saves" isAnimationActive={false} radius={[3, 3, 0, 0]}>
                {barData.map((d, i) => (
                  <Cell key={i} fill={getColor(selectedSku.retailer)} fillOpacity={0.15 + 0.75 * (d.saves / maxSaves)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heat table */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="font-semibold text-sm text-foreground">Full SKU × Metro Heat Map</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Number of times each SKU was saved per metro area · Darker = more saves
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="text-xs w-full border-collapse">
            <thead>
              <tr style={{ background: "hsl(240 5% 96%)" }}>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground border-b border-r border-border sticky left-0 bg-inherit min-w-[200px]">
                  SKU / Product
                </th>
                <th className="text-left px-3 py-2.5 font-semibold text-foreground border-b border-r border-border min-w-[80px]">
                  Retailer
                </th>
                <th className="text-center px-3 py-2.5 font-semibold text-foreground border-b border-r border-border min-w-[70px]">
                  Avg Price
                </th>
                {METROS.map((m) => (
                  <th key={m} className="text-center px-2 py-2.5 font-semibold text-foreground border-b border-r border-border min-w-[56px]">
                    {m.split(" ")[0]}
                  </th>
                ))}
                <th className="text-center px-3 py-2.5 font-semibold text-foreground border-b border-border min-w-[70px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.sku}
                  className="cursor-pointer"
                  style={selectedSku.sku === row.sku ? { background: "hsl(262 40% 96%)" } : {}}
                  onClick={() => setSelectedSku(row)}
                >
                  <td className="px-4 py-2.5 border-b border-r border-border sticky left-0 bg-inherit">
                    <div className="font-medium text-foreground leading-snug">{row.name}</div>
                    <div className="text-muted-foreground text-[11px]">SKU {row.sku}</div>
                  </td>
                  <td className="px-3 py-2.5 border-b border-r border-border">
                    <span className="text-xs font-medium" style={{ color: getColor(row.retailer) }}>
                      {row.retailer}
                    </span>
                  </td>
                  <td className="text-center px-3 py-2.5 border-b border-r border-border font-medium text-foreground">
                    ${row.avgPrice.toLocaleString()}
                  </td>
                  {METROS.map((m) => (
                    <HeatCell key={m} value={row.byMetro[m] ?? 0} max={tableMax} />
                  ))}
                  <td className="text-center px-3 py-2.5 border-b border-border font-bold text-foreground">
                    {row.totalSaves.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 rounded-xl px-5 py-4 text-sm" style={{ background: "hsl(262 40% 94%)", color: "hsl(262 80% 25%)" }}>
        <strong>New York and Los Angeles</strong> account for 29–33% of saves on nearly every top SKU.
        {" "}Engagement is geographically concentrated — a targeted campaign in these two metros alone
        would reach over 800 high-intent customers.
      </div>
    </div>
  );
}
