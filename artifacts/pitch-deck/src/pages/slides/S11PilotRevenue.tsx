export default function S11PilotRevenue() {
  const scenarios = [
    {
      label: "Conservative",
      color: "#6B7280",
      bg: "#F9FAFB",
      border: "#E5E7EB",
      adoption: "10%",
      users: "~760K",
      visitRate: "25%",
      closeRate: "40%",
      atvLift: "10%",
      revenue: "$240M",
      highlight: false,
    },
    {
      label: "Base case",
      color: "#5B21B6",
      bg: "#F3F0FF",
      border: "#C4B5FD",
      adoption: "18%",
      users: "~1.4M",
      visitRate: "35%",
      closeRate: "43%",
      atvLift: "20%",
      revenue: "$560M",
      highlight: true,
    },
    {
      label: "Optimistic",
      color: "#374151",
      bg: "#F9FAFB",
      border: "#E5E7EB",
      adoption: "25%",
      users: "~1.9M",
      visitRate: "45%",
      closeRate: "50%",
      atvLift: "30%",
      revenue: "$1.1B",
      highlight: false,
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          The financial model across three adoption scenarios
        </h1>
        <p className="mt-[1.5vh] text-[1.5vw] text-[#6B7280]">
          Forward projection · no pilot data claimed · assumptions shown explicitly · Signet addressable base: ~7.6M annual transactions · est. from FY2026 Annual Report
        </p>

        <div className="mt-[4vh] grid grid-cols-3 gap-[2vw] flex-1">
          {scenarios.map((s) => (
            <div
              key={s.label}
              className="flex flex-col rounded-sm border p-[2vh_1.5vw] gap-[2vh]"
              style={{ background: s.bg, borderColor: s.border }}
            >
              <p
                className="text-[1.3vw] font-bold tracking-[0.12em] uppercase"
                style={{ color: s.color }}
              >
                {s.label}
              </p>

              <div className="flex flex-col gap-[1.2vh]">
                <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1vh]">
                  <p className="text-[1.5vw] text-[#6B7280]">User adoption</p>
                  <p className="text-[1.6vw] font-bold text-[#111827]">{s.adoption}</p>
                </div>
                <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1vh]">
                  <p className="text-[1.5vw] text-[#6B7280]">Projected users</p>
                  <p className="text-[1.6vw] font-bold text-[#111827]">{s.users}</p>
                </div>
                <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1vh]">
                  <p className="text-[1.5vw] text-[#6B7280]">Lead → visit rate</p>
                  <p className="text-[1.6vw] font-bold text-[#111827]">{s.visitRate}</p>
                </div>
                <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1vh]">
                  <p className="text-[1.5vw] text-[#6B7280]">Visit → close rate</p>
                  <p className="text-[1.6vw] font-bold text-[#111827]">{s.closeRate}</p>
                </div>
                <div className="flex justify-between items-baseline border-b border-[#E5E7EB] pb-[1vh]">
                  <p className="text-[1.5vw] text-[#6B7280]">ATV lift (intent premium)</p>
                  <p className="text-[1.6vw] font-bold text-[#111827]">{s.atvLift}</p>
                </div>
              </div>

              <div className="mt-auto">
                <p className="text-[1.3vw] text-[#6B7280]">Modeled attributed revenue / yr</p>
                <p
                  className="text-[2.8vw] font-bold leading-none mt-[0.5vh]"
                  style={{ color: s.color }}
                >
                  {s.revenue}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[2.5vh] flex items-start gap-[1.5vw]">
          <div
            className="flex-shrink-0 rounded-sm px-[1vw] py-[1vh] text-[1.35vw] text-[#374151] leading-[1.45]"
            style={{ background: "#FEF3C7", border: "1px solid #FCD34D" }}
          >
            <span className="font-bold">Baseline: </span>Signet ATV ~$900, estimated from publicly reported FY2026 Annual Report ($6.81B revenue, 2,582 locations).
            All conversion rates are model assumptions — not measured DiaGe data.
            The pilot is the mechanism to replace model assumptions with real numbers.
          </div>
        </div>

        <div className="flex justify-between items-end mt-[2vh] pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">12 / 14</p>
        </div>
      </div>
    </div>
  );
}
