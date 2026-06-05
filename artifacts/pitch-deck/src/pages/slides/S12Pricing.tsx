export default function S12Pricing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          At $369/month per location, DiaGe pays for itself on one bridal sale — every sale after is upside
        </h1>

        <div className="mt-[4vh] flex gap-[5vw] flex-1">
          <div className="flex flex-col gap-[2.5vh] flex-1">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280]">
              Per-location pricing
            </p>
            <div className="flex flex-col gap-[2vh]">
              <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1.5vh]">
                <p className="text-[1.85vw] text-[#374151]">Monthly (no commitment)</p>
                <p className="text-[2.2vw] font-bold text-[#111827]">$369 / mo</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1.5vh]">
                <p className="text-[1.85vw] text-[#374151]">Annual (15% discount)</p>
                <p className="text-[2.2vw] font-bold text-[#111827]">$314 / mo</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1.5vh]">
                <p className="text-[1.85vw] text-[#374151]">Break-even</p>
                <p className="text-[1.85vw] text-[#374151]">1 protection plan on a $2,000 bridal sale</p>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-[1.85vw] text-[#374151]">Payback period at pilot rates</p>
                <p className="text-[1.85vw] font-bold text-[#009118]">Sub-30 days</p>
              </div>
            </div>
            <p className="text-[1.6vw] text-[#6B7280] leading-[1.45] mt-[1vh]">
              Every DiaGe-referred transaction beyond break-even is unencumbered upside.
            </p>
            <p className="text-[1.3vw] text-[#9CA3AF] mt-auto">
              Source: DiaGe pricing schedule. Projection based on pilot conversion rates scaled to 2,800 locations.
            </p>
          </div>

          <div className="w-[0.5px] bg-[#E5E7EB] flex-shrink-0" />

          <div className="flex flex-col gap-[2vh] w-[40%] flex-shrink-0">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280]">
              Full Signet rollout · 2,800 locations
            </p>

            <div className="flex flex-col gap-[2.5vh] mt-[1vh]">
              <div>
                <p className="text-[1.5vw] text-[#6B7280]">Annual investment (DiaGe fee)</p>
                <p className="text-[2.8vw] font-bold text-[#111827]">$12.4M / yr</p>
              </div>
              <div>
                <p className="text-[1.5vw] text-[#6B7280]">Projected attributed revenue</p>
                <p className="text-[2.8vw] font-bold text-[#5B21B6]">$290M+ / yr</p>
              </div>
              <div className="pt-[2vh] border-t border-[#E5E7EB]">
                <p className="text-[1.5vw] text-[#6B7280]">Return on DiaGe investment</p>
                <p className="text-[3.8vw] font-bold text-[#5B21B6]">~28×</p>
                <p className="text-[1.4vw] text-[#6B7280]">annual spend</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-[2vh] pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">12 / 13</p>
        </div>
      </div>
    </div>
  );
}
