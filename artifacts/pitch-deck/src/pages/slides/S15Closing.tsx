export default function S15Closing() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden font-body"
      style={{ background: "linear-gradient(145deg, #1E0A4A 0%, #2D0E6B 40%, #3B0F8F 70%, #4C1D95 100%)" }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#8B5CF6]" />

      {/* Decorative circles */}
      <div className="absolute" style={{ right: "-8vw", top: "-8vh", width: "40vw", height: "40vw", borderRadius: "50%", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.12)" }} />
      <div className="absolute" style={{ right: "-4vw", top: "-4vh", width: "28vw", height: "28vw", borderRadius: "50%", background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.10)" }} />
      <div className="absolute" style={{ left: "-6vw", bottom: "-10vh", width: "32vw", height: "32vw", borderRadius: "50%", background: "rgba(109,40,217,0.10)", border: "1px solid rgba(139,92,246,0.08)" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-[10vw] pt-[12vh] pb-[8vh]">

        {/* Wordmark */}
        <div className="flex items-center gap-[1.2vw] mb-[4vh]">
          <div style={{
            width: "3.5vw", height: "3.5vw", borderRadius: "0.8vw",
            background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.15)"
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
          </div>
          <span className="text-[2.2vw] font-bold text-white tracking-[-0.01em]">DiaGe</span>
        </div>

        {/* Main message */}
        <h1 className="text-[4.2vw] font-bold text-white leading-[1.15] mb-[2vh]" style={{ maxWidth: "70vw" }}>
          Let's build this together.
        </h1>
        <p className="text-[1.8vw] text-[#C4B5FD] leading-[1.5] mb-[6vh]" style={{ maxWidth: "52vw" }}>
          The jewelry industry's first customer engagement layer built for Signet's scale — 25 stores, 90 days, one measurable outcome.
        </p>

        {/* Ask callout */}
        <div
          className="mb-[6vh]"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1.2vw",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "0.6vw",
            padding: "1.5vh 2vw",
            maxWidth: "fit-content"
          }}
        >
          <div style={{ width: "0.4vw", height: "4vh", background: "#8B5CF6", borderRadius: "2px", flexShrink: 0 }} />
          <p className="text-[1.5vw] text-white font-semibold">The ask: a signed 90-day pilot agreement across 25 Kay and Zales locations</p>
        </div>

        {/* Contact */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-[1.1vw] font-bold tracking-[0.12em] uppercase text-[#8B5CF6] mb-[1vh]">Contact</p>
            <p className="text-[1.9vw] font-bold text-white">Aiden Howery</p>
            <p className="text-[1.5vw] text-[#C4B5FD] mt-[0.4vh]">aiden@diage.app</p>
            <p className="text-[1.5vw] text-[#A78BFA] mt-[0.2vh]">diage.app</p>
          </div>

          <div className="text-right">
            <p className="text-[1.0vw] text-[#6B46AC]">DiaGe · Confidential · June 2026</p>
            <p className="text-[1.0vw] text-[#6B46AC] mt-[0.3vh]">18 / 18</p>
          </div>
        </div>
      </div>
    </div>
  );
}
