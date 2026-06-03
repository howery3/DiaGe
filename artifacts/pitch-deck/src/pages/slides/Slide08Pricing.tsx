export default function Slide08Pricing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div
        className="absolute top-0 left-0 h-[0.6vh] w-full"
        style={{ background: "#5B21B6" }}
      />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          The monthly cost equals one lifetime protection plan sale per location
        </h1>

        <div className="mt-[4vh] flex gap-[5vw] flex-1">
          <div className="flex flex-col gap-[2.5vh] flex-1">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280]">
              Per-location pricing
            </p>

            <div className="flex flex-col gap-[2vh]">
              <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1.5vh]">
                <p className="text-[1.9vw] text-[#374151]">Monthly (month-to-month)</p>
                <p className="text-[2.2vw] font-bold text-[#111827]">$369 / mo</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1.5vh]">
                <p className="text-[1.9vw] text-[#374151]">Annual (15% discount)</p>
                <p className="text-[2.2vw] font-bold text-[#111827]">$314 / mo</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1.5vh]">
                <p className="text-[1.9vw] text-[#374151]">Break-even</p>
                <p className="text-[1.9vw] text-[#374151]">1 lifetime protection plan on one $2,000 bridal sale</p>
              </div>
            </div>

            <p className="text-[1.75vw] text-[#6B7280] leading-[1.45]">
              Every DiaGe-referred transaction beyond break-even is unencumbered upside.
            </p>
          </div>

          <div
            className="w-[0.5px] bg-[#E5E7EB] flex-shrink-0"
          />

          <div className="flex flex-col gap-[2.5vh] w-[38%] flex-shrink-0">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280]">
              Network economics · full rollout
            </p>
            <p className="text-[1.6vw] text-[#9CA3AF]">2,800 Signet locations</p>

            <div className="flex flex-col gap-[2vh] mt-[1vh]">
              <div>
                <p className="text-[1.5vw] text-[#6B7280]">Monthly run rate</p>
                <p className="text-[3.2vw] font-bold" style={{ color: "#5B21B6" }}>$1.03M</p>
              </div>
              <div>
                <p className="text-[1.5vw] text-[#6B7280]">Annual (month-to-month)</p>
                <p className="text-[3.2vw] font-bold" style={{ color: "#5B21B6" }}>$12.4M</p>
              </div>
              <div>
                <p className="text-[1.5vw] text-[#6B7280]">Annual (15% discount)</p>
                <p className="text-[2.4vw] font-bold text-[#111827]">$10.6M</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">8 / 10</p>
        </div>
      </div>
    </div>
  );
}
