export default function S14FullCircle() {
  const gaps = [
    {
      num: "01",
      title: "A contact record is not a shopping signal",
      before: "Associates call with no context. Customers ignore it. Intent lives on a device Signet never sees.",
      after: "Customer shares a wishlist. Associate calls with the item, price, and ring size already in hand.",
      metric: "DiaGe-attributed transaction count vs. control stores",
      accent: "#8B5CF6",
      accentDim: "#4C1D95",
    },
    {
      num: "02",
      title: "Diamond Bond lapse and lost paperwork",
      before: "Plans lapse silently. Claims get denied. Guests blame the store. Associates search paper records.",
      after: "Automated reminders prevent lapses. The digital vault eliminates the lost-receipt conversation entirely.",
      metric: "Diamond Bond inspection compliance rate vs. control stores",
      accent: "#06B6D4",
      accentDim: "#164E63",
    },
    {
      num: "03",
      title: "No cross-banner visibility",
      before: "A customer shopping Kay, Zales, and Jared at the same time looks like three separate strangers.",
      after: "One customer profile, visible across all banners. Corporate sees the full relationship for the first time.",
      metric: "Cross-banner customers identified and served as one relationship",
      accent: "#10B981",
      accentDim: "#064E3B",
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-body" style={{ background: "#111827" }}>
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative z-10 flex flex-col h-full px-[7vw] pt-[5.5vh] pb-[3.5vh]">
        {/* Header */}
        <div className="mb-[3vh]">
          <p className="text-[1.0vw] font-bold tracking-[0.18em] uppercase text-[#8B5CF6]">Full circle · three gaps, one platform</p>
          <h1 className="mt-[0.5vh] text-[2.5vw] font-bold text-white leading-[1.2]">
            Three gaps. One platform. All of it measurable.
          </h1>
          <p className="mt-[0.8vh] text-[1.4vw] text-[#94A3B8]">Every problem raised at the start has a direct answer and a metric to prove it in the pilot.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-[2vw] flex-1">
          {gaps.map((g) => (
            <div
              key={g.num}
              className="flex flex-col rounded-sm overflow-hidden"
              style={{ background: "#1E293B", border: `1px solid ${g.accent}30` }}
            >
              {/* Card top accent line */}
              <div style={{ height: "0.35vh", background: g.accent, width: "100%" }} />

              <div className="flex flex-col flex-1 p-[2vh_1.8vw]">
                {/* Gap number + title */}
                <p className="text-[1.0vw] font-bold tracking-[0.14em] uppercase mb-[0.8vh]" style={{ color: g.accent }}>Gap {g.num}</p>
                <p className="text-[1.6vw] font-bold text-white leading-[1.3] mb-[2vh]">{g.title}</p>

                {/* Before */}
                <div className="rounded-sm p-[1.2vh_1vw] mb-[1.2vh]" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}>
                  <div className="flex items-center gap-[0.5vw] mb-[0.6vh]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6.5" stroke="#EF4444" strokeWidth="1.2"/>
                      <line x1="4.5" y1="4.5" x2="9.5" y2="9.5" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round"/>
                      <line x1="9.5" y1="4.5" x2="4.5" y2="9.5" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    <p className="text-[0.95vw] font-bold tracking-[0.12em] uppercase text-[#EF4444]">Before</p>
                  </div>
                  <p className="text-[1.25vw] text-[#94A3B8] leading-[1.45]">{g.before}</p>
                </div>

                {/* After */}
                <div className="rounded-sm p-[1.2vh_1vw] flex-1" style={{ background: `${g.accent}12`, border: `1px solid ${g.accent}35` }}>
                  <div className="flex items-center gap-[0.5vw] mb-[0.6vh]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6.5" stroke={g.accent} strokeWidth="1.2"/>
                      <polyline points="4,7.5 6.5,10 10,4.5" stroke={g.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-[0.95vw] font-bold tracking-[0.12em] uppercase" style={{ color: g.accent }}>After</p>
                  </div>
                  <p className="text-[1.25vw] text-[#CBD5E1] leading-[1.45]">{g.after}</p>
                </div>
              </div>

              {/* Pilot metric footer */}
              <div className="px-[1.8vw] py-[1.4vh]" style={{ borderTop: `1px solid ${g.accent}25`, background: `${g.accent}08` }}>
                <p className="text-[0.9vw] font-bold tracking-[0.1em] uppercase text-[#64748B] mb-[0.3vh]">Pilot metric</p>
                <p className="text-[1.1vw] font-semibold" style={{ color: g.accent }}>{g.metric}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-[1.5vh] mt-[2vh]" style={{ borderTop: "1px solid #1E293B" }}>
          <p className="text-[1.1vw] text-[#475569]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.1vw] text-[#475569]">16 / 18</p>
        </div>
      </div>
    </div>
  );
}
