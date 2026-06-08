export default function S09ActIII() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden font-body flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(160deg, #1E0A3C 0%, #2D1060 100%)" }}
    >
      <div className="absolute top-0 left-0 h-[0.6vh] w-full" style={{ background: "#8B5CF6" }} />

      <div className="flex flex-col items-center text-center px-[10vw]">
        <p className="text-[1.4vw] font-bold tracking-[0.3em] uppercase text-[#A78BFA] mb-[2vh]">
          Act III
        </p>
        <h1 className="text-[5vw] font-bold text-white leading-[1.1] tracking-tight" style={{ textWrap: "balance" }}>
          The Financial Case
        </h1>
        <div className="mt-[3vh] h-[1px] w-[8vw] bg-[#8B5CF6] opacity-50" />
        <p className="mt-[2.5vh] text-[2vw] text-[#C4B5FD] leading-[1.5]" style={{ textWrap: "balance" }}>
          The ROI Signet should expect, measured in the metrics corporate actually tracks
        </p>
      </div>
    </div>
  );
}
