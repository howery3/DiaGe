export default function S11PilotRevenue() {
  const months = [
    { month: "Jan", revenue: 284, height: 16 },
    { month: "Feb", revenue: 412, height: 23 },
    { month: "Mar", revenue: 581, height: 33 },
    { month: "Apr", revenue: 798, height: 45 },
    { month: "May", revenue: 767, height: 43 },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          The pilot has already generated $2.84M in attributed revenue across 4 Signet banners
        </h1>
        <p className="mt-[1.5vh] text-[1.5vw] text-[#6B7280]">
          Jan–May 2026 · 23 pilot locations · revenue figures represent confirmed in-store purchases from DiaGe-referred leads
        </p>

        <div className="mt-[3.5vh] flex gap-[4vw] flex-1">
          <div className="flex flex-col gap-[2.5vh] flex-1">
            <div className="flex flex-col gap-[2vh]">
              <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1.5vh]">
                <p className="text-[1.85vw] text-[#374151]">Total DiaGe-attributed revenue</p>
                <p className="text-[2.4vw] font-bold text-[#5B21B6]">$2.84M</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1.5vh]">
                <p className="text-[1.85vw] text-[#374151]">Monthly run rate growth</p>
                <p className="text-[2.4vw] font-bold text-[#009118]">+171% MoM</p>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1.5vh]">
                <p className="text-[1.85vw] text-[#374151]">Orders attributed (Kay, Jared, Zales, Banter)</p>
                <p className="text-[2.4vw] font-bold text-[#111827]">1,343</p>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-[1.85vw] text-[#374151]">Diamond Bond value at risk — network-wide</p>
                <p className="text-[2.4vw] font-bold text-[#DC2626]">$12.8M</p>
              </div>
            </div>

            <div className="mt-auto p-[1.5vh_1.5vw] rounded-sm" style={{ background: "#F3F0FF" }}>
              <p className="text-[1.6vw] font-bold text-[#5B21B6]">Full Signet projection</p>
              <p className="text-[1.6vw] text-[#374151] mt-[0.4vh]">
                18% adoption · 2,800 locations → <span className="font-bold">$290M+ attributed revenue / year</span>
              </p>
            </div>
          </div>

          <div className="w-[0.5px] bg-[#E5E7EB] flex-shrink-0" />

          <div className="flex flex-col gap-[1.5vh] w-[36%] flex-shrink-0">
            <p className="text-[1.3vw] font-bold tracking-[0.12em] uppercase text-[#6B7280]">
              Monthly attributed revenue ($K)
            </p>
            <div className="flex-1 flex items-end gap-[1.2vw] pt-[2vh]">
              {months.map((m) => (
                <div key={m.month} className="flex flex-col items-center gap-[0.8vh] flex-1">
                  <p className="text-[1.3vw] font-bold text-[#5B21B6]">${m.revenue}K</p>
                  <div
                    className="w-full rounded-t-sm"
                    style={{ height: `${m.height}vh`, background: "#5B21B6", opacity: m.month === "Apr" ? 1 : 0.65 }}
                  />
                  <p className="text-[1.3vw] text-[#6B7280]">{m.month}</p>
                </div>
              ))}
            </div>
            <p className="text-[1.2vw] text-[#9CA3AF]">May is a partial month</p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-[2vh] pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">11 / 13</p>
        </div>
      </div>
    </div>
  );
}
