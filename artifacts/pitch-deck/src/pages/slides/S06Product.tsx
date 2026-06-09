export default function S06Product() {
  const features = [
    {
      label: "Collection tracker",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B21B6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        </svg>
      ),
      body: "Customers photograph and catalog every piece they own — warranty dates, gemstone details, purchase records — stored across phone changes. Associates see full documentation before the customer arrives. No manual searches, no denied claims.",
    },
    {
      label: "Wishlist builder",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B21B6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      ),
      body: "Customers save items from any retailer website and share their wishlist with a preferred Signet store. Associates receive item, price, ring size, and priority before the customer ever calls or walks in. Smart nudges fire Friday evenings — peak jewelry buying windows.",
    },
    {
      label: "Inspection reminders",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B21B6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
      ),
      body: "Push notifications 30 days before each Diamond Bond inspection window closes. Customers tap once to request an appointment at their preferred store. No call, no friction, no lapse.",
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-body bg-[#FAFAFA]">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="flex h-full">
        {/* Left panel — dark purple */}
        <div
          className="flex flex-col justify-between px-[3.5vw] pt-[7vh] pb-[4vh] flex-shrink-0"
          style={{ width: "32vw", background: "linear-gradient(160deg, #4C1D95 0%, #5B21B6 60%, #6D28D9 100%)" }}
        >
          <div>
            <p className="text-[1.0vw] font-bold tracking-[0.18em] uppercase text-[#C4B5FD]">The solution</p>
            <h1 className="mt-[1.5vh] text-[2.3vw] font-bold text-white leading-[1.25]">
              DiaGe keeps customers engaged between purchases
            </h1>
            <p className="mt-[2vh] text-[1.5vw] text-[#C4B5FD] leading-[1.5]">
              Three capabilities — one reason to stay in the Signet ecosystem
            </p>
          </div>

          {/* Callout */}
          <div className="rounded-sm px-[1.5vw] py-[1.5vh]" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <p className="text-[1.3vw] font-bold text-white">By the time they walk in</p>
            <p className="text-[1.2vw] text-[#C4B5FD] mt-[0.5vh] leading-[1.4]">they've already told you exactly what they want — item, price, ring size, and urgency.</p>
          </div>

          <p className="text-[1.0vw] text-[#A78BFA]">DiaGe · Confidential · June 2026</p>
        </div>

        {/* Right panel */}
        <div className="flex flex-col flex-1 px-[4vw] pt-[7vh] pb-[4vh] gap-[2.5vh]">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex gap-[2vw] items-start p-[2vh_2vw] rounded-sm flex-1"
              style={{ background: "#fff", border: "1px solid #E5E7EB" }}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-sm"
                style={{ width: "3.2vw", height: "3.2vw", background: "#F3F0FF", border: "1px solid #DDD6FE" }}
              >
                {f.icon}
              </div>
              <div className="flex-1">
                <p className="text-[1.1vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">{f.label}</p>
                <p className="mt-[0.6vh] text-[1.55vw] text-[#374151] leading-[1.5]">{f.body}</p>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <p className="text-[1.1vw] text-[#9CA3AF]">6 / 17</p>
          </div>
        </div>
      </div>
    </div>
  );
}
