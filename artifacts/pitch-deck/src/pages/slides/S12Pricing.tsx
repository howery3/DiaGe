export default function S12Pricing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          At $369/month per location, 4 incremental sales per year covers the fee — the rest is upside
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
                <p className="text-[1.85vw] text-[#374151]">Annual fee per location</p>
                <p className="text-[2.2vw] font-bold text-[#111827]">$4,428</p>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-[1.85vw] text-[#374151]">Break-even (at $1,362 blended ATV)</p>
                <p className="text-[1.85vw] font-bold text-[#009118]">4 incremental sales / year</p>
              </div>
            </div>
            <p className="text-[1.6vw] text-[#6B7280] leading-[1.45] mt-[1vh]">
              4 DiaGe-attributed sales per location per year — one per quarter — covers the full annual fee. Every sale beyond that is unencumbered margin.
            </p>
            <p className="text-[1.3vw] text-[#9CA3AF] mt-auto">
              $1,362 blended ATV: 42.0% Zales credit (~$2,000) + 58.0% bank card (~$900) · credit mix from Signet FY2026 Annual Report. Break-even assumes no margin adjustment.
            </p>
          </div>

          <div className="w-[0.5px] bg-[#E5E7EB] flex-shrink-0" />

          <div className="flex flex-col gap-[2.5vh] w-[40%] flex-shrink-0">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280]">
              Full Signet rollout · 2,582 locations
            </p>

            <div className="flex flex-col gap-[2.5vh] mt-[1vh]">
              <div>
                <p className="text-[1.5vw] text-[#6B7280]">Annual DiaGe investment</p>
                <p className="text-[2.8vw] font-bold text-[#111827]">$11.4M / yr</p>
                <p className="text-[1.3vw] text-[#9CA3AF]">$369/mo × 2,582 locations × 12</p>
              </div>

              <div className="pt-[2vh] border-t border-[#E5E7EB]">
                <p className="text-[1.5vw] text-[#6B7280]">Projected revenue · mature rollout</p>
                <p className="text-[2.8vw] font-bold text-[#5B21B6]">$845M / yr</p>
                <p className="text-[1.3vw] text-[#9CA3AF]">2,582 stores · 20 purchases/store/mo · $1,362 ATV · slide 12</p>
              </div>

              <div className="pt-[2vh] border-t border-[#E5E7EB]">
                <p className="text-[1.5vw] text-[#6B7280]">Implied return on investment</p>
                <p className="text-[3.8vw] font-bold text-[#5B21B6]">~74×</p>
                <p className="text-[1.3vw] text-[#9CA3AF]">
                  $845M attributed revenue ÷ $11.4M DiaGe investment · Year 1 rollout implies ~30×
                </p>
              </div>
            </div>

            <div
              className="mt-auto rounded-sm px-[1vw] py-[1.5vh] text-[1.3vw] leading-[1.45]"
              style={{ background: "#FEF3C7", border: "1px solid #FCD34D" }}
            >
              <span className="font-bold text-[#92400E]">These are projections, not results.</span>
              <span className="text-[#92400E]"> The pilot is specifically designed to replace these model assumptions with real Signet data.</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-[2vh] pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">13 / 14</p>
        </div>
      </div>
    </div>
  );
}
