export default function Slide02CoreArgument() {
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
          DiaGe turns passive jewelry owners into active Signet customers
        </h1>

        <div className="mt-[4.5vh] flex flex-col gap-[3vh] flex-1">
          <div className="flex gap-[2vw] items-start">
            <div className="mt-[0.6vh] w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0" style={{ minWidth: "0.4vw", marginTop: "0.9vh" }} />
            <p className="text-[2vw] text-[#111827] leading-[1.45]">
              Signet customers buy once, then disappear — DiaGe gives them a reason to stay engaged between purchases
            </p>
          </div>
          <div className="flex gap-[2vw] items-start">
            <div className="mt-[0.6vh] w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0" style={{ minWidth: "0.4vw", marginTop: "0.9vh" }} />
            <p className="text-[2vw] text-[#111827] leading-[1.45]">
              Stores have no visibility into what customers want until they walk through the door — DiaGe sends purchase-intent signals before the visit
            </p>
          </div>
          <div className="flex gap-[2vw] items-start">
            <div className="mt-[0.6vh] w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0" style={{ minWidth: "0.4vw", marginTop: "0.9vh" }} />
            <p className="text-[2vw] text-[#111827] leading-[1.45]">
              Diamond Bond inspections lapse when customers forget — DiaGe's reminders keep plans active and customers returning
            </p>
          </div>
          <div className="flex gap-[2vw] items-start">
            <div className="mt-[0.6vh] w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0" style={{ minWidth: "0.4vw", marginTop: "0.9vh" }} />
            <p className="text-[2vw] text-[#111827] leading-[1.45]">
              At{" "}
              <span className="font-bold" style={{ color: "#5B21B6" }}>$369/month per location</span>
              {" "}— the cost of one lifetime protection plan sale — DiaGe pays for itself before a single incremental sale is counted
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">2 / 10</p>
        </div>
      </div>
    </div>
  );
}
