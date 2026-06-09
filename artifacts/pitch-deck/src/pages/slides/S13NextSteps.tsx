export default function S13NextSteps() {
  const asks = [
    "A signed pilot agreement for 25 store locations across Kay and Zales",
    "Introductions to the store operations and Diamond Bond program teams",
    "A shared definition of success metrics before launch",
  ];

  const commits = [
    { label: "Full onboarding", timeline: "Within 2 weeks of agreement" },
    { label: "Weekly reporting", timeline: "Against agreed success metrics" },
    { label: "Rollout memo", timeline: "At 60 days — go or no-go recommendation" },
  ];

  const metrics = [
    "Diamond Bond compliance rate vs. control stores",
    "DiaGe-attributed transaction count + avg order value",
    "Time-to-appointment for wishlist-sharing customers",
  ];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden font-body"
      style={{ background: "linear-gradient(145deg, #1E0A4A 0%, #2D0E6B 40%, #3B0F8F 70%, #4C1D95 100%)" }}
    >
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#8B5CF6]" />

      {/* Decorative rings */}
      <div className="absolute" style={{ right: "-6vw", bottom: "-6vh", width: "30vw", height: "30vw", borderRadius: "50%", border: "1px solid rgba(139,92,246,0.12)" }} />
      <div className="absolute" style={{ right: "-3vw", bottom: "-3vh", width: "20vw", height: "20vw", borderRadius: "50%", border: "1px solid rgba(139,92,246,0.09)" }} />

      <div className="relative z-10 flex flex-col h-full px-[7vw] pt-[5.5vh] pb-[3.5vh]">
        {/* Header */}
        <div className="mb-[3vh]">
          <p className="text-[1.0vw] font-bold tracking-[0.18em] uppercase text-[#C4B5FD]">The ask · 90-day pilot</p>
          <h1 className="mt-[0.5vh] text-[2.6vw] font-bold text-white leading-[1.2]">
            The proposed next step is a signed 90-day pilot agreement across 25 locations
          </h1>
        </div>

        {/* Main grid */}
        <div className="grid gap-[2.5vw] flex-1" style={{ gridTemplateColumns: "1fr 1px 1fr" }}>
          {/* Left: what we ask */}
          <div className="flex flex-col gap-[2vh]">
            <p className="text-[1.0vw] font-bold tracking-[0.16em] uppercase text-[#A78BFA]">What we are asking for</p>

            <div className="flex flex-col gap-[1.5vh]">
              {asks.map((a, i) => (
                <div
                  key={i}
                  className="flex gap-[1.2vw] items-start p-[1.4vh_1.4vw] rounded-sm"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold"
                    style={{ width: "2vw", height: "2vw", minWidth: "2vw", background: "#5B21B6", fontSize: "1.0vw" }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-[1.55vw] text-white leading-[1.45]">{a}</p>
                </div>
              ))}
            </div>

            {/* Success metrics */}
            <div className="mt-[1vh]">
              <p className="text-[1.0vw] font-bold tracking-[0.14em] uppercase text-[#A78BFA] mb-[1.2vh]">Success metrics we'll measure together</p>
              <div className="flex flex-col gap-[0.8vh]">
                {metrics.map((m, i) => (
                  <div key={i} className="flex items-center gap-[1vw]">
                    <div className="w-[0.4vw] h-[0.4vw] rounded-full bg-[#8B5CF6] flex-shrink-0" />
                    <p className="text-[1.35vw] text-[#C4B5FD]">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* Right: what DiaGe commits to */}
          <div className="flex flex-col gap-[2vh]">
            <p className="text-[1.0vw] font-bold tracking-[0.16em] uppercase text-[#A78BFA]">What DiaGe commits to</p>

            <div className="flex flex-col gap-[1.8vh]">
              {commits.map((c, i) => (
                <div
                  key={i}
                  className="flex gap-[1.5vw] items-start p-[1.4vh_1.4vw] rounded-sm"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-sm"
                    style={{ width: "2vw", height: "2vw", minWidth: "2vw", background: "rgba(139,92,246,0.3)", border: "1px solid rgba(139,92,246,0.5)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <polyline points="2,6.5 5,9.5 10,3" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[1.55vw] font-bold text-white">{c.label}</p>
                    <p className="text-[1.25vw] text-[#C4B5FD] mt-[0.2vh]">{c.timeline}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline strip */}
            <div className="mt-auto p-[1.5vh_1.5vw] rounded-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-[1.0vw] font-bold tracking-[0.12em] uppercase text-[#A78BFA] mb-[1.2vh]">Pilot timeline</p>
              <div className="flex items-center gap-[0]">
                {[
                  { day: "Day 0", label: "Agreement signed" },
                  { day: "Week 2", label: "Stores onboarded" },
                  { day: "Day 60", label: "Rollout memo" },
                  { day: "Day 90", label: "Full review" },
                ].map((t, i, arr) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className="w-[0.7vw] h-[0.7vw] rounded-full bg-[#8B5CF6] flex-shrink-0" />
                      <p className="text-[0.9vw] font-bold text-white mt-[0.5vh] whitespace-nowrap">{t.day}</p>
                      <p className="text-[0.85vw] text-[#C4B5FD] whitespace-nowrap">{t.label}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex-1 h-[1px] bg-[rgba(139,92,246,0.35)] mx-[0.5vw]" style={{ marginBottom: "2.8vh" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-[1.5vh] mt-[1.5vh]" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div>
            <p className="text-[1.2vw] font-bold text-white">DiaGe Inc.</p>
            <p className="text-[1.1vw] text-[#C4B5FD]">diage.app · Aiden Howery</p>
          </div>
          <p className="text-[1.1vw] text-[#6B46AC]">17 / 18</p>
        </div>
      </div>
    </div>
  );
}
