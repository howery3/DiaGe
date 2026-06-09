export default function S10HowYouMakeMoney() {
  const rowCls = "grid grid-cols-2 gap-[3vw] py-[1.6vh] border-b border-[#E5E7EB] items-center";
  const labelCls = "text-[1.65vw] text-[#374151]";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[6vh] pb-[5vh]">
        <p className="text-[1.1vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          The revenue mechanism · same math at every scale
        </p>
        <h1 className="mt-[0.8vh] text-[2.8vw] font-bold text-[#111827] leading-[1.15]">
          As more customers download DiaGe, more of Signet's 1,000 calls become warm
        </h1>

        {/* Column headers */}
        <div className="mt-[3vh] grid grid-cols-2 gap-[3vw] pb-[1.5vh] border-b-2 border-[#111827]">
          <div />
          <div className="grid grid-cols-2 gap-[2vw]">
            <div className="text-center">
              <p className="text-[1.1vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">Pilot today</p>
              <p className="text-[1.0vw] text-[#6B7280] mt-[0.3vh]">23 locations · 5 months · slide 14</p>
            </div>
            <div className="text-center">
              <p className="text-[1.1vw] font-bold tracking-[0.12em] uppercase text-[#111827]">Full Signet adoption</p>
              <p className="text-[1.0vw] text-[#6B7280] mt-[0.3vh]">Projection · same 10% rate</p>
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col flex-1 justify-center">

          <div className={rowCls}>
            <p className={labelCls}>Signet's monthly outreach capacity</p>
            <div className="grid grid-cols-2 gap-[2vw] text-center">
              <p className="text-[1.9vw] font-bold text-[#374151]">1,000 calls</p>
              <p className="text-[1.9vw] font-bold text-[#374151]">1,000 calls</p>
            </div>
          </div>

          <div className={rowCls}>
            <div>
              <p className={labelCls}>Contacts with DiaGe intent signal</p>
              <p className="text-[1.1vw] text-[#6B7280] mt-[0.3vh]">Saved wishlist, ring size, expiring Diamond Bond</p>
            </div>
            <div className="grid grid-cols-2 gap-[2vw] text-center">
              <p className="text-[1.9vw] font-bold text-[#5B21B6]">~200</p>
              <p className="text-[1.9vw] font-bold text-[#5B21B6]">1,000</p>
            </div>
          </div>

          <div className={rowCls}>
            <div>
              <p className={labelCls}>Conversion rate (warm contact → purchase)</p>
              <p className="text-[1.1vw] text-[#6B7280] mt-[0.3vh]">Intent-aware benchmark · NRF / McKinsey · slide 13</p>
            </div>
            <div className="grid grid-cols-2 gap-[2vw] text-center">
              <p className="text-[1.9vw] font-bold text-[#374151]">10%</p>
              <p className="text-[1.9vw] font-bold text-[#374151]">10%</p>
            </div>
          </div>

          <div className={rowCls}>
            <p className={labelCls}>DiaGe-attributed purchases / store / month</p>
            <div className="grid grid-cols-2 gap-[2vw] text-center">
              <p className="text-[2.2vw] font-bold text-[#5B21B6]">20</p>
              <p className="text-[2.2vw] font-bold text-[#5B21B6]">100</p>
            </div>
          </div>

          {/* Revenue — highlighted */}
          <div className="grid grid-cols-2 gap-[3vw] py-[2vh] mt-[1vh] rounded-sm items-center"
            style={{ background: "#111827", padding: "2vh 2vw", marginLeft: "-2vw", marginRight: "-2vw", paddingLeft: "2vw", paddingRight: "2vw" }}>
            <div>
              <p className="text-[1.65vw] font-bold text-white">Revenue / store / month</p>
              <p className="text-[1.1vw] text-[#6B7280] mt-[0.3vh]">42% × $2K credit + 58% × $900 bank card = $1,362 blended ATV · FY2026 AR p.1391</p>
            </div>
            <div className="grid grid-cols-2 gap-[2vw] text-center">
              <div>
                <p className="text-[2.8vw] font-bold text-white">$27,240</p>
                <p className="text-[1.0vw] text-[#6B7280] mt-[0.3vh]">20 × $1,362 · see slide 14</p>
              </div>
              <div>
                <p className="text-[2.8vw] font-bold text-[#8B5CF6]">$136,200</p>
                <p className="text-[1.0vw] text-[#6B7280] mt-[0.3vh]">100 × $1,362 · full call-list coverage</p>
              </div>
            </div>
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
