export default function S10HowYouMakeMoney() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <p className="text-[1.2vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          The revenue mechanism · conservative model
        </p>
        <h1 className="mt-[1vh] text-[3.2vw] font-bold text-[#111827] leading-[1.1]">
          For every 100 customers who share a wishlist with a Signet store:
        </h1>

        <div className="mt-[4vh] flex items-stretch gap-0 flex-1">
          <div className="flex flex-col items-center justify-center flex-1 gap-[2vh]">
            <div
              className="w-full flex flex-col items-center justify-center rounded-sm py-[3vh] px-[1vw] gap-[1.2vh]"
              style={{ background: "#F3F0FF" }}
            >
              <p className="text-[5.2vw] font-bold text-[#5B21B6] leading-none">100</p>
              <p className="text-[1.4vw] font-bold text-[#374151] text-center">wishlist leads</p>
              <p className="text-[1.35vw] text-[#6B7280] text-center leading-[1.4]">
                A customer saved a specific item and chose to share it with a Signet store. The associate knows the product, price, and ring size before the customer calls.
              </p>
            </div>
            <p className="text-[1.2vw] text-[#9CA3AF] text-center">Customer-initiated intent signal</p>
          </div>

          <div className="flex items-center px-[1.5vw] flex-shrink-0">
            <svg width="3vw" height="3vw" viewBox="0 0 48 48" fill="none" style={{ width: "3vw", height: "3vw" }}>
              <path d="M8 24h32M28 12l12 12-12 12" stroke="#5B21B6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-[2vh]">
            <div
              className="w-full flex flex-col items-center justify-center rounded-sm py-[3vh] px-[1vw] gap-[1.2vh]"
              style={{ background: "#EEF2FF" }}
            >
              <p className="text-[5.2vw] font-bold text-[#5B21B6] leading-none">~35</p>
              <p className="text-[1.4vw] font-bold text-[#374151] text-center">come in for a visit</p>
              <p className="text-[1.35vw] text-[#6B7280] text-center leading-[1.4]">
                Research shows intent-aware shoppers visit at 2–4× the rate of cold outreach. We model 35% — well below the research upper bound.
              </p>
            </div>
            <p className="text-[1.2vw] text-[#9CA3AF] text-center">Model assumption · 35% visit rate · cold outreach avg: 5–10%</p>
          </div>

          <div className="flex items-center px-[1.5vw] flex-shrink-0">
            <svg width="3vw" height="3vw" viewBox="0 0 48 48" fill="none" style={{ width: "3vw", height: "3vw" }}>
              <path d="M8 24h32M28 12l12 12-12 12" stroke="#5B21B6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-[2vh]">
            <div
              className="w-full flex flex-col items-center justify-center rounded-sm py-[3vh] px-[1vw] gap-[1.2vh]"
              style={{ background: "#5B21B6" }}
            >
              <p className="text-[5.2vw] font-bold text-white leading-none">~15</p>
              <p className="text-[1.4vw] font-bold text-[#E9D5FF] text-center">buy</p>
              <p className="text-[1.35vw] text-[#C4B5FD] text-center leading-[1.4]">
                Jewelry consultative close rates average 40–55% when the customer arrives knowing what they want. We model 43% — at the conservative end.
              </p>
            </div>
            <p className="text-[1.2vw] text-[#9CA3AF] text-center">Model assumption · 43% close rate · Signet ATV ~$900 + 20% intent lift</p>
          </div>
        </div>

        <div
          className="mt-[3vh] flex items-center justify-between rounded-sm px-[2.5vw] py-[2vh]"
          style={{ background: "#111827" }}
        >
          <div>
            <p className="text-[1.5vw] text-[#9CA3AF]">
              Conservative model · Signet ATV ~$900 (est. from public filings) · 20% intent-driven lift
            </p>
          </div>
          <div className="flex items-baseline gap-[1vw]">
            <p className="text-[1.7vw] text-[#9CA3AF]">generates</p>
            <p className="text-[3.2vw] font-bold text-white">~$15,000</p>
            <p className="text-[1.7vw] text-[#9CA3AF]">in modeled Signet sales</p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-[2vh] pt-[1.5vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">10 / 14</p>
        </div>
      </div>
    </div>
  );
}
