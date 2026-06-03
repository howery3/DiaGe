export default function Slide06Corporate() {
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
          Signet's corporate team sees a cross-banner customer view no individual banner can produce
        </h1>
        <p className="mt-[1.5vh] text-[1.8vw] text-[#6B7280]">
          DiaGe Corporate Dashboard · enterprise-tier capabilities
        </p>

        <div className="mt-[4vh] grid grid-cols-2 gap-x-[4vw] gap-y-[3vh] flex-1">
          <div className="flex flex-col gap-[1vh]">
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase" style={{ color: "#5B21B6" }}>
              Revenue attribution
            </p>
            <p className="text-[1.85vw] text-[#374151] leading-[1.45]">
              Tracks DiaGe-referred visits that convert to sales, by banner — providing a direct line between the app and the register.
            </p>
          </div>

          <div className="flex flex-col gap-[1vh]">
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase" style={{ color: "#5B21B6" }}>
              Cross-banner intelligence
            </p>
            <p className="text-[1.85vw] text-[#374151] leading-[1.45]">
              Identifies customers actively shopping Kay, Zales, Jared, and Banter simultaneously. Only DiaGe has this view — no individual banner can see it.
            </p>
          </div>

          <div className="flex flex-col gap-[1vh] pt-[2vh] border-t border-[#E5E7EB]">
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase" style={{ color: "#5B21B6" }}>
              Diamond Bond risk monitoring
            </p>
            <p className="text-[1.85vw] text-[#374151] leading-[1.45]">
              Surfaces customers approaching or past their inspection deadline across the full store network — before plans lapse and relationships are lost.
            </p>
          </div>

          <div className="flex flex-col gap-[1vh] pt-[2vh] border-t border-[#E5E7EB]">
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase" style={{ color: "#5B21B6" }}>
              Time-to-appointment
            </p>
            <p className="text-[1.85vw] text-[#374151] leading-[1.45]">
              Measures days from wishlist share to in-store visit. DiaGe customers arrive in{" "}
              <span className="font-bold text-[#111827]">3–6 days</span>
              {" "}vs. the 14–21 day industry baseline.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">6 / 10</p>
        </div>
      </div>
    </div>
  );
}
