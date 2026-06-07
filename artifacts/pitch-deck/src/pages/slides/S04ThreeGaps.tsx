export default function S04ThreeGaps() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          Three gaps compound into measurable revenue and retention loss
        </h1>

        <div className="mt-[4.5vh] grid grid-cols-3 gap-[2.5vw] flex-1">
          <div className="flex flex-col gap-[1.5vh]">
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">
              Gap 1
            </p>
            <p className="text-[1.9vw] font-bold text-[#111827] leading-[1.25]">
              No engagement layer
            </p>
            <p className="text-[1.75vw] text-[#374151] leading-[1.5]">
              Zero touchpoints between purchase events. When customers are ready to buy again, they research online, visit competitors, and may never return to Signet — and we have no way to know until the sale is already lost.
            </p>
            <div className="mt-auto pt-[2vh]">
              <p className="text-[1.5vw] font-bold text-[#111827]">2–3 years</p>
              <p className="text-[1.35vw] text-[#6B7280]">avg gap between store visits in jewelry retail</p>
            </div>
          </div>

          <div className="flex flex-col gap-[1.5vh] border-l border-[#E5E7EB] pl-[2.5vw]">
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">
              Gap 2
            </p>
            <p className="text-[1.9vw] font-bold text-[#111827] leading-[1.25]">
              Diamond Bond lapse risk
            </p>
            <p className="text-[1.75vw] text-[#374151] leading-[1.5]">
              Customers forget the 6-month inspection requirement. There's no automated reminder and no visibility into who is approaching their window — until they arrive to file a replacement claim that can no longer be honored.
            </p>
            <div className="mt-auto pt-[2vh]">
              <p className="text-[1.5vw] font-bold text-[#111827]">6 months</p>
              <p className="text-[1.35vw] text-[#6B7280]">inspection window · no automated outreach exists today</p>
            </div>
          </div>

          <div className="flex flex-col gap-[1.5vh] border-l border-[#E5E7EB] pl-[2.5vw]">
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">
              Gap 3
            </p>
            <p className="text-[1.9vw] font-bold text-[#111827] leading-[1.25]">
              No cross-banner visibility
            </p>
            <p className="text-[1.75vw] text-[#374151] leading-[1.5]">
              A customer shopping Kay, Zales, Jared, and Banter simultaneously looks like four separate strangers to four separate systems. Signet cannot see or serve that customer as one relationship.
            </p>
            <div className="mt-auto pt-[2vh]">
              <p className="text-[1.5vw] font-bold text-[#111827]">4 banners</p>
              <p className="text-[1.35vw] text-[#6B7280]">zero shared customer view across any of them</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-[2.5vh] pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">4 / 14</p>
        </div>
      </div>
    </div>
  );
}
