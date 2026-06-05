export default function S10HowYouMakeMoney() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <p className="text-[1.2vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          The revenue mechanism
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
                Customers shared specific items with the store. Associates know the product, price, and how long it's been saved.
              </p>
            </div>
            <p className="text-[1.2vw] text-[#9CA3AF]">Pilot data · Jan–May 2026</p>
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
              <p className="text-[5.2vw] font-bold text-[#5B21B6] leading-none">68</p>
              <p className="text-[1.4vw] font-bold text-[#374151] text-center">come in for a visit</p>
              <p className="text-[1.35vw] text-[#6B7280] text-center leading-[1.4]">
                68% of contacted leads book an appointment. Associates arrive prepared — full wishlist context in hand before the customer walks in.
              </p>
            </div>
            <p className="text-[1.2vw] text-[#9CA3AF]">68% lead → visit rate (22% industry avg)</p>
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
              <p className="text-[5.2vw] font-bold text-white leading-none">41</p>
              <p className="text-[1.4vw] font-bold text-[#E9D5FF] text-center">buy</p>
              <p className="text-[1.35vw] text-[#C4B5FD] text-center leading-[1.4]">
                60% of in-store visits convert to a purchase. Average order value: $2,847 — more than double Signet's current average.
              </p>
            </div>
            <p className="text-[1.2vw] text-[#9CA3AF]">60.2% visit → purchase rate (31% industry avg)</p>
          </div>
        </div>

        <div
          className="mt-[3vh] flex items-center justify-between rounded-sm px-[2.5vw] py-[2vh]"
          style={{ background: "#111827" }}
        >
          <p className="text-[1.7vw] text-[#9CA3AF]">
            100 wishlist leads at pilot conversion rates
          </p>
          <div className="flex items-baseline gap-[1vw]">
            <p className="text-[1.7vw] text-[#9CA3AF]">generates</p>
            <p className="text-[3.2vw] font-bold text-white">$116,000</p>
            <p className="text-[1.7vw] text-[#9CA3AF]">in attributed Signet sales</p>
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
