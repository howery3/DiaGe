
const PRIMARY = "#5B21B6";
const PRIMARY_LIGHT = "#EDE8FA";
const BG = "#FAFAFA";
const CARD = "#FFFFFF";
const BORDER = "#E8E0F5";
const TEXT = "#1A0F2E";
const MUTED = "#7C6D9A";

const TYPES = [
  { label: "All", icon: "✨", active: true },
  { label: "Rings", icon: "💍", active: false },
  { label: "Necklaces", icon: "📿", active: false },
  { label: "Watches", icon: "⌚", active: false },
  { label: "Earrings", icon: "🌟", active: false },
];

const pieces = [
  { name: "Engagement Ring", brand: "Tiffany", retailer: "Tiffany & Co.", icon: "💍", bg: "#F5E6FF", warranty: true, price: "$4,200" },
  { name: "Diamond Necklace", brand: "Kay", retailer: "Kay Jewelers", icon: "📿", bg: "#E6F0FF", warranty: false, price: "$1,800" },
  { name: "Gold Bracelet", brand: "Zales", retailer: "Zales", icon: "⌚", bg: "#FFF3E6", warranty: true, price: "$890" },
  { name: "Sapphire Studs", brand: "Helzberg", retailer: "Helzberg", icon: "✨", bg: "#E6FFF0", warranty: true, price: "$650" },
  { name: "Pearl Pendant", brand: "Kay", retailer: "Kay Jewelers", icon: "🌟", bg: "#FFF0F5", warranty: false, price: "$340" },
  { name: "Tennis Bracelet", brand: "Tiffany", retailer: "Tiffany & Co.", icon: "💎", bg: "#F0F5FF", warranty: true, price: "$3,100" },
];

export function VariantB() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: BG, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div style={{ height: 44, background: BG, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>9:41</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 12 }}>●●●</span>
          <span style={{ fontSize: 12 }}>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "8px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: PRIMARY, letterSpacing: -0.5 }}>DiaGe</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>6 pieces across 3 retailers</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ background: PRIMARY_LIGHT, borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: PRIMARY }}>📄 Report</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: "#F0EBF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span>⚙️</span>
          </div>
        </div>
      </div>

      {/* Summary banner */}
      <div style={{ margin: "0 20px 14px", background: `linear-gradient(135deg, ${PRIMARY} 0%, #7C3AED 100%)`, borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>Collection Value</div>
          <div style={{ color: "#fff", fontSize: 26, fontWeight: 800, marginTop: 2 }}>$10,980</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 }}>6 pieces · 4 under warranty</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
            💍
          </div>
        </div>
      </div>

      {/* Type filters */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 14px", overflowX: "auto" }}>
        {TYPES.map((t) => (
          <div key={t.label} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            background: t.active ? PRIMARY : CARD,
            border: `1px solid ${t.active ? PRIMARY : BORDER}`,
            borderRadius: 20, whiteSpace: "nowrap", cursor: "pointer"
          }}>
            <span style={{ fontSize: 13 }}>{t.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: t.active ? "#fff" : TEXT }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* Piece grid */}
      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {pieces.map((p) => (
          <div key={p.name} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                {p.icon}
              </div>
              {p.warranty && (
                <div style={{ background: "#D4AA3A18", border: "1px solid #D4AA3A40", borderRadius: 8, padding: "2px 6px" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#D4AA3A" }}>✓ WARRANTY</span>
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{p.brand}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY }}>{p.price}</div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{ position: "fixed", bottom: 32, right: 24, background: PRIMARY, width: 56, height: 56, borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px #5B21B650", fontSize: 28, color: "#fff", fontWeight: 300 }}>
        +
      </div>
    </div>
  );
}
