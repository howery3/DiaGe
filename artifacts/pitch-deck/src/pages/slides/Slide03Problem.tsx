export default function Slide03Problem() {
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
          Signet stores have no view of customer intent between purchase events
        </h1>
        <p className="mt-[1.5vh] text-[1.8vw] text-[#6B7280]">
          Three gaps in the current customer journey
        </p>

        <div className="mt-[4vh] grid grid-cols-3 gap-[3vw] flex-1">
          <div className="flex flex-col gap-[1.5vh]">
            <div
              className="text-[1.2vw] font-bold tracking-[0.12em] uppercase"
              style={{ color: "#5B21B6" }}
            >
              Gap 1
            </div>
            <p className="text-[1.9vw] font-bold text-[#111827] leading-[1.25]">
              No engagement layer between purchases
            </p>
            <p className="text-[1.75vw] text-[#374151] leading-[1.45]">
              The average jewelry customer visits a store once every 2–3 years. There is no touch between transactions — no app, no notification, no reason to return before a need arises.
            </p>
          </div>

          <div className="flex flex-col gap-[1.5vh] border-l border-[#E5E7EB] pl-[2.5vw]">
            <div
              className="text-[1.2vw] font-bold tracking-[0.12em] uppercase"
              style={{ color: "#5B21B6" }}
            >
              Gap 2
            </div>
            <p className="text-[1.9vw] font-bold text-[#111827] leading-[1.25]">
              No early warning on Diamond Bond lapses
            </p>
            <p className="text-[1.75vw] text-[#374151] leading-[1.45]">
              Associates learn a plan has lapsed only when the customer arrives for a replacement claim — not when the 6-month inspection window closes. The lapse is discovered too late to act.
            </p>
          </div>

          <div className="flex flex-col gap-[1.5vh] border-l border-[#E5E7EB] pl-[2.5vw]">
            <div
              className="text-[1.2vw] font-bold tracking-[0.12em] uppercase"
              style={{ color: "#5B21B6" }}
            >
              Gap 3
            </div>
            <p className="text-[1.9vw] font-bold text-[#111827] leading-[1.25]">
              No cross-banner intelligence
            </p>
            <p className="text-[1.75vw] text-[#374151] leading-[1.45]">
              A customer researching at Kay and Zales simultaneously is invisible to both banners. No individual banner sees the full picture — only a corporate-level view can.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-[3vh] pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">3 / 10</p>
        </div>
      </div>
    </div>
  );
}
