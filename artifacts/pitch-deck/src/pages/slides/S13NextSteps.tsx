export default function S13NextSteps() {
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
          The proposed next step is a signed 90-day pilot agreement across 10 locations
        </h1>

        <div className="mt-[4.5vh] flex gap-[5vw] flex-1">
          <div className="flex flex-col gap-[2.5vh] flex-1">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280]">
              What we are asking for
            </p>
            <div className="flex flex-col gap-[2vh]">
              <div className="flex gap-[1.5vw] items-start">
                <div className="w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0 mt-[0.9vh]" style={{ minWidth: "0.4vw" }} />
                <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
                  A signed pilot agreement for 10 store locations across Kay and Zales
                </p>
              </div>
              <div className="flex gap-[1.5vw] items-start">
                <div className="w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0 mt-[0.9vh]" style={{ minWidth: "0.4vw" }} />
                <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
                  Introductions to the store operations and Diamond Bond program teams
                </p>
              </div>
              <div className="flex gap-[1.5vw] items-start">
                <div className="w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0 mt-[0.9vh]" style={{ minWidth: "0.4vw" }} />
                <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
                  A shared definition of success metrics before launch
                </p>
              </div>
            </div>

            <div className="mt-[2vh]">
              <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280] mb-[1.5vh]">
                Success metrics
              </p>
              <div className="flex flex-col gap-[1vh]">
                <p className="text-[1.7vw] text-[#374151] leading-[1.4]">Diamond Bond inspection compliance rate vs. control stores</p>
                <p className="text-[1.7vw] text-[#374151] leading-[1.4]">DiaGe-attributed transaction count and average order value</p>
                <p className="text-[1.7vw] text-[#374151] leading-[1.4]">Time-to-appointment for wishlist-sharing customers</p>
              </div>
            </div>
          </div>

          <div className="w-[0.5px] bg-[#D1D5DB] flex-shrink-0" />

          <div className="flex flex-col gap-[2.5vh] flex-1">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280]">
              What DiaGe commits to
            </p>
            <div className="flex flex-col gap-[2vh]">
              <div className="flex gap-[1.5vw] items-start">
                <div className="w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0 mt-[0.9vh]" style={{ minWidth: "0.4vw" }} />
                <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
                  Full onboarding within 2 weeks of agreement
                </p>
              </div>
              <div className="flex gap-[1.5vw] items-start">
                <div className="w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0 mt-[0.9vh]" style={{ minWidth: "0.4vw" }} />
                <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
                  Weekly reporting against agreed success metrics
                </p>
              </div>
              <div className="flex gap-[1.5vw] items-start">
                <div className="w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0 mt-[0.9vh]" style={{ minWidth: "0.4vw" }} />
                <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
                  A rollout recommendation memo at 60 days
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[3vh] pt-[2.5vh] border-t border-[#D1D5DB]">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[1.4vw] font-bold text-[#5B21B6]">DiaGe Inc.</p>
              <p className="text-[1.4vw] text-[#6B7280] mt-[0.3vh]">diage.app · [Founder Name] · [email]</p>
            </div>
            <p className="text-[1.3vw] text-[#9CA3AF]">13 / 13</p>
          </div>
        </div>
      </div>
    </div>
  );
}
