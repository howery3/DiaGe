export default function S08CorporateDashboard() {
  const tiles = [
    {
      label: "Revenue attribution",
      body: "Tracks DiaGe-referred visits that convert to sales by banner — a direct line between the app and the register. Corporate sees exactly what the platform generates without asking individual stores.",
      accent: "#8B5CF6",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
    },
    {
      label: "Cross-banner intelligence",
      body: "Identifies customers shopping Kay, Zales, Jared, and Banter simultaneously. No individual banner system can see this. It only becomes visible when a single app layer sits above all four.",
      accent: "#06B6D4",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      ),
    },
    {
      label: "Diamond Bond risk monitoring",
      body: "Real-time view of every customer approaching or past their inspection deadline, across all locations, before plans lapse and the relationship is lost. This view does not exist in Signet's current reporting stack.",
      accent: "#F59E0B",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
    {
      label: "Time-to-appointment",
      body: "Measures days from wishlist share to confirmed in-store visit — a metric that does not exist anywhere in Signet's current reporting. The pilot will produce the first real benchmark for how quickly intent converts to a visit.",
      accent: "#10B981",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-body" style={{ background: "#0F172A" }}>
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative z-10 flex flex-col h-full px-[7vw] pt-[6vh] pb-[4vh]">
        {/* Header */}
        <div className="mb-[3.5vh]">
          <p className="text-[1.0vw] font-bold tracking-[0.18em] uppercase text-[#8B5CF6]">Corporate dashboard · enterprise only</p>
          <h1 className="mt-[0.6vh] text-[2.5vw] font-bold text-white leading-[1.2]">
            A cross-banner view no individual store system can produce
          </h1>
          <p className="mt-[0.8vh] text-[1.4vw] text-[#94A3B8]">
            Available only at the DiaGe layer — sitting above all 4 banners simultaneously
          </p>
        </div>

        {/* Tiles */}
        <div className="grid grid-cols-2 gap-[2vw] flex-1">
          {tiles.map((t) => (
            <div
              key={t.label}
              className="flex flex-col gap-[1.2vh] p-[2.5vh_2vw] rounded-sm"
              style={{ background: "#1E293B", border: "1px solid #334155" }}
            >
              <div className="flex items-center gap-[0.8vw]">
                <div
                  className="flex items-center justify-center rounded-sm flex-shrink-0"
                  style={{ width: "2.8vw", height: "2.8vw", background: `${t.accent}18`, border: `1px solid ${t.accent}40` }}
                >
                  {t.icon}
                </div>
                <p className="text-[1.2vw] font-bold tracking-[0.08em] uppercase" style={{ color: t.accent }}>{t.label}</p>
              </div>
              <p className="text-[1.5vw] text-[#CBD5E1] leading-[1.5]">{t.body}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-[2vh] mt-[2vh]" style={{ borderTop: "1px solid #1E293B" }}>
          <p className="text-[1.1vw] text-[#475569]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.1vw] text-[#475569]">8 / 17</p>
        </div>
      </div>
    </div>
  );
}
