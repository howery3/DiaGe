export default function S09StoreActivation() {
  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://apps.apple.com/app/diage&bgcolor=ffffff&color=000000&margin=6";
  const qrUrlDark =
    "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://apps.apple.com/app/diage&bgcolor=1a0f2e&color=ffffff&margin=6";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <p className="text-[1.2vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          Store activation · zero IT required
        </p>
        <h1
          className="mt-[1vh] text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          DiaGe goes in-store on day one with a print-ready sign that drives downloads from Signet's own sales floor
        </h1>

        {/* Sign previews */}
        <div className="mt-[3vh] flex gap-[4vw] flex-1 items-center justify-center">

          {/* Dark sign */}
          <div className="flex flex-col items-center gap-[1.5vh]">
            <div
              style={{
                width: "18vw",
                aspectRatio: "4/5",
                background: "linear-gradient(160deg, #1a0f2e, #0d0b1a)",
                borderRadius: "1.2vw",
                border: "1px solid rgba(139,92,246,0.3)",
                boxShadow: "0 8px 40px rgba(139,92,246,0.2)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ height: "0.4vh", background: "linear-gradient(90deg,#6D28D9,#8B5CF6,#7C3AED)", flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "2vh 1.5vw 1.5vh", gap: "0.8vh" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3vh" }}>
                  <div style={{ width: "2.2vw", height: "2.2vw", background: "rgba(139,92,246,0.2)", borderRadius: "0.5vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "1.4vw", height: "1.4vw", background: "#8B5CF6", borderRadius: "0.3vw" }} />
                  </div>
                  <p style={{ fontSize: "0.6vw", fontWeight: 900, letterSpacing: "0.3em", color: "#8B5CF6", margin: 0 }}>DIAGE</p>
                </div>
                <div style={{ background: "rgba(139,92,246,0.15)", borderRadius: "0.6vw", padding: "0.6vh 0.6vw" }}>
                  <img src={qrUrl} alt="QR" style={{ width: "5vw", height: "5vw", display: "block", filter: "invert(1)" }} />
                </div>
                <p style={{ fontSize: "1.5vw", fontWeight: 900, color: "white", margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>SCAN ME</p>
                <p style={{ fontSize: "0.5vw", fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, textAlign: "center" }}>YOUR JEWELRY. YOUR STORY.</p>
                <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5vw", padding: "0.5vh 0.8vw", textAlign: "center" }}>
                  <p style={{ fontSize: "0.45vw", color: "#c4b5fd", margin: 0, lineHeight: 1.5 }}>Store photos, warranties, and receipts. Build and share wishlists, and never miss an inspection again.</p>
                  <p style={{ fontSize: "0.55vw", fontWeight: 600, color: "#8B5CF6", margin: "0.3vh 0 0" }}>Download free in the App Store</p>
                </div>
              </div>
              <div style={{ height: "0.4vh", background: "linear-gradient(90deg,#6D28D9,#8B5CF6,#7C3AED)", flexShrink: 0 }} />
            </div>
            <p className="text-[1.1vw] text-[#6B7280] font-medium">Dark variant</p>
          </div>

          {/* Light sign */}
          <div className="flex flex-col items-center gap-[1.5vh]">
            <div
              style={{
                width: "18vw",
                aspectRatio: "4/5",
                background: "#ffffff",
                borderRadius: "1.2vw",
                border: "1px solid rgba(91,33,182,0.15)",
                boxShadow: "0 8px 40px rgba(91,33,182,0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ height: "0.4vh", background: "linear-gradient(90deg,#5B21B6,#7C3AED,#4C1D95)", flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "2vh 1.5vw 1.5vh", gap: "0.8vh" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3vh" }}>
                  <div style={{ width: "2.2vw", height: "2.2vw", background: "rgba(91,33,182,0.1)", borderRadius: "0.5vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "1.4vw", height: "1.4vw", background: "#5B21B6", borderRadius: "0.3vw" }} />
                  </div>
                  <p style={{ fontSize: "0.6vw", fontWeight: 900, letterSpacing: "0.3em", color: "#5B21B6", margin: 0 }}>DIAGE</p>
                </div>
                <div style={{ background: "#f3f0ff", borderRadius: "0.6vw", padding: "0.6vh 0.6vw" }}>
                  <img src={qrUrl} alt="QR" style={{ width: "5vw", height: "5vw", display: "block" }} />
                </div>
                <p style={{ fontSize: "1.5vw", fontWeight: 900, color: "#1a0f2e", margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>SCAN ME</p>
                <p style={{ fontSize: "0.5vw", fontWeight: 700, color: "#5B21B6", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, textAlign: "center" }}>YOUR JEWELRY. YOUR STORY.</p>
                <div style={{ background: "#f3f0ff", border: "1px solid rgba(91,33,182,0.15)", borderRadius: "0.5vw", padding: "0.5vh 0.8vw", textAlign: "center" }}>
                  <p style={{ fontSize: "0.45vw", color: "#4B5563", margin: 0, lineHeight: 1.5 }}>Store photos, warranties, and receipts. Build and share wishlists, and never miss an inspection again.</p>
                  <p style={{ fontSize: "0.55vw", fontWeight: 600, color: "#5B21B6", margin: "0.3vh 0 0" }}>Download free in the App Store</p>
                </div>
              </div>
              <div style={{ height: "0.4vh", background: "linear-gradient(90deg,#4C1D95,#7C3AED,#5B21B6)", flexShrink: 0 }} />
            </div>
            <p className="text-[1.1vw] text-[#6B7280] font-medium">Light variant</p>
          </div>

          {/* Callout */}
          <div className="flex flex-col gap-[2.5vh] w-[22%] flex-shrink-0">
            <div className="flex flex-col gap-[0.8vh]">
              <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">Print-ready</p>
              <p className="text-[1.5vw] text-[#374151] leading-[1.45]">
                8 × 10 format. Both variants export at print resolution and drop into a Signet store without any setup.
              </p>
            </div>
            <div className="flex flex-col gap-[0.8vh] pt-[2vh] border-t border-[#E5E7EB]">
              <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">Zero IT</p>
              <p className="text-[1.5vw] text-[#374151] leading-[1.45]">
                QR code links directly to the App Store. No NFC, no hardware, no IT ticket. Print and place.
              </p>
            </div>
            <div className="flex flex-col gap-[0.8vh] pt-[2vh] border-t border-[#E5E7EB]">
              <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">On-brand</p>
              <p className="text-[1.5vw] text-[#374151] leading-[1.45]">
                Dark and light variants available to match each banner's existing in-store aesthetic.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">9 / 16</p>
        </div>
      </div>
    </div>
  );
}
