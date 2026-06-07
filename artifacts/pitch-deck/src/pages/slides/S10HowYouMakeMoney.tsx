export default function S10HowYouMakeMoney() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <p className="text-[1.2vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          The revenue mechanism · built from Signet's own operational targets
        </p>
        <h1 className="mt-[1vh] text-[3vw] font-bold text-[#111827] leading-[1.1]">
          DiaGe turns the daily outreach requirement into a qualified-lead pipeline
        </h1>

        <div className="mt-[3.5vh] flex gap-[2vw] flex-1 items-stretch">
          <div className="flex flex-col gap-[1.5vh] flex-1 rounded-sm p-[2vh_1.5vw]" style={{ background: "#F3F0FF" }}>
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">The outreach engine</p>
            <div className="flex flex-col gap-[1.2vh] mt-[0.5vh]">
              <div className="flex justify-between items-baseline border-b border-[#E0D9F7] pb-[1vh]">
                <p className="text-[1.7vw] text-[#374151]">Associates per store</p>
                <p className="text-[1.8vw] font-bold text-[#111827]">5</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E0D9F7] pb-[1vh]">
                <p className="text-[1.7vw] text-[#374151]">Outreach calls / associate / day</p>
                <p className="text-[1.8vw] font-bold text-[#111827]">10</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E0D9F7] pb-[1vh]">
                <p className="text-[1.7vw] text-[#374151]">Working days / month</p>
                <p className="text-[1.8vw] font-bold text-[#111827]">20</p>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-[1.7vw] font-bold text-[#374151]">Total calls / store / month</p>
                <p className="text-[1.8vw] font-bold text-[#5B21B6]">1,000</p>
              </div>
            </div>
            <p className="text-[1.4vw] text-[#6B7280] leading-[1.4] mt-auto">
              DiaGe makes each call warm — associates see the item, price, and ring size before they dial. No cold outreach.
            </p>
          </div>

          <div className="flex items-center px-[0.5vw] flex-shrink-0">
            <svg width="2.5vw" height="2.5vw" viewBox="0 0 48 48" fill="none" style={{ width: "2.5vw", height: "2.5vw" }}>
              <path d="M8 24h32M28 12l12 12-12 12" stroke="#5B21B6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col gap-[1.5vh] flex-1 rounded-sm p-[2vh_1.5vw]" style={{ background: "#EEF2FF" }}>
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">Conservative pilot assumption</p>
            <div className="flex flex-col items-center justify-center flex-1 gap-[1vh]">
              <p className="text-[6vw] font-bold text-[#5B21B6] leading-none">10%</p>
              <p className="text-[1.7vw] font-bold text-[#374151] text-center">call → purchase conversion</p>
              <p className="text-[1.45vw] text-[#6B7280] text-center leading-[1.4]">
                Research shows 8–15% for intent-based warm outreach. 10% is the conservative floor — customers have already self-identified by sharing a wishlist.
              </p>
            </div>
            <div className="mt-auto flex justify-between items-baseline pt-[1.5vh] border-t border-[#C7D2FE]">
              <p className="text-[1.5vw] text-[#374151]">Purchases / store / month</p>
              <p className="text-[1.8vw] font-bold text-[#5B21B6]">100</p>
            </div>
          </div>

          <div className="flex items-center px-[0.5vw] flex-shrink-0">
            <svg width="2.5vw" height="2.5vw" viewBox="0 0 48 48" fill="none" style={{ width: "2.5vw", height: "2.5vw" }}>
              <path d="M8 24h32M28 12l12 12-12 12" stroke="#5B21B6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col gap-[1.5vh] flex-1 rounded-sm p-[2vh_1.5vw]" style={{ background: "#111827" }}>
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#8B5CF6]">Revenue per 100 purchases</p>
            <div className="flex flex-col gap-[1.2vh] mt-[0.5vh]">
              <div className="flex justify-between items-baseline border-b border-[#374151] pb-[1vh]">
                <div>
                  <p className="text-[1.6vw] text-[#9CA3AF]">50 on bank card</p>
                  <p className="text-[1.35vw] text-[#6B7280]">~$900 ATV</p>
                </div>
                <p className="text-[1.7vw] font-bold text-white">$45,000</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#374151] pb-[1vh]">
                <div>
                  <p className="text-[1.6vw] text-[#9CA3AF]">50 on Zales credit</p>
                  <p className="text-[1.35vw] text-[#6B7280]">~$2,000 ATV</p>
                </div>
                <p className="text-[1.7vw] font-bold text-white">$100,000</p>
              </div>
              <div className="flex justify-between items-baseline pt-[0.5vh]">
                <p className="text-[1.6vw] font-bold text-[#E9D5FF]">Total</p>
                <p className="text-[2.4vw] font-bold text-white">$145,000</p>
              </div>
            </div>
            <p className="text-[1.35vw] text-[#6B7280] leading-[1.4] mt-auto">
              50% credit mix reflects Signet's stated sales target. Blended ATV: $1,450.
            </p>
          </div>
        </div>

        <div className="mt-[2vh] flex items-center gap-[2vw]">
          <p className="text-[1.25vw] text-[#9CA3AF]">
            Sources: 10-call/day outreach requirement · Signet 50% credit-sales target · $900 cash ATV from FY2026 Annual Report (SIG-FY26-AR) · 10% conversion conservative vs. McKinsey / NRF intent-based warm outreach benchmarks (8–15%)
          </p>
        </div>

        <div className="flex justify-between items-end mt-[2vh] pt-[1.5vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">10 / 14</p>
        </div>
      </div>
    </div>
  );
}
