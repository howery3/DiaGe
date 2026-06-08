export function StoreSign() {
  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://apps.apple.com/app/diage&bgcolor=ffffff&color=000000&margin=8";

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6">
      {/* Card locked to 8×10 ratio: 480×600 */}
      <div
        style={{
          width: 480,
          height: 600,
          background: "linear-gradient(160deg, #1a0f2e 0%, #0d0b1a 60%)",
          border: "2px dashed rgba(139,92,246,0.45)",
          boxShadow: "0 0 60px rgba(139,92,246,0.15)",
          borderRadius: 24,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 4, background: "linear-gradient(90deg,#7C3AED,#8B5CF6,#6D28D9)", flexShrink: 0 }} />

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 36px 16px" }}>

          {/* Icon + wordmark */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <img
              src="/__mockup/diage-icon.png"
              alt="DiaGe icon"
              style={{ width: 52, height: 52, borderRadius: 14, boxShadow: "0 4px 16px rgba(139,92,246,0.45)" }}
            />
            <p style={{ fontSize: "0.85rem", fontWeight: 900, letterSpacing: "0.35em", color: "white", textTransform: "uppercase", margin: 0 }}>
              DIAGE
            </p>
          </div>

          {/* QR code */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 12, marginBottom: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
            <img src={qrUrl} alt="App Store QR code" style={{ width: 180, height: 180, display: "block" }} />
          </div>

          {/* Chevrons */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8, opacity: 0.75 }}>
            <svg width="28" height="16" viewBox="0 0 32 20" fill="none">
              <path d="M4 4L16 16L28 4" stroke="#8B5CF6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="28" height="16" viewBox="0 0 32 20" fill="none" style={{ marginTop: -4 }}>
              <path d="M4 4L16 16L28 4" stroke="#8B5CF6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* SCAN ME */}
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "white", lineHeight: 1, margin: 0, marginBottom: 4, letterSpacing: "-0.02em", textShadow: "0 2px 16px rgba(139,92,246,0.5)" }}>
            SCAN ME
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", color: "#8B5CF6", textTransform: "uppercase", margin: 0, marginBottom: 12, textAlign: "center" }}>
            YOUR JEWELRY. YOUR STORY. ALL IN ONE PLACE.
          </p>

          {/* Description box */}
          <div style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ fontSize: "0.68rem", color: "#c4b5fd", lineHeight: 1.6, margin: 0, marginBottom: 6 }}>
              Download DiaGe to store your jewelry photos, warranties, and receipts. Build wishlists your loved ones can actually find.
            </p>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8B5CF6", letterSpacing: "0.05em", margin: 0 }}>
              Free download · diage.app
            </p>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div style={{ height: 4, background: "linear-gradient(90deg,#6D28D9,#8B5CF6,#7C3AED)", flexShrink: 0 }} />
      </div>
    </div>
  );
}
