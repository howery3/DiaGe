export default function S10KPIs() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          DiaGe users spend 2.3× more per transaction and convert at 5× the industry rate
        </h1>
        <p className="mt-[1.5vh] text-[1.5vw] text-[#6B7280]">
          Source: DiaGe pilot data, Jan–May 2026 · 23 partner retail locations
        </p>

        <div className="mt-[3.5vh] flex flex-col gap-0 flex-1">
          <div className="grid grid-cols-3 gap-0 pb-[1.5vh] mb-[1.5vh] border-b border-[#E5E7EB]">
            <p className="text-[1.3vw] font-bold tracking-[0.1em] uppercase text-[#6B7280]">Metric</p>
            <p className="text-[1.3vw] font-bold tracking-[0.1em] uppercase text-[#5B21B6] text-right">DiaGe</p>
            <p className="text-[1.3vw] font-bold tracking-[0.1em] uppercase text-[#6B7280] text-right">Industry avg</p>
          </div>

          <div className="grid grid-cols-3 gap-0 py-[1.8vh] border-b border-[#E5E7EB] items-center">
            <p className="text-[1.85vw] text-[#374151]">Average transaction value</p>
            <p className="text-[2.2vw] font-bold text-[#5B21B6] text-right">$2,847</p>
            <p className="text-[1.85vw] text-[#6B7280] text-right">$1,240 Signet avg · $890 retail avg</p>
          </div>

          <div className="grid grid-cols-3 gap-0 py-[1.8vh] border-b border-[#E5E7EB] items-center">
            <p className="text-[1.85vw] text-[#374151]">Wishlist lead → purchase rate</p>
            <p className="text-[2.2vw] font-bold text-[#5B21B6] text-right">31%</p>
            <p className="text-[1.85vw] text-[#6B7280] text-right">1–4% for retail apps</p>
          </div>

          <div className="grid grid-cols-3 gap-0 py-[1.8vh] border-b border-[#E5E7EB] items-center">
            <p className="text-[1.85vw] text-[#374151]">Lead contact → in-store visit</p>
            <p className="text-[2.2vw] font-bold text-[#5B21B6] text-right">68%</p>
            <p className="text-[1.85vw] text-[#6B7280] text-right">22% industry average</p>
          </div>

          <div className="grid grid-cols-3 gap-0 py-[1.8vh] border-b border-[#E5E7EB] items-center">
            <p className="text-[1.85vw] text-[#374151]">30-day user retention</p>
            <p className="text-[2.2vw] font-bold text-[#5B21B6] text-right">68%</p>
            <p className="text-[1.85vw] text-[#6B7280] text-right">32% consumer app average</p>
          </div>

          <div className="grid grid-cols-3 gap-0 py-[1.8vh] items-center">
            <p className="text-[1.85vw] text-[#374151]">Time-to-appointment</p>
            <p className="text-[2.2vw] font-bold text-[#5B21B6] text-right">3–6 days</p>
            <p className="text-[1.85vw] text-[#6B7280] text-right">14–21 days baseline</p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">11 / 14</p>
        </div>
      </div>
    </div>
  );
}
