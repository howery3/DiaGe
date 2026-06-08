export function StoreSign() {
  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=https://apps.apple.com/app/diage&bgcolor=ffffff&color=000000&margin=10";

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-8">
      <div
        className="relative w-[480px] rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1a0f2e 0%, #0d0b1a 60%)",
          border: "2px dashed rgba(139,92,246,0.45)",
          boxShadow: "0 0 60px rgba(139,92,246,0.15)",
        }}
      >
        {/* Top purple accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]" />

        <div className="px-10 pt-8 pb-10 flex flex-col items-center">
          {/* Icon + wordmark */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <img
              src="/__mockup/diage-icon.png"
              alt="DiaGe icon"
              className="w-16 h-16 rounded-2xl"
              style={{ boxShadow: "0 4px 20px rgba(139,92,246,0.4)" }}
            />
            <p
              className="text-[1.15rem] font-black tracking-[0.35em] text-white uppercase"
              style={{ letterSpacing: "0.35em" }}
            >
              DIAGE
            </p>
          </div>

          {/* QR code box */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{
              background: "#ffffff",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src={qrUrl}
              alt="App Store QR code"
              className="w-[220px] h-[220px] block"
            />
          </div>

          {/* Chevron arrow */}
          <div className="flex flex-col items-center gap-0 mb-5 opacity-70">
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
              <path d="M4 4L16 16L28 4" stroke="#8B5CF6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" style={{ marginTop: -6 }}>
              <path d="M4 4L16 16L28 4" stroke="#8B5CF6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* SCAN ME headline */}
          <h1
            className="text-[3.6rem] font-black text-white leading-none mb-2 tracking-tight"
            style={{ textShadow: "0 2px 20px rgba(139,92,246,0.5)" }}
          >
            SCAN ME
          </h1>

          {/* Subheadline */}
          <p className="text-[0.95rem] font-bold tracking-widest text-[#8B5CF6] uppercase mb-7 text-center">
            &amp; SAY GOODBYE TO YOUR PAPERWORK!
          </p>

          {/* Description box */}
          <div
            className="w-full rounded-xl px-5 py-4 text-center"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="text-[0.78rem] text-[#c4b5fd] leading-relaxed mb-3">
              Are you tired of lugging around your paperwork, digging through
              your folders, and trying to decipher worn away receipts? Well look
              no further! It's time to say GOODBYE to your paperwork, and HELLO
              to DiaGe, your virtual jewelry vault. Track purchases, save
              important details, build wishlists, and share your favorite styles
              with friends and family, right from your phone.
            </p>
            <p className="text-[0.9rem] font-semibold text-[#8B5CF6] tracking-wide">
              diage.app
            </p>
          </div>
        </div>

        {/* Bottom purple accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#7C3AED]" />
      </div>
    </div>
  );
}
