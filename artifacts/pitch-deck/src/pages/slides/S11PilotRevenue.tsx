export default function S11PilotRevenue() {
  // Model: 1,000 calls/store/month × 10% conversion = 100 purchases
  // Revenue per 100 purchases: 42 × $2,000 + 58 × $900 = $136,200
  // Blended ATV: $1,362 (42.0% credit mix, Signet FY2026 AR)

  const scenarios = [
    {
      label: "Pilot phase",
      sublabel: "25 stores · 90 days",
      color: "#1D4ED8",
      bg: "#EFF6FF",
      border: "#BFDBFE",
      dark: false,
      stores: "25",
      period: "90 days",
      revenue: "$10.2M",
      revenueLabel: "90-day pilot revenue",
      runRate: "$40.9M / yr",
      note: "Pilot validates the real call → purchase rate before scale commitment.",
    },
    {
      label: "Phase 2 rollout",
      sublabel: "500 stores · full year",
      color: "#5B21B6",
      bg: "#F3F0FF",
      border: "#C4B5FD",
      dark: false,
      stores: "500",
      period: "12 months",
      revenue: "$817M",
      revenueLabel: "Annual attributed revenue",
      runRate: "~19% of Signet NA stores",
      note: "Associates fully trained on DiaGe-powered outreach.",
    },
    {
      label: "Full adoption",
      sublabel: "2,582 stores · full year",
      color: "#8B5CF6",
      bg: "#111827",
      border: "#374151",
      dark: true,
      stores: "2,582",
      period: "12 months",
      revenue: "$4.2B",
      revenueLabel: "Annual attributed revenue",
      runRate: "All NA locations · mature state",
      note: "100 purchases/store/month sustained across full network.",
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <p className="text-[1.2vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          Revenue model · direct from slide 10 mechanism
        </p>
        <h1 className="mt-[1vh] text-[2.8vw] font-bold text-[#111827] leading-[1.1]">
          Scaling the per-store model to the full Signet network
        </h1>
        <p className="mt-[1vh] text-[1.4vw] text-[#6B7280]">
          Formula: stores × 100 purchases/mo × 12 mo × $1,362 blended ATV · 42.0% credit mix from Signet FY2026 Annual Report
        </p>

        <div className="mt-[3vh] grid grid-cols-3 gap-[2vw] flex-1">
          {scenarios.map((s) => {
            const textMuted = s.dark ? "#9CA3AF" : "#6B7280";
            const textMain = s.dark ? "#F9FAFB" : "#111827";
            const divider = s.dark ? "#374151" : "#E5E7EB";
            return (
              <div
                key={s.label}
                className="flex flex-col rounded-sm border p-[2.5vh_1.5vw]"
                style={{ background: s.bg, borderColor: s.border }}
              >
                <p className="text-[1.3vw] font-bold tracking-[0.1em] uppercase" style={{ color: s.color }}>
                  {s.label}
                </p>
                <p className="text-[1.25vw] mt-[0.3vh]" style={{ color: textMuted }}>
                  {s.sublabel}
                </p>

                <div className="mt-[2vh] flex flex-col gap-[1.1vh] flex-1" style={{ borderTop: `1px solid ${divider}` }}>
                  <div className="pt-[1.2vh] flex justify-between items-baseline border-b pb-[1vh]" style={{ borderColor: divider }}>
                    <p className="text-[1.4vw]" style={{ color: textMuted }}>Stores in program</p>
                    <p className="text-[1.5vw] font-bold" style={{ color: textMain }}>{s.stores}</p>
                  </div>
                  <div className="flex justify-between items-baseline border-b pb-[1vh]" style={{ borderColor: divider }}>
                    <p className="text-[1.4vw]" style={{ color: textMuted }}>Purchases / store / month</p>
                    <p className="text-[1.5vw] font-bold" style={{ color: textMain }}>100</p>
                  </div>
                  <div className="flex justify-between items-baseline border-b pb-[1vh]" style={{ borderColor: divider }}>
                    <p className="text-[1.4vw]" style={{ color: textMuted }}>Blended ATV</p>
                    <p className="text-[1.5vw] font-bold" style={{ color: textMain }}>$1,362</p>
                  </div>
                  <div className="flex justify-between items-baseline border-b pb-[1vh]" style={{ borderColor: divider }}>
                    <p className="text-[1.4vw]" style={{ color: textMuted }}>Period</p>
                    <p className="text-[1.5vw] font-bold" style={{ color: textMain }}>{s.period}</p>
                  </div>
                </div>

                <div className="mt-[2vh] pt-[1.5vh]" style={{ borderTop: `1px solid ${divider}` }}>
                  <p className="text-[1.25vw]" style={{ color: textMuted }}>{s.revenueLabel}</p>
                  <p className="text-[3.4vw] font-bold leading-none mt-[0.5vh]" style={{ color: s.dark ? "white" : s.color }}>
                    {s.revenue}
                  </p>
                  <p className="text-[1.2vw] font-semibold mt-[0.5vh]" style={{ color: s.color }}>{s.runRate}</p>
                  <p className="text-[1.2vw] mt-[0.8vh] leading-[1.4]" style={{ color: textMuted }}>{s.note}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-[2vh] rounded-sm px-[1.5vw] py-[1.2vh] text-[1.3vw] text-[#374151] leading-[1.5]"
          style={{ background: "#FEF3C7", border: "1px solid #FCD34D" }}
        >
          <span className="font-bold">Every input is traceable: </span>
          1,000 calls = 5 associates × 10 calls × 20 days (Signet outreach standard) · 10% = conservative warm-outreach benchmark (McKinsey / NRF: 8–15%) · $1,362 blended ATV = 42.0% credit at $2,000 + 58.0% cash at $900 (Signet FY2026 AR, NA payment participation table) · 100 purchases = 1,000 × 10%. The pilot replaces every assumption with measured data.
        </div>

        <div className="flex justify-between items-end mt-[2vh] pt-[1.5vh] border-t border-[#E5E7EB]">
          <p className="text-[1.2vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.2vw] text-[#9CA3AF]">12 / 14</p>
        </div>
      </div>
    </div>
  );
}
