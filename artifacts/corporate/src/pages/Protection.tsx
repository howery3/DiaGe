import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  DollarSign, ShieldAlert, Building2, TrendingUp,
  Timer, AlertTriangle, Shield,
} from "lucide-react";
import {
  REVENUE_ATTRIBUTION, DIAMOND_BOND_RISK, CROSS_BANNER, TIME_TO_APPT,
} from "@/data/corporate";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function KpiCard({
  title, value, sub, icon: Icon, accent, warning,
}: {
  title: string; value: string; sub: string;
  icon: React.ElementType; accent?: boolean; warning?: boolean;
}) {
  const bg   = accent  ? "bg-[#5B21B6] border-[#4C1D95]"
              : warning ? "bg-red-50 border-red-200"
              : "bg-white border-gray-200";
  const val  = accent ? "text-white" : warning ? "text-red-600" : "text-gray-900";
  const lbl  = accent ? "text-white/90" : warning ? "text-red-600" : "text-gray-700";
  const desc = accent ? "text-white/60" : warning ? "text-red-400" : "text-gray-400";
  const ico  = accent ? "bg-white/15" : warning ? "bg-red-100" : "bg-[#F3F0FF]";
  const icoC = accent ? "text-white" : warning ? "text-red-500" : "text-[#5B21B6]";
  return (
    <div className={`rounded-2xl p-5 border ${bg}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${ico}`}>
        <Icon size={17} className={icoC} />
      </div>
      <p className={`text-2xl font-bold mb-0.5 ${val}`}>{value}</p>
      <p className={`text-xs font-semibold mb-0.5 ${lbl}`}>{title}</p>
      <p className={`text-xs ${desc}`}>{sub}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-gray-600">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color ?? p.fill }} />
          <span>{p.name}: <span className="font-semibold text-gray-900">{
            typeof p.value === "number" && p.value > 1000
              ? fmt(p.value)
              : p.value
          }</span></span>
        </div>
      ))}
    </div>
  );
};

