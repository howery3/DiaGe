export default function S11PilotRevenue() {
  // Realistic ramp model — purchases per store constrained by DiaGe user base growth
  // Pilot: 180 DiaGe users/store → 15% share wishlists → 27 leads → 10% close → 3 purchases/mo
  // Year 1: 400 users/store → 60 leads → 8 purchases/mo
  // Mature: 1,500 users/store → 225 leads → 20 purchases/mo (not 100 — conservative)

  const scenarios = [
    {
      label: "Pilot phase",
      sublabel: "25 stores · 90 days",
      stageColor: "#1D4ED8",
      bg: "#EFF6FF",
      border: "#BFDBFE",
      dark: false,
      rows: [
        { label: "DiaGe users / store", value: "~180", note: "Associates actively promoting" },
        { label: "Active wishlist shares / mo", value: "~27", note: "15% of users share monthly" },
        { label: "Call → purchase rate", value: "10%", note: "Warm outreach benchmark" },
        { label: "DiaGe purchases / store / mo", value: "~3", note: "" },
        { label: "Blended ATV", value: "$1,362", note: "42% credit · FY2026 AR" },
      ],
      revenueLabel: "90-day pilot revenue",
      revenue: "$306K",
      subRevenue: "$1.2M / yr run rate · 25 stores",
      math: "25 × 3 × 3 months × $1,362",
      note: "Pilot goal: confirm that DiaGe-powered calls outperform cold outreach (2–3%) at 10%.",
    },
    {
      label: "Year 1 rollout",
      sublabel: "500 stores · full year",
      stageColor: "#5B21B6",
      bg: "#F3F0FF",
      border: "#C4B5FD",
      dark: false,
      rows: [
        { label: "DiaGe users / store", value: "~400", note: "6 months of active promotion" },
        { label: "Active wishlist shares / mo", value: "~60", note: "15% of users share monthly" },
        { label: "Call → purchase rate", value: "10%", note: "Proven at pilot" },
        { label: "DiaGe purchases / store / mo", value: "~8", note: "" },
        { label: "Blended ATV", value: "$1,362", note: "42% credit · FY2026 AR" },
      ],
      revenueLabel: "Annual attributed revenue",
      revenue: "$65M",
      subRevenue: "500 stores at avg 8 purchases / mo",
      math: "500 × 8 × 12 × $1,362",
      note: "~19% of NA network. Associates trained, DiaGe embedded in daily outreach routine.",
    },
    {
      label: "Mature rollout",
      sublabel: "2,582 stores · full year",
      stageColor: "#8B5CF6",
      bg: "#111827",
      border: "#374151",
      dark: true,
      rows: [
        { label: "DiaGe users / store", value: "~1,500", note: "3+ yrs of cumulative signups" },
        { label: "Active wishlist shares / mo", value: "~225", note: "15% of users share monthly" },
        { label: "Call → purchase rate", value: "10%", note: "Conservative vs. intent benchmark" },
        { label: "DiaGe purchases / store / mo", value: "~20", note: "(not 100, conservative)" },
        { label: "Blended ATV", value: "$1,362", note: "42% credit · FY2026 AR" },
      ],
      revenueLabel: "Annual attributed revenue",
      revenue: "$845M",
      subRevenue: "All 2,582 NA locations at mature state",
      math: "2,582 × 20 × 12 × $1,362",
      note: "DiaGe embedded in CRM. 20 purchases/store/month is 20% of slide 10's ceiling, conservative.",
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[3vh] pb-[2vh]">
        <p className="text-[1.2vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          Revenue model · realistic ramp
        </p>
        <h1 className="mt-[0.6vh] text-[2.4vw] font-bold text-[#111827] leading-[1.15]">
          Purchases per store grow as the DiaGe user base builds, modeled conservatively
        </h1>
        <p className="mt-[0.5vh] text-[1.2vw] text-[#6B7280]">
          Constraint: how many customers in each store's pool have downloaded DiaGe and shared a wishlist · 15% monthly share rate · 10% call-to-purchase
        </p>

        <div className="mt-[1.5vh] grid grid-cols-3 gap-[2vw] flex-1">
          {scenarios.map((s) => {
            const textMuted = s.dark ? "#9CA3AF" : "#6B7280";
            const textMain = s.dark ? "#F9FAFB" : "#111827";
            const divider = s.dark ? "#374151" : "#E5E7EB";
            const noteColor = s.dark ? "#6B7280" : "#9CA3AF";

            return (
              <div
                key={s.label}
                className="flex flex-col rounded-sm border"
                style={{ background: s.bg, borderColor: s.border }}
              >
                {/* Header */}
                <div className="px-[1.5vw] pt-[1.2vh] pb-[0.8vh]" style={{ borderBottom: `1px solid ${divider}` }}>
                  <p className="text-[1.2vw] font-bold tracking-[0.1em] uppercase" style={{ color: s.stageColor }}>
                    {s.label}
                  </p>
                  <p className="text-[1.05vw] mt-[0.2vh]" style={{ color: textMuted }}>{s.sublabel}</p>
                </div>

                {/* Rows */}
                <div className="px-[1.5vw] py-[0.8vh] flex flex-col gap-[0.5vh] flex-1">
                  {s.rows.map((row, i) => {
                    const isKeyRow = row.label.includes("purchases / store");
                    return (
                      <div
                        key={i}
                        className="flex justify-between items-baseline pb-[0.5vh]"
                        style={{
                          borderBottom: i < s.rows.length - 1 ? `1px solid ${divider}` : "none",
                          background: isKeyRow
                            ? s.dark ? "rgba(139,92,246,0.12)" : "rgba(91,33,182,0.06)"
                            : "transparent",
                          borderRadius: isKeyRow ? "0.3vw" : 0,
                          padding: isKeyRow ? "0.4vh 0.3vw" : undefined,
                          marginLeft: isKeyRow ? "-0.3vw" : 0,
                          marginRight: isKeyRow ? "-0.3vw" : 0,
                        }}
                      >
                        <div>
                          <p
                            className="text-[1.3vw] leading-tight"
                            style={{
                              color: isKeyRow ? (s.dark ? "#E9D5FF" : "#5B21B6") : textMuted,
                              fontWeight: isKeyRow ? 700 : 400,
                            }}
                          >
                            {row.label}
                          </p>
                          {row.note && (
                            <p className="text-[1.05vw]" style={{ color: noteColor }}>{row.note}</p>
                          )}
                        </div>
                        <p
                          className="text-[1.4vw] font-bold ml-[0.5vw] shrink-0"
                          style={{ color: isKeyRow ? (s.dark ? "white" : s.stageColor) : textMain }}
                        >
                          {row.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Revenue */}
                <div
                  className="px-[1.5vw] py-[1vh]"
                  style={{ borderTop: `1px solid ${divider}` }}
                >
                  <p className="text-[1.05vw]" style={{ color: textMuted }}>{s.revenueLabel}</p>
                  <p className="text-[2.5vw] font-bold leading-none mt-[0.3vh]"
                    style={{ color: s.dark ? "white" : s.stageColor }}>
                    {s.revenue}
                  </p>
                  <p className="text-[1vw] font-semibold mt-[0.2vh]" style={{ color: s.stageColor }}>
                    {s.subRevenue}
                  </p>
                  <p className="text-[0.95vw] mt-[0.3vh] font-mono" style={{ color: noteColor }}>
                    {s.math}
                  </p>
                  <p className="text-[1vw] mt-[0.5vh] leading-[1.3]" style={{ color: textMuted }}>
                    {s.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-[0.8vh] rounded-sm px-[1.5vw] py-[0.5vh] text-[1vw] text-[#374151] leading-[1.35]"
          style={{ background: "#FEF3C7", border: "1px solid #FCD34D" }}
        >
          <span className="font-bold">Key assumption: </span>
          Associates promote DiaGe to in-store visitors + outreach calls, adding ~85 new DiaGe users/store/month · 15% share wishlists in any given month · 10% of wishlist-led calls close (McKinsey/NRF warm-outreach benchmark: 8–15%) · $1,362 blended ATV from 42.0% credit mix (Signet FY2026 Annual Report).
        </div>

        <div className="flex justify-between items-end mt-[1vh] pt-[1vh] border-t border-[#E5E7EB]">
          <p className="text-[1.2vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.2vw] text-[#9CA3AF]">12 / 15</p>
        </div>
      </div>
    </div>
  );
}
