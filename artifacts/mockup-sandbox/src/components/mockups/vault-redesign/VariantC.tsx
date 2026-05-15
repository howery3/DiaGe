
const PRIMARY = "#5B21B6";
const BG = "#FAFAFA";
const CARD = "#FFFFFF";
const BORDER = "#E8E0F5";
const TEXT = "#1A0F2E";
const MUTED = "#7C6D9A";
const GOLD = "#D4AA3A";

const retailers = [
  { name: "Tiffany & Co.", pieces: 3, wishlist: 2, icon: "🏪", color: "#EDE8FA" },
  { name: "Kay Jewelers", pieces: 2, wishlist: 5, icon: "💍", color: "#EDE8FA" },
  { name: "Zales", pieces: 1, wishlist: 1, icon: "🏪", color: "#EDE8FA" },
];

const insights = [
  { label: "Warranty expiring", value: "1 piece", icon: "⚠️", color: "#FEF3C7", textColor: "#92400E", borderColor: "#FCD34D" },
  { label: "Inspection due", value: "2 pieces", icon: "🔍", color: "#EDE8FA", textColor: PRIMARY, borderColor: "#C4B5FD" },
];

export function VariantC() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: BG, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero header with gradient */}
      <div style={{
        background: `linear-gradient(160deg, #3B0F8C 0%, ${PRIMARY} 50%, #7C3AED 100%)`,
        padding: "44px 20px 32px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: 80, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", top: 20, right: 20, width: 80, height: 80, borderRadius: 40, background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: 60, background: "rgba(255,255,255,0.05)" }} />

        {/* Header top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, position: "relative" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>DiaGe</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>My Collection</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>📄 Report</span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span>⚙️</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, position: "relative" }}>
          {[
            { label: "Pieces", value: "8", icon: "💎" },
            { label: "Wishlist", value: "12", icon: "❤️" },
            { label: "Documents", value: "5", icon: "📁" },
            { label: "Reminders", value: "2", icon: "🔔" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "10px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{s.value}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: 0.3 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: PRIMARY, borderRadius: 14, padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px #5B21B640" }}>
            <span style={{ color: "#fff", fontWeight: 300, fontSize: 18 }}>+</span>
            <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>Add Piece</span>
          </div>
          <div style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🔔</span>
            <span style={{ color: PRIMARY, fontSize: 15, fontWeight: 600 }}>Set Reminder</span>
          </div>
        </div>
      </div>

      {/* Insights / Alerts */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Heads Up</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {insights.map((ins) => (
            <div key={ins.label} style={{ background: ins.color, border: `1px solid ${ins.borderColor}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>{ins.icon}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: ins.textColor }}>{ins.label}</span>
                <span style={{ fontSize: 12, color: ins.textColor, opacity: 0.7, marginLeft: 6 }}>— {ins.value}</span>
              </div>
              <span style={{ color: ins.textColor, fontSize: 16, opacity: 0.6 }}>›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ margin: "16px 20px 0", background: "#F0EBF8", borderRadius: 12, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
        <span style={{ color: MUTED }}>🔍</span>
        <span style={{ color: MUTED, fontSize: 14 }}>Search retailers...</span>
      </div>

      {/* Retailer list */}
      <div style={{ padding: "14px 20px 6px" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.8, textTransform: "uppercase" }}>By Retailer</span>
      </div>
      <div style={{ padding: "8px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {retailers.map((r) => (
          <div key={r.name} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "#EDE8FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {r.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{r.name}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                {r.pieces > 0 && <span style={{ fontSize: 11, color: MUTED }}>💎 {r.pieces} pieces</span>}
                {r.wishlist > 0 && <span style={{ fontSize: 11, color: MUTED }}>❤️ {r.wishlist} wishlist</span>}
              </div>
            </div>
            <span style={{ color: MUTED, fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
