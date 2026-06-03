export default function Slide09Pilot() {
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
          A 10-store pilot tests the model with three measurable success metrics
        </h1>
        <p className="mt-[1.5vh] text-[1.8vw] text-[#6B7280]">
          Scope: 10 locations across Kay and Zales · 90-day term
        </p>

        <div className="mt-[4vh] flex gap-[5vw] flex-1">
          <div className="flex flex-col gap-[2.5vh] flex-1">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280]">
              Success metrics
            </p>

            <div className="flex flex-col gap-[2.5vh]">
              <div className="flex gap-[2vw] items-start">
                <div
                  className="flex-shrink-0 flex items-center justify-center text-[1.4vw] font-bold text-white rounded-full"
                  style={{ width: "3vw", height: "3vw", minWidth: "3vw", background: "#5B21B6" }}
                >
                  1
                </div>
                <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
                  Diamond Bond inspection compliance rate vs. control stores
                </p>
              </div>
              <div className="flex gap-[2vw] items-start">
                <div
                  className="flex-shrink-0 flex items-center justify-center text-[1.4vw] font-bold text-white rounded-full"
                  style={{ width: "3vw", height: "3vw", minWidth: "3vw", background: "#5B21B6" }}
                >
                  2
                </div>
                <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
                  DiaGe-attributed transaction count and average order value
                </p>
              </div>
              <div className="flex gap-[2vw] items-start">
                <div
                  className="flex-shrink-0 flex items-center justify-center text-[1.4vw] font-bold text-white rounded-full"
                  style={{ width: "3vw", height: "3vw", minWidth: "3vw", background: "#5B21B6" }}
                >
                  3
                </div>
                <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
                  Time-to-appointment for customers who shared a wishlist with the store
                </p>
              </div>
            </div>
          </div>

          <div
            className="w-[0.5px] bg-[#E5E7EB] flex-shrink-0"
          />

          <div className="flex flex-col gap-[2vh] w-[36%] flex-shrink-0">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280]">
              DiaGe provides
            </p>
            <div className="flex flex-col gap-[1.5vh]">
              <div className="flex gap-[1.2vw] items-start">
                <div className="w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0" style={{ minWidth: "0.4vw", marginTop: "0.9vh" }} />
                <p className="text-[1.75vw] text-[#374151] leading-[1.45]">Full onboarding and associate training materials</p>
              </div>
              <div className="flex gap-[1.2vw] items-start">
                <div className="w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0" style={{ minWidth: "0.4vw", marginTop: "0.9vh" }} />
                <p className="text-[1.75vw] text-[#374151] leading-[1.45]">Dedicated partner support at no additional charge</p>
              </div>
              <div className="flex gap-[1.2vw] items-start">
                <div className="w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] flex-shrink-0" style={{ minWidth: "0.4vw", marginTop: "0.9vh" }} />
                <p className="text-[1.75vw] text-[#374151] leading-[1.45]">Signet retains all customer relationship data</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">9 / 10</p>
        </div>
      </div>
    </div>
  );
}
