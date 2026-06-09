export default function S14FullCircle() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden font-body"
      style={{ background: "linear-gradient(160deg, #F3F0FF 0%, #FAFAFA 60%)" }}
    >
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          Three gaps. One platform. All of it measurable.
        </h1>
        <p className="mt-[1.5vh] text-[1.5vw] text-[#6B7280]">
          Every problem raised at the start has a direct answer and a metric to prove it in the pilot
        </p>

        <div className="mt-[4vh] flex gap-0 flex-1 divide-x divide-[#D1D5DB]">
          <div className="flex flex-col gap-[2vh] flex-1 pr-[3vw]">
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">Gap 1</p>
            <p className="text-[1.9vw] font-bold text-[#111827] leading-[1.25]">
              A contact record is not a shopping signal
            </p>
            <div className="flex flex-col gap-[1.5vh]">
              <div>
                <p className="text-[1.2vw] font-bold tracking-[0.1em] uppercase text-[#9CA3AF] mb-[0.5vh]">Before</p>
                <p className="text-[1.6vw] text-[#6B7280] leading-[1.4]">
                  Associates call with no context. Customers ignore it. The intent lives on a device Signet never sees.
                </p>
              </div>
              <div>
                <p className="text-[1.2vw] font-bold tracking-[0.1em] uppercase text-[#5B21B6] mb-[0.5vh]">After</p>
                <p className="text-[1.6vw] text-[#374151] leading-[1.4]">
                  Customer shares a wishlist. Associate calls with the item, price, and ring size already in hand.
                </p>
              </div>
            </div>
            <div className="mt-auto pt-[2vh] border-t border-[#E5E7EB]">
              <p className="text-[1.5vw] font-bold text-[#111827]">Pilot metric</p>
              <p className="text-[1.35vw] text-[#6B7280]">DiaGe-attributed transaction count vs. control stores</p>
            </div>
          </div>

          <div className="flex flex-col gap-[2vh] flex-1 px-[3vw]">
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">Gap 2</p>
            <p className="text-[1.9vw] font-bold text-[#111827] leading-[1.25]">
              Diamond Bond lapse and lost paperwork
            </p>
            <div className="flex flex-col gap-[1.5vh]">
              <div>
                <p className="text-[1.2vw] font-bold tracking-[0.1em] uppercase text-[#9CA3AF] mb-[0.5vh]">Before</p>
                <p className="text-[1.6vw] text-[#6B7280] leading-[1.4]">
                  Plans lapse silently. Claims get denied. Guests blame the store. Associates search paper records.
                </p>
              </div>
              <div>
                <p className="text-[1.2vw] font-bold tracking-[0.1em] uppercase text-[#5B21B6] mb-[0.5vh]">After</p>
                <p className="text-[1.6vw] text-[#374151] leading-[1.4]">
                  Automated reminders prevent lapses. The digital vault eliminates the lost receipt conversation entirely.
                </p>
              </div>
            </div>
            <div className="mt-auto pt-[2vh] border-t border-[#E5E7EB]">
              <p className="text-[1.5vw] font-bold text-[#111827]">Pilot metric</p>
              <p className="text-[1.35vw] text-[#6B7280]">Diamond Bond inspection compliance rate vs. control stores</p>
            </div>
          </div>

          <div className="flex flex-col gap-[2vh] flex-1 pl-[3vw]">
            <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">Gap 3</p>
            <p className="text-[1.9vw] font-bold text-[#111827] leading-[1.25]">
              No cross-banner visibility
            </p>
            <div className="flex flex-col gap-[1.5vh]">
              <div>
                <p className="text-[1.2vw] font-bold tracking-[0.1em] uppercase text-[#9CA3AF] mb-[0.5vh]">Before</p>
                <p className="text-[1.6vw] text-[#6B7280] leading-[1.4]">
                  A customer shopping Kay, Zales, and Jared at the same time looks like three separate strangers.
                </p>
              </div>
              <div>
                <p className="text-[1.2vw] font-bold tracking-[0.1em] uppercase text-[#5B21B6] mb-[0.5vh]">After</p>
                <p className="text-[1.6vw] text-[#374151] leading-[1.4]">
                  One customer profile, visible across all banners. Corporate sees the full relationship for the first time.
                </p>
              </div>
            </div>
            <div className="mt-auto pt-[2vh] border-t border-[#E5E7EB]">
              <p className="text-[1.5vw] font-bold text-[#111827]">Pilot metric</p>
              <p className="text-[1.35vw] text-[#6B7280]">Cross-banner customers identified and served as one relationship</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-[2vh] pt-[2vh] border-t border-[#D1D5DB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">15 / 16</p>
        </div>
      </div>
    </div>
  );
}
