export default function S07PartnerPortal() {
  const signals = [
    {
      tag: "Signal 01",
      title: "Wishlist leads",
      body: "Customers who shared a specific item with the store. Associates see the product, estimated value, and days since the wishlist was saved — before the customer calls or walks in.",
      detail: "Item · price · ring size · days saved",
      accent: "#5B21B6",
      accentLight: "#F3F0FF",
      accentBorder: "#C4B5FD",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      ),
    },
    {
      tag: "Signal 02",
      title: "Appointment requests",
      body: "Customers who booked through the app, with full wishlist context and a pre-formatted associate prep brief generated automatically. The associate arrives prepared — no cold start.",
      detail: "Wishlist · prep brief · confirmed time",
      accent: "#0369A1",
      accentLight: "#EFF6FF",
      accentBorder: "#BFDBFE",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      tag: "Signal 03",
      title: "Diamond Bond alerts",
      body: "Customers approaching or past their inspection deadline. One-click outreach templates let associates reschedule before the plan lapses — turning a compliance risk into a booked visit.",
      detail: "Days overdue · plan value · one-click outreach",
      accent: "#B45309",
      accentLight: "#FFFBEB",
      accentBorder: "#FCD34D",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-body" style={{ background: "#111827" }}>
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      {/* Header */}
      <div className="px-[7vw] pt-[6vh] pb-[3.5vh]">
        <p className="text-[1.0vw] font-bold tracking-[0.18em] uppercase text-[#8B5CF6]">The partner portal · store associates</p>
        <h1 className="mt-[0.6vh] text-[2.5vw] font-bold text-white leading-[1.2]">
          Associates receive verified purchase intent before the customer walks in
        </h1>
      </div>

      {/* Cards */}
      <div className="px-[7vw] grid grid-cols-3 gap-[2vw]" style={{ height: "calc(100vh - 26vh)" }}>
        {signals.map((s) => (
          <div
            key={s.tag}
            className="flex flex-col rounded-sm overflow-hidden"
            style={{ background: s.accentLight, border: `1px solid ${s.accentBorder}` }}
          >
            {/* Icon header */}
            <div className="px-[1.8vw] pt-[2.5vh] pb-[2vh]">
              <div
                className="flex items-center justify-center rounded-sm mb-[1.5vh]"
                style={{ width: "3.5vw", height: "3.5vw", background: s.accent }}
              >
                {s.icon}
              </div>
              <p className="text-[1.0vw] font-bold tracking-[0.12em] uppercase mb-[0.5vh]" style={{ color: s.accent }}>{s.tag}</p>
              <p className="text-[1.75vw] font-bold text-[#111827] leading-[1.25]">{s.title}</p>
            </div>

            {/* Body */}
            <div className="px-[1.8vw] py-[1.5vh] flex-1" style={{ borderTop: `1px solid ${s.accentBorder}` }}>
              <p className="text-[1.4vw] text-[#374151] leading-[1.5]">{s.body}</p>
            </div>

            {/* Detail pill */}
            <div className="px-[1.8vw] py-[1.5vh]" style={{ borderTop: `1px solid ${s.accentBorder}` }}>
              <p className="text-[1.1vw] font-semibold" style={{ color: s.accent }}>{s.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-[7vw] py-[2vh] flex justify-between items-center" style={{ borderTop: "1px solid #374151" }}>
        <p className="text-[1.1vw] text-[#6B7280]">All signals are customer-initiated. DiaGe does not scrape, infer, or cold-contact.</p>
        <p className="text-[1.1vw] text-[#6B7280]">7 / 17</p>
      </div>
    </div>
  );
}
