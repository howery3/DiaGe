export default function S10KPIs() {
  const rows = [
    {
      metric: "Blended average transaction value",
      note: "42% Zales credit (~$2K) · 58% bank card (~$900) · FY2026 AR p.1391",
      today: "~$1,362",
      benchmark: "1.2–2.0× lift documented",
    },
    {
      metric: "Cold outreach → store visit rate",
      note: "Call → visit only · purchase requires close rate below",
      today: "5–10%",
      benchmark: "2–4× higher for intent-aware outreach",
    },
    {
      metric: "Consultative close rate (in-store jewelry)",
      note: "Cold end-to-end: 5–10% visit × 40–55% close = 2–5% call → purchase",
      today: "40–55%",
      benchmark: "Holds or improves when associate is prepared",
    },
    {
      metric: "Retail app 30-day retention (industry avg)",
      note: null,
      today: "N/A",
      benchmark: "~32% consumer apps",
    },
    {
      metric: "Time from outreach to in-store visit",
      note: null,
      today: "14–21 days (industry)",
      benchmark: "Shorter for high-intent leads",
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-body" style={{ background: "#0F172A" }}>
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative z-10 flex flex-col h-full px-[7vw] pt-[5.5vh] pb-[3.5vh]">
        {/* Header */}
        <div className="mb-[3vh]">
          <p className="text-[1.0vw] font-bold tracking-[0.18em] uppercase text-[#8B5CF6]">Industry benchmarks · no DiaGe-specific data claimed</p>
          <h1 className="mt-[0.5vh] text-[2.4vw] font-bold text-white leading-[1.2]">
            The case for intent-driven engagement rests on well-documented retail research
          </h1>
        </div>

        {/* Table header */}
        <div className="grid items-center mb-[1vh] px-[1.5vw]" style={{ gridTemplateColumns: "1fr 18% 28%" }}>
          <p className="text-[1.0vw] font-bold tracking-[0.14em] uppercase text-[#475569]">Metric</p>
          <p className="text-[1.0vw] font-bold tracking-[0.14em] uppercase text-[#64748B] text-right">Signet today</p>
          <div className="flex items-center justify-end gap-[0.5vw]">
            <div className="w-[0.5vw] h-[0.5vw] rounded-full bg-[#8B5CF6]" />
            <p className="text-[1.0vw] font-bold tracking-[0.14em] uppercase text-[#8B5CF6]">Intent-driven benchmark</p>
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-[0.7vh] flex-1">
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid items-center px-[1.5vw] py-[1.4vh] rounded-sm"
              style={{
                gridTemplateColumns: "1fr 18% 28%",
                background: i % 2 === 0 ? "#1E293B" : "#162032",
                border: "1px solid #1E293B",
              }}
            >
              <div>
                <p className="text-[1.55vw] text-[#CBD5E1]">{r.metric}</p>
                {r.note && <p className="text-[1.0vw] text-[#475569] mt-[0.2vh]">{r.note}</p>}
              </div>
              <p className="text-[1.65vw] font-bold text-[#94A3B8] text-right">{r.today}</p>
              <div className="flex justify-end">
                <span
                  className="text-[1.55vw] font-bold text-right"
                  style={{ color: "#A78BFA" }}
                >
                  {r.benchmark}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sources */}
        <p className="text-[0.95vw] text-[#334155] mt-[1.5vh]">
          Sources: Signet FY2026 Annual Report · NRF Retail Horizons · McKinsey "The Value of Getting Personalization Right" · JCK Industry Intelligence · Insider Intelligence retail app benchmarks
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-[1.5vh] mt-[1vh]" style={{ borderTop: "1px solid #1E293B" }}>
          <p className="text-[1.1vw] text-[#475569]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.1vw] text-[#475569]">13 / 18</p>
        </div>
      </div>
    </div>
  );
}
