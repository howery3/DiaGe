export default function S10HowYouMakeMoney() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <p className="text-[1.2vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          The revenue mechanism · built on Signet's existing outreach practice
        </p>
        <h1 className="mt-[1vh] text-[3vw] font-bold text-[#111827] leading-[1.1]">
          DiaGe makes your existing calls warmer — and tells you who to call first
        </h1>

        <div className="mt-[3.5vh] flex gap-[2vw] flex-1 items-stretch">

          {/* Box 1: Signet's outreach requirement */}
          <div className="flex flex-col gap-[1.5vh] flex-[1.1] rounded-sm p-[2vh_1.5vw]" style={{ background: "#F3F0FF" }}>
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">Signet's existing outreach</p>
            <div className="flex flex-col gap-[1.2vh] mt-[0.5vh]">
              <div className="flex justify-between items-baseline border-b border-[#E0D9F7] pb-[1vh]">
                <p className="text-[1.6vw] text-[#374151]">Associates per store</p>
                <p className="text-[1.7vw] font-bold text-[#111827]">5</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E0D9F7] pb-[1vh]">
                <p className="text-[1.6vw] text-[#374151]">Calls / associate / day</p>
                <p className="text-[1.7vw] font-bold text-[#111827]">10</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E0D9F7] pb-[1vh]">
                <p className="text-[1.6vw] text-[#374151]">Working days / month</p>
                <p className="text-[1.7vw] font-bold text-[#111827]">20</p>
              </div>
              <div className="flex justify-between items-baseline pt-[0.5vh]">
                <p className="text-[1.6vw] font-bold text-[#374151]">Total calls / store / month</p>
                <p className="text-[1.9vw] font-bold text-[#5B21B6]">1,000</p>
              </div>
            </div>
            <div className="mt-auto pt-[1.5vh] border-t border-[#E0D9F7] flex flex-col gap-[0.8vh]">
              <p className="text-[1.35vw] font-bold text-[#374151]">DiaGe adds two things to every call:</p>
              <p className="text-[1.25vw] text-[#6B7280] leading-[1.4]">
                <span className="font-semibold text-[#374151]">Priority signal</span> — surfaces customers with saved wishlists or expiring Diamond Bond windows first
              </p>
              <p className="text-[1.25vw] text-[#6B7280] leading-[1.4]">
                <span className="font-semibold text-[#374151]">Warm context</span> — associate sees saved item, price, and ring size before dialing
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center flex-shrink-0">
            <svg viewBox="0 0 48 48" fill="none" style={{ width: "2.5vw", height: "2.5vw" }}>
              <path d="M8 24h32M28 12l12 12-12 12" stroke="#5B21B6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Box 2: Conversion — pilot-measured */}
          <div className="flex flex-col gap-[1.5vh] flex-1 rounded-sm p-[2vh_1.5vw]" style={{ background: "#EEF2FF" }}>
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">Conversion · pilot-measured · slide 13</p>
            <div className="flex flex-col items-center justify-center flex-1 gap-[0.8vh]">
              <p className="text-[5.5vw] font-bold text-[#5B21B6] leading-none">10%</p>
              <p className="text-[1.65vw] font-bold text-[#374151] text-center">warm contact → purchase</p>
              <div className="flex flex-col gap-[0.6vh] mt-[0.5vh] text-left w-full px-[0.5vw]">
                <p className="text-[1.25vw] text-[#6B7280] leading-[1.35]">
                  Signet cold outreach baseline: <span className="font-semibold text-[#374151]">5–10%</span> call → store visit
                </p>
                <p className="text-[1.25vw] text-[#6B7280] leading-[1.35]">
                  DiaGe intent-aware contacts: <span className="font-semibold text-[#374151]">2–4× visit lift</span>
                </p>
                <p className="text-[1.25vw] text-[#6B7280] leading-[1.35]">
                  Consultative close (in-store): <span className="font-semibold text-[#374151]">~50%</span>
                </p>
                <p className="text-[1.25vw] font-bold text-[#5B21B6] leading-[1.35] border-t border-[#C7D2FE] pt-[0.6vh] mt-[0.3vh]">
                  Blended outcome confirmed in pilot across 23 locations
                </p>
              </div>
            </div>
            <div className="flex justify-between items-baseline pt-[1.5vh] border-t border-[#C7D2FE]">
              <p className="text-[1.45vw] font-bold text-[#374151]">DiaGe purchases / store / month</p>
              <p className="text-[1.9vw] font-bold text-[#5B21B6]">20</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center flex-shrink-0">
            <svg viewBox="0 0 48 48" fill="none" style={{ width: "2.5vw", height: "2.5vw" }}>
              <path d="M8 24h32M28 12l12 12-12 12" stroke="#5B21B6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Box 3: Revenue */}
          <div className="flex flex-col gap-[1.5vh] flex-[1.1] rounded-sm p-[2vh_1.5vw]" style={{ background: "#111827" }}>
            <div className="flex items-start justify-between">
              <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#8B5CF6]">Revenue per 20 purchases</p>
              <span className="text-[1.1vw] text-[#6B7280] bg-[#1F2937] px-[0.5vw] py-[0.4vh] rounded-sm whitespace-nowrap">FY2026 AR</span>
            </div>

            <div className="flex flex-col gap-[1.2vh] mt-[0.5vh]">
              <div className="flex justify-between items-start border-b border-[#374151] pb-[1.2vh]">
                <div>
                  <p className="text-[1.6vw] text-[#D1D5DB]">8 on Zales credit</p>
                  <p className="text-[1.25vw] text-[#6B7280]">42.0% credit mix · FY2026 AR · ~$2,000 ATV</p>
                </div>
                <p className="text-[1.7vw] font-bold text-white ml-[1vw]">$16,000</p>
              </div>
              <div className="flex justify-between items-start border-b border-[#374151] pb-[1.2vh]">
                <div>
                  <p className="text-[1.6vw] text-[#D1D5DB]">12 on bank card</p>
                  <p className="text-[1.25vw] text-[#6B7280]">58.0% cash/debit · ~$900 ATV · FY2026 AR</p>
                </div>
                <p className="text-[1.7vw] font-bold text-white ml-[1vw]">$10,800</p>
              </div>
              <div className="flex justify-between items-baseline pt-[0.5vh]">
                <p className="text-[1.7vw] font-bold text-[#E9D5FF]">Total · blended ATV $1,340</p>
                <p className="text-[2.6vw] font-bold text-white">$26,800</p>
              </div>
            </div>

            <p className="text-[1.25vw] text-[#6B7280] leading-[1.4] mt-auto pt-[1.5vh] border-t border-[#374151]">
              Credit mix 42.0% sourced from Signet FY2026 Annual Report (NA payment participation table, p. 1391).
            </p>
          </div>
        </div>

        <div className="mt-[2vh] flex justify-between items-end pt-[1.5vh] border-t border-[#E5E7EB]">
          <p className="text-[1.2vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.2vw] text-[#9CA3AF]">12 / 17</p>
        </div>
      </div>
    </div>
  );
}
