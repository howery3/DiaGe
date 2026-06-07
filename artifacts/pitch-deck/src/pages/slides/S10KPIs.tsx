export default function S10KPIs() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          The case for intent-driven engagement rests on well-documented retail research
        </h1>
        <p className="mt-[1.5vh] text-[1.5vw] text-[#6B7280]">
          Left: Signet today · Right: Published benchmarks for intent-driven retail programs · No DiaGe-specific data claimed
        </p>

        <div className="mt-[3.5vh] flex flex-col gap-0 flex-1">
          <div className="grid grid-cols-3 gap-0 pb-[1.5vh] mb-[1.5vh] border-b border-[#E5E7EB]">
            <p className="text-[1.3vw] font-bold tracking-[0.1em] uppercase text-[#6B7280]">Metric</p>
            <p className="text-[1.3vw] font-bold tracking-[0.1em] uppercase text-[#374151] text-right">Signet today</p>
            <p className="text-[1.3vw] font-bold tracking-[0.1em] uppercase text-[#5B21B6] text-right">Intent-driven benchmark</p>
          </div>

          <div className="grid grid-cols-3 gap-0 py-[1.8vh] border-b border-[#E5E7EB] items-center">
            <p className="text-[1.85vw] text-[#374151]">Average transaction value</p>
            <p className="text-[2vw] font-bold text-[#374151] text-right">~$900</p>
            <p className="text-[2vw] font-bold text-[#5B21B6] text-right">1.2–2.0× lift documented</p>
          </div>

          <div className="grid grid-cols-3 gap-0 py-[1.8vh] border-b border-[#E5E7EB] items-center">
            <p className="text-[1.85vw] text-[#374151]">Cold outreach → store visit rate</p>
            <p className="text-[2vw] font-bold text-[#374151] text-right">5–10%</p>
            <p className="text-[2vw] font-bold text-[#5B21B6] text-right">2–4× higher for intent-aware</p>
          </div>

          <div className="grid grid-cols-3 gap-0 py-[1.8vh] border-b border-[#E5E7EB] items-center">
            <p className="text-[1.85vw] text-[#374151]">Consultative close rate (in-store jewelry)</p>
            <p className="text-[2vw] font-bold text-[#374151] text-right">40–55%</p>
            <p className="text-[2vw] font-bold text-[#5B21B6] text-right">Holds or improves when prepared</p>
          </div>

          <div className="grid grid-cols-3 gap-0 py-[1.8vh] border-b border-[#E5E7EB] items-center">
            <p className="text-[1.85vw] text-[#374151]">Retail app 30-day retention (industry avg)</p>
            <p className="text-[2vw] font-bold text-[#374151] text-right">N/A</p>
            <p className="text-[2vw] font-bold text-[#5B21B6] text-right">~32% consumer apps</p>
          </div>

          <div className="grid grid-cols-3 gap-0 py-[1.8vh] items-center">
            <p className="text-[1.85vw] text-[#374151]">Time from outreach to in-store visit</p>
            <p className="text-[2vw] font-bold text-[#374151] text-right">14–21 days (industry)</p>
            <p className="text-[2vw] font-bold text-[#5B21B6] text-right">Shorter for high-intent leads</p>
          </div>
        </div>

        <div className="mt-[1.5vh] flex items-center gap-[1.5vw]">
          <p className="text-[1.3vw] text-[#9CA3AF]">
            Sources: Signet FY2026 Annual Report (SIG-FY26-AR) · NRF Retail Horizons · McKinsey "The Value of Getting Personalization Right" · JCK Industry Intelligence · Insider Intelligence retail app benchmarks
          </p>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">11 / 14</p>
        </div>
      </div>
    </div>
  );
}