export default function Protection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Revenue Attribution &amp; Protection</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          DiaGe-referred sales, Diamond Bond plan exposure, cross-banner opportunity, and time-to-appointment KPIs across all Signet banners
        </p>
      </div>

      {/* Top KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="DiaGe-Attributed Revenue"
          value={fmt(REVENUE_ATTRIBUTION.totalAttributed)}
          sub="Pilot stores · last 30 days"
          icon={DollarSign}
          accent
        />
        <KpiCard
          title="Blended ATV · DiaGe Purchases"
          value={`$${REVENUE_ATTRIBUTION.avgOrderValue.toLocaleString()}`}
          sub="42% credit × $2,000 + 58% bank × $900 · FY2026 AR"
          icon={TrendingUp}
        />
        <KpiCard
          title="Diamond Bond at Risk"
          value={DIAMOND_BOND_RISK.totalAtRisk.toLocaleString()}
          sub="Missed 6-mo inspection — plan may lapse"
          icon={ShieldAlert}
          warning
        />
        <KpiCard
          title="Cross-Banner Customers"
          value={CROSS_BANNER.totalCrossBannerCustomers.toLocaleString()}
          sub="Shopping across multiple Signet banners"
          icon={Building2}
        />
      </div>

      {/* Revenue Attribution */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">DiaGe Revenue Attribution by Banner</h2>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              {REVENUE_ATTRIBUTION.conversionRate}% visit-to-purchase close rate
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={REVENUE_ATTRIBUTION.byBanner}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 30, bottom: 0 }}
              barSize={22}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEF8" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                type="category"
                dataKey="banner"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                width={90}
                tickFormatter={(v: string) => v.split(" ")[0]}
              />
              <Tooltip content={<CustomTooltip />} formatter={(v: number) => [fmt(v), "Attributed"]} />
              <Bar dataKey="attributed" name="Attributed Revenue" radius={[0, 6, 6, 0]}>
                {REVENUE_ATTRIBUTION.byBanner.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-gray-100">
            {REVENUE_ATTRIBUTION.byBanner.map((b) => (
              <div key={b.banner} className="text-center">
                <p className="text-xs font-bold text-gray-800">{fmt(b.attributed)}</p>
                <p className="text-[10px] text-gray-400">{b.orders} orders</p>
                <div className="w-3 h-1 rounded-full mx-auto mt-1" style={{ background: b.color }} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Monthly Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={REVENUE_ATTRIBUTION.monthlyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#5B21B6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#5B21B6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEF8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} formatter={(v: number) => [fmt(v), "Revenue"]} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#5B21B6" fill="url(#gRev)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2 bg-[#F3F0FF] rounded-xl p-3">
            <TrendingUp size={12} className="text-[#5B21B6] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#6D28D9] leading-relaxed">
              <span className="font-semibold">+171% MoM growth</span> in attributed revenue across pilot stores (Jan–Apr). 
              May is partial-month. Mature rollout projection (2,582 stores · 20 purchases/store/mo · $1,362 ATV): <span className="font-semibold">$845M/yr</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Diamond Bond Risk */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <ShieldAlert size={16} className="text-red-500" />
              <h2 className="text-sm font-semibold text-gray-800">Diamond Bond Protection — At Risk Across Network</h2>
            </div>
            <p className="text-xs text-gray-400">
              Customers who missed their required 6-month inspection window — Diamond Bond coverage may lapse without outreach
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-red-600">{DIAMOND_BOND_RISK.totalAtRisk.toLocaleString()}</p>
            <p className="text-xs text-gray-400">customers at risk</p>
            <p className="text-xs font-semibold text-red-500 mt-0.5">{fmt(DIAMOND_BOND_RISK.estimatedValueAtRisk)} value exposed</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {DIAMOND_BOND_RISK.byBanner.map((b) => {
            const pct = Math.round((b.atRisk / b.total) * 100);
            return (
              <div key={b.banner} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: b.color }} />
                  <p className="text-xs font-semibold text-gray-700 truncate">{b.banner}</p>
                </div>
                <p className="text-2xl font-bold text-red-600">{b.atRisk}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">of {b.total.toLocaleString()} total · <span className="font-semibold">{pct}%</span></p>
                <p className="text-[10px] font-semibold text-gray-500 mt-1">{fmt(b.valueAtRisk)} at risk</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: b.color }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">Why this matters:</span> Diamond Bond protection plans require a 6-month in-store inspection to remain active. 
            Each missed window means a customer's diamond replacement coverage may lapse — a churn event and a lost recurring visit. 
            DiaGe's reminder system proactively nudges customers to book and notifies store associates when inspections are overdue, 
            preventing lapses at scale.
          </p>
        </div>
      </div>

      {/* Cross-Banner + Time-to-Appt */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Cross-Banner Opportunity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={15} className="text-[#5B21B6]" />
            <h2 className="text-sm font-semibold text-gray-800">Cross-Banner Opportunity</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            DiaGe customers actively shopping across multiple Signet banners simultaneously. No individual banner sees the full picture — only DiaGe does.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-[#F3F0FF] px-3 py-2.5">
              <p className="text-xl font-bold text-[#5B21B6]">{CROSS_BANNER.totalCrossBannerCustomers.toLocaleString()}</p>
              <p className="text-xs text-[#6D28D9] mt-0.5">Cross-banner customers</p>
              <p className="text-[10px] text-[#8B5CF6] mt-0.5">{CROSS_BANNER.crossBannerPct}% of all DiaGe users</p>
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2.5">
              <p className="text-xl font-bold text-gray-800">${CROSS_BANNER.avgCrossBannerValue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">Avg wishlist value</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{CROSS_BANNER.avgBannersPerCustomer}x banners per customer</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {CROSS_BANNER.byCombo.map((c) => {
              const maxCount = Math.max(...CROSS_BANNER.byCombo.map((x) => x.customers));
              const widthPct = Math.round((c.customers / maxCount) * 100);
              return (
                <div key={c.banners}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-700">{c.banners}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-800">{c.customers.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400">avg ${c.avgValue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#F3F0FF] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#5B21B6]" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
            DiaGe is the only platform that surfaces intent across all 4 Signet banners simultaneously, enabling internal routing and coordinated outreach impossible with siloed store systems.
          </p>
        </div>

        {/* Time-to-Appointment */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Timer size={15} className="text-[#5B21B6]" />
            <h2 className="text-sm font-semibold text-gray-800">Time-to-Appointment by Banner</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Average days from wishlist share to confirmed in-store visit — a signal of intent quality and associate responsiveness.
          </p>

          <div className="space-y-5">
            {TIME_TO_APPT.map((b) => (
              <div key={b.banner}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-800">{b.banner.split(" ")[0]}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{b.sharePct}% share→appt</span>
                    <span className="text-lg font-bold text-[#5B21B6]">{b.days}d</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[#F3F0FF] rounded-full h-2">
                    <div className="h-2 rounded-full bg-[#8B5CF6] transition-all" style={{ width: `${(b.days / 8) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 w-16 text-right">{b.appointments} appts</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-start gap-2 bg-[#F3F0FF] rounded-xl p-3">
            <Shield size={13} className="text-[#5B21B6] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#6D28D9] leading-relaxed">
              <span className="font-semibold">Industry benchmark:</span> Traditional jewelry retail averages 14–21 days from first contact to in-store visit. DiaGe customers arrive in{" "}
              <span className="font-semibold">3–6 days</span> with full purchase context already shared — associates can prepare before the visit.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
