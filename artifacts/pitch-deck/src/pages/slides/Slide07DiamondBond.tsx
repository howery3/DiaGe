export default function Slide07DiamondBond() {
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
          Diamond Bond compliance is a retention risk that scales with store count
        </h1>
        <p className="mt-[1.5vh] text-[1.8vw] text-[#6B7280]">
          How the problem compounds across 2,800 locations
        </p>

        <div className="mt-[4.5vh] flex gap-[5vw] flex-1">
          <div className="flex flex-col gap-[2.8vh] flex-1">
            <div className="flex gap-[2vw] items-start">
              <div className="flex-shrink-0 w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6]" style={{ minWidth: "0.4vw", marginTop: "0.9vh" }} />
              <p className="text-[1.9vw] text-[#111827] leading-[1.45]">
                Each Diamond Bond plan requires a 6-month in-store inspection to remain active — this is the contractual condition for replacement coverage
              </p>
            </div>
            <div className="flex gap-[2vw] items-start">
              <div className="flex-shrink-0 w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6]" style={{ minWidth: "0.4vw", marginTop: "0.9vh" }} />
              <p className="text-[1.9vw] text-[#111827] leading-[1.45]">
                When a customer misses the window, the plan lapses — Signet absorbs the loss of a recurring visit and a retained customer relationship
              </p>
            </div>
            <div className="flex gap-[2vw] items-start">
              <div className="flex-shrink-0 w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6]" style={{ minWidth: "0.4vw", marginTop: "0.9vh" }} />
              <p className="text-[1.9vw] text-[#111827] leading-[1.45]">
                At scale across 2,800 doors, even a modest lapse rate represents a substantial recurring revenue and retention exposure
              </p>
            </div>
          </div>

          <div
            className="w-[0.5px] bg-[#E5E7EB] flex-shrink-0"
          />

          <div className="flex flex-col gap-[2vh] w-[32%] flex-shrink-0">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase" style={{ color: "#5B21B6" }}>
              DiaGe closes the loop
            </p>
            <div className="p-[2vh_1.8vw] rounded-sm" style={{ background: "#F3F0FF" }}>
              <p className="text-[1.75vw] text-[#374151] leading-[1.5]">
                Customers receive timely nudges before windows close. Associates are alerted to overdue accounts. The inspection rate improves without requiring any change to existing Signet systems.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">7 / 10</p>
        </div>
      </div>
    </div>
  );
}
