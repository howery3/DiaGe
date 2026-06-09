export default function S04ThreeGaps() {
  const gaps = [
    {
      number: "01",
      tag: "No shopping signal",
      title: "A contact record is not a shopping signal",
      body: "The clienteling system holds a guest's contact info and a stale in-store note. When customers go home and start shopping — browsing, comparing, saving — the associate has zero visibility. They can call, but they're guessing.",
      stat: "2–3 yrs",
      statLabel: "avg gap between store visits in jewelry retail",
      accent: "#5B21B6",
      bg: "#F3F0FF",
      border: "#C4B5FD",
    },
    {
      number: "02",
      tag: "Revenue risk",
      title: "Diamond Bond lapse risk",
      body: "Customers forget the 6-month inspection window. No automated reminder. When they arrive to file a claim they can't find the paperwork. Associates search manually. Claims get denied. The customer blames the store.",
      stat: "6 mo",
      statLabel: "inspection window · no outreach · no digital docs",
      accent: "#B45309",
      bg: "#FFFBEB",
      border: "#FCD34D",
    },
    {
      number: "03",
      tag: "Invisible relationship",
      title: "No cross-banner visibility",
      body: "A customer shopping Kay, Zales, Jared, and Banter simultaneously looks like four separate strangers to four separate systems. Signet cannot see or serve that customer as one relationship.",
      stat: "4 banners",
      statLabel: "zero shared customer view across any of them",
      accent: "#DC2626",
      bg: "#FEF2F2",
      border: "#FECACA",
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-body" style={{ background: "#111827" }}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      {/* Header */}
      <div className="px-[7vw] pt-[6vh] pb-[3vh]">
        <p className="text-[1.0vw] font-bold tracking-[0.18em] uppercase text-[#8B5CF6]">The problem · three compounding gaps</p>
        <h1 className="mt-[0.6vh] text-[2.4vw] font-bold text-white leading-[1.2]">
          Three gaps compound into measurable revenue and retention loss
        </h1>
      </div>

      {/* Cards */}
      <div className="px-[7vw] grid grid-cols-3 gap-[2vw] flex-1" style={{ height: "calc(100vh - 22vh)" }}>
        {gaps.map((g) => (
          <div
            key={g.number}
            className="flex flex-col rounded-sm overflow-hidden"
            style={{ background: g.bg, border: `1px solid ${g.border}` }}
          >
            {/* Card header */}
            <div className="px-[1.5vw] pt-[2vh] pb-[1.5vh]" style={{ borderBottom: `2px solid ${g.accent}22` }}>
              <div className="flex items-center justify-between mb-[1vh]">
                <span className="text-[1.0vw] font-bold tracking-[0.15em] uppercase" style={{ color: g.accent }}>{g.tag}</span>
                <span className="text-[2.2vw] font-bold" style={{ color: `${g.accent}30` }}>{g.number}</span>
              </div>
              <p className="text-[1.6vw] font-bold text-[#111827] leading-[1.25]">{g.title}</p>
            </div>

            {/* Body */}
            <div className="px-[1.5vw] py-[1.5vh] flex-1">
              <p className="text-[1.4vw] text-[#374151] leading-[1.5]">{g.body}</p>
            </div>

            {/* Stat */}
            <div className="px-[1.5vw] py-[1.8vh]" style={{ borderTop: `1px solid ${g.border}`, background: `${g.accent}0a` }}>
              <p className="text-[2.4vw] font-bold" style={{ color: g.accent }}>{g.stat}</p>
              <p className="text-[1.1vw] text-[#6B7280] mt-[0.2vh]">{g.statLabel}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-[7vw] py-[2vh] flex justify-between items-center" style={{ borderTop: "1px solid #374151" }}>
        <p className="text-[1.1vw] text-[#6B7280]">DiaGe · Confidential · June 2026</p>
        <p className="text-[1.1vw] text-[#6B7280]">4 / 17</p>
      </div>
    </div>
  );
}
