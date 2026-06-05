export default function S01Cover() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden font-body"
      style={{ background: "linear-gradient(160deg, #F3F0FF 0%, #FAFAFA 55%)" }}
    >
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col justify-center h-full px-[8vw]">
        <div className="mb-[3vh]">
          <span className="text-[1.3vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
            DiaGe
          </span>
        </div>

        <h1
          className="text-[5.2vw] font-bold leading-[1.1] tracking-tight text-[#111827]"
          style={{ textWrap: "balance" }}
        >
          A partnership proposal
        </h1>
        <h2 className="mt-[1.5vh] text-[2.4vw] font-normal text-[#374151]">
          for Signet Jewelers
        </h2>

        <div className="mt-[5vh] h-[1px] w-[12vw] bg-[#5B21B6] opacity-40" />

        <div className="mt-[3vh] flex flex-col gap-[0.8vh]">
          <p className="text-[1.6vw] text-[#6B7280]">
            Confidential · Prepared for Signet Jewelers Executive Team
          </p>
          <p className="text-[1.6vw] text-[#6B7280]">June 2026</p>
        </div>

        <p className="mt-[5vh] text-[1.5vw] text-[#9CA3AF]">diage.app</p>
      </div>
    </div>
  );
}
