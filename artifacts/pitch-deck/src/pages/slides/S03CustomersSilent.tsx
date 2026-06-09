export default function S03CustomersSilent() {
  const problems = [
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" style={{ width: "2.4vw", height: "2.4vw" }}>
          <rect x="8" y="18" width="24" height="16" rx="3" stroke="#5B21B6" strokeWidth="2.2" />
          <path d="M14 18v-5a6 6 0 0 1 12 0v5" stroke="#5B21B6" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="20" cy="26" r="2.5" fill="#5B21B6" />
        </svg>
      ),
      label: "The wishlist stays locked inside",
      body: "Associates log what customers describe in-store. That wishlist lives in the clienteling system. The customer never sees it and cannot access it after they leave.",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" style={{ width: "2.4vw", height: "2.4vw" }}>
          <circle cx="20" cy="20" r="12" stroke="#5B21B6" strokeWidth="2.2" />
          <path d="M20 13v7l4 4" stroke="#5B21B6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 32l4-4" stroke="#5B21B6" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M4 36l4-4" stroke="#5B21B6" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.4" />
        </svg>
      ),
      label: "Outreach is flying blind",
      body: "When associates call, they go off what the customer said on their last visit. There is no window into what the customer is shopping for right now — at home, or online.",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" style={{ width: "2.4vw", height: "2.4vw" }}>
          <path d="M20 6L8 12v10c0 7 5.5 13 12 14 6.5-1 12-7 12-14V12L20 6z" stroke="#5B21B6" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M15 20l3 3 7-7" stroke="#5B21B6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.35" />
          <line x1="20" y1="17" x2="20" y2="23" stroke="#5B21B6" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="26" r="1.5" fill="#5B21B6" />
        </svg>
      ),
      label: "Diamond Bond lapses silently",
      body: "Customers forget the 6-month inspection window. Plans lapse with no warning. Associates only find out when the customer arrives to file a replacement claim.",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" style={{ width: "2.4vw", height: "2.4vw" }}>
          <rect x="10" y="6" width="20" height="28" rx="3" stroke="#5B21B6" strokeWidth="2.2" />
          <line x1="15" y1="13" x2="25" y2="13" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="19" x2="25" y2="19" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="25" x2="20" y2="25" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" />
          <circle cx="29" cy="30" r="7" fill="#FAFAFA" stroke="#5B21B6" strokeWidth="2" />
          <line x1="26.5" y1="30" x2="31.5" y2="30" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" />
          <line x1="29" y1="27.5" x2="29" y2="32.5" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.35" />
        </svg>
      ),
      label: "Lost paperwork, denied claims",
      body: "Customers arrive for warranty service without receipts. Associates search manual records. When a claim is denied for missing documentation, the guest blames Signet.",
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      {/* Subtle background accent */}
      <div
        className="absolute right-0 top-0 w-[35vw] h-full opacity-[0.035]"
        style={{ background: "radial-gradient(ellipse at 80% 40%, #5B21B6 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[1.2vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6] mb-[1vh]">
              Four gaps in the current system
            </p>
            <h1
              className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
              style={{ textWrap: "balance", maxWidth: "70%" }}
            >
              Signet can contact guests after the sale but the connection ends there
            </h1>
          </div>
        </div>

        {/* 2×2 card grid */}
        <div className="mt-[3.5vh] grid grid-cols-2 gap-[2vw] flex-1">
          {problems.map((p, i) => (
            <div
              key={i}
              className="flex flex-col gap-[1.2vh] rounded-sm p-[2.2vh_2vw]"
              style={{
                background: i % 2 === 0 ? "#F3F0FF" : "#FAFAFA",
                border: "1px solid #E5E7EB",
              }}
            >
              <div className="flex items-center gap-[1vw]">
                {p.icon}
                <p className="text-[1.55vw] font-bold text-[#111827] leading-[1.25]">{p.label}</p>
              </div>
              <p className="text-[1.4vw] text-[#4B5563] leading-[1.55]">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">3 / 16</p>
        </div>
      </div>
    </div>
  );
}
