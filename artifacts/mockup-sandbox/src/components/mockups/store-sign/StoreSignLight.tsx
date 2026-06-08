export function StoreSignLight() {
  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://apps.apple.com/app/diage&bgcolor=ffffff&color=000000&margin=8";

  return (
    <div className="min-h-screen bg-[#f3f0ff] flex items-center justify-center p-6">
      {/* Card locked to 8×10 ratio: 480×600 */}
      <div
        style={{
          width: 480,
          height: 600,
          background: "#ffffff",
          border: "2px solid rgba(91,33,182,0.2)",
          boxShadow: "0 8px 48px rgba(91,33,182,0.12)",
          borderRadius: 24,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 4, background: "linear-gradient(90deg,#5B21B6,#7C3AED,#4C1D95)", flexShrink: 0 }} />

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 36px 16px" }}>

          {/* Icon + wordmark */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <img
              src="/__mockup/diage-icon.png"
              alt="DiaGe icon"
              style={{ width: 52, height: 52, borderRadius: 14, boxShadow: "0 4px 16px rgba(91,33,182,0.25)" }}
            />
            <p style={{ fontSize: "0.85rem", fontWeight: 900, letterSpacing: "0.35em", color: "#5B21B6", textTransform: "uppercase", margin: 0 }}>
              DIAGE
            </p>
          </div>

          {/* QR code */}
          <div style={{ background: "#f3f0ff", borderRadius: 16, padding: 12, marginBottom: 10, boxShadow: "0 4px 20px rgba(91,33,182,0.15)", border: "1px solid rgba(91,33,182,0.15)" }}>
            <img src={qrUrl} alt="App Store QR code" style={{ width: 180, height: 180, display: "block" }} />
          </div>

          {/* Chevrons */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8, opacity: 0.6 }}>
            <svg width="28" height="16" viewBox="0 0 32 20" fill="none">
              <path d="M4 4L16 16L28 4" stroke="#5B21B6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="28" height="16" viewBox="0 0 32 20" fill="none" style={{ marginTop: -4 }}>
              <path d="M4 4L16 16L28 4" stroke="#5B21B6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* SCAN ME */}
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#1a0f2e", lineHeight: 1, margin: 0, marginBottom: 4, letterSpacing: "-0.02em" }}>
            SCAN ME
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", color: "#5B21B6", textTransform: "uppercase", margin: 0, marginBottom: 12, textAlign: "center" }}>
            &amp; SAY GOODBYE TO YOUR PAPERWORK!
          </p>

          {/* Description box */}
          <div style={{ width: "100%", background: "#f3f0ff", border: "1px solid rgba(91,33,182,0.15)", borderRadius: 12, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ fontSize: "0.65rem", color: "#4B5563", lineHeight: 1.55, margin: 0, marginBottom: 6 }}>
              Are you tired of lugging around your paperwork, digging through your folders, and trying to decipher worn away receipts? Well look no further! It's time to say GOODBYE to your paperwork, and HELLO to DiaGe, your virtual jewelry vault. Track purchases, save important details, build wishlists, and share your favorite styles with friends and family, right from your pocket.
            </p>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#5B21B6", letterSpacing: "0.05em", margin: 0 }}>
              diage.app
            </p>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div style={{ height: 4, background: "linear-gradient(90deg,#4C1D95,#7C3AED,#5B21B6)", flexShrink: 0 }} />
      </div>
    </div>
  );
}
