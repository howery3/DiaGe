export default function S10HowYouMakeMoney() {
  const rowCls = "grid grid-cols-2 gap-[3vw] py-[1.6vh] border-b border-[#E5E7EB] items-center";
  const labelCls = "text-[1.65vw] text-[#374151]";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[6vh] pb-[5vh]">
        <p className="text-[1.1vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          The revenue mechanism · built on Signet's existing 1,000-call outreach capacity
        </p>
        <h1 className="mt-[0.8vh] text-[2.8vw] font-bold text-[#111827] leading-[1.15]">
          As more customers download DiaGe, more of those calls become warm
        </h1>
        <p className="mt-[0.8vh] text-[1.2vw] text-[#6B7280]">
          DiaGe doesn't change how many calls associates make — it changes which calls they prioritize and what they know before dialing
        </p>

        {/* Column headers */}
        <div className="mt-[2.5vh] grid grid-cols-2 gap-[3vw] pb-[1.5vh] border-b-2 border-[#111827]">
          <div />
          <div className="grid grid-cols-2 gap-[2vw]">
            <div className="text-center">
              <p className="text-[1.1vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">Pilot phase</p>
              <p className="text-[1.0vw] text-[#6B7280] mt-[0.3vh]">~180 DiaGe users / store · 90 days</p>
            </div>
            <div className="text-center">
              <p className="text-[1.1vw] font-bold tracking-[0.12em] uppercase text-[#111827]">Mature state</p>
              <p className="text-[1.0vw] text-[#6B7280] mt-[0.3vh]">~1,500 DiaGe users / store · yr 3+</p>
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col flex-1 justify-center">

          <div className={rowCls}>
            <div>
              <p className={labelCls}>Active DiaGe wishlist signals / month</p>
              <p className="text-[1.1vw] text-[#6B7280] mt-[0.3vh]">15% of DiaGe users share a wishlist in any given month</p>
            </div>
            <div className="grid grid-cols-2 gap-[2vw] text-center">
              <p className="text-[1.9vw] font-bold text-[#5B21B6]">~27</p>
              <p className="text-[1.9vw] font-bold text-[#5B21B6]">~225</p>
            </div>
          </div>

          <div className={rowCls}>
            <div>
              <p className={labelCls}>Conversion rate (warm call → purchase)</p>
              <p className="text-[1.1vw] text-[#6B7280] mt-[0.3vh]">
                Cold baseline: 5–10% visit × 40–55% close = 2–5% end-to-end · DiaGe target: 10% direct · NRF / McKinsey
              </p>
            </div>
            <div className="grid grid-cols-2 gap-[2vw] text-center">
              <p className="text-[1.9vw] font-bold text-[#374151]">10%</p>
              <p className="text-[1.9vw] font-bold text-[#374151]">10%</p>
            </div>
          </div>

          <div className={rowCls}>
            <p className={labelCls}>DiaGe-attributed purchases / store / month</p>
            <div className="grid grid-cols-2 gap-[2vw] text-center">
              <p className="text-[2.2vw] font-bold text-[#5B21B6]">~3</p>
              <p className="text-[2.2vw] font-bold text-[#5B21B6]">~20</p>
            </div>
          </div>

          {/* Revenue — highlighted */}
          <div
            className="grid grid-cols-2 gap-[3vw] mt-[1.5vh] rounded-sm items-center"
            style={{ background: "#111827", padding: "2vh 2vw", marginLeft: "-2vw", marginRight: "-2vw", paddingLeft: "2vw", paddingRight: "2vw" }}
          >
            <div>
              <p className="text-[1.65vw] font-bold text-white">Revenue / store / month</p>
              <p className="text-[1.1vw] text-[#6B7280] mt-[0.3vh]">42% × $2K credit + 58% × $900 bank card = $1,362 blended ATV · FY2026 AR p.1391</p>
            </div>
            <div className="grid grid-cols-2 gap-[2vw] text-center">
              <div>
                <p className="text-[2.8vw] font-bold text-white">~$4,100</p>
                <p className="text-[1.0vw] text-[#6B7280] mt-[0.3vh]">3 × $1,362 · pilot phase</p>
              </div>
              <div>
                <p className="text-[2.8vw] font-bold text-[#8B5CF6]">$27,240</p>
                <p className="text-[1.0vw] text-[#6B7280] mt-[0.3vh]">20 × $1,362 · mature state</p>
              </div>
            </div>
          </div>

          {/* Context bar */}
          <div className="mt-[1.5vh] rounded-sm px-[1.5vw] py-[0.8vh]" style={{ background: "#F3F0FF", border: "1px solid #C4B5FD" }}>
            <p className="text-[1.1vw] text-[#374151]">
              <span className="font-bold text-[#5B21B6]">Infrastructure already in place: </span>
              Signet associates make 1,000 outreach calls / store / month today. DiaGe surfaces which of those contacts to prioritize and what to say — no new workflow required.
            </p>
          </div>

        </div>

        <div className="flex justify-between items-end pt-[1.5vh] border-t border-[#E5E7EB]">
          <p className="text-[1.1vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.1vw] text-[#9CA3AF]">12 / 17</p>
        </div>
      </div>
    </div>
  );
}
